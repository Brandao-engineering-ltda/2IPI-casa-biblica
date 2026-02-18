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

// Mock storage utility (now async with uid)
jest.mock('@/lib/storage', () => ({
  getPurchasedCourses: jest.fn(() => Promise.resolve([])),
  getCompletedLessons: jest.fn(() => Promise.resolve(new Set<string>())),
}));

// Mock Skeleton component
jest.mock('@/components/Skeleton', () => ({
  DashboardSkeleton: () => <div data-testid="dashboard-skeleton">Loading...</div>,
}));

// Mock courses module
const mockCourses = [
  {
    id: 'fundamentos-da-fe',
    title: 'Fundamentos da Fé',
    description: 'Estudo das doutrinas essenciais da fé cristã reformada.',
    image: '/images/courses/fundamentos-da-fe.jpg',
    level: 'Iniciante',
    duration: '8 semanas',
    startDate: '11 Mai 2026',
    endDate: '6 Jul 2026',
    status: 'proximo' as const,
    instructor: 'Rev. João Silva',
    pricePix: 250, priceCard: 275, installments: 3,
    order: 1, published: true,
    fullDescription: '', totalHours: '', format: '',
    objectives: [], syllabus: [], requirements: [],
  },
  {
    id: 'teologia-sistematica',
    title: 'Teologia Sistemática',
    description: 'Estudo aprofundado das principais doutrinas cristãs.',
    image: '/images/courses/panorama-biblico.jpg',
    level: 'Intermediário',
    duration: '12 semanas',
    startDate: '14 Abr 2026',
    endDate: '6 Jul 2026',
    status: 'proximo' as const,
    instructor: 'Dr. Maria Santos',
    pricePix: 380, priceCard: 420, installments: 3,
    order: 2, published: true,
    fullDescription: '', totalHours: '', format: '',
    objectives: [], syllabus: [], requirements: [],
  },
  {
    id: 'hermeneutica-biblica',
    title: 'Hermenêutica Bíblica',
    description: 'Princípios e métodos para interpretação das Escrituras.',
    image: '/images/courses/hermeneutica.jpg',
    level: 'Intermediário',
    duration: '10 semanas',
    startDate: '20 Jun 2026',
    endDate: '29 Ago 2026',
    status: 'em-breve' as const,
    instructor: 'Prof. Pedro Costa',
    pricePix: 320, priceCard: 350, installments: 3,
    order: 3, published: true,
    fullDescription: '', totalHours: '', format: '',
    objectives: [], syllabus: [], requirements: [],
  },
];

