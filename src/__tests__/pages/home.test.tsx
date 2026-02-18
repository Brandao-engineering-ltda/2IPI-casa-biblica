import { render, screen } from '@testing-library/react'
import Home from '../../app/page'

// Mock all section components
jest.mock('@/components/HeroSection', () => ({
  HeroSection: () => <div data-testid="hero-section">Hero</div>,
}))

jest.mock('@/components/VideoSection', () => ({
  VideoSection: () => <div data-testid="video-section">Video</div>,
}))

jest.mock('@/components/CoursesSection', () => ({
  CoursesSection: () => <div data-testid="courses-section">Courses</div>,
}))

jest.mock('@/components/AboutSection', () => ({
  AboutSection: () => <div data-testid="about-section">About</div>,
}))

jest.mock('@/components/CTASection', () => ({
  CTASection: () => <div data-testid="cta-section">CTA</div>,
}))

describe('Home Page', () => {
  it('renders all sections directly', () => {
    render(<Home />)

    expect(screen.getByTestId('hero-section')).toBeInTheDocument()
    expect(screen.getByTestId('video-section')).toBeInTheDocument()
    expect(screen.getByTestId('courses-section')).toBeInTheDocument()
    expect(screen.getByTestId('about-section')).toBeInTheDocument()
    expect(screen.getByTestId('cta-section')).toBeInTheDocument()
  })

  it('renders all sections in correct order', () => {
    const { container } = render(<Home />)

    const sections = container.querySelectorAll('[data-testid]')
    const sectionIds = Array.from(sections).map(s => s.getAttribute('data-testid'))

    expect(sectionIds).toEqual([
      'hero-section',
      'video-section',
      'courses-section',
      'about-section',
      'cta-section',
    ])
  })
})
