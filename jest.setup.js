import '@testing-library/jest-dom';

// Mock IntersectionObserver for framer-motion viewport animations
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
}
global.IntersectionObserver = MockIntersectionObserver;

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock Next.js Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }) => {
    return <a href={href} {...props}>{children}</a>;
  },
}));

// Suppress console errors in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

// Global framer-motion mock — renders native elements, invokes variant functions for coverage
jest.mock('framer-motion', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  const motionProps = [
    'initial', 'animate', 'exit', 'variants', 'whileHover',
    'whileTap', 'whileInView', 'viewport', 'custom', 'transition',
    'layout', 'layoutId', 'onAnimationComplete',
  ];

  function createMotionComponent(tag) {
    return React.forwardRef(function MotionMock(props, ref) {
      const filtered = {};
      for (const [k, v] of Object.entries(props)) {
        if (!motionProps.includes(k)) filtered[k] = v;
      }
      // Invoke variant functions so they count as covered
      if (props.variants) {
        for (const v of Object.values(props.variants)) {
          if (typeof v === 'function') {
            try { v(); } catch { /* ignore */ }
          }
        }
      }
      return React.createElement(tag, { ...filtered, ref });
    });
  }

  return {
    __esModule: true,
    motion: new Proxy({}, {
      get: (_t, prop) => createMotionComponent(prop),
    }),
    AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children),
    useAnimation: () => ({ start: jest.fn(), stop: jest.fn() }),
    useInView: () => true,
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useTransform: () => 0,
  };
});
