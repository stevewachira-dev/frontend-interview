"use client";

import { Item } from "@/types/item";
import CategoryPlaceholder from "@/components/CategoryPlaceholder";

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
  // Loading state — skeleton grid
  if (isLoading) {
    return (
      <div role="status" aria-label="Loading results">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden animate-pulse">
              <div className="bg-gray-200 h-40"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-500 mt-4 text-sm">Loading…</p>
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <svg className="w-14 h-14 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
        </svg>
        <p className="text-gray-500 text-lg font-bold">No results found</p>
        <p className="text-gray-400 text-sm mt-1">Try adjusting your search term</p>
      </div>
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
          className="text-left w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden
                     hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`View details for ${item.name}`}
        >
          {/* Category placeholder image */}
          <CategoryPlaceholder category={item.category} className="w-full h-40 rounded-t-lg" />

          {/* Card body */}
          <div className="p-4">
            <h3 className="font-bold text-lg text-gray-900 truncate">{item.name}</h3>
            <div className="mt-2 space-y-1">
              <p className="text-gray-600 text-sm">
                <span className="font-bold text-gray-700">Category:</span> {item.category}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-gray-600 text-sm">
                  <span className="font-bold text-gray-700">Rating:</span> {item.rating} / 5
                </p>
                <span className="text-blue-600 font-bold text-sm">{item.price}</span>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
