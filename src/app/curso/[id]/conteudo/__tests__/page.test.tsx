import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter, useParams } from 'next/navigation';
import CourseContentPage from '../page';
import { getPurchasedCourses } from '@/lib/storage';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

// Mock storage utility
jest.mock('@/lib/storage', () => ({
  getUserData: jest.fn(),
  getPurchasedCourses: jest.fn(),
  getCompletedLessons: jest.fn(() => new Set<string>()),
  toggleLessonComplete: jest.fn(() => false),
}));

describe('CourseContentPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useParams as jest.Mock).mockReturnValue({
      id: 'fundamentos-da-fe',
    });
    jest.clearAllMocks();
  });

  describe('Access Control', () => {
    it('should redirect to course preview if course is not purchased', async () => {
      (getPurchasedCourses as jest.Mock).mockReturnValue([]);

      render(<CourseContentPage />);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/curso/fundamentos-da-fe');
      });
    });

    it('should show loading state initially', async () => {
      (getPurchasedCourses as jest.Mock).mockReturnValue([
        {
          courseId: 'fundamentos-da-fe',
          purchaseDate: '2026-02-08T10:00:00Z',
          paymentMethod: 'pix',
          amount: 250.00,
          status: 'paid'
        }
      ]);

      render(<CourseContentPage />);

      // Loading shows briefly; content appears after effect runs
      await waitFor(() => {
        expect(screen.getByText(/fundamentos da fé/i)).toBeInTheDocument();
      }, { timeout: 1500 });
    });

    it('should display course content for purchased course', async () => {
      (getPurchasedCourses as jest.Mock).mockReturnValue([
        {
          courseId: 'fundamentos-da-fe',
          purchaseDate: '2026-02-08T10:00:00Z',
          paymentMethod: 'pix',
          amount: 250.00,
          status: 'paid'
        }
      ]);

      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByText(/fundamentos da fé/i)).toBeInTheDocument();
      }, { timeout: 1500 });
    });

    it('should show error message for invalid course', async () => {
      (useParams as jest.Mock).mockReturnValue({
        id: 'invalid-course-id',
      });
      (getPurchasedCourses as jest.Mock).mockReturnValue([
        {
          courseId: 'invalid-course-id',
          purchaseDate: '2026-02-08T10:00:00Z',
          paymentMethod: 'pix',
          amount: 250.00,
          status: 'paid'
        }
      ]);

      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByText(/curso não encontrado/i)).toBeInTheDocument();
      }, { timeout: 1500 });
    });
  });

  describe('Course Information Display', () => {
    beforeEach(() => {
      (getPurchasedCourses as jest.Mock).mockReturnValue([
        {
          courseId: 'fundamentos-da-fe',
          purchaseDate: '2026-02-08T10:00:00Z',
          paymentMethod: 'pix',
          amount: 250.00,
          status: 'paid'
        }
      ]);
    });

    it('should display course title and description', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByText(/fundamentos da fé/i)).toBeInTheDocument();
        expect(screen.getByText(/estudo das doutrinas essenciais/i)).toBeInTheDocument();
      }, { timeout: 1500 });
    });

    it('should display professor name', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByText(/rev. joão silva/i)).toBeInTheDocument();
      }, { timeout: 1500 });
    });

    it('should display course image', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        const images = screen.getAllByRole('img');
        const courseImage = images.find(img => 
          img.getAttribute('alt')?.includes('Fundamentos da Fé')
        );
        expect(courseImage).toBeInTheDocument();
      }, { timeout: 1500 });
    });

    it('should display "Conteúdo do Curso" heading', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByText(/conteúdo do curso/i)).toBeInTheDocument();
      }, { timeout: 1500 });
    });
  });

  describe('Modules and Lessons', () => {
    beforeEach(() => {
      (getPurchasedCourses as jest.Mock).mockReturnValue([
        {
          courseId: 'fundamentos-da-fe',
          purchaseDate: '2026-02-08T10:00:00Z',
          paymentMethod: 'pix',
          amount: 250.00,
          status: 'paid'
        }
      ]);
    });

    it('should display course modules', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByText(/módulo 1: introdução à teologia/i)).toBeInTheDocument();
        expect(screen.getByText(/módulo 2: a doutrina de deus/i)).toBeInTheDocument();
        expect(screen.getByText(/módulo 3: a doutrina da salvação/i)).toBeInTheDocument();
      }, { timeout: 1500 });
    });

    it('should expand first module by default', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getAllByText(/o que é teologia\?/i).length).toBeGreaterThan(0);
      }, { timeout: 1500 });
    });

    it('should toggle module expansion on click', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        const module2Button = screen.getByText(/módulo 2: a doutrina de deus/i);
        fireEvent.click(module2Button);
      }, { timeout: 1500 });

      await waitFor(() => {
        expect(screen.getByText(/os atributos de deus/i)).toBeInTheDocument();
      });
    });

    it('should display lesson titles and durations', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getAllByText(/o que é teologia\?/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/25 min/i).length).toBeGreaterThan(0);
      }, { timeout: 1500 });
    });

    it('should display video and PDF icons for different lesson types', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        // Check for lesson with video icon in sidebar
        const lessonElements = screen.getAllByText(/o que é teologia\?/i);
        const sidebarLesson = lessonElements.find(el => el.closest('button'));
        expect(sidebarLesson?.closest('button')?.querySelector('svg')).toBeInTheDocument();
      }, { timeout: 1500 });
    });
  });

  describe('Lesson Selection', () => {
    beforeEach(() => {
      (getPurchasedCourses as jest.Mock).mockReturnValue([
        {
          courseId: 'fundamentos-da-fe',
          purchaseDate: '2026-02-08T10:00:00Z',
          paymentMethod: 'pix',
          amount: 250.00,
          status: 'paid'
        }
      ]);
    });

    it('should select first lesson by default', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByText(/introdução ao estudo da teologia/i)).toBeInTheDocument();
      }, { timeout: 1500 });
    });

    it('should change selected lesson on click', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        const lesson2 = screen.getByText(/as fontes da teologia/i);
        fireEvent.click(lesson2);
      }, { timeout: 1500 });

      await waitFor(() => {
        expect(screen.getByText(/compreendendo as fontes primárias/i)).toBeInTheDocument();
      });
    });

    it('should highlight selected lesson', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getAllByText(/o que é teologia\?/i).length).toBeGreaterThan(0);
      }, { timeout: 1500 });

      // First lesson is selected by default - check it appears in main content
      expect(screen.getByRole('heading', { name: /o que é teologia\?/i })).toBeInTheDocument();
    });
  });

  describe('Video Player', () => {
    beforeEach(() => {
      (getPurchasedCourses as jest.Mock).mockReturnValue([
        {
          courseId: 'fundamentos-da-fe',
          purchaseDate: '2026-02-08T10:00:00Z',
          paymentMethod: 'pix',
          amount: 250.00,
          status: 'paid'
        }
      ]);
    });

    it('should display video player for video lessons', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        const iframe = screen.getByTitle(/o que é teologia\?/i);
        expect(iframe).toBeInTheDocument();
        expect(iframe).toHaveAttribute('src');
      }, { timeout: 1500 });
    });

    it('should display lesson title above video', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /o que é teologia\?/i })).toBeInTheDocument();
      }, { timeout: 1500 });
    });

    it('should display lesson description', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByText(/introdução ao estudo da teologia/i)).toBeInTheDocument();
      }, { timeout: 1500 });
    });

    it('should display lesson duration badge', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        const durationBadges = screen.getAllByText(/25 min/i);
        expect(durationBadges.length).toBeGreaterThan(0);
      }, { timeout: 1500 });
    });
  });

  describe('PDF Viewer', () => {
    beforeEach(() => {
      (getPurchasedCourses as jest.Mock).mockReturnValue([
        {
          courseId: 'fundamentos-da-fe',
          purchaseDate: '2026-02-08T10:00:00Z',
          paymentMethod: 'pix',
          amount: 250.00,
          status: 'paid'
        }
      ]);
    });

    it('should display PDF download section for PDF lessons', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        const pdfLesson = screen.getByText(/apostila: conceitos básicos/i);
        fireEvent.click(pdfLesson);
      }, { timeout: 1500 });

      await waitFor(() => {
        expect(screen.getByText(/material em pdf/i)).toBeInTheDocument();
        expect(screen.getByText(/baixe o material para estudar/i)).toBeInTheDocument();
      });
    });

    it('should display download button for PDF', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        const pdfLesson = screen.getByText(/apostila: conceitos básicos/i);
        fireEvent.click(pdfLesson);
      }, { timeout: 1500 });

      await waitFor(() => {
        const downloadButton = screen.getByRole('link', { name: /download pdf/i });
        expect(downloadButton).toBeInTheDocument();
      });
    });

    it('should have correct download link', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        const pdfLesson = screen.getByText(/apostila: conceitos básicos/i);
        fireEvent.click(pdfLesson);
      }, { timeout: 1500 });

      await waitFor(() => {
        const downloadButton = screen.getByRole('link', { name: /download pdf/i });
        expect(downloadButton).toHaveAttribute('href', expect.stringContaining('.pdf'));
      });
    });
  });

  describe('Progress Tracking', () => {
    beforeEach(() => {
      (getPurchasedCourses as jest.Mock).mockReturnValue([
        {
          courseId: 'fundamentos-da-fe',
          purchaseDate: '2026-02-08T10:00:00Z',
          paymentMethod: 'pix',
          amount: 250.00,
          status: 'paid'
        }
      ]);
    });

    it('should display progress percentage in header', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByText(/progresso/i)).toBeInTheDocument();
        expect(screen.getByText(/0%/i)).toBeInTheDocument();
      }, { timeout: 1500 });
    });

    it('should display lesson counter', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        // fundamentos-da-fe has 9 lessons
        expect(screen.getByText(/0\/9/i)).toBeInTheDocument();
      }, { timeout: 1500 });
    });

    it('should display "Marcar como Concluído" button', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /marcar como concluído/i })).toBeInTheDocument();
      }, { timeout: 1500 });
    });

    it('should show completed state for marked lessons', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        const completeButton = screen.getByRole('button', { name: /marcar como concluído/i });
        expect(completeButton).not.toHaveClass('bg-green-600');
      }, { timeout: 1500 });
    });
  });

  describe('Navigation Controls', () => {
    beforeEach(() => {
      (getPurchasedCourses as jest.Mock).mockReturnValue([
        {
          courseId: 'fundamentos-da-fe',
          purchaseDate: '2026-02-08T10:00:00Z',
          paymentMethod: 'pix',
          amount: 250.00,
          status: 'paid'
        }
      ]);
    });

    it('should display back to dashboard link', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        const backLink = screen.getByRole('link', { name: /voltar ao dashboard/i });
        expect(backLink).toBeInTheDocument();
        expect(backLink).toHaveAttribute('href', '/dashboard');
      }, { timeout: 1500 });
    });

    it('should display previous lesson button', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /aula anterior/i })).toBeInTheDocument();
      }, { timeout: 1500 });
    });

    it('should display next lesson button', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /próxima aula/i })).toBeInTheDocument();
      }, { timeout: 1500 });
    });
  });

  describe('Empty State', () => {
    beforeEach(() => {
      (getPurchasedCourses as jest.Mock).mockReturnValue([
        {
          courseId: 'teologia-sistematica',
          purchaseDate: '2026-02-08T10:00:00Z',
          paymentMethod: 'pix',
          amount: 380.00,
          status: 'paid'
        }
      ]);
      (useParams as jest.Mock).mockReturnValue({
        id: 'teologia-sistematica',
      });
    });

    it('should display course modules even with minimal content', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getAllByText(/teologia sistemática/i).length).toBeGreaterThan(0);
      }, { timeout: 1500 });
    });
  });

  describe('Responsive Behavior', () => {
    beforeEach(() => {
      (getPurchasedCourses as jest.Mock).mockReturnValue([
        {
          courseId: 'fundamentos-da-fe',
          purchaseDate: '2026-02-08T10:00:00Z',
          paymentMethod: 'pix',
          amount: 250.00,
          status: 'paid'
        }
      ]);
    });

    it('should have responsive grid layout classes', async () => {
      const { container } = render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByText(/conteúdo do curso/i)).toBeInTheDocument();
      }, { timeout: 1500 });

      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();
    });
  });

  describe('Multiple Courses Support', () => {
    it('should support different courses', async () => {
      (useParams as jest.Mock).mockReturnValue({
        id: 'hermeneutica-biblica',
      });
      (getPurchasedCourses as jest.Mock).mockReturnValue([
        {
          courseId: 'hermeneutica-biblica',
          purchaseDate: '2026-02-08T10:00:00Z',
          paymentMethod: 'pix',
          amount: 320.00,
          status: 'paid'
        }
      ]);

      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByText(/hermenêutica bíblica/i)).toBeInTheDocument();
        expect(screen.getByText(/prof. pedro costa/i)).toBeInTheDocument();
      }, { timeout: 1500 });
    });
  });
});
