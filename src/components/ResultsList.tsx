"use client";

import { Item } from "@/types/item";

interface ResultsListProps {
  items: Item[];
  isLoading: boolean;
  onItemClick: (item: Item) => void;
}

export default function ResultsList({
  items,
  isLoading,
  onItemClick,
}: ResultsListProps) {
  // Loading state
  if (isLoading) {
    return (
      <div
        role="status"
        className="flex justify-center items-center py-12"
        aria-label="Loading results"
      >
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading…</span>
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <p className="text-center text-gray-600 py-12 text-lg">
        No results found
      </p>
    );
  }

  // Results grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onItemClick(item)}
          className="text-left w-full bg-white border border-gray-200 rounded-lg shadow-sm p-4
                     hover:shadow-md cursor-pointer transition duration-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`View details for ${item.name}`}
        >
          <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
          <div className="mt-2 space-y-1">
            <p className="text-gray-600">
              <span className="font-bold">Category:</span> {item.category}
            </p>
            <p className="text-gray-600">
              <span className="font-bold">Rating:</span> {item.rating} / 5
            </p>
            <p className="text-gray-600">
              <span className="font-bold">Price:</span> {item.price}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
