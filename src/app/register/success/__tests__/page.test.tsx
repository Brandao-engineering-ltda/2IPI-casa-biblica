import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import RegistroSucessoPage from '../page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('RegistroSucessoPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render the success heading', () => {
      render(<RegistroSucessoPage />);

      expect(
        screen.getByText(/cadastro realizado com sucesso/i)
      ).toBeInTheDocument();
    });

    it('should render the confirmation message', () => {
      render(<RegistroSucessoPage />);

      expect(
        screen.getByText(/obrigado por se inscrever no instituto casa bíblica/i)
      ).toBeInTheDocument();
    });

    it('should render the "Proximos Passos" section', () => {
      render(<RegistroSucessoPage />);

      expect(screen.getByText(/próximos passos/i)).toBeInTheDocument();
    });

    it('should render all three next steps', () => {
      render(<RegistroSucessoPage />);

      expect(
        screen.getByText(/verifique seu e-mail para ativar sua conta/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/entre para acessar os cursos disponíveis/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/explore nosso catálogo de cursos e comece sua jornada/i)
      ).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    it('should render "Entrar Agora" link pointing to /login', () => {
      render(<RegistroSucessoPage />);

      const loginLink = screen.getByRole('link', { name: /entrar agora/i });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', '/login');
    });

    it('should render "Voltar ao Inicio" link pointing to /', () => {
      render(<RegistroSucessoPage />);

      const homeLink = screen.getByRole('link', { name: /voltar ao início/i });
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute('href', '/');
    });
  });

  describe('Countdown Timer', () => {
    it('should display the initial countdown value of 10', () => {
      render(<RegistroSucessoPage />);

      expect(screen.getByText('10')).toBeInTheDocument();
      expect(
        screen.getByText(/redirecionando para entrar em/i)
      ).toBeInTheDocument();
    });

    it('should decrement the countdown each second', () => {
      render(<RegistroSucessoPage />);

      expect(screen.getByText('10')).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(screen.getByText('9')).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(screen.getByText('8')).toBeInTheDocument();
    });

    it('should redirect to /login when countdown reaches 0', () => {
      render(<RegistroSucessoPage />);

      act(() => {
        jest.advanceTimersByTime(10000);
      });

      expect(mockPush).toHaveBeenCalledWith('/login');
    });

    it('should not redirect before countdown finishes', () => {
      render(<RegistroSucessoPage />);

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(mockPush).not.toHaveBeenCalled();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should clean up the interval on unmount', () => {
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

      const { unmount } = render(<RegistroSucessoPage />);
      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
      clearIntervalSpy.mockRestore();
    });
  });
});
