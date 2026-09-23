# Chrome Web Store Listing — ByebAI

> Last Updated: 2026-09-23

## Store Listing

**Extension Name** [REQUIRED]
ByebAI - AI Content Blocker for YouTube™

**Short Description** [REQUIRED]
Hides YouTube videos labeled Made with AI or Altered with AI. Unofficial; not affiliated with YouTube or Google.

**Detailed Description** [REQUIRED]
ByebAI automatically cleans up your YouTube experience by hiding videos and Shorts that YouTube itself has identified as made or altered with artificial intelligence.

Key Features:
- Automatically hides AI-labeled videos in your home feed, subscription feed, search results, and sidebar recommendations.
- Cleanly blocks full-screen watch pages and Shorts that carry YouTube's "How this was made" AI disclosure, with an optional "Watch anyway" button if you choose to view it.
- Works silently in the background with zero performance impact on video playback.
- Displays a running counter in the extension popup showing how many AI-labeled videos have been blocked.
- Simple one-click toggle in the popup to pause or resume blocking anytime without reloading.

How It Works:
1. Install the extension. That is all — ByebAI activates immediately on YouTube.
2. Browse YouTube normally. Videos carrying YouTube's official AI disclosure badges will disappear from your feeds.
3. Click the ByebAI toolbar icon at any time to check how many videos have been blocked or toggle the filter on and off.

Privacy & Security:
ByebAI runs 100% locally in your browser. It does not collect, transmit, or share your browsing history, video titles, watch activity, or any personal data. Your settings and blocked video count stay strictly on your device.

Limitations:
- Designed for English YouTube interfaces.
- Only catches videos that YouTube itself has disclosed and labeled as made or altered with AI; it does not perform independent content classification on undisclosed videos.

Disclaimer:
ByebAI is an independent, unofficial project and is not affiliated with, endorsed by, or sponsored by YouTube or Google LLC. YouTube is a trademark of Google LLC.

**Category** [REQUIRED]
Productivity

**Single Purpose** [REQUIRED]
Hides YouTube videos that YouTube itself has labeled as made or altered with AI.

**Primary Language** [REQUIRED]
English

---

## Graphics & Assets

| Asset | Dimensions | Status | Filename |
|---|---|---|---|
| Store Icon [REQUIRED] | 128×128 PNG | ✅ Ready | `icons/icon128.png` |
| Screenshot 1 [REQUIRED] | 1280×800 or 640×400 | ⬜ User capture | Feeds with AI videos hidden |
| Screenshot 2 [RECOMMENDED] | 1280×800 or 640×400 | ⬜ User capture | Watch page ByebAI overlay with "Watch anyway" |
| Screenshot 3 [RECOMMENDED] | 1280×800 or 640×400 | ⬜ User capture | Extension popup with toggle and blocked counter |
| Screenshot 4 | 1280×800 or 640×400 | ⬜ User capture | Onboarding welcome page |
| Small Promo Tile [RECOMMENDED] | 440×280 | ⬜ Optional | Promo card with ByebAI logo on dark backdrop |
| Marquee Promo Tile | 1400×560 | ⬜ Optional | Feature banner |

### Screenshot Notes
- Capture real screenshots on YouTube with the extension loaded unpacked.
- Screenshot 1: YouTube homepage or search feed showing normal videos where AI content was filtered.
- Screenshot 2: A video with YouTube's "How this was made" panel triggering the ByebAI blocked overlay.
- Screenshot 3: The clean popup interface showing the toggle and blocked video count.

---

## Permissions Justification

| Permission | Type | Justification |
|---|---|---|
| `storage` | permissions | Used solely to save the user's enabled/disabled preference and local blocked video counter on their device. No data leaves the browser. |
| `*://www.youtube.com/*`<br>`*://youtube.com/*`<br>`*://m.youtube.com/*` | content_scripts (host match) | Required to inspect the YouTube DOM for YouTube's own AI disclosure badges and hide labeled cards or show the watch overlay. |

---

## Privacy & Data Use

### Data Collection

**Does the extension collect user data?** No

The extension does not collect or transmit any user data. All processing is strictly clientside.

| Data Type | Collected? | Transmitted Off-Device? | Purpose | Shared with Third Parties? |
|---|---|---|---|---|
| Personally identifiable info | No | No | N/A | No |
| Health info | No | No | N/A | No |
| Financial info | No | No | N/A | No |
| Authentication info | No | No | N/A | No |
| Personal communications | No | No | N/A | No |
| Location | No | No | N/A | No |
| Web history | No | No | N/A | No |
| User activity | No | No | N/A | No |
| Website content | No | No | N/A | No |

### Data Use Certification
- [x] Data is NOT sold to third parties
- [x] Data is NOT used for purposes unrelated to the extension's core functionality
- [x] Data is NOT used for creditworthiness or lending purposes

---

## Privacy Policy

**Privacy Policy URL** [REQUIRED]
`https://<YOUR_GITHUB_USERNAME>.github.io/byebAI/privacy.html`  
*(Or host `privacy.html` on your own domain)*

---

## Distribution

**Visibility**: Public  
**Regions**: All regions  

---

## Version History

| Version | Date | Changes | Status |
|---|---|---|---|
| 0.1.0 | 2026-09-23 | Initial release: feed card filtering, watch overlay, Shorts handling, atomic count batching, SPA navigation support, toggle disable unhide. | Ready for Submission |
