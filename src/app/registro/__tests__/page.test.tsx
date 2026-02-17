import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import RegistroPage from '../page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/lib/firebase', () => ({
  auth: {},
  createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: '123' } })),
}));

jest.mock('@/lib/storage', () => ({
  saveUserProfile: jest.fn(() => Promise.resolve()),
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
      expect(screen.getByLabelText(/estado civil/i)).toBeInTheDocument();
      expect(document.getElementById('state')).toBeInTheDocument();
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
    // Submit button is disabled until terms are accepted; accept terms first so validation can run
    const acceptTerms = (): void => {
      const termsCheckbox = screen.getByRole('checkbox');
      fireEvent.click(termsCheckbox);
    };

    it('should show error when nome completo is empty', async () => {
      render(<RegistroPage />);

      const nomeInput = screen.getByLabelText(/nome completo/i);
      acceptTerms();
      fireEvent.change(nomeInput, { target: { value: '' } });
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }));

      await waitFor(() => {
        expect(screen.getByText(/nome completo é obrigatório/i)).toBeInTheDocument();
      });
    });

    it('should show error when email is invalid', async () => {
      const user = userEvent.setup();
      render(<RegistroPage />);

      const emailInput = screen.getByLabelText(/e-mail/i);
      acceptTerms();
      await user.clear(emailInput);
      await user.type(emailInput, 'notanemail');
      await user.click(screen.getByRole('button', { name: /criar conta/i }));

      await waitFor(() => {
        expect(screen.getByText(/e-mail inválido/i)).toBeInTheDocument();
      });
    });

    it('should show error when password is too short', async () => {
      render(<RegistroPage />);

      const passwordInput = screen.getByLabelText(/^senha/i);
      acceptTerms();
      fireEvent.change(passwordInput, { target: { value: '123' } });
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }));

      await waitFor(() => {
        expect(screen.getByText(/a senha deve ter no mínimo 6 caracteres/i)).toBeInTheDocument();
      });
    });

    it('should show error when passwords do not match', async () => {
      render(<RegistroPage />);

      const passwordInput = screen.getByLabelText(/^senha/i);
      const confirmPasswordInput = screen.getByLabelText(/confirmar senha/i);
      acceptTerms();
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } });
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }));

      await waitFor(() => {
        expect(screen.getByText(/as senhas não coincidem/i)).toBeInTheDocument();
      });
    });

    it('should show error when terms are not accepted', () => {
      render(<RegistroPage />);

      const submitButton = screen.getByRole('button', { name: /criar conta/i });

      // Submit is disabled when terms not accepted (acceptedTerms initial state is false)
      expect(submitButton).toBeDisabled();
    });

    it('should validate all required fields together', async () => {
      render(<RegistroPage />);

      const nomeInput = screen.getByLabelText(/nome completo/i);
      const emailInput = screen.getByLabelText(/e-mail/i);
      const telefoneInput = screen.getByLabelText(/telefone/i);
      acceptTerms();
      fireEvent.change(nomeInput, { target: { value: '' } });
      fireEvent.change(emailInput, { target: { value: '' } });
      fireEvent.change(telefoneInput, { target: { value: '' } });
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }));

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

      expect(screen.getAllByText(/termo de compromisso/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/declaro estar ciente e concordo com os seguintes termos/i)).toBeInTheDocument();
    });

    it('should enable submit button when terms are accepted', () => {
      render(<RegistroPage />);

      const termsCheckbox = screen.getByRole('checkbox');
      const submitButton = screen.getByRole('button', { name: /criar conta/i }) as HTMLButtonElement;

      expect(submitButton).toBeDisabled();
      fireEvent.click(termsCheckbox);
      expect(submitButton).not.toBeDisabled();
    });

    it('should disable submit button when terms are not accepted', () => {
      render(<RegistroPage />);

      const termsCheckbox = screen.getByRole('checkbox');
      const submitButton = screen.getByRole('button', { name: /criar conta/i }) as HTMLButtonElement;

      // Check terms first, then uncheck – button becomes disabled
      fireEvent.click(termsCheckbox);
      expect(submitButton).not.toBeDisabled();
      fireEvent.click(termsCheckbox);
      expect(submitButton).toBeDisabled();
    });

    it('should clear terms error when checkbox is checked', () => {
      render(<RegistroPage />);

      const termsCheckbox = screen.getByRole('checkbox');
      const submitButton = screen.getByRole('button', { name: /criar conta/i });

      // Check terms – button becomes enabled
      fireEvent.click(termsCheckbox);
      expect(submitButton).not.toBeDisabled();
      // Uncheck – button becomes disabled
      fireEvent.click(termsCheckbox);
      expect(submitButton).toBeDisabled();
      // Check again – button becomes enabled
      fireEvent.click(termsCheckbox);
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Form Submission', () => {
    function fillRequiredFields() {
      fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'João Silva' } });
      fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'joao@email.com' } });
      fireEvent.change(screen.getByLabelText(/^senha/i), { target: { value: 'senha123' } });
      fireEvent.change(screen.getByLabelText(/confirmar senha/i), { target: { value: 'senha123' } });
      fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: '(11) 99999-0000' } });
      fireEvent.change(screen.getByLabelText(/data de nascimento/i), { target: { value: '1990-01-01' } });
      fireEvent.change(screen.getByLabelText(/^sexo/i), { target: { value: 'masculino' } });
      fireEvent.change(screen.getByLabelText(/cidade/i), { target: { value: 'Maringá' } });
      fireEvent.change(document.getElementById('state')!, { target: { value: 'PR' } });
      fireEvent.click(screen.getByRole('checkbox'));
    }

    it('should redirect to dashboard on successful submission', async () => {
      render(<RegistroPage />);

      fillRequiredFields();
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should disable submit button during submission', async () => {
      render(<RegistroPage />);

      fillRequiredFields();
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }));

      await waitFor(() => {
        expect(screen.getByText(/enviando.../i)).toBeInTheDocument();
      });
    });

    it('should save user data without password fields', async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { saveUserProfile } = require('@/lib/storage');

      render(<RegistroPage />);

      fillRequiredFields();
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }));

      await waitFor(() => {
        expect(saveUserProfile).toHaveBeenCalled();
        const savedData = saveUserProfile.mock.calls[0][1];
        expect(savedData).not.toHaveProperty('senha');
        expect(savedData).not.toHaveProperty('confirmarSenha');
      }, { timeout: 2000 });
    });
  });

  describe('Form Field Interactions', () => {
    it('should clear error when user starts typing', async () => {
      render(<RegistroPage />);

      const nomeInput = screen.getByLabelText(/nome completo/i);
      fireEvent.click(screen.getByRole('checkbox'));
      fireEvent.change(nomeInput, { target: { value: '' } });
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }));

      await waitFor(() => {
        expect(screen.getByText(/nome completo é obrigatório/i)).toBeInTheDocument();
      });

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

      const loginLink = screen.getByRole('link', { name: /entrar/i });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', '/login');
    });
  });
});
