/* eslint-disable @typescript-eslint/no-require-imports */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import LoginPage from '../../app/login/page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/lib/firebase', () => ({
  auth: {},
  googleProvider: {},
  signInWithPopup: jest.fn(),
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: '123' } })),
  sendPasswordResetEmail: jest.fn(() => Promise.resolve()),
}))

jest.mock('@/lib/storage', () => ({
  saveUserProfile: jest.fn(() => Promise.resolve()),
}))

describe('LoginPage', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  it('renders the login form', () => {
    render(<LoginPage />)
    expect(screen.getByText('Bem-vindo de volta')).toBeInTheDocument()
    expect(screen.getByText('Acesse sua conta do Instituto Casa Bíblica')).toBeInTheDocument()
  })

  it('renders logo', () => {
    render(<LoginPage />)
    expect(screen.getByAltText('Logo Instituto Casa Bíblica')).toBeInTheDocument()
  })

  it('renders email and password fields', () => {
    render(<LoginPage />)
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<LoginPage />)
    expect(screen.getByRole('button', { name: /^entrar$/i })).toBeInTheDocument()
  })

  it('renders Google sign-in button', () => {
    render(<LoginPage />)
    expect(screen.getByRole('button', { name: /entrar com google/i })).toBeInTheDocument()
  })

  it('renders "Esqueceu a senha?" link', () => {
    render(<LoginPage />)
    expect(screen.getByText(/esqueceu a senha/i)).toBeInTheDocument()
  })

  it('renders back to home link', () => {
    render(<LoginPage />)
    const backLink = screen.getByText(/voltar para a página inicial/i)
    expect(backLink).toBeInTheDocument()
    expect(backLink.closest('a')).toHaveAttribute('href', '/')
  })

  it('allows user to type in email field', () => {
    render(<LoginPage />)
    const emailInput = screen.getByLabelText('E-mail') as HTMLInputElement
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    expect(emailInput.value).toBe('test@example.com')
  })

  it('allows user to type in password field', () => {
    render(<LoginPage />)
    const passwordInput = screen.getByLabelText('Senha') as HTMLInputElement
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    expect(passwordInput.value).toBe('password123')
  })

  it('navigates to dashboard on form submission', async () => {
    render(<LoginPage />)

    const emailInput = screen.getByLabelText('E-mail')
    const passwordInput = screen.getByLabelText('Senha')
    const submitButton = screen.getByRole('button', { name: /^entrar$/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('has correct styling classes', () => {
    const { container } = render(<LoginPage />)
    const section = container.querySelector('section')
    expect(section).toHaveClass('bg-navy-dark')
  })

  describe('handleGoogleSignIn', () => {
    it('saves user profile and redirects to /dashboard on success', async () => {
      const { signInWithPopup } = require('@/lib/firebase')
      const { saveUserProfile } = require('@/lib/storage')

      signInWithPopup.mockResolvedValueOnce({
        user: {
          uid: 'google-uid-123',
          displayName: 'Maria Silva',
          email: 'maria@gmail.com',
          photoURL: 'https://photo.url/maria.jpg',
        },
      })

      render(<LoginPage />)

      const googleButton = screen.getByRole('button', { name: /entrar com google/i })
      fireEvent.click(googleButton)

      await waitFor(() => {
        expect(signInWithPopup).toHaveBeenCalled()
      })

      await waitFor(() => {
        expect(saveUserProfile).toHaveBeenCalledWith('google-uid-123', {
          fullName: 'Maria Silva',
          email: 'maria@gmail.com',
          photoURL: 'https://photo.url/maria.jpg',
          authProvider: 'google',
        })
      })

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard')
      })
    })

    it('uses fallback values when Google user fields are null', async () => {
      const { signInWithPopup } = require('@/lib/firebase')
      const { saveUserProfile } = require('@/lib/storage')

      signInWithPopup.mockResolvedValueOnce({
        user: {
          uid: 'google-uid-456',
          displayName: null,
          email: null,
          photoURL: null,
        },
      })

      render(<LoginPage />)

      const googleButton = screen.getByRole('button', { name: /entrar com google/i })
      fireEvent.click(googleButton)

      await waitFor(() => {
        expect(saveUserProfile).toHaveBeenCalledWith('google-uid-456', {
          fullName: 'Usuário Google',
          email: '',
          photoURL: '',
          authProvider: 'google',
        })
      })
    })

    it('does NOT show error when popup is closed by user', async () => {
      const { signInWithPopup } = require('@/lib/firebase')

      signInWithPopup.mockRejectedValueOnce({ code: 'auth/popup-closed-by-user' })

      render(<LoginPage />)

      const googleButton = screen.getByRole('button', { name: /entrar com google/i })
      fireEvent.click(googleButton)

      await waitFor(() => {
        expect(signInWithPopup).toHaveBeenCalled()
      })

      // Wait a tick and verify no error message is displayed
      await waitFor(() => {
        expect(screen.queryByText(/erro/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/incorretos/i)).not.toBeInTheDocument()
      })
    })

    it('shows error message when Google sign-in fails with a real error', async () => {
      const { signInWithPopup } = require('@/lib/firebase')

      signInWithPopup.mockRejectedValueOnce({
        code: 'auth/account-exists-with-different-credential',
      })

      render(<LoginPage />)

      const googleButton = screen.getByRole('button', { name: /entrar com google/i })
      fireEvent.click(googleButton)

      await waitFor(() => {
        expect(
          screen.getByText('Uma conta já existe com este e-mail usando outro método de login.')
        ).toBeInTheDocument()
      })
    })
  })

  describe('handlePasswordReset', () => {
    it('enters reset mode when "Esqueceu a senha?" is clicked', () => {
      render(<LoginPage />)

      const forgotButton = screen.getByText(/esqueceu a senha/i)
      fireEvent.click(forgotButton)

      expect(screen.getByText('Redefinir Senha')).toBeInTheDocument()
      expect(
        screen.getByText('Digite seu e-mail para receber o link de redefinição')
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /enviar link de redefinição/i })
      ).toBeInTheDocument()
    })

    it('sends password reset email when form is submitted with valid email', async () => {
      const { sendPasswordResetEmail } = require('@/lib/firebase')

      render(<LoginPage />)

      // Enter reset mode
      const forgotButton = screen.getByText(/esqueceu a senha/i)
      fireEvent.click(forgotButton)

      // Type email in the reset form
      const emailInput = screen.getByLabelText('E-mail')
      fireEvent.change(emailInput, { target: { value: 'reset@example.com' } })

      // Submit the reset form
      const submitButton = screen.getByRole('button', { name: /enviar link de redefinição/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(sendPasswordResetEmail).toHaveBeenCalledWith({}, 'reset@example.com')
      })

      await waitFor(() => {
        expect(
          screen.getByText('E-mail de redefinição enviado! Verifique sua caixa de entrada.')
        ).toBeInTheDocument()
      })
    })

    it('shows error when trying to reset with empty email', async () => {
      render(<LoginPage />)

      // Enter reset mode
      const forgotButton = screen.getByText(/esqueceu a senha/i)
      fireEvent.click(forgotButton)

      // Do NOT type any email - leave it empty

      // Submit the reset form
      const submitButton = screen.getByRole('button', { name: /enviar link de redefinição/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(
          screen.getByText('Digite seu e-mail para redefinir a senha.')
        ).toBeInTheDocument()
      })
    })

    it('shows error when sendPasswordResetEmail fails', async () => {
      const { sendPasswordResetEmail } = require('@/lib/firebase')

      sendPasswordResetEmail.mockImplementationOnce(() =>
        Promise.reject({ code: 'auth/invalid-email' })
      )

      render(<LoginPage />)

      // Enter reset mode
      const forgotButton = screen.getByText(/esqueceu a senha/i)
      fireEvent.click(forgotButton)

      const emailInput = screen.getByLabelText('E-mail')
      fireEvent.change(emailInput, { target: { value: 'bad@email.com' } })

      // Submit the form directly to avoid native HTML validation
      const form = emailInput.closest('form')!
      fireEvent.submit(form)

      await waitFor(() => {
        expect(screen.getByText('E-mail inválido.')).toBeInTheDocument()
      })
    })

    it('returns to login mode when "Voltar para o login" is clicked', () => {
      render(<LoginPage />)

      // Enter reset mode
      fireEvent.click(screen.getByText(/esqueceu a senha/i))
      expect(screen.getByText('Redefinir Senha')).toBeInTheDocument()

      // Go back
      fireEvent.click(screen.getByText(/voltar para o login/i))
      expect(screen.getByText('Bem-vindo de volta')).toBeInTheDocument()
    })
  })

  describe('login error handling via getFirebaseErrorMessage', () => {
    it('shows "E-mail ou senha incorretos." for auth/invalid-credential', async () => {
      const { signInWithEmailAndPassword } = require('@/lib/firebase')

      signInWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/invalid-credential' })

      render(<LoginPage />)

      fireEvent.change(screen.getByLabelText('E-mail'), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText('Senha'), {
        target: { value: 'wrongpassword' },
      })
      fireEvent.click(screen.getByRole('button', { name: /^entrar$/i }))

      await waitFor(() => {
        expect(screen.getByText('E-mail ou senha incorretos.')).toBeInTheDocument()
      })
    })

    it('shows "E-mail ou senha incorretos." for auth/wrong-password', async () => {
      const { signInWithEmailAndPassword } = require('@/lib/firebase')

      signInWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/wrong-password' })

      render(<LoginPage />)

      fireEvent.change(screen.getByLabelText('E-mail'), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText('Senha'), {
        target: { value: 'wrongpassword' },
      })
      fireEvent.click(screen.getByRole('button', { name: /^entrar$/i }))

      await waitFor(() => {
        expect(screen.getByText('E-mail ou senha incorretos.')).toBeInTheDocument()
      })
    })

    it('shows "E-mail ou senha incorretos." for auth/user-not-found', async () => {
      const { signInWithEmailAndPassword } = require('@/lib/firebase')

      signInWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/user-not-found' })

      render(<LoginPage />)

      fireEvent.change(screen.getByLabelText('E-mail'), {
        target: { value: 'nobody@example.com' },
      })
      fireEvent.change(screen.getByLabelText('Senha'), {
        target: { value: 'password' },
      })
      fireEvent.click(screen.getByRole('button', { name: /^entrar$/i }))

      await waitFor(() => {
        expect(screen.getByText('E-mail ou senha incorretos.')).toBeInTheDocument()
      })
    })

    it('shows "Esta conta foi desativada." for auth/user-disabled', async () => {
      const { signInWithEmailAndPassword } = require('@/lib/firebase')

      signInWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/user-disabled' })

      render(<LoginPage />)

      fireEvent.change(screen.getByLabelText('E-mail'), {
        target: { value: 'disabled@example.com' },
      })
      fireEvent.change(screen.getByLabelText('Senha'), {
        target: { value: 'password' },
      })
      fireEvent.click(screen.getByRole('button', { name: /^entrar$/i }))

      await waitFor(() => {
        expect(screen.getByText('Esta conta foi desativada.')).toBeInTheDocument()
      })
    })

    it('shows "Muitas tentativas." for auth/too-many-requests', async () => {
      const { signInWithEmailAndPassword } = require('@/lib/firebase')

      signInWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/too-many-requests' })

      render(<LoginPage />)

      fireEvent.change(screen.getByLabelText('E-mail'), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText('Senha'), {
        target: { value: 'password' },
      })
      fireEvent.click(screen.getByRole('button', { name: /^entrar$/i }))

      await waitFor(() => {
        expect(
          screen.getByText('Muitas tentativas. Tente novamente mais tarde.')
        ).toBeInTheDocument()
      })
    })

    it('shows generic error for unknown error codes', async () => {
      const { signInWithEmailAndPassword } = require('@/lib/firebase')

      signInWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/unknown-error' })

      render(<LoginPage />)

      fireEvent.change(screen.getByLabelText('E-mail'), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText('Senha'), {
        target: { value: 'password' },
      })
      fireEvent.click(screen.getByRole('button', { name: /^entrar$/i }))

      await waitFor(() => {
        expect(screen.getByText('Ocorreu um erro. Tente novamente.')).toBeInTheDocument()
      })
    })

    it('shows generic error when error has no code', async () => {
      const { signInWithEmailAndPassword } = require('@/lib/firebase')

      signInWithEmailAndPassword.mockRejectedValueOnce(new Error('network error'))

      render(<LoginPage />)

      fireEvent.change(screen.getByLabelText('E-mail'), {
        target: { value: 'test@example.com' },
      })
      fireEvent.change(screen.getByLabelText('Senha'), {
        target: { value: 'password' },
      })
      fireEvent.click(screen.getByRole('button', { name: /^entrar$/i }))

      await waitFor(() => {
        expect(screen.getByText('Ocorreu um erro. Tente novamente.')).toBeInTheDocument()
      })
    })
  })
})
