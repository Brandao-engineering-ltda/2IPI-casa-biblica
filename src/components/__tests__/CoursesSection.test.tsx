import { render, screen, fireEvent } from '@testing-library/react';
import { CoursesSection } from '../CoursesSection';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

describe('CoursesSection Component', () => {
  describe('Section Rendering', () => {
    it('renders the section heading "Nossos Cursos"', () => {
      render(<CoursesSection />);
      expect(screen.getByText('Nossos Cursos')).toBeInTheDocument();
    });

    it('renders the subtitle text', () => {
      render(<CoursesSection />);
      expect(
        screen.getByText('Trilhas de formação bíblica para cada etapa da sua caminhada')
      ).toBeInTheDocument();
    });

    it('has correct section id for anchor linking', () => {
      const { container } = render(<CoursesSection />);
      const section = container.querySelector('section');
      expect(section).toHaveAttribute('id', 'courses');
    });

    it('has correct background styling', () => {
      const { container } = render(<CoursesSection />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('bg-cream');
    });
  });

  describe('Course Cards', () => {
    it('renders all course titles', () => {
      render(<CoursesSection />);

      // Featured course title appears once; regular course titles appear twice
      // (once in hover overlay, once in default content)
      expect(screen.getByText('Panorama Bíblico')).toBeInTheDocument();
      expect(screen.getAllByText('Fundamentos da Fé').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Hermenêutica Bíblica').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Antigo Testamento').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Novo Testamento').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Liderança Cristã').length).toBeGreaterThanOrEqual(1);
    });

    it('renders course descriptions', () => {
      render(<CoursesSection />);

      // Featured course description appears once; regular card descriptions appear twice
      // (hover overlay + default content)
      expect(
        screen.getByText(/Uma visão geral de toda a Bíblia, do Gênesis ao Apocalipse/)
      ).toBeInTheDocument();
      expect(
        screen.getAllByText(/Estudo das doutrinas essenciais da fé cristã reformada/).length
      ).toBeGreaterThanOrEqual(1);
    });

    it('renders the featured course (first course) as a distinct card', () => {
      const { container } = render(<CoursesSection />);

      // The featured course spans the full grid width (col-span-full)
      const featuredCard = container.querySelector('article.col-span-full');
      expect(featuredCard).toBeInTheDocument();
    });

    it('renders "Ver Detalhes" buttons on course cards', () => {
      render(<CoursesSection />);

      const verDetalhesButtons = screen.getAllByText('Ver Detalhes');
      // Featured course has one "Ver Detalhes" + each regular card has one in hover overlay
      expect(verDetalhesButtons.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Course Details (Levels, Duration, Dates)', () => {
    it('renders status badges', () => {
      render(<CoursesSection />);

      expect(screen.getByText('Em Andamento')).toBeInTheDocument();

      const proximoBadges = screen.getAllByText('Próximo');
      expect(proximoBadges.length).toBeGreaterThanOrEqual(1);

      const emBreveBadges = screen.getAllByText('Em Breve');
      expect(emBreveBadges.length).toBeGreaterThanOrEqual(1);
    });

    it('renders level badges', () => {
      render(<CoursesSection />);

      const inicianteBadges = screen.getAllByText('Iniciante');
      expect(inicianteBadges.length).toBeGreaterThanOrEqual(1);

      const intermediarioBadges = screen.getAllByText('Intermediário');
      expect(intermediarioBadges.length).toBeGreaterThanOrEqual(1);

      const avancadoBadges = screen.getAllByText('Avançado');
      expect(avancadoBadges.length).toBeGreaterThanOrEqual(1);
    });

    it('renders course durations', () => {
      render(<CoursesSection />);

      const duracoes12 = screen.getAllByText('12 semanas');
      expect(duracoes12.length).toBeGreaterThanOrEqual(1);

      const duracoes8 = screen.getAllByText('8 semanas');
      expect(duracoes8.length).toBeGreaterThanOrEqual(1);

      const duracoes10 = screen.getAllByText('10 semanas');
      expect(duracoes10.length).toBeGreaterThanOrEqual(1);

      const duracoes16 = screen.getAllByText('16 semanas');
      expect(duracoes16.length).toBeGreaterThanOrEqual(1);
    });

    it('renders course date ranges on cards', () => {
      render(<CoursesSection />);

      // The featured card shows dates as "dataInicio — dataFim"
      expect(screen.getByText(/10 Fev 2026 — 4 Mai 2026/)).toBeInTheDocument();
    });
  });

  describe('Course Images', () => {
    it('renders course images with correct alt text', () => {
      render(<CoursesSection />);

      // Each course renders images (cards have images in their structure)
      const panoramaImages = screen.getAllByAltText('Panorama Bíblico');
      expect(panoramaImages.length).toBeGreaterThanOrEqual(1);

      const fundamentosImages = screen.getAllByAltText('Fundamentos da Fé');
      expect(fundamentosImages.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Course Dialog', () => {
    it('opens the dialog when a course card is clicked', () => {
      render(<CoursesSection />);

      // Click the featured course (Panorama Bíblico)
      const featuredArticle = screen.getByText('Panorama Bíblico').closest('article');
      fireEvent.click(featuredArticle!);

      // The dialog should show "Inscreva-se Agora"
      expect(screen.getByText('Inscreva-se Agora')).toBeInTheDocument();
    });

    it('shows "Instituto Casa Bíblica" text in dialog', () => {
      render(<CoursesSection />);

      const featuredArticle = screen.getByText('Panorama Bíblico').closest('article');
      fireEvent.click(featuredArticle!);

      expect(screen.getByText('Instituto Casa Bíblica')).toBeInTheDocument();
    });

    it('shows course title in dialog', () => {
      render(<CoursesSection />);

      // Click on a regular course card — "Fundamentos da Fé"
      // The title appears twice in the card (hover overlay + default content),
      // so use getAllByText and find the article from the first one
      const fundamentosTitles = screen.getAllByText('Fundamentos da Fé');
      const courseArticle = fundamentosTitles[0].closest('article');
      fireEvent.click(courseArticle!);

      // Dialog adds another instance of the title (card has 2 + dialog has 1 = 3)
      const allTitles = screen.getAllByText('Fundamentos da Fé');
      expect(allTitles.length).toBeGreaterThanOrEqual(3);
    });

    it('shows course description in dialog', () => {
      render(<CoursesSection />);

      const featuredArticle = screen.getByText('Panorama Bíblico').closest('article');
      fireEvent.click(featuredArticle!);

      // The dialog shows the course description
      const descriptions = screen.getAllByText(
        /Uma visão geral de toda a Bíblia, do Gênesis ao Apocalipse/
      );
      expect(descriptions.length).toBeGreaterThanOrEqual(2);
    });

    it('shows status and level badges in dialog', () => {
      render(<CoursesSection />);

      const featuredArticle = screen.getByText('Panorama Bíblico').closest('article');
      fireEvent.click(featuredArticle!);

      // Dialog should show the status and level badges
      const emAndamentoBadges = screen.getAllByText('Em Andamento');
      expect(emAndamentoBadges.length).toBeGreaterThanOrEqual(2);

      const inicianteBadges = screen.getAllByText('Iniciante');
      expect(inicianteBadges.length).toBeGreaterThanOrEqual(2);
    });

    it('shows start and end dates in dialog', () => {
      render(<CoursesSection />);

      const featuredArticle = screen.getByText('Panorama Bíblico').closest('article');
      fireEvent.click(featuredArticle!);

      expect(screen.getByText(/Início: 10 Fev 2026/)).toBeInTheDocument();
      expect(screen.getByText(/Término: 4 Mai 2026/)).toBeInTheDocument();
    });

    it('shows duration in dialog', () => {
      render(<CoursesSection />);

      const featuredArticle = screen.getByText('Panorama Bíblico').closest('article');
      fireEvent.click(featuredArticle!);

      // Dialog also shows duration
      const duracoes = screen.getAllByText('12 semanas');
      expect(duracoes.length).toBeGreaterThanOrEqual(2);
    });

    it('"Inscreva-se Agora" links to /login', () => {
      render(<CoursesSection />);

      const featuredArticle = screen.getByText('Panorama Bíblico').closest('article');
      fireEvent.click(featuredArticle!);

      const inscrevaLink = screen.getByText('Inscreva-se Agora').closest('a');
      expect(inscrevaLink).toHaveAttribute('href', '/login');
    });

    it('closes the dialog when the close button is clicked', () => {
      render(<CoursesSection />);

      const featuredArticle = screen.getByText('Panorama Bíblico').closest('article');
      fireEvent.click(featuredArticle!);

      // Dialog is open
      expect(screen.getByText('Inscreva-se Agora')).toBeInTheDocument();

      // Click the close button (aria-label="Fechar")
      const closeButton = screen.getByLabelText('Fechar');
      fireEvent.click(closeButton);

      // Dialog should be closed
      expect(screen.queryByText('Inscreva-se Agora')).not.toBeInTheDocument();
    });

    it('closes the dialog when the backdrop is clicked', () => {
      render(<CoursesSection />);

      const featuredArticle = screen.getByText('Panorama Bíblico').closest('article');
      fireEvent.click(featuredArticle!);

      expect(screen.getByText('Inscreva-se Agora')).toBeInTheDocument();

      // Click the backdrop overlay (the outermost fixed div)
      const backdrop = screen.getByText('Inscreva-se Agora').closest('.fixed');
      fireEvent.click(backdrop!);

      expect(screen.queryByText('Inscreva-se Agora')).not.toBeInTheDocument();
    });

    it('closes the dialog when Escape key is pressed', () => {
      render(<CoursesSection />);

      const featuredArticle = screen.getByText('Panorama Bíblico').closest('article');
      fireEvent.click(featuredArticle!);

      expect(screen.getByText('Inscreva-se Agora')).toBeInTheDocument();

      // Press Escape
      fireEvent.keyDown(document, { key: 'Escape' });

      expect(screen.queryByText('Inscreva-se Agora')).not.toBeInTheDocument();
    });

    it('renders the logo image in dialog', () => {
      render(<CoursesSection />);

      const featuredArticle = screen.getByText('Panorama Bíblico').closest('article');
      fireEvent.click(featuredArticle!);

      expect(screen.getByAltText('Logo 2ª IPI de Maringá')).toBeInTheDocument();
    });
  });
});
