import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter, useParams } from 'next/navigation';
import InscricaoPage from '../page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

// Mock storage utility
jest.mock('@/lib/storage', () => ({
  savePurchasedCourse: jest.fn(),
}));

describe('InscricaoPage (Payment Page)', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useParams as jest.Mock).mockReturnValue({
      id: 'fundamentos-da-fe',
    });
    jest.clearAllMocks();
  });

  describe('Page Rendering', () => {
    it('should render course information', () => {
      render(<InscricaoPage />);

      expect(screen.getByText(/fundamentos da fé/i)).toBeInTheDocument();
      expect(screen.getByText(/8 semanas/i)).toBeInTheDocument();
      expect(screen.getByText(/rev. joão silva/i)).toBeInTheDocument();
    });

    it('should render payment options', () => {
      render(<InscricaoPage />);

      expect(screen.getByText(/pix/i)).toBeInTheDocument();
      expect(screen.getByText(/cartão de crédito/i)).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<InscricaoPage />);

      const submitButton = screen.getByRole('button', { name: /fazer pedido agora/i });
      expect(submitButton).toBeInTheDocument();
    });

    it('should show course image', () => {
      render(<InscricaoPage />);

      const images = screen.getAllByRole('img');
      const courseImage = images.find(img => 
        img.getAttribute('alt')?.includes('Fundamentos da Fé')
      );
      expect(courseImage).toBeInTheDocument();
    });
  });

  describe('Payment Method Selection', () => {
    it('should allow selecting PIX payment', () => {
      render(<InscricaoPage />);

      const pixOption = screen.getByRole('radio', { name: '' });
      
      fireEvent.click(pixOption);

      expect(pixOption).toBeChecked();
    });

    it('should display PIX price correctly', () => {
      render(<InscricaoPage />);

      expect(screen.getByText(/R\$ 250\.00/)).toBeInTheDocument();
    });

    it('should display credit card price correctly', () => {
      render(<InscricaoPage />);

      expect(screen.getByText(/R\$ 275\.00/)).toBeInTheDocument();
    });

    it('should show installment information for credit card', () => {
      render(<InscricaoPage />);

      expect(screen.getByText(/em até 3x/i)).toBeInTheDocument();
      expect(screen.getByText(/sem juros/i)).toBeInTheDocument();
    });

    it('should disable submit button when no payment method is selected', () => {
      render(<InscricaoPage />);

      const submitButton = screen.getByRole('button', { name: /fazer pedido agora/i }) as HTMLButtonElement;

      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when payment method is selected', () => {
      render(<InscricaoPage />);

      const pixRadio = screen.getAllByRole('radio')[0];
      const submitButton = screen.getByRole('button', { name: /fazer pedido agora/i }) as HTMLButtonElement;

      fireEvent.click(pixRadio);

      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Quantity Selection', () => {
    it('should render quantity selector with default value 1', () => {
      render(<InscricaoPage />);

      const quantityInput = screen.getByRole('spinbutton') as HTMLInputElement;
      expect(quantityInput.value).toBe('1');
    });

    it('should increment quantity', () => {
      render(<InscricaoPage />);

      const incrementButton = screen.getByRole('button', { name: '+' });
      const quantityInput = screen.getByRole('spinbutton') as HTMLInputElement;

      fireEvent.click(incrementButton);

      expect(quantityInput.value).toBe('2');
    });

    it('should decrement quantity', () => {
      render(<InscricaoPage />);

      const incrementButton = screen.getByRole('button', { name: '+' });
      const decrementButton = screen.getByRole('button', { name: '-' });
      const quantityInput = screen.getByRole('spinbutton') as HTMLInputElement;

      // First increment to 2
      fireEvent.click(incrementButton);
      expect(quantityInput.value).toBe('2');

      // Then decrement to 1
      fireEvent.click(decrementButton);
      expect(quantityInput.value).toBe('1');
    });

    it('should not allow quantity less than 1', () => {
      render(<InscricaoPage />);

      const decrementButton = screen.getByRole('button', { name: '-' });
      const quantityInput = screen.getByRole('spinbutton') as HTMLInputElement;

      fireEvent.click(decrementButton);

      expect(quantityInput.value).toBe('1');
    });

    it('should update total price when quantity changes', () => {
      render(<InscricaoPage />);

      const incrementButton = screen.getByRole('button', { name: '+' });
      
      fireEvent.click(incrementButton); // Quantity = 2

      // PIX price should be 250.00 * 2 = 500.00
      expect(screen.getByText(/R\$ 500\.00/)).toBeInTheDocument();
    });

    it('should allow manual quantity input', () => {
      render(<InscricaoPage />);

      const quantityInput = screen.getByRole('spinbutton') as HTMLInputElement;

      fireEvent.change(quantityInput, { target: { value: '5' } });

      expect(quantityInput.value).toBe('5');
    });
  });

  describe('Payment Processing', () => {
    it('should save purchase and redirect to dashboard on successful payment', async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { savePurchasedCourse } = require('@/lib/storage');
      
      render(<InscricaoPage />);

      const pixRadio = screen.getAllByRole('radio')[0];
      const submitButton = screen.getByRole('button', { name: /fazer pedido agora/i });

      // Select payment method
      fireEvent.click(pixRadio);
      
      // Submit
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(savePurchasedCourse).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      }, { timeout: 2000 });
    });

    it('should save correct purchase data for PIX payment', async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { savePurchasedCourse } = require('@/lib/storage');
      
      render(<InscricaoPage />);

      const pixRadio = screen.getAllByRole('radio')[0];
      const submitButton = screen.getByRole('button', { name: /fazer pedido agora/i });

      fireEvent.click(pixRadio);
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(savePurchasedCourse).toHaveBeenCalledWith(
          expect.objectContaining({
            courseId: 'fundamentos-da-fe',
            paymentMethod: 'pix',
            amount: 250.00,
            status: 'paid'
          })
        );
      }, { timeout: 2000 });
    });

    it('should save correct purchase data for credit card payment', async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { savePurchasedCourse } = require('@/lib/storage');
      
      render(<InscricaoPage />);

      const cartaoRadio = screen.getAllByRole('radio')[1];
      const submitButton = screen.getByRole('button', { name: /fazer pedido agora/i });

      fireEvent.click(cartaoRadio);
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(savePurchasedCourse).toHaveBeenCalledWith(
          expect.objectContaining({
            courseId: 'fundamentos-da-fe',
            paymentMethod: 'cartao',
            amount: 275.00,
            status: 'paid'
          })
        );
      }, { timeout: 2000 });
    });

    it('should show processing state during submission', async () => {
      render(<InscricaoPage />);

      const pixRadio = screen.getAllByRole('radio')[0];
      const submitButton = screen.getByRole('button', { name: /fazer pedido agora/i });

      fireEvent.click(pixRadio);
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/processando.../i)).toBeInTheDocument();
      });
    });

    it('should calculate correct amount for multiple quantities', async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { savePurchasedCourse } = require('@/lib/storage');
      
      render(<InscricaoPage />);

      const incrementButton = screen.getByRole('button', { name: '+' });
      const pixRadio = screen.getAllByRole('radio')[0];
      const submitButton = screen.getByRole('button', { name: /fazer pedido agora/i });

      // Set quantity to 3
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);

      fireEvent.click(pixRadio);
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(savePurchasedCourse).toHaveBeenCalledWith(
          expect.objectContaining({
            amount: 750.00 // 250.00 * 3
          })
        );
      }, { timeout: 2000 });
    });
  });

  describe('Important Information Section', () => {
    it('should display important information about enrollment', () => {
      render(<InscricaoPage />);

      expect(screen.getByText(/informações importantes/i)).toBeInTheDocument();
      expect(screen.getByText(/a inscrição só é válida após confirmação do pagamento/i)).toBeInTheDocument();
      expect(screen.getByText(/cancelamento com mais de 15 dias/i)).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should render back link to course page', () => {
      render(<InscricaoPage />);

      const backLink = screen.getByRole('link', { name: /voltar para o curso/i });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute('href', '/curso/fundamentos-da-fe');
    });
  });

  describe('Course Not Found', () => {
    it('should show error message for invalid course', () => {
      (useParams as jest.Mock).mockReturnValue({
        id: 'invalid-course-id',
      });

      render(<InscricaoPage />);

      expect(screen.getByText(/curso não encontrado/i)).toBeInTheDocument();
    });

    it('should show back link when course not found', () => {
      (useParams as jest.Mock).mockReturnValue({
        id: 'invalid-course-id',
      });

      render(<InscricaoPage />);

      const backLink = screen.getByRole('link', { name: /voltar para cursos/i });
      expect(backLink).toBeInTheDocument();
    });
  });

  describe('Security Note', () => {
    it('should display transforme.tech security badge', () => {
      render(<InscricaoPage />);

      expect(screen.getByText(/pagamento processado com segurança via/i)).toBeInTheDocument();
      expect(screen.getByText(/transforme\.tech/i)).toBeInTheDocument();
    });
  });
});
