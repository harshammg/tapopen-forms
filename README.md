# Google Forms Timer Extension

A production-grade Chrome extension that adds a customizable timer to Google Forms.

## Features
- Set a countdown timer for any Google Form.
- Floating, non-intrusive UI element.
- Timer persists across page refreshes and tab switches.
- Auto-submit the form when the timer expires (placeholder feature to be expanded).

## Tech Stack
- Manifest V3
- Vite & CRXJS
- TypeScript
- Tailwind CSS
- Vitest

## Installation (Local Development)

1. **Clone the repository** (if applicable) or navigate to the directory:
   ```bash
   cd google-forms-timer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the extension**:
   ```bash
   npm run build
   ```
   This will generate a `dist` folder containing the compiled extension.

4. **Load in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode** in the top right corner.
   - Click **Load unpacked** and select the generated `dist` folder.
   - The extension icon should appear in your toolbar.

## How to Test Locally
- To run unit tests for core logic:
  ```bash
  npm run test
  ```
- Navigate to any Google Form (e.g., `https://docs.google.com/forms/d/e/.../viewform`).
- Click the extension icon to set a duration and click "Start Timer".
- A floating timer will appear on the form.

## Project Structure
- `src/manifest.json`: Manifest V3 config
- `src/background/`: Service worker for background state
- `src/content/`: Content scripts injected into Google Forms
- `src/popup/`: Extension popup UI
- `src/storage/`: Wrappers for chrome.storage
- `src/types/`: TypeScript definitions
- `tests/`: Unit tests using Vitest
