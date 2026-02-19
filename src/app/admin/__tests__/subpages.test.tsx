import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('@/lib/firebase', () => ({ auth: {}, signOut: jest.fn() }));

const mockUseAuth = jest.fn();
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({ id: 'fundamentos-da-fe' })),
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

// Mock courses module
const mockCourse = {
  id: 'fundamentos-da-fe', title: 'Fundamentos da Fé',
  description: 'Test', fullDescription: 'Full desc', image: '/test.jpg',
  level: 'Iniciante', duration: '8 semanas', startDate: '11 Mai 2026',
  endDate: '6 Jul 2026', status: 'proximo' as const, instructor: 'Rev. João',
  totalHours: '32h', format: 'Online', pricePix: 250, priceCard: 275,
  installments: 3, order: 1, published: true,
  objectives: ['Obj 1'], syllabus: ['Syl 1'], requirements: ['Req 1'],
};

jest.mock('@/lib/courses', () => ({
  getCourse: jest.fn(() => Promise.resolve(mockCourse)),
  saveCourse: jest.fn(() => Promise.resolve()),
  getCourseModules: jest.fn(() => Promise.resolve([])),
  getCourseHistory: jest.fn(() => Promise.resolve([])),
  restoreCourseVersion: jest.fn(() => Promise.resolve()),
  saveModule: jest.fn(() => Promise.resolve()),
  deleteModule: jest.fn(() => Promise.resolve()),
  saveLesson: jest.fn(() => Promise.resolve()),
  deleteLesson: jest.fn(() => Promise.resolve()),
  isoToPortugueseDate: jest.fn((iso: string) => iso),
}));

import NovoCursoPage from '@/app/admin/courses/new/page';
import EditarCursoPage from '@/app/admin/courses/[id]/page';
import HistoricoPage from '@/app/admin/courses/[id]/history/page';
import ModulosPage from '@/app/admin/courses/[id]/modules/page';
import CourseForm from '@/app/admin/courses/CourseForm';

const { getCourse, getCourseHistory, getCourseModules, saveModule, deleteModule, saveLesson, deleteLesson } = jest.requireMock<typeof import('@/lib/courses')>('@/lib/courses');

