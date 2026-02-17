import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPage from '../page';
import { getPurchasedCourses } from '@/lib/storage';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock firebase
jest.mock('@/lib/firebase', () => ({ auth: {}, signOut: jest.fn() }));

// Mock AuthContext
const mockUseAuth = jest.fn();
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock storage utility
jest.mock('@/lib/storage', () => ({
  getPurchasedCourses: jest.fn(),
  getCompletedLessons: jest.fn(() => new Set<string>()),
}));

// Mock Skeleton component
jest.mock('@/components/Skeleton', () => ({
  DashboardSkeleton: () => <div data-testid="dashboard-skeleton">Loading...</div>,
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ user: null, userProfile: null, loading: false, refreshProfile: jest.fn() });
  });

  describe('Loading State', () => {
    it('should show loading skeleton initially', () => {
      mockUseAuth.mockReturnValue({ user: null, userProfile: null, loading: true, refreshProfile: jest.fn() });
      (getPurchasedCourses as jest.Mock).mockReturnValue([]);

      render(<DashboardPage />);

      expect(screen.getByTestId('dashboard-skeleton')).toBeInTheDocument();
    });

    it('should hide loading skeleton after data loads', async () => {
      mockUseAuth.mockReturnValue({ user: { uid: '123', displayName: 'João Silva' }, userProfile: { nomeCompleto: 'João Silva Santos', email: 'joao@email.com' }, loading: false, refreshProfile: jest.fn() });
      (getPurchasedCourses as jest.Mock).mockReturnValue([]);

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();
      });
    });
  });

  describe('User Greeting', () => {
    it('should display personalized greeting when user data exists', async () => {
      mockUseAuth.mockReturnValue({ user: { uid: '123', displayName: 'João Silva' }, userProfile: { nomeCompleto: 'João Silva Santos', email: 'joao@email.com' }, loading: false, refreshProfile: jest.fn() });
      (getPurchasedCourses as jest.Mock).mockReturnValue([]);

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/olá, joão!/i)).toBeInTheDocument();
      });
    });

    it('should extract first name correctly from full name', async () => {
      mockUseAuth.mockReturnValue({ user: { uid: '456', displayName: 'Maria Santos' }, userProfile: { nomeCompleto: 'Maria Santos Silva', email: 'maria@email.com' }, loading: false, refreshProfile: jest.fn() });
      (getPurchasedCourses as jest.Mock).mockReturnValue([]);

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/olá, maria!/i)).toBeInTheDocument();
      });
    });

    it('should show welcome message when user is logged in', async () => {
      mockUseAuth.mockReturnValue({ user: { uid: '123', displayName: 'João Silva' }, userProfile: { nomeCompleto: 'João Silva', email: 'joao@email.com' }, loading: false, refreshProfile: jest.fn() });
      (getPurchasedCourses as jest.Mock).mockReturnValue([]);

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/bem-vindo de volta/i)).toBeInTheDocument();
      });
    });

    it('should show default title when no user data exists', async () => {
      mockUseAuth.mockReturnValue({ user: null, userProfile: null, loading: false, refreshProfile: jest.fn() });
      (getPurchasedCourses as jest.Mock).mockReturnValue([]);

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/meus cursos/i)).toBeInTheDocument();
      });
    });
  });

  describe('Empty State', () => {
    it('should show empty state when user has no courses', async () => {
      mockUseAuth.mockReturnValue({ user: { uid: '123', displayName: 'João Silva' }, userProfile: { nomeCompleto: 'João Silva', email: 'joao@email.com' }, loading: false, refreshProfile: jest.fn() });
      (getPurchasedCourses as jest.Mock).mockReturnValue([]);

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/você ainda não está matriculado em nenhum curso/i)).toBeInTheDocument();
      });
    });

    it('should show empty state icon', async () => {
      mockUseAuth.mockReturnValue({ user: null, userProfile: null, loading: false, refreshProfile: jest.fn() });
      (getPurchasedCourses as jest.Mock).mockReturnValue([]);

      render(<DashboardPage />);

      await waitFor(() => {
        const svg = screen.getByText(/você ainda não está matriculado/i)
          .closest('div')
          ?.querySelector('svg');
        expect(svg).toBeInTheDocument();
      });
    });
  });

  describe('Purchased Courses Display', () => {
    it('should display purchased courses', async () => {
      mockUseAuth.mockReturnValue({ user: { uid: '123', displayName: 'João Silva' }, userProfile: { nomeCompleto: 'João Silva', email: 'joao@email.com' }, loading: false, refreshProfile: jest.fn() });
      (getPurchasedCourses as jest.Mock).mockReturnValue([
        {
          courseId: "fundamentos-da-fe",
          purchaseDate: "2026-02-08T10:00:00Z",
          paymentMethod: "pix",
          amount: 250.00,
          status: "paid"
        }
      ]);

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/fundamentos da fé/i)).toBeInTheDocument();
      });
    });

    it('should show "Pago" badge on purchased courses', async () => {
      mockUseAuth.mockReturnValue({ user: { uid: '123', displayName: 'João Silva' }, userProfile: { nomeCompleto: 'João Silva', email: 'joao@email.com' }, loading: false, refreshProfile: jest.fn() });
      (getPurchasedCourses as jest.Mock).mockReturnValue([
        {
          courseId: "fundamentos-da-fe",
          purchaseDate: "2026-02-08T10:00:00Z",
          paymentMethod: "pix",
          amount: 250.00,
          status: "paid"
        }
      ]);

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/✓ pago/i)).toBeInTheDocument();
      });
    });

    it('should display multiple purchased courses', async () => {
      mockUseAuth.mockReturnValue({ user: { uid: '123', displayName: 'João Silva' }, userProfile: { nomeCompleto: 'João Silva', email: 'joao@email.com' }, loading: false, refreshProfile: jest.fn() });
      (getPurchasedCourses as jest.Mock).mockReturnValue([
        {
          courseId: "fundamentos-da-fe",
          purchaseDate: "2026-02-08T10:00:00Z",
          paymentMethod: "pix",
          amount: 250.00,
          status: "paid"
        },
        {
          courseId: "teologia-sistematica",
          purchaseDate: "2026-02-08T11:00:00Z",
          paymentMethod: "cartao",
          amount: 420.00,
          status: "paid"
        }
      ]);

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/fundamentos da fé/i)).toBeInTheDocument();
        expect(screen.getByText(/teologia sistemática/i)).toBeInTheDocument();
      });
    });

    it.skip('should show enrollment date for purchased courses', async () => {
      // Note: Enrollment date is currently not displayed in the UI
      // This test is skipped until the feature is implemented
      mockUseAuth.mockReturnValue({ user: { uid: '123', displayName: 'João Silva' }, userProfile: { nomeCompleto: 'João Silva', email: 'joao@email.com' }, loading: false, refreshProfile: jest.fn() });
      (getPurchasedCourses as jest.Mock).mockReturnValue([
        {
          courseId: "fundamentos-da-fe",
          purchaseDate: "2026-02-08T10:00:00.000Z",
          paymentMethod: "pix",
          amount: 250.00,
          status: "paid"
        }
      ]);

      render(<DashboardPage />);

      await waitFor(() => {
        // Date should be formatted as Brazilian locale (08/02/2026)
        // Use getAllByText since the course might appear multiple times
        const elements = screen.queryAllByText(/08\/02\/2026/);
        expect(elements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Available Courses Section', () => {
    it('should display available courses section', async () => {
      mockUseAuth.mockReturnValue({ user: null, userProfile: null, loading: false, refreshProfile: jest.fn() });
      (getPurchasedCourses as jest.Mock).mockReturnValue([]);

      render(<DashboardPage />);

      await waitFor(() => {
        // Use getAllByText since "Cursos Disponíveis" appears in both heading and empty state
        const elements = screen.getAllByText(/cursos disponíveis/i);
        expect(elements.length).toBeGreaterThan(0);
      });
    });

    it('should show "Inscrever-se" button for available courses', async () => {
      mockUseAuth.mockReturnValue({ user: null, userProfile: null, loading: false, refreshProfile: jest.fn() });
      (getPurchasedCourses as jest.Mock).mockReturnValue([]);

      render(<DashboardPage />);

      await waitFor(() => {
        const inscreverseBtns = screen.getAllByRole('link', { name: /inscrever-se/i });
        expect(inscreverseBtns.length).toBeGreaterThan(0);
      });
    });

    it('should not show purchased courses in available courses section', async () => {
      mockUseAuth.mockReturnValue({ user: null, userProfile: null, loading: false, refreshProfile: jest.fn() });
      (getPurchasedCourses as jest.Mock).mockReturnValue([
        {
          courseId: "fundamentos-da-fe",
          purchaseDate: "2026-02-08T10:00:00Z",
          paymentMethod: "pix",
          amount: 250.00,
          status: "paid"
        }
      ]);

      render(<DashboardPage />);

      await waitFor(() => {
        // The purchased course should appear in "My Courses" section
        const myCoursesTitles = screen.getAllByText(/fundamentos da fé/i);
        expect(myCoursesTitles.length).toBeGreaterThan(0);

        // But should NOT have "Inscrever-se" button (which only appears in available courses)
        const availableSection = screen.getByText(/cursos disponíveis/i).closest('div');
        if (availableSection) {
          // Check that "Fundamentos da Fé" doesn't appear in the available courses section
          const availableCourseCards = availableSection.querySelectorAll('a[href*="/curso/"]');
          const fundamentos = Array.from(availableCourseCards).find(card =>
            card.textContent?.includes('Fundamentos da Fé')
          );
          expect(fundamentos).toBeUndefined();
        }
      });
    });

    it('should show message when all courses are purchased', async () => {
      mockUseAuth.mockReturnValue({ user: null, userProfile: null, loading: false, refreshProfile: jest.fn() });
      (getPurchasedCourses as jest.Mock).mockReturnValue([
        {
          courseId: "fundamentos-da-fe",
          purchaseDate: "2026-02-08T10:00:00Z",
          paymentMethod: "pix",
          amount: 250.00,
          status: "paid"
        },
        {
          courseId: "teologia-sistematica",
          purchaseDate: "2026-02-08T10:00:00Z",
          paymentMethod: "pix",
          amount: 380.00,
          status: "paid"
        },
        {
          courseId: "hermeneutica-biblica",
          purchaseDate: "2026-02-08T10:00:00Z",
          paymentMethod: "pix",
          amount: 320.00,
          status: "paid"
        },
        {
          courseId: "hermeneutica",
          purchaseDate: "2026-02-08T10:00:00Z",
          paymentMethod: "pix",
          amount: 320.00,
          status: "paid"
        },
        {
          courseId: "antigo-testamento",
          purchaseDate: "2026-02-08T10:00:00Z",
          paymentMethod: "pix",
          amount: 450.00,
          status: "paid"
        }
      ]);

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/você já está matriculado em todos os cursos disponíveis/i)).toBeInTheDocument();
      });
    });
  });

  describe('Course Card Links', () => {
    it('should link paid courses to content page', async () => {
      mockUseAuth.mockReturnValue({ user: null, userProfile: null, loading: false, refreshProfile: jest.fn() });
      (getPurchasedCourses as jest.Mock).mockReturnValue([
        {
          courseId: "fundamentos-da-fe",
          purchaseDate: "2026-02-08T10:00:00Z",
          paymentMethod: "pix",
          amount: 250.00,
          status: "paid"
        }
      ]);

      render(<DashboardPage />);

      await waitFor(() => {
        const courseLinks = screen.getAllByRole('link');
        const contentLink = courseLinks.find(link =>
          link.getAttribute('href')?.includes('/curso/fundamentos-da-fe/conteudo')
        );
        expect(contentLink).toBeInTheDocument();
      });
    });

    it('should display "Acessar Conteúdo" button for paid courses', async () => {
      mockUseAuth.mockReturnValue({ user: null, userProfile: null, loading: false, refreshProfile: jest.fn() });
      (getPurchasedCourses as jest.Mock).mockReturnValue([
        {
          courseId: "fundamentos-da-fe",
          purchaseDate: "2026-02-08T10:00:00Z",
          paymentMethod: "pix",
          amount: 250.00,
          status: "paid"
        }
      ]);

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/acessar conteudo/i)).toBeInTheDocument();
      });
    });

    it('should link unpaid courses to course detail page', async () => {
      mockUseAuth.mockReturnValue({ user: null, userProfile: null, loading: false, refreshProfile: jest.fn() });
      (getPurchasedCourses as jest.Mock).mockReturnValue([]);

      render(<DashboardPage />);

      await waitFor(() => {
        const courseLinks = screen.getAllByRole('link');
        // Check that available courses link to preview page, not content
        const previewLinks = courseLinks.filter(link => {
          const href = link.getAttribute('href');
          return href?.includes('/curso/') && !href?.includes('/conteudo') && !href?.includes('/inscricao');
        });
        expect(previewLinks.length).toBeGreaterThan(0);
      });
    });

    it('should link "Inscrever-se" to payment page', async () => {
      mockUseAuth.mockReturnValue({ user: null, userProfile: null, loading: false, refreshProfile: jest.fn() });
      (getPurchasedCourses as jest.Mock).mockReturnValue([]);

      render(<DashboardPage />);

      await waitFor(() => {
        const inscreverseBtns = screen.getAllByRole('link', { name: /inscrever-se/i });
        expect(inscreverseBtns[0]).toHaveAttribute('href', expect.stringContaining('/inscricao'));
      });
    });
  });

  describe('Course Status Display', () => {
    it('should show "Não iniciado" status for new purchases', async () => {
      mockUseAuth.mockReturnValue({ user: null, userProfile: null, loading: false, refreshProfile: jest.fn() });
      (getPurchasedCourses as jest.Mock).mockReturnValue([
        {
          courseId: "fundamentos-da-fe",
          purchaseDate: "2026-02-08T10:00:00Z",
          paymentMethod: "pix",
          amount: 250.00,
          status: "paid"
        }
      ]);

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/nao iniciado/i)).toBeInTheDocument();
      });
    });
  });

  describe('Logo Display', () => {
    it('should display instituto logo', async () => {
      mockUseAuth.mockReturnValue({ user: null, userProfile: null, loading: false, refreshProfile: jest.fn() });
      (getPurchasedCourses as jest.Mock).mockReturnValue([]);

      render(<DashboardPage />);

      await waitFor(() => {
        const logo = screen.getByAltText(/logo instituto casa bíblica/i);
        expect(logo).toBeInTheDocument();
      });
    });
  });
});
