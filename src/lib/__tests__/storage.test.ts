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
  getDoc: jest.fn(),
  serverTimestamp: jest.fn(() => 'mock-timestamp'),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Storage Utilities', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('Purchased Courses Management', () => {
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

    it('should save a purchased course', () => {
      savePurchasedCourse(mockPurchase1);

      const purchases = getPurchasedCourses();
      expect(purchases).toHaveLength(1);
      expect(purchases[0]).toEqual(mockPurchase1);
    });

    it('should save multiple purchased courses', () => {
      savePurchasedCourse(mockPurchase1);
      savePurchasedCourse(mockPurchase2);

      const purchases = getPurchasedCourses();
      expect(purchases).toHaveLength(2);
      expect(purchases[0]).toEqual(mockPurchase1);
      expect(purchases[1]).toEqual(mockPurchase2);
    });

    it('should return empty array when no purchases exist', () => {
      const purchases = getPurchasedCourses();
      expect(purchases).toEqual([]);
    });

    it('should check if a course is purchased', () => {
      savePurchasedCourse(mockPurchase1);

      expect(isPurchased("fundamentos-da-fe")).toBe(true);
      expect(isPurchased("teologia-sistematica")).toBe(false);
    });

    it('should maintain purchase history', () => {
      savePurchasedCourse(mockPurchase1);
      savePurchasedCourse(mockPurchase2);

      const purchases = getPurchasedCourses();
      expect(purchases).toHaveLength(2);

      // Verify all purchases are maintained
      const courseIds = purchases.map(p => p.courseId);
      expect(courseIds).toContain("fundamentos-da-fe");
      expect(courseIds).toContain("teologia-sistematica");
    });
  });

  describe('Clear Local Data', () => {
    const mockPurchase: PurchasedCourse = {
      courseId: "fundamentos-da-fe",
      purchaseDate: "2026-02-08T10:00:00Z",
      paymentMethod: "pix",
      amount: 250.00,
      status: "paid"
    };

    it('should clear courses and lessons from localStorage', () => {
      // Set up data
      savePurchasedCourse(mockPurchase);

      // Verify data exists
      expect(getPurchasedCourses()).toHaveLength(1);

      // Clear local data
      clearLocalData();

      // Verify courses are cleared
      expect(getPurchasedCourses()).toEqual([]);
    });

    it('should not throw error when clearing empty storage', () => {
      expect(() => clearLocalData()).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty purchased courses array', () => {
      localStorage.setItem('casa_biblica_purchased_courses', '[]');

      const purchases = getPurchasedCourses();
      expect(purchases).toEqual([]);
      expect(isPurchased("any-course")).toBe(false);
    });
  });

  describe('saveUserProfile', () => {
    const { doc, setDoc, serverTimestamp } = jest.requireMock('firebase/firestore');
    const { db } = jest.requireMock('../firebase');

    const mockUserData: UserData = {
      nomeCompleto: 'João Silva',
      email: 'joao@example.com',
      telefone: '44999999999',
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call setDoc with correct arguments and merge option', async () => {
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

    it('should resolve without error on success', async () => {
      doc.mockReturnValue({});
      setDoc.mockResolvedValue(undefined);

      await expect(saveUserProfile('user-456', mockUserData)).resolves.toBeUndefined();
    });
  });

  describe('getUserProfile', () => {
    const { doc, getDoc } = jest.requireMock('firebase/firestore');
    const { db } = jest.requireMock('../firebase');

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return UserData when document exists', async () => {
      const mockData: UserData = {
        nomeCompleto: 'Maria Santos',
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
      expect(getDoc).toHaveBeenCalledWith(mockDocRef);
      expect(result).toEqual(mockData);
    });

    it('should return null when document does not exist', async () => {
      const mockDocRef = { id: 'nonexistent' };
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue({
        exists: () => false,
        data: () => undefined,
      });

      const result = await getUserProfile('nonexistent');

      expect(doc).toHaveBeenCalledWith(db, 'users', 'nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('toggleLessonComplete', () => {
    it('should mark a lesson as complete and return true', () => {
      const result = toggleLessonComplete('curso-1', 'licao-1');

      expect(result).toBe(true);

      const completed = getCompletedLessons('curso-1');
      expect(completed.has('licao-1')).toBe(true);
    });

    it('should unmark a lesson when toggled again and return false', () => {
      // First toggle: mark as complete
      toggleLessonComplete('curso-1', 'licao-1');

      // Second toggle: unmark
      const result = toggleLessonComplete('curso-1', 'licao-1');

      expect(result).toBe(false);

      const completed = getCompletedLessons('curso-1');
      expect(completed.has('licao-1')).toBe(false);
    });

    it('should track lessons independently per course', () => {
      toggleLessonComplete('curso-1', 'licao-1');
      toggleLessonComplete('curso-2', 'licao-1');

      const completedCourse1 = getCompletedLessons('curso-1');
      const completedCourse2 = getCompletedLessons('curso-2');

      expect(completedCourse1.has('licao-1')).toBe(true);
      expect(completedCourse2.has('licao-1')).toBe(true);
    });

    it('should persist lesson progress to localStorage', () => {
      toggleLessonComplete('curso-1', 'licao-1');
      toggleLessonComplete('curso-1', 'licao-2');

      const raw = localStorage.getItem('casa_biblica_lesson_progress');
      expect(raw).not.toBeNull();

      const parsed = JSON.parse(raw!);
      expect(parsed['curso-1']).toEqual(expect.arrayContaining(['licao-1', 'licao-2']));
    });
  });

  describe('clearLocalData (courses and lessons)', () => {
    it('should remove both purchased courses and lesson progress keys', () => {
      // Set up both types of data
      savePurchasedCourse({
        courseId: 'curso-1',
        purchaseDate: '2026-02-08T10:00:00Z',
        paymentMethod: 'pix',
        amount: 100,
        status: 'paid',
      });
      toggleLessonComplete('curso-1', 'licao-1');

      // Verify both keys exist
      expect(localStorage.getItem('casa_biblica_purchased_courses')).not.toBeNull();
      expect(localStorage.getItem('casa_biblica_lesson_progress')).not.toBeNull();

      clearLocalData();

      // Verify both keys are removed
      expect(localStorage.getItem('casa_biblica_purchased_courses')).toBeNull();
      expect(localStorage.getItem('casa_biblica_lesson_progress')).toBeNull();
    });
  });
});
