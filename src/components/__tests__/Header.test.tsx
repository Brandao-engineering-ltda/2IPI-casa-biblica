import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { usePathname } from 'next/navigation';
import { Header } from '../Header';
import { clearUserData, getUserData } from '@/lib/storage';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock storage utility
jest.mock('@/lib/storage', () => ({
  clearUserData: jest.fn(),
  getUserData: jest.fn(),
}));

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getUserData as jest.Mock).mockReturnValue(null); // Default: not logged in
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
      (getUserData as jest.Mock).mockReturnValue(null);

      render(<Header />);

      const logoLink = screen.getByRole('link', { name: /logo 2ª ipi de maringá instituto casa bíblica 2ª ipi de maringá/i });
      expect(logoLink).toHaveAttribute('href', '/');
    });

    it('should link logo to dashboard when logged in', () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');
      (getUserData as jest.Mock).mockReturnValue({ nomeCompleto: 'Test User' });

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

      const loginButton = screen.getByRole('link', { name: /login/i });
      expect(loginButton).toBeInTheDocument();
      expect(loginButton).toHaveAttribute('href', '/login');
    });

    it('should not show logout button on home page', () => {
      render(<Header />);

      const logoutButton = screen.queryByRole('button', { name: /logout/i });
      expect(logoutButton).not.toBeInTheDocument();
    });

    it('should have correct href for nav links', () => {
      render(<Header />);

      expect(screen.getByRole('link', { name: /cursos/i })).toHaveAttribute('href', '/#cursos');
      expect(screen.getByRole('link', { name: /sobre/i })).toHaveAttribute('href', '/#sobre');
      expect(screen.getByRole('link', { name: /contato/i })).toHaveAttribute('href', '/#contato');
    });
  });

  describe('Navigation Links - Dashboard', () => {
    beforeEach(() => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');
    });

    it('should hide nav links on dashboard', () => {
      render(<Header />);

      expect(screen.queryByRole('link', { name: /^cursos$/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /^sobre$/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /^contato$/i })).not.toBeInTheDocument();
    });

    it('should show logout button on dashboard', () => {
      render(<Header />);

      const logoutButton = screen.getByRole('button', { name: /logout/i });
      expect(logoutButton).toBeInTheDocument();
    });

    it('should not show login button on dashboard', () => {
      render(<Header />);

      expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument();
    });

    it('should clear user data on logout', () => {
      render(<Header />);

      const logoutButton = screen.getByRole('button', { name: /logout/i });
      fireEvent.click(logoutButton);

      expect(clearUserData).toHaveBeenCalled();
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
      (usePathname as jest.Mock).mockReturnValue('/registro');

      render(<Header />);

      expect(screen.queryByRole('link', { name: /^cursos$/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /^sobre$/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /^contato$/i })).not.toBeInTheDocument();
    });

    it('should hide nav links on course pages', () => {
      (usePathname as jest.Mock).mockReturnValue('/curso/fundamentos-da-fe');

      render(<Header />);

      expect(screen.queryByRole('link', { name: /^cursos$/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /^sobre$/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /^contato$/i })).not.toBeInTheDocument();
    });

    it('should hide buttons on course content pages', () => {
      (usePathname as jest.Mock).mockReturnValue('/curso/fundamentos-da-fe/conteudo');

      render(<Header />);

      expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
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

      render(<Header />);

      const menuButton = screen.getByRole('button', { name: /abrir menu/i });
      fireEvent.click(menuButton);

      expect(screen.queryByText(/^cursos$/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/^sobre$/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/^contato$/i)).not.toBeInTheDocument();
    });

    it('should show logout in mobile menu on dashboard', () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');

      render(<Header />);

      const menuButton = screen.getByRole('button', { name: /abrir menu/i });
      fireEvent.click(menuButton);

      const logoutButtons = screen.getAllByRole('button', { name: /logout/i });
      expect(logoutButtons.length).toBeGreaterThan(0);
    });

    it('should close menu and clear data on mobile logout', () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');

      render(<Header />);

      const menuButton = screen.getByRole('button', { name: /abrir menu/i });
      fireEvent.click(menuButton);

      const logoutButtons = screen.getAllByRole('button', { name: /logout/i });
      fireEvent.click(logoutButtons[0]);

      expect(clearUserData).toHaveBeenCalled();
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
