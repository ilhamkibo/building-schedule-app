import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import AppHeader from '@/components/layouts/app-header';

export const metadata = {
  title: 'User Guide | Building Schedule App',
  description: 'Manual book and user guide for the Building Schedule Application',
};

export default async function UserGuidePage() {
  const filePath = path.join(process.cwd(), 'MANUAL_BOOK.md');

  let fileContent = '';
  try {
    fileContent = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    fileContent = '# Error\n\nCould not load the manual book. Please ensure `MANUAL_BOOK.md` exists in the root directory.';
  }

  return (
    <div>
      <AppHeader title="User Guide" />

      <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">User Guide</h1>
            <p className="text-muted-foreground mt-2">
              Complete manual and instructions on how to use the application.
            </p>
          </div>

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
                >
                  {fileContent}
                </ReactMarkdown>
              </article>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
