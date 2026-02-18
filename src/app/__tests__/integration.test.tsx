import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import DashboardPage from '@/app/dashboard/page';
import {
  savePurchasedCourse,
  getPurchasedCourses,
  clearLocalData,
  type PurchasedCourse
} from '@/lib/storage';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

// Mock Firebase
jest.mock('@/lib/firebase', () => ({
  auth: {},
  signOut: jest.fn(() => Promise.resolve()),
}));

// Mock AuthContext
const mockUseAuth = jest.fn();
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock Skeleton
jest.mock('@/components/Skeleton', () => ({
  DashboardSkeleton: () => <div data-testid="dashboard-skeleton">Loading...</div>,
}));

// Mock courses module
const mockCourses = [
  {
    id: 'fundamentos-da-fe', title: 'Fundamentos da Fé',
    description: 'Estudo das doutrinas essenciais da fé cristã reformada.',
    image: '/images/courses/fundamentos-da-fe.jpg', level: 'Iniciante',
    duration: '8 semanas', startDate: '11 Mai 2026', endDate: '6 Jul 2026',
    status: 'proximo' as const, instructor: 'Rev. João Silva',
    pricePix: 250, priceCard: 275, installments: 3,
    order: 1, published: true, fullDescription: '', totalHours: '',
    format: '', objectives: [], syllabus: [], requirements: [],
  },
  {
    id: 'teologia-sistematica', title: 'Teologia Sistemática',
    description: 'Estudo aprofundado das principais doutrinas cristãs.',
    image: '/images/courses/panorama-biblico.jpg', level: 'Intermediário',
    duration: '12 semanas', startDate: '14 Abr 2026', endDate: '6 Jul 2026',
    status: 'proximo' as const, instructor: 'Dr. Maria Santos',
    pricePix: 380, priceCard: 420, installments: 3,
    order: 2, published: true, fullDescription: '', totalHours: '',
    format: '', objectives: [], syllabus: [], requirements: [],
  },
  {
    id: 'hermeneutica-biblica', title: 'Hermenêutica Bíblica',
    description: 'Princípios e métodos para interpretação das Escrituras.',
    image: '/images/courses/hermeneutica.jpg', level: 'Intermediário',
    duration: '10 semanas', startDate: '20 Jun 2026', endDate: '29 Ago 2026',
    status: 'em-breve' as const, instructor: 'Prof. Pedro Costa',
    pricePix: 320, priceCard: 350, installments: 3,
    order: 3, published: true, fullDescription: '', totalHours: '',
    format: '', objectives: [], syllabus: [], requirements: [],
  },
];

jest.mock('@/lib/courses', () => ({
  getPublishedCourses: jest.fn(() => Promise.resolve(mockCourses)),
  getCourseModules: jest.fn(() => Promise.resolve([])),
}));

// In-memory purchase store for integration tests
let purchaseStore: PurchasedCourse[] = [];

jest.mock('@/lib/storage', () => ({
  savePurchasedCourse: jest.fn(async (_uid: string, purchase: PurchasedCourse) => {
    purchaseStore.push(purchase);
  }),
  getPurchasedCourses: jest.fn(async () => purchaseStore),
  getCompletedLessons: jest.fn(async () => new Set<string>()),
  clearLocalData: jest.fn(() => { purchaseStore = []; }),
  isPurchased: jest.fn(async (_uid: string, courseId: string) => purchaseStore.some(p => p.courseId === courseId)),
}));

