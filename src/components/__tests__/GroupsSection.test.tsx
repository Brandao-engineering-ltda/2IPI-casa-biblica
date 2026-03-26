import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { GroupsSection, groups, GroupCard, GroupDetailDialog } from "../GroupsSection";
import type { Group } from "../GroupsSection";

/* ------------------------------------------------------------------ */
/*  Mocks                                                              */
/* ------------------------------------------------------------------ */

// Mock IntersectionObserver for useInView / useStaggeredReveal
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();
let intersectionCallback: IntersectionObserverCallback;

beforeAll(() => {
  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    value: jest.fn((cb: IntersectionObserverCallback) => {
      intersectionCallback = cb;
      return {
        observe: mockObserve,
        unobserve: mockUnobserve,
        disconnect: mockDisconnect,
      };
    }),
  });
});

beforeEach(() => {
  jest.useFakeTimers();
  mockObserve.mockClear();
  mockUnobserve.mockClear();
  mockDisconnect.mockClear();
  document.body.style.overflow = "";
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

// Helper: trigger intersection so cards become visible
function triggerIntersection() {
  act(() => {
    intersectionCallback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver
    );
  });
}

// Helper: advance staggered timers so all cards are revealed
function revealAllCards(count: number) {
  for (let i = 0; i < count + 2; i++) {
    act(() => {
      jest.advanceTimersByTime(100);
    });
  }
}

/* ------------------------------------------------------------------ */
/*  Sample data for isolated component tests                           */
/* ------------------------------------------------------------------ */

const sampleGroup: Group = groups[0]; // Comunicação, Sexo & Dinheiro

/* ------------------------------------------------------------------ */
/*  describe: Data integrity                                           */
/* ------------------------------------------------------------------ */

describe("GroupsSection data", () => {
  it("contains 9 groups total", () => {
    expect(groups).toHaveLength(9);
  });

  it("every group has required detail fields", () => {
    groups.forEach((g) => {
      expect(g.detail).toBeDefined();
      expect(g.detail.cost).toBeTruthy();
      expect(g.detail.material).toBeTruthy();
      expect(g.detail.duration).toBeTruthy();
      expect(g.detail.headline).toBeTruthy();
      expect(g.detail.body.length).toBeGreaterThan(0);
      expect(g.detail.learningPoints.length).toBeGreaterThan(0);
      expect(g.detail.targetAudience).toBeTruthy();
      expect(g.detail.detailUrl).toMatch(/app\.ipimaringa\.com\.br/);
    });
  });

  it("has groups in all three categories", () => {
    const categories = new Set(groups.map((g) => g.category));
    expect(categories).toContain("hombridade");
    expect(categories).toContain("casais");
    expect(categories).toContain("familia");
  });

  it("each group has a unique id", () => {
    const ids = groups.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each group has a valid image URL", () => {
    groups.forEach((g) => {
      expect(g.image).toMatch(/^https:\/\//);
    });
  });
});

/* ------------------------------------------------------------------ */
/*  describe: Section rendering                                        */
/* ------------------------------------------------------------------ */

describe("GroupsSection rendering", () => {
  it("renders the section heading", () => {
    render(<GroupsSection />);
    expect(screen.getByText("2ª IPI de Maringá")).toBeInTheDocument();
  });

  it("renders the subtitle", () => {
    render(<GroupsSection />);
    expect(
      screen.getByText("Encontre um grupo para crescer, aprender e caminhar junto.")
    ).toBeInTheDocument();
  });

  it("renders the Somos Casa logo", () => {
    render(<GroupsSection />);
    expect(screen.getByAltText("Somos Casa")).toBeInTheDocument();
  });

  it("renders all filter buttons", () => {
    render(<GroupsSection />);
    expect(screen.getByTestId("filter-todos")).toBeInTheDocument();
    expect(screen.getByTestId("filter-hombridade")).toBeInTheDocument();
    expect(screen.getByTestId("filter-casais")).toBeInTheDocument();
    expect(screen.getByTestId("filter-familia")).toBeInTheDocument();
  });


  it('has id="grupos" for anchor navigation', () => {
    const { container } = render(<GroupsSection />);
    const section = container.querySelector("section#grupos");
    expect(section).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  describe: Group cards                                              */
/* ------------------------------------------------------------------ */

describe("GroupsSection cards", () => {
  it("renders all 9 group cards by default", () => {
    render(<GroupsSection />);
    triggerIntersection();
    revealAllCards(9);
    const cards = screen.getAllByTestId("group-card");
    expect(cards).toHaveLength(9);
  });

  it("renders group titles on cards", () => {
    render(<GroupsSection />);
    triggerIntersection();
    revealAllCards(9);
    expect(screen.getAllByText("Comunicação, Sexo & Dinheiro").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Integridade Sexual").length).toBeGreaterThanOrEqual(1);
  });

  it("shows 'Lista de espera' badge for waitlist groups", () => {
    render(<GroupsSection />);
    triggerIntersection();
    revealAllCards(9);
    const waitlistBadges = screen.getAllByText("Lista de espera");
    expect(waitlistBadges.length).toBeGreaterThan(0);
  });

  it("shows 'Inscrições abertas' badge for open groups", () => {
    render(<GroupsSection />);
    triggerIntersection();
    revealAllCards(9);
    const openBadges = screen.getAllByText("Inscrições abertas");
    expect(openBadges.length).toBeGreaterThan(0);
  });

  it("displays spots info when available", () => {
    render(<GroupsSection />);
    triggerIntersection();
    revealAllCards(9);
    expect(screen.getAllByText("4 vagas restantes").length).toBeGreaterThanOrEqual(1);
  });

  it("displays facilitator names", () => {
    render(<GroupsSection />);
    triggerIntersection();
    revealAllCards(9);
    expect(screen.getByText("Francisco Sales de Sousa Filho")).toBeInTheDocument();
    expect(screen.getByText("Visa Robson")).toBeInTheDocument();
  });

  it("displays start dates", () => {
    render(<GroupsSection />);
    triggerIntersection();
    revealAllCards(9);
    expect(screen.getByText("Início: 26/03/2026")).toBeInTheDocument();
  });

  it("renders a 'Ver detalhes' button on each card", () => {
    render(<GroupsSection />);
    triggerIntersection();
    revealAllCards(9);
    const buttons = screen.getAllByTestId("ver-detalhes-button");
    expect(buttons).toHaveLength(9);
  });

});

/* ------------------------------------------------------------------ */
/*  describe: Filtering                                                */
/* ------------------------------------------------------------------ */

describe("GroupsSection filtering", () => {
  it("filters to Hombridade groups only", () => {
    render(<GroupsSection />);
    triggerIntersection();

    fireEvent.click(screen.getByTestId("filter-hombridade"));
    revealAllCards(6);

    const cards = screen.getAllByTestId("group-card");
    expect(cards).toHaveLength(6); // 6 hombridade groups
  });

  it("filters to Casais groups only", () => {
    render(<GroupsSection />);
    triggerIntersection();

    fireEvent.click(screen.getByTestId("filter-casais"));
    revealAllCards(1);

    const cards = screen.getAllByTestId("group-card");
    expect(cards).toHaveLength(1); // Aliança
  });

  it("filters to Família groups only", () => {
    render(<GroupsSection />);
    triggerIntersection();

    fireEvent.click(screen.getByTestId("filter-familia"));
    revealAllCards(2);

    const cards = screen.getAllByTestId("group-card");
    expect(cards).toHaveLength(2); // Pais + Como Criar
  });

  it("shows all groups when Todos is clicked again", () => {
    render(<GroupsSection />);
    triggerIntersection();

    fireEvent.click(screen.getByTestId("filter-hombridade"));
    revealAllCards(6);

    fireEvent.click(screen.getByTestId("filter-todos"));
    revealAllCards(9);

    const cards = screen.getAllByTestId("group-card");
    expect(cards).toHaveLength(9);
  });

  it("active filter has distinct styling", () => {
    render(<GroupsSection />);
    const todosButton = screen.getByTestId("filter-todos");
    expect(todosButton.className).toContain("bg-navy");
    expect(todosButton.className).toContain("text-white");
  });
});

/* ------------------------------------------------------------------ */
/*  describe: Staggered animations                                     */
/* ------------------------------------------------------------------ */

describe("GroupsSection animations", () => {
  it("cards start hidden before intersection", () => {
    render(<GroupsSection />);
    const cards = screen.getAllByTestId("group-card");
    cards.forEach((card) => {
      expect(card.className).toContain("opacity-0");
    });
  });

  it("cards become visible after intersection and timers", () => {
    render(<GroupsSection />);
    triggerIntersection();
    revealAllCards(9);
    const cards = screen.getAllByTestId("group-card");
    cards.forEach((card) => {
      expect(card.className).toContain("opacity-100");
    });
  });

  it("section header animates in on intersection", () => {
    const { container } = render(<GroupsSection />);
    // Before intersection, header should be hidden
    const header = container.querySelector(".mx-auto.mb-4.text-center");
    expect(header?.className).toContain("opacity-0");

    triggerIntersection();
    expect(header?.className).toContain("opacity-100");
  });
});

/* ------------------------------------------------------------------ */
/*  describe: Group Detail Dialog                                      */
/* ------------------------------------------------------------------ */

describe("GroupDetailDialog", () => {
  it("renders nothing when group is null", () => {
    const { container } = render(
      <GroupDetailDialog group={null} onClose={jest.fn()} />
    );
    expect(container.querySelector("[role='dialog']")).not.toBeInTheDocument();
  });

  it("renders dialog content when group is provided", () => {
    render(
      <GroupDetailDialog group={sampleGroup} onClose={jest.fn()} />
    );
    expect(screen.getByTestId("group-detail-dialog")).toBeInTheDocument();
    expect(screen.getByText(sampleGroup.title)).toBeInTheDocument();
  });

  it("displays the group detail headline", () => {
    render(
      <GroupDetailDialog group={sampleGroup} onClose={jest.fn()} />
    );
    expect(screen.getByTestId("dialog-headline")).toHaveTextContent(
      sampleGroup.detail.headline
    );
  });

  it("displays cost, duration, and material", () => {
    render(
      <GroupDetailDialog group={sampleGroup} onClose={jest.fn()} />
    );
    expect(screen.getByText(sampleGroup.detail.cost)).toBeInTheDocument();
    expect(screen.getByText(sampleGroup.detail.duration)).toBeInTheDocument();
  });

  it("displays learning points", () => {
    render(
      <GroupDetailDialog group={sampleGroup} onClose={jest.fn()} />
    );
    sampleGroup.detail.learningPoints.forEach((point) => {
      expect(screen.getByText(point)).toBeInTheDocument();
    });
  });

  it("displays target audience section", () => {
    render(
      <GroupDetailDialog group={sampleGroup} onClose={jest.fn()} />
    );
    expect(screen.getByText("Para quem é este curso?")).toBeInTheDocument();
    expect(screen.getByText(sampleGroup.detail.targetAudience)).toBeInTheDocument();
  });

  it("displays the closing quote when present", () => {
    render(
      <GroupDetailDialog group={sampleGroup} onClose={jest.fn()} />
    );
    expect(
      screen.getByText(sampleGroup.detail.closingQuote!)
    ).toBeInTheDocument();
  });



  it("displays all group tags", () => {
    render(
      <GroupDetailDialog group={sampleGroup} onClose={jest.fn()} />
    );
    sampleGroup.tags.forEach((tag) => {
      expect(screen.getAllByText(tag).length).toBeGreaterThanOrEqual(1);
    });
  });

  it("displays body paragraphs", () => {
    render(
      <GroupDetailDialog group={sampleGroup} onClose={jest.fn()} />
    );
    sampleGroup.detail.body.forEach((p) => {
      expect(screen.getByText(p)).toBeInTheDocument();
    });
  });

  it("displays facilitator names", () => {
    render(
      <GroupDetailDialog group={sampleGroup} onClose={jest.fn()} />
    );
    expect(
      screen.getByText(sampleGroup.facilitators.join(", "))
    ).toBeInTheDocument();
  });

  it("displays the group image", () => {
    render(
      <GroupDetailDialog group={sampleGroup} onClose={jest.fn()} />
    );
    const img = screen.getByAltText(sampleGroup.title);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", sampleGroup.image);
  });
});

/* ------------------------------------------------------------------ */
/*  describe: Dialog interactions                                      */
/* ------------------------------------------------------------------ */

describe("GroupDetailDialog interactions", () => {
  it("calls onClose when close button is clicked", async () => {
    const onClose = jest.fn();
    render(<GroupDetailDialog group={sampleGroup} onClose={onClose} />);

    fireEvent.click(screen.getByTestId("dialog-close-button"));

    // Wait for animation timeout (300ms)
    act(() => {
      jest.advanceTimersByTime(350);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", () => {
    const onClose = jest.fn();
    render(<GroupDetailDialog group={sampleGroup} onClose={onClose} />);

    fireEvent.keyDown(window, { key: "Escape" });

    act(() => {
      jest.advanceTimersByTime(350);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", () => {
    const onClose = jest.fn();
    render(<GroupDetailDialog group={sampleGroup} onClose={onClose} />);

    const backdrop = screen.getByTestId("group-detail-dialog");
    fireEvent.click(backdrop);

    act(() => {
      jest.advanceTimersByTime(350);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when dialog content is clicked", () => {
    const onClose = jest.fn();
    render(<GroupDetailDialog group={sampleGroup} onClose={onClose} />);

    const headline = screen.getByTestId("dialog-headline");
    fireEvent.click(headline);

    act(() => {
      jest.advanceTimersByTime(350);
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it("sets body overflow to hidden when open", () => {
    render(<GroupDetailDialog group={sampleGroup} onClose={jest.fn()} />);
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body overflow when unmounted", () => {
    const { unmount } = render(
      <GroupDetailDialog group={sampleGroup} onClose={jest.fn()} />
    );
    unmount();
    expect(document.body.style.overflow).toBe("");
  });
});

/* ------------------------------------------------------------------ */
/*  describe: Dialog opens from card click                             */
/* ------------------------------------------------------------------ */

describe("GroupsSection dialog integration", () => {
  it("opens dialog when Ver detalhes is clicked", () => {
    render(<GroupsSection />);
    triggerIntersection();
    revealAllCards(9);

    const buttons = screen.getAllByTestId("ver-detalhes-button");
    fireEvent.click(buttons[0]);

    expect(screen.getByTestId("group-detail-dialog")).toBeInTheDocument();
  });

  it("opens correct group details", () => {
    render(<GroupsSection />);
    triggerIntersection();
    revealAllCards(9);

    const buttons = screen.getAllByTestId("ver-detalhes-button");
    fireEvent.click(buttons[0]);

    expect(
      screen.getByTestId("dialog-headline")
    ).toHaveTextContent(groups[0].detail.headline);
  });

  it("closes dialog and can reopen", () => {
    render(<GroupsSection />);
    triggerIntersection();
    revealAllCards(9);

    // Open dialog
    const buttons = screen.getAllByTestId("ver-detalhes-button");
    fireEvent.click(buttons[0]);
    expect(screen.getByTestId("group-detail-dialog")).toBeInTheDocument();

    // Close via Escape
    fireEvent.keyDown(window, { key: "Escape" });
    act(() => {
      jest.advanceTimersByTime(350);
    });

    // Dialog should be gone
    expect(screen.queryByTestId("group-detail-dialog")).not.toBeInTheDocument();

    // Can reopen
    fireEvent.click(buttons[1]);
    expect(screen.getByTestId("group-detail-dialog")).toBeInTheDocument();
  });
});


/* ------------------------------------------------------------------ */
/*  describe: GroupCard component (isolated)                           */
/* ------------------------------------------------------------------ */

describe("GroupCard", () => {
  const onOpenDetail = jest.fn();

  beforeEach(() => {
    onOpenDetail.mockClear();
  });

  it("renders group title", () => {
    render(
      <GroupCard
        group={sampleGroup}
        index={0}
        isVisible={true}
        onOpenDetail={onOpenDetail}
      />
    );
    expect(screen.getByText(sampleGroup.title)).toBeInTheDocument();
  });

  it("renders group description", () => {
    render(
      <GroupCard
        group={sampleGroup}
        index={0}
        isVisible={true}
        onOpenDetail={onOpenDetail}
      />
    );
    expect(screen.getByText(sampleGroup.description)).toBeInTheDocument();
  });

  it("renders group image", () => {
    render(
      <GroupCard
        group={sampleGroup}
        index={0}
        isVisible={true}
        onOpenDetail={onOpenDetail}
      />
    );
    expect(screen.getByAltText(sampleGroup.title)).toHaveAttribute(
      "src",
      sampleGroup.image
    );
  });

  it("renders tags", () => {
    render(
      <GroupCard
        group={sampleGroup}
        index={0}
        isVisible={true}
        onOpenDetail={onOpenDetail}
      />
    );
    sampleGroup.tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it("calls onOpenDetail when Ver detalhes is clicked", () => {
    render(
      <GroupCard
        group={sampleGroup}
        index={0}
        isVisible={true}
        onOpenDetail={onOpenDetail}
      />
    );
    fireEvent.click(screen.getByTestId("ver-detalhes-button"));
    expect(onOpenDetail).toHaveBeenCalledWith(sampleGroup);
  });

  it("has opacity-0 when not visible", () => {
    render(
      <GroupCard
        group={sampleGroup}
        index={0}
        isVisible={false}
        onOpenDetail={onOpenDetail}
      />
    );
    const card = screen.getByTestId("group-card");
    expect(card.className).toContain("opacity-0");
  });

  it("has opacity-100 when visible", () => {
    render(
      <GroupCard
        group={sampleGroup}
        index={0}
        isVisible={true}
        onOpenDetail={onOpenDetail}
      />
    );
    const card = screen.getByTestId("group-card");
    expect(card.className).toContain("opacity-100");
  });

  it("has staggered transition delay based on index", () => {
    render(
      <GroupCard
        group={sampleGroup}
        index={3}
        isVisible={true}
        onOpenDetail={onOpenDetail}
      />
    );
    const card = screen.getByTestId("group-card");
    expect(card.style.transitionDelay).toBe("180ms"); // 3 * 60
  });

  it("shows location when available", () => {
    render(
      <GroupCard
        group={sampleGroup}
        index={0}
        isVisible={true}
        onOpenDetail={onOpenDetail}
      />
    );
    expect(screen.getByText(sampleGroup.location)).toBeInTheDocument();
  });

  it("hides location when empty", () => {
    const noLocationGroup = { ...sampleGroup, location: "" };
    render(
      <GroupCard
        group={noLocationGroup}
        index={0}
        isVisible={true}
        onOpenDetail={onOpenDetail}
      />
    );
    // "Av. Mauá" should not appear
    expect(screen.queryByText(sampleGroup.location)).not.toBeInTheDocument();
  });

  it("shows waitlist indicator", () => {
    render(
      <GroupCard
        group={sampleGroup}
        index={0}
        isVisible={true}
        onOpenDetail={onOpenDetail}
      />
    );
    expect(screen.getByText("Lista de espera disponível")).toBeInTheDocument();
  });

});

/* ------------------------------------------------------------------ */
/*  describe: Accessibility                                            */
/* ------------------------------------------------------------------ */

describe("GroupsSection accessibility", () => {
  it("dialog has proper role and aria attributes", () => {
    render(
      <GroupDetailDialog group={sampleGroup} onClose={jest.fn()} />
    );
    const dialog = screen.getByTestId("group-detail-dialog");
    expect(dialog).toHaveAttribute("role", "dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute(
      "aria-label",
      `Detalhes: ${sampleGroup.title}`
    );
  });

  it("close button has aria-label", () => {
    render(
      <GroupDetailDialog group={sampleGroup} onClose={jest.fn()} />
    );
    expect(screen.getByLabelText("Fechar")).toBeInTheDocument();
  });

  it("card images have alt text", () => {
    render(<GroupsSection />);
    triggerIntersection();
    revealAllCards(9);
    groups.forEach((g) => {
      const images = screen.getAllByAltText(g.title);
      expect(images.length).toBeGreaterThanOrEqual(1);
    });
  });
});

/* ------------------------------------------------------------------ */
/*  describe: Dialog for different group types                         */
/* ------------------------------------------------------------------ */

describe("GroupDetailDialog for different groups", () => {
  it("renders Aliança course details correctly", () => {
    const alianca = groups.find((g) => g.id === "alianca-amor-incondicional")!;
    render(
      <GroupDetailDialog group={alianca} onClose={jest.fn()} />
    );
    expect(screen.getByTestId("dialog-headline")).toHaveTextContent(
      alianca.detail.headline
    );
    expect(screen.getByText(alianca.detail.cost)).toBeInTheDocument();
  });

  it("renders Pais para Toda a Vida details correctly", () => {
    const pais = groups.find((g) => g.id === "pais-para-toda-vida")!;
    render(
      <GroupDetailDialog group={pais} onClose={jest.fn()} />
    );
    expect(screen.getByText(pais.detail.cost)).toBeInTheDocument();
    expect(screen.getByText(pais.detail.duration)).toBeInTheDocument();
  });

  it("renders Como Criar Seus Filhos details correctly", () => {
    const como = groups.find((g) => g.id === "como-criar-seus-filhos")!;
    render(
      <GroupDetailDialog group={como} onClose={jest.fn()} />
    );
    expect(screen.getByTestId("dialog-headline")).toHaveTextContent(
      como.detail.headline
    );
  });

  it("renders Integridade Sexual details correctly", () => {
    const integridade = groups.find((g) => g.id === "integridade-sexual")!;
    render(
      <GroupDetailDialog group={integridade} onClose={jest.fn()} />
    );
    const spots = parseInt(integridade.detail.spotsText!);
    expect(screen.getByText(`Restam ${spots} vagas.`)).toBeInTheDocument();
  });

  it("renders Homem ao Máximo details for different locations", () => {
    const homem2 = groups.find((g) => g.id === "homem-ao-maximo-2")!;
    render(
      <GroupDetailDialog group={homem2} onClose={jest.fn()} />
    );
    expect(screen.getByText(homem2.location)).toBeInTheDocument();
    const spots = parseInt(homem2.detail.spotsText!);
    expect(screen.getByText(`Restam ${spots} vagas.`)).toBeInTheDocument();
  });
});
