"use client";

import { Item } from "@/types/item";
import CategoryPlaceholder from "@/components/CategoryPlaceholder";

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
        className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden
                   focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button — floats over the placeholder */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur text-gray-600 hover:text-gray-900 hover:bg-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1
                     transition duration-200 shadow-sm"
          aria-label="Close details modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
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

        {/* Category placeholder banner */}
        <CategoryPlaceholder category={item.category} className="w-full h-44" />

        {/* Body */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900">{item.name}</h2>

          {/* Price badge */}
          <span className="inline-block mt-1 bg-blue-100 text-blue-700 text-sm font-bold px-3 py-0.5 rounded-full">
            {item.price}
          </span>

          {/* Two-column detail grid */}
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Category</p>
              <p className="text-gray-800 mt-0.5">{item.category}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Rating</p>
              <p className="text-gray-800 mt-0.5">{item.rating} / 5</p>
            </div>
          </div>

          {/* Description */}
          <div className="mt-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Description</p>
            <p className="text-gray-600 mt-0.5">{item.description}</p>
          </div>

          {/* Tags */}
          <div className="mt-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Tags</p>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-blue-100 text-blue-700 text-sm font-bold px-2.5 py-0.5 rounded-full"
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
