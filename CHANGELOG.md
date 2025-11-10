# Changelog

## [2.1.0] - Documentation Expansion Update

### 📊 Latest Scrape Information

**Scrape Timestamp**: `2025-11-10T17:32:53.335Z`

### 🎯 Changes

#### Documentation Growth
- **Page Count**: Increased from 135 to 149 EVVM documentation pages (+14 pages)
- **Total Pages**: 150 pages (149 EVVM + 1 EIP-191)
- **Pages Hash**: `ea6c7b391bb1fbb2`

#### Updated Files
1. **README.md**
   - Updated page count references from 135 to 149
   - Updated total pages from 136 to 150
   - Updated example output with latest scrape timestamp

2. **dist/llms-full.txt**
   - Refreshed with latest EVVM documentation
   - Metadata reflects new page count and timestamp
   - Maintained EIP-191 strategic placement

### 📝 What's New

The EVVM documentation website has expanded significantly:
- 14 new documentation pages added
- All existing pages updated to latest content
- EIP-191 integration maintained
- Change detection working correctly

### 🔄 No Breaking Changes

- All functionality remains the same
- File structure unchanged
- Output format consistent
- EIP-191 automatically included as before

---

## [2.0.0] - EIP-191 Auto-Integration Update

### 🎯 Major Changes

**EIP-191 is now automatically included by default!** The main scraper (`npm run scrape`) now automatically scrapes and includes EIP-191 content from ethereum.org, strategically placing it after the "Process of a Transaction in EVVM" section.

### ✨ What's New

#### Automatic EIP-191 Integration
- **Main scraper now includes EIP-191** - No separate step needed!
- **Strategic placement** - EIP-191 is inserted right after "Process of a Transaction" (only 183 lines apart)
- **Essential for understanding** - Since EIP-191 signatures are fundamental to EVVM, it's now always included
- **Smart insertion** - Automatically finds the right position in the document structure

#### Updated Terminal Output
- New colored status message: "📝 Scraping EIP-191 (Ethereum Signed Data Standard)..."
- Success message shows: "✅ EIP-191 strategically placed after 'Process of a Transaction in EVVM'"
- Final output indicates: "✅ Done! Scraped 135 EVVM pages + EIP-191"
- File list shows: "• ./dist/llms-full.txt (includes EIP-191)"

#### Shell Script Menu Updates
- **Option 1**: "Scrape full documentation (includes EIP-191 automatically)"
- **Option 2**: "Re-add EIP-191 to existing llms-full.txt" (for edge cases)
- **Option 3**: "Exit"
- Removed redundant "Run both" option (since option 1 now does everything)

#### Documentation Updates
- README.md updated to emphasize automatic EIP-191 inclusion
- TERMINAL_INTERFACE.md updated with new menu structure
- All examples and usage instructions updated

### 🔧 Technical Details

#### Modified Files
1. **src/build-llms-full.ts**
   - Added `EIP_191_URL` constant
   - Added EIP-191 scraping logic after main EVVM docs crawler
   - Implemented smart insertion algorithm to place EIP-191 after "Process of a Transaction"
   - Enhanced console output with colored status messages
   - Updated final success message to indicate EIP-191 inclusion

2. **scrape.sh**
   - Updated menu from 4 options to 3 options
   - Changed option 1 description to indicate EIP-191 is included
   - Changed option 2 to "Re-add EIP-191" (from "Add EIP-191")
   - Removed option 3 "Run both" (no longer needed)
   - Updated error messages for 1-3 range

3. **README.md**
   - Updated features list to highlight automatic EIP-191 inclusion
   - Updated menu example to show new 3-option structure
   - Added note about automatic inclusion
   - Updated "How It Works" section with EIP-191 auto-scraping step
   - Updated output structure to show "AUTO-INCLUDED & STRATEGICALLY PLACED"
   - Enhanced key features list

4. **TERMINAL_INTERFACE.md**
   - Updated menu options documentation
   - Added note about automatic inclusion
   - Clarified that option 2 is for re-adding if needed

