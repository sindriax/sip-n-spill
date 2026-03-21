import { render, screen, fireEvent } from "@testing-library/react";
import GameTutorial from "../../app/components/game-tutorial";

const mockTutorialSteps = [
  {
    title: "Step 1",
    description: "This is the first step",
    visual: "1️⃣",
  },
  {
    title: "Step 2",
    description: "This is the second step",
    visual: "2️⃣",
  },
  {
    title: "Step 3",
    description: "This is the third step",
    visual: "3️⃣",
  },
];

const defaultProps = {
  onSkipTutorial: jest.fn(),
  onCompleteTutorial: jest.fn(),
  skipText: "Skip",
  nextText: "Next",
  prevText: "Back",
  finishText: "Finish",
  tutorialTitle: "How to Play",
  tutorialSteps: mockTutorialSteps,
};

describe("GameTutorial", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the tutorial title", () => {
    render(<GameTutorial {...defaultProps} />);
    expect(screen.getByText("How to Play")).toBeInTheDocument();
  });

  it("should render the first step by default", () => {
    render(<GameTutorial {...defaultProps} />);

    expect(screen.getByText("Step 1")).toBeInTheDocument();
    expect(screen.getByText("This is the first step")).toBeInTheDocument();
    expect(screen.getByText("1️⃣")).toBeInTheDocument();
  });

  it("should show skip button", () => {
    render(<GameTutorial {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Skip" })).toBeInTheDocument();
  });

  it("should call onSkipTutorial when skip is clicked", () => {
    const onSkipTutorial = jest.fn();
    render(<GameTutorial {...defaultProps} onSkipTutorial={onSkipTutorial} />);

    fireEvent.click(screen.getByRole("button", { name: "Skip" }));

    expect(onSkipTutorial).toHaveBeenCalledTimes(1);
  });

  it("should not show back button on first step", () => {
    render(<GameTutorial {...defaultProps} />);
    expect(screen.queryByRole("button", { name: "Back" })).not.toBeInTheDocument();
  });

  it("should show next button on first step", () => {
    render(<GameTutorial {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
  });

  it("should advance to next step when next is clicked", () => {
    render(<GameTutorial {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Step 2")).toBeInTheDocument();
    expect(screen.getByText("This is the second step")).toBeInTheDocument();
  });

  it("should show back button after advancing", () => {
    render(<GameTutorial {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });

  it("should go back when back is clicked", () => {
    render(<GameTutorial {...defaultProps} />);

    // Go to step 2
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Step 2")).toBeInTheDocument();

    // Go back to step 1
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByText("Step 1")).toBeInTheDocument();
  });

  it("should show finish button on last step", () => {
    render(<GameTutorial {...defaultProps} />);

    // Navigate to last step
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByRole("button", { name: "Finish" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
  });

  it("should call onCompleteTutorial when finish is clicked", () => {
    const onCompleteTutorial = jest.fn();
    render(<GameTutorial {...defaultProps} onCompleteTutorial={onCompleteTutorial} />);

    // Navigate to last step
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    // Click finish
    fireEvent.click(screen.getByRole("button", { name: "Finish" }));

    expect(onCompleteTutorial).toHaveBeenCalledTimes(1);
  });

  it("should render progress dots for each step", () => {
    render(<GameTutorial {...defaultProps} />);

    // Should have 3 progress dots (one for each step)
    const dots = document.querySelectorAll(".rounded-full.w-3.h-3");
    expect(dots).toHaveLength(3);
  });

  it("should handle single step tutorial", () => {
    const singleStepProps = {
      ...defaultProps,
      tutorialSteps: [
        {
          title: "Only Step",
          description: "This is the only step",
          visual: "🎯",
        },
      ],
    };

    render(<GameTutorial {...singleStepProps} />);

    // Should show finish button immediately
    expect(screen.getByRole("button", { name: "Finish" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Back" })).not.toBeInTheDocument();
  });

  it("should handle steps without visual", () => {
    const noVisualSteps = {
      ...defaultProps,
      tutorialSteps: [
        {
          title: "No Visual Step",
          description: "This step has no visual",
        },
      ],
    };

    render(<GameTutorial {...noVisualSteps} />);

    expect(screen.getByText("No Visual Step")).toBeInTheDocument();
    expect(screen.getByText("This step has no visual")).toBeInTheDocument();
  });
});
