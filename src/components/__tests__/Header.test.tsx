import { render, screen } from '@testing-library/react'
import { Header } from '../Header'

import '@testing-library/jest-dom'
import { usePathname } from 'next/navigation'

// Mock usePathname from next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

const mockedUsePathname = usePathname as jest.MockedFunction<typeof usePathname>

export { mockedUsePathname }

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the logo and brand name', () => {
    mockedUsePathname.mockReturnValue('/')
    render(<Header />)
    
    expect(screen.getByAltText('Logo 2ª IPI de Maringá')).toBeInTheDocument()
    expect(screen.getByText('Instituto Casa Bíblica')).toBeInTheDocument()
    expect(screen.getByText('2ª IPI de Maringá')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    usePathname.mockReturnValue('/')
    render(<Header />)
    
    expect(screen.getAllByText('Cursos')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Sobre')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Contato')[0]).toBeInTheDocument()
  })

  it('shows login button on home page', () => {
    usePathname.mockReturnValue('/')
    render(<Header />)
    
    const loginButtons = screen.getAllByText('Login')
    expect(loginButtons.length).toBeGreaterThan(0)
  })

  it('hides login button on non-home pages', () => {
    usePathname.mockReturnValue('/login')
    render(<Header />)
    
    const loginButtons = screen.queryAllByText('Login')
    expect(loginButtons.length).toBe(0)
  })

  it('shows logout button on dashboard page', () => {
    usePathname.mockReturnValue('/dashboard')
    render(<Header />)
    
    const logoutButtons = screen.getAllByText('Logout')
    expect(logoutButtons.length).toBeGreaterThan(0)
  })

  it('hides logout button on non-dashboard pages', () => {
    usePathname.mockReturnValue('/')
    render(<Header />)
    
    const logoutButtons = screen.queryAllByText('Logout')
    expect(logoutButtons.length).toBe(0)
  })

  it('links to home page when logo is clicked', () => {
    usePathname.mockReturnValue('/')
    render(<Header />)
    
    const logoLink = screen.getByAltText('Logo 2ª IPI de Maringá').closest('a')
    expect(logoLink).toHaveAttribute('href', '/')
  })

  it('navigation links point to home page sections', () => {
    usePathname.mockReturnValue('/')
    const { container } = render(<Header />)
    
    const cursosLink = container.querySelector('a[href="/#cursos"]')
    const sobreLink = container.querySelector('a[href="/#sobre"]')
    const contatoLink = container.querySelector('a[href="/#contato"]')
    
    expect(cursosLink).toBeInTheDocument()
    expect(sobreLink).toBeInTheDocument()
    expect(contatoLink).toBeInTheDocument()
  })
})
