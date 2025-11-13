export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  color: string; // Hex color code (e.g., '#FF6B6B')
  createdAt: Date;
  updatedAt: Date;
}

export const DEFAULT_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#FFA07A', // Light Salmon
  '#98D8C8', // Mint
  '#F7DC6F', // Yellow
  '#BB8FCE', // Purple
  '#85C1E2', // Sky Blue
];

export const DEFAULT_COLOR = '#FF6B6B';
