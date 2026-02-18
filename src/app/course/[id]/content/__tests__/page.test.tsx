import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter, useParams } from 'next/navigation';
import CourseContentPage from '../page';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

// Mock Firebase
jest.mock('@/lib/firebase', () => ({
  auth: {},
  signOut: jest.fn(),
}));

// Mock AuthContext (now needed since conteudo page uses useAuth)
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { uid: 'test-uid' }, userProfile: null, loading: false, refreshProfile: jest.fn() }),
}));

// Mock storage utility (now async with uid)
jest.mock('@/lib/storage', () => ({
  getPurchasedCourses: jest.fn(() => Promise.resolve([])),
  getCompletedLessons: jest.fn(() => Promise.resolve(new Set<string>())),
  toggleLessonComplete: jest.fn(() => Promise.resolve(false)),
}));

// Mock course data from Firestore
const mockCourse = {
  id: 'fundamentos-da-fe',
  title: 'Fundamentos da Fé',
  description: 'Estudo das doutrinas essenciais da fé cristã reformada.',
  image: '/images/courses/fundamentos-da-fe.jpg',
  level: 'Iniciante',
  duration: '8 semanas',
  startDate: '11 Mai 2026',
  endDate: '6 Jul 2026',
  status: 'proximo',
  instructor: 'Rev. João Silva',
  pricePix: 250, priceCard: 275, installments: 3,
  order: 1, published: true,
  fullDescription: '', totalHours: '', format: '',
  objectives: [], syllabus: [], requirements: [],
};

const mockModules = [
  {
    id: 'modulo-1',
    title: 'Módulo 1: Introdução à Teologia',
    order: 1,
    lessons: [
      { id: 'aula-1', title: 'O que é Teologia?', duration: '25 min', type: 'video', url: 'https://youtube.com/embed/test', description: 'Introdução ao estudo da teologia e sua importância para a vida cristã.', order: 1 },
      { id: 'aula-2', title: 'As Fontes da Teologia', duration: '30 min', type: 'video', url: 'https://youtube.com/embed/test', description: 'Compreendendo as fontes primárias e secundárias da teologia.', order: 2 },
      { id: 'pdf-1', title: 'Apostila: Conceitos Básicos', duration: '15 páginas', type: 'pdf', url: '/materials/fundamentos-modulo1.pdf', description: 'Material complementar com definições e conceitos fundamentais.', order: 3 },
    ],
  },
  {
    id: 'modulo-2',
    title: 'Módulo 2: A Doutrina de Deus',
    order: 2,
    lessons: [
      { id: 'aula-3', title: 'Os Atributos de Deus', duration: '35 min', type: 'video', url: 'https://youtube.com/embed/test', description: 'Estudo dos atributos comunicáveis e incomunicáveis de Deus.', order: 1 },
      { id: 'aula-4', title: 'A Trindade', duration: '40 min', type: 'video', url: 'https://youtube.com/embed/test', description: 'Compreendendo a doutrina trinitariana nas Escrituras.', order: 2 },
      { id: 'pdf-2', title: 'Leitura: Confissão de Fé', duration: '20 páginas', type: 'pdf', url: '/materials/fundamentos-modulo2.pdf', description: 'Trechos selecionados da Confissão de Fé sobre Deus.', order: 3 },
    ],
  },
  {
    id: 'modulo-3',
    title: 'Módulo 3: A Doutrina da Salvação',
    order: 3,
    lessons: [
      { id: 'aula-5', title: 'O Pecado e suas Consequências', duration: '30 min', type: 'video', url: 'https://youtube.com/embed/test', description: 'Entendendo a queda da humanidade e suas implicações.', order: 1 },
      { id: 'aula-6', title: 'A Obra de Cristo', duration: '45 min', type: 'video', url: 'https://youtube.com/embed/test', description: 'A pessoa e obra redentora de Jesus Cristo.', order: 2 },
      { id: 'aula-7', title: 'Justificação pela Fé', duration: '35 min', type: 'video', url: 'https://youtube.com/embed/test', description: 'Como somos justificados diante de Deus.', order: 3 },
    ],
  },
];

const mockHermeneuticaCourse = {
  id: 'hermeneutica-biblica',
  title: 'Hermenêutica Bíblica',
  description: 'Princípios e métodos para interpretação das Escrituras.',
  image: '/images/courses/hermeneutica.jpg',
  instructor: 'Prof. Pedro Costa',
  level: 'Intermediário', duration: '10 semanas', startDate: '', endDate: '', status: 'em-breve',
  pricePix: 320, priceCard: 350, installments: 3, order: 3, published: true,
  fullDescription: '', totalHours: '', format: '', objectives: [], syllabus: [], requirements: [],
};

const mockHermeneuticaModules = [
  {
    id: 'modulo-1',
    title: 'Módulo 1: Princípios de Interpretação',
    order: 1,
    lessons: [
      { id: 'aula-1', title: 'Contexto Histórico', duration: '35 min', type: 'video', url: 'https://youtube.com/embed/test', description: 'A importância do contexto histórico na interpretação.', order: 1 },
    ],
  },
];

// Mock courses module
jest.mock('@/lib/courses', () => ({
  getCourse: jest.fn((id: string) => {
    if (id === 'fundamentos-da-fe') return Promise.resolve(mockCourse);
    if (id === 'hermeneutica-biblica') return Promise.resolve(mockHermeneuticaCourse);
    return Promise.resolve(null);
  }),
  getCourseModules: jest.fn((id: string) => {
    if (id === 'fundamentos-da-fe') return Promise.resolve(mockModules);
    if (id === 'hermeneutica-biblica') return Promise.resolve(mockHermeneuticaModules);
    return Promise.resolve([]);
  }),
}));

