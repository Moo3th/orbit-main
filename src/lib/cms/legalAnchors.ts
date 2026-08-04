/**
 * ترقيم «سطور» الصفحات القانونية (كل عنصر أعلى المستوى في محتوى TipTap).
 *
 * لماذا: رابط التذييل قد يفتح «سياسة موجودة والانتقال لسطر محدد». حتى يعمل ذلك
 * نحتاج معرّفاً ثابتاً (id) لكل سطر داخل الصفحة، ونحتاج أن يرى الأدمن نفس
 * الترقيم في اللوحة. لذلك يشترك الطرفان في هذا الملف: `listLegalLines` تبني
 * قائمة الاختيار في اللوحة، و`injectLegalAnchors` تحقن نفس المعرّفات في HTML
 * المعروض — فالفهرس متطابق دائماً.
 *
 * الترقيم بالفهرس (sec-1, sec-2...) وليس بمحتوى النص، لأن الصفحة ثنائية اللغة
 * والنسختان العربية والإنجليزية متوازيتان في الأقسام؛ فهرسٌ واحد يخدم الاثنتين.
 */

export const LEGAL_ANCHOR_PREFIX = 'sec-';

export interface LegalLine {
  /** معرّف السطر داخل الصفحة، مثل "sec-3". */
  anchor: string;
  /** ترتيب السطر (يبدأ من 1). */
  index: number;
  /** اسم الوسم: h2, p, ul... — يفيد في تمييز العناوين عن الفقرات. */
  tag: string;
  /** نص مختصر للعرض في اللوحة. */
  text: string;
}

interface Block {
  tag: string;
  openStart: number;
  openEnd: number;
  innerStart: number;
  innerEnd: number;
  /** معرّف مكتوب أصلاً في الوسم — نحترمه بدل حقن معرّف جديد. */
  existingId: string;
}

const ID_ATTR_RE = /\sid\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i;

function readId(openTag: string): string {
  const match = ID_ATTR_RE.exec(openTag);
  return (match?.[1] ?? match?.[2] ?? match?.[3] ?? '').trim();
}

const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

const TAG_RE = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^'">])*?)(\/?)>/g;

/**
 * يمشي على HTML ويعيد عناصر أعلى المستوى بالترتيب. محرّر TipTap يُخرج تسلسلاً
 * مسطّحاً من الكتل (h1-h6, p, ul, ol, blockquote, table...) فالمشي بعدّاد عمق
 * يكفي دون الحاجة إلى DOM (يعمل على الخادم والعميل معاً).
 */
function walkTopLevelBlocks(html: string): Block[] {
  const blocks: Block[] = [];
  let depth = 0;
  let current: Block | null = null;
  let match: RegExpExecArray | null;

  TAG_RE.lastIndex = 0;
  while ((match = TAG_RE.exec(html)) !== null) {
    const [full, slash, rawTag, , selfClose] = match;
    const tag = rawTag.toLowerCase();
    const isClosing = slash === '/';
    const isVoid = VOID_TAGS.has(tag) || selfClose === '/';

    if (isClosing) {
      if (VOID_TAGS.has(tag)) continue; // وسوم شاذة مثل </br>
      depth = Math.max(0, depth - 1);
      if (depth === 0 && current) {
        current.innerEnd = match.index;
        blocks.push(current);
        current = null;
      }
      continue;
    }

    if (depth === 0) {
      const openEnd = match.index + full.length;
      const existingId = readId(full);
      if (isVoid) {
        // عنصر مفرد في أعلى المستوى (مثل <hr> أو <img>) — سطر قائم بذاته.
        blocks.push({ tag, openStart: match.index, openEnd, innerStart: openEnd, innerEnd: openEnd, existingId });
        continue;
      }
      current = { tag, openStart: match.index, openEnd, innerStart: openEnd, innerEnd: openEnd, existingId };
      depth = 1;
    } else if (!isVoid) {
      depth += 1;
    }
  }

  // كتلة لم تُغلق (HTML ناقص) — نُغلقها على آخر النص بدل إسقاطها.
  if (current) {
    current.innerEnd = html.length;
    blocks.push(current);
  }

  return blocks;
}

const ENTITIES: Record<string, string> = {
  '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&rsquo;': '’', '&ldquo;': '“', '&rdquo;': '”',
};

function htmlToText(fragment: string): string {
  return fragment
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-zA-Z#0-9]+;/g, (entity) => ENTITIES[entity] ?? ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function truncateLine(text: string, max = 90): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

/** قائمة سطور الصفحة بالترتيب — تُستعمل في قائمة الاختيار داخل اللوحة. */
export function listLegalLines(html: string): LegalLine[] {
  const source = html || '';
  return walkTopLevelBlocks(source).map((block, i) => ({
    // العنصر الذي يحمل معرّفاً مكتوباً مسبقاً يُعرَّف به، لأن الحقن يحترمه ولا يستبدله.
    anchor: block.existingId || `${LEGAL_ANCHOR_PREFIX}${i + 1}`,
    index: i + 1,
    tag: block.tag,
    text: htmlToText(source.slice(block.innerStart, block.innerEnd)),
  }));
}

/**
 * يحقن id="sec-N" في كل عنصر أعلى المستوى ليعمل الانتقال بالـ hash.
 * لا يمسّ عنصراً يملك id بالفعل (احتراماً لأي معرّف كتبه الأدمن يدوياً).
 */
export function injectLegalAnchors(html: string): string {
  const source = html || '';
  const blocks = walkTopLevelBlocks(source);
  if (!blocks.length) return source;

  let out = '';
  let cursor = 0;

  blocks.forEach((block, i) => {
    const openTag = source.slice(block.openStart, block.openEnd);
    const withId = block.existingId
      ? openTag
      : openTag.replace(/^<([a-zA-Z][a-zA-Z0-9-]*)/, `<$1 id="${LEGAL_ANCHOR_PREFIX}${i + 1}"`);
    out += source.slice(cursor, block.openStart) + withId;
    cursor = block.openEnd;
  });

  return out + source.slice(cursor);
}
