import { render, screen } from '@testing-library/react'
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
    await screen.findByText('Painel do Aluno')
    
    expect(screen.getByText('Painel do Aluno')).toBeInTheDocument()
    expect(screen.getByText('Instituto Casa Bíblica')).toBeInTheDocument()
  })

  it('renders logo after loading', async () => {
    render(<DashboardPage />)
    jest.advanceTimersByTime(1000)
    
    const logo = await screen.findByAltText('Logo Instituto Casa Bíblica')
    expect(logo).toBeInTheDocument()
  })

  it('renders dashboard cards after loading', async () => {
    render(<DashboardPage />)
    jest.advanceTimersByTime(1000)
    
    expect(await screen.findByText('Meus Cursos')).toBeInTheDocument()
    expect(screen.getByText('Progresso')).toBeInTheDocument()
    expect(screen.getByText('Certificados')).toBeInTheDocument()
  })

  it('renders empty state message', async () => {
    render(<DashboardPage />)
    jest.advanceTimersByTime(1000)
    
    expect(await screen.findByText(/Você ainda não está matriculado em nenhum curso/i)).toBeInTheDocument()
  })

  it('renders explore courses link', async () => {
    render(<DashboardPage />)
    jest.advanceTimersByTime(1000)
    
    const link = await screen.findByText('Explorar cursos →')
    expect(link.closest('a')).toHaveAttribute('href', '/#cursos')
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
    
    await screen.findByText('Painel do Aluno')
    
    const section = container.querySelector('section')
    expect(section).toHaveClass('bg-navy-dark')
  })
})
