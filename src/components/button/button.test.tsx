import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@/tests";
import { Button } from "./button";

describe("Button", () => {
  it("renders correctly with default props", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("cursor-pointer");
    expect(button).toHaveAttribute("type", "button");
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: "Click me" });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("respects disabled state", () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Disabled" });
    expect(button).toBeDisabled();
    expect(button).toHaveClass("cursor-pointer");

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("shows loading state", () => {
    render(<Button loading>Loading</Button>);

    const button = screen.getByRole("button", { name: "Loading" });
    expect(button).toBeInTheDocument();
  });

  it("accepts custom className", () => {
    render(<Button className="custom-class">Custom</Button>);

    const button = screen.getByRole("button", { name: "Custom" });
    expect(button).toHaveClass("custom-class", "cursor-pointer");
  });

  it("passes through additional props", () => {
    render(
      <Button data-testid="custom-button" aria-label="Custom label">
        Props test
      </Button>,
    );

    const button = screen.getByTestId("custom-button");
    expect(button).toHaveAttribute("aria-label", "Custom label");
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Ref test</Button>);

    // The ref should be called with the button element
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  it("supports different button types", () => {
    render(<Button type="submit">Submit</Button>);

    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toHaveAttribute("type", "submit");
  });

  it("handles keyboard navigation", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Keyboard test</Button>);

    const button = screen.getByRole("button", { name: "Keyboard test" });
    button.focus();

    fireEvent.keyDown(button, { key: "Enter" });
    fireEvent.keyDown(button, { key: " " });

    // Note: The actual click events from keyboard are handled by the browser
    // We're just testing that the button can receive focus and key events
    expect(button).toHaveFocus();
  });

  it("renders children correctly", () => {
    render(
      <Button>
        <span>Complex</span> content
      </Button>,
    );

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Complex content");
  });
});
