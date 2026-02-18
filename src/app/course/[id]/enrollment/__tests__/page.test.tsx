import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter, useParams } from 'next/navigation';
import InscricaoPage from '../page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

// Mock Firebase
jest.mock('@/lib/firebase', () => ({
  auth: {},
  signOut: jest.fn(),
}));

// Mock AuthContext (inscricao now uses useAuth for uid)
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { uid: 'test-uid' }, userProfile: null, loading: false, refreshProfile: jest.fn() }),
}));

// Mock storage utility (now async with uid)
jest.mock('@/lib/storage', () => ({
  savePurchasedCourse: jest.fn(() => Promise.resolve()),
}));

// Mock course data from Firestore
const mockCourse = {
  id: 'fundamentos-da-fe',
  title: 'Fundamentos da Fé',
  description: 'Estudo das doutrinas essenciais da fé cristã reformada.',
  image: '/images/courses/fundamentos-da-fe.jpg',
  level: 'Iniciante',
  duration: '8 semanas',
  startDate: '11 Mai 2026',
  endDate: '6 Jul 2026',
  status: 'proximo',
  instructor: 'Rev. João Silva',
  totalHours: '32h de conteúdo',
  format: 'Online ao vivo',
  pricePix: 250,
  priceCard: 275,
  installments: 3,
  order: 1,
  published: true,
  fullDescription: '',
  objectives: [],
  syllabus: [],
  requirements: [],
};

jest.mock('@/lib/courses', () => ({
  getCourse: jest.fn((id: string) => {
    if (id === 'fundamentos-da-fe') return Promise.resolve(mockCourse);
    return Promise.resolve(null);
  }),
}));

