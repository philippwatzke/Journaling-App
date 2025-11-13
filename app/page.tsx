'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import MarkdownEditor from '@/components/MarkdownEditor';
import { JournalEntry, DEFAULT_COLOR } from '@/types/journal';
import { storage } from '@/lib/storage';

export default function Home() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentContent, setCurrentContent] = useState('');
  const [currentColor, setCurrentColor] = useState(DEFAULT_COLOR);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load entries and folders on mount
  useEffect(() => {
    const loadedEntries = storage.getEntries();
    const loadedFolders = storage.getFolders();
    setEntries(loadedEntries);
    setFolders(loadedFolders);
    setIsLoaded(true);

    // Select first entry if available
    if (loadedEntries.length > 0) {
      const firstEntry = loadedEntries[0];
      setSelectedId(firstEntry.id);
      setCurrentTitle(firstEntry.title);
      setCurrentContent(firstEntry.content);
      setCurrentColor(firstEntry.color);
    }
  }, []);

  // Auto-save effect
  useEffect(() => {
    if (!isLoaded || !selectedId) return;

    const timeoutId = setTimeout(() => {
      storage.updateEntry(selectedId, {
        title: currentTitle,
        content: currentContent,
        color: currentColor,
      });

      // Update local state
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === selectedId
            ? { ...entry, title: currentTitle, content: currentContent, color: currentColor, updatedAt: new Date() }
            : entry
        )
      );
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [currentTitle, currentContent, currentColor, selectedId, isLoaded]);

  const handleNewEntry = () => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: '',
      content: '',
      color: DEFAULT_COLOR,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    storage.addEntry(newEntry);
    setEntries([newEntry, ...entries]);
    setSelectedId(newEntry.id);
    setCurrentTitle('');
    setCurrentContent('');
    setCurrentColor(DEFAULT_COLOR);
  };

  const handleSelectEntry = (id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (entry) {
      setSelectedId(id);
      setCurrentTitle(entry.title);
      setCurrentContent(entry.content);
      setCurrentColor(entry.color);
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
        setCurrentColor(nextEntry.color);
      } else {
        setSelectedId(null);
        setCurrentTitle('');
        setCurrentContent('');
        setCurrentColor(DEFAULT_COLOR);
      }
    }
  };

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        entries={entries}
        folders={folders}
        selectedId={selectedId}
        selectedFolderId={selectedFolderId}
        onSelectEntry={handleSelectEntry}
        onSelectFolder={handleSelectFolder}
        onNewEntry={handleNewEntry}
        onNewFolder={handleNewFolder}
        onDeleteEntry={handleDeleteEntry}
        onDeleteFolder={handleDeleteFolder}
        onRenameFolder={handleRenameFolder}
      />
      {selectedId ? (
        <MarkdownEditor
          title={currentTitle}
          content={currentContent}
          color={currentColor}
          onTitleChange={setCurrentTitle}
          onContentChange={setCurrentContent}
          onColorChange={handleColorChange}
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
