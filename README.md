# ByebAI — AI Content Blocker for YouTube™

> A lightweight Manifest V3 Chrome extension that hides YouTube videos and Shorts that YouTube itself labels as made, altered, or generated with AI.

*Unofficial extension. Not affiliated with, endorsed by, or sponsored by YouTube or Google LLC. YouTube is a trademark of Google LLC.*

---

## Features

- **Feed Filtering**: Automatically hides AI-labeled video cards across the homepage, subscriptions, channel pages, search results, and sidebar recommendations.
- **Shorts Protection**: Blocks AI-labeled Shorts in the full-screen carousel with a "Skip short" button, and hides individual Shorts cards in shelf carousels.
- **Watch Page Overlay**: For full-length watch pages with YouTube's "How this was made" AI disclosure, shows a clean dialog with "Go back" and "Watch anyway" options.
- **Instant Restore on Disable**: Toggling the extension off in the popup immediately restores any hidden cards and clears overlays without needing a page refresh.
- **SPA Navigation Resilient**: Handles YouTube's single-page app transitions (`yt-navigate-start`, `yt-navigate-finish`, `yt-page-data-updated`) without lingering overlays or stuck blocks.
- **100% Client-Side & Private**: No analytics, no remote tracking, no backend. Settings and blocked counts remain solely in local browser storage.

---

## Installation & Development

### Load Unpacked in Chrome

1. Clone or download this repository.
2. In Google Chrome, navigate to `chrome://extensions`.
3. Enable **Developer mode** using the toggle in the top-right corner.
4. Click **Load unpacked** and select this directory.
5. Visit [YouTube](https://www.youtube.com) (English interface) to start using ByebAI.

---

## NPM Scripts

```bash
# Run unit tests for detection heuristics
npm test

# Build clean production zip for Chrome Web Store upload
npm run pack
```

`npm run pack` stages and compresses only production extension files into `dist/byebai.zip`, excluding git files, tests, source raw artwork, and documentation drafts.

---

## Project Structure

```text
├── manifest.json         # Manifest V3 extension configuration
├── background.js         # Service worker for lifecycle events (onboarding)
├── detection.js          # Shared detection heuristics & selector logic
├── content.js            # Content script running on YouTube DOM
├── content.css           # Minimal styles for watch/Shorts overlay
├── popup.html            # Extension action popup markup
├── popup.js              # Popup logic (toggle state & count listener)
├── popup.css             # Popup UI styles
├── onboarding.html       # Post-install welcome & explanation page
├── privacy.html          # Bundled privacy policy page
├── PRIVACY.md            # Markdown privacy policy for GitHub hosting
├── CHROMEWEBSTORE.md     # Chrome Web Store copy, justifications, & checklist
├── LICENSE               # MIT License
├── icons/                # Production & source icon assets (16, 32, 48, 128, 500)
├── scripts/
│   └── pack.mjs          # Packaging script generating dist/byebai.zip
└── test/
    └── detection.test.js # Node.js test runner suite for detection heuristics
```

---

## Chrome Web Store Publishing

Refer to [CHROMEWEBSTORE.md](CHROMEWEBSTORE.md) for complete details on:
- Store listing titles, short descriptions, and formatted detailed descriptions.
- Permissions justifications for `storage` and host match patterns.
- Privacy practices declarations.
- Required screenshot specifications (1280×800 or 640×400) and promo tiles.

---

## Privacy Policy

See [PRIVACY.md](PRIVACY.md) and [privacy.html](privacy.html).

ByebAI does not collect or transmit any user data. To provide a public URL for your Chrome Web Store dashboard submission, you can enable GitHub Pages on your repository (`https://<username>.github.io/<repo>/privacy.html`).

---

## Known Limitations

- **English UI Only**: Detection inspects English disclosure labels and aria attributes.
- **YouTube-Disclosed Only**: Detects videos that YouTube itself has marked. It does not perform independent machine-learning video analysis on undisclosed content.
- **DOM Dependencies**: If YouTube significantly changes its markup, selectors in `detection.js` may require periodic updates.

---

## Support

If you find ByebAI helpful, support ongoing maintenance at:  
[ko-fi.com/vish72](https://ko-fi.com/vish72)

---

## License

[MIT](LICENSE)
