export interface JournalImage {
  id: string;
  dataUrl: string;
  filename: string;
  uploadedAt: Date;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  images: JournalImage[];
  createdAt: Date;
  updatedAt: Date;
}
