'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import ImageUploader from './ImageUploader';
import { JournalImage } from '@/types/journal';

interface MarkdownEditorProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  images: JournalImage[];
  onAddImage: (dataUrl: string, filename: string) => void;
  onRemoveImage: (imageId: string) => void;
}

export default function MarkdownEditor({
  title,
  content,
  onTitleChange,
  onContentChange,
  images,
  onAddImage,
  onRemoveImage,
}: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);

  const handleInsertImageReference = (imageId: string) => {
    const image = images.find(img => img.id === imageId);
    if (image) {
      // Insert markdown image syntax with data URL
      const imageMarkdown = `![${image.filename}](${image.dataUrl})\n`;
      onContentChange(content + imageMarkdown);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 p-6">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Entry title..."
          className="w-full text-3xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600"
        />
        <div className="flex gap-2 mt-4">
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

      {/* Editor/Preview Area with Image Sidebar */}
      <div className="flex-1 overflow-hidden flex">
        {/* Main Editor/Preview */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {!showPreview ? (
            <textarea
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder="Start writing your thoughts..."
              className="flex-1 p-8 bg-transparent border-none outline-none resize-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 text-lg leading-relaxed"
              style={{ fontFamily: 'inherit' }}
            />
          ) : (
            <div className="flex-1 overflow-y-auto p-8">
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

        {/* Image Sidebar */}
        <div className="w-80 border-l border-gray-200 dark:border-gray-800 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <ImageUploader
            images={images}
            onImageAdd={onAddImage}
            onImageRemove={onRemoveImage}
            onCopyReference={handleInsertImageReference}
          />
        </div>
      </div>

      {/* Footer with helpful tips */}
      <div className="border-t border-gray-200 dark:border-gray-800 px-8 py-3 bg-gray-50 dark:bg-gray-900">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Supports Markdown formatting • Image attachments • Auto-saved to local storage
        </p>
      </div>
    </div>
  );
}
