'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { DEFAULT_COLORS } from '@/types/journal';

interface MarkdownEditorProps {
  title: string;
  content: string;
  color: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onColorChange: (color: string) => void;
}

export default function MarkdownEditor({
  title,
  content,
  color,
  onTitleChange,
  onContentChange,
  onColorChange,
}: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Entry title..."
            className="flex-1 text-3xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600"
          />
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Change entry color"
            >
              <div
                className="w-5 h-5 rounded-full border border-gray-400"
                style={{ backgroundColor: color }}
              />
              <svg
                className="w-4 h-4 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Color Picker Dropdown */}
            {showColorPicker && (
              <div className="absolute right-0 mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="grid grid-cols-4 gap-2">
                  {DEFAULT_COLORS.map((colorOption) => (
                    <button
                      key={colorOption}
                      onClick={() => {
                        onColorChange(colorOption);
                        setShowColorPicker(false);
                      }}
                      className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                        color === colorOption
                          ? 'border-gray-900 dark:border-gray-100'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      style={{ backgroundColor: colorOption }}
                      title={colorOption}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowPreview(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              !showPreview
                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Write
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showPreview
                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="flex-1 overflow-hidden">
        {!showPreview ? (
          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="Start writing your thoughts..."
            className="w-full h-full p-8 bg-transparent border-none outline-none resize-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 text-lg leading-relaxed"
            style={{ fontFamily: 'inherit' }}
          />
        ) : (
          <div className="h-full overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto">
              {content ? (
                <div className="markdown-preview prose prose-lg dark:prose-invert">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-gray-400 dark:text-gray-600 text-lg">
                  Nothing to preview yet. Start writing to see your formatted content.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer with helpful tips */}
      <div className="border-t border-gray-200 dark:border-gray-800 px-8 py-3 bg-gray-50 dark:bg-gray-900">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Supports Markdown formatting • Auto-saved to local storage
        </p>
      </div>
    </div>
  );
}
