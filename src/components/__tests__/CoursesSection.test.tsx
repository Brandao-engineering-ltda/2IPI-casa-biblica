import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CoursesSection } from '../CoursesSection';
import { getPublishedCourses } from '@/lib/courses';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

// Mock framer-motion to avoid AnimatePresence exit delays in tests
jest.mock('framer-motion', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  const motionProps = ['initial', 'animate', 'exit', 'variants', 'whileHover', 'whileTap', 'whileInView', 'viewport', 'custom', 'transition', 'layout', 'layoutId'];
  function createMotionComponent(tag: string) {
    return React.forwardRef(function MotionComponent(props: Record<string, unknown>, ref: React.Ref<unknown>) {
      const filtered = Object.fromEntries(Object.entries(props).filter(([k]) => !motionProps.includes(k)));
      return React.createElement(tag, { ...filtered, ref });
    });
  }
  return {
    motion: new Proxy({}, {
      get: (_target: Record<string, unknown>, prop: string) => createMotionComponent(prop),
    }),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
  };
});

// Mock courses lib
jest.mock('@/lib/courses', () => ({
  getPublishedCourses: jest.fn(),
}));

const mockCourses = [
  {
    id: "panorama-biblico",
    title: "Panorama Bíblico",
    description: "Uma visão geral de toda a Bíblia, do Gênesis ao Apocalipse. Entenda a grande narrativa das Escrituras.",
    fullDescription: "Uma visão geral de toda a Bíblia.",
    duration: "12 semanas",
    level: "Iniciante",
    startDate: "10 Fev 2026",
    startDateISO: "2026-02-10",
    endDate: "4 Mai 2026",
    endDateISO: "2026-05-04",
    status: "em-andamento" as const,
    image: "/images/courses/panorama-biblico.jpg",
    instructor: "",
    totalHours: "",
    format: "Online ao vivo",
    objectives: [],
    syllabus: [],
    requirements: [],
    pricePix: 0,
    priceCard: 0,
    installments: 3,
    order: 1,
    published: true,
  },
  {
    id: "fundamentos-da-fe",
    title: "Fundamentos da Fé",
    description: "Estudo das doutrinas essenciais da fé cristã reformada. Base sólida para o crescimento espiritual.",
    fullDescription: "Estudo das doutrinas essenciais.",
    duration: "8 semanas",
    level: "Iniciante",
    startDate: "11 Mai 2026",
    startDateISO: "2026-05-11",
    endDate: "6 Jul 2026",
    endDateISO: "2026-07-06",
    status: "proximo" as const,
    image: "/images/courses/fundamentos-da-fe.jpg",
    instructor: "",
    totalHours: "",
    format: "Online ao vivo",
    objectives: [],
    syllabus: [],
    requirements: [],
    pricePix: 0,
    priceCard: 0,
    installments: 3,
    order: 2,
    published: true,
  },
  {
    id: "hermeneutica",
    title: "Hermenêutica Bíblica",
    description: "Aprenda princípios de interpretação bíblica.",
    fullDescription: "Aprenda princípios de interpretação bíblica.",
    duration: "10 semanas",
    level: "Intermediário",
    startDate: "13 Jul 2026",
    startDateISO: "2026-07-13",
    endDate: "21 Set 2026",
    endDateISO: "2026-09-21",
    status: "em-breve" as const,
    image: "/images/courses/hermeneutica.jpg",
    instructor: "",
    totalHours: "",
    format: "Online ao vivo",
    objectives: [],
    syllabus: [],
    requirements: [],
    pricePix: 0,
    priceCard: 0,
    installments: 3,
    order: 3,
    published: true,
  },
];

beforeEach(() => {
  (getPublishedCourses as jest.Mock).mockResolvedValue(mockCourses);
});

afterEach(() => {
  jest.clearAllMocks();
});

// Helper: switch to grid view (default is now carousel/stack)
async function switchToGridView() {
  await waitFor(() => {
    expect(screen.getByText('Grade')).toBeInTheDocument();
  });
  fireEvent.click(screen.getByText('Grade'));
}

