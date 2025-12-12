'use client'
import DOMPurify from 'dompurify';

interface SafeHtmlContentProps {
    html: string;
    className?: string;
  }
  
  export function SafeHtmlContent({ html, className }: SafeHtmlContentProps) {
    const sanitizedHtml = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'a'],
      ALLOWED_ATTR: ['href', 'target', 'rel']
    });
  
    return (
      <div 
        className={`prose max-w-none ${className || ''}`}
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    );
  }