import { render, screen } from '@testing-library/react'
import { Footer } from '../Footer'

describe('Footer Component', () => {
  it('renders the logo and brand name', () => {
    render(<Footer />)
    expect(screen.getByAltText('Logo 2ª IPI de Maringá')).toBeInTheDocument()
    expect(screen.getByText('Instituto Casa Bíblica')).toBeInTheDocument()
  })

  it('renders the mission statement', () => {
    render(<Footer />)
    expect(screen.getByText(/Formação bíblica acessível para todos/i)).toBeInTheDocument()
  })

  it('renders quick links section', () => {
    render(<Footer />)
    expect(screen.getByText('Links Rápidos')).toBeInTheDocument()
    expect(screen.getByText('Cursos')).toBeInTheDocument()
    expect(screen.getByText('Sobre o Instituto')).toBeInTheDocument()
    expect(screen.getByText('Inscreva-se')).toBeInTheDocument()
  })

  it('quick links point to correct URLs', () => {
    const { container } = render(<Footer />)
    
    const cursosLink = container.querySelector('a[href="/#cursos"]')
    const sobreLink = container.querySelector('a[href="/#sobre"]')
    const inscrevaLink = container.querySelector('a[href="/login"]')
    
    expect(cursosLink).toBeInTheDocument()
    expect(sobreLink).toBeInTheDocument()
    expect(inscrevaLink).toBeInTheDocument()
  })

  it('renders contact information', () => {
    render(<Footer />)
    expect(screen.getByText('Contato')).toBeInTheDocument()
    expect(screen.getByText('Av. Mauá, 1988 - Zona 09')).toBeInTheDocument()
    expect(screen.getByText('Maringá - PR')).toBeInTheDocument()
  })

  it('renders social media links', () => {
    render(<Footer />)
    const instagramLink = screen.getByText('@2ipimaringa').closest('a')
    const websiteLink = screen.getByText('ipimaringa.com.br').closest('a')
    
    expect(instagramLink).toHaveAttribute('href', 'https://www.instagram.com/2ipimaringa/')
    expect(instagramLink).toHaveAttribute('target', '_blank')
    expect(websiteLink).toHaveAttribute('href', 'https://ipimaringa.com.br')
    expect(websiteLink).toHaveAttribute('target', '_blank')
  })

  it('renders copyright notice with current year', () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument()
  })

  it('has correct section id for anchor linking', () => {
    const { container } = render(<Footer />)
    const footer = container.querySelector('footer')
    expect(footer).toHaveAttribute('id', 'contato')
  })
})
