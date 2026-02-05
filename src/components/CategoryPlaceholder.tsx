"use client";

/**
 * Pure-Tailwind placeholder "image" block for each product category.
 * Zero external requests — bg colour + an inline SVG icon, both driven
 * by the category string.  Every class string is written literally so
 * Tailwind v4's source scanner picks them up at build time.
 */

interface CategoryColors {
  bg: string;
  icon: string;
}

// Full literal class strings — never construct these dynamically.
const CATEGORY_STYLES: Record<string, CategoryColors> = {
  Books:       { bg: "bg-amber-100",      icon: "text-amber-600" },
  Electronics: { bg: "bg-sky-100",        icon: "text-sky-600" },
  Home:        { bg: "bg-emerald-100",    icon: "text-emerald-600" },
  Outdoors:    { bg: "bg-green-100",      icon: "text-green-600" },
  Toys:        { bg: "bg-pink-100",       icon: "text-pink-600" },
  Clothing:    { bg: "bg-violet-100",     icon: "text-violet-600" },
};

const FALLBACK: CategoryColors = { bg: "bg-gray-100", icon: "text-gray-500" };

// ── SVG icons (heroicons-style, 24×24 viewBox) ────────────────────────────

function BookIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function ElectronicsIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3.75v2.625a.375.375 0 00.375.375h1.875a.375.375 0 00.375-.375V3.75m0 0H12.75m-4.5 0H6.75A2.25 2.25 0 004.5 6v10.125c0 .621.504 1.125 1.125 1.125H9.75v1.5c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125v-1.5h5.25c.621 0 1.125-.504 1.125-1.125V6a2.25 2.25 0 00-2.25-2.25h-1.5m-6 0H8.25m0 0v2.625" />
    </svg>
  );
}

function HomeIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function OutdoorsIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75a3 3 0 116 0 3 3 0 01-6 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0113.5 0m-13.5 .001v.006c0 .495.187.972.502 1.337L9 21.75l6.998-1.286c.315-.365.502-.841.502-1.337v-.006a7.125 7.125 0 00-13.5 0z" />
    </svg>
  );
}

function ToysIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}

function ClothingIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5.25L21 12l-12 6.75V5.25z" />
    </svg>
  );
}

function FallbackIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
    </svg>
  );
}

const ICONS: Record<string, (props: { className: string }) => JSX.Element> = {
  Books:       BookIcon,
  Electronics: ElectronicsIcon,
  Home:        HomeIcon,
  Outdoors:    OutdoorsIcon,
  Toys:        ToysIcon,
  Clothing:    ClothingIcon,
};

interface CategoryPlaceholderProps {
  category: string;
  /** Tailwind classes for the outer wrapper (e.g. "w-full h-48 rounded-t-lg") */
  className?: string;
}

export default function CategoryPlaceholder({ category, className = "" }: CategoryPlaceholderProps) {
  const { bg, icon } = CATEGORY_STYLES[category] ?? FALLBACK;
  const Icon = ICONS[category] ?? FallbackIcon;

  return (
    <div
      className={`${bg} flex items-center justify-center ${className}`}
      aria-label={`${category} placeholder`}
    >
      <Icon className={`${icon} w-16 h-16 opacity-60`} />
    </div>
  );
}
