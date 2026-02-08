import { render, screen } from '@testing-library/react'
import { Loading } from '../Loading'

describe('Loading Component', () => {
  it('renders the loading logo', () => {
    render(<Loading />)
    expect(screen.getByAltText('Instituto Casa Bíblica')).toBeInTheDocument()
  })

  it('renders loading text', () => {
    render(<Loading />)
    expect(screen.getByText('Carregando')).toBeInTheDocument()
  })

  it('renders animated dots', () => {
    const { container } = render(<Loading />)
    const dots = container.querySelectorAll('.animate-bounce')
    expect(dots.length).toBe(3)
  })

  it('has correct fixed overlay styling', () => {
    const { container } = render(<Loading />)
    const loadingDiv = container.querySelector('.fixed')
    expect(loadingDiv).toHaveClass('fixed', 'inset-0', 'z-50')
  })

  it('logo has animate-pulse class', () => {
    render(<Loading />)
    const logo = screen.getByAltText('Instituto Casa Bíblica')
    expect(logo).toHaveClass('animate-pulse')
  })

  it('renders spinning border animation', () => {
    const { container } = render(<Loading />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })
})
