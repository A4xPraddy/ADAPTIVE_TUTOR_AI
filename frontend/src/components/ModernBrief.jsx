import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: true, theme: 'neutral' });

export default function ModernBrief({ content }) {
  useEffect(() => {
    mermaid.contentLoaded();
  }, [content]);

  return (
    <div className="markdown-content">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            if (!inline && match && match[1] === 'mermaid') {
              return <div className="mermaid">{String(children)}</div>;
            }
            return <code className={className} {...props}>{children}</code>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}