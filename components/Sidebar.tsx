'use client';

import { JournalEntry, Folder } from '@/types/journal';
import { format } from 'date-fns';
import { useState } from 'react';

interface SidebarProps {
  entries: JournalEntry[];
  folders: Folder[];
  selectedId: string | null;
  selectedFolderId: string | null;
  onSelectEntry: (id: string) => void;
  onSelectFolder: (id: string | null) => void;
  onNewEntry: () => void;
  onNewFolder: () => void;
  onDeleteEntry: (id: string) => void;
  onDeleteFolder: (id: string) => void;
  onRenameFolder: (id: string, name: string) => void;
}

export default function Sidebar({
  entries,
  folders,
  selectedId,
  selectedFolderId,
  onSelectEntry,
  onSelectFolder,
  onNewEntry,
  onNewFolder,
  onDeleteEntry,
  onDeleteFolder,
  onRenameFolder,
}: SidebarProps) {
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null);
  const [renamingValue, setRenamingValue] = useState('');

  const currentEntries = selectedFolderId
    ? entries.filter(e => e.folderId === selectedFolderId)
    : entries.filter(e => !e.folderId);

  const handleRenameFolder = (id: string, name: string) => {
    onRenameFolder(id, name);
    setRenamingFolderId(null);
  };
  return (
    <div className="w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Journal
        </h1>
        <div className="flex gap-2">
          <button
            onClick={onNewEntry}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-150 flex items-center justify-center gap-2"
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
          <button
            onClick={onNewFolder}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-150 flex items-center justify-center gap-2"
            title="Create a new folder"
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
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 3h8l2 2h8a2 2 0 012 2v12a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Folders and Entries List */}
      <div className="flex-1 overflow-y-auto">
        {folders.length === 0 && entries.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <p className="text-sm">No entries or folders yet.</p>
            <p className="text-sm mt-1">Create your first journal entry or folder!</p>
          </div>
        ) : (
          <div className="p-3">
            {/* Root entries section */}
            {currentEntries.length === 0 && selectedFolderId === null && entries.filter(e => !e.folderId).length === 0 ? null : (
              <>
                {selectedFolderId === null && (
                  <div className="px-2 py-2 mb-2">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      All Entries
                    </p>
                  </div>
                )}
                {currentEntries.map((entry) => (
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
              </>
            )}

            {/* Folders section */}
            {folders.length > 0 && selectedFolderId === null && (
              <>
                <div className="px-2 py-2 mt-4 mb-2">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Folders
                  </p>
                </div>
                {folders.map((folder) => {
                  const folderEntryCount = entries.filter(e => e.folderId === folder.id).length;
                  return (
                    <div
                      key={folder.id}
                      className={`group relative mb-2 p-4 rounded-lg cursor-pointer transition-all duration-150 ${
                        selectedFolderId === folder.id
                          ? 'bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-500'
                          : 'bg-amber-50 dark:bg-amber-900/20 border-2 border-transparent hover:border-amber-300 dark:hover:border-amber-700'
                      }`}
                      onClick={() => onSelectFolder(folder.id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          {renamingFolderId === folder.id ? (
                            <input
                              autoFocus
                              type="text"
                              value={renamingValue}
                              onChange={(e) => setRenamingValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleRenameFolder(folder.id, renamingValue || 'Untitled Folder');
                                } else if (e.key === 'Escape') {
                                  setRenamingFolderId(null);
                                }
                              }}
                              onBlur={() => {
                                if (renamingValue.trim()) {
                                  handleRenameFolder(folder.id, renamingValue);
                                } else {
                                  setRenamingFolderId(null);
                                }
                              }}
                              className="w-full px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded border border-amber-500"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <>
                              <div className="flex items-center gap-2">
                                <svg
                                  className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M3 3h8l2 2h8a2 2 0 012 2v12a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2z" />
                                </svg>
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                                  {folder.name}
                                </h3>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 ml-7 mt-1">
                                {folderEntryCount} {folderEntryCount === 1 ? 'entry' : 'entries'}
                              </p>
                            </>
                          )}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setRenamingFolderId(folder.id);
                              setRenamingValue(folder.name);
                            }}
                            className="p-1 hover:bg-amber-200 dark:hover:bg-amber-900/50 rounded"
                            title="Rename folder"
                          >
                            <svg
                              className="w-4 h-4 text-amber-600 dark:text-amber-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (
                                window.confirm(
                                  `Delete folder "${folder.name}"? Entries in this folder will be moved to the root.`
                                )
                              ) {
                                onDeleteFolder(folder.id);
                                if (selectedFolderId === folder.id) {
                                  onSelectFolder(null);
                                }
                              }
                            }}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                            title="Delete folder"
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
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
