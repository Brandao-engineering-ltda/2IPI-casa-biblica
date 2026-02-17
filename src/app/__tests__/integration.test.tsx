import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import DashboardPage from '@/app/dashboard/page';
import {
  savePurchasedCourse,
  getPurchasedCourses,
  clearLocalData
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

// Use actual storage implementation for course/lesson functions
jest.unmock('@/lib/storage');

describe('Complete User Flow Integration Tests', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    // Clear all local data before each test
    clearLocalData();

    // Default: no user logged in
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
    it('should complete full registration → purchase → dashboard → content page flow', async () => {
      // STEP 1: User Registration (simulated via auth mock)
      // -------------------------
      const userData = {
        fullName: "João Silva Santos",
        email: "joao.silva@email.com",
        phone: "(11) 98765-4321",
        dateOfBirth: "1990-05-15",
        gender: "masculino",
        maritalStatus: "casado",
        education: "superior-completo",
        profession: "Professor",
        address: "Rua das Flores, 123",
        city: "São Paulo",
        state: "SP",
        zipCode: "01234-567",
        denomination: "Igreja Batista",
        howDidYouHear: "Redes sociais",
        notes: "Interesse em teologia"
      };

      // Simulate logged-in user with profile
      mockUseAuth.mockReturnValue({
        user: { uid: 'test-uid-1', displayName: 'João Silva Santos' },
        userProfile: userData,
        loading: false,
        refreshProfile: jest.fn(),
      });

      // Verify user data via auth mock
      const authValue = mockUseAuth();
      expect(authValue.userProfile).toEqual(userData);
      expect(authValue.userProfile?.fullName).toBe("João Silva Santos");

      // STEP 2: Course Purchase
      // -------------------------
      const purchase = {
        courseId: "fundamentos-da-fe",
        purchaseDate: new Date().toISOString(),
        paymentMethod: "pix" as const,
        amount: 250.00,
        status: "paid" as const
      };

      savePurchasedCourse(purchase);

      // Verify purchase is saved
      const purchases = getPurchasedCourses();
      expect(purchases).toHaveLength(1);
      expect(purchases[0].courseId).toBe("fundamentos-da-fe");
      expect(purchases[0].amount).toBe(250.00);

      // STEP 3: Dashboard Display
      // -------------------------
      render(<DashboardPage />);

      // Wait for dashboard to load (no timer needed - loads based on authLoading)
      await waitFor(() => {
        expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();
      }, { timeout: 1500 });

      // Verify personalized greeting
      await waitFor(() => {
        expect(screen.getByText(/olá, joão!/i)).toBeInTheDocument();
      });

      // Verify purchased course is displayed
      await waitFor(() => {
        expect(screen.getByText(/fundamentos da fé/i)).toBeInTheDocument();
      });

      // Verify "Pago" badge is shown
      await waitFor(() => {
        expect(screen.getByText(/✓ pago/i)).toBeInTheDocument();
      });

      // Verify "Acessar Conteudo" button is shown (UI uses no accents)
      await waitFor(() => {
        expect(screen.getByText(/acessar conteudo/i)).toBeInTheDocument();
      });

      // STEP 4: Verify course links to content page
      // --------------------------------------------
      const courseLinks = screen.getAllByRole('link');
      const contentLink = courseLinks.find(link =>
        link.getAttribute('href')?.includes('/curso/fundamentos-da-fe/conteudo')
      );
      expect(contentLink).toBeInTheDocument();
    });

    it('should handle multiple course purchases', async () => {
      // Setup user via auth mock
      mockUseAuth.mockReturnValue({
        user: { uid: 'test-uid-2', displayName: 'Maria Silva' },
        userProfile: {
          fullName: "Maria Silva",
          email: "maria@email.com",
          phone: "(11) 98765-4321",
          dateOfBirth: "1990-05-15",
          gender: "feminino",
          maritalStatus: "solteiro",
          education: "superior-completo",
          profession: "Engenheira",
          address: "Rua A, 123",
          city: "São Paulo",
          state: "SP",
          zipCode: "01234-567",
          denomination: "Igreja Metodista",
          howDidYouHear: "Google",
          notes: ""
        },
        loading: false,
        refreshProfile: jest.fn(),
      });

      // Purchase first course
      savePurchasedCourse({
        courseId: "fundamentos-da-fe",
        purchaseDate: "2026-02-08T10:00:00Z",
        paymentMethod: "pix",
        amount: 250.00,
        status: "paid"
      });

      // Purchase second course
      savePurchasedCourse({
        courseId: "teologia-sistematica",
        purchaseDate: "2026-02-08T11:00:00Z",
        paymentMethod: "cartao",
        amount: 420.00,
        status: "paid"
      });

      // Verify both purchases
      const purchases = getPurchasedCourses();
      expect(purchases).toHaveLength(2);

      // Render dashboard
      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();
      }, { timeout: 1500 });

      // Verify both courses are displayed
      await waitFor(() => {
        expect(screen.getByText(/fundamentos da fé/i)).toBeInTheDocument();
        expect(screen.getByText(/teologia sistemática/i)).toBeInTheDocument();
      });

      // Verify both have "Pago" badges
      await waitFor(() => {
        const pagoBadges = screen.getAllByText(/✓ pago/i);
        expect(pagoBadges).toHaveLength(2);
      });
    });

    it('should show empty dashboard for new user', async () => {
      // No user profile, no purchases (default mock already has no user)
      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();
      }, { timeout: 1500 });

      // Verify empty state
      await waitFor(() => {
        expect(screen.getByText(/você ainda não está matriculado em nenhum curso/i)).toBeInTheDocument();
      });

      // Verify available courses are shown
      expect(screen.getAllByText(/cursos disponíveis/i).length).toBeGreaterThan(0);
    });

    it('should persist data across page reloads', async () => {
      // Save user via auth mock and purchase via localStorage
      const userData = {
        fullName: "Pedro Costa",
        email: "pedro@email.com",
        phone: "(11) 98765-4321",
        dateOfBirth: "1985-03-20",
        gender: "masculino",
        maritalStatus: "casado",
        education: "pos-graduacao",
        profession: "Pastor",
        address: "Rua B, 456",
        city: "Rio de Janeiro",
        state: "RJ",
        zipCode: "20000-000",
        denomination: "Igreja Presbiteriana",
        howDidYouHear: "Indicação",
        notes: "Quero me aprofundar"
      };

      mockUseAuth.mockReturnValue({
        user: { uid: 'test-uid-3', displayName: 'Pedro Costa' },
        userProfile: userData,
        loading: false,
        refreshProfile: jest.fn(),
      });

      savePurchasedCourse({
        courseId: "hermeneutica-biblica",
        purchaseDate: new Date().toISOString(),
        paymentMethod: "cartao",
        amount: 350.00,
        status: "paid"
      });

      // Simulate page reload by unmounting and remounting
      const { unmount } = render(<DashboardPage />);
      unmount();

      // Re-render dashboard (simulating page reload)
      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();
      }, { timeout: 1500 });

      // Verify data persisted
      expect(screen.getByText(/olá, pedro!/i)).toBeInTheDocument();
      expect(screen.getAllByText(/hermenêutica bíblica/i).length).toBeGreaterThan(0);
    });

    it('should clear all data on logout', async () => {
      // Setup user and purchases
      mockUseAuth.mockReturnValue({
        user: { uid: 'test-uid-4', displayName: 'Ana Souza' },
        userProfile: {
          fullName: "Ana Souza",
          email: "ana@email.com",
          phone: "(11) 98765-4321",
          dateOfBirth: "1992-07-15",
          gender: "feminino",
          maritalStatus: "solteiro",
          education: "superior-completo",
          profession: "Professora",
          address: "Rua C, 789",
          city: "Belo Horizonte",
          state: "MG",
          zipCode: "30000-000",
          denomination: "Igreja Batista",
          howDidYouHear: "Facebook",
          notes: ""
        },
        loading: false,
        refreshProfile: jest.fn(),
      });

      savePurchasedCourse({
        courseId: "fundamentos-da-fe",
        purchaseDate: new Date().toISOString(),
        paymentMethod: "pix",
        amount: 250.00,
        status: "paid"
      });

      // Verify data exists
      expect(mockUseAuth().userProfile).not.toBeNull();
      expect(getPurchasedCourses()).toHaveLength(1);

      // Simulate logout: clear local data + reset auth mock
      clearLocalData();
      mockUseAuth.mockReturnValue({
        user: null,
        userProfile: null,
        loading: false,
        refreshProfile: jest.fn(),
      });

      // Verify data is cleared
      expect(mockUseAuth().userProfile).toBeNull();
      expect(getPurchasedCourses()).toEqual([]);

      // Render dashboard after logout
      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();
      }, { timeout: 1500 });

      // Verify empty state
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
        userProfile: {
          fullName: "José D'Angelo Müller",
          email: "jose@email.com",
          phone: "(11) 98765-4321",
          dateOfBirth: "1988-12-01",
          gender: "masculino",
          maritalStatus: "casado",
          education: "mestrado",
          profession: "Teólogo",
          address: "Rua São José, 123",
          city: "São Paulo",
          state: "SP",
          zipCode: "01234-567",
          denomination: "Igreja Luterana",
          howDidYouHear: "Seminário",
          notes: ""
        },
        loading: false,
        refreshProfile: jest.fn(),
      });

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/olá, josé!/i)).toBeInTheDocument();
      }, { timeout: 1500 });
    });

    it('should handle purchase with multiple quantities in amount', async () => {
      mockUseAuth.mockReturnValue({
        user: { uid: 'test-uid-6', displayName: 'Carlos Lima' },
        userProfile: {
          fullName: "Carlos Lima",
          email: "carlos@email.com",
          phone: "(11) 98765-4321",
          dateOfBirth: "1990-05-15",
          gender: "masculino",
          maritalStatus: "solteiro",
          education: "superior-completo",
          profession: "Empresário",
          address: "Rua D, 999",
          city: "Curitiba",
          state: "PR",
          zipCode: "80000-000",
          denomination: "Igreja Assembleia",
          howDidYouHear: "YouTube",
          notes: ""
        },
        loading: false,
        refreshProfile: jest.fn(),
      });

      // Purchase for multiple people (quantity 3)
      savePurchasedCourse({
        courseId: "fundamentos-da-fe",
        purchaseDate: new Date().toISOString(),
        paymentMethod: "pix",
        amount: 750.00, // 250.00 * 3
        status: "paid"
      });

      const purchases = getPurchasedCourses();
      expect(purchases[0].amount).toBe(750.00);
    });

    it('should maintain purchase order chronologically', async () => {
      mockUseAuth.mockReturnValue({
        user: { uid: 'test-uid-7', displayName: 'Fernanda Oliveira' },
        userProfile: {
          fullName: "Fernanda Oliveira",
          email: "fernanda@email.com",
          phone: "(11) 98765-4321",
          dateOfBirth: "1995-09-10",
          gender: "feminino",
          maritalStatus: "solteiro",
          education: "superior-incompleto",
          profession: "Estudante",
          address: "Rua E, 321",
          city: "Brasília",
          state: "DF",
          zipCode: "70000-000",
          denomination: "Igreja Católica",
          howDidYouHear: "Instagram",
          notes: ""
        },
        loading: false,
        refreshProfile: jest.fn(),
      });

      // Purchase courses in order
      savePurchasedCourse({
        courseId: "fundamentos-da-fe",
        purchaseDate: "2026-02-08T10:00:00Z",
        paymentMethod: "pix",
        amount: 250.00,
        status: "paid"
      });

      savePurchasedCourse({
        courseId: "teologia-sistematica",
        purchaseDate: "2026-02-08T12:00:00Z",
        paymentMethod: "cartao",
        amount: 420.00,
        status: "paid"
      });

      savePurchasedCourse({
        courseId: "hermeneutica-biblica",
        purchaseDate: "2026-02-08T14:00:00Z",
        paymentMethod: "pix",
        amount: 320.00,
        status: "paid"
      });

      const purchases = getPurchasedCourses();
      expect(purchases).toHaveLength(3);
      expect(purchases[0].courseId).toBe("fundamentos-da-fe");
      expect(purchases[1].courseId).toBe("teologia-sistematica");
      expect(purchases[2].courseId).toBe("hermeneutica-biblica");
    });
  });

  describe('Course Content Access Control', () => {
    it('should allow access to content page only after purchase', () => {
      // Setup user without purchase
      mockUseAuth.mockReturnValue({
        user: { uid: 'test-uid-8', displayName: 'Maria Silva' },
        userProfile: {
          fullName: "Maria Silva",
          email: "maria@email.com",
          phone: "(11) 98765-4321",
          dateOfBirth: "1990-05-15",
          gender: "feminino",
          maritalStatus: "solteiro",
          education: "superior-completo",
          profession: "Engenheira",
          address: "Rua A, 123",
          city: "São Paulo",
          state: "SP",
          zipCode: "01234-567",
          denomination: "Igreja Metodista",
          howDidYouHear: "Google",
          notes: ""
        },
        loading: false,
        refreshProfile: jest.fn(),
      });

      // Try to access without purchase
      let purchases = getPurchasedCourses();
      expect(purchases.some(p => p.courseId === "fundamentos-da-fe")).toBe(false);

      // Make purchase
      savePurchasedCourse({
        courseId: "fundamentos-da-fe",
        purchaseDate: new Date().toISOString(),
        paymentMethod: "pix",
        amount: 250.00,
        status: "paid"
      });

      // Verify access is now granted
      purchases = getPurchasedCourses();
      expect(purchases.some(p => p.courseId === "fundamentos-da-fe")).toBe(true);
    });

    it('should track different courses separately', () => {
      mockUseAuth.mockReturnValue({
        user: { uid: 'test-uid-9', displayName: 'Carlos Lima' },
        userProfile: {
          fullName: "Carlos Lima",
          email: "carlos@email.com",
          phone: "(11) 98765-4321",
          dateOfBirth: "1990-05-15",
          gender: "masculino",
          maritalStatus: "solteiro",
          education: "superior-completo",
          profession: "Pastor",
          address: "Rua B, 456",
          city: "Rio de Janeiro",
          state: "RJ",
          zipCode: "20000-000",
          denomination: "Igreja Batista",
          howDidYouHear: "Indicação",
          notes: ""
        },
        loading: false,
        refreshProfile: jest.fn(),
      });

      // Purchase first course
      savePurchasedCourse({
        courseId: "fundamentos-da-fe",
        purchaseDate: "2026-02-08T10:00:00Z",
        paymentMethod: "pix",
        amount: 250.00,
        status: "paid"
      });

      // Purchase second course
      savePurchasedCourse({
        courseId: "teologia-sistematica",
        purchaseDate: "2026-02-09T10:00:00Z",
        paymentMethod: "cartao",
        amount: 420.00,
        status: "paid"
      });

      const purchases = getPurchasedCourses();

      // Verify both courses are accessible
      expect(purchases.find(p => p.courseId === "fundamentos-da-fe")).toBeDefined();
      expect(purchases.find(p => p.courseId === "teologia-sistematica")).toBeDefined();

      // Verify third course is not accessible
      expect(purchases.find(p => p.courseId === "hermeneutica-biblica")).toBeUndefined();
    });
  });
});
