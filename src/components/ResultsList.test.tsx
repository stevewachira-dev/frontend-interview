import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResultsList from "./ResultsList";
import type { Item } from "@/types/item";

// ── shared test fixtures ──────────────────────────────────────────

const mockItems: Item[] = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    rating: "4.5",
    price: "$49.99",
    description: "Great sound quality.",
    tags: ["popular", "premium"],
  },
  {
    id: 2,
    name: "Camping Tent",
    category: "Outdoors",
    rating: "4.2",
    price: "$89.99",
    description: "Lightweight and durable.",
    tags: ["durable", "travel"],
  },
  {
    id: 3,
    name: "Cooking Book",
    category: "Books",
    rating: "4.8",
    price: "$14.99",
    description: "A culinary masterpiece.",
    tags: ["new", "gift"],
  },
];

describe("ResultsList", () => {
  // ── loading state (skeleton) ──────────────────────────────────────

  it("renders the status region when isLoading is true", () => {
    render(<ResultsList items={[]} isLoading={true} onItemClick={jest.fn()} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows 'Loading…' text while loading", () => {
    render(<ResultsList items={[]} isLoading={true} onItemClick={jest.fn()} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("does NOT render item cards while loading, even if items are provided", () => {
    render(
      <ResultsList items={mockItems} isLoading={true} onItemClick={jest.fn()} />
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
    mockItems.forEach((item) => {
      expect(screen.queryByText(item.name)).not.toBeInTheDocument();
    });
  });

  // ── empty state ───────────────────────────────────────────────────

  it("shows 'No results found' when items array is empty and not loading", () => {
    render(<ResultsList items={[]} isLoading={false} onItemClick={jest.fn()} />);
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  it("shows the helper subtitle in the empty state", () => {
    render(<ResultsList items={[]} isLoading={false} onItemClick={jest.fn()} />);
    expect(
      screen.getByText(/try adjusting your search term/i)
    ).toBeInTheDocument();
  });

  // ── populated list ────────────────────────────────────────────────

  it("renders a card for every item in the list", () => {
    render(
      <ResultsList items={mockItems} isLoading={false} onItemClick={jest.fn()} />
    );
    mockItems.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });

  it("each card displays name, category, rating, and price", () => {
    render(
      <ResultsList items={mockItems} isLoading={false} onItemClick={jest.fn()} />
    );
    mockItems.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
      expect(screen.getByText(item.category)).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(`${item.rating}\\s*/\\s*5`))
      ).toBeInTheDocument();
      expect(screen.getByText(item.price)).toBeInTheDocument();
    });
  });

  it("each card renders a CategoryPlaceholder with the correct aria-label", () => {
    render(
      <ResultsList items={mockItems} isLoading={false} onItemClick={jest.fn()} />
    );
    mockItems.forEach((item) => {
      expect(
        screen.getByLabelText(`${item.category} placeholder`)
      ).toBeInTheDocument();
    });
  });

  it("each card is a <button> element (semantic, accessible)", () => {
    render(
      <ResultsList items={mockItems} isLoading={false} onItemClick={jest.fn()} />
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(mockItems.length);
  });

  it("each card has an accessible aria-label with the item name", () => {
    render(
      <ResultsList items={mockItems} isLoading={false} onItemClick={jest.fn()} />
    );
    mockItems.forEach((item) => {
      expect(
        screen.getByLabelText(new RegExp(`View details for ${item.name}`, "i"))
      ).toBeInTheDocument();
    });
  });

  // ── click interaction ─────────────────────────────────────────────

  it("calls onItemClick with the correct item when a card is clicked", async () => {
    const onItemClick = jest.fn();
    const user = userEvent.setup();
    render(
      <ResultsList items={mockItems} isLoading={false} onItemClick={onItemClick} />
    );

    const secondCard = screen.getByLabelText(
      new RegExp(`View details for ${mockItems[1].name}`, "i")
    );
    await user.click(secondCard);

    expect(onItemClick).toHaveBeenCalledTimes(1);
    expect(onItemClick).toHaveBeenCalledWith(mockItems[1]);
  });

  it("calls onItemClick independently for each card clicked", async () => {
    const onItemClick = jest.fn();
    const user = userEvent.setup();
    render(
      <ResultsList items={mockItems} isLoading={false} onItemClick={onItemClick} />
    );

    for (const item of mockItems) {
      const card = screen.getByLabelText(
        new RegExp(`View details for ${item.name}`, "i")
      );
      await user.click(card);
    }

    expect(onItemClick).toHaveBeenCalledTimes(mockItems.length);
    mockItems.forEach((item, idx) => {
      expect(onItemClick).toHaveBeenNthCalledWith(idx + 1, item);
    });
  });

  // ── single item ───────────────────────────────────────────────────

  it("renders correctly with a single item", () => {
    const single = [mockItems[0]];
    render(
      <ResultsList items={single} isLoading={false} onItemClick={jest.fn()} />
    );

    expect(screen.getByText(single[0].name)).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });
});