jest.mock('@/lib/courses', () => ({
  getPublishedCourses: jest.fn(() => Promise.resolve(mockCourses)),
  getCourseModules: jest.fn(() => Promise.resolve([])),
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ user: null, userProfile: null, loading: false, refreshProfile: jest.fn() });
    (getPurchasedCourses as jest.Mock).mockResolvedValue([]);
  });

  describe('Loading State', () => {
    it('should show loading skeleton initially', () => {
      mockUseAuth.mockReturnValue({ user: null, userProfile: null, loading: true, refreshProfile: jest.fn() });

      render(<DashboardPage />);

      expect(screen.getByTestId('dashboard-skeleton')).toBeInTheDocument();
    });

    it('should hide loading skeleton after data loads', async () => {
      mockUseAuth.mockReturnValue({ user: { uid: '123', displayName: 'João Silva' }, userProfile: { fullName: 'João Silva Santos', email: 'joao@email.com' }, loading: false, refreshProfile: jest.fn() });

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();
      });
    });
  });

  describe('User Greeting', () => {
    it('should display personalized greeting when user data exists', async () => {
      mockUseAuth.mockReturnValue({ user: { uid: '123', displayName: 'João Silva' }, userProfile: { fullName: 'João Silva Santos', email: 'joao@email.com' }, loading: false, refreshProfile: jest.fn() });

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/olá, joão!/i)).toBeInTheDocument();
      });
    });

    it('should show default title when no user data exists', async () => {
      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/meus cursos/i)).toBeInTheDocument();
      });
    });
  });

  describe('Empty State', () => {
    it('should show empty state when user has no courses', async () => {
      mockUseAuth.mockReturnValue({ user: { uid: '123', displayName: 'João Silva' }, userProfile: { fullName: 'João Silva', email: 'joao@email.com' }, loading: false, refreshProfile: jest.fn() });

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/você ainda não está matriculado em nenhum curso/i)).toBeInTheDocument();
      });
    });
  });

  describe('Purchased Courses Display', () => {
    it('should display purchased courses', async () => {
      mockUseAuth.mockReturnValue({ user: { uid: '123', displayName: 'João Silva' }, userProfile: { fullName: 'João Silva', email: 'joao@email.com' }, loading: false, refreshProfile: jest.fn() });
      (getPurchasedCourses as jest.Mock).mockResolvedValue([
        { courseId: "fundamentos-da-fe", purchaseDate: "2026-02-08T10:00:00Z", paymentMethod: "pix", amount: 250.00, status: "paid" }
      ]);

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/fundamentos da fé/i)).toBeInTheDocument();
      });
    });

    it('should show "Pago" badge on purchased courses', async () => {
      mockUseAuth.mockReturnValue({ user: { uid: '123', displayName: 'João Silva' }, userProfile: { fullName: 'João Silva', email: 'joao@email.com' }, loading: false, refreshProfile: jest.fn() });
      (getPurchasedCourses as jest.Mock).mockResolvedValue([
        { courseId: "fundamentos-da-fe", purchaseDate: "2026-02-08T10:00:00Z", paymentMethod: "pix", amount: 250.00, status: "paid" }
      ]);

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/✓ pago/i)).toBeInTheDocument();
      });
    });

    it('should display multiple purchased courses', async () => {
      mockUseAuth.mockReturnValue({ user: { uid: '123', displayName: 'João Silva' }, userProfile: { fullName: 'João Silva', email: 'joao@email.com' }, loading: false, refreshProfile: jest.fn() });
      (getPurchasedCourses as jest.Mock).mockResolvedValue([
        { courseId: "fundamentos-da-fe", purchaseDate: "2026-02-08T10:00:00Z", paymentMethod: "pix", amount: 250.00, status: "paid" },
        { courseId: "teologia-sistematica", purchaseDate: "2026-02-08T11:00:00Z", paymentMethod: "cartao", amount: 420.00, status: "paid" }
      ]);

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/fundamentos da fé/i)).toBeInTheDocument();
        expect(screen.getByText(/teologia sistemática/i)).toBeInTheDocument();
      });
    });
  });

  describe('Available Courses Section', () => {
    it('should display available courses section', async () => {
      render(<DashboardPage />);

      await waitFor(() => {
        const elements = screen.getAllByText(/cursos disponíveis/i);
        expect(elements.length).toBeGreaterThan(0);
      });
    });

    it('should show "Inscrever-se" button for available courses', async () => {
      render(<DashboardPage />);

      await waitFor(() => {
        const inscreverseBtns = screen.getAllByRole('link', { name: /inscrever-se/i });
        expect(inscreverseBtns.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Course Card Links', () => {
    it('should link paid courses to content page', async () => {
      mockUseAuth.mockReturnValue({ user: { uid: '123', displayName: 'João Silva' }, userProfile: { fullName: 'João Silva', email: 'joao@email.com' }, loading: false, refreshProfile: jest.fn() });
      (getPurchasedCourses as jest.Mock).mockResolvedValue([
        { courseId: "fundamentos-da-fe", purchaseDate: "2026-02-08T10:00:00Z", paymentMethod: "pix", amount: 250.00, status: "paid" }
      ]);

      render(<DashboardPage />);

      await waitFor(() => {
        const courseLinks = screen.getAllByRole('link');
        const contentLink = courseLinks.find(link =>
          link.getAttribute('href')?.includes('/course/fundamentos-da-fe/content')
        );
        expect(contentLink).toBeInTheDocument();
      });
    });

    it('should display "Acessar Conteúdo" button for paid courses', async () => {
      mockUseAuth.mockReturnValue({ user: { uid: '123', displayName: 'João Silva' }, userProfile: { fullName: 'João Silva', email: 'joao@email.com' }, loading: false, refreshProfile: jest.fn() });
      (getPurchasedCourses as jest.Mock).mockResolvedValue([
        { courseId: "fundamentos-da-fe", purchaseDate: "2026-02-08T10:00:00Z", paymentMethod: "pix", amount: 250.00, status: "paid" }
      ]);

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/acessar conteudo/i)).toBeInTheDocument();
      });
    });
  });

  describe('Logo Display', () => {
    it('should display instituto logo', async () => {
      render(<DashboardPage />);

      await waitFor(() => {
        const logo = screen.getByAltText(/logo instituto casa bíblica/i);
        expect(logo).toBeInTheDocument();
      });
    });
  });
});
