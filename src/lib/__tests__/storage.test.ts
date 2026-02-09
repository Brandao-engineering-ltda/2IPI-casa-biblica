import { 
  saveUserData, 
  getUserData, 
  savePurchasedCourse, 
  getPurchasedCourses, 
  isPurchased, 
  clearUserData,
  type UserData,
  type PurchasedCourse
} from '../storage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Storage Utilities', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('User Data Management', () => {
    const mockUserData: UserData = {
      nomeCompleto: "João Silva Santos",
      email: "joao.silva@email.com",
      telefone: "(11) 98765-4321",
      dataNascimento: "1990-05-15",
      sexo: "masculino",
      estadoCivil: "casado",
      escolaridade: "superior-completo",
      profissao: "Professor",
      endereco: "Rua das Flores, 123, Apto 45",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567",
      denominacao: "Igreja Batista",
      comoConheceu: "Redes sociais",
      observacoes: "Tenho interesse em aprofundar meus conhecimentos teológicos."
    };

    it('should save user data to localStorage', () => {
      saveUserData(mockUserData);
      
      const stored = localStorage.getItem('casa_biblica_user_data');
      expect(stored).not.toBeNull();
      
      const parsed = JSON.parse(stored!);
      expect(parsed).toEqual(mockUserData);
    });

    it('should retrieve user data from localStorage', () => {
      saveUserData(mockUserData);
      
      const retrieved = getUserData();
      expect(retrieved).toEqual(mockUserData);
    });

    it('should return null when no user data exists', () => {
      const retrieved = getUserData();
      expect(retrieved).toBeNull();
    });

    it('should update user data when saved again', () => {
      saveUserData(mockUserData);
      
      const updatedData = {
        ...mockUserData,
        telefone: "(11) 99999-9999"
      };
      
      saveUserData(updatedData);
      
      const retrieved = getUserData();
      expect(retrieved?.telefone).toBe("(11) 99999-9999");
    });
  });

  describe('Purchased Courses Management', () => {
    const mockPurchase1: PurchasedCourse = {
      courseId: "fundamentos-da-fe",
      purchaseDate: "2026-02-08T10:00:00Z",
      paymentMethod: "pix",
      amount: 250.00,
      status: "paid"
    };

    const mockPurchase2: PurchasedCourse = {
      courseId: "teologia-sistematica",
      purchaseDate: "2026-02-08T11:00:00Z",
      paymentMethod: "cartao",
      amount: 420.00,
      status: "paid"
    };

    it('should save a purchased course', () => {
      savePurchasedCourse(mockPurchase1);
      
      const purchases = getPurchasedCourses();
      expect(purchases).toHaveLength(1);
      expect(purchases[0]).toEqual(mockPurchase1);
    });

    it('should save multiple purchased courses', () => {
      savePurchasedCourse(mockPurchase1);
      savePurchasedCourse(mockPurchase2);
      
      const purchases = getPurchasedCourses();
      expect(purchases).toHaveLength(2);
      expect(purchases[0]).toEqual(mockPurchase1);
      expect(purchases[1]).toEqual(mockPurchase2);
    });

    it('should return empty array when no purchases exist', () => {
      const purchases = getPurchasedCourses();
      expect(purchases).toEqual([]);
    });

    it('should check if a course is purchased', () => {
      savePurchasedCourse(mockPurchase1);
      
      expect(isPurchased("fundamentos-da-fe")).toBe(true);
      expect(isPurchased("teologia-sistematica")).toBe(false);
    });

    it('should maintain purchase history', () => {
      savePurchasedCourse(mockPurchase1);
      savePurchasedCourse(mockPurchase2);
      
      const purchases = getPurchasedCourses();
      expect(purchases).toHaveLength(2);
      
      // Verify all purchases are maintained
      const courseIds = purchases.map(p => p.courseId);
      expect(courseIds).toContain("fundamentos-da-fe");
      expect(courseIds).toContain("teologia-sistematica");
    });
  });

  describe('Clear User Data', () => {
    const mockUserData: UserData = {
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
      observacoes: "Interesse em teologia."
    };

    const mockPurchase: PurchasedCourse = {
      courseId: "fundamentos-da-fe",
      purchaseDate: "2026-02-08T10:00:00Z",
      paymentMethod: "pix",
      amount: 250.00,
      status: "paid"
    };

    it('should clear all user data and purchases', () => {
      // Set up data
      saveUserData(mockUserData);
      savePurchasedCourse(mockPurchase);
      
      // Verify data exists
      expect(getUserData()).not.toBeNull();
      expect(getPurchasedCourses()).toHaveLength(1);
      
      // Clear all data
      clearUserData();
      
      // Verify data is cleared
      expect(getUserData()).toBeNull();
      expect(getPurchasedCourses()).toEqual([]);
    });

    it('should not throw error when clearing empty storage', () => {
      expect(() => clearUserData()).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle corrupted localStorage data gracefully', () => {
      // Manually set invalid JSON
      localStorage.setItem('casa_biblica_user_data', 'invalid json');
      
      expect(() => getUserData()).toThrow();
    });

    it('should handle empty purchased courses array', () => {
      localStorage.setItem('casa_biblica_purchased_courses', '[]');
      
      const purchases = getPurchasedCourses();
      expect(purchases).toEqual([]);
      expect(isPurchased("any-course")).toBe(false);
    });

    it('should preserve data integrity with special characters', () => {
      const specialUserData: UserData = {
        nomeCompleto: "José Ângelo D'Souza",
        email: "jose+angelo@email.com",
        telefone: "(11) 98765-4321",
        dataNascimento: "1990-05-15",
        sexo: "masculino",
        estadoCivil: "casado",
        escolaridade: "superior-completo",
        profissao: "Professor & Coordenador",
        endereco: "Rua São João, 123 - Apto 45°",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01234-567",
        denominacao: "Igreja Batista 'Nova Vida'",
        comoConheceu: "Google & Redes Sociais",
        observacoes: "Interesse em \"Teologia Reformada\""
      };

      saveUserData(specialUserData);
      const retrieved = getUserData();
      
      expect(retrieved).toEqual(specialUserData);
    });
  });
});
