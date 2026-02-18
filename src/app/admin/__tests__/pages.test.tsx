import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Firebase
jest.mock('@/lib/firebase', () => ({ auth: {}, signOut: jest.fn() }));

// AuthContext
const mockUseAuth = jest.fn();
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// Next.js navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/admin'),
  useRouter: jest.fn(() => ({ push: mockPush })),
}));

// Courses module
jest.mock('@/lib/courses', () => ({
  getAllCourses: jest.fn(() => Promise.resolve([])),
  deleteCourse: jest.fn(() => Promise.resolve()),
  saveCourse: jest.fn(() => Promise.resolve()),
}));

// Admin module
jest.mock('@/lib/admin', () => ({
  getAdminEmails: jest.fn(() => Promise.resolve([])),
  updateAdminEmails: jest.fn(() => Promise.resolve()),
  getEnrollmentsByCourse: jest.fn(() => Promise.resolve([])),
}));

// CSV export
jest.mock('@/lib/csv-export', () => ({
  exportEnrollmentsCSV: jest.fn(),
}));

// Seed courses
jest.mock('@/lib/seed-courses', () => ({
  seedDefaultCourses: jest.fn(() => Promise.resolve(6)),
}));

import AdminLayout from '@/app/admin/layout';
import AdminDashboard from '@/app/admin/page';
import AdminCursosPage from '@/app/admin/courses/page';
import AdminConfiguracoesPage from '@/app/admin/settings/page';
import EnrollmentsPage from '@/app/admin/enrollments/page';
import { getAllCourses } from '@/lib/courses';
import { getAdminEmails, getEnrollmentsByCourse } from '@/lib/admin';

const mockCourses = [
  {
    id: 'fundamentos-da-fe',
    title: 'Fundamentos da Fé',
    description: 'Test desc',
    fullDescription: '',
    image: '/test.jpg',
    level: 'Iniciante',
    duration: '8 semanas',
    startDate: '11 Mai 2026',
    endDate: '6 Jul 2026',
    status: 'proximo' as const,
    instructor: 'Rev. João',
    totalHours: '32h',
    format: 'Online',
    pricePix: 250,
    priceCard: 275,
    installments: 3,
    order: 1,
    published: true,
    objectives: [],
    syllabus: [],
    requirements: [],
  },
  {
    id: 'teologia',
    title: 'Teologia',
    description: 'Test desc 2',
    fullDescription: '',
    image: '/test2.jpg',
    level: 'Intermediário',
    duration: '12 semanas',
    startDate: '14 Abr 2026',
    endDate: '6 Jul 2026',
    status: 'em-breve' as const,
    instructor: 'Dr. Maria',
    totalHours: '48h',
    format: 'Online',
    pricePix: 380,
    priceCard: 420,
    installments: 3,
    order: 2,
    published: false,
    objectives: [],
    syllabus: [],
    requirements: [],
  },
];

describe('Admin Layout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows "Acesso Negado" when user is not admin', async () => {
    mockUseAuth.mockReturnValue({
      isAdmin: false,
      loading: false,
      user: { uid: '1' },
      userProfile: null,
      refreshProfile: jest.fn(),
    });

    render(
      <AdminLayout>
        <div>Child content</div>
      </AdminLayout>
    );

    await waitFor(() => {
      expect(screen.getByText(/Acesso Negado/i)).toBeInTheDocument();
    });
  });

  it('shows sidebar with nav links when user is admin', async () => {
    mockUseAuth.mockReturnValue({
      isAdmin: true,
      loading: false,
      user: { uid: '1' },
      userProfile: null,
      refreshProfile: jest.fn(),
    });

    render(
      <AdminLayout>
        <div>Child content</div>
      </AdminLayout>
    );

    await waitFor(() => {
      expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('shows loading spinner when loading', async () => {
    mockUseAuth.mockReturnValue({
      isAdmin: false,
      loading: true,
      user: null,
      userProfile: null,
      refreshProfile: jest.fn(),
    });

    const { container } = render(
      <AdminLayout>
        <div>Child content</div>
      </AdminLayout>
    );

    // Should show a loading indicator, not the child content or access denied
    expect(screen.queryByText('Child content')).not.toBeInTheDocument();
    expect(screen.queryByText(/Acesso Negado/i)).not.toBeInTheDocument();
    // Check for spinner animation element
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});

describe('Admin Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAdmin: true,
      loading: false,
      user: { uid: '1' },
      userProfile: null,
      refreshProfile: jest.fn(),
    });
  });

  it('shows "Painel Administrativo" heading after loading', async () => {
    (getAllCourses as jest.Mock).mockResolvedValue([]);

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Painel Administrativo/i)).toBeInTheDocument();
    });
  });

  it('shows stats cards with correct counts', async () => {
    (getAllCourses as jest.Mock).mockResolvedValue(mockCourses);

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Total de Cursos/i)).toBeInTheDocument();
    });

    expect(screen.getByText('Publicados')).toBeInTheDocument();
    expect(screen.getByText('Nao Publicados')).toBeInTheDocument();
  });

  it('shows status breakdown', async () => {
    (getAllCourses as jest.Mock).mockResolvedValue(mockCourses);

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Status dos Cursos/i)).toBeInTheDocument();
    });

    expect(screen.getByText('Proximo')).toBeInTheDocument();
    expect(screen.getByText('Em Breve')).toBeInTheDocument();
  });
});