describe('CourseContentPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useParams as jest.Mock).mockReturnValue({ id: 'fundamentos-da-fe' });
    jest.clearAllMocks();
  });

  function mockPurchased(courseId = 'fundamentos-da-fe') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getPurchasedCourses } = require('@/lib/storage');
    (getPurchasedCourses as jest.Mock).mockResolvedValue([
      { courseId, purchaseDate: '2026-02-08T10:00:00Z', paymentMethod: 'pix', amount: 250.00, status: 'paid' }
    ]);
  }

  describe('Access Control', () => {
    it('should redirect to course preview if course is not purchased', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/course/fundamentos-da-fe');
      });
    });

    it('should display course content for purchased course', async () => {
      mockPurchased();
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByText(/fundamentos da fé/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should show error message for invalid course', async () => {
      (useParams as jest.Mock).mockReturnValue({ id: 'invalid-course-id' });
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getPurchasedCourses } = require('@/lib/storage');
      (getPurchasedCourses as jest.Mock).mockResolvedValue([
        { courseId: 'invalid-course-id', purchaseDate: '2026-02-08T10:00:00Z', paymentMethod: 'pix', amount: 250, status: 'paid' }
      ]);

      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByText(/curso não encontrado/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });

  describe('Course Information Display', () => {
    beforeEach(() => mockPurchased());

    it('should display course title and description', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByText(/fundamentos da fé/i)).toBeInTheDocument();
        expect(screen.getByText(/estudo das doutrinas essenciais/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should display professor name', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByText(/rev. joão silva/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should display "Conteúdo do Curso" heading', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByText(/conteúdo do curso/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });

  describe('Modules and Lessons', () => {
    beforeEach(() => mockPurchased());

    it('should display course modules', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByText(/módulo 1: introdução à teologia/i)).toBeInTheDocument();
        expect(screen.getByText(/módulo 2: a doutrina de deus/i)).toBeInTheDocument();
        expect(screen.getByText(/módulo 3: a doutrina da salvação/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should expand first module by default', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getAllByText(/o que é teologia\?/i).length).toBeGreaterThan(0);
      }, { timeout: 2000 });
    });

    it('should toggle module expansion on click', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByText(/módulo 2: a doutrina de deus/i)).toBeInTheDocument();
      }, { timeout: 2000 });

      fireEvent.click(screen.getByText(/módulo 2: a doutrina de deus/i));

      await waitFor(() => {
        expect(screen.getByText(/os atributos de deus/i)).toBeInTheDocument();
      });
    });
  });

  describe('Lesson Selection', () => {
    beforeEach(() => mockPurchased());

    it('should select first lesson by default', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByText(/introdução ao estudo da teologia/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should change selected lesson on click', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByText(/as fontes da teologia/i)).toBeInTheDocument();
      }, { timeout: 2000 });

      fireEvent.click(screen.getByText(/as fontes da teologia/i));

      await waitFor(() => {
        expect(screen.getByText(/compreendendo as fontes primárias/i)).toBeInTheDocument();
      });
    });
  });

  describe('Video Player', () => {
    beforeEach(() => mockPurchased());

    it('should display video player for video lessons', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        const iframe = screen.getByTitle(/o que é teologia\?/i);
        expect(iframe).toBeInTheDocument();
        expect(iframe).toHaveAttribute('src');
      }, { timeout: 2000 });
    });
  });

  describe('PDF Viewer', () => {
    beforeEach(() => mockPurchased());

    it('should display PDF download section for PDF lessons', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByText(/apostila: conceitos básicos/i)).toBeInTheDocument();
      }, { timeout: 2000 });

      fireEvent.click(screen.getByText(/apostila: conceitos básicos/i));

      await waitFor(() => {
        expect(screen.getByText(/material em pdf/i)).toBeInTheDocument();
      });
    });

    it('should display download button for PDF', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByText(/apostila: conceitos básicos/i)).toBeInTheDocument();
      }, { timeout: 2000 });

      fireEvent.click(screen.getByText(/apostila: conceitos básicos/i));

      await waitFor(() => {
        const downloadButton = screen.getByRole('link', { name: /download pdf/i });
        expect(downloadButton).toBeInTheDocument();
      });
    });
  });

  describe('Progress Tracking', () => {
    beforeEach(() => mockPurchased());

    it('should display progress percentage in header', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByText(/progresso/i)).toBeInTheDocument();
        expect(screen.getByText(/0%/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should display lesson counter', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByText(/0\/9/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should display "Marcar como Concluído" button', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /marcar como concluído/i })).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });

  describe('Navigation Controls', () => {
    beforeEach(() => mockPurchased());

    it('should display back to dashboard link', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        const backLink = screen.getByRole('link', { name: /voltar ao dashboard/i });
        expect(backLink).toBeInTheDocument();
        expect(backLink).toHaveAttribute('href', '/dashboard');
      }, { timeout: 2000 });
    });

    it('should display previous and next lesson buttons', async () => {
      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /aula anterior/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /próxima aula/i })).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });

  describe('Multiple Courses Support', () => {
    it('should support different courses', async () => {
      (useParams as jest.Mock).mockReturnValue({ id: 'hermeneutica-biblica' });
      mockPurchased('hermeneutica-biblica');

      render(<CourseContentPage />);

      await waitFor(() => {
        expect(screen.getByText(/hermenêutica bíblica/i)).toBeInTheDocument();
        expect(screen.getByText(/prof. pedro costa/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });
});
