import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CoursePage from '@/app/course/[id]/page';
import { useParams, useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock Firebase
jest.mock('@/lib/firebase', () => ({
  auth: {},
  signOut: jest.fn(),
}));

// Mock AuthContext
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ user: null, userProfile: null, loading: false, refreshProfile: jest.fn() }),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock course data from Firestore
const mockCourse = {
  id: 'fundamentos-da-fe',
  title: 'Fundamentos da Fé',
  description: 'Estudo das doutrinas essenciais da fé cristã reformada.',
  fullDescription: 'Este curso oferece um estudo abrangente das doutrinas essenciais da fé cristã.',
  image: '/images/courses/fundamentos-da-fe.jpg',
  level: 'Iniciante',
  duration: '8 semanas',
  startDate: '11 Mai 2026',
  endDate: '6 Jul 2026',
  status: 'proximo',
  instructor: 'Rev. João Silva',
  totalHours: '32h de conteúdo',
  format: 'Online ao vivo',
  pricePix: 250,
  priceCard: 275,
  installments: 3,
  order: 1,
  published: true,
  objectives: [
    'Compreender as doutrinas essenciais da fé cristã',
    'Conhecer os fundamentos bíblicos da teologia reformada',
  ],
  syllabus: [
    'A Revelação de Deus - A Escritura Sagrada',
    'A Doutrina de Deus - Atributos Divinos',
  ],
  requirements: [
    'Não há pré-requisitos',
  ],
};

jest.mock('@/lib/courses', () => ({
  getCourse: jest.fn((id: string) => {
    if (id === 'fundamentos-da-fe') return Promise.resolve(mockCourse);
    return Promise.resolve(null);
  }),
}));

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockedUseParams = useParams as jest.MockedFunction<typeof useParams>;
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('Course Detail Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseParams.mockReturnValue({ id: 'fundamentos-da-fe' });
    mockedUseRouter.mockReturnValue({
      push: mockPush,
      back: mockBack,
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    });
  });

  it('renders course details correctly', async () => {
    render(<CoursePage />);

    await waitFor(() => {
      expect(screen.getByText('Fundamentos da Fé')).toBeInTheDocument();
    });

    expect(screen.getByText(/8 semanas/i)).toBeInTheDocument();
    expect(screen.getByText(/Iniciante/i)).toBeInTheDocument();
    expect(screen.getByText(/11 Mai 2026/i)).toBeInTheDocument();
    expect(screen.getByText('Rev. João Silva')).toBeInTheDocument();
    expect(screen.getByText('Instrutor')).toBeInTheDocument();
  });

  it('displays all three Jesus images', async () => {
    render(<CoursePage />);

    await waitFor(() => {
      expect(screen.getByText('Fundamentos da Fé')).toBeInTheDocument();
    });

    const images = screen.getAllByRole('img');

    const jesusTeaching = images.find((img) =>
      img.getAttribute('src')?.includes('jesus-teaching.jpg')
    );
    const jesusPraying = images.find((img) =>
      img.getAttribute('src')?.includes('jesus-praying.jpg')
    );
    const jesusShepherd = images.find((img) =>
      img.getAttribute('src')?.includes('jesus-shepherd.jpg')
    );

    expect(jesusTeaching).toBeInTheDocument();
    expect(jesusPraying).toBeInTheDocument();
    expect(jesusShepherd).toBeInTheDocument();
  });

  it('displays scripture quotes', async () => {
    render(<CoursePage />);

    await waitFor(() => {
      expect(screen.getByText(/Ensinando-os a observar todas as coisas/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Vinde a mim, todos os que estais cansados/i)).toBeInTheDocument();
    expect(screen.getByText(/Eu sou o bom pastor/i)).toBeInTheDocument();
  });

  it('displays professor image', async () => {
    render(<CoursePage />);

    await waitFor(() => {
      expect(screen.getByText('Fundamentos da Fé')).toBeInTheDocument();
    });

    const images = screen.getAllByRole('img');
    const professorImage = images.find((img) =>
      img.getAttribute('src')?.includes('professor-placeholder.jpg')
    );

    expect(professorImage).toBeInTheDocument();
  });

  it('handles enrollment flow', async () => {
    render(<CoursePage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Inscrever-se Agora/i })).toBeInTheDocument();
    });

    const enrollButton = screen.getByRole('button', { name: /Inscrever-se Agora/i });
    fireEvent.click(enrollButton);

    expect(mockPush).toHaveBeenCalledWith('/course/fundamentos-da-fe/enrollment');
  });

  it('navigates back when back button is clicked', async () => {
    render(<CoursePage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Voltar/i })).toBeInTheDocument();
    });

    const backButton = screen.getByRole('button', { name: /Voltar/i });
    fireEvent.click(backButton);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('displays course objectives', async () => {
    render(<CoursePage />);

    await waitFor(() => {
      expect(screen.getByText(/Objetivos do Curso/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Compreender as doutrinas essenciais da fé cristã/i)).toBeInTheDocument();
  });

  it('displays program content', async () => {
    render(<CoursePage />);

    await waitFor(() => {
      const conteudo = screen.getAllByText(/Conteúdo Programático/i);
      expect(conteudo.length).toBeGreaterThan(0);
    });

    expect(screen.getByText(/A Revelação de Deus - A Escritura Sagrada/i)).toBeInTheDocument();
  });

  it('displays requirements', async () => {
    render(<CoursePage />);

    await waitFor(() => {
      const requisitos = screen.getAllByText(/Requisitos/i);
      expect(requisitos.length).toBeGreaterThan(0);
    });

    expect(screen.getByText(/Não há pré-requisitos/i)).toBeInTheDocument();
  });

  it('shows not found message for invalid course ID', async () => {
    mockedUseParams.mockReturnValue({ id: 'invalid-course-id' });

    render(<CoursePage />);

    await waitFor(() => {
      expect(screen.getByText(/Curso não encontrado/i)).toBeInTheDocument();
    });
  });

  it('displays course hero image', async () => {
    render(<CoursePage />);

    await waitFor(() => {
      expect(screen.getByText('Fundamentos da Fé')).toBeInTheDocument();
    });

    const images = screen.getAllByRole('img');
    const heroImage = images.find((img) =>
      img.getAttribute('src')?.includes('fundamentos-da-fe.jpg')
    );

    expect(heroImage).toBeInTheDocument();
  });
});
