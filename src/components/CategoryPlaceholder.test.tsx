import React from "react";
import { render, screen } from "@testing-library/react";
import CategoryPlaceholder from "./CategoryPlaceholder";

describe("CategoryPlaceholder", () => {
  // ── known categories render their aria-label ──────────────────────

  const knownCategories = [
    "Books",
    "Electronics",
    "Home",
    "Outdoors",
    "Toys",
    "Clothing",
  ];

  it.each(knownCategories)(
    "renders a labelled placeholder for category '%s'",
    (category) => {
      render(<CategoryPlaceholder category={category} />);
      expect(
        screen.getByLabelText(`${category} placeholder`)
      ).toBeInTheDocument();
    }
  );

  // ── unknown / fallback category ────────────────────────────────────

  it("renders a fallback placeholder for an unknown category", () => {
    render(<CategoryPlaceholder category="Widgets" />);
    expect(
      screen.getByLabelText("Widgets placeholder")
    ).toBeInTheDocument();
  });

  // ── className passthrough ─────────────────────────────────────────

  it("applies extra className to the wrapper", () => {
    const { container } = render(
      <CategoryPlaceholder category="Books" className="w-full h-48 rounded-t-lg" />
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.classList.contains("w-full")).toBe(true);
    expect(wrapper.classList.contains("h-48")).toBe(true);
    expect(wrapper.classList.contains("rounded-t-lg")).toBe(true);
  });

  // ── SVG icon is present and aria-hidden ───────────────────────────

  it("contains an aria-hidden SVG icon", () => {
    const { container } = render(<CategoryPlaceholder category="Electronics" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });
});
