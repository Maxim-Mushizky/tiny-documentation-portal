import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';

export const MarkdownRenderer = ({ content }) => {
    const components = {
        img: ({ node, ...props }) => {
            const imgSrc = props.src.startsWith('http')
                ? props.src
                : `http://localhost:3001${props.src}`;

            return (
                <img
                    {...props}
                    src={imgSrc}
                    className="max-w-full h-auto rounded-lg shadow-md"
                    loading="lazy"
                    alt={props.alt || ''}
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                    }}
                />
            );
        }
    };

    return (
        <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-blue-600 hover:prose-a:text-blue-500">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeRaw, rehypeKatex, rehypeHighlight]}
                components={components}
            >
                {content || 'Loading...'}
            </ReactMarkdown>
        </div>
    );
};