describe('Admin Cursos Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAdmin: true,
      loading: false,
      user: { uid: '1', email: 'admin@test.com' },
      userProfile: null,
      refreshProfile: jest.fn(),
    });
  });

  it('shows course list table', async () => {
    (getAllCourses as jest.Mock).mockResolvedValue(mockCourses);

    render(<AdminCursosPage />);

    await waitFor(() => {
      expect(screen.getByText('Fundamentos da Fé')).toBeInTheDocument();
    });

    expect(screen.getByText('Teologia')).toBeInTheDocument();
  });

  it('shows "Nenhum curso cadastrado" when empty', async () => {
    (getAllCourses as jest.Mock).mockResolvedValue([]);

    render(<AdminCursosPage />);

    await waitFor(() => {
      expect(screen.getByText(/Nenhum curso cadastrado/i)).toBeInTheDocument();
    });
  });

  it('shows "+ Novo Curso" link', async () => {
    (getAllCourses as jest.Mock).mockResolvedValue([]);

    render(<AdminCursosPage />);

    await waitFor(() => {
      expect(screen.getByText(/\+\s*Novo Curso/i)).toBeInTheDocument();
    });
  });

  it('shows course titles and instructor names', async () => {
    (getAllCourses as jest.Mock).mockResolvedValue(mockCourses);

    render(<AdminCursosPage />);

    await waitFor(() => {
      expect(screen.getByText('Fundamentos da Fé')).toBeInTheDocument();
    });

    expect(screen.getByText('Teologia')).toBeInTheDocument();
    expect(screen.getByText(/Rev\. João/)).toBeInTheDocument();
    expect(screen.getByText(/Dr\. Maria/)).toBeInTheDocument();
  });

  it('renders StatusBadge with correct labels for each status', async () => {
    const coursesWithAllStatuses = [
      { ...mockCourses[0], status: 'proximo' as const },
      { ...mockCourses[1], status: 'em-breve' as const },
      {
        ...mockCourses[0],
        id: 'em-andamento-course',
        title: 'Curso Em Andamento',
        status: 'em-andamento' as const,
      },
    ];
    (getAllCourses as jest.Mock).mockResolvedValue(coursesWithAllStatuses);

    render(<AdminCursosPage />);

    await waitFor(() => {
      expect(screen.getByText('Fundamentos da Fé')).toBeInTheDocument();
    });

    expect(screen.getByText('Proximo')).toBeInTheDocument();
    expect(screen.getByText('Em Breve')).toBeInTheDocument();
    expect(screen.getByText('Em Andamento')).toBeInTheDocument();
  });

  it('toggles publish status when clicking "Sim"/"Nao" button', async () => {
    const { saveCourse } = jest.requireMock<typeof import('@/lib/courses')>('@/lib/courses');
    (getAllCourses as jest.Mock).mockResolvedValue(mockCourses);

    render(<AdminCursosPage />);

    await waitFor(() => {
      expect(screen.getByText('Fundamentos da Fé')).toBeInTheDocument();
    });

    // mockCourses[0] has published: true, so its button says "Sim"
    const simButton = screen.getByRole('button', { name: 'Sim' });
    fireEvent.click(simButton);

    await waitFor(() => {
      expect(saveCourse).toHaveBeenCalledWith(
        { id: 'fundamentos-da-fe', published: false },
        '1',
        'admin@test.com',
        'Despublicar curso'
      );
    });
  });

  it('toggles unpublished course to published when clicking "Nao" button', async () => {
    const { saveCourse } = jest.requireMock<typeof import('@/lib/courses')>('@/lib/courses');
    (getAllCourses as jest.Mock).mockResolvedValue(mockCourses);

    render(<AdminCursosPage />);

    await waitFor(() => {
      expect(screen.getByText('Teologia')).toBeInTheDocument();
    });

    // mockCourses[1] has published: false, so its button says "Nao"
    const naoButton = screen.getByRole('button', { name: 'Nao' });
    fireEvent.click(naoButton);

    await waitFor(() => {
      expect(saveCourse).toHaveBeenCalledWith(
        { id: 'teologia', published: true },
        '1',
        'admin@test.com',
        'Publicar curso'
      );
    });
  });

  it('calls deleteCourse when user confirms archiving via modal', async () => {
    const { deleteCourse } = jest.requireMock<typeof import('@/lib/courses')>('@/lib/courses');
    (getAllCourses as jest.Mock).mockResolvedValue(mockCourses);

    render(<AdminCursosPage />);

    await waitFor(() => {
      expect(screen.getByText('Fundamentos da Fé')).toBeInTheDocument();
    });

    // Click the first "Arquivar" button to open modal
    const arquivarButtons = screen.getAllByRole('button', { name: 'Arquivar' });
    fireEvent.click(arquivarButtons[0]);

    // Modal should appear with confirmation message
    await waitFor(() => {
      expect(screen.getByText(/Tem certeza que deseja arquivar/i)).toBeInTheDocument();
    });

    // Click "Confirmar" in the modal
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));

    await waitFor(() => {
      expect(deleteCourse).toHaveBeenCalledWith('fundamentos-da-fe');
    });
  });

  it('does NOT call deleteCourse when user cancels the modal', async () => {
    const { deleteCourse } = jest.requireMock<typeof import('@/lib/courses')>('@/lib/courses');
    (getAllCourses as jest.Mock).mockResolvedValue(mockCourses);

    render(<AdminCursosPage />);

    await waitFor(() => {
      expect(screen.getByText('Fundamentos da Fé')).toBeInTheDocument();
    });

    const arquivarButtons = screen.getAllByRole('button', { name: 'Arquivar' });
    fireEvent.click(arquivarButtons[0]);

    // Modal should appear
    await waitFor(() => {
      expect(screen.getByText(/Tem certeza que deseja arquivar/i)).toBeInTheDocument();
    });

    // Click "Cancelar" in the modal
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(deleteCourse).not.toHaveBeenCalled();
  });
});

