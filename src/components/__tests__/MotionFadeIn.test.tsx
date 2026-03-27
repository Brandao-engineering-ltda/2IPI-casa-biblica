import { render, screen } from "@testing-library/react";
import { MotionFadeIn } from "../MotionFadeIn";

// Mock framer-motion
jest.mock("framer-motion", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react");
  const motionProps = [
    "initial", "animate", "exit", "variants", "whileHover",
    "whileTap", "whileInView", "viewport", "custom", "transition",
  ];
  function createMotionComponent(tag: string) {
    return React.forwardRef(function MotionComponent(
      props: Record<string, unknown>,
      ref: React.Ref<unknown>,
    ) {
      const filtered = Object.fromEntries(
        Object.entries(props).filter(([k]) => !motionProps.includes(k)),
      );
      return React.createElement(tag, { ...filtered, ref });
    });
  }
  return {
    motion: new Proxy(
      {},
      { get: (_t: Record<string, unknown>, prop: string) => createMotionComponent(prop) },
    ),
  };
});

describe("MotionFadeIn", () => {
  it("renders children", () => {
    render(
      <MotionFadeIn>
        <p>Hello World</p>
      </MotionFadeIn>,
    );
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <MotionFadeIn className="custom-class">
        <span>Content</span>
      </MotionFadeIn>,
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders with direction='down'", () => {
    render(
      <MotionFadeIn direction="down">
        <p>Down</p>
      </MotionFadeIn>,
    );
    expect(screen.getByText("Down")).toBeInTheDocument();
  });

  it("renders with direction='left'", () => {
    render(
      <MotionFadeIn direction="left">
        <p>Left</p>
      </MotionFadeIn>,
    );
    expect(screen.getByText("Left")).toBeInTheDocument();
  });

  it("renders with direction='right'", () => {
    render(
      <MotionFadeIn direction="right">
        <p>Right</p>
      </MotionFadeIn>,
    );
    expect(screen.getByText("Right")).toBeInTheDocument();
  });

  it("accepts custom delay, distance, scale, once, and amount props", () => {
    render(
      <MotionFadeIn delay={0.5} distance={100} scale={0.97} once={false} amount={0.3}>
        <p>Custom props</p>
      </MotionFadeIn>,
    );
    expect(screen.getByText("Custom props")).toBeInTheDocument();
  });
});
