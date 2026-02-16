import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter, useParams } from 'next/navigation';
import CoursePage from '../page';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

// Mock firebase (required by AuthContext)
jest.mock('@/lib/firebase', () => ({
  auth: {},
  signOut: jest.fn(),
}));

// Mock AuthContext
const mockUseAuth = jest.fn();
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
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
      mockUseAuth.mockReturnValue({
        user: { uid: '123', displayName: 'João Silva' },
        userProfile: null,
        loading: false,
        refreshProfile: jest.fn(),
      });

      render(<CoursePage />);

      const voltarButton = screen.getByRole('button', { name: /← voltar/i });
      fireEvent.click(voltarButton);

      expect(mockPush).toHaveBeenCalledWith('/dashboard');
      expect(mockBack).not.toHaveBeenCalled();
    });

    it('should go back in history when user is not logged in', () => {
      // Mock user is not logged in
      mockUseAuth.mockReturnValue({
        user: null,
        userProfile: null,
        loading: false,
        refreshProfile: jest.fn(),
      });

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
      mockUseAuth.mockReturnValue({
        user: { uid: '123', displayName: 'João Silva' },
        userProfile: null,
        loading: false,
        refreshProfile: jest.fn(),
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
      mockUseAuth.mockReturnValue({
        user: null,
        userProfile: null,
        loading: false,
        refreshProfile: jest.fn(),
      });

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
      mockUseAuth.mockReturnValue({
        user: { uid: '123', displayName: 'João Silva' },
        userProfile: null,
        loading: false,
        refreshProfile: jest.fn(),
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
      mockUseAuth.mockReturnValue({
        user: null,
        userProfile: null,
        loading: false,
        refreshProfile: jest.fn(),
      });

      render(<CoursePage />);

      const voltarButton = screen.getByRole('button', { name: /← voltar/i });
      fireEvent.click(voltarButton);

      // Should use browser back
      expect(mockBack).toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should use dashboard navigation for logged-in users', () => {
      mockUseAuth.mockReturnValue({
        user: { uid: '123', displayName: 'João Silva' },
        userProfile: null,
        loading: false,
        refreshProfile: jest.fn(),
      });

      render(<CoursePage />);

      const voltarButton = screen.getByRole('button', { name: /← voltar/i });
      fireEvent.click(voltarButton);

      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('Inscrever-se Button', () => {
    it('should redirect to payment page', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        userProfile: null,
        loading: false,
        refreshProfile: jest.fn(),
      });

      render(<CoursePage />);

      const inscreversButton = screen.getByRole('button', { name: /inscrever-se agora/i });
      fireEvent.click(inscreversButton);

      expect(mockPush).toHaveBeenCalledWith('/curso/fundamentos-da-fe/inscricao');
    });
  });
});
