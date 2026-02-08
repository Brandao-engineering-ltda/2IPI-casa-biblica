import { render, screen } from '@testing-library/react'
import { CTASection } from '../CTASection'

describe('CTASection Component', () => {
  it('renders the main heading', () => {
    render(<CTASection />)
    expect(screen.getByText('Comece sua jornada bíblica')).toBeInTheDocument()
  })

  it('renders the description text', () => {
    render(<CTASection />)
    expect(screen.getByText(/As inscrições para os próximos cursos estão abertas/i)).toBeInTheDocument()
  })

  it('renders Inscreva-se Agora button', () => {
    render(<CTASection />)
    expect(screen.getByText('Inscreva-se Agora')).toBeInTheDocument()
  })

  it('Inscreva-se button links to login page', () => {
    render(<CTASection />)
    const button = screen.getByText('Inscreva-se Agora').closest('a')
    expect(button).toHaveAttribute('href', '/login')
  })

  it('renders WhatsApp contact button', () => {
    render(<CTASection />)
    expect(screen.getByText('Fale Conosco')).toBeInTheDocument()
  })

  it('WhatsApp button has correct link', () => {
    render(<CTASection />)
    const whatsappButton = screen.getByText('Fale Conosco').closest('a')
    expect(whatsappButton).toHaveAttribute('href', expect.stringContaining('api.whatsapp.com'))
    expect(whatsappButton).toHaveAttribute('target', '_blank')
  })

  it('has correct section id for anchor linking', () => {
    const { container } = render(<CTASection />)
    const section = container.querySelector('section')
    expect(section).toHaveAttribute('id', 'inscreva-se')
  })

  it('has correct background styling', () => {
    const { container } = render(<CTASection />)
    const section = container.querySelector('section')
    expect(section).toHaveClass('bg-primary')
  })
})
