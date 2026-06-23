/**
 * Parser for the CORBIT long-form article template (`NN-topic.md`).
 *
 * Those files ship three parts:
 *   1. A leading HTML comment with the SEO package (title tag, meta description,
 *      slug, focus + secondary keywords).
 *   2. The Arabic article body in GitHub-flavoured markdown (headings, GFM
 *      tables, blockquotes, a "## الأسئلة الشائعة" section, conclusion).
 *   3. A trailing HTML comment "technical appendix" with JSON-LD (Article +
 *      FAQPage), internal-link suggestions and image alt-text suggestions.
 *
 * This converts that single pasted document into structured draft fields so an
 * admin can review and publish it. It is intentionally tolerant: a plain body
 * with no comment blocks still imports (title from the first H1).
 */

export interface ImportedFaqItem {
  question: string;
  answer: string;
}

export interface ImportedArticle {
  titleAr: string;
  descriptionAr: string;
  slug: string;
  contentAr: string;
  category: string;
  tags: string[];
  faq: ImportedFaqItem[];
  imageAltAr: string;
  seo: {
    titleAr: string;
    descriptionAr: string;
    keywordsAr: string;
    canonical: string;
    ogImage: string;
  };
}

const firstComment = (raw: string): string => {
  const match = raw.match(/<!--([\s\S]*?)-->/);
  return match ? match[1] : '';
};

const lastComment = (raw: string): string => {
  const matches = [...raw.matchAll(/<!--([\s\S]*?)-->/g)];
  return matches.length ? matches[matches.length - 1][1] : '';
};

const stripAllComments = (raw: string): string => raw.replace(/<!--[\s\S]*?-->/g, '').trim();

/** Value that sits on the line *after* a label line containing `keyword`. */
const valueAfterLabelLine = (block: string, keyword: string): string => {
  const lines = block.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].includes(keyword)) {
      for (let j = i + 1; j < lines.length; j += 1) {
        const candidate = lines[j].trim();
        if (candidate && !candidate.includes('====') && !candidate.endsWith(':')) {
          return candidate;
        }
      }
    }
  }
  return '';
};

/** Value that sits on the *same* line after the first `:` of a label line. */
const valueOnLabelLine = (block: string, keyword: string): string => {
  const lines = block.split(/\r?\n/);
  for (const line of lines) {
    if (line.includes(keyword)) {
      const idx = line.indexOf(':');
      if (idx >= 0) return line.slice(idx + 1).trim();
    }
  }
  return '';
};

const splitKeywords = (value: string): string[] =>
  value
    .split(/[،,]/)
    .map((part) => part.trim())
    .filter(Boolean);

/** Parse the visible "## الأسئلة الشائعة" section: bold question lines, plain-text answers. */
const parseFaqSection = (faqSection: string): ImportedFaqItem[] => {
  const items: ImportedFaqItem[] = [];
  const lines = faqSection.split(/\r?\n/);
  let currentQuestion = '';
  let answerLines: string[] = [];

  const flush = () => {
    const answer = answerLines.join(' ').replace(/\s+/g, ' ').trim();
    if (currentQuestion && answer) items.push({ question: currentQuestion, answer });
    currentQuestion = '';
    answerLines = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const boldQ = line.match(/^\*\*(.+?)\*\*$/);
    if (boldQ) {
      flush();
      currentQuestion = boldQ[1].trim();
    } else if (line.startsWith('#')) {
      flush();
    } else if (currentQuestion && line) {
      answerLines.push(line);
    } else if (!line && currentQuestion && answerLines.length) {
      flush();
    }
  }
  flush();
  return items;
};

