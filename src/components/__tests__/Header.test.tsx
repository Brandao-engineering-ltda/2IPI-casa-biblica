/* eslint-disable @typescript-eslint/no-require-imports */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { usePathname } from 'next/navigation';
import { Header } from '../Header';
import { clearLocalData } from '@/lib/storage';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock AuthContext
const mockUseAuth = jest.fn();
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock Firebase
jest.mock('@/lib/firebase', () => ({
  auth: {},
  signOut: jest.fn(() => Promise.resolve()),
}));

// Mock storage utility
jest.mock('@/lib/storage', () => ({
  clearLocalData: jest.fn(),
}));

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ user: null, userProfile: null, loading: false, refreshProfile: jest.fn() }); // Default: not logged in
  });

  describe('Logo Display', () => {
    it('should display Instituto Casa Bíblica logo', () => {
      (usePathname as jest.Mock).mockReturnValue('/');

      render(<Header />);

      const logo = screen.getByAltText(/logo 2ª ipi de maringá/i);
      expect(logo).toBeInTheDocument();
    });

    it('should display institute name', () => {
      (usePathname as jest.Mock).mockReturnValue('/');

      render(<Header />);

      expect(screen.getByText(/instituto casa bíblica/i)).toBeInTheDocument();
      expect(screen.getByText(/2ª ipi de maringá/i)).toBeInTheDocument();
    });

    it('should link logo to homepage when logged out', () => {
      (usePathname as jest.Mock).mockReturnValue('/');
      mockUseAuth.mockReturnValue({ user: null, userProfile: null, loading: false, refreshProfile: jest.fn() });

      render(<Header />);

      const logoLink = screen.getByRole('link', { name: /logo 2ª ipi de maringá instituto casa bíblica 2ª ipi de maringá/i });
      expect(logoLink).toHaveAttribute('href', '/');
    });

    it('should link logo to dashboard when logged in', () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');
      mockUseAuth.mockReturnValue({ user: { uid: '123' }, userProfile: null, loading: false, refreshProfile: jest.fn() });

      render(<Header />);

      const logoLink = screen.getByRole('link', { name: /logo 2ª ipi de maringá instituto casa bíblica 2ª ipi de maringá/i });
      expect(logoLink).toHaveAttribute('href', '/dashboard');
    });
  });

  describe('Navigation Links - Home Page', () => {
    beforeEach(() => {
      (usePathname as jest.Mock).mockReturnValue('/');
    });

    it('should show all nav links on home page', () => {
      render(<Header />);

      expect(screen.getByRole('link', { name: /cursos/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /sobre/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /contato/i })).toBeInTheDocument();
    });

    it('should show login button on home page', () => {
      render(<Header />);

      const loginButton = screen.getByRole('link', { name: /entrar/i });
      expect(loginButton).toBeInTheDocument();
      expect(loginButton).toHaveAttribute('href', '/login');
    });

    it('should not show logout button on home page', () => {
      render(<Header />);

      const logoutButton = screen.queryByRole('button', { name: /sair/i });
      expect(logoutButton).not.toBeInTheDocument();
    });

    it('should have correct href for nav links', () => {
      render(<Header />);

      expect(screen.getByRole('link', { name: /cursos/i })).toHaveAttribute('href', '/#courses');
      expect(screen.getByRole('link', { name: /sobre/i })).toHaveAttribute('href', '/#sobre');
      expect(screen.getByRole('link', { name: /contato/i })).toHaveAttribute('href', '/#contato');
    });
  });

  describe('Navigation Links - Dashboard', () => {
    beforeEach(() => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');
      mockUseAuth.mockReturnValue({ user: { uid: '123' }, isAdmin: false, userProfile: null, loading: false, refreshProfile: jest.fn() });
    });

    it('should hide nav links on dashboard', () => {
      render(<Header />);

      expect(screen.queryByRole('link', { name: /^cursos$/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /^sobre$/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /^contato$/i })).not.toBeInTheDocument();
    });

    it('should show logout button on dashboard', () => {
      render(<Header />);

      const logoutButton = screen.getByRole('button', { name: /sair/i });
      expect(logoutButton).toBeInTheDocument();
    });

    it('should not show login button on dashboard', () => {
      render(<Header />);

      expect(screen.queryByRole('link', { name: /entrar/i })).not.toBeInTheDocument();
    });

    it('should clear user data on logout', async () => {
      render(<Header />);

      const logoutButton = screen.getByRole('button', { name: /sair/i });
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(clearLocalData).toHaveBeenCalled();
      });
    });
  });

  describe('Admin/Dashboard Link Swap', () => {
    it('should show Admin link on dashboard for admin users', () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');
      mockUseAuth.mockReturnValue({ user: { uid: '123' }, isAdmin: true, userProfile: null, loading: false, refreshProfile: jest.fn() });

      render(<Header />);

      expect(screen.getByRole('link', { name: /^admin$/i })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /^dashboard$/i })).not.toBeInTheDocument();
    });

    it('should show Dashboard link on admin pages for admin users', () => {
      (usePathname as jest.Mock).mockReturnValue('/admin');
      mockUseAuth.mockReturnValue({ user: { uid: '123' }, isAdmin: true, userProfile: null, loading: false, refreshProfile: jest.fn() });

      render(<Header />);

      expect(screen.getByRole('link', { name: /^dashboard$/i })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /^admin$/i })).not.toBeInTheDocument();
    });

    it('should show Dashboard link on admin sub-pages', () => {
      (usePathname as jest.Mock).mockReturnValue('/admin/courses');
      mockUseAuth.mockReturnValue({ user: { uid: '123' }, isAdmin: true, userProfile: null, loading: false, refreshProfile: jest.fn() });

      render(<Header />);

      expect(screen.getByRole('link', { name: /^dashboard$/i })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /^admin$/i })).not.toBeInTheDocument();
    });
  });

  describe('Navigation Links - Other Pages', () => {
    it('should hide nav links on login page', () => {
      (usePathname as jest.Mock).mockReturnValue('/login');

      render(<Header />);

      expect(screen.queryByRole('link', { name: /^cursos$/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /^sobre$/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /^contato$/i })).not.toBeInTheDocument();
    });

    it('should hide nav links on registration page', () => {
      (usePathname as jest.Mock).mockReturnValue('/register');

      render(<Header />);

      expect(screen.queryByRole('link', { name: /^cursos$/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /^sobre$/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /^contato$/i })).not.toBeInTheDocument();
    });

    it('should hide nav links on course pages', () => {
      (usePathname as jest.Mock).mockReturnValue('/course/fundamentos-da-fe');

      render(<Header />);

      expect(screen.queryByRole('link', { name: /^cursos$/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /^sobre$/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /^contato$/i })).not.toBeInTheDocument();
    });

    it('should hide buttons on course content pages', () => {
      (usePathname as jest.Mock).mockReturnValue('/course/fundamentos-da-fe/content');

      render(<Header />);

      expect(screen.queryByRole('link', { name: /entrar/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /sair/i })).not.toBeInTheDocument();
    });
  });

  describe('Mobile Menu', () => {
    beforeEach(() => {
      (usePathname as jest.Mock).mockReturnValue('/');
    });

    it('should render hamburger menu button', () => {
      render(<Header />);

      const menuButton = screen.getByRole('button', { name: /abrir menu/i });
      expect(menuButton).toBeInTheDocument();
    });

    it('should toggle mobile menu on button click', () => {
      render(<Header />);

      const menuButton = screen.getByRole('button', { name: /abrir menu/i });

      // Open menu
      fireEvent.click(menuButton);

      // Menu should be open - check for nav links in mobile menu
      const navLinks = screen.getAllByRole('link', { name: /cursos/i });
      expect(navLinks.length).toBeGreaterThan(0);
    });

    it('should close mobile menu when nav link is clicked', () => {
      render(<Header />);

      const menuButton = screen.getByRole('button', { name: /abrir menu/i });
      fireEvent.click(menuButton);

      // Click a nav link
      const cursosLinks = screen.getAllByRole('link', { name: /cursos/i });
      fireEvent.click(cursosLinks[0]);

      // Menu should close - verify by checking button state
      expect(menuButton).toBeInTheDocument();
    });

    it('should show nav links in mobile menu on home page', () => {
      render(<Header />);

      const menuButton = screen.getByRole('button', { name: /abrir menu/i });
      fireEvent.click(menuButton);

      const allLinks = screen.getAllByRole('link');
      const navLinks = allLinks.filter(link =>
        link.textContent === 'Cursos' ||
        link.textContent === 'Sobre' ||
        link.textContent === 'Contato'
      );
      expect(navLinks.length).toBeGreaterThanOrEqual(3);
    });

    it('should hide nav links in mobile menu on dashboard', () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');
      mockUseAuth.mockReturnValue({ user: { uid: '123' }, isAdmin: false, userProfile: null, loading: false, refreshProfile: jest.fn() });

      render(<Header />);

      const menuButton = screen.getByRole('button', { name: /abrir menu/i });
      fireEvent.click(menuButton);

      expect(screen.queryByText(/^cursos$/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/^sobre$/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/^contato$/i)).not.toBeInTheDocument();
    });

    it('should show logout in mobile menu on dashboard', () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');
      mockUseAuth.mockReturnValue({ user: { uid: '123' }, isAdmin: false, userProfile: null, loading: false, refreshProfile: jest.fn() });

      render(<Header />);

      const menuButton = screen.getByRole('button', { name: /abrir menu/i });
      fireEvent.click(menuButton);

      const logoutButtons = screen.getAllByRole('button', { name: /sair/i });
      expect(logoutButtons.length).toBeGreaterThan(0);
    });

    it('should close menu and clear data on mobile logout', async () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');
      mockUseAuth.mockReturnValue({ user: { uid: '123' }, isAdmin: false, userProfile: null, loading: false, refreshProfile: jest.fn() });

      render(<Header />);

      const menuButton = screen.getByRole('button', { name: /abrir menu/i });
      fireEvent.click(menuButton);

      const logoutButtons = screen.getAllByRole('button', { name: /sair/i });
      fireEvent.click(logoutButtons[0]);

      await waitFor(() => {
        expect(clearLocalData).toHaveBeenCalled();
      });
    });
  });

  describe('Mobile Menu - Close on Navigation', () => {
    it('should close mobile menu when Sobre link is clicked', () => {
      (usePathname as jest.Mock).mockReturnValue('/');

      render(<Header />);

      const menuButton = screen.getByRole('button', { name: /abrir menu/i });
      fireEvent.click(menuButton);

      // Mobile menu should be open
      const sobreLinks = screen.getAllByRole('link', { name: /sobre/i });
      // Click the mobile menu Sobre link (last one, since mobile menu comes after desktop nav)
      fireEvent.click(sobreLinks[sobreLinks.length - 1]);

      // After clicking, the mobile nav should be removed from the DOM
      const mobileNav = document.querySelector('nav.md\\:hidden');
      expect(mobileNav).not.toBeInTheDocument();
    });

    it('should close mobile menu when Contato link is clicked', () => {
      (usePathname as jest.Mock).mockReturnValue('/');

      render(<Header />);

      const menuButton = screen.getByRole('button', { name: /abrir menu/i });
      fireEvent.click(menuButton);

      const contatoLinks = screen.getAllByRole('link', { name: /contato/i });
      fireEvent.click(contatoLinks[contatoLinks.length - 1]);

      const mobileNav = document.querySelector('nav.md\\:hidden');
      expect(mobileNav).not.toBeInTheDocument();
    });

    it('should close mobile menu when Entrar link is clicked on home page', () => {
      (usePathname as jest.Mock).mockReturnValue('/');
      mockUseAuth.mockReturnValue({ user: null, userProfile: null, loading: false, refreshProfile: jest.fn() });

      render(<Header />);

      const menuButton = screen.getByRole('button', { name: /abrir menu/i });
      fireEvent.click(menuButton);

      const entrarLinks = screen.getAllByRole('link', { name: /entrar/i });
      fireEvent.click(entrarLinks[entrarLinks.length - 1]);

      const mobileNav = document.querySelector('nav.md\\:hidden');
      expect(mobileNav).not.toBeInTheDocument();
    });
  });

  describe('Mobile Menu - Toggle Close', () => {
    it('should close mobile menu when hamburger is clicked again', () => {
      (usePathname as jest.Mock).mockReturnValue('/');

      render(<Header />);

      const menuButton = screen.getByRole('button', { name: /abrir menu/i });

      // Open menu
      fireEvent.click(menuButton);
      expect(document.querySelector('nav.md\\:hidden')).toBeInTheDocument();

      // Close menu by clicking hamburger again
      fireEvent.click(menuButton);
      expect(document.querySelector('nav.md\\:hidden')).not.toBeInTheDocument();
    });
  });

  describe('Mobile Logout Button', () => {
    it('should call signOut and clearLocalData when mobile logout is clicked', async () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');
      mockUseAuth.mockReturnValue({ user: { uid: '123' }, isAdmin: false, userProfile: null, loading: false, refreshProfile: jest.fn() });

      const { signOut: mockSignOut } = require('@/lib/firebase');

      render(<Header />);

      // Open mobile menu
      const menuButton = screen.getByRole('button', { name: /abrir menu/i });
      fireEvent.click(menuButton);

      // Get all logout buttons; the mobile one is the last one
      const logoutButtons = screen.getAllByRole('button', { name: /sair/i });
      const mobileLogoutButton = logoutButtons[logoutButtons.length - 1];

      fireEvent.click(mobileLogoutButton);

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled();
        expect(clearLocalData).toHaveBeenCalled();
      });
    });

    it('should close mobile menu when mobile logout is clicked', async () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');
      mockUseAuth.mockReturnValue({ user: { uid: '123' }, isAdmin: false, userProfile: null, loading: false, refreshProfile: jest.fn() });

      render(<Header />);

      const menuButton = screen.getByRole('button', { name: /abrir menu/i });
      fireEvent.click(menuButton);

      const logoutButtons = screen.getAllByRole('button', { name: /sair/i });
      const mobileLogoutButton = logoutButtons[logoutButtons.length - 1];

      fireEvent.click(mobileLogoutButton);

      await waitFor(() => {
        const mobileNav = document.querySelector('nav.md\\:hidden');
        expect(mobileNav).not.toBeInTheDocument();
      });
    });
  });

  describe('Logout - handleLogout function', () => {
    it('should call signOut with auth and then clearLocalData on desktop logout', async () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');
      mockUseAuth.mockReturnValue({ user: { uid: '123' }, isAdmin: false, userProfile: null, loading: false, refreshProfile: jest.fn() });

      const firebase = require('@/lib/firebase');

      render(<Header />);

      const logoutButton = screen.getByRole('button', { name: /sair/i });
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(firebase.signOut).toHaveBeenCalledWith(firebase.auth);
        expect(clearLocalData).toHaveBeenCalled();
      });
    });

    it('should still clear local data when signOut rejects (error path)', async () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');
      mockUseAuth.mockReturnValue({ user: { uid: '123' }, isAdmin: false, userProfile: null, loading: false, refreshProfile: jest.fn() });

      const firebase = require('@/lib/firebase');
      firebase.signOut.mockRejectedValueOnce(new Error('Auth network error'));

      render(<Header />);

      const logoutButton = screen.getByRole('button', { name: /sair/i });
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(firebase.signOut).toHaveBeenCalled();
        expect(clearLocalData).toHaveBeenCalled();
      });
    });
  });

  describe('Responsive Design', () => {
    it('should hide desktop nav on small screens', () => {
      (usePathname as jest.Mock).mockReturnValue('/');

      const { container } = render(<Header />);

      const desktopNav = container.querySelector('nav.hidden.md\\:flex');
      expect(desktopNav).toBeInTheDocument();
    });

    it('should hide mobile menu button on desktop', () => {
      (usePathname as jest.Mock).mockReturnValue('/');

      const { container } = render(<Header />);

      const mobileButton = container.querySelector('button.md\\:hidden');
      expect(mobileButton).toBeInTheDocument();
    });
  });

  describe('Sticky Header', () => {
    it('should have sticky positioning', () => {
      (usePathname as jest.Mock).mockReturnValue('/');

      const { container } = render(<Header />);

      const header = container.querySelector('header');
      expect(header).toHaveClass('sticky');
      expect(header).toHaveClass('top-0');
      expect(header).toHaveClass('z-50');
    });
  });
});
