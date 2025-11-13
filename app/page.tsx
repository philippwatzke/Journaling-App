'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import MarkdownEditor from '@/components/MarkdownEditor';
import { JournalEntry } from '@/types/journal';
import { storage } from '@/lib/storage';

export default function Home() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentContent, setCurrentContent] = useState('');
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string | undefined>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);

  // Load entries on mount
  useEffect(() => {
    const loadedEntries = storage.getEntries();
    setEntries(loadedEntries);
    setIsLoaded(true);

    // Select first entry if available
    if (loadedEntries.length > 0) {
      const firstEntry = loadedEntries[0];
      setSelectedId(firstEntry.id);
      setCurrentTitle(firstEntry.title);
      setCurrentContent(firstEntry.content);
      setCurrentTags(firstEntry.tags || []);
      setCurrentCategory(firstEntry.category);
    }
  }, []);

  // Auto-save effect
  useEffect(() => {
    if (!isLoaded || !selectedId) return;

    const timeoutId = setTimeout(() => {
      storage.updateEntry(selectedId, {
        title: currentTitle,
        content: currentContent,
        tags: currentTags,
        category: currentCategory,
      });

      // Update local state
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === selectedId
            ? { ...entry, title: currentTitle, content: currentContent, tags: currentTags, category: currentCategory, updatedAt: new Date() }
            : entry
        )
      );
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [currentTitle, currentContent, currentTags, currentCategory, selectedId, isLoaded]);

  const handleNewEntry = () => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: '',
      content: '',
      tags: [],
      category: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    storage.addEntry(newEntry);
    setEntries([newEntry, ...entries]);
    setSelectedId(newEntry.id);
    setCurrentTitle('');
    setCurrentContent('');
    setCurrentTags([]);
    setCurrentCategory(undefined);
  };

  const handleSelectEntry = (id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (entry) {
      setSelectedId(id);
      setCurrentTitle(entry.title);
      setCurrentContent(entry.content);
      setCurrentTags(entry.tags || []);
      setCurrentCategory(entry.category);
    }
  };

  const handleDeleteEntry = (id: string) => {
    storage.deleteEntry(id);
    const filtered = entries.filter((e) => e.id !== id);
    setEntries(filtered);

    // If deleted entry was selected, select another one
    if (selectedId === id) {
      if (filtered.length > 0) {
        const nextEntry = filtered[0];
        setSelectedId(nextEntry.id);
        setCurrentTitle(nextEntry.title);
        setCurrentContent(nextEntry.content);
        setCurrentTags(nextEntry.tags || []);
        setCurrentCategory(nextEntry.category);
      } else {
        setSelectedId(null);
        setCurrentTitle('');
        setCurrentContent('');
        setCurrentTags([]);
        setCurrentCategory(undefined);
      }
    }
  };

  // Filter entries based on selected category and tag
  const filteredEntries = entries.filter((entry) => {
    if (selectedCategoryFilter && entry.category !== selectedCategoryFilter) {
      return false;
    }
    if (selectedTagFilter && (!entry.tags || !entry.tags.includes(selectedTagFilter))) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        entries={filteredEntries}
        selectedId={selectedId}
        onSelectEntry={handleSelectEntry}
        onNewEntry={handleNewEntry}
        onDeleteEntry={handleDeleteEntry}
        selectedCategory={selectedCategoryFilter}
        selectedTag={selectedTagFilter}
        onCategoryFilter={setSelectedCategoryFilter}
        onTagFilter={setSelectedTagFilter}
      />
      {selectedId ? (
        <MarkdownEditor
          title={currentTitle}
          content={currentContent}
          tags={currentTags}
          category={currentCategory}
          onTitleChange={setCurrentTitle}
          onContentChange={setCurrentContent}
          onTagsChange={setCurrentTags}
          onCategoryChange={setCurrentCategory}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-950">
          <div className="text-center">
            <svg
              className="w-24 h-24 mx-auto mb-4 text-gray-300 dark:text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Entry Selected
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Select an entry from the sidebar or create a new one
            </p>
            <button
              onClick={handleNewEntry}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-150"
            >
              Create New Entry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
