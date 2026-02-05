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
      <input
        id="search-input"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search by name or tag…"
        aria-label="Search items by name or tag"
        className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   transition duration-200"
      />
    </div>
  );
}