/** Fallback: pull FAQ from the FAQPage JSON-LD in the technical appendix. */
const parseFaqFromJsonLd = (appendix: string): ImportedFaqItem[] => {
  const scriptMatch = appendix.match(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/i);
  if (!scriptMatch) return [];
  try {
    const data = JSON.parse(scriptMatch[1].trim());
    const graph: unknown[] = Array.isArray(data?.['@graph']) ? data['@graph'] : [data];
    const faqPage = graph.find((node) => (node as { '@type'?: string })?.['@type'] === 'FAQPage') as
      | { mainEntity?: { name?: string; acceptedAnswer?: { text?: string } }[] }
      | undefined;
    if (!faqPage?.mainEntity) return [];
    return faqPage.mainEntity
      .map((q) => ({ question: q?.name?.trim() || '', answer: q?.acceptedAnswer?.text?.trim() || '' }))
      .filter((item) => item.question && item.answer);
  } catch {
    return [];
  }
};

const canonicalFromJsonLd = (appendix: string): string => {
  const scriptMatch = appendix.match(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/i);
  if (!scriptMatch) return '';
  try {
    const data = JSON.parse(scriptMatch[1].trim());
    const graph: unknown[] = Array.isArray(data?.['@graph']) ? data['@graph'] : [data];
    const article = graph.find((node) => (node as { '@type'?: string })?.['@type'] === 'Article') as
      | { mainEntityOfPage?: string }
      | undefined;
    return typeof article?.mainEntityOfPage === 'string' ? article.mainEntityOfPage : '';
  } catch {
    return '';
  }
};

/** Image alt suggestion: line in the appendix after "النص البديل" / "الصورة الرئيسية". */
const altFromAppendix = (appendix: string): string => {
  const line = appendix
    .split(/\r?\n/)
    .find((l) => l.includes('الصورة الرئيسية'));
  if (!line) return '';
  const quoted = line.match(/[“"«](.+?)[”"»]/);
  return quoted ? quoted[1].trim() : '';
};

export function parseArticleMarkdown(raw: string): ImportedArticle {
  const seoBlock = firstComment(raw);
  const appendix = lastComment(raw);
  let body = stripAllComments(raw);

  // First H1 → Arabic title; remove from body so the page doesn't render two H1s.
  const h1Match = body.match(/^#\s+(.+)$/m);
  const titleAr = h1Match ? h1Match[1].trim() : '';
  if (h1Match) {
    body = body.replace(h1Match[0], '').trim();
  }

  // Extract and remove the visible FAQ section (rendered via the structured FAQ field instead).
  let faq: ImportedFaqItem[] = [];
  const faqHeading = body.match(/^##\s+.*الأسئلة\s+الشائعة.*$/m);
  if (faqHeading) {
    const start = body.indexOf(faqHeading[0]);
    const rest = body.slice(start + faqHeading[0].length);
    const nextHeading = rest.search(/^##\s+/m);
    const faqSection = nextHeading === -1 ? rest : rest.slice(0, nextHeading);
    faq = parseFaqSection(faqSection);
    const endIndex = nextHeading === -1 ? body.length : start + faqHeading[0].length + nextHeading;
    body = (body.slice(0, start) + body.slice(endIndex)).replace(/\n{3,}/g, '\n\n').trim();
  }
  if (!faq.length) faq = parseFaqFromJsonLd(appendix);

  const seoTitle = valueAfterLabelLine(seoBlock, 'Title Tag');
  const metaDescription = valueAfterLabelLine(seoBlock, 'Meta Description');
  const slug = valueAfterLabelLine(seoBlock, 'Slug');
  const focusKeyword = valueOnLabelLine(seoBlock, 'الكلمة المحورية');
  const secondaryKeywords = valueOnLabelLine(seoBlock, 'الكلمات الثانوية');
  const keywords = [focusKeyword, ...splitKeywords(secondaryKeywords)].filter(Boolean);

  const descriptionAr = metaDescription || '';

  return {
    titleAr,
    descriptionAr,
    slug,
    contentAr: body,
    category: 'WhatsApp',
    tags: keywords,
    faq,
    imageAltAr: altFromAppendix(appendix),
    seo: {
      titleAr: seoTitle,
      descriptionAr: metaDescription,
      keywordsAr: keywords.join('، '),
      canonical: canonicalFromJsonLd(appendix),
      ogImage: '',
    },
  };
}