describe('Admin Subpages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: { uid: '1', email: 'admin@test.com' },
      userProfile: null,
      isAdmin: true,
      loading: false,
      refreshProfile: jest.fn(),
    });
    // Restore default mocks
    getCourse.mockResolvedValue(mockCourse);
    getCourseHistory.mockResolvedValue([]);
    getCourseModules.mockResolvedValue([]);
  });

  describe('CourseForm', () => {
    it('renders form fields (title, description, level)', async () => {
      render(<CourseForm onSubmit={jest.fn()} />);
      // Labels don't have htmlFor, so use getByText for labels
      expect(screen.getByText('Titulo')).toBeInTheDocument();
      expect(screen.getByText('Descricao Curta')).toBeInTheDocument();
      expect(screen.getByText('Nivel')).toBeInTheDocument();
    });

    it('renders "Salvar" button', async () => {
      render(<CourseForm onSubmit={jest.fn()} />);
      expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
    });

    it('renders "Info Basica" section heading', async () => {
      render(<CourseForm onSubmit={jest.fn()} />);
      expect(screen.getByText('Informacoes Basicas')).toBeInTheDocument();
    });

    it('renders with isNew={true} shows ID field enabled', async () => {
      render(<CourseForm onSubmit={jest.fn()} isNew={true} />);
      expect(screen.getByPlaceholderText('ex: fundamentos-da-fe')).toBeEnabled();
    });

    it('renders with initialData shows pre-filled data', async () => {
      render(<CourseForm onSubmit={jest.fn()} initialData={mockCourse} />);
      const titleInput = screen.getByPlaceholderText('Nome do curso') as HTMLInputElement;
      expect(titleInput.value).toBe('Fundamentos da Fé');
    });

    it('updates field on input change', () => {
      render(<CourseForm onSubmit={jest.fn()} isNew />);
      const titleInput = screen.getByPlaceholderText('Nome do curso') as HTMLInputElement;
      fireEvent.change(titleInput, { target: { value: 'Test Title' } });
      expect(titleInput.value).toBe('Test Title');
    });

    it('adds and removes array items (objectives)', () => {
      render(<CourseForm onSubmit={jest.fn()} isNew />);
      const objInput = screen.getByPlaceholderText('Adicionar objetivo...') as HTMLInputElement;
      fireEvent.change(objInput, { target: { value: 'New objective' } });
      // Click the + button next to the objectives input
      const addButtons = screen.getAllByRole('button', { name: '+' });
      fireEvent.click(addButtons[0]);
      expect(screen.getByText('New objective')).toBeInTheDocument();
      // Remove it
      const removeButton = screen.getByRole('button', { name: '×' });
      fireEvent.click(removeButton);
      expect(screen.queryByText('New objective')).not.toBeInTheDocument();
    });

    it('handles form submission', async () => {
      const mockSubmit = jest.fn(() => Promise.resolve());
      render(<CourseForm onSubmit={mockSubmit} isNew />);

      // Fill required fields
      const idInput = screen.getByPlaceholderText('ex: fundamentos-da-fe') as HTMLInputElement;
      const titleInput = screen.getByPlaceholderText('Nome do curso') as HTMLInputElement;
      fireEvent.change(idInput, { target: { value: 'test-course' } });
      fireEvent.change(titleInput, { target: { value: 'Test Course' } });

      // Submit
      const submitButton = screen.getByRole('button', { name: /criar curso/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalled();
      });
    });

    it('shows error when required fields are empty', async () => {
      render(<CourseForm onSubmit={jest.fn()} isNew />);
      const submitButton = screen.getByRole('button', { name: /criar curso/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/ID e Titulo sao obrigatorios/i)).toBeInTheDocument();
      });
    });

    it('shows error when changeDescription is empty in edit mode', async () => {
      render(<CourseForm onSubmit={jest.fn()} initialData={mockCourse} />);
      const form = screen.getByRole('button', { name: /salvar alteracoes/i }).closest('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText(/descreva as alteracoes/i)).toBeInTheDocument();
      });
    });

    it('shows error message when onSubmit rejects', async () => {
      const mockSubmit = jest.fn(() => Promise.reject(new Error('fail')));
      render(<CourseForm onSubmit={mockSubmit} isNew />);

      const idInput = screen.getByPlaceholderText('ex: fundamentos-da-fe');
      const titleInput = screen.getByPlaceholderText('Nome do curso');
      fireEvent.change(idInput, { target: { value: 'test' } });
      fireEvent.change(titleInput, { target: { value: 'Test' } });
      fireEvent.click(screen.getByRole('button', { name: /criar curso/i }));

      await waitFor(() => {
        expect(screen.getByText(/erro ao salvar/i)).toBeInTheDocument();
      });
    });

    it('updates start date and end date fields', () => {
      render(<CourseForm onSubmit={jest.fn()} isNew />);

      const dateInputs = document.querySelectorAll('input[type="date"]');
      const startDate = dateInputs[0] as HTMLInputElement;
      const endDate = dateInputs[1] as HTMLInputElement;

      fireEvent.change(startDate, { target: { value: '2026-05-11' } });
      expect(startDate.value).toBe('2026-05-11');

      fireEvent.change(endDate, { target: { value: '2026-07-06' } });
      expect(endDate.value).toBe('2026-07-06');
    });
  });

  describe('NovoCursoPage', () => {
    it('renders "Novo Curso" heading', async () => {
      render(<NovoCursoPage />);
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /novo curso/i })).toBeInTheDocument();
      });
    });

    it('renders "Voltar" link back to /admin/courses', async () => {
      render(<NovoCursoPage />);
      await waitFor(() => {
        const voltarLink = screen.getByRole('link', { name: /voltar/i });
        expect(voltarLink).toBeInTheDocument();
        expect(voltarLink).toHaveAttribute('href', '/admin/courses');
      });
    });
  });

  describe('EditarCursoPage', () => {
    it('renders course title in heading "Editar: Fundamentos da Fé" after loading', async () => {
      render(<EditarCursoPage />);
      await waitFor(() => {
        expect(screen.getByText(/editar.*fundamentos da f[ée]/i)).toBeInTheDocument();
      });
    });

    it('shows "Curso nao encontrado" when course is null', async () => {
      getCourse.mockResolvedValue(null);
      render(<EditarCursoPage />);
      await waitFor(() => {
        expect(screen.getByText(/curso n[ãa]o encontrado/i)).toBeInTheDocument();
      });
    });
  });

  describe('HistoricoPage', () => {
    const mockHistory = [
      {
        id: 'hist-1',
        changeDescription: 'Updated title',
        editedBy: 'uid-1',
        editedByEmail: 'admin@test.com',
        timestamp: { toDate: () => new Date('2026-02-10') },
        snapshot: {
          title: 'Old Title',
          status: 'proximo',
          published: true,
          instructor: 'Rev. João',
          pricePix: 250,
        },
      },
      {
        id: 'hist-2',
        changeDescription: 'Changed instructor',
        editedBy: 'uid-2',
        editedByEmail: 'editor@test.com',
        timestamp: { toDate: () => new Date('2026-02-08') },
        snapshot: {
          title: 'Same Title',
          status: 'em-breve',
          published: false,
          instructor: 'Dr. Maria',
          pricePix: 380,
        },
      },
    ];

    it('renders "Historico" heading after loading', async () => {
      render(<HistoricoPage />);
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /historico/i })).toBeInTheDocument();
      });
    });

    it('shows empty state when history is empty', async () => {
      getCourseHistory.mockResolvedValue([]);
      render(<HistoricoPage />);
      await waitFor(() => {
        expect(screen.getByText(/nenhum historico/i)).toBeInTheDocument();
      });
    });

    it('renders "Voltar" link', async () => {
      render(<HistoricoPage />);
      await waitFor(() => {
        expect(screen.getByRole('link', { name: /voltar/i })).toBeInTheDocument();
      });
    });

    it('renders history entries with change descriptions and emails', async () => {
      getCourseHistory.mockResolvedValue(mockHistory);
      render(<HistoricoPage />);

      await waitFor(() => {
        expect(screen.getByText('Updated title')).toBeInTheDocument();
      });

      expect(screen.getByText('Changed instructor')).toBeInTheDocument();
      expect(screen.getByText(/admin@test\.com/)).toBeInTheDocument();
      expect(screen.getByText(/editor@test\.com/)).toBeInTheDocument();
    });

    it('renders snapshot data (title, status, published, instructor, price)', async () => {
      getCourseHistory.mockResolvedValue(mockHistory);
      render(<HistoricoPage />);

      await waitFor(() => {
        expect(screen.getByText('Updated title')).toBeInTheDocument();
      });

      // Snapshot from hist-1
      expect(screen.getByText('Old Title')).toBeInTheDocument();
      expect(screen.getByText('proximo')).toBeInTheDocument();
      expect(screen.getByText('Rev. João')).toBeInTheDocument();
      expect(screen.getByText('R$ 250.00')).toBeInTheDocument();

      // Snapshot from hist-2
      expect(screen.getByText('Same Title')).toBeInTheDocument();
      expect(screen.getByText('em-breve')).toBeInTheDocument();
      expect(screen.getByText('Dr. Maria')).toBeInTheDocument();
      expect(screen.getByText('R$ 380.00')).toBeInTheDocument();
    });

    it('renders "Sim"/"Nao" for published snapshot field', async () => {
      getCourseHistory.mockResolvedValue(mockHistory);
      render(<HistoricoPage />);

      await waitFor(() => {
        expect(screen.getByText('Updated title')).toBeInTheDocument();
      });

      // hist-1 has published: true -> "Sim", hist-2 has published: false -> "Nao"
      const allSim = screen.getAllByText('Sim');
      const allNao = screen.getAllByText('Nao');
      expect(allSim.length).toBeGreaterThanOrEqual(1);
      expect(allNao.length).toBeGreaterThanOrEqual(1);
    });

    it('calls restoreCourseVersion when user confirms restore', async () => {
      const { restoreCourseVersion } = jest.requireMock<typeof import('@/lib/courses')>('@/lib/courses');
      getCourseHistory.mockResolvedValue(mockHistory);
      jest.spyOn(window, 'confirm').mockReturnValue(true);

      render(<HistoricoPage />);

      await waitFor(() => {
        expect(screen.getByText('Updated title')).toBeInTheDocument();
      });

      // Click the first "Restaurar" button (for hist-1)
      const restaurarButtons = screen.getAllByRole('button', { name: 'Restaurar' });
      fireEvent.click(restaurarButtons[0]);

      expect(window.confirm).toHaveBeenCalledWith(
        'Tem certeza que deseja restaurar esta versao? O estado atual sera salvo no historico.'
      );

      await waitFor(() => {
        expect(restoreCourseVersion).toHaveBeenCalledWith(
          'fundamentos-da-fe',
          'hist-1',
          '1',
          'admin@test.com'
        );
      });

      (window.confirm as jest.Mock).mockRestore();
    });

    it('does NOT call restoreCourseVersion when user cancels the confirm dialog', async () => {
      const { restoreCourseVersion } = jest.requireMock<typeof import('@/lib/courses')>('@/lib/courses');
      getCourseHistory.mockResolvedValue(mockHistory);
      jest.spyOn(window, 'confirm').mockReturnValue(false);

      render(<HistoricoPage />);

      await waitFor(() => {
        expect(screen.getByText('Updated title')).toBeInTheDocument();
      });

      const restaurarButtons = screen.getAllByRole('button', { name: 'Restaurar' });
      fireEvent.click(restaurarButtons[0]);

      expect(window.confirm).toHaveBeenCalled();
      expect(restoreCourseVersion).not.toHaveBeenCalled();

      (window.confirm as jest.Mock).mockRestore();
    });
  });

  describe('ModulosPage', () => {
    it('renders course title after loading', async () => {
      render(<ModulosPage />);
      await waitFor(() => {
        expect(screen.getByText(/fundamentos da f[ée]/i)).toBeInTheDocument();
      });
    });

    it('shows "Nenhum modulo cadastrado" when modules are empty', async () => {
      getCourseModules.mockResolvedValue([]);
      render(<ModulosPage />);
      await waitFor(() => {
        expect(screen.getByText(/nenhum m[óo]dulo cadastrado/i)).toBeInTheDocument();
      });
    });

    it('renders "+ Novo Modulo" button', async () => {
      render(<ModulosPage />);
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /\+?\s*novo m[óo]dulo/i })
        ).toBeInTheDocument();
      });
    });

    // --- Interaction tests for function coverage ---

    const mockModules = [
      {
        id: 'modulo-1',
        title: 'Modulo 1',
        order: 1,
        lessons: [
          {
            id: 'aula-1',
            title: 'Aula 1',
            duration: '30 min',
            type: 'video' as const,
            url: 'https://example.com',
            description: 'Desc',
            order: 1,
          },
          {
            id: 'aula-2',
            title: 'Aula 2',
            duration: '15 min',
            type: 'pdf' as const,
            url: 'https://example.com/pdf',
            description: 'PDF lesson',
            order: 2,
          },
        ],
      },
      {
        id: 'modulo-2',
        title: 'Modulo 2',
        order: 2,
        lessons: [
          {
            id: 'aula-3',
            title: 'Aula 3',
            duration: '20 min',
            type: 'text' as const,
            url: 'https://example.com/text',
            description: 'Text lesson',
            order: 1,
          },
        ],
      },
    ];

    it('renders modules and lessons when data exists', async () => {
      getCourseModules.mockResolvedValue(mockModules);
      render(<ModulosPage />);
      await waitFor(() => {
        expect(screen.getByText('Modulo 1')).toBeInTheDocument();
        expect(screen.getByText('Modulo 2')).toBeInTheDocument();
        expect(screen.getByText('Aula 1')).toBeInTheDocument();
        expect(screen.getByText('Aula 2')).toBeInTheDocument();
        expect(screen.getByText('Aula 3')).toBeInTheDocument();
      });
    });

    it('renders TypeIcon correctly for video, pdf, and text types', async () => {
      getCourseModules.mockResolvedValue(mockModules);
      render(<ModulosPage />);
      await waitFor(() => {
        expect(screen.getByText(/30 min/)).toBeInTheDocument();
        expect(screen.getByText(/15 min/)).toBeInTheDocument();
        expect(screen.getByText(/20 min/)).toBeInTheDocument();
      });
      // All three SVG icons should be rendered (one per lesson)
      const svgs = document.querySelectorAll('svg.h-5.w-5');
      expect(svgs.length).toBe(3);
    });

    it('clicking "+ Novo Modulo" shows the ModuleForm', async () => {
      getCourseModules.mockResolvedValue([]);
      render(<ModulosPage />);
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /\+?\s*novo m[óo]dulo/i })).toBeInTheDocument();
      });
      fireEvent.click(screen.getByRole('button', { name: /\+?\s*novo m[óo]dulo/i }));
      // ModuleForm should now be visible with ID, Titulo, Ordem labels and Salvar/Cancelar buttons
      await waitFor(() => {
        expect(screen.getByText('ID')).toBeInTheDocument();
        expect(screen.getByText('Titulo')).toBeInTheDocument();
        expect(screen.getByText('Ordem')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
      });
    });

    it('clicking Cancelar on new module form hides it', async () => {
      getCourseModules.mockResolvedValue([]);
      render(<ModulosPage />);
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /\+?\s*novo m[óo]dulo/i })).toBeInTheDocument();
      });
      fireEvent.click(screen.getByRole('button', { name: /\+?\s*novo m[óo]dulo/i }));
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
      });
      fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /cancelar/i })).not.toBeInTheDocument();
      });
    });

    it('handleSaveModule: saves new module via form and reloads data', async () => {
      getCourseModules.mockResolvedValue([]);
      saveModule.mockResolvedValue(undefined);
      render(<ModulosPage />);
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /\+?\s*novo m[óo]dulo/i })).toBeInTheDocument();
      });
      fireEvent.click(screen.getByRole('button', { name: /\+?\s*novo m[óo]dulo/i }));
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
      });

      // Fill in the module form fields
      const inputs = document.querySelectorAll('input[type="text"]');
      // First text input is ID, second is Titulo
      fireEvent.change(inputs[0], { target: { value: 'modulo-novo' } });
      fireEvent.change(inputs[1], { target: { value: 'Novo Modulo Titulo' } });

      fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

      await waitFor(() => {
        expect(saveModule).toHaveBeenCalledWith('fundamentos-da-fe', expect.objectContaining({
          id: 'modulo-novo',
          title: 'Novo Modulo Titulo',
        }));
      });
      // loadData should be called again (getCourseModules called during initial load + after save)
      await waitFor(() => {
        expect(getCourseModules).toHaveBeenCalledTimes(2);
      });
    });

    it('handleDeleteModule: confirms and deletes module, then reloads', async () => {
      getCourseModules.mockResolvedValue(mockModules);
      deleteModule.mockResolvedValue(undefined);
      jest.spyOn(window, 'confirm').mockReturnValue(true);

      render(<ModulosPage />);
      await waitFor(() => {
        expect(screen.getByText('Modulo 1')).toBeInTheDocument();
      });

      // Click "Excluir" button for the first module
      const excluirButtons = screen.getAllByRole('button', { name: /excluir/i });
      fireEvent.click(excluirButtons[0]);

      await waitFor(() => {
        expect(window.confirm).toHaveBeenCalledWith(
          'Tem certeza que deseja excluir este modulo e todas as suas aulas?'
        );
        expect(deleteModule).toHaveBeenCalledWith('fundamentos-da-fe', 'modulo-1');
      });
      // loadData should be called again after deletion
      await waitFor(() => {
        expect(getCourseModules).toHaveBeenCalledTimes(2);
      });

      (window.confirm as jest.Mock).mockRestore();
    });

    it('handleDeleteModule: does nothing when confirm is cancelled', async () => {
      getCourseModules.mockResolvedValue(mockModules);
      jest.spyOn(window, 'confirm').mockReturnValue(false);

      render(<ModulosPage />);
      await waitFor(() => {
        expect(screen.getByText('Modulo 1')).toBeInTheDocument();
      });

      const excluirButtons = screen.getAllByRole('button', { name: /excluir/i });
      fireEvent.click(excluirButtons[0]);

      expect(window.confirm).toHaveBeenCalled();
      expect(deleteModule).not.toHaveBeenCalled();

      (window.confirm as jest.Mock).mockRestore();
    });

    it('setEditingModule: clicking Editar on a module shows ModuleForm with data', async () => {
      getCourseModules.mockResolvedValue(mockModules);
      render(<ModulosPage />);
      await waitFor(() => {
        expect(screen.getByText('Modulo 1')).toBeInTheDocument();
      });

      // Click "Editar" button for the first module (first Editar button in the document)
      const editarButtons = screen.getAllByRole('button', { name: /^editar$/i });
      fireEvent.click(editarButtons[0]);

      // ModuleForm should appear with pre-filled data
      await waitFor(() => {
        const idInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        expect(idInput.value).toBe('modulo-1');
        expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
      });
    });

    it('setEditingModule: clicking Cancelar on edit module form hides it', async () => {
      getCourseModules.mockResolvedValue(mockModules);
      render(<ModulosPage />);
      await waitFor(() => {
        expect(screen.getByText('Modulo 1')).toBeInTheDocument();
      });

      const editarButtons = screen.getAllByRole('button', { name: /^editar$/i });
      fireEvent.click(editarButtons[0]);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));

      // Module title should reappear in the header (not in a form)
      await waitFor(() => {
        expect(screen.getByText('Modulo 1')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /cancelar/i })).not.toBeInTheDocument();
      });
    });

    it('handleSaveModule: edits existing module and reloads data', async () => {
      getCourseModules.mockResolvedValue(mockModules);
      saveModule.mockResolvedValue(undefined);
      render(<ModulosPage />);
      await waitFor(() => {
        expect(screen.getByText('Modulo 1')).toBeInTheDocument();
      });

      // Click Editar for first module
      const editarButtons = screen.getAllByRole('button', { name: /^editar$/i });
      fireEvent.click(editarButtons[0]);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
      });

      // Change the title in the form
      const textInputs = document.querySelectorAll('input[type="text"]');
      const titleInput = textInputs[1] as HTMLInputElement; // Second text input is Titulo
      fireEvent.change(titleInput, { target: { value: 'Modulo 1 Editado' } });

      fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

      await waitFor(() => {
        expect(saveModule).toHaveBeenCalledWith('fundamentos-da-fe', expect.objectContaining({
          id: 'modulo-1',
          title: 'Modulo 1 Editado',
          order: 1,
        }));
      });
    });

    it('clicking "+ Adicionar Aula" shows LessonForm for that module', async () => {
      getCourseModules.mockResolvedValue(mockModules);
      render(<ModulosPage />);
      await waitFor(() => {
        expect(screen.getByText('Modulo 1')).toBeInTheDocument();
      });

      // Click "+ Adicionar Aula" for the first module
      const addLessonButtons = screen.getAllByRole('button', { name: /\+?\s*adicionar aula/i });
      fireEvent.click(addLessonButtons[0]);

      // LessonForm should appear with lesson-specific fields
      await waitFor(() => {
        expect(screen.getByText('Duracao')).toBeInTheDocument();
        expect(screen.getByText('Tipo')).toBeInTheDocument();
        expect(screen.getByText('URL')).toBeInTheDocument();
        expect(screen.getByText('Descricao')).toBeInTheDocument();
      });
    });

    it('clicking Cancelar on new lesson form hides it', async () => {
      getCourseModules.mockResolvedValue(mockModules);
      render(<ModulosPage />);
      await waitFor(() => {
        expect(screen.getByText('Modulo 1')).toBeInTheDocument();
      });

      const addLessonButtons = screen.getAllByRole('button', { name: /\+?\s*adicionar aula/i });
      fireEvent.click(addLessonButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Duracao')).toBeInTheDocument();
      });

      // Find the Cancelar button in the lesson form
      const cancelButtons = screen.getAllByRole('button', { name: /cancelar/i });
      fireEvent.click(cancelButtons[0]);

      await waitFor(() => {
        // The lesson form-specific fields should be gone
        expect(screen.queryByText('Duracao')).not.toBeInTheDocument();
      });
    });

    it('handleSaveLesson: saves new lesson and reloads data', async () => {
      getCourseModules.mockResolvedValue(mockModules);
      saveLesson.mockResolvedValue(undefined);
      render(<ModulosPage />);
      await waitFor(() => {
        expect(screen.getByText('Modulo 1')).toBeInTheDocument();
      });

      // Open new lesson form for first module
      const addLessonButtons = screen.getAllByRole('button', { name: /\+?\s*adicionar aula/i });
      fireEvent.click(addLessonButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Duracao')).toBeInTheDocument();
      });

      // Fill in the lesson form fields
      const allTextInputs = Array.from(document.querySelectorAll('input[type="text"]'));

      // The lesson form's text inputs will be at the end of the list
      // ID input, Titulo input, Duracao input, URL input
      const lessonIdInput = allTextInputs[allTextInputs.length - 4];
      const lessonTitleInput = allTextInputs[allTextInputs.length - 3];
      const lessonDurationInput = allTextInputs[allTextInputs.length - 2];
      const lessonUrlInput = allTextInputs[allTextInputs.length - 1];

      fireEvent.change(lessonIdInput, { target: { value: 'aula-nova' } });
      fireEvent.change(lessonTitleInput, { target: { value: 'Nova Aula' } });
      fireEvent.change(lessonDurationInput, { target: { value: '45 min' } });
      fireEvent.change(lessonUrlInput, { target: { value: 'https://example.com/new' } });

      // Click Salvar in the lesson form
      const salvarButtons = screen.getAllByRole('button', { name: /salvar/i });
      fireEvent.click(salvarButtons[0]);

      await waitFor(() => {
        expect(saveLesson).toHaveBeenCalledWith(
          'fundamentos-da-fe',
          'modulo-1',
          expect.objectContaining({
            id: 'aula-nova',
            title: 'Nova Aula',
            duration: '45 min',
            url: 'https://example.com/new',
          })
        );
      });
      // loadData should be called again
      await waitFor(() => {
        expect(getCourseModules).toHaveBeenCalledTimes(2);
      });
    });

    it('setEditingLesson: clicking Editar on a lesson shows LessonForm with data', async () => {
      getCourseModules.mockResolvedValue(mockModules);
      render(<ModulosPage />);
      await waitFor(() => {
        expect(screen.getByText('Aula 1')).toBeInTheDocument();
      });

      // Button order in DOM: Module1 Editar, Aula1 Editar, Aula2 Editar, Module2 Editar, Aula3 Editar
      const allEditarButtons = screen.getAllByRole('button', { name: /^editar$/i });
      fireEvent.click(allEditarButtons[1]); // Aula 1 Editar

      // LessonForm should show with Aula 1's data
      await waitFor(() => {
        expect(screen.getByText('Duracao')).toBeInTheDocument();
        expect(screen.getByText('URL')).toBeInTheDocument();
        // Check that the form has the lesson's pre-filled data
        const textInputs = Array.from(document.querySelectorAll('input[type="text"]'));
        const idInput = textInputs.find((inp) => (inp as HTMLInputElement).value === 'aula-1');
        expect(idInput).toBeTruthy();
      });
    });

    it('setEditingLesson: clicking Cancelar on edit lesson form hides it', async () => {
      getCourseModules.mockResolvedValue(mockModules);
      render(<ModulosPage />);
      await waitFor(() => {
        expect(screen.getByText('Aula 1')).toBeInTheDocument();
      });

      const allEditarButtons = screen.getAllByRole('button', { name: /^editar$/i });
      fireEvent.click(allEditarButtons[1]); // Aula 1 Editar

      await waitFor(() => {
        expect(screen.getByText('Duracao')).toBeInTheDocument();
      });

      const cancelButtons = screen.getAllByRole('button', { name: /cancelar/i });
      fireEvent.click(cancelButtons[0]);

      await waitFor(() => {
        expect(screen.queryByText('Duracao')).not.toBeInTheDocument();
        expect(screen.getByText('Aula 1')).toBeInTheDocument();
      });
    });

    it('handleSaveLesson: edits existing lesson and reloads', async () => {
      getCourseModules.mockResolvedValue(mockModules);
      saveLesson.mockResolvedValue(undefined);
      render(<ModulosPage />);
      await waitFor(() => {
        expect(screen.getByText('Aula 1')).toBeInTheDocument();
      });

      // Click Editar on Aula 1
      const allEditarButtons = screen.getAllByRole('button', { name: /^editar$/i });
      fireEvent.click(allEditarButtons[1]);

      await waitFor(() => {
        expect(screen.getByText('Duracao')).toBeInTheDocument();
      });

      // Change the title
      const textInputs = Array.from(document.querySelectorAll('input[type="text"]'));
      const titleInput = textInputs.find((inp) => (inp as HTMLInputElement).value === 'Aula 1') as HTMLInputElement;
      expect(titleInput).toBeTruthy();
      fireEvent.change(titleInput, { target: { value: 'Aula 1 Editada' } });

      const salvarButtons = screen.getAllByRole('button', { name: /salvar/i });
      fireEvent.click(salvarButtons[0]);

      await waitFor(() => {
        expect(saveLesson).toHaveBeenCalledWith(
          'fundamentos-da-fe',
          'modulo-1',
          expect.objectContaining({
            id: 'aula-1',
            title: 'Aula 1 Editada',
          })
        );
      });
    });

    it('handleDeleteLesson: confirms and deletes lesson, then reloads', async () => {
      getCourseModules.mockResolvedValue(mockModules);
      deleteLesson.mockResolvedValue(undefined);
      jest.spyOn(window, 'confirm').mockReturnValue(true);

      render(<ModulosPage />);
      await waitFor(() => {
        expect(screen.getByText('Aula 1')).toBeInTheDocument();
      });

      // Find Excluir buttons: Module1 Excluir, Aula1 Excluir, Aula2 Excluir, Module2 Excluir, Aula3 Excluir
      const excluirButtons = screen.getAllByRole('button', { name: /excluir/i });
      fireEvent.click(excluirButtons[1]); // Aula 1 Excluir

      await waitFor(() => {
        expect(window.confirm).toHaveBeenCalledWith(
          'Tem certeza que deseja excluir esta aula?'
        );
        expect(deleteLesson).toHaveBeenCalledWith(
          'fundamentos-da-fe',
          'modulo-1',
          'aula-1'
        );
      });
      await waitFor(() => {
        expect(getCourseModules).toHaveBeenCalledTimes(2);
      });

      (window.confirm as jest.Mock).mockRestore();
    });

    it('handleDeleteLesson: does nothing when confirm is cancelled', async () => {
      getCourseModules.mockResolvedValue(mockModules);
      jest.spyOn(window, 'confirm').mockReturnValue(false);

      render(<ModulosPage />);
      await waitFor(() => {
        expect(screen.getByText('Aula 1')).toBeInTheDocument();
      });

      const excluirButtons = screen.getAllByRole('button', { name: /excluir/i });
      fireEvent.click(excluirButtons[1]); // Aula 1 Excluir

      expect(window.confirm).toHaveBeenCalled();
      expect(deleteLesson).not.toHaveBeenCalled();

      (window.confirm as jest.Mock).mockRestore();
    });

    it('LessonForm: changing type select updates the form state', async () => {
      getCourseModules.mockResolvedValue(mockModules);
      render(<ModulosPage />);
      await waitFor(() => {
        expect(screen.getByText('Modulo 1')).toBeInTheDocument();
      });

      // Open new lesson form
      const addLessonButtons = screen.getAllByRole('button', { name: /\+?\s*adicionar aula/i });
      fireEvent.click(addLessonButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Tipo')).toBeInTheDocument();
      });

      // The select should default to "video"
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('video');

      // Change to pdf
      fireEvent.change(select, { target: { value: 'pdf' } });
      expect(select.value).toBe('pdf');

      // Change to text
      fireEvent.change(select, { target: { value: 'text' } });
      expect(select.value).toBe('text');
    });

    it('LessonForm: changing textarea (Descricao) updates form state', async () => {
      getCourseModules.mockResolvedValue(mockModules);
      render(<ModulosPage />);
      await waitFor(() => {
        expect(screen.getByText('Modulo 1')).toBeInTheDocument();
      });

      const addLessonButtons = screen.getAllByRole('button', { name: /\+?\s*adicionar aula/i });
      fireEvent.click(addLessonButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Descricao')).toBeInTheDocument();
      });

      const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: 'Nova descricao da aula' } });
      expect(textarea.value).toBe('Nova descricao da aula');
    });

    it('ModuleForm: changing order (number input) updates form state', async () => {
      getCourseModules.mockResolvedValue([]);
      render(<ModulosPage />);
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /\+?\s*novo m[óo]dulo/i })).toBeInTheDocument();
      });
      fireEvent.click(screen.getByRole('button', { name: /\+?\s*novo m[óo]dulo/i }));

      await waitFor(() => {
        expect(screen.getByText('Ordem')).toBeInTheDocument();
      });

      const numberInput = document.querySelector('input[type="number"]') as HTMLInputElement;
      fireEvent.change(numberInput, { target: { value: '5' } });
      expect(numberInput.value).toBe('5');
    });
  });
});
