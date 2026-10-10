import { render, screen, fireEvent } from "@testing-library/react";
import HowToPlay from "../../app/components/how-to-play";
import { getStrings } from "../../app/lib/i18n";

const strings = getStrings("en");

describe("HowToPlay", () => {
  it("renders nothing while closed", () => {
    render(<HowToPlay mode="classic" strings={strings} isOpen={false} onClose={jest.fn()} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("lists the steps for the active mode", () => {
    render(<HowToPlay mode="hotseat" strings={strings} isOpen onClose={jest.fn()} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(strings.rules.hotseat.length);
    expect(screen.getByText(strings.rules.hotseat[0].title)).toBeInTheDocument();
  });

  it("closes from the button, the backdrop and Escape", () => {
    const onClose = jest.fn();
    render(<HowToPlay mode="classic" strings={strings} isOpen onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: strings.rules.gotIt }));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
