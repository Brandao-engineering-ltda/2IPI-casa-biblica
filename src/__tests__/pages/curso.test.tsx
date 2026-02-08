import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import CoursePage from '@/app/curso/[id]/page';
import { useParams, useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
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

  it('renders course details correctly', () => {
    render(<CoursePage />);

    // Check course title
    expect(screen.getByText('Fundamentos da Fé')).toBeInTheDocument();

    // Check course metadata
    expect(screen.getByText(/8 semanas/i)).toBeInTheDocument();
    expect(screen.getByText(/Iniciante/i)).toBeInTheDocument();
    expect(screen.getByText(/11 Mai 2026/i)).toBeInTheDocument();

    // Check professor
    expect(screen.getByText('Rev. João Silva')).toBeInTheDocument();
    expect(screen.getByText('Instrutor')).toBeInTheDocument();
  });

  it('displays all three Jesus images', () => {
    render(<CoursePage />);

    const images = screen.getAllByRole('img');
    
    // Check for Jesus images
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

  it('displays scripture quotes', () => {
    render(<CoursePage />);

    // Check for scripture quotes
    expect(screen.getByText(/Ensinando-os a observar todas as coisas/i)).toBeInTheDocument();
    expect(screen.getByText(/Vinde a mim, todos os que estais cansados/i)).toBeInTheDocument();
    expect(screen.getByText(/Eu sou o bom pastor/i)).toBeInTheDocument();
  });

  it('displays professor image', () => {
    render(<CoursePage />);

    const images = screen.getAllByRole('img');
    const professorImage = images.find((img) => 
      img.getAttribute('src')?.includes('professor-placeholder.jpg')
    );

    expect(professorImage).toBeInTheDocument();
  });

  it('handles enrollment flow', async () => {
    jest.useFakeTimers();
    
    render(<CoursePage />);

    const enrollButton = screen.getByRole('button', { name: /Inscrever-se Agora/i });
    expect(enrollButton).toBeInTheDocument();

    // Click enrollment button
    await act(async () => {
      fireEvent.click(enrollButton);
    });

    // Check loading state
    expect(screen.getByText(/Inscrevendo.../i)).toBeInTheDocument();

    // Fast-forward time to complete enrollment
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    // Wait for enrollment to complete
    await waitFor(() => {
      expect(screen.getByText(/Inscrito com Sucesso/i)).toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it('navigates back when back button is clicked', () => {
    render(<CoursePage />);

    const backButton = screen.getByRole('button', { name: /Voltar/i });
    fireEvent.click(backButton);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('displays course objectives', () => {
    render(<CoursePage />);

    expect(screen.getByText(/Objetivos do Curso/i)).toBeInTheDocument();
    expect(screen.getByText(/Compreender as doutrinas essenciais da fé cristã/i)).toBeInTheDocument();
  });

  it('displays program content', () => {
    render(<CoursePage />);

    const conteudo = screen.getAllByText(/Conteúdo Programático/i);
    expect(conteudo.length).toBeGreaterThan(0);
    expect(screen.getByText(/A Revelação de Deus - A Escritura Sagrada/i)).toBeInTheDocument();
  });

  it('displays requirements', () => {
    render(<CoursePage />);

    const requisitos = screen.getAllByText(/Requisitos/i);
    expect(requisitos.length).toBeGreaterThan(0);
    expect(screen.getByText(/Não há pré-requisitos/i)).toBeInTheDocument();
  });

  it('shows not found message for invalid course ID', () => {
    mockedUseParams.mockReturnValue({ id: 'invalid-course-id' });

    render(<CoursePage />);

    expect(screen.getByText(/Curso não encontrado/i)).toBeInTheDocument();
  });

  it('displays course hero image', () => {
    render(<CoursePage />);

    const images = screen.getAllByRole('img');
    const heroImage = images.find((img) => 
      img.getAttribute('src')?.includes('fundamentos-da-fe.jpg')
    );

    expect(heroImage).toBeInTheDocument();
  });
});
