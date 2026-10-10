import { render, screen, fireEvent, within } from "@testing-library/react";
import HomePage from "../../app/page";
import { getStrings } from "../../app/lib/i18n";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

const en = getStrings("en");
const es = getStrings("es");

beforeEach(() => {
  localStorage.clear();
  mockPush.mockClear();
  Object.defineProperty(navigator, "language", { value: "en-US", configurable: true });
});

const play = () => screen.getByRole("button", { name: en.start });
const dialog = () => screen.getByRole("dialog");

describe("HomePage", () => {
  it("starts classic with all vibes and shows the rules on the first game only", () => {
    render(<HomePage />);
    fireEvent.click(play());
    expect(mockPush).not.toHaveBeenCalled();
    fireEvent.click(within(dialog()).getByRole("button", { name: en.rules.gotIt }));
    expect(mockPush).toHaveBeenCalledWith("/play?lang=en&mode=classic&vibes=chill%2Cspicy%2Cunhinged");

    fireEvent.click(play());
    expect(mockPush).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("lets you narrow the vibes from the Vibe row", () => {
    render(<HomePage />);
    fireEvent.click(screen.getByRole("button", { name: new RegExp(en.settings.vibe, "i") }));
    fireEvent.click(within(dialog()).getByRole("checkbox", { name: new RegExp(`^${en.vibes.chill.name}`) }));
    fireEvent.click(within(dialog()).getByRole("button", { name: en.settings.done }));
    expect(screen.getByText("Spicy · Unhinged")).toBeInTheDocument();
  });

  it("requires two players for hot seat and asks for them on start", () => {
    localStorage.setItem("sns:rules-seen", "true");
    render(<HomePage />);
    fireEvent.click(screen.getByRole("button", { name: new RegExp(en.settings.mode, "i") }));
    fireEvent.click(within(dialog()).getByRole("radio", { name: new RegExp(`^${en.modes.hotseat.name}`) }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(play());
    expect(mockPush).not.toHaveBeenCalled();
    const input = within(dialog()).getByRole("textbox");
    for (const name of ["Ana", "Luis"]) {
      fireEvent.change(input, { target: { value: name } });
      fireEvent.submit(input.closest("form")!);
    }
    fireEvent.click(within(dialog()).getByRole("button", { name: en.settings.done }));
    fireEvent.click(play());
    expect(mockPush).toHaveBeenCalledWith("/play?lang=en&mode=hotseat&players=Ana%2CLuis");
  });

  it("switches language and remembers the setup", () => {
    const { unmount } = render(<HomePage />);
    fireEvent.click(screen.getByRole("radio", { name: "Español" }));
    expect(screen.getByText(es.tagline)).toBeInTheDocument();
    unmount();

    render(<HomePage />);
    expect(screen.getByText(es.tagline)).toBeInTheDocument();
  });

  it("detects Spanish browsers on first visit", () => {
    Object.defineProperty(navigator, "language", { value: "es-ES", configurable: true });
    render(<HomePage />);
    expect(screen.getByText(es.tagline)).toBeInTheDocument();
  });
});
