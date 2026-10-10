require("@testing-library/jest-dom");
const React = require("react");

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: function MockImage(props) {
    return React.createElement("img", { ...props, alt: props.alt || "" });
  },
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get: (_, tag) =>
        function MockMotion({ children, initial, animate, exit, transition, whileHover, whileTap, ...props }) {
          return React.createElement(tag, props, children);
        },
    }
  ),
  MotionConfig: function MockMotionConfig({ children }) {
    return React.createElement(React.Fragment, null, children);
  },
  AnimatePresence: function MockAnimatePresence({ children }) {
    return React.createElement(React.Fragment, null, children);
  },
  useAnimation: () => ({
    start: jest.fn(),
  }),
}));
