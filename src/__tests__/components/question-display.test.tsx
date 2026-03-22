import { render, screen, waitFor } from "@testing-library/react";
import QuestionDisplay from "../../app/components/question-display";

const mockCupControls = {
  start: jest.fn(),
  stop: jest.fn(),
  set: jest.fn(),
  mount: jest.fn(),
};

const mockCupAnimationVariants = {
  initial: { rotate: 0, x: 0, y: 0 },
  tip: {
    rotate: [0, 15, 0],
    x: [0, 5, 0],
    y: [0, -2, 0],
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

describe("QuestionDisplay", () => {
  it("should render the question text", () => {
    render(
      <QuestionDisplay
        question="Have you ever skipped class?"
        questionKey={1}
        isTipping={false}
        cupControls={mockCupControls as never}
        cupAnimationVariants={mockCupAnimationVariants}
      />
    );

    expect(screen.getByText("Have you ever skipped class?")).toBeInTheDocument();
  });

  it("should render cocktail glass emojis", () => {
    render(
      <QuestionDisplay
        question="Test question"
        questionKey={1}
        isTipping={false}
        cupControls={mockCupControls as never}
        cupAnimationVariants={mockCupAnimationVariants}
      />
    );

    // Should have 4 cocktail glass emojis (corners)
    const emojis = screen.getAllByText("🍸");
    expect(emojis).toHaveLength(4);
  });

  it("should update displayed question when question prop changes", async () => {
    const { rerender } = render(
      <QuestionDisplay
        question="First question"
        questionKey={1}
        isTipping={false}
        cupControls={mockCupControls as never}
        cupAnimationVariants={mockCupAnimationVariants}
      />
    );

    expect(screen.getByText("First question")).toBeInTheDocument();

    rerender(
      <QuestionDisplay
        question="Second question"
        questionKey={2}
        isTipping={false}
        cupControls={mockCupControls as never}
        cupAnimationVariants={mockCupAnimationVariants}
      />
    );

    // Wait for the flip animation to complete
    await waitFor(
      () => {
        expect(screen.getByText("Second question")).toBeInTheDocument();
      },
      { timeout: 500 }
    );
  });

  it("should handle empty question", () => {
    render(
      <QuestionDisplay
        question=""
        questionKey={1}
        isTipping={false}
        cupControls={mockCupControls as never}
        cupAnimationVariants={mockCupAnimationVariants}
      />
    );

    // Should still render without crashing
    const emojis = screen.getAllByText("🍸");
    expect(emojis).toHaveLength(4);
  });

  it("should handle long question text", () => {
    const longQuestion =
      "This is a very long question that might wrap to multiple lines in the display area and we want to make sure it handles this correctly without any issues.";

    render(
      <QuestionDisplay
        question={longQuestion}
        questionKey={1}
        isTipping={false}
        cupControls={mockCupControls as never}
        cupAnimationVariants={mockCupAnimationVariants}
      />
    );

    expect(screen.getByText(longQuestion)).toBeInTheDocument();
  });

  it("should handle special characters in questions", () => {
    const questionWithSpecialChars = "Who's your favorite person? (Be honest!)";

    render(
      <QuestionDisplay
        question={questionWithSpecialChars}
        questionKey={1}
        isTipping={false}
        cupControls={mockCupControls as never}
        cupAnimationVariants={mockCupAnimationVariants}
      />
    );

    expect(screen.getByText(questionWithSpecialChars)).toBeInTheDocument();
  });
});
