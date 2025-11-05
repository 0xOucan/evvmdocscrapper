import { CheerioCrawler, RequestQueue } from 'crawlee';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import fs from 'fs';
import path from 'path';

const EIP_191_URL = 'https://eips.ethereum.org/EIPS/eip-191';

// Terminal colors
const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function showBanner() {
  console.log(colors.cyan);
  console.log(`
░▒▓████████▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓██████████████▓▒░
░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
░▒▓█▓▒░       ░▒▓█▓▒▒▓█▓▒░ ░▒▓█▓▒▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
░▒▓██████▓▒░  ░▒▓█▓▒▒▓█▓▒░ ░▒▓█▓▒▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
░▒▓█▓▒░        ░▒▓█▓▓█▓▒░   ░▒▓█▓▓█▓▒░ ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
░▒▓█▓▒░        ░▒▓█▓▓█▓▒░   ░▒▓█▓▓█▓▒░ ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
░▒▓████████▓▒░  ░▒▓██▓▒░     ░▒▓██▓▒░  ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
  `);
  console.log(colors.blue);
  console.log(`
   ███████╗██╗██████╗       ██╗ ██╗ ██╗
   ██╔════╝██║██╔══██╗     ███║ ██║ ██║
   █████╗  ██║██████╔╝     ╚██║ ╚═╝ ╚═╝
   ██╔══╝  ██║██╔═══╝       ██║ ██╗ ██╗
   ███████╗██║██║          ██╔╝ ╚═╝ ╚═╝
   ╚══════╝╚═╝╚═╝          ╚═╝
  `);
  console.log(colors.reset);
  console.log(colors.green + '  📝 Adding EIP-191 to llms-full.txt' + colors.reset);
  console.log(colors.yellow + '  Ethereum Signed Data Standard' + colors.reset);
  console.log('');
}

// Markdown converter (keeps code fences)
const turndown = new TurndownService({ codeBlockStyle: 'fenced' });

// Extract article-like content and convert to Markdown blocks
function extractPageMarkdown(html: string) {
  const $ = cheerio.load(html);

  // Try common docs containers; fallback to body
  const $root =
    $('article, main, .content, .page-content, .theme-doc-markdown, .markdown').first().length
      ? $('article, main, .content, .page-content, .theme-doc-markdown, .markdown').first()
      : $('body');

  // Remove navigation breadcrumbs and other unwanted elements
  $root.find('nav, .breadcrumbs, .pagination, .theme-doc-breadcrumbs, header, footer').remove();

  const title =
    $root.find('h1').first().text().trim() ||
    $('h1').first().text().trim() ||
    $('title').text().trim();

  // Clean title from emojis and extra whitespace (including emoji variation selectors)
  const cleanTitle = title
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
    .replace(/[\uFE00-\uFE0F]/g, '') // Variation selectors
    .replace(/📄️?|🗃️?|📁️?/g, '')
    .trim();

  // Track if we've seen the first H1 (to skip it if it matches the title)
  let firstH1Seen = false;

  // Keep headings, paragraphs, lists, code, tables
  const blocks: string[] = [];
  $root.find('h1, h2, h3, h4, h5, h6, p, ul, ol, pre, table, blockquote').each((_, el) => {
    const tag = el.tagName?.toLowerCase();
    const $el = $(el);

    if (/^h[1-6]$/.test(tag!)) {
      const level = Number(tag!.slice(1));
      let text = $el.text().trim();

      // Remove emojis from headings (including emoji variation selectors)
      text = text
        .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
        .replace(/[\uFE00-\uFE0F]/g, '') // Variation selectors
        .replace(/📄️?|🗃️?|📁️?/g, '')
        .trim();

      // Skip first H1 if it matches the title (avoid duplication)
      if (tag === 'h1' && !firstH1Seen) {
        firstH1Seen = true;
        if (text === cleanTitle) {
          return; // Skip this heading
        }
      }

      // Skip headings that are just "X items" metadata
      if (/^\d+\s+items?$/i.test(text)) {
        return;
      }

      if (text) blocks.push(`${'#'.repeat(level)} ${text}`);
    } else if (tag === 'p') {
      const text = $el.text().trim();
      // Skip paragraphs that are just "X items" metadata
      if (text && !/^\d+\s+items?$/i.test(text)) {
        blocks.push(text);
      }
    } else if (tag === 'ul' || tag === 'ol') {
      const html = $.html($el);
      // Check if this is a breadcrumb or navigation list
      const hasBreadcrumbClass = $el.hasClass('breadcrumbs') ||
                                  $el.hasClass('pagination') ||
                                  $el.parent().is('nav');

      // Skip if it looks like navigation
      const items = $el.find('li');
      const allItemsAreLinks = items.length > 0 && items.toArray().every(li => {
        const $li = $(li);
        const text = $li.text().trim();
        return text.length < 50 && ($li.find('a').length > 0 || text === '');
      });

      if (!hasBreadcrumbClass && !allItemsAreLinks) {
        blocks.push(turndown.turndown(html));
      }
    } else if (tag === 'pre') {
      // Handle pre tags (code blocks)
      const code = $el.find('code').text() || $el.text();
      const lang = $el.find('code').attr('class')?.replace(/^language-/, '') || '';
      blocks.push(`\n\`\`\`${lang}\n${code}\n\`\`\`\n`);
    } else if (tag === 'table') {
      // Convert tables to markdown
      blocks.push(turndown.turndown($.html($el)));
    } else if (tag === 'blockquote') {
      blocks.push(turndown.turndown($.html($el)));
    }
  });

  const md = blocks.join('\n\n').replace(/\n{3,}/g, '\n\n');
  return { title: cleanTitle, markdown: md };
}

