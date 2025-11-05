import { CheerioCrawler, RequestQueue, log } from 'crawlee';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import fs from 'fs';
import path from 'path';
import {
  hasWebsiteChanged,
  createMetadata,
  generateMetadataComment,
  getWebsiteFingerprint,
} from './change-detector.js';

const DOMAIN = 'https://www.evvm.info';
const START_URL = `${DOMAIN}/docs/intro`;
const DOCS_PREFIX = `${DOMAIN}/docs/`;
const EIP_191_URL = 'https://eips.ethereum.org/EIPS/eip-191';

// Check for --force flag
const FORCE_SCRAPE = process.argv.includes('--force');

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
   ██████╗  ██████╗  ██████╗███████╗    ███████╗ ██████╗██████╗  █████╗ ██████╗ ██████╗ ███████╗██████╗
   ██╔══██╗██╔═══██╗██╔════╝██╔════╝    ██╔════╝██╔════╝██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗
   ██║  ██║██║   ██║██║     ███████╗    ███████╗██║     ██████╔╝███████║██████╔╝██████╔╝█████╗  ██████╔╝
   ██║  ██║██║   ██║██║     ╚════██║    ╚════██║██║     ██╔══██╗██╔══██║██╔═══╝ ██╔═══╝ ██╔══╝  ██╔══██╗
   ██████╔╝╚██████╔╝╚██████╗███████║    ███████║╚██████╗██║  ██║██║  ██║██║     ██║     ███████╗██║  ██║
   ╚═════╝  ╚═════╝  ╚═════╝╚══════╝    ╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝     ╚══════╝╚═╝  ╚═╝
  `);
  console.log(colors.reset);
  console.log(colors.green + '  📚 EVVM Documentation Scraper for llms.txt' + colors.reset);
  console.log(colors.yellow + '  https://llmstxt.org/ compliant' + colors.reset);
  console.log('');
}

// Logical order of documentation pages based on the EVVM docs menu structure
const PAGE_ORDER = [
  '/docs/intro', '/docs/QuickStart', '/docs/ProcessOfATransaction',
  '/docs/category/evvm-core-contract', '/docs/EVVM/Introduction', '/docs/EVVM/NonceTypes',
  '/docs/category/payment-functions', '/docs/EVVM/PaymentFunctions/pay', '/docs/EVVM/PaymentFunctions/payMultiple',
  '/docs/EVVM/PaymentFunctions/dispersePay', '/docs/EVVM/PaymentFunctions/caPay', '/docs/EVVM/PaymentFunctions/disperseCaPay',
  '/docs/category/legacy-single-payment-functions', '/docs/EVVM/PaymentFunctions/SinglePaymentFunctions/Introduction',
  '/docs/EVVM/PaymentFunctions/SinglePaymentFunctions/payStaker', '/docs/EVVM/PaymentFunctions/SinglePaymentFunctions/payNoStaker',
  '/docs/EVVM/Getters', '/docs/EVVM/AdminFunctions', '/docs/EVVM/IdentityResolution', '/docs/EVVM/EconomicSystem',
  '/docs/EVVM/StakingIntegration', '/docs/EVVM/ProxyManagement', '/docs/EVVM/TreasuryFunctions',
  '/docs/category/staking-service', '/docs/Staking/Introduction', '/docs/category/staking-contract', '/docs/category/staking-functions',
  '/docs/Staking/StakingContract/StakingFunctions/goldenStaking', '/docs/Staking/StakingContract/StakingFunctions/presaleStaking',
  '/docs/Staking/StakingContract/StakingFunctions/publicStaking', '/docs/category/service-staking',
  '/docs/Staking/StakingContract/StakingFunctions/serviceStaking/Introduction',
  '/docs/Staking/StakingContract/StakingFunctions/serviceStaking/prepareServiceStaking',
  '/docs/Staking/StakingContract/StakingFunctions/serviceStaking/confirmServiceStaking',
  '/docs/Staking/StakingContract/StakingFunctions/serviceStaking/serviceUnstaking',
  '/docs/category/internal-staking-functions', '/docs/Staking/StakingContract/InternalStakingFunctions/presaleClaims',
  '/docs/Staking/StakingContract/InternalStakingFunctions/stakingBaseProcess', '/docs/Staking/StakingContract/AdminFunctions',
  '/docs/Staking/StakingContract/makeCaPay', '/docs/Staking/StakingContract/makePay', '/docs/Staking/StakingContract/Getters',
  '/docs/Staking/StakingContract/HistoryAndTimeLocks', '/docs/category/estimator-contract', '/docs/Staking/Estimator/notifyNewEpoch',
  '/docs/Staking/Estimator/makeEstimation', '/docs/Staking/Estimator/AdminFunctions', '/docs/category/name-service',
  '/docs/NameService/Introduction', '/docs/category/username-functions', '/docs/NameService/UsernameFunctions/preRegistrationUsername',
  '/docs/NameService/UsernameFunctions/registrationUsername', '/docs/NameService/UsernameFunctions/makeOffer',
  '/docs/NameService/UsernameFunctions/withdrawOffer', '/docs/NameService/UsernameFunctions/acceptOffer',
  '/docs/NameService/UsernameFunctions/renewUsername', '/docs/category/custom-metadata-functions',
  '/docs/NameService/CustomMetadataFunctions/AddCustomMetadata', '/docs/NameService/CustomMetadataFunctions/RemoveCustomMetadata',
  '/docs/NameService/CustomMetadataFunctions/FlushCustomMetadata', '/docs/NameService/CustomMetadataFunctions/FlushUsername',
  '/docs/NameService/AdminFunctions', '/docs/NameService/GetterFunctions', '/docs/category/treasury-system',
  '/docs/Treasury/Introduction', '/docs/category/simple-treasury', '/docs/Treasury/TreasurySimple/Introduction',
  '/docs/Treasury/TreasurySimple/deposit', '/docs/Treasury/TreasurySimple/withdraw', '/docs/category/crosschain-treasury',
  '/docs/Treasury/TreasuryCrosschain/Introduction', '/docs/Treasury/TreasuryCrosschain/HostChainStation/withdraw',
  '/docs/Treasury/TreasuryCrosschain/HostChainStation/fisherBridgeReceive', '/docs/Treasury/TreasuryCrosschain/HostChainStation/fisherBridgeSend',
  '/docs/Treasury/TreasuryCrosschain/HostChainStation/setExternalChainAddress', '/docs/Treasury/TreasuryCrosschain/HostChainStation/AdminFunctions',
  '/docs/Treasury/TreasuryCrosschain/ExternalChainStation/depositERC20', '/docs/Treasury/TreasuryCrosschain/ExternalChainStation/depositCoin',
  '/docs/Treasury/TreasuryCrosschain/ExternalChainStation/fisherBridgeReceive', '/docs/Treasury/TreasuryCrosschain/ExternalChainStation/fisherBridgeSendERC20',
  '/docs/Treasury/TreasuryCrosschain/ExternalChainStation/fisherBridgeSendCoin', '/docs/Treasury/TreasuryCrosschain/ExternalChainStation/AdminFunctions',
  '/docs/HowToMakeAEVVMService', '/docs/category/signature-structures', '/docs/SignatureStructures/Introduction',
  '/docs/category/evvm-contract', '/docs/SignatureStructures/EVVM/SinglePaymentSignatureStructure',
  '/docs/SignatureStructures/EVVM/DispersePaySignatureStructure', '/docs/SignatureStructures/EVVM/WithdrawalPaymentSignatureStructure',
  '/docs/category/name-service-signature-structures', '/docs/SignatureStructures/NameService/preRegistrationUsernameStructure',
  '/docs/SignatureStructures/NameService/registrationUsernameStructure', '/docs/SignatureStructures/NameService/makeOfferStructure',
  '/docs/SignatureStructures/NameService/withdrawOfferStructure', '/docs/SignatureStructures/NameService/acceptOfferStructure',
  '/docs/SignatureStructures/NameService/renewUsernameStructure', '/docs/SignatureStructures/NameService/addCustomMetadataStructure',
  '/docs/SignatureStructures/NameService/removeCustomMetadataStructure', '/docs/SignatureStructures/NameService/flushCustomMetadataStructure',
  '/docs/SignatureStructures/NameService/flushUsernameStructure', '/docs/category/staking-service-signature-structures',
  '/docs/SignatureStructures/Staking/StandardStakingStructure', '/docs/SignatureStructures/Treasury/FisherBridgeSignatureStructure',
  '/docs/TestnetExclusiveFunctions', '/docs/category/registry-evvm-contract', '/docs/RegistryEvvm/Introduction',
  '/docs/RegistryEvvm/RegistrationFunctions/registerEvvm', '/docs/RegistryEvvm/RegistrationFunctions/sudoRegisterEvvm',
  '/docs/RegistryEvvm/GovernanceFunctions/SuperUserGovernance/proposeSuperUser',
  '/docs/RegistryEvvm/GovernanceFunctions/SuperUserGovernance/rejectProposalSuperUser',
  '/docs/RegistryEvvm/GovernanceFunctions/SuperUserGovernance/acceptSuperUser',
  '/docs/RegistryEvvm/GovernanceFunctions/UpgradeGovernance/proposeUpgrade',
  '/docs/RegistryEvvm/GovernanceFunctions/UpgradeGovernance/rejectProposalUpgrade',
  '/docs/RegistryEvvm/GovernanceFunctions/UpgradeGovernance/acceptProposalUpgrade',
  '/docs/RegistryEvvm/AdminFunctions/registerChainId', '/docs/RegistryEvvm/AdminFunctions/authorizeUpgrade',
  '/docs/RegistryEvvm/GetterFunctions/getEvvmIdMetadata', '/docs/RegistryEvvm/GetterFunctions/getWhiteListedEvvmIdActive',
  '/docs/RegistryEvvm/GetterFunctions/getPublicEvvmIdActive', '/docs/RegistryEvvm/GetterFunctions/getSuperUserData',
  '/docs/RegistryEvvm/GetterFunctions/getSuperUser', '/docs/RegistryEvvm/GetterFunctions/isChainIdRegistered',
  '/docs/RegistryEvvm/GetterFunctions/isAddressRegistered', '/docs/RegistryEvvm/GetterFunctions/getUpgradeProposalData',
  '/docs/RegistryEvvm/GetterFunctions/getVersion', '/docs/npm-libraries', '/docs/category/evvmviem-signature-library',
  '/docs/npmLibraries/viemSignatureLibrary/introduction', '/docs/npmLibraries/viemSignatureLibrary/abi',
  '/docs/npmLibraries/viemSignatureLibrary/signature-builders', '/docs/npmLibraries/viemSignatureLibrary/types',
  '/docs/npmLibraries/viemSignatureLibrary/utils', '/docs/npmLibraries/testnetContracts',
  '/docs/EVVMFrontendTooling', '/docs/EVVMNoncommercialLicense',
];

function getPageOrderComparator() {
  return (a: { url: string }, b: { url: string }) => {
    const pathA = a.url.replace('https://www.evvm.info', '');
    const pathB = b.url.replace('https://www.evvm.info', '');
    const indexA = PAGE_ORDER.indexOf(pathA);
    const indexB = PAGE_ORDER.indexOf(pathB);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return pathA.localeCompare(pathB);
  };
}

// Markdown converter (keeps code fences)
const turndown = new TurndownService({ codeBlockStyle: 'fenced' });

// Extract article-like content and convert to Markdown blocks
function extractPageMarkdown(html: string) {
  const $ = cheerio.load(html);

  // Try common docs containers; fallback to body
  const $root =
    $('article, main, .theme-doc-markdown, .markdown').first().length
      ? $('article, main, .theme-doc-markdown, .markdown').first()
      : $('body');

  // Remove navigation breadcrumbs and other unwanted elements
  $root.find('nav, .breadcrumbs, .pagination, .theme-doc-breadcrumbs').remove();

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

  // Keep headings, paragraphs, lists, code
  const blocks: string[] = [];
  $root.find('h1, h2, h3, h4, h5, h6, p, ul, ol, pre code, table').each((_, el) => {
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
      // Check if this is a breadcrumb or navigation list (usually has specific classes or structure)
      const hasBreadcrumbClass = $el.hasClass('breadcrumbs') ||
                                  $el.hasClass('pagination') ||
                                  $el.parent().is('nav');

      // Skip if it looks like navigation (very short items with only links)
      const items = $el.find('li');
      const allItemsAreLinks = items.length > 0 && items.toArray().every(li => {
        const $li = $(li);
        const text = $li.text().trim();
        return text.length < 50 && ($li.find('a').length > 0 || text === '');
      });

      if (!hasBreadcrumbClass && !allItemsAreLinks) {
        blocks.push(turndown.turndown(html));
      }
    } else if (tag === 'code' && $el.parent().is('pre')) {
      const lang = ($el.attr('class') || '').replace(/^language-/, '');
      const code = $el.text();
      blocks.push(`\n\`\`\`${lang}\n${code}\n\`\`\`\n`);
    } else if (tag === 'table') {
      blocks.push(turndown.turndown($.html($el)));
    }
  });

  const md = blocks.join('\n\n').replace(/\n{3,}/g, '\n\n');
  return { title: cleanTitle, markdown: md };
}

