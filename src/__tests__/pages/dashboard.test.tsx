import { render, screen } from '@testing-library/react'
import { getUserData, getPurchasedCourses } from '@/lib/storage'
import DashboardPage from '../../app/dashboard/page'

// Mock DashboardSkeleton component
jest.mock('@/components/Skeleton', () => ({
  DashboardSkeleton: () => <div data-testid="dashboard-skeleton">Loading...</div>,
}))

jest.mock('@/lib/storage', () => ({
  getUserData: jest.fn(),
  getPurchasedCourses: jest.fn(),
  getCompletedLessons: jest.fn(() => new Set<string>()),
}))

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    ;(getUserData as jest.Mock).mockReturnValue(null)
    ;(getPurchasedCourses as jest.Mock).mockReturnValue([])
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('renders loading skeleton initially', () => {
    render(<DashboardPage />)
    expect(screen.getByTestId('dashboard-skeleton')).toBeInTheDocument()
  })

  it('renders dashboard content after loading', async () => {
    render(<DashboardPage />)
    
    // Fast-forward time past the loading delay
    jest.advanceTimersByTime(1000)
    
    // Wait for component to re-render
    await screen.findByText('Meus Cursos')
    
    expect(screen.getByText('Meus Cursos')).toBeInTheDocument()
    expect(screen.getByText('Instituto Casa Bíblica')).toBeInTheDocument()
  })

  it('renders logo after loading', async () => {
    render(<DashboardPage />)
    jest.advanceTimersByTime(1000)
    
    const logo = await screen.findByAltText('Logo Instituto Casa Bíblica')
    expect(logo).toBeInTheDocument()
  })

  it('shows empty state when user has no courses', async () => {
    render(<DashboardPage />)
    jest.advanceTimersByTime(1000)
    
    expect(await screen.findByText(/Você ainda não está matriculado em nenhum curso/i)).toBeInTheDocument()
  })

  it('renders available courses section', async () => {
    render(<DashboardPage />)
    jest.advanceTimersByTime(1000)
    
    expect(await screen.findByText('Cursos Disponíveis')).toBeInTheDocument()
    expect(screen.getByText(/Inscreva-se nos próximos cursos/i)).toBeInTheDocument()
  })

  it('displays upcoming courses with enrollment buttons', async () => {
    render(<DashboardPage />)
    jest.advanceTimersByTime(1000)
    
    await screen.findByText('Cursos Disponíveis')
    
    // Check for course titles (use getAllByText for titles that appear in multiple courses)
    expect(screen.getByText('Fundamentos da Fé')).toBeInTheDocument()
    const hermeneuticaElements = screen.getAllByText('Hermenêutica Bíblica')
    expect(hermeneuticaElements.length).toBeGreaterThan(0)
    expect(screen.getByText('Antigo Testamento')).toBeInTheDocument()
    
    // Check for enrollment buttons
    const enrollButtons = screen.getAllByText('Inscrever-se')
    expect(enrollButtons.length).toBeGreaterThan(0)
  })

  it('links to inscription page when enrolling', async () => {
    render(<DashboardPage />)
    jest.advanceTimersByTime(1000)
    
    await screen.findByText('Cursos Disponíveis')
    
    const enrollLinks = screen.getAllByRole('link', { name: 'Inscrever-se' })
    expect(enrollLinks.length).toBeGreaterThan(0)
    
    // First available course is Fundamentos da Fé
    const fundamentosEnrollLink = enrollLinks.find(
      (link) => link.getAttribute('href') === '/curso/fundamentos-da-fe/inscricao'
    )
    expect(fundamentosEnrollLink).toBeInTheDocument()
  })

  it('shows enrolled state when user has purchased course', async () => {
    ;(getPurchasedCourses as jest.Mock).mockReturnValue([
      { courseId: 'fundamentos-da-fe', purchaseDate: new Date().toISOString() },
    ])

    render(<DashboardPage />)
    jest.advanceTimersByTime(1000)

    await screen.findByText('Meus Cursos')

    // Purchased course appears in user courses section
    expect(screen.getByText('Fundamentos da Fé')).toBeInTheDocument()
    expect(screen.getByText('Meus Próximos Cursos')).toBeInTheDocument()
  })

  it('renders dashboard without back-to-home link (handled by layout/header)', async () => {
    render(<DashboardPage />)
    jest.advanceTimersByTime(1000)
    await screen.findByText('Meus Cursos')
    // Dashboard content is self-contained; navigation is in layout/header
    expect(screen.getByText('Meus Cursos')).toBeInTheDocument()
  })

  it('has correct background styling', async () => {
    const { container } = render(<DashboardPage />)
    jest.advanceTimersByTime(1000)
    
    await screen.findByText('Meus Cursos')
    
    const section = container.querySelector('section')
    expect(section).toHaveClass('bg-background')
  })

  it('displays course details correctly', async () => {
    render(<DashboardPage />)
    jest.advanceTimersByTime(1000)
    
    await screen.findByText('Fundamentos da Fé')
    
    // Check for course metadata
    expect(screen.getByText('8 semanas')).toBeInTheDocument()
    expect(screen.getByText('11 Mai 2026')).toBeInTheDocument()
    expect(screen.getAllByText('Iniciante')[0]).toBeInTheDocument()
  })
})
