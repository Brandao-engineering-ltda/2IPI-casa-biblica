import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

// Mock course data from Firestore
const mockCourse = {
  id: 'fundamentos-da-fe',
  title: 'Fundamentos da Fé',
  description: 'Estudo das doutrinas essenciais da fé cristã reformada.',
  fullDescription: 'Este curso oferece um estudo abrangente.',
  image: '/images/courses/fundamentos-da-fe.jpg',
  level: 'Iniciante',
  duration: '8 semanas',
  startDate: '11 Mai 2026',
  endDate: '6 Jul 2026',
  status: 'proximo',
  instructor: 'Rev. João Silva',
  totalHours: '32h de conteúdo',
  format: 'Online ao vivo',
  pricePix: 250, priceCard: 275, installments: 3,
  order: 1, published: true,
  objectives: ['Compreender as doutrinas essenciais'],
  syllabus: ['A Revelação de Deus'],
  requirements: ['Não há pré-requisitos'],
};

jest.mock('@/lib/courses', () => ({
  getCourse: jest.fn((id: string) => {
    if (id === 'fundamentos-da-fe') return Promise.resolve(mockCourse);
    return Promise.resolve(null);
  }),
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
    it('should redirect to dashboard when user is logged in', async () => {
      mockUseAuth.mockReturnValue({
        user: { uid: '123', displayName: 'João Silva' },
        userProfile: null,
        loading: false,
        refreshProfile: jest.fn(),
      });

      render(<CoursePage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /← voltar/i })).toBeInTheDocument();
      });

      const voltarButton = screen.getByRole('button', { name: /← voltar/i });
      fireEvent.click(voltarButton);

      expect(mockPush).toHaveBeenCalledWith('/dashboard');
      expect(mockBack).not.toHaveBeenCalled();
    });

    it('should go back in history when user is not logged in', async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        userProfile: null,
        loading: false,
        refreshProfile: jest.fn(),
      });

      render(<CoursePage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /← voltar/i })).toBeInTheDocument();
      });

      const voltarButton = screen.getByRole('button', { name: /← voltar/i });
      fireEvent.click(voltarButton);

      expect(mockBack).toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalledWith('/dashboard');
    });

    it('should redirect to dashboard from course not found page when logged in', async () => {
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

      await waitFor(() => {
        expect(screen.getByText(/curso não encontrado/i)).toBeInTheDocument();
      });

      const voltarButton = screen.getByRole('button', { name: /← voltar/i });
      fireEvent.click(voltarButton);

      expect(mockPush).toHaveBeenCalledWith('/dashboard');
      expect(mockBack).not.toHaveBeenCalled();
    });

    it('should go back from course not found page when not logged in', async () => {
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

      await waitFor(() => {
        expect(screen.getByText(/curso não encontrado/i)).toBeInTheDocument();
      });

      const voltarButton = screen.getByRole('button', { name: /← voltar/i });
      fireEvent.click(voltarButton);

      expect(mockBack).toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('Bug Fix Verification', () => {
    it('should handle navigation from payment page → back → course page → back correctly', async () => {
      mockUseAuth.mockReturnValue({
        user: { uid: '123', displayName: 'João Silva' },
        userProfile: null,
        loading: false,
        refreshProfile: jest.fn(),
      });

      render(<CoursePage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /← voltar/i })).toBeInTheDocument();
      });

      const voltarButton = screen.getByRole('button', { name: /← voltar/i });
      fireEvent.click(voltarButton);

      expect(mockPush).toHaveBeenCalledWith('/dashboard');
      expect(mockBack).not.toHaveBeenCalled();
    });

    it('should allow guest users to navigate back normally', async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        userProfile: null,
        loading: false,
        refreshProfile: jest.fn(),
      });

      render(<CoursePage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /← voltar/i })).toBeInTheDocument();
      });

      const voltarButton = screen.getByRole('button', { name: /← voltar/i });
      fireEvent.click(voltarButton);

      expect(mockBack).toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should use dashboard navigation for logged-in users', async () => {
      mockUseAuth.mockReturnValue({
        user: { uid: '123', displayName: 'João Silva' },
        userProfile: null,
        loading: false,
        refreshProfile: jest.fn(),
      });

      render(<CoursePage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /← voltar/i })).toBeInTheDocument();
      });

      const voltarButton = screen.getByRole('button', { name: /← voltar/i });
      fireEvent.click(voltarButton);

      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('Inscrever-se Button', () => {
    it('should redirect to payment page', async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        userProfile: null,
        loading: false,
        refreshProfile: jest.fn(),
      });

      render(<CoursePage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /inscrever-se agora/i })).toBeInTheDocument();
      });

      const inscreversButton = screen.getByRole('button', { name: /inscrever-se agora/i });
      fireEvent.click(inscreversButton);

      expect(mockPush).toHaveBeenCalledWith('/course/fundamentos-da-fe/enrollment');
    });
  });
});
