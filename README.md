# EVVM Documentation Scraper

```
░▒▓████████▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓██████████████▓▒░
░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
░▒▓█▓▒░       ░▒▓█▓▒▒▓█▓▒░ ░▒▓█▓▒▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
░▒▓██████▓▒░  ░▒▓█▓▒▒▓█▓▒░ ░▒▓█▓▒▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
░▒▓█▓▒░        ░▒▓█▓▓█▓▒░   ░▒▓█▓▓█▓▒░ ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
░▒▓█▓▒░        ░▒▓█▓▓█▓▒░   ░▒▓█▓▓█▓▒░ ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
░▒▓████████▓▒░  ░▒▓██▓▒░     ░▒▓██▓▒░  ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
```

> Automated documentation scraper that converts EVVM docs into LLM-friendly llms.txt format

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![llms.txt](https://img.shields.io/badge/llms.txt-compliant-green)](https://llmstxt.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)

## 🚀 Quick Start

```bash
# Clone repository
git clone git@github.com:0xOucan/evvmdocscrapper.git
cd evvmdocscrapper

# Install dependencies
npm install

# Run scraper (smart mode - checks for changes first)
npm run scrape

# Or use interactive menu
./scrape.sh
```

## ✨ Features

- 🎨 **Beautiful terminal interface** with ASCII art banners
- ⚡ **Smart change detection** - Only scrapes when website changes (95% faster for unchanged docs)
- 🔗 **Auto-includes EIP-191** - Ethereum Signed Data Standard strategically placed for LLM context
- 📝 **Clean extraction** - Removes navigation, breadcrumbs, and metadata noise
- 🎯 **Logical ordering** - Documentation ordered by menu structure, not alphabetically
- 📊 **100% llms.txt compliant** - Follows [llmstxt.org](https://llmstxt.org/) specification exactly

## 📦 Output Files

The scraper generates two files in `./dist/`:

### `llms.txt` (1.1KB)
Minimal index file with:
- Key documentation links (6 core sections)
- EIP-191 reference
- Link to full documentation

### `llms-full.txt` (753KB, 19,114 lines, 136 pages)
Complete documentation with:
- 135 EVVM documentation pages
- EIP-191 standard (strategically placed after transaction docs)
- All content in clean Markdown format

## 🎯 Usage

### Interactive Menu (Recommended)

```bash
./scrape.sh
```

Options:
1. **Smart scrape** - Checks for changes first (~5-10s if no changes, ~2min if changed)
2. **Force scrape** - Always scrapes regardless of changes
3. **Re-add EIP-191** - Update EIP-191 content only
4. **Exit**

### Direct Commands

**Smart scrape (recommended for automation):**
```bash
npm run scrape
```

**Force scrape (bypass change detection):**
```bash
npm run scrape -- --force
```

**Update EIP-191 only:**
```bash
npm run add-eip191
```

## 🔍 Change Detection

The scraper automatically detects website changes before scraping:

**How it works:**
1. Reads metadata from previous scrape (timestamp, page count, URL hash)
2. Quickly crawls site to get current page URLs (~5-10 seconds)
3. Compares current state with previous metadata
4. Only performs full scrape if changes detected

**Benefits:**
- **95% time savings** when docs unchanged
- **Bandwidth efficient** - No unnecessary full scrapes
- **Perfect for CI/CD** - Run frequently without waste
- **Always accurate** - Detects new/removed/moved pages

Example output when no changes:
```
🔍 Checking for website changes...
📊 Previous scrape: 2025-11-05T00:36:13.467Z
📄 Previous page count: 135
✅ No changes detected!
💡 Use npm run scrape -- --force to scrape anyway
```

See [CHANGE_DETECTION.md](./CHANGE_DETECTION.md) for full documentation.

## 🛠️ How It Works

1. **Crawls** - Uses [Crawlee](https://crawlee.dev/) to crawl all EVVM docs pages
2. **Extracts** - Parses HTML with [Cheerio](https://cheerio.js.org/) and removes noise
3. **Converts** - HTML to Markdown using [Turndown](https://github.com/mixmark-io/turndown)
4. **Orders** - Pages sorted by documentation menu structure
5. **Includes EIP-191** - Automatically scrapes and inserts EIP-191 standard
6. **Generates** - Creates llms.txt compliant output files

## 📁 Project Structure

```
evvmdocscrapper/
├── src/
│   ├── build-llms-full.ts      # Main scraper
│   ├── add-eip191.ts            # EIP-191 scraper
│   └── change-detector.ts       # Change detection module
├── dist/
│   ├── llms.txt                 # Index file (generated)
│   └── llms-full.txt            # Full docs (generated)
├── scrape.sh                    # Interactive menu script
├── package.json
├── tsconfig.json
├── README.md
├── CHANGE_DETECTION.md          # Change detection docs
├── CHANGELOG.md                 # Version history
└── COMPLIANCE_CHECK.md          # llms.txt compliance verification
```

## 🔧 Configuration

Edit constants in `src/build-llms-full.ts`:

```typescript
const DOMAIN = 'https://www.evvm.info';
const START_URL = `${DOMAIN}/docs/intro`;
const DOCS_PREFIX = `${DOMAIN}/docs/`;
const EIP_191_URL = 'https://eips.ethereum.org/EIPS/eip-191';
```

## 📝 Output Format

### llms.txt Structure
```markdown
# EVVM
> Brief description

## Docs
- [Key pages with descriptions]

## Reference
- [EIP-191 link]

## Context files
- [Link to llms-full.txt]
```

### llms-full.txt Structure
```
<!-- Scraper Metadata: {timestamp, pageCount, pagesHash, eip191Included, version} -->
# EVVM Documentation
## Introduction
[content...]
## QuickStart
[content...]
## Process of a Transaction in EVVM
[content...]
## ERC-191: Signed Data Standard  ← Strategically placed here
[content...]
## EVVM Core Contract
[... 130 more sections ...]
```

## 🤖 Automation Examples

### GitHub Actions
```yaml
name: Update Docs
on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run scrape  # Only scrapes if changed
```

### Cron Job
```bash
# Run daily at midnight - only scrapes if docs changed
0 0 * * * cd /path/to/evvmdocscrapper && npm run scrape
```

## ✅ Compliance

- ✅ 100% [llmstxt.org](https://llmstxt.org/) specification compliant
- ✅ Respects rate limits (maxConcurrency: 5)
- ✅ Includes source attribution (permalinks for each section)
- ✅ Checks robots.txt (handled by Crawlee)
- ✅ Only crawls `/docs/*` pages

## 📚 Documentation

- [CHANGE_DETECTION.md](./CHANGE_DETECTION.md) - Full change detection documentation
- [CHANGELOG.md](./CHANGELOG.md) - Version history and changes
- [COMPLIANCE_CHECK.md](./COMPLIANCE_CHECK.md) - llms.txt specification compliance
- [TERMINAL_INTERFACE.md](./TERMINAL_INTERFACE.md) - Terminal UI documentation

## 🤝 Contributing

Created by [@0xOucan](https://github.com/0xOucan) with assistance from Claude (Anthropic).

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

This project is open source. Always verify the target site's terms of service before scraping.

## 🔗 Links

- **EVVM Documentation**: https://www.evvm.info/docs/
- **llms.txt Specification**: https://llmstxt.org/
- **EIP-191 Standard**: https://eips.ethereum.org/EIPS/eip-191

---

**Made with ❤️ for the EVVM ecosystem**
