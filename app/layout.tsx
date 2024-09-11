import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CvSU-Drive',
  description: 'Record System for CvSU',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={``}>{children}</body>
    </html>
  );
}
