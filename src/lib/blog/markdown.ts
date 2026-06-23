import { marked } from 'marked';

/**
 * Markdown → HTML for blog article bodies.
 *
 * The source articles are authored in GitHub-flavoured markdown (headings,
 * GFM tables, blockquotes, lists, bold/links). We render them to HTML once
 * (server-side) and inject the result into a Tailwind Typography (`prose`)
 * container, so every element is styled without per-element components.
 *
 * Content is admin-authored (trusted), consistent with the existing blog
 * pipeline that already renders stored HTML via dangerouslySetInnerHTML.
 */

marked.setOptions({
  gfm: true,
  breaks: false,
});

/**
 * Wide tables must never cause horizontal page scroll on mobile (iPhone/Android).
 * We wrap each rendered `<table>` in an overflow container so the table itself
 * scrolls instead of the page. Done as string post-processing to stay robust
 * across marked renderer-API changes.
 */
const wrapTablesForMobile = (html: string): string =>
  html
    .replace(/<table>/g, '<div class="blog-table-scroll overflow-x-auto"><table>')
    .replace(/<\/table>/g, '</table></div>');

/** Drop HTML comment blocks (e.g. the SEO header / technical appendix shipped inside the .md). */
const stripHtmlComments = (md: string): string => md.replace(/<!--[\s\S]*?-->/g, '');

export function renderMarkdown(markdown?: string | null): string {
  if (!markdown || !markdown.trim()) return '';
  const cleaned = stripHtmlComments(markdown);
  const html = marked.parse(cleaned, { async: false }) as string;
  return wrapTablesForMobile(html);
}

/**
 * Resolve a post body to HTML regardless of how it is stored.
 * `markdown` bodies are converted; `html` bodies pass through unchanged.
 */
export function resolveContentHtml(
  content: string | undefined | null,
  format: 'html' | 'markdown' | undefined
): string {
  if (!content) return '';
  return format === 'markdown' ? renderMarkdown(content) : content;
}
