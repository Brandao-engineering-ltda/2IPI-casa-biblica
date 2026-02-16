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
})
