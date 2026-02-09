import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import RegistroPage from '../page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock storage utility
jest.mock('@/lib/storage', () => ({
  saveUserData: jest.fn(),
}));

describe('RegistroPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    jest.clearAllMocks();
  });

  describe('Form Rendering', () => {
    it('should render registration form with all required fields', () => {
      render(<RegistroPage />);

      expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^senha/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/data de nascimento/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^sexo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/cidade/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^estado/i)).toBeInTheDocument();
    });

    it('should render terms checkbox', () => {
      render(<RegistroPage />);

      const termsCheckbox = screen.getByRole('checkbox');
      expect(termsCheckbox).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<RegistroPage />);

      const submitButton = screen.getByRole('button', { name: /criar conta/i });
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show error when nome completo is empty', async () => {
      render(<RegistroPage />);

      const nomeInput = screen.getByLabelText(/nome completo/i);
      const submitButton = screen.getByRole('button', { name: /criar conta/i });

      // Clear pre-filled mock data
      fireEvent.change(nomeInput, { target: { value: '' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/nome completo é obrigatório/i)).toBeInTheDocument();
      });
    });

    it('should show error when email is invalid', async () => {
      render(<RegistroPage />);

      const emailInput = screen.getByLabelText(/e-mail/i);
      const submitButton = screen.getByRole('button', { name: /criar conta/i });

      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/e-mail inválido/i)).toBeInTheDocument();
      });
    });

    it('should show error when password is too short', async () => {
      render(<RegistroPage />);

      const passwordInput = screen.getByLabelText(/^senha/i);
      const submitButton = screen.getByRole('button', { name: /criar conta/i });

      fireEvent.change(passwordInput, { target: { value: '123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/a senha deve ter no mínimo 6 caracteres/i)).toBeInTheDocument();
      });
    });

    it('should show error when passwords do not match', async () => {
      render(<RegistroPage />);

      const passwordInput = screen.getByLabelText(/^senha/i);
      const confirmPasswordInput = screen.getByLabelText(/confirmar senha/i);
      const submitButton = screen.getByRole('button', { name: /criar conta/i });

      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/as senhas não coincidem/i)).toBeInTheDocument();
      });
    });

    it('should show error when terms are not accepted', async () => {
      render(<RegistroPage />);

      const termsCheckbox = screen.getByRole('checkbox');
      const submitButton = screen.getByRole('button', { name: /criar conta/i });

      // Uncheck terms (it's pre-checked in mock data)
      fireEvent.click(termsCheckbox);
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/você precisa aceitar os termos de compromisso para continuar/i)).toBeInTheDocument();
      });
    });

    it('should validate all required fields together', async () => {
      render(<RegistroPage />);

      const nomeInput = screen.getByLabelText(/nome completo/i);
      const emailInput = screen.getByLabelText(/e-mail/i);
      const telefoneInput = screen.getByLabelText(/telefone/i);
      const submitButton = screen.getByRole('button', { name: /criar conta/i });

      // Clear all required fields
      fireEvent.change(nomeInput, { target: { value: '' } });
      fireEvent.change(emailInput, { target: { value: '' } });
      fireEvent.change(telefoneInput, { target: { value: '' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/nome completo é obrigatório/i)).toBeInTheDocument();
        expect(screen.getByText(/e-mail é obrigatório/i)).toBeInTheDocument();
        expect(screen.getByText(/telefone é obrigatório/i)).toBeInTheDocument();
      });
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility', () => {
      render(<RegistroPage />);

      const passwordInput = screen.getByLabelText(/^senha/i) as HTMLInputElement;
      const toggleButtons = screen.getAllByRole('button', { name: '' });

      expect(passwordInput.type).toBe('password');

      // Click first toggle button (senha)
      fireEvent.click(toggleButtons[0]);
      expect(passwordInput.type).toBe('text');

      fireEvent.click(toggleButtons[0]);
      expect(passwordInput.type).toBe('password');
    });
  });

  describe('Terms and Conditions', () => {
    it('should display terms and conditions text', () => {
      render(<RegistroPage />);

      expect(screen.getByText(/termo de compromisso/i)).toBeInTheDocument();
      expect(screen.getByText(/li e aceito/i)).toBeInTheDocument();
    });

    it('should enable submit button when terms are accepted', () => {
      render(<RegistroPage />);

      const submitButton = screen.getByRole('button', { name: /criar conta/i }) as HTMLButtonElement;
      
      // With mock data, terms are pre-checked so button should be enabled
      expect(submitButton).not.toBeDisabled();
    });

    it('should disable submit button when terms are not accepted', () => {
      render(<RegistroPage />);

      const termsCheckbox = screen.getByRole('checkbox');
      const submitButton = screen.getByRole('button', { name: /criar conta/i }) as HTMLButtonElement;

      // Uncheck terms
      fireEvent.click(termsCheckbox);

      expect(submitButton).toBeDisabled();
    });

    it('should clear terms error when checkbox is checked', async () => {
      render(<RegistroPage />);

      const termsCheckbox = screen.getByRole('checkbox');
      const submitButton = screen.getByRole('button', { name: /criar conta/i });

      // Uncheck and submit to get error
      fireEvent.click(termsCheckbox);
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/você precisa aceitar os termos de compromisso para continuar/i)).toBeInTheDocument();
      });

      // Check terms again
      fireEvent.click(termsCheckbox);

      await waitFor(() => {
        expect(screen.queryByText(/você precisa aceitar os termos de compromisso para continuar/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should redirect to dashboard on successful submission', async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { saveUserData } = require('@/lib/storage');
      
      render(<RegistroPage />);

      const submitButton = screen.getByRole('button', { name: /criar conta/i });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(saveUserData).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      }, { timeout: 2000 });
    });

    it('should disable submit button during submission', async () => {
      render(<RegistroPage />);

      const submitButton = screen.getByRole('button', { name: /criar conta/i }) as HTMLButtonElement;

      fireEvent.click(submitButton);

      // Button should show loading state
      await waitFor(() => {
        expect(screen.getByText(/enviando.../i)).toBeInTheDocument();
      });
    });

    it('should save user data without password fields', async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { saveUserData } = require('@/lib/storage');
      
      render(<RegistroPage />);

      const submitButton = screen.getByRole('button', { name: /criar conta/i });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(saveUserData).toHaveBeenCalled();
        const savedData = saveUserData.mock.calls[0][0];
        expect(savedData).not.toHaveProperty('senha');
        expect(savedData).not.toHaveProperty('confirmarSenha');
      }, { timeout: 2000 });
    });
  });

  describe('Form Field Interactions', () => {
    it('should clear error when user starts typing', async () => {
      render(<RegistroPage />);

      const nomeInput = screen.getByLabelText(/nome completo/i);
      const submitButton = screen.getByRole('button', { name: /criar conta/i });

      // Clear and submit to get error
      fireEvent.change(nomeInput, { target: { value: '' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/nome completo é obrigatório/i)).toBeInTheDocument();
      });

      // Start typing
      fireEvent.change(nomeInput, { target: { value: 'João' } });

      await waitFor(() => {
        expect(screen.queryByText(/nome completo é obrigatório/i)).not.toBeInTheDocument();
      });
    });

    it('should update form data when input changes', () => {
      render(<RegistroPage />);

      const nomeInput = screen.getByLabelText(/nome completo/i) as HTMLInputElement;

      fireEvent.change(nomeInput, { target: { value: 'Maria Silva' } });

      expect(nomeInput.value).toBe('Maria Silva');
    });
  });

  describe('Navigation Links', () => {
    it('should render cancel link', () => {
      render(<RegistroPage />);

      const cancelLink = screen.getByRole('link', { name: /cancelar/i });
      expect(cancelLink).toBeInTheDocument();
      expect(cancelLink).toHaveAttribute('href', '/login');
    });

    it('should render login link', () => {
      render(<RegistroPage />);

      const loginLink = screen.getByRole('link', { name: /fazer login/i });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', '/login');
    });
  });
});
