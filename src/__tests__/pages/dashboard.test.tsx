import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import DashboardPage from '../../app/dashboard/page'

// Mock DashboardSkeleton component
jest.mock('@/components/Skeleton', () => ({
  DashboardSkeleton: () => <div data-testid="dashboard-skeleton">Loading...</div>,
}))

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.useFakeTimers()
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
    
    // Check for course titles
    expect(screen.getByText('Fundamentos da Fé')).toBeInTheDocument()
    expect(screen.getByText('Hermenêutica Bíblica')).toBeInTheDocument()
    expect(screen.getByText('Antigo Testamento')).toBeInTheDocument()
    
    // Check for enrollment buttons
    const enrollButtons = screen.getAllByText('Inscrever-se')
    expect(enrollButtons.length).toBeGreaterThan(0)
  })

  it('handles course enrollment', async () => {
    render(<DashboardPage />)
    jest.advanceTimersByTime(1000)
    
    await screen.findByText('Cursos Disponíveis')
    
    const enrollButtons = screen.getAllByText('Inscrever-se')
    const firstEnrollButton = enrollButtons[0]
    
    // Click enroll button
    fireEvent.click(firstEnrollButton)
    
    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText('Inscrevendo...')).toBeInTheDocument()
    })
    
    // Fast-forward enrollment API call
    jest.advanceTimersByTime(1000)
    
    // Should show enrolled state
    await waitFor(() => {
      expect(screen.getByText('✓ Inscrito')).toBeInTheDocument()
    })
  })

  it('shows enrolled button as disabled', async () => {
    render(<DashboardPage />)
    jest.advanceTimersByTime(1000)
    
    await screen.findByText('Cursos Disponíveis')
    
    const enrollButtons = screen.getAllByText('Inscrever-se')
    fireEvent.click(enrollButtons[0])
    
    jest.advanceTimersByTime(1000)
    
    await waitFor(() => {
      const enrolledButton = screen.getByText('✓ Inscrito')
      expect(enrolledButton).toBeDisabled()
    })
  })

  it('renders back to home link', async () => {
    render(<DashboardPage />)
    jest.advanceTimersByTime(1000)
    
    const backLink = await screen.findByText(/voltar para a página inicial/i)
    expect(backLink.closest('a')).toHaveAttribute('href', '/')
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
