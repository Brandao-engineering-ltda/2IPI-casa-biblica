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

jest.mock('@/components/Skeleton', () => ({
  HeroSkeleton: () => <div data-testid="hero-skeleton">Hero Skeleton</div>,
  VideoSkeleton: () => <div data-testid="video-skeleton">Video Skeleton</div>,
  CoursesSkeleton: () => <div data-testid="courses-skeleton">Courses Skeleton</div>,
  AboutSkeleton: () => <div data-testid="about-skeleton">About Skeleton</div>,
  CTASkeleton: () => <div data-testid="cta-skeleton">CTA Skeleton</div>,
}))

describe('Home Page', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('renders skeleton sections initially', () => {
    render(<Home />)
    
    expect(screen.getByTestId('hero-skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('video-skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('courses-skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('about-skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('cta-skeleton')).toBeInTheDocument()
  })

  it('renders actual sections after loading', async () => {
    render(<Home />)
    
    // Fast-forward time past the loading delay
    jest.advanceTimersByTime(1500)
    
    expect(await screen.findByTestId('hero-section')).toBeInTheDocument()
    expect(screen.getByTestId('video-section')).toBeInTheDocument()
    expect(screen.getByTestId('courses-section')).toBeInTheDocument()
    expect(screen.getByTestId('about-section')).toBeInTheDocument()
    expect(screen.getByTestId('cta-section')).toBeInTheDocument()
  })

  it('renders all sections in correct order', async () => {
    const { container } = render(<Home />)
    jest.advanceTimersByTime(1500)
    
    await screen.findByTestId('hero-section')
    
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
