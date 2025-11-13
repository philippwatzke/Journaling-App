# Journal App

A beautiful, clean, and simple journaling application built with Next.js, TypeScript, and Tailwind CSS v3. Features a markdown editor with live preview and local storage for persisting your journal entries.

## Features

- **Clean, Beautiful UI**: Minimalist design focused on your writing
- **Markdown Support**: Write with markdown and see a live preview
- **Local Storage**: All entries are saved locally in your browser
- **Auto-save**: Your work is automatically saved as you type
- **Dark Mode Support**: Automatically adapts to your system preferences
- **Entry Management**: Create, edit, and delete journal entries
- **Organized Sidebar**: View all your entries sorted by most recent

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd journal-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Creating a New Entry
- Click the "New Entry" button in the sidebar
- Start writing your thoughts in the editor
- Give your entry a title at the top
- Your work is automatically saved

### Editing an Entry
- Click on any entry in the sidebar to open it
- Make your changes in the editor
- Changes are auto-saved after you stop typing

### Deleting an Entry
- Hover over an entry in the sidebar
- Click the trash icon that appears
- Confirm the deletion

### Using Markdown
- Switch between "Write" and "Preview" modes using the tabs
- Use standard markdown syntax:
  - `# Heading 1`, `## Heading 2`, etc.
  - `**bold**` and `*italic*`
  - `- bullet points`
  - `` `code` `` and ``` code blocks ```
  - `> blockquotes`
  - And more!

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS v3**: Utility-first CSS framework
- **React Markdown**: Markdown rendering
- **date-fns**: Date formatting
- **Local Storage API**: Browser-based data persistence

## Project Structure

```
journal-app/
├── app/
│   ├── globals.css      # Global styles and Tailwind
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main page component
├── components/
│   ├── Sidebar.tsx      # Sidebar with entry list
│   └── MarkdownEditor.tsx # Editor with preview
├── lib/
│   └── storage.ts       # Local storage utilities
├── types/
│   └── journal.ts       # TypeScript types
└── package.json
```

## Building for Production

```bash
npm run build
npm run start
# or
yarn build
yarn start
```

## Notes

- All data is stored in your browser's local storage
- Clearing browser data will delete all journal entries
- For production use, consider implementing a backend storage solution

## Future Enhancements

- Export entries to Markdown/PDF
- Search functionality
- Tags and categories
- Cloud sync
- Multiple notebooks
- Rich text toolbar
- Image support

## License

This project is open source and available under the MIT License.
