import { render, screen } from '@testing-library/react'
import { HeroSection } from '../HeroSection'

describe('HeroSection Component', () => {
  it('renders the logo', () => {
    render(<HeroSection />)
    expect(screen.getByAltText('Logo Instituto Casa Bíblica')).toBeInTheDocument()
  })

  it('renders the main heading', () => {
    render(<HeroSection />)
    expect(screen.getByText('Instituto')).toBeInTheDocument()
    expect(screen.getByText('Casa Bíblica')).toBeInTheDocument()
  })

  it('renders the description text', () => {
    render(<HeroSection />)
    expect(screen.getByText(/Formação bíblica para todos os membros da Casa/i)).toBeInTheDocument()
  })

  it('renders call-to-action buttons', () => {
    render(<HeroSection />)
    expect(screen.getByText('Explorar Cursos')).toBeInTheDocument()
    expect(screen.getByText('Saiba Mais')).toBeInTheDocument()
  })

  it('CTA buttons have correct links', () => {
    render(<HeroSection />)
    
    const explorarButton = screen.getByText('Explorar Cursos').closest('a')
    const saibaMaisButton = screen.getByText('Saiba Mais').closest('a')
    
    expect(explorarButton).toHaveAttribute('href', '#courses')
    expect(saibaMaisButton).toHaveAttribute('href', '#sobre')
  })

  it('renders feature highlights', () => {
    render(<HeroSection />)
    expect(screen.getByText('Cursos Bíblicos')).toBeInTheDocument()
    expect(screen.getByText('Comunidade SOMOS CASA')).toBeInTheDocument()
    expect(screen.getByText('Certificado de Conclusão')).toBeInTheDocument()
  })

  it('has correct background styling', () => {
    const { container } = render(<HeroSection />)
    const section = container.querySelector('section')
    expect(section).toHaveClass('bg-navy-dark')
  })
})