describe('Complete User Flow Integration Tests', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    purchaseStore = [];

    mockUseAuth.mockReturnValue({
      user: null,
      userProfile: null,
      loading: false,
      refreshProfile: jest.fn(),
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    jest.clearAllMocks();
  });

  describe('End-to-End User Journey', () => {
    it('should complete full registration → purchase → dashboard flow', async () => {
      const userData = {
        fullName: "João Silva Santos",
        email: "joao.silva@email.com",
        phone: "(11) 98765-4321",
      };

      mockUseAuth.mockReturnValue({
        user: { uid: 'test-uid-1', displayName: 'João Silva Santos' },
        userProfile: userData,
        loading: false,
        refreshProfile: jest.fn(),
      });

      // Verify user data via auth mock
      const authValue = mockUseAuth();
      expect(authValue.userProfile?.fullName).toBe("João Silva Santos");

      // Purchase a course
      await savePurchasedCourse('test-uid-1', {
        courseId: "fundamentos-da-fe",
        purchaseDate: new Date().toISOString(),
        paymentMethod: "pix",
        amount: 250.00,
        status: "paid"
      });

      // Verify purchase is saved
      const purchases = await getPurchasedCourses('test-uid-1');
      expect(purchases).toHaveLength(1);
      expect(purchases[0].courseId).toBe("fundamentos-da-fe");

      // Render dashboard
      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();
      }, { timeout: 2000 });

      await waitFor(() => {
        expect(screen.getByText(/olá, joão!/i)).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText(/fundamentos da fé/i)).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText(/✓ pago/i)).toBeInTheDocument();
      });
    });

    it('should handle multiple course purchases', async () => {
      mockUseAuth.mockReturnValue({
        user: { uid: 'test-uid-2', displayName: 'Maria Silva' },
        userProfile: { fullName: "Maria Silva", email: "maria@email.com" },
        loading: false,
        refreshProfile: jest.fn(),
      });

      await savePurchasedCourse('test-uid-2', {
        courseId: "fundamentos-da-fe",
        purchaseDate: "2026-02-08T10:00:00Z",
        paymentMethod: "pix",
        amount: 250.00,
        status: "paid"
      });

      await savePurchasedCourse('test-uid-2', {
        courseId: "teologia-sistematica",
        purchaseDate: "2026-02-08T11:00:00Z",
        paymentMethod: "cartao",
        amount: 420.00,
        status: "paid"
      });

      const purchases = await getPurchasedCourses('test-uid-2');
      expect(purchases).toHaveLength(2);

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();
      }, { timeout: 2000 });

      await waitFor(() => {
        expect(screen.getByText(/fundamentos da fé/i)).toBeInTheDocument();
        expect(screen.getByText(/teologia sistemática/i)).toBeInTheDocument();
      });

      await waitFor(() => {
        const pagoBadges = screen.getAllByText(/✓ pago/i);
        expect(pagoBadges).toHaveLength(2);
      });
    });

    it('should show empty dashboard for new user', async () => {
      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();
      }, { timeout: 2000 });

      await waitFor(() => {
        expect(screen.getByText(/você ainda não está matriculado em nenhum curso/i)).toBeInTheDocument();
      });

      expect(screen.getAllByText(/cursos disponíveis/i).length).toBeGreaterThan(0);
    });

    it('should clear all data on logout', async () => {
      mockUseAuth.mockReturnValue({
        user: { uid: 'test-uid-4', displayName: 'Ana Souza' },
        userProfile: { fullName: "Ana Souza", email: "ana@email.com" },
        loading: false,
        refreshProfile: jest.fn(),
      });

      await savePurchasedCourse('test-uid-4', {
        courseId: "fundamentos-da-fe",
        purchaseDate: new Date().toISOString(),
        paymentMethod: "pix",
        amount: 250.00,
        status: "paid"
      });

      expect(mockUseAuth().userProfile).not.toBeNull();
      const purchases = await getPurchasedCourses('test-uid-4');
      expect(purchases).toHaveLength(1);

      // Simulate logout
      clearLocalData();
      mockUseAuth.mockReturnValue({
        user: null,
        userProfile: null,
        loading: false,
        refreshProfile: jest.fn(),
      });

      expect(mockUseAuth().userProfile).toBeNull();
      const afterLogout = await getPurchasedCourses('test-uid-4');
      expect(afterLogout).toEqual([]);

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();
      }, { timeout: 2000 });

      await waitFor(() => {
        expect(screen.getByText(/meus cursos/i)).toBeInTheDocument();
        expect(screen.queryByText(/olá/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Data Validation and Edge Cases', () => {
    it('should handle user with special characters in name', async () => {
      mockUseAuth.mockReturnValue({
        user: { uid: 'test-uid-5', displayName: "José D'Angelo Müller" },
        userProfile: { fullName: "José D'Angelo Müller", email: "jose@email.com" },
        loading: false,
        refreshProfile: jest.fn(),
      });

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/olá, josé!/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should maintain purchase order chronologically', async () => {
      await savePurchasedCourse('test-uid-7', {
        courseId: "fundamentos-da-fe",
        purchaseDate: "2026-02-08T10:00:00Z",
        paymentMethod: "pix",
        amount: 250.00,
        status: "paid"
      });

      await savePurchasedCourse('test-uid-7', {
        courseId: "teologia-sistematica",
        purchaseDate: "2026-02-08T12:00:00Z",
        paymentMethod: "cartao",
        amount: 420.00,
        status: "paid"
      });

      await savePurchasedCourse('test-uid-7', {
        courseId: "hermeneutica-biblica",
        purchaseDate: "2026-02-08T14:00:00Z",
        paymentMethod: "pix",
        amount: 320.00,
        status: "paid"
      });

      const purchases = await getPurchasedCourses('test-uid-7');
      expect(purchases).toHaveLength(3);
      expect(purchases[0].courseId).toBe("fundamentos-da-fe");
      expect(purchases[1].courseId).toBe("teologia-sistematica");
      expect(purchases[2].courseId).toBe("hermeneutica-biblica");
    });
  });

  describe('Course Content Access Control', () => {
    it('should allow access to content only after purchase', async () => {
      let purchases = await getPurchasedCourses('test-uid-8');
      expect(purchases.some(p => p.courseId === "fundamentos-da-fe")).toBe(false);

      await savePurchasedCourse('test-uid-8', {
        courseId: "fundamentos-da-fe",
        purchaseDate: new Date().toISOString(),
        paymentMethod: "pix",
        amount: 250.00,
        status: "paid"
      });

      purchases = await getPurchasedCourses('test-uid-8');
      expect(purchases.some(p => p.courseId === "fundamentos-da-fe")).toBe(true);
    });

    it('should track different courses separately', async () => {
      await savePurchasedCourse('test-uid-9', {
        courseId: "fundamentos-da-fe",
        purchaseDate: "2026-02-08T10:00:00Z",
        paymentMethod: "pix",
        amount: 250.00,
        status: "paid"
      });

      await savePurchasedCourse('test-uid-9', {
        courseId: "teologia-sistematica",
        purchaseDate: "2026-02-09T10:00:00Z",
        paymentMethod: "cartao",
        amount: 420.00,
        status: "paid"
      });

      const purchases = await getPurchasedCourses('test-uid-9');

      expect(purchases.find(p => p.courseId === "fundamentos-da-fe")).toBeDefined();
      expect(purchases.find(p => p.courseId === "teologia-sistematica")).toBeDefined();
      expect(purchases.find(p => p.courseId === "hermeneutica-biblica")).toBeUndefined();
    });
  });
});
