import { render, screen } from '@testing-library/react'
import { VideoSection } from '../VideoSection'

describe('VideoSection Component', () => {
  it('renders the section heading', () => {
    render(<VideoSection />)
    expect(screen.getByText('Conheça o Instituto')).toBeInTheDocument()
  })

  it('renders the description text', () => {
    render(<VideoSection />)
    expect(screen.getByText(/Assista e descubra como o Instituto Casa Bíblica/i)).toBeInTheDocument()
  })

  it('renders YouTube iframe', () => {
    const { container } = render(<VideoSection />)
    const iframe = container.querySelector('iframe')
    expect(iframe).toBeInTheDocument()
  })

  it('iframe has correct YouTube src', () => {
    const { container } = render(<VideoSection />)
    const iframe = container.querySelector('iframe')
    expect(iframe).toHaveAttribute('src', 'https://www.youtube.com/embed/uPJlTDGiVtw')
  })

  it('iframe has correct title', () => {
    const { container } = render(<VideoSection />)
    const iframe = container.querySelector('iframe')
    expect(iframe).toHaveAttribute('title', 'Instituto Casa Bíblica — 2ª IPI de Maringá')
  })

  it('iframe allows fullscreen', () => {
    const { container } = render(<VideoSection />)
    const iframe = container.querySelector('iframe')
    expect(iframe).toHaveAttribute('allowFullScreen')
  })

  it('iframe has correct permissions', () => {
    const { container } = render(<VideoSection />)
    const iframe = container.querySelector('iframe')
    const allow = iframe?.getAttribute('allow')
    expect(allow).toContain('accelerometer')
    expect(allow).toContain('autoplay')
    expect(allow).toContain('clipboard-write')
    expect(allow).toContain('encrypted-media')
    expect(allow).toContain('gyroscope')
    expect(allow).toContain('picture-in-picture')
  })

  it('has correct background styling', () => {
    const { container } = render(<VideoSection />)
    const section = container.querySelector('section')
    expect(section).toHaveClass('bg-white')
  })

  it('iframe container has 16:9 aspect ratio', () => {
    const { container } = render(<VideoSection />)
    const iframeContainer = container.querySelector('.relative.w-full')
    expect(iframeContainer).toBeInTheDocument()
    // Check if padding-bottom is set (16:9 aspect ratio = 56.25%)
    const style = iframeContainer?.getAttribute('style')
    expect(style).toContain('56.25%')
  })
})
