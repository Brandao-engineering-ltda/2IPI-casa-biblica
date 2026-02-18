import {
  savePurchasedCourse,
  getPurchasedCourses,
  isPurchased,
  clearLocalData,
  saveUserProfile,
  getUserProfile,
  getCompletedLessons,
  toggleLessonComplete,
  type PurchasedCourse,
  type UserData
} from '../storage';

jest.mock('../firebase', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn(() => Promise.resolve()),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => false, data: () => undefined })),
  getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
  addDoc: jest.fn(() => Promise.resolve({ id: 'mock-doc-id' })),
  collection: jest.fn(),
  serverTimestamp: jest.fn(() => 'mock-timestamp'),
}));

describe('Storage Utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();

    // Reset doc mock to return undefined (prevents leaking mockReturnValue between tests)
    const { doc } = jest.requireMock('firebase/firestore');
    doc.mockReset();
  });

  describe('Purchased Courses Management (Firestore-backed)', () => {
    const uid = 'test-uid-123';

    const mockPurchase1: PurchasedCourse = {
      courseId: "fundamentos-da-fe",
      purchaseDate: "2026-02-08T10:00:00Z",
      paymentMethod: "pix",
      amount: 250.00,
      status: "paid"
    };

    const mockPurchase2: PurchasedCourse = {
      courseId: "teologia-sistematica",
      purchaseDate: "2026-02-08T11:00:00Z",
      paymentMethod: "cartao",
      amount: 420.00,
      status: "paid"
    };

    it('should save a purchased course to Firestore', async () => {
      const { addDoc, collection } = jest.requireMock('firebase/firestore');

      await savePurchasedCourse(uid, mockPurchase1);

      expect(collection).toHaveBeenCalledWith({}, 'users', uid, 'purchases');
      expect(addDoc).toHaveBeenCalled();
    });

    it('should get purchased courses from Firestore', async () => {
      const { getDocs } = jest.requireMock('firebase/firestore');

      getDocs.mockResolvedValueOnce({
        docs: [
          { data: () => mockPurchase1 },
          { data: () => mockPurchase2 },
        ],
      });

      const purchases = await getPurchasedCourses(uid);

      expect(purchases).toHaveLength(2);
      expect(purchases[0]).toEqual(mockPurchase1);
      expect(purchases[1]).toEqual(mockPurchase2);
    });

    it('should return empty array when no purchases exist', async () => {
      const { getDocs } = jest.requireMock('firebase/firestore');
      getDocs.mockResolvedValueOnce({ docs: [] });

      const purchases = await getPurchasedCourses(uid);
      expect(purchases).toEqual([]);
    });

    it('should check if a course is purchased', async () => {
      const { getDocs } = jest.requireMock('firebase/firestore');

      getDocs.mockResolvedValue({
        docs: [{ data: () => mockPurchase1 }],
      });

      expect(await isPurchased(uid, "fundamentos-da-fe")).toBe(true);
    });

    it('should fall back to localStorage when Firestore is unavailable', async () => {
      const { getDocs } = jest.requireMock('firebase/firestore');
      getDocs.mockRejectedValueOnce(new Error('Firestore offline'));

      localStorage.setItem(
        `casa_biblica_purchases_${uid}`,
        JSON.stringify([mockPurchase1])
      );

      const purchases = await getPurchasedCourses(uid);
      expect(purchases).toHaveLength(1);
      expect(purchases[0].courseId).toBe('fundamentos-da-fe');
    });
  });

  describe('Clear Local Data', () => {
    it('should clear lesson progress and legacy key from localStorage', () => {
      localStorage.setItem('casa_biblica_lesson_progress', '{}');
      localStorage.setItem('casa_biblica_purchased_courses', '[]');

      clearLocalData();

      expect(localStorage.getItem('casa_biblica_lesson_progress')).toBeNull();
      expect(localStorage.getItem('casa_biblica_purchased_courses')).toBeNull();
    });

    it('should not throw error when clearing empty storage', () => {
      expect(() => clearLocalData()).not.toThrow();
    });
  });

  describe('saveUserProfile', () => {
    it('should call setDoc with correct arguments and merge option', async () => {
      const { doc, setDoc, serverTimestamp } = jest.requireMock('firebase/firestore');
      const { db } = jest.requireMock('../firebase');

      const mockUserData: UserData = {
        fullName: 'João Silva',
        email: 'joao@example.com',
        phone: '44999999999',
      };

      const mockDocRef = { id: 'user-123' };
      doc.mockReturnValue(mockDocRef);

      await saveUserProfile('user-123', mockUserData);

      expect(doc).toHaveBeenCalledWith(db, 'users', 'user-123');
      expect(setDoc).toHaveBeenCalledWith(
        mockDocRef,
        {
          ...mockUserData,
          createdAt: 'mock-timestamp',
        },
        { merge: true }
      );
      expect(serverTimestamp).toHaveBeenCalled();
    });
  });

  describe('getUserProfile', () => {
    it('should return UserData when document exists', async () => {
      const { doc, getDoc } = jest.requireMock('firebase/firestore');
      const { db } = jest.requireMock('../firebase');

      const mockData: UserData = {
        fullName: 'Maria Santos',
        email: 'maria@example.com',
      };
      const mockDocRef = { id: 'user-789' };
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockData,
      });

      const result = await getUserProfile('user-789');

      expect(doc).toHaveBeenCalledWith(db, 'users', 'user-789');
      expect(result).toEqual(mockData);
    });

    it('should return null when document does not exist', async () => {
      const { doc, getDoc } = jest.requireMock('firebase/firestore');

      doc.mockReturnValue({});
      getDoc.mockResolvedValue({
        exists: () => false,
        data: () => undefined,
      });

      const result = await getUserProfile('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('toggleLessonComplete (Firestore-backed)', () => {
    const uid = 'test-uid-456';

    it('should mark a lesson as complete and return true', async () => {
      const { getDoc } = jest.requireMock('firebase/firestore');
      getDoc.mockResolvedValueOnce({ exists: () => false, data: () => undefined });

      const result = await toggleLessonComplete(uid, 'curso-1', 'licao-1');
      expect(result).toBe(true);
    });

    it('should unmark a lesson when toggled again and return false', async () => {
      const { getDoc } = jest.requireMock('firebase/firestore');

      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ completedLessons: ['licao-1'] }),
      });
      const result = await toggleLessonComplete(uid, 'curso-1', 'licao-1');
      expect(result).toBe(false);
    });

    it('should save to Firestore', async () => {
      const { setDoc, getDoc } = jest.requireMock('firebase/firestore');
      getDoc.mockResolvedValueOnce({ exists: () => false, data: () => undefined });

      await toggleLessonComplete(uid, 'curso-1', 'licao-1');

      expect(setDoc).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({
          completedLessons: ['licao-1'],
          lastAccessed: 'mock-timestamp',
        }),
        { merge: true }
      );
    });
  });

  describe('getCompletedLessons (Firestore-backed)', () => {
    const uid = 'test-uid-789';

    it('should return completed lessons from Firestore', async () => {
      const { getDoc } = jest.requireMock('firebase/firestore');

      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ completedLessons: ['licao-1', 'licao-2'] }),
      });

      const completed = await getCompletedLessons(uid, 'curso-1');
      expect(completed.has('licao-1')).toBe(true);
      expect(completed.has('licao-2')).toBe(true);
      expect(completed.has('licao-3')).toBe(false);
    });

    it('should return empty set when no progress exists', async () => {
      const { getDoc } = jest.requireMock('firebase/firestore');

      getDoc.mockResolvedValueOnce({
        exists: () => false,
        data: () => undefined,
      });

      const completed = await getCompletedLessons(uid, 'curso-1');
      expect(completed.size).toBe(0);
    });

    it('should fall back to localStorage when Firestore is unavailable', async () => {
      const { getDoc } = jest.requireMock('firebase/firestore');
      getDoc.mockRejectedValueOnce(new Error('Firestore offline'));

      localStorage.setItem(
        'casa_biblica_lesson_progress',
        JSON.stringify({ [`${uid}:curso-1`]: ['licao-1'] })
      );

      const completed = await getCompletedLessons(uid, 'curso-1');
      expect(completed.has('licao-1')).toBe(true);
    });
  });
});
