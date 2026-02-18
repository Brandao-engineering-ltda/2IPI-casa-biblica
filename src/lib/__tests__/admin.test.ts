import {
  getAdminEmails,
  isAdminEmail,
  checkAndSetAdminRole,
  updateAdminEmails,
  getEnrollmentsByCourse,
} from '../admin';

jest.mock('../firebase', () => ({ db: {} }));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => false, data: () => undefined })),
  getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
  setDoc: jest.fn(() => Promise.resolve()),
  collectionGroup: jest.fn(),
}));

jest.mock('../courses', () => ({
  getAllCourses: jest.fn(() => Promise.resolve([])),
}));

describe('Admin Utilities', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    delete process.env.NEXT_PUBLIC_ADMIN_EMAILS;

    // Reset mocks to default behavior
    const { doc, getDoc, getDocs, setDoc, collectionGroup } = jest.requireMock('firebase/firestore');
    doc.mockReset();
    getDoc.mockReset().mockResolvedValue({ exists: () => false, data: () => undefined });
    getDocs.mockReset().mockResolvedValue({ docs: [] });
    setDoc.mockReset().mockResolvedValue(undefined);
    collectionGroup.mockReset();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('getAdminEmails', () => {
    it('should return emails from Firestore when config/admin doc exists', async () => {
      const { doc, getDoc } = jest.requireMock('firebase/firestore');
      const { db } = jest.requireMock('../firebase');

      const mockDocRef = { id: 'admin' };
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ adminEmails: ['admin@church.org', 'pastor@church.org'] }),
      });

      const emails = await getAdminEmails();

      expect(doc).toHaveBeenCalledWith(db, 'config', 'admin');
      expect(getDoc).toHaveBeenCalledWith(mockDocRef);
      expect(emails).toEqual(['admin@church.org', 'pastor@church.org']);
    });

    it('should return empty array when Firestore doc exists but adminEmails is missing', async () => {
      const { getDoc } = jest.requireMock('firebase/firestore');

      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({}),
      });

      const emails = await getAdminEmails();

      expect(emails).toEqual([]);
    });

    it('should fall back to env var when Firestore doc does not exist', async () => {
      const { getDoc } = jest.requireMock('firebase/firestore');

      getDoc.mockResolvedValue({
        exists: () => false,
        data: () => undefined,
      });

      process.env.NEXT_PUBLIC_ADMIN_EMAILS = 'Admin@Example.com, pastor@church.org ';

      const emails = await getAdminEmails();

      expect(emails).toEqual(['admin@example.com', 'pastor@church.org']);
    });

    it('should fall back to env var when Firestore throws an error', async () => {
      const { getDoc } = jest.requireMock('firebase/firestore');

      getDoc.mockRejectedValue(new Error('Firestore unavailable'));

      process.env.NEXT_PUBLIC_ADMIN_EMAILS = 'fallback@church.org';

      const emails = await getAdminEmails();

      expect(emails).toEqual(['fallback@church.org']);
    });

    it('should return empty array when both Firestore and env var are unavailable', async () => {
      const { getDoc } = jest.requireMock('firebase/firestore');

      getDoc.mockResolvedValue({
        exists: () => false,
        data: () => undefined,
      });

      const emails = await getAdminEmails();

      expect(emails).toEqual([]);
    });

    it('should trim and lowercase env var emails', async () => {
      const { getDoc } = jest.requireMock('firebase/firestore');

      getDoc.mockResolvedValue({
        exists: () => false,
        data: () => undefined,
      });

      process.env.NEXT_PUBLIC_ADMIN_EMAILS = '  ADMIN@CHURCH.ORG  ,  Pastor@Church.Org  ';

      const emails = await getAdminEmails();

      expect(emails).toEqual(['admin@church.org', 'pastor@church.org']);
    });
  });

  describe('isAdminEmail', () => {
    it('should return true for an email in the admin whitelist', async () => {
      const { doc, getDoc } = jest.requireMock('firebase/firestore');

      doc.mockReturnValue({ id: 'admin' });
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ adminEmails: ['admin@church.org', 'pastor@church.org'] }),
      });

      const result = await isAdminEmail('admin@church.org');

      expect(result).toBe(true);
    });

    it('should return false for an email not in the admin whitelist', async () => {
      const { doc, getDoc } = jest.requireMock('firebase/firestore');

      doc.mockReturnValue({ id: 'admin' });
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ adminEmails: ['admin@church.org'] }),
      });

      const result = await isAdminEmail('user@example.com');

      expect(result).toBe(false);
    });

    it('should be case insensitive when checking emails', async () => {
      const { doc, getDoc } = jest.requireMock('firebase/firestore');

      doc.mockReturnValue({ id: 'admin' });
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ adminEmails: ['admin@church.org'] }),
      });

      const result = await isAdminEmail('ADMIN@CHURCH.ORG');

      expect(result).toBe(true);
    });

    it('should return false when whitelist is empty', async () => {
      const { getDoc } = jest.requireMock('firebase/firestore');

      getDoc.mockResolvedValue({
        exists: () => false,
        data: () => undefined,
      });

      const result = await isAdminEmail('anyone@example.com');

      expect(result).toBe(false);
    });
  });

  describe('checkAndSetAdminRole', () => {
    it('should set admin role and return true when email is in whitelist', async () => {
      const { doc, getDoc, setDoc } = jest.requireMock('firebase/firestore');

      const configDocRef = { id: 'admin-config' };
      const userDocRef = { id: 'user-doc' };

      doc.mockImplementation((_db: unknown, collection: string, docId: string) => {
        if (collection === 'config' && docId === 'admin') return configDocRef;
        if (collection === 'users') return userDocRef;
        return {};
      });

      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ adminEmails: ['admin@church.org'] }),
      });

      const result = await checkAndSetAdminRole('uid-123', 'admin@church.org');

      expect(result).toBe(true);
      expect(setDoc).toHaveBeenCalledWith(
        userDocRef,
        { role: 'admin' },
        { merge: true }
      );
    });

    it('should set user role and return false when email is not in whitelist', async () => {
      const { doc, getDoc, setDoc } = jest.requireMock('firebase/firestore');

      const configDocRef = { id: 'admin-config' };
      const userDocRef = { id: 'user-doc' };

      doc.mockImplementation((_db: unknown, collection: string, docId: string) => {
        if (collection === 'config' && docId === 'admin') return configDocRef;
        if (collection === 'users') return userDocRef;
        return {};
      });

      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ adminEmails: ['admin@church.org'] }),
      });

      const result = await checkAndSetAdminRole('uid-456', 'regular@example.com');

      expect(result).toBe(false);
      expect(setDoc).toHaveBeenCalledWith(
        userDocRef,
        { role: 'user' },
        { merge: true }
      );
    });

    it('should call setDoc with the correct user doc reference', async () => {
      const { doc, getDoc, setDoc } = jest.requireMock('firebase/firestore');
      const { db } = jest.requireMock('../firebase');

      const configDocRef = { id: 'admin-config' };
      const userDocRef = { id: 'user-doc' };

      doc.mockImplementation((_db: unknown, collection: string, docId: string) => {
        if (collection === 'config' && docId === 'admin') return configDocRef;
        if (collection === 'users' && docId === 'uid-789') return userDocRef;
        return {};
      });

      getDoc.mockResolvedValue({
        exists: () => false,
        data: () => undefined,
      });

      await checkAndSetAdminRole('uid-789', 'someone@example.com');

      expect(doc).toHaveBeenCalledWith(db, 'users', 'uid-789');
      expect(setDoc).toHaveBeenCalledTimes(1);
    });

    it('should handle case-insensitive email matching for admin role', async () => {
      const { doc, getDoc, setDoc } = jest.requireMock('firebase/firestore');

      const configDocRef = { id: 'admin-config' };
      const userDocRef = { id: 'user-doc' };

      doc.mockImplementation((_db: unknown, collection: string, docId: string) => {
        if (collection === 'config' && docId === 'admin') return configDocRef;
        if (collection === 'users') return userDocRef;
        return {};
      });

      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ adminEmails: ['admin@church.org'] }),
      });

      const result = await checkAndSetAdminRole('uid-100', 'ADMIN@CHURCH.ORG');

      expect(result).toBe(true);
      expect(setDoc).toHaveBeenCalledWith(
        userDocRef,
        { role: 'admin' },
        { merge: true }
      );
    });
  });

  describe('updateAdminEmails', () => {
    it('should call setDoc with lowercase emails on config/admin doc', async () => {
      const { doc, setDoc } = jest.requireMock('firebase/firestore');
      const { db } = jest.requireMock('../firebase');

      const mockDocRef = { id: 'admin' };
      doc.mockReturnValue(mockDocRef);

      await updateAdminEmails(['Admin@Church.Org', 'PASTOR@CHURCH.ORG']);

      expect(doc).toHaveBeenCalledWith(db, 'config', 'admin');
      expect(setDoc).toHaveBeenCalledWith(mockDocRef, {
        adminEmails: ['admin@church.org', 'pastor@church.org'],
      });
    });

    it('should trim whitespace from emails', async () => {
      const { doc, setDoc } = jest.requireMock('firebase/firestore');

      doc.mockReturnValue({ id: 'admin' });

      await updateAdminEmails(['  admin@church.org  ', '  pastor@church.org ']);

      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        {
          adminEmails: ['admin@church.org', 'pastor@church.org'],
        }
      );
    });

    it('should handle an empty email array', async () => {
      const { doc, setDoc } = jest.requireMock('firebase/firestore');

      doc.mockReturnValue({ id: 'admin' });

      await updateAdminEmails([]);

      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        { adminEmails: [] }
      );
    });

    it('should call setDoc exactly once', async () => {
      const { doc, setDoc } = jest.requireMock('firebase/firestore');

      doc.mockReturnValue({ id: 'admin' });

      await updateAdminEmails(['test@example.com']);

      expect(setDoc).toHaveBeenCalledTimes(1);
    });
  });

  describe('getEnrollmentsByCourse', () => {
    it('should return empty array when no purchases exist', async () => {
      const { getDocs, collectionGroup } = jest.requireMock('firebase/firestore');
      const { getAllCourses } = jest.requireMock('../courses');

      collectionGroup.mockReturnValue('purchases-group');
      getDocs.mockResolvedValue({ docs: [] });
      getAllCourses.mockResolvedValue([]);

      const result = await getEnrollmentsByCourse();

      expect(result).toEqual([]);
      expect(collectionGroup).toHaveBeenCalledWith({}, 'purchases');
    });

    it('should group purchases by courseId and fetch user profiles', async () => {
      const { doc, getDoc, getDocs, collectionGroup } = jest.requireMock('firebase/firestore');
      const { getAllCourses } = jest.requireMock('../courses');

      collectionGroup.mockReturnValue('purchases-group');

      // Mock purchases from two users
      getDocs.mockResolvedValue({
        docs: [
          {
            ref: { path: 'users/uid-1/purchases/p1' },
            data: () => ({
              courseId: 'fundamentos-da-fe',
              purchaseDate: '2026-02-10T10:00:00Z',
              paymentMethod: 'pix',
              amount: 250,
              status: 'paid',
            }),
          },
          {
            ref: { path: 'users/uid-2/purchases/p2' },
            data: () => ({
              courseId: 'fundamentos-da-fe',
              purchaseDate: '2026-02-11T10:00:00Z',
              paymentMethod: 'cartao',
              amount: 275,
              status: 'paid',
            }),
          },
        ],
      });

      // Mock user profile lookups
      doc.mockReturnValue({});
      getDoc.mockImplementation(() =>
        Promise.resolve({
          exists: () => true,
          data: () => ({ fullName: 'Test User', email: 'test@email.com', phone: '123' }),
        })
      );

      getAllCourses.mockResolvedValue([
        { id: 'fundamentos-da-fe', title: 'Fundamentos da Fé' },
      ]);

      const result = await getEnrollmentsByCourse();

      expect(result).toHaveLength(1);
      expect(result[0].courseId).toBe('fundamentos-da-fe');
      expect(result[0].courseTitle).toBe('Fundamentos da Fé');
      expect(result[0].enrollments).toHaveLength(2);
    });

    it('should handle missing user profiles gracefully', async () => {
      const { doc, getDoc, getDocs, collectionGroup } = jest.requireMock('firebase/firestore');
      const { getAllCourses } = jest.requireMock('../courses');

      collectionGroup.mockReturnValue('purchases-group');
      getDocs.mockResolvedValue({
        docs: [
          {
            ref: { path: 'users/uid-1/purchases/p1' },
            data: () => ({
              courseId: 'hermeneutica',
              purchaseDate: '2026-03-01T10:00:00Z',
              paymentMethod: 'pix',
              amount: 0,
              status: 'paid',
            }),
          },
        ],
      });

      doc.mockReturnValue({});
      getDoc.mockResolvedValue({ exists: () => false, data: () => ({}) });

      getAllCourses.mockResolvedValue([
        { id: 'hermeneutica', title: 'Hermenêutica Bíblica' },
      ]);

      const result = await getEnrollmentsByCourse();

      expect(result).toHaveLength(1);
      expect(result[0].enrollments[0].fullName).toBe('');
      expect(result[0].enrollments[0].email).toBe('');
    });
  });
});
