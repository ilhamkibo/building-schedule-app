import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import AppHeader from '@/components/layouts/app-header';
import React from 'react';

export const metadata = {
  title: 'User Guide | Building Schedule App',
  description: 'Manual book and user guide for the Building Schedule Application',
};

// Helper to extract text content from nested React children
function getChildrenText(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(getChildrenText).join('');
  if (children && typeof children === 'object' && 'props' in children) {
    const anyProps = children.props as any;
    if (anyProps && anyProps.children) {
      return getChildrenText(anyProps.children);
    }
  }
  return '';
}

// Helper to generate a URL-friendly slug/id
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export default async function UserGuidePage() {
  const filePath = path.join(process.cwd(), 'MANUAL_BOOK.md');

  let fileContent = '';
  try {
    fileContent = fs.readFileSync(filePath, 'utf8');
    // Normalize image paths for Next.js public directory
    fileContent = fileContent.replace(/\]\(\.?\/?(public\/)?images\//g, '](/images/');
  } catch (error) {
    fileContent = '# Error\n\nCould not load the manual book. Please ensure `MANUAL_BOOK.md` exists in the root directory.';
  }

  // Parse lines to generate headings list
  const headings = fileContent
    .split('\n')
    .filter((line) => line.startsWith('## ') || line.startsWith('### '))
    .map((line) => {
      const isSub = line.startsWith('### ');
      const rawText = line.replace(/^###?\s+/, '').trim();
      return {
        text: rawText,
        id: slugify(rawText),
        isSub,
      };
    });

  return (
    <div>
      <AppHeader title="User Guide" />

      <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 border-b pb-4 dark:border-slate-800 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">User Guide</h1>
              <p className="text-muted-foreground mt-2">
                Complete manual and instructions on how to use the application.
              </p>
            </div>
          </div>

          {/* PDF Viewer Access - Premium Card */}
          <div className="mb-8">
            <a
              href="/files/user-guide.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex overflow-hidden rounded-xl border border-rose-500/20 bg-linear-to-br from-rose-50/50 to-white dark:from-rose-950/10 dark:to-slate-900/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-rose-500/10 dark:hover:shadow-rose-950/20"
            >
              {/* Decorative Glow */}
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-rose-500/10 blur-xl group-hover:bg-rose-500/20 transition-all duration-300" />

              <div className="flex items-center gap-4 w-full">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 dark:text-rose-400 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>
                </div>
                <div className="space-y-1 pr-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm sm:text-base">
                      Buka PDF Buku Panduan (User Guide)
                    </h3>
                    <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-medium text-rose-600 dark:bg-rose-500/20 dark:text-rose-300">
                      PDF Dokumen
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Klik untuk membuka buku panduan dalam format PDF di tab baru. Anda dapat membaca, mencari teks, atau mengunduhnya secara offline.
                  </p>
                </div>
                <div className="ml-auto shrink-0 text-slate-400 group-hover:text-rose-500 group-hover:translate-x-1 transition-all duration-300 flex items-center gap-1.5 font-medium text-xs sm:text-sm">
                  <span className="hidden sm:inline">Buka di Tab Baru</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
                </div>
              </div>
            </a>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Sticky Table of Contents (Left Sidebar) */}
            <aside className="hidden lg:block w-64 sticky top-20 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pr-4 border-r border-border/50 shrink-0 scrollbar-thin">
              <div className="mb-4">
                <h2 className="text-xs uppercase font-bold tracking-wider text-muted-foreground/80">Daftar Isi</h2>
              </div>
              <nav className="flex flex-col gap-2">
                {headings.map((h, i) => (
                  <a
                    key={i}
                    href={`#${h.id}`}
                    className={`transition-all duration-200 hover:text-primary leading-snug ${h.isSub
                      ? "pl-4 text-[11px] text-muted-foreground hover:pl-5"
                      : "text-xs font-semibold text-slate-800 dark:text-slate-200 mt-2 border-l-2 border-transparent pl-1 hover:border-primary/50"
                      }`}
                  >
                    {h.text}
                  </a>
                ))}
              </nav>
            </aside>

            {/* Main Content Article */}
            <div className="flex-1 min-w-0 w-full">
              <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 md:p-10">
                  <article className="prose prose-slate dark:prose-invert max-w-none 
                  prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-10
                  prose-h3:text-xl prose-a:text-primary hover:prose-a:text-primary/80 
                  prose-img:rounded-xl prose-img:border prose-img:border-border
                  prose-pre:bg-muted prose-pre:text-muted-foreground prose-pre:border prose-pre:border-border/50">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        h2: ({ children, ...props }) => {
                          const text = getChildrenText(children);
                          const id = slugify(text);
                          return <h2 id={id} className="scroll-mt-20" {...props}>{children}</h2>;
                        },
                        h3: ({ children, ...props }) => {
                          const text = getChildrenText(children);
                          const id = slugify(text);
                          return <h3 id={id} className="scroll-mt-20" {...props}>{children}</h3>;
                        }
                      }}
                    >
                      {fileContent}
                    </ReactMarkdown>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
