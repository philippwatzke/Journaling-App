'use client';

import React from 'react';

interface CategorySelectorProps {
  category: string | undefined;
  onCategoryChange: (category: string | undefined) => void;
  availableCategories?: string[];
}

const DEFAULT_CATEGORIES = [
  'Personal',
  'Work',
  'Health',
  'Thoughts',
  'Ideas',
  'Travel',
  'Relationships',
  'Learning',
];

export default function CategorySelector({
  category,
  onCategoryChange,
  availableCategories = DEFAULT_CATEGORIES,
}: CategorySelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Category
      </label>
      <select
        value={category || ''}
        onChange={(e) =>
          onCategoryChange(e.target.value === '' ? undefined : e.target.value)
        }
        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">No Category</option>
        {availableCategories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}
