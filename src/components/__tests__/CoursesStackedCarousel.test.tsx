import { render, screen, fireEvent, act } from '@testing-library/react';
import { CoursesStackedCarousel } from '../CoursesStackedCarousel';
import type { CourseData } from '@/lib/courses';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

const mockCourses: CourseData[] = [
  {
    id: 'panorama-biblico',
    title: 'Panorama Bíblico',
    description: 'Uma visão geral de toda a Bíblia.',
    fullDescription: '',
    duration: '12 semanas',
    level: 'Iniciante',
    startDate: '10 Fev 2026',
    startDateISO: '2026-02-10',
    endDate: '4 Mai 2026',
    endDateISO: '2026-05-04',
    status: 'em-andamento' as const,
    image: '/images/panorama.jpg',
    instructor: 'Prof. Silva',
    totalHours: '',
    format: 'Online',
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
    id: 'fundamentos-da-fe',
    title: 'Fundamentos da Fé',
    description: 'Estudo das doutrinas essenciais.',
    fullDescription: '',
    duration: '8 semanas',
    level: 'Intermediário',
    startDate: '11 Mai 2026',
    startDateISO: '2026-05-11',
    endDate: '6 Jul 2026',
    endDateISO: '2026-07-06',
    status: 'proximo' as const,
    image: '/images/fundamentos.jpg',
    instructor: '',
    totalHours: '',
    format: 'Online',
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
    id: 'hermeneutica',
    title: 'Hermenêutica Bíblica',
    description: 'Aprenda princípios de interpretação bíblica.',
    fullDescription: '',
    duration: '10 semanas',
    level: 'Avançado',
    startDate: '13 Jul 2026',
    startDateISO: '2026-07-13',
    endDate: '21 Set 2026',
    endDateISO: '2026-09-21',
    status: 'em-breve' as const,
    image: '/images/hermeneutica.jpg',
    instructor: '',
    totalHours: '',
    format: 'Online',
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

describe('CoursesStackedCarousel', () => {
  const mockOnCourseClick = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    mockOnCourseClick.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders nothing when courses array is empty', () => {
      const { container } = render(
        <CoursesStackedCarousel courses={[]} onCourseClick={mockOnCourseClick} />,
      );
      expect(container.innerHTML).toBe('');
    });

    it('renders the first course info by default', () => {
      render(
        <CoursesStackedCarousel courses={mockCourses} onCourseClick={mockOnCourseClick} />,
      );
      expect(screen.getByText('Panorama Bíblico')).toBeInTheDocument();
      expect(screen.getByText('Uma visão geral de toda a Bíblia.')).toBeInTheDocument();
    });

    it('renders status badge for first course', () => {
      render(
        <CoursesStackedCarousel courses={mockCourses} onCourseClick={mockOnCourseClick} />,
      );
      expect(screen.getByText('Em Andamento')).toBeInTheDocument();
    });

    it('renders level badge for first course', () => {
      render(
        <CoursesStackedCarousel courses={mockCourses} onCourseClick={mockOnCourseClick} />,
      );
      expect(screen.getByText('Iniciante')).toBeInTheDocument();
    });

    it('renders info items (start date, end date, duration, instructor)', () => {
      render(
        <CoursesStackedCarousel courses={mockCourses} onCourseClick={mockOnCourseClick} />,
      );
      expect(screen.getByText('10 Fev 2026')).toBeInTheDocument();
      expect(screen.getByText('4 Mai 2026')).toBeInTheDocument();
      expect(screen.getByText('12 semanas')).toBeInTheDocument();
      expect(screen.getByText('Prof. Silva')).toBeInTheDocument();
    });

    it('shows "A definir" when instructor is empty', () => {
      render(
        <CoursesStackedCarousel
          courses={[mockCourses[1]]}
          onCourseClick={mockOnCourseClick}
        />,
      );
      expect(screen.getByText('A definir')).toBeInTheDocument();
    });

    it('renders dot indicators for each course', () => {
      render(
        <CoursesStackedCarousel courses={mockCourses} onCourseClick={mockOnCourseClick} />,
      );
      const dots = screen.getAllByRole('button', { name: /Ir para curso/ });
      expect(dots).toHaveLength(3);
    });

    it('renders counter showing 01 / 03', () => {
      render(
        <CoursesStackedCarousel courses={mockCourses} onCourseClick={mockOnCourseClick} />,
      );
      expect(screen.getByText(/01/)).toBeInTheDocument();
      expect(screen.getByText(/03/)).toBeInTheDocument();
    });

    it('renders hint text', () => {
      render(
        <CoursesStackedCarousel courses={mockCourses} onCourseClick={mockOnCourseClick} />,
      );
      expect(screen.getByText(/Role ou clique para navegar/)).toBeInTheDocument();
    });

    it('renders Ver Detalhes button', () => {
      render(
        <CoursesStackedCarousel courses={mockCourses} onCourseClick={mockOnCourseClick} />,
      );
      expect(screen.getByText('Ver Detalhes')).toBeInTheDocument();
    });

    it('renders card images with alt text', () => {
      render(
        <CoursesStackedCarousel courses={mockCourses} onCourseClick={mockOnCourseClick} />,
      );
      expect(screen.getByAltText('Panorama Bíblico')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('advances to next course when stack area is clicked', () => {
      render(
        <CoursesStackedCarousel courses={mockCourses} onCourseClick={mockOnCourseClick} />,
      );

      // Click the stack area (the cursor-pointer select-none div)
      const stackArea = screen.getByText('Panorama Bíblico')
        .closest('.flex.flex-col.items-center.gap-10')!
        .querySelector('.cursor-pointer') as HTMLElement;
      fireEvent.click(stackArea);

      act(() => { jest.advanceTimersByTime(500); });

      expect(screen.getByText('Fundamentos da Fé')).toBeInTheDocument();
      expect(screen.getByText('Próximo')).toBeInTheDocument();
    });

    it('navigates to specific course when dot indicator is clicked', () => {
      render(
        <CoursesStackedCarousel courses={mockCourses} onCourseClick={mockOnCourseClick} />,
      );

      const dot3 = screen.getByLabelText('Ir para curso 3');
      fireEvent.click(dot3);

      act(() => { jest.advanceTimersByTime(500); });

      expect(screen.getByText('Hermenêutica Bíblica')).toBeInTheDocument();
      expect(screen.getByText('Em Breve')).toBeInTheDocument();
      expect(screen.getByText('Avançado')).toBeInTheDocument();
    });

    it('wraps around from last to first course', () => {
      render(
        <CoursesStackedCarousel courses={mockCourses} onCourseClick={mockOnCourseClick} />,
      );

      // Go to last course
      const dot3 = screen.getByLabelText('Ir para curso 3');
      fireEvent.click(dot3);
      act(() => { jest.advanceTimersByTime(500); });

      // Click stack to go next (should wrap to first)
      const stackArea = screen.getByText('Hermenêutica Bíblica')
        .closest('.flex.flex-col.items-center.gap-10')!
        .querySelector('.cursor-pointer') as HTMLElement;
      fireEvent.click(stackArea);
      act(() => { jest.advanceTimersByTime(500); });

      expect(screen.getByText('Panorama Bíblico')).toBeInTheDocument();
    });

    it('does not navigate while animation is in progress', () => {
      render(
        <CoursesStackedCarousel courses={mockCourses} onCourseClick={mockOnCourseClick} />,
      );

      const stackArea = screen.getByText('Panorama Bíblico')
        .closest('.flex.flex-col.items-center.gap-10')!
        .querySelector('.cursor-pointer') as HTMLElement;

      // Click twice rapidly
      fireEvent.click(stackArea);
      fireEvent.click(stackArea);

      act(() => { jest.advanceTimersByTime(500); });

      // Should only advance once
      expect(screen.getByText('Fundamentos da Fé')).toBeInTheDocument();
    });

    it('does not navigate when clicking same dot as current', () => {
      render(
        <CoursesStackedCarousel courses={mockCourses} onCourseClick={mockOnCourseClick} />,
      );

      const dot1 = screen.getByLabelText('Ir para curso 1');
      fireEvent.click(dot1);

      // Should still show first course (no change)
      expect(screen.getByText('Panorama Bíblico')).toBeInTheDocument();
    });
  });

  describe('Touch interactions', () => {
    it('goes next on swipe up (diff > 40)', () => {
      render(
        <CoursesStackedCarousel courses={mockCourses} onCourseClick={mockOnCourseClick} />,
      );

      const stackArea = screen.getByText('Panorama Bíblico')
        .closest('.flex.flex-col.items-center.gap-10')!
        .querySelector('.cursor-pointer') as HTMLElement;

      fireEvent.touchStart(stackArea, { touches: [{ clientY: 200 }] });
      fireEvent.touchEnd(stackArea, { changedTouches: [{ clientY: 100 }] });

      act(() => { jest.advanceTimersByTime(500); });

      expect(screen.getByText('Fundamentos da Fé')).toBeInTheDocument();
    });

    it('goes prev on swipe down (diff < -40)', () => {
      render(
        <CoursesStackedCarousel courses={mockCourses} onCourseClick={mockOnCourseClick} />,
      );

      // First go to second course
      const dot2 = screen.getByLabelText('Ir para curso 2');
      fireEvent.click(dot2);
      act(() => { jest.advanceTimersByTime(500); });

      const stackArea = screen.getByText('Fundamentos da Fé')
        .closest('.flex.flex-col.items-center.gap-10')!
        .querySelector('.cursor-pointer') as HTMLElement;

      fireEvent.touchStart(stackArea, { touches: [{ clientY: 100 }] });
      fireEvent.touchEnd(stackArea, { changedTouches: [{ clientY: 200 }] });

      act(() => { jest.advanceTimersByTime(500); });

      expect(screen.getByText('Panorama Bíblico')).toBeInTheDocument();
    });

    it('ignores small swipes (diff < 40)', () => {
      render(
        <CoursesStackedCarousel courses={mockCourses} onCourseClick={mockOnCourseClick} />,
      );

      const stackArea = screen.getByText('Panorama Bíblico')
        .closest('.flex.flex-col.items-center.gap-10')!
        .querySelector('.cursor-pointer') as HTMLElement;

      fireEvent.touchStart(stackArea, { touches: [{ clientY: 200 }] });
      fireEvent.touchEnd(stackArea, { changedTouches: [{ clientY: 180 }] });

      // Should still show first course
      expect(screen.getByText('Panorama Bíblico')).toBeInTheDocument();
    });
  });

  describe('Wheel interactions', () => {
    it('goes next on scroll down (deltaY > 15)', () => {
      render(
        <CoursesStackedCarousel courses={mockCourses} onCourseClick={mockOnCourseClick} />,
      );

      const stackArea = screen.getByText('Panorama Bíblico')
        .closest('.flex.flex-col.items-center.gap-10')!
        .querySelector('.cursor-pointer') as HTMLElement;

      fireEvent.wheel(stackArea, { deltaY: 30 });

      act(() => { jest.advanceTimersByTime(500); });

      expect(screen.getByText('Fundamentos da Fé')).toBeInTheDocument();
    });

    it('goes prev on scroll up (deltaY < -15)', () => {
      render(
        <CoursesStackedCarousel courses={mockCourses} onCourseClick={mockOnCourseClick} />,
      );

      // First go to second course
      const dot2 = screen.getByLabelText('Ir para curso 2');
      fireEvent.click(dot2);
      act(() => { jest.advanceTimersByTime(500); });

      const stackArea = screen.getByText('Fundamentos da Fé')
        .closest('.flex.flex-col.items-center.gap-10')!
        .querySelector('.cursor-pointer') as HTMLElement;

      fireEvent.wheel(stackArea, { deltaY: -30 });

      act(() => { jest.advanceTimersByTime(500); });

      expect(screen.getByText('Panorama Bíblico')).toBeInTheDocument();
    });

    it('ignores small wheel movements (deltaY < 15)', () => {
      render(
        <CoursesStackedCarousel courses={mockCourses} onCourseClick={mockOnCourseClick} />,
      );

      const stackArea = screen.getByText('Panorama Bíblico')
        .closest('.flex.flex-col.items-center.gap-10')!
        .querySelector('.cursor-pointer') as HTMLElement;

      fireEvent.wheel(stackArea, { deltaY: 5 });

      // Should still show first course
      expect(screen.getByText('Panorama Bíblico')).toBeInTheDocument();
    });
  });

  describe('Click interactions', () => {
    it('calls onCourseClick when Ver Detalhes button is clicked', () => {
      render(
        <CoursesStackedCarousel courses={mockCourses} onCourseClick={mockOnCourseClick} />,
      );

      fireEvent.click(screen.getByText('Ver Detalhes'));

      expect(mockOnCourseClick).toHaveBeenCalledWith(mockCourses[0]);
    });

    it('calls onCourseClick when top card is clicked', () => {
      render(
        <CoursesStackedCarousel courses={mockCourses} onCourseClick={mockOnCourseClick} />,
      );

      // The top card image
      const topCardImg = screen.getByAltText('Panorama Bíblico');
      // Click on the card's parent wrapper (the one with the onClick)
      const cardWrapper = topCardImg.closest('.absolute.inset-0') as HTMLElement;
      fireEvent.click(cardWrapper);

      expect(mockOnCourseClick).toHaveBeenCalledWith(mockCourses[0]);
    });
  });

  describe('Status and level badges', () => {
    it('renders all status types correctly', () => {
      // em-andamento is tested with first course
      render(
        <CoursesStackedCarousel courses={mockCourses} onCourseClick={mockOnCourseClick} />,
      );
      expect(screen.getByText('Em Andamento')).toBeInTheDocument();

      // Navigate to proximo
      const dot2 = screen.getByLabelText('Ir para curso 2');
      fireEvent.click(dot2);
      act(() => { jest.advanceTimersByTime(500); });
      expect(screen.getByText('Próximo')).toBeInTheDocument();
      expect(screen.getByText('Intermediário')).toBeInTheDocument();

      // Navigate to em-breve
      const dot3 = screen.getByLabelText('Ir para curso 3');
      fireEvent.click(dot3);
      act(() => { jest.advanceTimersByTime(500); });
      expect(screen.getByText('Em Breve')).toBeInTheDocument();
      expect(screen.getByText('Avançado')).toBeInTheDocument();
    });

    it('renders default level badge for unknown level', () => {
      const unknownLevelCourse = { ...mockCourses[0], level: 'Especialista' };
      render(
        <CoursesStackedCarousel
          courses={[unknownLevelCourse]}
          onCourseClick={mockOnCourseClick}
        />,
      );
      expect(screen.getByText('Especialista')).toBeInTheDocument();
    });
  });
});
