import {
  savePurchasedCourse,
  getPurchasedCourses,
  isPurchased,
  clearLocalData,
  type PurchasedCourse
} from '../storage';

jest.mock('../firebase', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  serverTimestamp: jest.fn(),
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
});
