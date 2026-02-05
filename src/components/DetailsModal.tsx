"use client";

import { Item } from "@/types/item";

interface DetailsModalProps {
  item: Item | null;
  onClose: () => void;
}

export default function DetailsModal({ item, onClose }: DetailsModalProps) {
  if (item === null) {
    return null;
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${item.name}`}
    >
      {/* Modal content — stop clicks from bubbling to backdrop */}
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6
                   focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700
                     focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md
                     transition duration-200"
          aria-label="Close details modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Item details */}
        <h2 className="text-2xl font-bold text-gray-900 pr-8">{item.name}</h2>

        <div className="mt-4 space-y-3">
          <p className="text-gray-600">
            <span className="font-bold text-gray-700">Category:</span>{" "}
            {item.category}
          </p>
          <p className="text-gray-600">
            <span className="font-bold text-gray-700">Rating:</span>{" "}
            {item.rating} / 5
          </p>
          <p className="text-gray-600">
            <span className="font-bold text-gray-700">Price:</span>{" "}
            {item.price}
          </p>
          <p className="text-gray-600">
            <span className="font-bold text-gray-700">Description:</span>{" "}
            {item.description}
          </p>

          {/* Tags */}
          <div>
            <span className="font-bold text-gray-700">Tags:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-blue-100 text-blue-700 text-sm font-bold px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
