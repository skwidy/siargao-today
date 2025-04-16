import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Siargao Today',
  description: 'Your community hub for events and surf instructors in Siargao',
};

// These are the attributes that Grammarly injects
const grammarlyAttributes = {
  'data-new-gr-c-s-check-loaded': 'true',
  'data-gr-ext-installed': 'true',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="bg-gray-50" suppressHydrationWarning>
        <body className={inter.className} suppressHydrationWarning {...grammarlyAttributes}>
          <main className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