async function main() {
  showBanner();
  log.setLevel(log.LEVELS.INFO);

  const outDir = path.join(process.cwd(), 'dist');
  const llmsFullPath = path.join(outDir, 'llms-full.txt');

  // Change detection (unless --force flag is used)
  if (!FORCE_SCRAPE) {
    console.log(colors.cyan + '\n🔍 Checking for website changes...' + colors.reset);
    const changeCheck = await hasWebsiteChanged(llmsFullPath);

    if (!changeCheck.changed) {
      console.log(colors.green + '\n✅ No changes detected!' + colors.reset);
      console.log(colors.yellow + '📄 Documentation is up to date' + colors.reset);
      console.log(colors.blue + `\nLast scraped: ${changeCheck.oldMetadata?.timestamp}` + colors.reset);
      console.log(colors.blue + `Page count: ${changeCheck.oldMetadata?.pageCount}` + colors.reset);
      console.log(colors.blue + `Hash: ${changeCheck.oldMetadata?.pagesHash}` + colors.reset);
      console.log('\n💡 Use ' + colors.cyan + 'npm run scrape -- --force' + colors.reset + ' to scrape anyway\n');
      return;
    }

    console.log(colors.yellow + '\n⚠️  Changes detected: ' + changeCheck.reason + colors.reset);
    console.log(colors.green + '🚀 Starting full scrape...\n' + colors.reset);
  } else {
    console.log(colors.yellow + '\n⚡ Force scrape enabled - skipping change detection\n' + colors.reset);
  }

  const q = await RequestQueue.open();

  await q.addRequest({ url: START_URL });

  const pages: Array<{ url: string; title: string; markdown: string }> = [];

  const crawler = new CheerioCrawler({
    requestQueue: q,
    maxConcurrency: 5,
    maxRequestsPerCrawl: 9999,
    requestHandlerTimeoutSecs: 60,
    async requestHandler({ request, body, $, enqueueLinks }) {
      const url = request.loadedUrl || request.url;
      if (!url.startsWith(DOCS_PREFIX)) return;

      // If we have a Cheerio instance, prefer it; else parse body
      const html = $ ? $.html() : (typeof body === 'string' ? body : body?.toString()) || '';
      const { title, markdown } = extractPageMarkdown(html);

      pages.push({ url, title, markdown });
      log.info(`Scraped: ${title} (${url})`);

      await enqueueLinks({
        selector: 'a[href^="/docs/"]',
        transformRequestFunction: (req) => {
          if (req.url.startsWith('/')) req.url = DOMAIN + req.url;
          return req;
        },
      });
    },
  });

  await crawler.run();

  // Scrape EIP-191 (required for understanding EVVM signatures)
  console.log(`\n${colors.blue}📝 Scraping EIP-191 (Ethereum Signed Data Standard)...${colors.reset}`);
  const eip191Queue = await RequestQueue.open('eip191-queue');
  await eip191Queue.addRequest({ url: EIP_191_URL });

  let eip191Content = { url: '', title: '', markdown: '' };

  const eip191Crawler = new CheerioCrawler({
    requestQueue: eip191Queue,
    maxConcurrency: 1,
    async requestHandler({ request, body, $ }) {
      const url = request.loadedUrl || request.url;
      const html = $ ? $.html() : (typeof body === 'string' ? body : body?.toString()) || '';
      const { title, markdown } = extractPageMarkdown(html);
      eip191Content = { url, title, markdown };
      console.log(`${colors.green}✅ Scraped: ${title}${colors.reset}`);
    },
  });

  await eip191Crawler.run();

  // Build llms-full.txt
  // Header (H1 + intro paragraph, following scaffold-eth style)
  const header = [
    '# EVVM Documentation',
    '',
    'Complete documentation for EVVM (Ethereum Virtual Machine for Verifiable Computation). This file contains all documentation pages from https://www.evvm.info/docs/ concatenated for LLM context.',
    '',
  ].join('\n');

  // Concatenate each page under an H2 with a permalink, using logical documentation order
  const sortedPages = pages.sort(getPageOrderComparator());

  // Build EIP-191 section
  const eip191Section = [
    `## ${eip191Content.title || 'ERC-191: Signed Data Standard'}`,
    `[Permalink for this section](${eip191Content.url})`,
    '',
    eip191Content.markdown,
    '',
  ].join('\n');

  // Find the insertion point for EIP-191 (after "Process of a Transaction in EVVM")
  const processOfTransactionIndex = sortedPages.findIndex(p =>
    p.title === 'Process of a Transaction in EVVM' ||
    p.url.includes('/ProcessOfATransaction')
  );

  let bodyParts: string[];
  if (processOfTransactionIndex !== -1 && processOfTransactionIndex < sortedPages.length - 1) {
    // Split pages into before and after "Process of a Transaction"
    const beforePages = sortedPages.slice(0, processOfTransactionIndex + 1);
    const afterPages = sortedPages.slice(processOfTransactionIndex + 1);

    const beforeBody = beforePages.map(p =>
      [
        `## ${p.title || p.url}`,
        `[Permalink for this section](${p.url})`,
        '',
        p.markdown,
        '',
      ].join('\n')
    ).join('\n');

    const afterBody = afterPages.map(p =>
      [
        `## ${p.title || p.url}`,
        `[Permalink for this section](${p.url})`,
        '',
        p.markdown,
        '',
      ].join('\n')
    ).join('\n');

    bodyParts = [beforeBody, eip191Section, afterBody];
    console.log(`${colors.green}✅ EIP-191 strategically placed after "Process of a Transaction in EVVM"${colors.reset}`);
  } else {
    // Fallback: append EIP-191 at the end
    const allPagesBody = sortedPages.map(p =>
      [
        `## ${p.title || p.url}`,
        `[Permalink for this section](${p.url})`,
        '',
        p.markdown,
        '',
      ].join('\n')
    ).join('\n');

    bodyParts = [allPagesBody, eip191Section];
    console.log(`${colors.yellow}⚠️  Could not find insertion point, appending EIP-191 at end${colors.reset}`);
  }

  const body = bodyParts.join('\n');

  // Generate metadata for this scrape (don't count EIP-191 in pageCount since fingerprint doesn't include it)
  const { pagesHash } = await getWebsiteFingerprint();
  const metadata = createMetadata(sortedPages.length, pagesHash, true); // EIP-191 tracked separately
  const metadataComment = generateMetadataComment(metadata);

  // Combine metadata + header + body
  const fullContent = metadataComment + '\n' + header + body;

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(llmsFullPath, fullContent, 'utf-8');

  // Minimal llms.txt that points to llms-full.txt and a few key docs pages
  const llmsTxt = [
    '# EVVM',
    '',
    '> EVVM (Ethereum Virtual Machine for Verifiable Computation) enables virtual blockchains to operate on top of host blockchains without infrastructure overhead.',
    '',
    '## Docs',
    `- [Introduction](${DOMAIN}/docs/intro): Overview of EVVM virtual blockchain architecture and core concepts`,
    `- [QuickStart](${DOMAIN}/docs/QuickStart): Get started with EVVM library or deploy your own instance`,
    `- [EVVM Core Contract](${DOMAIN}/docs/category/evvm-core-contract): Payment processing, token management, and administrative features`,
    `- [Staking Service](${DOMAIN}/docs/category/staking-service): Reward distribution, epoch management, and staking functions`,
    `- [Name Service](${DOMAIN}/docs/category/name-service): Username registration and identity management`,
    `- [Treasury System](${DOMAIN}/docs/category/treasury-system): Asset management and cross-chain transfers`,
    '',
    '## Reference',
    `- [EIP-191: Signed Data Standard](https://eips.ethereum.org/EIPS/eip-191): Ethereum signature standard used for all EVVM transactions`,
    '',
    '## Context files',
    `- [Full documentation](${DOMAIN}/llms-full.txt): Complete concatenation of all documentation pages with logical ordering for LLM context`,
    '',
  ].join('\n');

  fs.writeFileSync(path.join(outDir, 'llms.txt'), llmsTxt, 'utf-8');

  console.log(`\n${colors.green}✅ Done! Scraped ${pages.length} EVVM pages + EIP-191${colors.reset}`);
  console.log(`${colors.cyan}📄 Output files:${colors.reset}`);
  console.log(`   ${colors.blue}•${colors.reset} ./dist/llms-full.txt ${colors.yellow}(includes EIP-191)${colors.reset}`);
  console.log(`   ${colors.blue}•${colors.reset} ./dist/llms.txt`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
