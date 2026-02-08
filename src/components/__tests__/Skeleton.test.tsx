import { render } from '@testing-library/react'
import { Skeleton, HeroSkeleton, CoursesSkeleton, AboutSkeleton, CTASkeleton, DashboardSkeleton, CourseCardSkeleton } from '../Skeleton'

describe('Skeleton Components', () => {
  describe('Base Skeleton', () => {
    it('renders with default variant', () => {
      const { container } = render(<Skeleton />)
      const skeleton = container.querySelector('.animate-pulse')
      expect(skeleton).toBeInTheDocument()
    })

    it('renders with text variant', () => {
      const { container } = render(<Skeleton variant="text" />)
      const skeleton = container.querySelector('.h-4.rounded')
      expect(skeleton).toBeInTheDocument()
    })

    it('renders with circular variant', () => {
      const { container } = render(<Skeleton variant="circular" />)
      const skeleton = container.querySelector('.rounded-full')
      expect(skeleton).toBeInTheDocument()
    })

    it('applies custom width and height', () => {
      const { container } = render(<Skeleton width={100} height={50} />)
      const skeleton = container.querySelector('.animate-pulse')
      expect(skeleton).toHaveStyle({ width: '100px', height: '50px' })
    })

    it('applies custom className', () => {
      const { container } = render(<Skeleton className="custom-class" />)
      const skeleton = container.querySelector('.custom-class')
      expect(skeleton).toBeInTheDocument()
    })
  })

  describe('HeroSkeleton', () => {
    it('renders hero skeleton structure', () => {
      const { container } = render(<HeroSkeleton />)
      expect(container.querySelector('section')).toBeInTheDocument()
      expect(container.querySelector('.bg-navy-dark')).toBeInTheDocument()
    })

    it('renders circular logo skeleton', () => {
      const { container } = render(<HeroSkeleton />)
      const circles = container.querySelectorAll('.rounded-full')
      expect(circles.length).toBeGreaterThan(0)
    })
  })

  describe('CoursesSkeleton', () => {
    it('renders courses skeleton structure', () => {
      const { container } = render(<CoursesSkeleton />)
      expect(container.querySelector('section')).toBeInTheDocument()
      expect(container.querySelector('.bg-background')).toBeInTheDocument()
    })

    it('renders course card skeletons', () => {
      const { container } = render(<CoursesSkeleton />)
      const cards = container.querySelectorAll('.rounded-2xl')
      expect(cards.length).toBeGreaterThan(0)
    })
  })

  describe('AboutSkeleton', () => {
    it('renders about skeleton structure', () => {
      const { container } = render(<AboutSkeleton />)
      expect(container.querySelector('section')).toBeInTheDocument()
      expect(container.querySelector('.bg-navy')).toBeInTheDocument()
    })

    it('uses grid layout', () => {
      const { container } = render(<AboutSkeleton />)
      const grid = container.querySelector('.grid')
      expect(grid).toBeInTheDocument()
    })
  })

  describe('CTASkeleton', () => {
    it('renders CTA skeleton structure', () => {
      const { container } = render(<CTASkeleton />)
      expect(container.querySelector('section')).toBeInTheDocument()
      expect(container.querySelector('.bg-primary')).toBeInTheDocument()
    })

    it('renders button skeletons', () => {
      const { container } = render(<CTASkeleton />)
      const skeletons = container.querySelectorAll('.animate-pulse')
      expect(skeletons.length).toBeGreaterThan(0)
    })
  })

  describe('DashboardSkeleton', () => {
    it('renders dashboard skeleton structure', () => {
      const { container } = render(<DashboardSkeleton />)
      expect(container.querySelector('section')).toBeInTheDocument()
      expect(container.querySelector('.bg-navy-dark')).toBeInTheDocument()
    })

    it('renders card skeletons', () => {
      const { container } = render(<DashboardSkeleton />)
      const cards = container.querySelectorAll('.rounded-2xl')
      expect(cards.length).toBe(3)
    })
  })

  describe('CourseCardSkeleton', () => {
    it('renders course card skeleton', () => {
      const { container } = render(<CourseCardSkeleton />)
      expect(container.querySelector('.rounded-2xl')).toBeInTheDocument()
    })

    it('has proper structure', () => {
      const { container } = render(<CourseCardSkeleton />)
      const skeletons = container.querySelectorAll('.animate-pulse')
      expect(skeletons.length).toBeGreaterThan(3)
    })
  })
})