### 📊 Code Changes

#### New Scraping Logic
```typescript
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
```

#### Smart Insertion Algorithm
```typescript
// Find the insertion point for EIP-191 (after "Process of a Transaction in EVVM")
const processOfTransactionIndex = sortedPages.findIndex(p =>
  p.title === 'Process of a Transaction in EVVM' ||
  p.url.includes('/ProcessOfATransaction')
);

if (processOfTransactionIndex !== -1 && processOfTransactionIndex < sortedPages.length - 1) {
  // Split pages into before and after "Process of a Transaction"
  const beforePages = sortedPages.slice(0, processOfTransactionIndex + 1);
  const afterPages = sortedPages.slice(processOfTransactionIndex + 1);

  // Insert EIP-191 between them
  bodyParts = [beforeBody, eip191Section, afterBody];
  console.log(`${colors.green}✅ EIP-191 strategically placed...${colors.reset}`);
}
```

### 🎨 User Experience Improvements

#### Before (v1.x)
```bash
# Two separate commands needed:
npm run scrape          # Step 1: Scrape EVVM docs
npm run add-eip191      # Step 2: Add EIP-191
```

#### After (v2.0)
```bash
# Single command does everything:
npm run scrape          # Scrapes EVVM docs + EIP-191 automatically
```

#### Menu Changes

**Before:**
```
1) Scrape full documentation (llms.txt + llms-full.txt)
2) Add EIP-191 to llms-full.txt
3) Run both (full scrape + EIP-191)
4) Exit
```

**After:**
```
1) Scrape full documentation (includes EIP-191 automatically)
2) Re-add EIP-191 to existing llms-full.txt
3) Exit
```

### 🚀 Benefits

1. **Simpler workflow** - One command instead of two
2. **Always complete** - EIP-191 is never forgotten
3. **Better for LLMs** - Essential context is always included
4. **Strategic placement** - Optimal positioning for understanding
5. **User-friendly** - Less steps, less confusion

### 📝 Migration Notes

If you're upgrading from v1.x:

1. **No code changes needed** - Just run `npm run scrape` as before
2. **EIP-191 now automatic** - Don't run `npm run add-eip191` unless needed
3. **Shell script updated** - New menu with 3 options instead of 4
4. **Output unchanged** - Same llms.txt and llms-full.txt files, just EIP-191 included by default

### 🔄 Backward Compatibility

- `npm run add-eip191` still works (retained for re-adding EIP-191 if needed)
- All existing files and structure remain the same
- No breaking changes to output format

### 🐛 Bug Fixes

None - This is a feature enhancement release.

### 📦 Dependencies

No new dependencies added. Uses existing:
- crawlee ^3.15.2
- cheerio ^1.1.2
- turndown ^7.2.2

### 🎯 Why This Change?

EIP-191 (Signed Data Standard) is **essential** for understanding EVVM because:
- All EVVM transactions use EIP-191 signatures
- Understanding signatures is critical for understanding the "Process of a Transaction"
- Placing it 18,000+ lines away made it hard for LLMs to connect the concepts
- Now it's only 183 lines away - much better for LLM context windows

### 📊 Statistics (v2.0.0 Initial Release)

- **EVVM Pages Scraped**: 135
- **Additional Pages**: 1 (EIP-191)
- **Total Pages**: 136
- **File Size**: 753KB
- **Total Lines**: 19,114
- **EIP-191 Position**: Line 833 (after "Process of a Transaction" at line 636)
- **Distance**: Only 183 lines apart (was 18,000+ before)

---

## [1.0.0] - Initial Release

### Features
- Scrapes EVVM documentation from https://www.evvm.info/docs/
- Generates llms.txt and llms-full.txt files
- ASCII art terminal interface
- Interactive shell script menu
- Manual EIP-191 addition via separate command
- 100% llmstxt.org compliant
- Logical documentation ordering
- Clean content extraction
