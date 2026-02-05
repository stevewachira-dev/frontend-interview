import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "@testing-library/react";
import SearchBar from "./SearchBar";

describe("SearchBar", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ── rendering & accessibility ──────────────────────────────────

  it("renders a labelled text input", () => {
    render(<SearchBar onSearch={jest.fn()} />);

    const input = screen.getByLabelText(/search items/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
  });

  it("has a visible label associated with the input via htmlFor", () => {
    render(<SearchBar onSearch={jest.fn()} />);

    const label = screen.getByText(/search items/i);
    expect(label).toBeInTheDocument();
    // The label's htmlFor must match the input's id
    expect(label).toHaveAttribute("for", "search-input");

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("id", "search-input");
  });

  it("shows placeholder text", () => {
    render(<SearchBar onSearch={jest.fn()} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("placeholder", expect.stringContaining("Search"));
  });

  // ── controlled input ────────────────────────────────────────────

  it("reflects typed characters in the input value immediately", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SearchBar onSearch={jest.fn()} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "abc");

    expect(input).toHaveValue("abc");
  });

  // ── debounce + onSearch callback ────────────────────────────────

  it("calls onSearch with empty string on initial mount (shows all items)", async () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);

    // The initial useEffect fires with debouncedValue === "" right away
    // (useDebounce returns the initial value synchronously)
    await act(async () => {
      jest.advanceTimersByTime(0);
    });

    expect(onSearch).toHaveBeenCalledWith("");
  });

  it("does NOT call onSearch again until the debounce delay (300 ms) elapses", async () => {
    const onSearch = jest.fn();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SearchBar onSearch={onSearch} />);

    // clear the initial call
    onSearch.mockClear();

    const input = screen.getByRole("textbox");
    await user.type(input, "x");

    // advance only 200 ms — debounce has NOT fired
    await act(async () => {
      jest.advanceTimersByTime(200);
    });

    expect(onSearch).not.toHaveBeenCalled();
  });

  it("calls onSearch with the typed value after 300 ms debounce", async () => {
    const onSearch = jest.fn();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SearchBar onSearch={onSearch} />);

    onSearch.mockClear();

    const input = screen.getByRole("textbox");
    await user.type(input, "eco");

    // fire the debounce
    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    expect(onSearch).toHaveBeenCalledWith("eco");
  });

  it("debounces rapid keystrokes — only the final value is searched", async () => {
    const onSearch = jest.fn();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SearchBar onSearch={onSearch} />);

    onSearch.mockClear();

    const input = screen.getByRole("textbox");

    // type quickly, each keystroke resets the 300 ms window
    await user.type(input, "a");
    await act(async () => { jest.advanceTimersByTime(100); });
    await user.type(input, "b");
    await act(async () => { jest.advanceTimersByTime(100); });
    await user.type(input, "c");

    // only now let the debounce finish
    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    // onSearch should have been called with the full string "abc"
    expect(onSearch).toHaveBeenCalledWith("abc");
  });

  it("calls onSearch with empty string when input is fully cleared", async () => {
    const onSearch = jest.fn();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SearchBar onSearch={onSearch} />);

    onSearch.mockClear();

    const input = screen.getByRole("textbox");
    await user.type(input, "hello");
    await act(async () => { jest.advanceTimersByTime(300); });

    onSearch.mockClear();

    await user.clear(input);
    await act(async () => { jest.advanceTimersByTime(300); });

    expect(onSearch).toHaveBeenCalledWith("");
  });
});
