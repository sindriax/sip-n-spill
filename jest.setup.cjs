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
  motion: {
    div: function MockDiv({ children, ...props }) {
      return React.createElement("div", props, children);
    },
    button: function MockButton({ children, ...props }) {
      return React.createElement("button", props, children);
    },
    span: function MockSpan({ children, ...props }) {
      return React.createElement("span", props, children);
    },
    p: function MockP({ children, ...props }) {
      return React.createElement("p", props, children);
    },
  },
  AnimatePresence: function MockAnimatePresence({ children }) {
    return React.createElement(React.Fragment, null, children);
  },
  useAnimation: () => ({
    start: jest.fn(),
  }),
}));
