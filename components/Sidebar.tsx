'use client';

import { JournalEntry } from '@/types/journal';
import { format } from 'date-fns';

interface SidebarProps {
  entries: JournalEntry[];
  selectedId: string | null;
  onSelectEntry: (id: string) => void;
  onNewEntry: () => void;
  onDeleteEntry: (id: string) => void;
  selectedCategory?: string | null;
  selectedTag?: string | null;
  onCategoryFilter?: (category: string | null) => void;
  onTagFilter?: (tag: string | null) => void;
}

export default function Sidebar({
  entries,
  selectedId,
  onSelectEntry,
  onNewEntry,
  onDeleteEntry,
  selectedCategory,
  selectedTag,
  onCategoryFilter,
  onTagFilter,
}: SidebarProps) {
  return (
    <div className="w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Journal
        </h1>
        <button
          onClick={onNewEntry}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-150 flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Entry
        </button>
      </div>

      {/* Entries List */}
      <div className="flex-1 overflow-y-auto">
        {entries.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <p className="text-sm">No entries yet.</p>
            <p className="text-sm mt-1">Create your first journal entry!</p>
          </div>
        ) : (
          <div className="p-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className={`group relative mb-2 p-4 rounded-lg cursor-pointer transition-all duration-150 ${
                  selectedId === entry.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                    : 'bg-white dark:bg-gray-800 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-700'
                }`}
                onClick={() => onSelectEntry(entry.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate mb-1">
                      {entry.title || 'Untitled'}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {format(entry.updatedAt, 'MMM d, yyyy • h:mm a')}
                    </p>
                    {entry.content && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                        {entry.content.substring(0, 100)}
                      </p>
                    )}
                    {(entry.category || (entry.tags && entry.tags.length > 0)) && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {entry.category && (
                          <span
                            className="inline-block px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-100 rounded cursor-pointer hover:opacity-80"
                            onClick={(e) => {
                              e.stopPropagation();
                              onCategoryFilter?.(entry.category!);
                            }}
                          >
                            {entry.category}
                          </span>
                        )}
                        {entry.tags && entry.tags.length > 0 && (
                          entry.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-100 rounded cursor-pointer hover:opacity-80"
                              onClick={(e) => {
                                e.stopPropagation();
                                onTagFilter?.(tag);
                              }}
                            >
                              #{tag}
                            </span>
                          ))
                        )}
                        {entry.tags && entry.tags.length > 2 && (
                          <span className="inline-block px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                            +{entry.tags.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        window.confirm(
                          'Are you sure you want to delete this entry?'
                        )
                      ) {
                        onDeleteEntry(entry.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                  >
                    <svg
                      className="w-4 h-4 text-red-600 dark:text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
