/**
 * Integration tests for the Home page (page.tsx).
 *
 * These tests exercise the full search → filter → modal flow end-to-end
 * using the real child components and the real items.json data set.
 *
 * Timing:
 *   - SearchBar debounce:    300 ms  (useDebounce)
 *   - page.tsx filter delay: 150 ms  (artificial setTimeout, scheduled
 *     AFTER the debounce fires and React re-renders)
 *
 * Because the filter setTimeout is only created after React processes the
 * debounce callback, a single advanceTimersByTime won't catch it.  We flush
 * timers in two steps: one to fire the debounce, another to fire the filter.
 */

import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "@testing-library/react";
import Home from "./page";

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

/** Advance fake timers and flush React state updates. */
async function advanceAndFlush(ms: number) {
  await act(async () => {
    jest.advanceTimersByTime(ms);
  });
}

/**
 * Type text, then flush debounce (300 ms) + filter (150 ms) in two
 * separate act() calls so React has a chance to schedule the second timer.
 */
async function typeAndSettle(
  user: ReturnType<typeof userEvent.setup>,
  element: HTMLElement,
  text: string
) {
  await user.type(element, text);
  // 1) fire the debounce → React sets isLoading & schedules filterTimer
  await advanceAndFlush(300);
  // 2) fire the filter timer → React sets isLoading=false & updates items
  await advanceAndFlush(150);
}

describe("Home (page.tsx) — integration", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ── initial render ──────────────────────────────────────────────

  it("renders the page heading", async () => {
    render(<Home />);
    await advanceAndFlush(0);

    expect(
      screen.getByRole("heading", { name: /shop search/i })
    ).toBeInTheDocument();
  });

  it("renders the search input", async () => {
    render(<Home />);
    await advanceAndFlush(0);

    expect(screen.getByLabelText(/search items/i)).toBeInTheDocument();
  });

  it("shows all 100 items on initial load (no search term)", async () => {
    render(<Home />);
    // initial onSearch("") fires immediately; flush the 150 ms filter delay
    await advanceAndFlush(150);

    const cards = screen.getAllByRole("button", {
      name: /view details for/i,
    });
    expect(cards).toHaveLength(100);
  });

  // ── search by name ──────────────────────────────────────────────

  it("filters items by name (case-insensitive partial match)", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Home />);
    await advanceAndFlush(150); // initial load

    const input = screen.getByLabelText(/search items/i);
    await typeAndSettle(user, input, "Item 001");

    // "Item 001" is the only name that matches
    const cards = screen.getAllByRole("button", { name: /view details for/i });
    expect(cards).toHaveLength(1);
    expect(cards[0]).toHaveAccessibleName(/Item 001/);
  });

  // ── search by tag ───────────────────────────────────────────────

  it("filters items by tag (case-insensitive, partial match)", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Home />);
    await advanceAndFlush(150);

    const input = screen.getByLabelText(/search items/i);
    await typeAndSettle(user, input, "eco");

    const cards = screen.getAllByRole("button", { name: /view details for/i });
    // "eco" is a tag on multiple items — more than 1, fewer than 100
    expect(cards.length).toBeGreaterThan(1);
    expect(cards.length).toBeLessThan(100);
  });

  // ── empty result state ──────────────────────────────────────────

  it("shows 'No results found' when no items match", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Home />);
    await advanceAndFlush(150);

    const input = screen.getByLabelText(/search items/i);
    await typeAndSettle(user, input, "zzzznonexistentthing");

    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  // ── loading state ───────────────────────────────────────────────

  it("briefly shows a loading spinner after the debounce fires", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Home />);
    await advanceAndFlush(150); // initial load settled

    const input = screen.getByLabelText(/search items/i);
    await user.type(input, "hi");

    // Fire only the debounce (300 ms).  This triggers setIsLoading(true)
    // and schedules the 150 ms filter timer, but does NOT resolve it.
    await advanceAndFlush(300);

    // Loading spinner should be visible
    expect(screen.getByRole("status")).toBeInTheDocument();

    // Now resolve the filter timer
    await advanceAndFlush(150);

    // Spinner gone
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  // ── clearing the search ─────────────────────────────────────────

  it("restores all items when the search input is cleared", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Home />);
    await advanceAndFlush(150);

    const input = screen.getByLabelText(/search items/i);

    // narrow results
    await typeAndSettle(user, input, "Item 001");
    expect(screen.getAllByRole("button", { name: /view details for/i })).toHaveLength(1);

    // clear input and let debounce + filter settle
    await user.clear(input);
    await advanceAndFlush(300); // debounce
    await advanceAndFlush(150); // filter

    expect(screen.getAllByRole("button", { name: /view details for/i })).toHaveLength(100);
  });

  // ── modal open ──────────────────────────────────────────────────

  it("opens the details modal when a result card is clicked", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Home />);
    await advanceAndFlush(150);

    const firstCard = screen.getByLabelText(/View details for Item 001/i);
    await user.click(firstCard);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("modal displays the correct item details", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Home />);
    await advanceAndFlush(150);

    // click Item 002 (Electronics, tags: popular, premium)
    await user.click(screen.getByLabelText(/View details for Item 002/i));

    const dialog = screen.getByRole("dialog");

    expect(
      within(dialog).getByRole("heading", { name: /Item 002/ })
    ).toBeInTheDocument();
    expect(within(dialog).getByText("Electronics")).toBeInTheDocument();
    expect(
      within(dialog).getByText(/Item 002 is a electronics product/i)
    ).toBeInTheDocument();
    expect(within(dialog).getByText("popular")).toBeInTheDocument();
    expect(within(dialog).getByText("premium")).toBeInTheDocument();
  });

  // ── modal close via button ──────────────────────────────────────

  it("closes the modal when the close button is clicked", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Home />);
    await advanceAndFlush(150);

    await user.click(screen.getByLabelText(/View details for Item 001/i));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByLabelText(/close/i));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  // ── modal close via backdrop ────────────────────────────────────

  it("closes the modal when the backdrop is clicked", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Home />);
    await advanceAndFlush(150);

    await user.click(screen.getByLabelText(/View details for Item 001/i));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    // click the backdrop (the dialog element itself)
    await user.click(dialog);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  // ── modal stays open on content click ───────────────────────────

  it("does NOT close the modal when clicking inside the modal content", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Home />);
    await advanceAndFlush(150);

    await user.click(screen.getByLabelText(/View details for Item 001/i));

    const dialog = screen.getByRole("dialog");
    // scope heading query to dialog to avoid matching the h3 card behind it
    const modalHeading = within(dialog).getByRole("heading", { name: /Item 001/ });
    await user.click(modalHeading);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  // ── search term is preserved while modal is open ───────────────

  it("search input retains its value while the modal is open and closed", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Home />);
    await advanceAndFlush(150);

    const input = screen.getByLabelText(/search items/i);
    await typeAndSettle(user, input, "Item 003");

    // open modal
    await user.click(screen.getByLabelText(/View details for Item 003/i));
    expect(input).toHaveValue("Item 003");

    // close modal
    await user.click(screen.getByLabelText(/close/i));
    expect(input).toHaveValue("Item 003");
  });
});
