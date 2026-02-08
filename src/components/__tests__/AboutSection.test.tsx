import { render, screen } from '@testing-library/react'
import { AboutSection } from '../AboutSection'

describe('AboutSection Component', () => {
  it('renders the section heading', () => {
    render(<AboutSection />)
    expect(screen.getByText('Sobre o Instituto')).toBeInTheDocument()
  })

  it('renders mission description', () => {
    render(<AboutSection />)
    expect(screen.getByText(/Instituto Casa Bíblica/i)).toBeInTheDocument()
    expect(screen.getByText(/equipar cada membro da Casa/i)).toBeInTheDocument()
  })

  it('renders second paragraph about beliefs', () => {
    render(<AboutSection />)
    expect(screen.getByText(/Acreditamos que o estudo da Palavra de Deus/i)).toBeInTheDocument()
  })

  it('renders statistics correctly', () => {
    render(<AboutSection />)
    expect(screen.getByText('6+')).toBeInTheDocument()
    expect(screen.getByText('Cursos')).toBeInTheDocument()
    expect(screen.getByText('50+')).toBeInTheDocument()
    expect(screen.getByText('Anos de história')).toBeInTheDocument()
    expect(screen.getByText('1000+')).toBeInTheDocument()
    expect(screen.getByText('Membros')).toBeInTheDocument()
  })

  it('renders the Somos Casa logo', () => {
    render(<AboutSection />)
    expect(screen.getByAltText('SOMOS CASA — 2 IPI de Maringá')).toBeInTheDocument()
  })

  it('has correct section id for anchor linking', () => {
    const { container } = render(<AboutSection />)
    const section = container.querySelector('section')
    expect(section).toHaveAttribute('id', 'sobre')
  })

  it('has correct background styling', () => {
    const { container } = render(<AboutSection />)
    const section = container.querySelector('section')
    expect(section).toHaveClass('bg-white')
  })
})