describe('InscricaoPage (Payment Page)', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useParams as jest.Mock).mockReturnValue({ id: 'fundamentos-da-fe' });
    jest.clearAllMocks();
  });

  describe('Page Rendering', () => {
    it('should render course information', async () => {
      render(<InscricaoPage />);

      await waitFor(() => {
        expect(screen.getByText(/fundamentos da fé/i)).toBeInTheDocument();
        expect(screen.getByText(/8 semanas/i)).toBeInTheDocument();
        expect(screen.getByText(/rev. joão silva/i)).toBeInTheDocument();
      });
    });

    it('should render payment options', async () => {
      render(<InscricaoPage />);

      await waitFor(() => {
        expect(screen.getByText(/pix/i)).toBeInTheDocument();
        expect(screen.getByText(/cartão de crédito/i)).toBeInTheDocument();
      });
    });

    it('should render submit button', async () => {
      render(<InscricaoPage />);

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /fazer pedido agora/i });
        expect(submitButton).toBeInTheDocument();
      });
    });
  });

  describe('Payment Method Selection', () => {
    it('should allow selecting PIX payment', async () => {
      render(<InscricaoPage />);

      await waitFor(() => {
        expect(screen.getByText(/pix/i)).toBeInTheDocument();
      });

      const radioButtons = screen.getAllByRole('radio');
      const pixOption = radioButtons[0];
      fireEvent.click(pixOption);
      expect(pixOption).toBeChecked();
    });

    it('should display PIX price correctly', async () => {
      render(<InscricaoPage />);

      await waitFor(() => {
        expect(screen.getByText(/R\$ 250\.00/)).toBeInTheDocument();
      });
    });

    it('should display credit card price correctly', async () => {
      render(<InscricaoPage />);

      await waitFor(() => {
        expect(screen.getByText(/R\$ 275\.00/)).toBeInTheDocument();
      });
    });

    it('should show installment information for credit card', async () => {
      render(<InscricaoPage />);

      await waitFor(() => {
        expect(screen.getByText(/em até 3x/i)).toBeInTheDocument();
        expect(screen.getByText(/sem juros/i)).toBeInTheDocument();
      });
    });

    it('should disable submit button when no payment method is selected', async () => {
      render(<InscricaoPage />);

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /fazer pedido agora/i }) as HTMLButtonElement;
        expect(submitButton).toBeDisabled();
      });
    });

    it('should enable submit button when payment method is selected', async () => {
      render(<InscricaoPage />);

      await waitFor(() => {
        expect(screen.getByText(/pix/i)).toBeInTheDocument();
      });

      const pixRadio = screen.getAllByRole('radio')[0];
      const submitButton = screen.getByRole('button', { name: /fazer pedido agora/i }) as HTMLButtonElement;
      fireEvent.click(pixRadio);
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Quantity Selection', () => {
    it('should render quantity selector with default value 1', async () => {
      render(<InscricaoPage />);

      await waitFor(() => {
        const quantityInput = screen.getByRole('spinbutton') as HTMLInputElement;
        expect(quantityInput.value).toBe('1');
      });
    });

    it('should increment quantity', async () => {
      render(<InscricaoPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
      });

      const incrementButton = screen.getByRole('button', { name: '+' });
      const quantityInput = screen.getByRole('spinbutton') as HTMLInputElement;
      fireEvent.click(incrementButton);
      expect(quantityInput.value).toBe('2');
    });

    it('should not allow quantity less than 1', async () => {
      render(<InscricaoPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '-' })).toBeInTheDocument();
      });

      const decrementButton = screen.getByRole('button', { name: '-' });
      const quantityInput = screen.getByRole('spinbutton') as HTMLInputElement;
      fireEvent.click(decrementButton);
      expect(quantityInput.value).toBe('1');
    });

    it('should update total price when quantity changes', async () => {
      render(<InscricaoPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
      });

      const incrementButton = screen.getByRole('button', { name: '+' });
      fireEvent.click(incrementButton); // Quantity = 2

      expect(screen.getByText(/R\$ 500\.00/)).toBeInTheDocument();
    });
  });

  describe('Payment Processing', () => {
    it('should save purchase and redirect to dashboard on successful payment', async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { savePurchasedCourse } = require('@/lib/storage');

      render(<InscricaoPage />);

      await waitFor(() => {
        expect(screen.getByText(/pix/i)).toBeInTheDocument();
      });

      const pixRadio = screen.getAllByRole('radio')[0];
      const submitButton = screen.getByRole('button', { name: /fazer pedido agora/i });

      fireEvent.click(pixRadio);
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(savePurchasedCourse).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      }, { timeout: 3000 });
    });

    it('should save correct purchase data for PIX payment', async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { savePurchasedCourse } = require('@/lib/storage');

      render(<InscricaoPage />);

      await waitFor(() => {
        expect(screen.getByText(/pix/i)).toBeInTheDocument();
      });

      const pixRadio = screen.getAllByRole('radio')[0];
      const submitButton = screen.getByRole('button', { name: /fazer pedido agora/i });

      fireEvent.click(pixRadio);
      fireEvent.click(submitButton);

      await waitFor(() => {
        // savePurchasedCourse now takes (uid, purchase)
        expect(savePurchasedCourse).toHaveBeenCalledWith(
          'test-uid',
          expect.objectContaining({
            courseId: 'fundamentos-da-fe',
            paymentMethod: 'pix',
            amount: 250.00,
            status: 'paid'
          })
        );
      }, { timeout: 3000 });
    });

    it('should show processing state during submission', async () => {
      render(<InscricaoPage />);

      await waitFor(() => {
        expect(screen.getByText(/pix/i)).toBeInTheDocument();
      });

      const pixRadio = screen.getAllByRole('radio')[0];
      const submitButton = screen.getByRole('button', { name: /fazer pedido agora/i });

      fireEvent.click(pixRadio);
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/processando.../i)).toBeInTheDocument();
      });
    });
  });

  describe('Important Information Section', () => {
    it('should display important information about enrollment', async () => {
      render(<InscricaoPage />);

      await waitFor(() => {
        expect(screen.getByText(/informações importantes/i)).toBeInTheDocument();
        expect(screen.getByText(/a inscrição só é válida após confirmação do pagamento/i)).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    it('should render back link to course page', async () => {
      render(<InscricaoPage />);

      await waitFor(() => {
        const backLink = screen.getByRole('link', { name: /voltar para o curso/i });
        expect(backLink).toBeInTheDocument();
        expect(backLink).toHaveAttribute('href', '/course/fundamentos-da-fe');
      });
    });
  });

  describe('Course Not Found', () => {
    it('should show error message for invalid course', async () => {
      (useParams as jest.Mock).mockReturnValue({ id: 'invalid-course-id' });

      render(<InscricaoPage />);

      await waitFor(() => {
        expect(screen.getByText(/curso não encontrado/i)).toBeInTheDocument();
      });
    });
  });

  describe('Security Note', () => {
    it('should display transforme.tech security badge', async () => {
      render(<InscricaoPage />);

      await waitFor(() => {
        expect(screen.getByText(/pagamento processado com segurança via/i)).toBeInTheDocument();
        expect(screen.getByText(/transforme\.tech/i)).toBeInTheDocument();
      });
    });
  });
});
