import { render, screen } from '@testing-library/react'
import { getPurchasedCourses } from '@/lib/storage'
import DashboardPage from '../../app/dashboard/page'

// Mock DashboardSkeleton component
jest.mock('@/components/Skeleton', () => ({
  DashboardSkeleton: () => <div data-testid="dashboard-skeleton">Loading...</div>,
}))

// Mock firebase
jest.mock('@/lib/firebase', () => ({ auth: {}, signOut: jest.fn() }))

// Mock Next.js navigation
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: mockPush })),
}))

// Mock AuthContext
const mockUseAuth = jest.fn()
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}))

jest.mock('@/lib/storage', () => ({
  getPurchasedCourses: jest.fn(() => Promise.resolve([])),
  getCompletedLessons: jest.fn(() => Promise.resolve(new Set<string>())),
}))

// Mock courses module
const mockCourses = [
  {
    id: 'fundamentos-da-fe',
    title: 'Fundamentos da Fé',
    description: 'Estudo das doutrinas essenciais da fé cristã reformada.',
    image: '/images/courses/fundamentos-da-fe.jpg',
    level: 'Iniciante',
    duration: '8 semanas',
    startDate: '11 Mai 2026',
    endDate: '6 Jul 2026',
    status: 'proximo' as const,
    instructor: 'Rev. João Silva',
    pricePix: 250, priceCard: 275, installments: 3,
    order: 1, published: true,
    fullDescription: '', totalHours: '', format: '',
    objectives: [], syllabus: [], requirements: [],
  },
  {
    id: 'hermeneutica-biblica',
    title: 'Hermenêutica Bíblica',
    description: 'Princípios e métodos para interpretação das Escrituras.',
    image: '/images/courses/hermeneutica.jpg',
    level: 'Intermediário',
    duration: '10 semanas',
    startDate: '20 Jun 2026',
    endDate: '29 Ago 2026',
    status: 'em-breve' as const,
    instructor: 'Prof. Pedro Costa',
    pricePix: 320, priceCard: 350, installments: 3,
    order: 3, published: true,
    fullDescription: '', totalHours: '', format: '',
    objectives: [], syllabus: [], requirements: [],
  },
  {
    id: 'antigo-testamento',
    title: 'Antigo Testamento',
    description: 'Estudo aprofundado dos livros do Antigo Testamento.',
    image: '/images/courses/antigo-testamento.jpg',
    level: 'Intermediário',
    duration: '16 semanas',
    startDate: '28 Set 2026',
    endDate: '18 Jan 2027',
    status: 'em-breve' as const,
    instructor: 'Rev. Pedro Oliveira',
    pricePix: 450, priceCard: 490, installments: 3,
    order: 5, published: true,
    fullDescription: '', totalHours: '', format: '',
    objectives: [], syllabus: [], requirements: [],
  },
]

jest.mock('@/lib/courses', () => ({
  getPublishedCourses: jest.fn(() => Promise.resolve(mockCourses)),
  getCourseModules: jest.fn(() => Promise.resolve([])),
}))

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuth.mockReturnValue({ user: { uid: '123' }, userProfile: null, loading: false, refreshProfile: jest.fn() })
    ;(getPurchasedCourses as jest.Mock).mockResolvedValue([])
  })

  it('renders loading skeleton initially', () => {
    mockUseAuth.mockReturnValue({ user: null, userProfile: null, loading: true, refreshProfile: jest.fn() })
    render(<DashboardPage />)
    expect(screen.getByTestId('dashboard-skeleton')).toBeInTheDocument()
  })

  it('renders dashboard content after loading', async () => {
    render(<DashboardPage />)
    await screen.findByText('Meus Cursos')
    expect(screen.getByText('Meus Cursos')).toBeInTheDocument()
    expect(screen.getByText('Instituto Casa Bíblica')).toBeInTheDocument()
  })

  it('renders logo after loading', async () => {
    render(<DashboardPage />)
    const logo = await screen.findByAltText('Logo Instituto Casa Bíblica')
    expect(logo).toBeInTheDocument()
  })

  it('shows empty state when user has no courses', async () => {
    render(<DashboardPage />)
    expect(await screen.findByText(/Você ainda não está matriculado em nenhum curso/i)).toBeInTheDocument()
  })

  it('renders available courses section', async () => {
    render(<DashboardPage />)
    expect(await screen.findByText('Cursos Disponíveis')).toBeInTheDocument()
    expect(screen.getByText(/Inscreva-se nos próximos cursos/i)).toBeInTheDocument()
  })

  it('displays upcoming courses with enrollment buttons', async () => {
    render(<DashboardPage />)
    await screen.findByText('Cursos Disponíveis')
    expect(screen.getByText('Fundamentos da Fé')).toBeInTheDocument()
    const enrollButtons = screen.getAllByText('Inscrever-se')
    expect(enrollButtons.length).toBeGreaterThan(0)
  })

  it('links to inscription page when enrolling', async () => {
    render(<DashboardPage />)
    await screen.findByText('Cursos Disponíveis')
    const enrollLinks = screen.getAllByRole('link', { name: 'Inscrever-se' })
    expect(enrollLinks.length).toBeGreaterThan(0)
    const fundamentosEnrollLink = enrollLinks.find(
      (link) => link.getAttribute('href') === '/course/fundamentos-da-fe/enrollment'
    )
    expect(fundamentosEnrollLink).toBeInTheDocument()
  })

  it('shows enrolled state when user has purchased course', async () => {
    mockUseAuth.mockReturnValue({ user: { uid: '123', displayName: 'João Silva' }, userProfile: { fullName: 'João Silva', email: 'joao@email.com' }, loading: false, refreshProfile: jest.fn() })
    ;(getPurchasedCourses as jest.Mock).mockResolvedValue([
      { courseId: 'fundamentos-da-fe', purchaseDate: new Date().toISOString(), paymentMethod: 'pix', amount: 250, status: 'paid' },
    ])

    render(<DashboardPage />)
    await screen.findByText('Fundamentos da Fé')
    expect(screen.getByText('Fundamentos da Fé')).toBeInTheDocument()
  })

  it('has correct background styling', async () => {
    const { container } = render(<DashboardPage />)
    await screen.findByText('Meus Cursos')
    const section = container.querySelector('section')
    expect(section).toHaveClass('bg-background')
  })

  it('displays course details correctly', async () => {
    render(<DashboardPage />)
    await screen.findByText('Fundamentos da Fé')
    expect(screen.getByText('8 semanas')).toBeInTheDocument()
    expect(screen.getByText('11 Mai 2026')).toBeInTheDocument()
    expect(screen.getAllByText('Iniciante')[0]).toBeInTheDocument()
  })
})
