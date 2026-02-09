import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter, useParams } from 'next/navigation';
import CoursePage from '../page';
import { getUserData } from '@/lib/storage';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

// Mock storage utility
jest.mock('@/lib/storage', () => ({
  getUserData: jest.fn(),
}));

describe('CoursePage - Back Button Navigation', () => {
  const mockPush = jest.fn();
  const mockBack = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
    });
    (useParams as jest.Mock).mockReturnValue({
      id: 'fundamentos-da-fe',
    });
    jest.clearAllMocks();
  });

  describe('Voltar Button Behavior', () => {
    it('should redirect to dashboard when user is logged in', () => {
      // Mock user is logged in
      (getUserData as jest.Mock).mockReturnValue({
        nomeCompleto: "João Silva",
        email: "joao@email.com",
      });

      render(<CoursePage />);

      const voltarButton = screen.getByRole('button', { name: /← voltar/i });
      fireEvent.click(voltarButton);

      expect(mockPush).toHaveBeenCalledWith('/dashboard');
      expect(mockBack).not.toHaveBeenCalled();
    });

    it('should go back in history when user is not logged in', () => {
      // Mock user is not logged in
      (getUserData as jest.Mock).mockReturnValue(null);

      render(<CoursePage />);

      const voltarButton = screen.getByRole('button', { name: /← voltar/i });
      fireEvent.click(voltarButton);

      expect(mockBack).toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalledWith('/dashboard');
    });

    it('should redirect to dashboard from course not found page when logged in', () => {
      (useParams as jest.Mock).mockReturnValue({
        id: 'invalid-course-id',
      });
      (getUserData as jest.Mock).mockReturnValue({
        nomeCompleto: "João Silva",
        email: "joao@email.com",
      });

      render(<CoursePage />);

      expect(screen.getByText(/curso não encontrado/i)).toBeInTheDocument();

      const voltarButton = screen.getByRole('button', { name: /← voltar/i });
      fireEvent.click(voltarButton);

      expect(mockPush).toHaveBeenCalledWith('/dashboard');
      expect(mockBack).not.toHaveBeenCalled();
    });

    it('should go back from course not found page when not logged in', () => {
      (useParams as jest.Mock).mockReturnValue({
        id: 'invalid-course-id',
      });
      (getUserData as jest.Mock).mockReturnValue(null);

      render(<CoursePage />);

      expect(screen.getByText(/curso não encontrado/i)).toBeInTheDocument();

      const voltarButton = screen.getByRole('button', { name: /← voltar/i });
      fireEvent.click(voltarButton);

      expect(mockBack).toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('Bug Fix Verification', () => {
    it('should handle navigation from payment page → back → course page → back correctly', () => {
      // Simulate user logged in and came from payment page
      (getUserData as jest.Mock).mockReturnValue({
        nomeCompleto: "João Silva",
        email: "joao@email.com",
      });

      render(<CoursePage />);

      // User clicks back button
      const voltarButton = screen.getByRole('button', { name: /← voltar/i });
      fireEvent.click(voltarButton);

      // Should go to dashboard, not back to payment page
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
      expect(mockBack).not.toHaveBeenCalled();
    });

    it('should allow guest users to navigate back normally', () => {
      // Guest user (not logged in)
      (getUserData as jest.Mock).mockReturnValue(null);

      render(<CoursePage />);

      const voltarButton = screen.getByRole('button', { name: /← voltar/i });
      fireEvent.click(voltarButton);

      // Should use browser back
      expect(mockBack).toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should check user login status on each back click', () => {
      (getUserData as jest.Mock).mockReturnValue({
        nomeCompleto: "João Silva",
        email: "joao@email.com",
      });

      render(<CoursePage />);

      const voltarButton = screen.getByRole('button', { name: /← voltar/i });
      
      // First click
      fireEvent.click(voltarButton);
      expect(getUserData).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith('/dashboard');

      // Clear mocks
      jest.clearAllMocks();
      
      // User logs out
      (getUserData as jest.Mock).mockReturnValue(null);

      // Second click
      fireEvent.click(voltarButton);
      expect(getUserData).toHaveBeenCalledTimes(1);
      expect(mockBack).toHaveBeenCalled();
    });
  });

  describe('Inscrever-se Button', () => {
    it('should redirect to payment page', () => {
      (getUserData as jest.Mock).mockReturnValue(null);

      render(<CoursePage />);

      const inscreversButton = screen.getByRole('button', { name: /inscrever-se agora/i });
      fireEvent.click(inscreversButton);

      expect(mockPush).toHaveBeenCalledWith('/curso/fundamentos-da-fe/inscricao');
    });
  });
});
