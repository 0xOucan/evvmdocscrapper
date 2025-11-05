import { CheerioCrawler, RequestQueue } from 'crawlee';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DOMAIN = 'https://www.evvm.info';
const START_URL = `${DOMAIN}/docs/intro`;
const DOCS_PREFIX = `${DOMAIN}/docs/`;

export interface ScraperMetadata {
  timestamp: string;
  pageCount: number;
  pagesHash: string;
  eip191Included: boolean;
  version: string;
}

/**
 * Extracts metadata from the header of an existing llms-full.txt file
 */
export function extractMetadataFromFile(filePath: string): ScraperMetadata | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // Look for metadata comment block at the top
  // Format: <!-- Scraper Metadata: {"timestamp":"...","pageCount":...} -->
  const metadataLine = lines.find(line => line.includes('<!-- Scraper Metadata:'));

  if (!metadataLine) {
    return null;
  }

  try {
    const jsonMatch = metadataLine.match(/<!-- Scraper Metadata: (.*) -->/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    }
  } catch (error) {
    console.error('Error parsing metadata:', error);
  }

  return null;
}

/**
 * Generates a lightweight fingerprint of the website by crawling page URLs only
 */
export async function getWebsiteFingerprint(): Promise<{ pageUrls: string[]; pagesHash: string }> {
  // Use unique queue name with timestamp to avoid reusing old queue
  const queueName = `fingerprint-queue-${Date.now()}`;
  const q = await RequestQueue.open(queueName);
  await q.addRequest({ url: START_URL });

  const pageUrls: string[] = [];

  const crawler = new CheerioCrawler({
    requestQueue: q,
    maxConcurrency: 3,
    async requestHandler({ request, enqueueLinks }) {
      const url = request.loadedUrl || request.url;

      // Only track URLs under /docs/
      if (url.startsWith(DOCS_PREFIX)) {
        pageUrls.push(url);
      }

      // Continue crawling
      await enqueueLinks({
        globs: [`${DOCS_PREFIX}**`],
        strategy: 'same-domain',
      });
    },
  });

  await crawler.run();

  // Clean up the temporary queue
  await q.drop();

  // Sort URLs for consistent hashing
  pageUrls.sort();

  // Create hash of all page URLs
  const pagesHash = crypto
    .createHash('sha256')
    .update(pageUrls.join('\n'))
    .digest('hex')
    .substring(0, 16); // Use first 16 chars for brevity

  return { pageUrls, pagesHash };
}

/**
 * Checks if the website has changed since the last scrape
 */
export async function hasWebsiteChanged(llmsFullPath: string): Promise<{
  changed: boolean;
  reason: string;
  oldMetadata: ScraperMetadata | null;
  newPageCount: number;
  newPagesHash: string;
}> {
  // Extract metadata from existing file
  const oldMetadata = extractMetadataFromFile(llmsFullPath);

  if (!oldMetadata) {
    return {
      changed: true,
      reason: 'No previous scrape metadata found',
      oldMetadata: null,
      newPageCount: 0,
      newPagesHash: '',
    };
  }

  console.log(`\n📊 Previous scrape: ${oldMetadata.timestamp}`);
  console.log(`📄 Previous page count: ${oldMetadata.pageCount}`);
  console.log(`🔍 Previous hash: ${oldMetadata.pagesHash}`);

  // Get current website fingerprint
  console.log('\n🔎 Checking website for changes...');
  const { pageUrls, pagesHash } = await getWebsiteFingerprint();

  console.log(`📄 Current page count: ${pageUrls.length}`);
  console.log(`🔍 Current hash: ${pagesHash}`);

  // Compare
  if (oldMetadata.pageCount !== pageUrls.length) {
    return {
      changed: true,
      reason: `Page count changed: ${oldMetadata.pageCount} → ${pageUrls.length}`,
      oldMetadata,
      newPageCount: pageUrls.length,
      newPagesHash: pagesHash,
    };
  }

  if (oldMetadata.pagesHash !== pagesHash) {
    return {
      changed: true,
      reason: 'Page structure changed (different URLs detected)',
      oldMetadata,
      newPageCount: pageUrls.length,
      newPagesHash: pagesHash,
    };
  }

  return {
    changed: false,
    reason: 'No changes detected',
    oldMetadata,
    newPageCount: pageUrls.length,
    newPagesHash: pagesHash,
  };
}

/**
 * Generates metadata comment block for file header
 */
export function generateMetadataComment(metadata: ScraperMetadata): string {
  return `<!-- Scraper Metadata: ${JSON.stringify(metadata)} -->`;
}

/**
 * Creates metadata object for current scrape
 */
export function createMetadata(pageCount: number, pagesHash: string, eip191Included: boolean): ScraperMetadata {
  return {
    timestamp: new Date().toISOString(),
    pageCount,
    pagesHash,
    eip191Included,
    version: '2.0.0',
  };
}
