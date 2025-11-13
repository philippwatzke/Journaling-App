import { JournalEntry, Folder } from '@/types/journal';

const STORAGE_KEY = 'journal-entries';
const FOLDERS_KEY = 'journal-folders';

export const storage = {
  getEntries: (): JournalEntry[] => {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];

      const entries = JSON.parse(data);
      return entries.map((entry: any) => ({
        ...entry,
        createdAt: new Date(entry.createdAt),
        updatedAt: new Date(entry.updatedAt),
      }));
    } catch (error) {
      console.error('Error loading entries:', error);
      return [];
    }
  },

  saveEntries: (entries: JournalEntry[]): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving entries:', error);
    }
  },

  addEntry: (entry: JournalEntry): void => {
    const entries = storage.getEntries();
    entries.unshift(entry);
    storage.saveEntries(entries);
  },

  updateEntry: (id: string, updates: Partial<JournalEntry>): void => {
    const entries = storage.getEntries();
    const index = entries.findIndex(e => e.id === id);

    if (index !== -1) {
      entries[index] = {
        ...entries[index],
        ...updates,
        updatedAt: new Date(),
      };
      storage.saveEntries(entries);
    }
  },

  deleteEntry: (id: string): void => {
    const entries = storage.getEntries();
    const filtered = entries.filter(e => e.id !== id);
    storage.saveEntries(filtered);
  },

  // Folder operations
  getFolders: (): Folder[] => {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(FOLDERS_KEY);
      if (!data) return [];

      const folders = JSON.parse(data);
      return folders.map((folder: any) => ({
        ...folder,
        createdAt: new Date(folder.createdAt),
        updatedAt: new Date(folder.updatedAt),
      }));
    } catch (error) {
      console.error('Error loading folders:', error);
      return [];
    }
  },

  saveFolders: (folders: Folder[]): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
    } catch (error) {
      console.error('Error saving folders:', error);
    }
  },

  addFolder: (folder: Folder): void => {
    const folders = storage.getFolders();
    folders.unshift(folder);
    storage.saveFolders(folders);
  },

  updateFolder: (id: string, updates: Partial<Folder>): void => {
    const folders = storage.getFolders();
    const index = folders.findIndex(f => f.id === id);

    if (index !== -1) {
      folders[index] = {
        ...folders[index],
        ...updates,
        updatedAt: new Date(),
      };
      storage.saveFolders(folders);
    }
  },

  deleteFolder: (id: string): void => {
    const folders = storage.getFolders();
    const filtered = folders.filter(f => f.id !== id);
    storage.saveFolders(filtered);

    // Move all entries in this folder to root (no folderId)
    const entries = storage.getEntries();
    const updated = entries.map(e =>
      e.folderId === id ? { ...e, folderId: undefined } : e
    );
    storage.saveEntries(updated);
  },

  moveEntryToFolder: (entryId: string, folderId?: string): void => {
    const entries = storage.getEntries();
    const index = entries.findIndex(e => e.id === entryId);

    if (index !== -1) {
      entries[index] = {
        ...entries[index],
        folderId,
        updatedAt: new Date(),
      };
      storage.saveEntries(entries);
    }
  },

  getEntriesByFolder: (folderId?: string): JournalEntry[] => {
    const entries = storage.getEntries();
    if (folderId === undefined) {
      // Get entries in root (no folderId)
      return entries.filter(e => !e.folderId);
    }
    return entries.filter(e => e.folderId === folderId);
  },
};
