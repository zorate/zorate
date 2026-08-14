const { marked } = require('marked');
const DOMPurify = require('isomorphic-dompurify');

// Custom renderer
const renderer = new marked.Renderer();

renderer.code = function({ text, lang }) {
  const language = lang || 'text';
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  return `<pre class="code-block" data-lang="${language}"><code class="language-${language}">${escaped}</code></pre>`;
};

renderer.blockquote = function({ text }) {
  return `<blockquote class="post-callout">${text}</blockquote>`;
};

renderer.image = function({ href, title, text }) {
  return `<figure class="post-figure">
    <img src="${href}" alt="${text || ''}" loading="lazy">
    ${title ? `<figcaption>${title}</figcaption>` : ''}
  </figure>`;
};

marked.use({
  renderer,
  gfm: true,
  breaks: false,
});

function renderMarkdown(content) {
  if (!content) return '';
  const raw = marked.parse(content);
  return DOMPurify.sanitize(raw, {
    ALLOWED_TAGS: [
      'h1','h2','h3','h4','h5','h6',
      'p','ul','ol','li','blockquote',
      'pre','code','em','strong','a','del',
      'img','figure','figcaption',
      'table','thead','tbody','tr','th','td',
      'hr','br','div','span',
    ],
    ALLOWED_ATTR: ['href','src','alt','title','class','id','target','rel','loading','data-lang'],
    FORCE_BODY: false,
  });
}

function extractToc(content) {
  if (!content) return [];
  const headings = [];
  const regex = /^(#{1,3})\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '');
    headings.push({ level, text, id });
  }
  return headings;
}

module.exports = { renderMarkdown, extractToc };