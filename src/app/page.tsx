"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Item } from "@/types/item";
import itemsData from "@/data/items.json";
import SearchBar from "@/components/SearchBar";
import ResultsList from "@/components/ResultsList";
import DetailsModal from "@/components/DetailsModal";

export default function Home() {
  const [filteredItems, setFilteredItems] = useState<Item[]>(itemsData);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const filterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up any pending timer on unmount
  useEffect(() => {
    return () => {
      if (filterTimerRef.current) clearTimeout(filterTimerRef.current);
    };
  }, []);

  // Handle search: filter by name or any tag (case-insensitive)
  const handleSearch = useCallback((term: string) => {
    // Clear any previous pending filter
    if (filterTimerRef.current) clearTimeout(filterTimerRef.current);

    setIsLoading(true);

    // Small artificial delay (150 ms) so the loading spinner is visible
    filterTimerRef.current = setTimeout(() => {
      const lower = term.toLowerCase().trim();

      if (lower === "") {
        setFilteredItems(itemsData);
      } else {
        setFilteredItems(
          itemsData.filter(
            (item) =>
              item.name.toLowerCase().includes(lower) ||
              item.tags.some((tag) => tag.toLowerCase().includes(lower))
          )
        );
      }

      setIsLoading(false);
    }, 150);
  }, []);

  return (
    <main className="min-h-screen p-8 bg-white">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="font-bold text-2xl text-gray-900 text-center">
          Shop Search
        </h1>

        <SearchBar onSearch={handleSearch} />

        <ResultsList
          items={filteredItems}
          isLoading={isLoading}
          onItemClick={setSelectedItem}
        />

        <DetailsModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      </div>
    </main>
  );
}
