# Privacy Policy — ByebAI

**ByebAI — AI Content Blocker for YouTube™**  
*Last updated: 23 September 2026*

ByebAI runs entirely on your device. It does not operate a backend, does not require an account, and does not send your browsing history, video titles, watch activity, or YouTube page contents to the developer or to any other party.

---

## 1. Data Stored on Your Device

The extension uses Chrome’s local storage (`chrome.storage.local`) exclusively for:
- An **on/off setting** (`byebaiEnabled`): whether blocking is currently active.
- A **running counter** (`byebaiBlockedCount`): the total number of items hidden or blocked on this browser profile.

That data stays in your local browser profile. It is not uploaded, synced by this extension to a developer server, or used for advertising. You can reset or clear it at any time by removing the extension or clearing site/extension data in Chrome settings.

---

## 2. What the Extension Reads on YouTube

While you are browsing YouTube (`youtube.com`, `www.youtube.com`, `m.youtube.com`), the content script inspects the page DOM solely for YouTube’s own "Made with AI", "Altered with AI", or "Generated with AI" disclosure labels so matching videos can be hidden or blocked.

- That inspection happens strictly in your browser.
- The extension does not independently analyze or classify video pixels or audio.
- The extension does not contact YouTube APIs or use your account credentials.

---

## 3. Permissions

- **`storage`**: Used to save your enable/disable preference and blocked item counter locally.
- **Host permissions / Content script matches**: Injected only on `*://www.youtube.com/*`, `*://m.youtube.com/*`, and `*://youtube.com/*` to find disclosure badges and hide labeled cards or show the watch overlay. No other host access or broad `<all_urls>` permission is requested.

---

## 4. Third-Party Links

Optional "Support this project" links open Ko-fi (`https://ko-fi.com/vish72`) in a new tab. If you click that link, Ko-fi’s own privacy policy applies to that visit. The extension does not transmit any data to Ko-fi automatically.

---

## 5. Children's Privacy

The extension is not directed at children under the age of 13 and does not knowingly collect personal information from anyone.

---

## 6. Policy Changes

If this policy changes, the "Last updated" date above will be updated. Material changes that affect data handling will also be reflected in the Chrome Web Store privacy practices declaration.

---

## 7. Contact

For questions about this policy, use the support contact channel listed on the Chrome Web Store listing for ByebAI, or open an issue on the project's repository.

---

*Disclaimer: YouTube is a trademark of Google LLC. ByebAI is an independent, unofficial project and is not affiliated with, endorsed by, or sponsored by YouTube or Google.*
