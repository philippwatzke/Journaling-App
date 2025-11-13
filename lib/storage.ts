import { JournalEntry } from '@/types/journal';

const STORAGE_KEY = 'journal-entries';

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
        images: (entry.images || []).map((image: any) => ({
          ...image,
          uploadedAt: new Date(image.uploadedAt),
        })),
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

  addImage: (entryId: string, dataUrl: string, filename: string): void => {
    const entries = storage.getEntries();
    const entry = entries.find(e => e.id === entryId);

    if (entry) {
      if (!entry.images) {
        entry.images = [];
      }
      entry.images.push({
        id: Date.now().toString(),
        dataUrl,
        filename,
        uploadedAt: new Date(),
      });
      storage.saveEntries(entries);
    }
  },

  removeImage: (entryId: string, imageId: string): void => {
    const entries = storage.getEntries();
    const entry = entries.find(e => e.id === entryId);

    if (entry && entry.images) {
      entry.images = entry.images.filter(img => img.id !== imageId);
      storage.saveEntries(entries);
    }
  },
};
