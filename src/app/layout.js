import Script from 'next/script';
import './globals.css';

export const metadata = {
  title: 'Intelligen System — Autonomous Enterprise Intelligence',
  description: 'Research and analyze any enterprise with real-time web crawling, LLM synthesis, and structured intelligence reports.',
  keywords: 'company research, AI, competitor analysis, business intelligence, Stitch MCP',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script src="https://cdn.tailwindcss.com?plugins=forms"></script>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="bg-[#0e1323] text-[#dee1f9] min-h-screen antialiased selection:bg-[#528dff] selection:text-[#00275f]">
        {children}
      </body>
    </html>
  );
}