describe('CoursesSection Component', () => {
  describe('Section Rendering', () => {
    it('renders the section heading "Nossos Cursos"', async () => {
      render(<CoursesSection />);
      await waitFor(() => {
        expect(screen.getByText('Nossos Cursos')).toBeInTheDocument();
      });
    });

    it('renders the subtitle text', async () => {
      render(<CoursesSection />);
      await waitFor(() => {
        expect(
          screen.getByText('Trilhas de formação bíblica para cada etapa da sua caminhada')
        ).toBeInTheDocument();
      });
    });

    it('has correct section id for anchor linking', async () => {
      const { container } = render(<CoursesSection />);
      await waitFor(() => {
        const section = container.querySelector('section');
        expect(section).toHaveAttribute('id', 'courses');
      });
    });

    it('has correct background styling', async () => {
      const { container } = render(<CoursesSection />);
      await waitFor(() => {
        const section = container.querySelector('section');
        expect(section).toHaveClass('bg-cream');
      });
    });
  });

  describe('Course Cards', () => {
    it('renders course titles', async () => {
      render(<CoursesSection />);
      await switchToGridView();
      await waitFor(() => {
        expect(screen.getByText('Panorama Bíblico')).toBeInTheDocument();
      });
      expect(screen.getAllByText('Fundamentos da Fé').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Hermenêutica Bíblica').length).toBeGreaterThanOrEqual(1);
    });

    it('renders course descriptions', async () => {
      render(<CoursesSection />);
      await switchToGridView();
      await waitFor(() => {
        expect(
          screen.getByText(/Uma visão geral de toda a Bíblia, do Gênesis ao Apocalipse/)
        ).toBeInTheDocument();
      });
      expect(
        screen.getAllByText(/Estudo das doutrinas essenciais da fé cristã reformada/).length
      ).toBeGreaterThanOrEqual(1);
    });

    it('renders the featured course (first course) as a distinct card', async () => {
      const { container } = render(<CoursesSection />);
      await switchToGridView();
      await waitFor(() => {
        const featuredCard = container.querySelector('article.col-span-full');
        expect(featuredCard).toBeInTheDocument();
      });
    });

    it('renders "Ver Detalhes" buttons on course cards', async () => {
      render(<CoursesSection />);
      await switchToGridView();
      await waitFor(() => {
        const verDetalhesButtons = screen.getAllByText('Ver Detalhes');
        expect(verDetalhesButtons.length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('Course Details (Levels, Duration, Dates)', () => {
    it('renders status badges', async () => {
      render(<CoursesSection />);
      await switchToGridView();
      await waitFor(() => {
        expect(screen.getByText('Em Andamento')).toBeInTheDocument();
      });
      const proximoBadges = screen.getAllByText('Próximo');
      expect(proximoBadges.length).toBeGreaterThanOrEqual(1);
      const emBreveBadges = screen.getAllByText('Em Breve');
      expect(emBreveBadges.length).toBeGreaterThanOrEqual(1);
    });

    it('renders level badges', async () => {
      render(<CoursesSection />);
      await switchToGridView();
      await waitFor(() => {
        const inicianteBadges = screen.getAllByText('Iniciante');
        expect(inicianteBadges.length).toBeGreaterThanOrEqual(1);
      });
      const intermediarioBadges = screen.getAllByText('Intermediário');
      expect(intermediarioBadges.length).toBeGreaterThanOrEqual(1);
    });

    it('renders course durations', async () => {
      render(<CoursesSection />);
      await switchToGridView();
      await waitFor(() => {
        const duracoes12 = screen.getAllByText('12 semanas');
        expect(duracoes12.length).toBeGreaterThanOrEqual(1);
      });
      const duracoes8 = screen.getAllByText('8 semanas');
      expect(duracoes8.length).toBeGreaterThanOrEqual(1);
    });

    it('renders course date ranges on cards', async () => {
      render(<CoursesSection />);
      await switchToGridView();
      await waitFor(() => {
        expect(screen.getByText(/10 Fev 2026 — 4 Mai 2026/)).toBeInTheDocument();
      });
    });
  });

  describe('Course Images', () => {
    it('renders course images with correct alt text', async () => {
      render(<CoursesSection />);
      await switchToGridView();
      await waitFor(() => {
        const panoramaImages = screen.getAllByAltText('Panorama Bíblico');
        expect(panoramaImages.length).toBeGreaterThanOrEqual(1);
      });
      const fundamentosImages = screen.getAllByAltText('Fundamentos da Fé');
      expect(fundamentosImages.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Course Dialog', () => {
    it('opens the dialog when a course card is clicked', async () => {
      render(<CoursesSection />);
      await switchToGridView();
      await waitFor(() => {
        expect(screen.getByText('Panorama Bíblico')).toBeInTheDocument();
      });

      const featuredArticle = screen.getByText('Panorama Bíblico').closest('article');
      fireEvent.click(featuredArticle!);

      expect(screen.getByText('Inscreva-se Agora')).toBeInTheDocument();
    });

    it('shows "Instituto Casa Bíblica" text in dialog', async () => {
      render(<CoursesSection />);
      await switchToGridView();
      await waitFor(() => {
        expect(screen.getByText('Panorama Bíblico')).toBeInTheDocument();
      });

      const featuredArticle = screen.getByText('Panorama Bíblico').closest('article');
      fireEvent.click(featuredArticle!);

      expect(screen.getByText('Instituto Casa Bíblica')).toBeInTheDocument();
    });

    it('shows course title in dialog', async () => {
      render(<CoursesSection />);
      await switchToGridView();
      await waitFor(() => {
        expect(screen.getAllByText('Fundamentos da Fé').length).toBeGreaterThanOrEqual(1);
      });

      const fundamentosTitles = screen.getAllByText('Fundamentos da Fé');
      const courseArticle = fundamentosTitles[0].closest('article');
      fireEvent.click(courseArticle!);

      const allTitles = screen.getAllByText('Fundamentos da Fé');
      expect(allTitles.length).toBeGreaterThanOrEqual(3);
    });

    it('shows course description in dialog', async () => {
      render(<CoursesSection />);
      await switchToGridView();
      await waitFor(() => {
        expect(screen.getByText('Panorama Bíblico')).toBeInTheDocument();
      });

      const featuredArticle = screen.getByText('Panorama Bíblico').closest('article');
      fireEvent.click(featuredArticle!);

      const descriptions = screen.getAllByText(
        /Uma visão geral de toda a Bíblia, do Gênesis ao Apocalipse/
      );
      expect(descriptions.length).toBeGreaterThanOrEqual(2);
    });

    it('shows status and level badges in dialog', async () => {
      render(<CoursesSection />);
      await switchToGridView();
      await waitFor(() => {
        expect(screen.getByText('Panorama Bíblico')).toBeInTheDocument();
      });

      const featuredArticle = screen.getByText('Panorama Bíblico').closest('article');
      fireEvent.click(featuredArticle!);

      const emAndamentoBadges = screen.getAllByText('Em Andamento');
      expect(emAndamentoBadges.length).toBeGreaterThanOrEqual(2);

      const inicianteBadges = screen.getAllByText('Iniciante');
      expect(inicianteBadges.length).toBeGreaterThanOrEqual(2);
    });

    it('shows start and end dates in dialog', async () => {
      render(<CoursesSection />);
      await switchToGridView();
      await waitFor(() => {
        expect(screen.getByText('Panorama Bíblico')).toBeInTheDocument();
      });

      const featuredArticle = screen.getByText('Panorama Bíblico').closest('article');
      fireEvent.click(featuredArticle!);

      expect(screen.getByText(/Início: 10 Fev 2026/)).toBeInTheDocument();
      expect(screen.getByText(/Término: 4 Mai 2026/)).toBeInTheDocument();
    });

    it('shows duration in dialog', async () => {
      render(<CoursesSection />);
      await switchToGridView();
      await waitFor(() => {
        expect(screen.getByText('Panorama Bíblico')).toBeInTheDocument();
      });

      const featuredArticle = screen.getByText('Panorama Bíblico').closest('article');
      fireEvent.click(featuredArticle!);

      const duracoes = screen.getAllByText('12 semanas');
      expect(duracoes.length).toBeGreaterThanOrEqual(2);
    });

    it('"Inscreva-se Agora" links to /login', async () => {
      render(<CoursesSection />);
      await switchToGridView();
      await waitFor(() => {
        expect(screen.getByText('Panorama Bíblico')).toBeInTheDocument();
      });

      const featuredArticle = screen.getByText('Panorama Bíblico').closest('article');
      fireEvent.click(featuredArticle!);

      const inscrevaLink = screen.getByText('Inscreva-se Agora').closest('a');
      expect(inscrevaLink).toHaveAttribute('href', '/login');
    });

    it('closes the dialog when the close button is clicked', async () => {
      render(<CoursesSection />);
      await switchToGridView();
      await waitFor(() => {
        expect(screen.getByText('Panorama Bíblico')).toBeInTheDocument();
      });

      const featuredArticle = screen.getByText('Panorama Bíblico').closest('article');
      fireEvent.click(featuredArticle!);

      expect(screen.getByText('Inscreva-se Agora')).toBeInTheDocument();

      const closeButton = screen.getByLabelText('Fechar');
      fireEvent.click(closeButton);

      expect(screen.queryByText('Inscreva-se Agora')).not.toBeInTheDocument();
    });

    it('closes the dialog when the backdrop is clicked', async () => {
      render(<CoursesSection />);
      await switchToGridView();
      await waitFor(() => {
        expect(screen.getByText('Panorama Bíblico')).toBeInTheDocument();
      });

      const featuredArticle = screen.getByText('Panorama Bíblico').closest('article');
      fireEvent.click(featuredArticle!);

      expect(screen.getByText('Inscreva-se Agora')).toBeInTheDocument();

      const backdrop = screen.getByText('Inscreva-se Agora').closest('.fixed');
      fireEvent.click(backdrop!);

      expect(screen.queryByText('Inscreva-se Agora')).not.toBeInTheDocument();
    });

    it('closes the dialog when Escape key is pressed', async () => {
      render(<CoursesSection />);
      await switchToGridView();
      await waitFor(() => {
        expect(screen.getByText('Panorama Bíblico')).toBeInTheDocument();
      });

      const featuredArticle = screen.getByText('Panorama Bíblico').closest('article');
      fireEvent.click(featuredArticle!);

      expect(screen.getByText('Inscreva-se Agora')).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(screen.queryByText('Inscreva-se Agora')).not.toBeInTheDocument();
    });

    it('renders the logo image in dialog', async () => {
      render(<CoursesSection />);
      await switchToGridView();
      await waitFor(() => {
        expect(screen.getByText('Panorama Bíblico')).toBeInTheDocument();
      });

      const featuredArticle = screen.getByText('Panorama Bíblico').closest('article');
      fireEvent.click(featuredArticle!);

      expect(screen.getByAltText('Logo 2ª IPI de Maringá')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('shows empty message when no courses available', async () => {
      (getPublishedCourses as jest.Mock).mockResolvedValue([]);
      render(<CoursesSection />);
      await waitFor(() => {
        expect(screen.getByText(/Em breve novos cursos/)).toBeInTheDocument();
      });
    });
  });

  describe('Error handling', () => {
    it('handles fetch error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (getPublishedCourses as jest.Mock).mockRejectedValue(new Error('Network error'));
      render(<CoursesSection />);
      await waitFor(() => {
        expect(screen.getByText(/Em breve novos cursos/)).toBeInTheDocument();
      });
      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch courses:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('View Toggle', () => {
    it('renders the carousel view by default', async () => {
      render(<CoursesSection />);
      await waitFor(() => {
        expect(screen.getByText(/Role ou clique para navegar/)).toBeInTheDocument();
      });
    });

    it('switches between grid and carousel views', async () => {
      render(<CoursesSection />);
      await switchToGridView();
      await waitFor(() => {
        expect(screen.queryByText(/Role ou clique para navegar/)).not.toBeInTheDocument();
      });

      // Switch back to carousel
      fireEvent.click(screen.getByText('Carrossel'));
      await waitFor(() => {
        expect(screen.getByText(/Role ou clique para navegar/)).toBeInTheDocument();
      });
    });
  });

  describe('Course with unknown level', () => {
    it('renders default badge for unknown level', async () => {
      const coursesWithUnknownLevel = [
        { ...mockCourses[0], level: 'Especialista' },
      ];
      (getPublishedCourses as jest.Mock).mockResolvedValue(coursesWithUnknownLevel);
      render(<CoursesSection />);
      await switchToGridView();
      await waitFor(() => {
        expect(screen.getByText('Especialista')).toBeInTheDocument();
      });
    });
  });
});
