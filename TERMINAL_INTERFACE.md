# Terminal Interface Enhancement

## Overview

The EVVM Documentation Scraper now features a beautiful terminal interface with ASCII art banners and an interactive shell menu.

## Features Added

### 1. ASCII Art Banners

Both scraper scripts now display colorful ASCII art banners when executed:

#### Main Scraper Banner (`npm run scrape`)
```
░▒▓████████▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓██████████████▓▒░   (Cyan)
░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
░▒▓█▓▒░       ░▒▓█▓▒▒▓█▓▒░ ░▒▓█▓▒▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
░▒▓██████▓▒░  ░▒▓█▓▒▒▓█▓▒░ ░▒▓█▓▒▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
░▒▓█▓▒░        ░▒▓█▓▓█▓▒░   ░▒▓█▓▓█▓▒░ ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
░▒▓█▓▒░        ░▒▓█▓▓█▓▒░   ░▒▓█▓▓█▓▒░ ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
░▒▓████████▓▒░  ░▒▓██▓▒░     ░▒▓██▓▒░  ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░

   ██████╗  ██████╗  ██████╗███████╗    ███████╗ ██████╗██████╗  █████╗ ██████╗ ██████╗ ███████╗██████╗    (Blue)
   ██╔══██╗██╔═══██╗██╔════╝██╔════╝    ██╔════╝██╔════╝██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗
   ██║  ██║██║   ██║██║     ███████╗    ███████╗██║     ██████╔╝███████║██████╔╝██████╔╝█████╗  ██████╔╝
   ██║  ██║██║   ██║██║     ╚════██║    ╚════██║██║     ██╔══██╗██╔══██║██╔═══╝ ██╔═══╝ ██╔══╝  ██╔══██╗
   ██████╔╝╚██████╔╝╚██████╗███████║    ███████║╚██████╗██║  ██║██║  ██║██║     ██║     ███████╗██║  ██║
   ╚═════╝  ╚═════╝  ╚═════╝╚══════╝    ╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝     ╚══════╝╚═╝  ╚═╝

  📚 EVVM Documentation Scraper for llms.txt   (Green)
  https://llmstxt.org/ compliant              (Yellow)
```

#### EIP-191 Adder Banner (`npm run add-eip191`)
```
░▒▓████████▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓██████████████▓▒░   (Cyan)
░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
░▒▓█▓▒░       ░▒▓█▓▒▒▓█▓▒░ ░▒▓█▓▒▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
░▒▓██████▓▒░  ░▒▓█▓▒▒▓█▓▒░ ░▒▓█▓▒▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
░▒▓█▓▒░        ░▒▓█▓▓█▓▒░   ░▒▓█▓▓█▓▒░ ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
░▒▓█▓▒░        ░▒▓█▓▓█▓▒░   ░▒▓█▓▓█▓▒░ ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
░▒▓████████▓▒░  ░▒▓██▓▒░     ░▒▓██▓▒░  ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░

   ███████╗██╗██████╗       ██╗ ██╗ ██╗   (Blue)
   ██╔════╝██║██╔══██╗     ███║ ██║ ██║
   █████╗  ██║██████╔╝     ╚██║ ╚═╝ ╚═╝
   ██╔══╝  ██║██╔═══╝       ██║ ██╗ ██╗
   ███████╗██║██║          ██╔╝ ╚═╝ ╚═╝
   ╚══════╝╚═╝╚═╝          ╚═╝

  📝 Adding EIP-191 to llms-full.txt   (Green)
  Ethereum Signed Data Standard        (Yellow)
```

### 2. Interactive Shell Script

A new `scrape.sh` script provides an interactive menu interface:

```bash
./scrape.sh
```

**Menu Options:**
1. **Scrape full documentation** - Runs `npm run scrape` to generate both llms.txt and llms-full.txt (includes EIP-191 automatically)
2. **Re-add EIP-191 to existing llms-full.txt** - Runs `npm run add-eip191` to re-add EIP-191 content if needed
3. **Exit** - Closes the interactive menu

**Note:** As of the latest update, EIP-191 is automatically scraped and included during the main scraping process (option 1). Option 2 is retained for cases where you need to re-add EIP-191 to an existing file.

### 3. Color Coding

The terminal output uses ANSI color codes:
- **Cyan** - EVVM ASCII art logo
- **Blue** - Feature-specific ASCII art (DOCS SCRAPPER / EIP 191)
- **Green** - Primary messages
- **Yellow** - Secondary information

## Implementation Details

### Files Modified

1. **src/build-llms-full.ts**
   - Added `colors` object with ANSI color codes
   - Created `showBanner()` function for main scraper
   - Called banner at start of `main()`

2. **src/add-eip191.ts**
   - Added `colors` object with ANSI color codes
   - Created `showBanner()` function for EIP-191 scraper
   - Called banner at start of `main()`

3. **scrape.sh** (NEW)
   - Interactive menu script with 4 options
   - Provides user-friendly interface for running scrapers
   - Includes confirmation prompts and status messages

4. **README.md**
   - Updated with terminal interface section
   - Added ASCII art preview
   - Documented shell script usage
   - Enhanced features list with emojis

### Color Implementation

```typescript
const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};
```

### Banner Function Structure

```typescript
function showBanner() {
  console.log(colors.cyan);
  console.log(`[EVVM ASCII art...]`);

  console.log(colors.blue);
  console.log(`[Feature ASCII art...]`);

  console.log(colors.reset);
  console.log(colors.green + '  📚 Title' + colors.reset);
  console.log(colors.yellow + '  Subtitle' + colors.reset);
  console.log('');
}
```

## Usage Examples

### Option 1: Interactive Menu (Recommended)
```bash
./scrape.sh
# Select option from menu
```

### Option 2: Direct NPM Commands
```bash
# Full scrape
npm run scrape

# Add EIP-191 only
npm run add-eip191
```

### Option 3: Shell Script with Auto-Exit
```bash
# Run full scrape and exit
echo "1" | ./scrape.sh

# Run both and exit
echo "3" | ./scrape.sh
```

## Benefits

1. **Professional appearance** - ASCII art branding creates a polished look
2. **User guidance** - Clear visual separation between different tools
3. **Brand consistency** - Uses EVVM branding from Solidity contracts
4. **Ease of use** - Interactive menu eliminates need to remember commands
5. **Visual feedback** - Color coding helps users identify different stages
6. **llmstxt.org compliance** - Prominently displays specification compliance

## Screenshots

When running `npm run scrape`, you'll see:
- Colored EVVM logo in cyan
- "DOCS SCRAPPER" in blue
- Green title text
- Yellow compliance badge
- Then the normal scraping progress

## Technical Notes

- Colors work in most modern terminals (Linux, macOS, Windows Terminal, etc.)
- ANSI escape codes are used for maximum compatibility
- Colors are reset after each section to prevent bleeding
- The banner is displayed before any crawler initialization
- Shell script is executable (`chmod +x scrape.sh`)

## Future Enhancements

Potential improvements:
- Progress bar for scraping
- Estimated time remaining
- File size indicators
- Success/failure summaries with statistics
- Log file generation option
- Configurable color schemes
