export interface Folder {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  color?: string; // Optional color for folders
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  folderId?: string; // Optional - entries without folderId go to root
  createdAt: Date;
  updatedAt: Date;
}
