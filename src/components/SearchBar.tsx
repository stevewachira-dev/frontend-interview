"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchBarProps {
  onSearch: (term: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const debouncedValue = useDebounce(inputValue, 300);

  // Trigger search whenever debounced value changes
  // (useEffect runs on mount with "" which is fine — shows all items)
  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <div className="w-full max-w-xl mx-auto">
      <label
        htmlFor="search-input"
        className="block text-sm font-bold text-gray-700 mb-2"
      >
        Search Items
      </label>
      <div className="relative">
        {/* magnifying glass icon */}
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden="true">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
        </span>
        <input
          id="search-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search by name or tag…"
          aria-label="Search items by name or tag"
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 text-gray-900 bg-white rounded-lg shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition duration-200 placeholder-gray-400"
        />
      </div>
    </div>
  );
}
