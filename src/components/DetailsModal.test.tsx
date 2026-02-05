import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DetailsModal from "./DetailsModal";
import type { Item } from "@/types/item";

// ── fixture ───────────────────────────────────────────────────────

const sampleItem: Item = {
  id: 7,
  name: "Portable Speaker",
  category: "Electronics",
  rating: "4.6",
  price: "$34.99",
  description: "Crystal-clear sound in a compact design.",
  tags: ["portable", "premium", "gift"],
};

describe("DetailsModal", () => {
  // ── null guard ────────────────────────────────────────────────

  it("renders nothing when item is null", () => {
    const { container } = render(
      <DetailsModal item={null} onClose={jest.fn()} />
    );

    expect(container.innerHTML).toBe("");
  });

  // ── full-detail rendering ─────────────────────────────────────

  it("renders the item name as a heading", () => {
    render(<DetailsModal item={sampleItem} onClose={jest.fn()} />);

    expect(
      screen.getByRole("heading", { name: sampleItem.name })
    ).toBeInTheDocument();
  });

  it("displays category, rating, price, and description", () => {
    render(<DetailsModal item={sampleItem} onClose={jest.fn()} />);

    expect(screen.getByText(sampleItem.category)).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`${sampleItem.rating}\\s*/\\s*5`))
    ).toBeInTheDocument();
    expect(screen.getByText(sampleItem.price)).toBeInTheDocument();
    expect(screen.getByText(sampleItem.description)).toBeInTheDocument();
  });

  it("renders every tag as a visible badge", () => {
    render(<DetailsModal item={sampleItem} onClose={jest.fn()} />);

    sampleItem.tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  // ── dialog semantics & accessibility ──────────────────────────

  it("has role=dialog and aria-modal=true on the backdrop", () => {
    render(<DetailsModal item={sampleItem} onClose={jest.fn()} />);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("has an accessible aria-label on the dialog referencing the item name", () => {
    render(<DetailsModal item={sampleItem} onClose={jest.fn()} />);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute(
      "aria-label",
      expect.stringContaining(sampleItem.name)
    );
  });

  it("close button has a descriptive aria-label", () => {
    render(<DetailsModal item={sampleItem} onClose={jest.fn()} />);

    const closeBtn = screen.getByLabelText(/close/i);
    expect(closeBtn).toBeInTheDocument();
  });

  // ── close via close button ────────────────────────────────────

  it("calls onClose when the close button is clicked", async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    render(<DetailsModal item={sampleItem} onClose={onClose} />);

    const closeBtn = screen.getByLabelText(/close/i);
    await user.click(closeBtn);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // ── close via backdrop click ──────────────────────────────────

  it("calls onClose when the backdrop (outside modal content) is clicked", async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    render(<DetailsModal item={sampleItem} onClose={onClose} />);

    // The backdrop is the element with role=dialog itself.
    // Clicking it directly (not the inner content) should trigger onClose.
    const backdrop = screen.getByRole("dialog");
    await user.click(backdrop);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // ── stopPropagation: click inside modal does NOT close ────────

  it("does NOT call onClose when clicking inside the modal content area", async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    render(<DetailsModal item={sampleItem} onClose={onClose} />);

    // Click on the item name heading — inside the modal content div
    const heading = screen.getByRole("heading", { name: sampleItem.name });
    await user.click(heading);

    expect(onClose).not.toHaveBeenCalled();
  });

  it("does NOT call onClose when clicking on a tag badge", async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    render(<DetailsModal item={sampleItem} onClose={onClose} />);

    const tagBadge = screen.getByText(sampleItem.tags[0]);
    await user.click(tagBadge);

    expect(onClose).not.toHaveBeenCalled();
  });

  // ── item with a single tag ────────────────────────────────────

  it("handles an item with only one tag", () => {
    const singleTagItem: Item = { ...sampleItem, tags: ["eco"] };
    render(<DetailsModal item={singleTagItem} onClose={jest.fn()} />);

    expect(screen.getByText("eco")).toBeInTheDocument();
  });
});
