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
          <div className="mb-8 border-b pb-4 dark:border-slate-800">
            <h1 className="text-3xl font-bold tracking-tight">User Guide</h1>
            <p className="text-muted-foreground mt-2">
              Complete manual and instructions on how to use the application.
            </p>
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
                    className={`transition-all duration-200 hover:text-primary leading-snug ${
                      h.isSub
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