async function main() {
  showBanner();
  console.log('🔍 Scraping EIP-191...');

  const q = await RequestQueue.open();
  await q.addRequest({ url: EIP_191_URL });

  let scrapedContent = { url: '', title: '', markdown: '' };

  const crawler = new CheerioCrawler({
    requestQueue: q,
    maxConcurrency: 1,
    async requestHandler({ request, body, $ }) {
      const url = request.loadedUrl || request.url;
      const html = $ ? $.html() : (typeof body === 'string' ? body : body?.toString()) || '';
      const { title, markdown } = extractPageMarkdown(html);

      scrapedContent = { url, title, markdown };
      console.log(`✅ Scraped: ${title}`);
    },
  });

  await crawler.run();

  // Read existing llms-full.txt
  const llmsFullPath = path.join(process.cwd(), 'dist', 'llms-full.txt');
  const existingContent = fs.readFileSync(llmsFullPath, 'utf-8');

  // Create the new section
  const newSection = [
    `## ${scrapedContent.title || scrapedContent.url}`,
    `[Permalink for this section](${scrapedContent.url})`,
    '',
    scrapedContent.markdown,
    '',
  ].join('\n');

  // Find the insertion point - right after "Process of a Transaction in EVVM" section
  // Look for the next H2 section after "Process of a Transaction"
  const processOfTransactionMarker = '## Process of a Transaction in EVVM';
  const evvmCoreContractMarker = '## EVVM Core Contract';

  const processStart = existingContent.indexOf(processOfTransactionMarker);
  const insertPoint = existingContent.indexOf(evvmCoreContractMarker, processStart);

  if (processStart === -1 || insertPoint === -1) {
    console.warn('⚠️  Could not find insertion point, appending to end instead');
    const updatedContent = existingContent + '\n' + newSection;
    fs.writeFileSync(llmsFullPath, updatedContent, 'utf-8');
  } else {
    // Insert EIP-191 content between the two sections
    const beforeContent = existingContent.substring(0, insertPoint);
    const afterContent = existingContent.substring(insertPoint);
    const updatedContent = beforeContent + newSection + '\n' + afterContent;
    fs.writeFileSync(llmsFullPath, updatedContent, 'utf-8');
    console.log('📍 Inserted EIP-191 after "Process of a Transaction in EVVM"');
  }

  console.log('\n✅ Done! EIP-191 content has been added to llms-full.txt');
  console.log(`📄 Updated file: ${llmsFullPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
