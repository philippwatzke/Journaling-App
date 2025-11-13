import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Journal - Your Personal Writing Space',
  description: 'A beautiful, clean, and simple journaling app with markdown support',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
