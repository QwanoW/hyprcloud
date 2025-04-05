import { Head } from '@inertiajs/react';
import Homelayout from '@/layouts/home/layout';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import { Components } from 'react-markdown';

// Определение типа для страницы
interface Page {
  title: string;
  content: string;
  last_updated: string | null;
}

// Определение типа пропсов
interface ShowProps {
  page: Page;
}

export default function Show({ page }: ShowProps) {
  // Parse the last_updated date
  const formattedDate = page.last_updated
    ? format(new Date(page.last_updated), 'MMMM d, yyyy')
    : format(new Date(), 'MMMM d, yyyy');

  // Custom components for markdown rendering
  const components: Components = {
    h1: ({ node, ...props }) => (
      <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900" {...props} />
    ),
    h2: ({ node, ...props }) => (
      <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800" {...props} />
    ),
    h3: ({ node, ...props }) => (
      <h3 className="text-xl font-medium mt-4 mb-2 text-gray-700" {...props} />
    ),
    p: ({ node, ...props }) => (
      <p className="my-3 text-gray-600 leading-relaxed" {...props} />
    ),
    ul: ({ node, ...props }) => (
      <ul className="list-disc pl-6 my-3 text-gray-600" {...props} />
    ),
    li: ({ node, ...props }) => (
      <li className="mb-1" {...props} />
    ),
    a: ({ node, ...props }) => (
      <a className="text-blue-600 hover:text-blue-800 underline" {...props} />
    ),
  };

  // Replace Last Updated date in the content
  const contentWithUpdatedDate = page.content.replace(
    /Last Updated: .*$/m,
    `Last Updated: ${formattedDate}`
  );

  return (
    <Homelayout>
      <Head title={page.title} />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <ReactMarkdown
            components={components}
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
          >
            {contentWithUpdatedDate}
          </ReactMarkdown>
        </div>
      </div>
    </Homelayout>
  );
}