describe('Admin Configuracoes Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAdmin: true,
      loading: false,
      user: { uid: '1' },
      userProfile: null,
      refreshProfile: jest.fn(),
    });
  });

  it('shows "Configuracoes" heading', async () => {
    (getAdminEmails as jest.Mock).mockResolvedValue([]);

    render(<AdminConfiguracoesPage />);

    await waitFor(() => {
      expect(screen.getByText('Configuracoes')).toBeInTheDocument();
    });
  });

  it('shows "Nenhum administrador configurado" when empty', async () => {
    (getAdminEmails as jest.Mock).mockResolvedValue([]);

    render(<AdminConfiguracoesPage />);

    await waitFor(() => {
      expect(
        screen.getByText(/Nenhum administrador configurado/i)
      ).toBeInTheDocument();
    });
  });

  it('shows admin emails when they exist', async () => {
    (getAdminEmails as jest.Mock).mockResolvedValue([
      'admin@example.com',
      'pastor@church.com',
    ]);

    render(<AdminConfiguracoesPage />);

    await waitFor(() => {
      expect(screen.getByText('admin@example.com')).toBeInTheDocument();
    });

    expect(screen.getByText('pastor@church.com')).toBeInTheDocument();
  });

  it('adds a new email to the list', async () => {
    (getAdminEmails as jest.Mock).mockResolvedValue([]);

    render(<AdminConfiguracoesPage />);

    await waitFor(() => {
      expect(screen.getByText('Configuracoes')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('novo@email.com');
    fireEvent.change(input, { target: { value: 'new@admin.com' } });
    fireEvent.click(screen.getByText('Adicionar'));

    expect(screen.getByText('new@admin.com')).toBeInTheDocument();
  });

  it('removes an email from the list', async () => {
    (getAdminEmails as jest.Mock).mockResolvedValue(['admin@example.com']);

    render(<AdminConfiguracoesPage />);

    await waitFor(() => {
      expect(screen.getByText('admin@example.com')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Remover'));

    expect(screen.queryByText('admin@example.com')).not.toBeInTheDocument();
  });

  it('saves configuration', async () => {
    const { updateAdminEmails } = jest.requireMock<typeof import('@/lib/admin')>('@/lib/admin');
    (getAdminEmails as jest.Mock).mockResolvedValue(['admin@example.com']);

    render(<AdminConfiguracoesPage />);

    await waitFor(() => {
      expect(screen.getByText('admin@example.com')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Salvar Configuracoes'));

    await waitFor(() => {
      expect(updateAdminEmails).toHaveBeenCalled();
    });
  });

  it('shows error for invalid email', async () => {
    (getAdminEmails as jest.Mock).mockResolvedValue([]);

    render(<AdminConfiguracoesPage />);

    await waitFor(() => {
      expect(screen.getByText('Configuracoes')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('novo@email.com');
    fireEvent.change(input, { target: { value: 'not-an-email' } });
    fireEvent.click(screen.getByText('Adicionar'));

    expect(screen.getByText(/invalido/i)).toBeInTheDocument();
  });
});

describe('Admin Enrollments Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAdmin: true,
      loading: false,
      user: { uid: '1' },
      userProfile: null,
      refreshProfile: jest.fn(),
    });
  });

  it('shows "Matrículas por Curso" heading after loading', async () => {
    (getEnrollmentsByCourse as jest.Mock).mockResolvedValue([]);

    render(<EnrollmentsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Matrículas por Curso/i)).toBeInTheDocument();
    });
  });

  it('shows empty state when no enrollments', async () => {
    (getEnrollmentsByCourse as jest.Mock).mockResolvedValue([]);

    render(<EnrollmentsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Nenhuma matrícula encontrada/i)).toBeInTheDocument();
    });
  });

  it('shows course enrollments with user data', async () => {
    (getEnrollmentsByCourse as jest.Mock).mockResolvedValue([
      {
        courseId: 'fundamentos-da-fe',
        courseTitle: 'Fundamentos da Fé',
        enrollments: [
          {
            uid: 'user-1',
            fullName: 'João Silva',
            email: 'joao@email.com',
            phone: '(11) 99999-0000',
            purchaseDate: '2026-02-10T10:00:00Z',
            paymentMethod: 'pix',
            amount: 250,
            status: 'paid',
          },
        ],
      },
    ]);

    render(<EnrollmentsPage />);

    await waitFor(() => {
      expect(screen.getByText('Fundamentos da Fé')).toBeInTheDocument();
    });

    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('joao@email.com')).toBeInTheDocument();
    expect(screen.getByText('(11) 99999-0000')).toBeInTheDocument();
    expect(screen.getByText('Pago')).toBeInTheDocument();
    expect(screen.getByText('1 aluno')).toBeInTheDocument();
  });

  it('shows "Exportar CSV" button for each course', async () => {
    (getEnrollmentsByCourse as jest.Mock).mockResolvedValue([
      {
        courseId: 'fundamentos-da-fe',
        courseTitle: 'Fundamentos da Fé',
        enrollments: [
          {
            uid: 'user-1',
            fullName: 'João',
            email: 'joao@email.com',
            phone: '',
            purchaseDate: '2026-02-10T10:00:00Z',
            paymentMethod: 'pix',
            amount: 250,
            status: 'paid',
          },
        ],
      },
    ]);

    render(<EnrollmentsPage />);

    await waitFor(() => {
      expect(screen.getByText('Exportar CSV')).toBeInTheDocument();
    });
  });

  it('calls exportEnrollmentsCSV when clicking export button', async () => {
    const { exportEnrollmentsCSV } = jest.requireMock<typeof import('@/lib/csv-export')>('@/lib/csv-export');
    const enrollments = [
      {
        uid: 'user-1',
        fullName: 'João',
        email: 'joao@email.com',
        phone: '',
        purchaseDate: '2026-02-10T10:00:00Z',
        paymentMethod: 'pix',
        amount: 250,
        status: 'paid',
      },
    ];

    (getEnrollmentsByCourse as jest.Mock).mockResolvedValue([
      {
        courseId: 'fundamentos-da-fe',
        courseTitle: 'Fundamentos da Fé',
        enrollments,
      },
    ]);

    render(<EnrollmentsPage />);

    await waitFor(() => {
      expect(screen.getByText('Fundamentos da Fé')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Exportar CSV'));

    expect(exportEnrollmentsCSV).toHaveBeenCalledWith('Fundamentos da Fé', enrollments);
  });
});
