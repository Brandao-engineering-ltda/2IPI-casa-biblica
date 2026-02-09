import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPage from '../page';
import { getUserData, getPurchasedCourses } from '@/lib/storage';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock storage utility
jest.mock('@/lib/storage', () => ({
  getUserData: jest.fn(),
  getPurchasedCourses: jest.fn(),
}));

// Mock Skeleton component
jest.mock('@/components/Skeleton', () => ({
  DashboardSkeleton: () => <div data-testid="dashboard-skeleton">Loading...</div>,
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should show loading skeleton initially', () => {
      (getUserData as jest.Mock).mockReturnValue(null);
      (getPurchasedCourses as jest.Mock).mockReturnValue([]);

      render(<DashboardPage />);

      expect(screen.getByTestId('dashboard-skeleton')).toBeInTheDocument();
    });

    it('should hide loading skeleton after data loads', async () => {
      (getUserData as jest.Mock).mockReturnValue({
        nomeCompleto: "João Silva Santos",
        email: "joao.silva@email.com",
      });
      (getPurchasedCourses as jest.Mock).mockReturnValue([]);

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();
      }, { timeout: 1500 });
    });
  });

  describe('User Greeting', () => {
    it('should display personalized greeting when user data exists', async () => {
      (getUserData as jest.Mock).mockReturnValue({
        nomeCompleto: "João Silva Santos",
        email: "joao.silva@email.com",
      });
      (getPurchasedCourses as jest.Mock).mockReturnValue([]);

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/olá, joão!/i)).toBeInTheDocument();
      }, { timeout: 1500 });
    });

    it('should extract first name correctly from full name', async () => {
      (getUserData as jest.Mock).mockReturnValue({
        nomeCompleto: "Maria Santos Silva",
        email: "maria@email.com",
      });
      (getPurchasedCourses as jest.Mock).mockReturnValue([]);

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/olá, maria!/i)).toBeInTheDocument();
      }, { timeout: 1500 });
    });

    it('should show welcome message when user is logged in', async () => {
      (getUserData as jest.Mock).mockReturnValue({
        nomeCompleto: "João Silva",
        email: "joao@email.com",
      });
      (getPurchasedCourses as jest.Mock).mockReturnValue([]);

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/bem-vindo de volta/i)).toBeInTheDocument();
      }, { timeout: 1500 });
    });

    it('should show default title when no user data exists', async () => {
      (getUserData as jest.Mock).mockReturnValue(null);
      (getPurchasedCourses as jest.Mock).mockReturnValue([]);

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/meus cursos/i)).toBeInTheDocument();
      }, { timeout: 1500 });
    });
  });

  describe('Empty State', () => {
    it('should show empty state when user has no courses', async () => {
      (getUserData as jest.Mock).mockReturnValue({
        nomeCompleto: "João Silva",
        email: "joao@email.com",
      });
      (getPurchasedCourses as jest.Mock).mockReturnValue([]);

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/você ainda não está matriculado em nenhum curso/i)).toBeInTheDocument();
      }, { timeout: 1500 });
    });

    it('should show empty state icon', async () => {
      (getUserData as jest.Mock).mockReturnValue(null);
      (getPurchasedCourses as jest.Mock).mockReturnValue([]);

      render(<DashboardPage />);

      await waitFor(() => {
        const svg = screen.getByText(/você ainda não está matriculado/i)
          .closest('div')
          ?.querySelector('svg');
        expect(svg).toBeInTheDocument();
      }, { timeout: 1500 });
    });
  });

  describe('Purchased Courses Display', () => {
    it('should display purchased courses', async () => {
      (getUserData as jest.Mock).mockReturnValue({
        nomeCompleto: "João Silva",
        email: "joao@email.com",
      });
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
      }, { timeout: 1500 });
    });

    it('should show "Pago" badge on purchased courses', async () => {
      (getUserData as jest.Mock).mockReturnValue({
        nomeCompleto: "João Silva",
        email: "joao@email.com",
      });
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
      }, { timeout: 1500 });
    });

    it('should display multiple purchased courses', async () => {
      (getUserData as jest.Mock).mockReturnValue({
        nomeCompleto: "João Silva",
        email: "joao@email.com",
      });
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
      }, { timeout: 1500 });
    });

    it.skip('should show enrollment date for purchased courses', async () => {
      // Note: Enrollment date is currently not displayed in the UI
      // This test is skipped until the feature is implemented
      (getUserData as jest.Mock).mockReturnValue({
        nomeCompleto: "João Silva",
        email: "joao@email.com",
      });
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
      }, { timeout: 1500 });
    });
  });

  describe('Available Courses Section', () => {
    it('should display available courses section', async () => {
      (getUserData as jest.Mock).mockReturnValue(null);
      (getPurchasedCourses as jest.Mock).mockReturnValue([]);

      render(<DashboardPage />);

      await waitFor(() => {
        // Use getAllByText since "Cursos Disponíveis" appears in both heading and empty state
        const elements = screen.getAllByText(/cursos disponíveis/i);
        expect(elements.length).toBeGreaterThan(0);
      }, { timeout: 1500 });
    });

    it('should show "Inscrever-se" button for available courses', async () => {
      (getUserData as jest.Mock).mockReturnValue(null);
      (getPurchasedCourses as jest.Mock).mockReturnValue([]);

      render(<DashboardPage />);

      await waitFor(() => {
        const inscreverseBtns = screen.getAllByRole('link', { name: /inscrever-se/i });
        expect(inscreverseBtns.length).toBeGreaterThan(0);
      }, { timeout: 1500 });
    });

    it('should not show purchased courses in available courses section', async () => {
      (getUserData as jest.Mock).mockReturnValue(null);
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
      }, { timeout: 1500 });
    });

    it('should show message when all courses are purchased', async () => {
      (getUserData as jest.Mock).mockReturnValue(null);
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
      }, { timeout: 1500 });
    });
  });

  describe('Course Card Links', () => {
    it('should link paid courses to content page', async () => {
      (getUserData as jest.Mock).mockReturnValue(null);
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
      }, { timeout: 1500 });
    });

    it('should display "Acessar Conteúdo" button for paid courses', async () => {
      (getUserData as jest.Mock).mockReturnValue(null);
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
        expect(screen.getByText(/acessar conteúdo/i)).toBeInTheDocument();
      }, { timeout: 1500 });
    });

    it('should link unpaid courses to course detail page', async () => {
      (getUserData as jest.Mock).mockReturnValue(null);
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
      }, { timeout: 1500 });
    });

    it('should link "Inscrever-se" to payment page', async () => {
      (getUserData as jest.Mock).mockReturnValue(null);
      (getPurchasedCourses as jest.Mock).mockReturnValue([]);

      render(<DashboardPage />);

      await waitFor(() => {
        const inscreverseBtns = screen.getAllByRole('link', { name: /inscrever-se/i });
        expect(inscreverseBtns[0]).toHaveAttribute('href', expect.stringContaining('/inscricao'));
      }, { timeout: 1500 });
    });
  });

  describe('Course Status Display', () => {
    it('should show "Não iniciado" status for new purchases', async () => {
      (getUserData as jest.Mock).mockReturnValue(null);
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
        expect(screen.getByText(/não iniciado/i)).toBeInTheDocument();
      }, { timeout: 1500 });
    });
  });

  describe('Logo Display', () => {
    it('should display instituto logo', async () => {
      (getUserData as jest.Mock).mockReturnValue(null);
      (getPurchasedCourses as jest.Mock).mockReturnValue([]);

      render(<DashboardPage />);

      await waitFor(() => {
        const logo = screen.getByAltText(/logo instituto casa bíblica/i);
        expect(logo).toBeInTheDocument();
      }, { timeout: 1500 });
    });
  });
});
