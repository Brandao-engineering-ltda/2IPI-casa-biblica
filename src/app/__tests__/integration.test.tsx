import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import RegistroPage from '../../registro/page';
import InscricaoPage from '../../curso/[id]/inscricao/page';
import DashboardPage from '../../dashboard/page';
import { 
  saveUserData, 
  savePurchasedCourse, 
  getUserData, 
  getPurchasedCourses,
  clearUserData 
} from '@/lib/storage';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

// Use actual storage implementation
jest.unmock('@/lib/storage');

describe('Complete User Flow Integration Tests', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    // Clear all data before each test
    clearUserData();
    
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    
    jest.clearAllMocks();
  });

  describe('End-to-End User Journey', () => {
    it('should complete full registration → purchase → dashboard → content page flow', async () => {
      // STEP 1: User Registration
      // -------------------------
      const userData = {
        nomeCompleto: "João Silva Santos",
        email: "joao.silva@email.com",
        telefone: "(11) 98765-4321",
        dataNascimento: "1990-05-15",
        sexo: "masculino",
        estadoCivil: "casado",
        escolaridade: "superior-completo",
        profissao: "Professor",
        endereco: "Rua das Flores, 123",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01234-567",
        denominacao: "Igreja Batista",
        comoConheceu: "Redes sociais",
        observacoes: "Interesse em teologia"
      };

      saveUserData(userData);

      // Verify user data is saved
      const savedUser = getUserData();
      expect(savedUser).toEqual(userData);
      expect(savedUser?.nomeCompleto).toBe("João Silva Santos");

      // STEP 2: Course Purchase
      // -------------------------
      const purchase = {
        courseId: "fundamentos-da-fe",
        purchaseDate: new Date().toISOString(),
        paymentMethod: "pix" as const,
        amount: 250.00,
        status: "paid" as const
      };

      savePurchasedCourse(purchase);

      // Verify purchase is saved
      const purchases = getPurchasedCourses();
      expect(purchases).toHaveLength(1);
      expect(purchases[0].courseId).toBe("fundamentos-da-fe");
      expect(purchases[0].amount).toBe(250.00);

      // STEP 3: Dashboard Display
      // -------------------------
      render(<DashboardPage />);

      // Wait for dashboard to load
      await waitFor(() => {
        expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();
      }, { timeout: 1500 });

      // Verify personalized greeting
      await waitFor(() => {
        expect(screen.getByText(/olá, joão!/i)).toBeInTheDocument();
      });

      // Verify purchased course is displayed
      await waitFor(() => {
        expect(screen.getByText(/fundamentos da fé/i)).toBeInTheDocument();
      });

      // Verify "Pago" badge is shown
      await waitFor(() => {
        expect(screen.getByText(/✓ pago/i)).toBeInTheDocument();
      });

      // Verify "Acessar Conteúdo" button is shown
      await waitFor(() => {
        expect(screen.getByText(/acessar conteúdo/i)).toBeInTheDocument();
      });

      // STEP 4: Verify course links to content page
      // --------------------------------------------
      const courseLinks = screen.getAllByRole('link');
      const contentLink = courseLinks.find(link => 
        link.getAttribute('href')?.includes('/curso/fundamentos-da-fe/conteudo')
      );
      expect(contentLink).toBeInTheDocument();
    });

    it('should handle multiple course purchases', async () => {
      // Setup user
      saveUserData({
        nomeCompleto: "Maria Silva",
        email: "maria@email.com",
        telefone: "(11) 98765-4321",
        dataNascimento: "1990-05-15",
        sexo: "feminino",
        estadoCivil: "solteiro",
        escolaridade: "superior-completo",
        profissao: "Engenheira",
        endereco: "Rua A, 123",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01234-567",
        denominacao: "Igreja Metodista",
        comoConheceu: "Google",
        observacoes: ""
      });

      // Purchase first course
      savePurchasedCourse({
        courseId: "fundamentos-da-fe",
        purchaseDate: "2026-02-08T10:00:00Z",
        paymentMethod: "pix",
        amount: 250.00,
        status: "paid"
      });

      // Purchase second course
      savePurchasedCourse({
        courseId: "teologia-sistematica",
        purchaseDate: "2026-02-08T11:00:00Z",
        paymentMethod: "cartao",
        amount: 420.00,
        status: "paid"
      });

      // Verify both purchases
      const purchases = getPurchasedCourses();
      expect(purchases).toHaveLength(2);

      // Render dashboard
      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();
      }, { timeout: 1500 });

      // Verify both courses are displayed
      await waitFor(() => {
        expect(screen.getByText(/fundamentos da fé/i)).toBeInTheDocument();
        expect(screen.getByText(/teologia sistemática/i)).toBeInTheDocument();
      });

      // Verify both have "Pago" badges
      await waitFor(() => {
        const pagoBadges = screen.getAllByText(/✓ pago/i);
        expect(pagoBadges).toHaveLength(2);
      });
    });

    it('should show empty dashboard for new user', async () => {
      // No user data, no purchases
      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();
      }, { timeout: 1500 });

      // Verify empty state
      await waitFor(() => {
        expect(screen.getByText(/você ainda não está matriculado em nenhum curso/i)).toBeInTheDocument();
      });

      // Verify available courses are shown
      await waitFor(() => {
        expect(screen.getByText(/cursos disponíveis/i)).toBeInTheDocument();
      });
    });

    it('should persist data across page reloads', async () => {
      // Save user and purchase
      const userData = {
        nomeCompleto: "Pedro Costa",
        email: "pedro@email.com",
        telefone: "(11) 98765-4321",
        dataNascimento: "1985-03-20",
        sexo: "masculino",
        estadoCivil: "casado",
        escolaridade: "pos-graduacao",
        profissao: "Pastor",
        endereco: "Rua B, 456",
        cidade: "Rio de Janeiro",
        estado: "RJ",
        cep: "20000-000",
        denominacao: "Igreja Presbiteriana",
        comoConheceu: "Indicação",
        observacoes: "Quero me aprofundar"
      };

      saveUserData(userData);
      savePurchasedCourse({
        courseId: "hermeneutica-biblica",
        purchaseDate: new Date().toISOString(),
        paymentMethod: "cartao",
        amount: 350.00,
        status: "paid"
      });

      // Simulate page reload by unmounting and remounting
      const { unmount } = render(<DashboardPage />);
      unmount();

      // Re-render dashboard (simulating page reload)
      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();
      }, { timeout: 1500 });

      // Verify data persisted
      await waitFor(() => {
        expect(screen.getByText(/olá, pedro!/i)).toBeInTheDocument();
        expect(screen.getByText(/hermenêutica bíblica/i)).toBeInTheDocument();
      });
    });

    it('should clear all data on logout', async () => {
      // Setup user and purchases
      saveUserData({
        nomeCompleto: "Ana Souza",
        email: "ana@email.com",
        telefone: "(11) 98765-4321",
        dataNascimento: "1992-07-15",
        sexo: "feminino",
        estadoCivil: "solteiro",
        escolaridade: "superior-completo",
        profissao: "Professora",
        endereco: "Rua C, 789",
        cidade: "Belo Horizonte",
        estado: "MG",
        cep: "30000-000",
        denominacao: "Igreja Batista",
        comoConheceu: "Facebook",
        observacoes: ""
      });

      savePurchasedCourse({
        courseId: "fundamentos-da-fe",
        purchaseDate: new Date().toISOString(),
        paymentMethod: "pix",
        amount: 250.00,
        status: "paid"
      });

      // Verify data exists
      expect(getUserData()).not.toBeNull();
      expect(getPurchasedCourses()).toHaveLength(1);

      // Simulate logout
      clearUserData();

      // Verify data is cleared
      expect(getUserData()).toBeNull();
      expect(getPurchasedCourses()).toEqual([]);

      // Render dashboard after logout
      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.queryByTestId('dashboard-skeleton')).not.toBeInTheDocument();
      }, { timeout: 1500 });

      // Verify empty state
      await waitFor(() => {
        expect(screen.getByText(/meus cursos/i)).toBeInTheDocument();
        expect(screen.queryByText(/olá/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Data Validation and Edge Cases', () => {
    it('should handle user with special characters in name', async () => {
      saveUserData({
        nomeCompleto: "José D'Angelo Müller",
        email: "jose@email.com",
        telefone: "(11) 98765-4321",
        dataNascimento: "1988-12-01",
        sexo: "masculino",
        estadoCivil: "casado",
        escolaridade: "mestrado",
        profissao: "Teólogo",
        endereco: "Rua São José, 123",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01234-567",
        denominacao: "Igreja Luterana",
        comoConheceu: "Seminário",
        observacoes: ""
      });

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/olá, josé!/i)).toBeInTheDocument();
      }, { timeout: 1500 });
    });

    it('should handle purchase with multiple quantities in amount', async () => {
      saveUserData({
        nomeCompleto: "Carlos Lima",
        email: "carlos@email.com",
        telefone: "(11) 98765-4321",
        dataNascimento: "1990-05-15",
        sexo: "masculino",
        estadoCivil: "solteiro",
        escolaridade: "superior-completo",
        profissao: "Empresário",
        endereco: "Rua D, 999",
        cidade: "Curitiba",
        estado: "PR",
        cep: "80000-000",
        denominacao: "Igreja Assembleia",
        comoConheceu: "YouTube",
        observacoes: ""
      });

      // Purchase for multiple people (quantity 3)
      savePurchasedCourse({
        courseId: "fundamentos-da-fe",
        purchaseDate: new Date().toISOString(),
        paymentMethod: "pix",
        amount: 750.00, // 250.00 * 3
        status: "paid"
      });

      const purchases = getPurchasedCourses();
      expect(purchases[0].amount).toBe(750.00);
    });

    it('should maintain purchase order chronologically', async () => {
      saveUserData({
        nomeCompleto: "Fernanda Oliveira",
        email: "fernanda@email.com",
        telefone: "(11) 98765-4321",
        dataNascimento: "1995-09-10",
        sexo: "feminino",
        estadoCivil: "solteiro",
        escolaridade: "superior-incompleto",
        profissao: "Estudante",
        endereco: "Rua E, 321",
        cidade: "Brasília",
        estado: "DF",
        cep: "70000-000",
        denominacao: "Igreja Católica",
        comoConheceu: "Instagram",
        observacoes: ""
      });

      // Purchase courses in order
      savePurchasedCourse({
        courseId: "fundamentos-da-fe",
        purchaseDate: "2026-02-08T10:00:00Z",
        paymentMethod: "pix",
        amount: 250.00,
        status: "paid"
      });

      savePurchasedCourse({
        courseId: "teologia-sistematica",
        purchaseDate: "2026-02-08T12:00:00Z",
        paymentMethod: "cartao",
        amount: 420.00,
        status: "paid"
      });

      savePurchasedCourse({
        courseId: "hermeneutica-biblica",
        purchaseDate: "2026-02-08T14:00:00Z",
        paymentMethod: "pix",
        amount: 320.00,
        status: "paid"
      });

      const purchases = getPurchasedCourses();
      expect(purchases).toHaveLength(3);
      expect(purchases[0].courseId).toBe("fundamentos-da-fe");
      expect(purchases[1].courseId).toBe("teologia-sistematica");
      expect(purchases[2].courseId).toBe("hermeneutica-biblica");
    });
  });

  describe('Course Content Access Control', () => {
    it('should allow access to content page only after purchase', () => {
      // Setup user without purchase
      saveUserData({
        nomeCompleto: "Maria Silva",
        email: "maria@email.com",
        telefone: "(11) 98765-4321",
        dataNascimento: "1990-05-15",
        sexo: "feminino",
        estadoCivil: "solteiro",
        escolaridade: "superior-completo",
        profissao: "Engenheira",
        endereco: "Rua A, 123",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01234-567",
        denominacao: "Igreja Metodista",
        comoConheceu: "Google",
        observacoes: ""
      });

      // Try to access without purchase
      let purchases = getPurchasedCourses();
      expect(purchases.some(p => p.courseId === "fundamentos-da-fe")).toBe(false);

      // Make purchase
      savePurchasedCourse({
        courseId: "fundamentos-da-fe",
        purchaseDate: new Date().toISOString(),
        paymentMethod: "pix",
        amount: 250.00,
        status: "paid"
      });

      // Verify access is now granted
      purchases = getPurchasedCourses();
      expect(purchases.some(p => p.courseId === "fundamentos-da-fe")).toBe(true);
    });

    it('should track different courses separately', () => {
      saveUserData({
        nomeCompleto: "Carlos Lima",
        email: "carlos@email.com",
        telefone: "(11) 98765-4321",
        dataNascimento: "1990-05-15",
        sexo: "masculino",
        estadoCivil: "solteiro",
        escolaridade: "superior-completo",
        profissao: "Pastor",
        endereco: "Rua B, 456",
        cidade: "Rio de Janeiro",
        estado: "RJ",
        cep: "20000-000",
        denominacao: "Igreja Batista",
        comoConheceu: "Indicação",
        observacoes: ""
      });

      // Purchase first course
      savePurchasedCourse({
        courseId: "fundamentos-da-fe",
        purchaseDate: "2026-02-08T10:00:00Z",
        paymentMethod: "pix",
        amount: 250.00,
        status: "paid"
      });

      // Purchase second course
      savePurchasedCourse({
        courseId: "teologia-sistematica",
        purchaseDate: "2026-02-09T10:00:00Z",
        paymentMethod: "cartao",
        amount: 420.00,
        status: "paid"
      });

      const purchases = getPurchasedCourses();
      
      // Verify both courses are accessible
      expect(purchases.find(p => p.courseId === "fundamentos-da-fe")).toBeDefined();
      expect(purchases.find(p => p.courseId === "teologia-sistematica")).toBeDefined();
      
      // Verify third course is not accessible
      expect(purchases.find(p => p.courseId === "hermeneutica-biblica")).toBeUndefined();
    });
  });
});
