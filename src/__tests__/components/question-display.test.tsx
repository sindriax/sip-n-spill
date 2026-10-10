import { render, screen } from "@testing-library/react";
import QuestionDisplay from "../../app/components/question-display";

describe("QuestionDisplay", () => {
  it("renders the question text", () => {
    render(<QuestionDisplay question="Been cheated on" questionKey={0} />);
    expect(screen.getByText("Been cheated on")).toBeInTheDocument();
  });

  it("keeps special characters intact", () => {
    render(<QuestionDisplay question="¿Se ha liado con alguien & se ha arrepentido?" questionKey={0} />);
    expect(screen.getByText("¿Se ha liado con alguien & se ha arrepentido?")).toBeInTheDocument();
  });
});
