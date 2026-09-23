// Shared detection heuristics. Loaded before content.js in the extension,
// and required by Node tests. Do not match YouTube's generated CSS classes.
(function (root) {
  'use strict';

  const CONTAINER_SELECTORS = [
    'ytd-rich-item-renderer',
    'ytd-video-renderer',
    'ytd-compact-video-renderer',
    'ytd-grid-video-renderer',
    'ytd-playlist-video-renderer',
    'ytd-reel-item-renderer',
    'ytd-reel-video-renderer',
    'ytd-shorts',
    'ytm-shorts-lockup-view-model',
    'ytm-reel-item-renderer',
    'ytm-video-with-context-renderer',
    'ytm-compact-video-renderer',
    'ytm-rich-item-renderer',
    'reel-video-in-sequence-renderer'
  ];

  const WATCH_SECTION_SELECTOR = 'how-this-was-made-section-view-model';
  const BADGE_SELECTOR = 'badge-shape[aria-label]';
  const WATCH_HEADER_SELECTOR =
    '.ytwHowThisWasMadeSectionViewModelBodyHeader, [class*="BodyHeader"], [role="heading"]';

  function isAIBadgeLabel(ariaLabel) {
    if (!ariaLabel) return false;
    const s = String(ariaLabel).trim();
    if (!s) return false;
    // YouTube English badges: "AI: Content was made with AI",
    // "AI: Altered or synthetic content"
    if (/^AI\s*[:：]/i.test(s)) return true;
    if (/\bmade with ai\b/i.test(s)) return true;
    if (/\baltered with ai\b/i.test(s)) return true;
    if (/\bgenerated with ai\b/i.test(s)) return true;
    if (/\baltered or synthetic(?: content)?\b/i.test(s)) return true;
    return false;
  }

  function isMadeWithAIDisclosureText(text) {
    if (!text) return false;
    const s = String(text).replace(/\s+/g, ' ').trim();
    if (!s) return false;
    if (/^AI\s*[:：]/i.test(s)) return true;
    if (/\bmade with ai\b/i.test(s)) return true;
    if (/\baltered with ai\b/i.test(s)) return true;
    if (/\bgenerated with ai\b/i.test(s)) return true;
    if (/\baltered or synthetic(?: content)?\b/i.test(s)) return true;
    if (/\bsynthetic content\b/i.test(s) && /\b(ai|altered|generated)\b/i.test(s)) return true;
    return false;
  }

  function isMadeWithAIWatchSection(section) {
    if (!section) return false;
    const header =
      section.querySelector && section.querySelector(WATCH_HEADER_SELECTOR);
    const text = header ? header.textContent || '' : section.textContent || '';
    return isMadeWithAIDisclosureText(text);
  }

  function isShortsPlayerContainer(el) {
    if (!el || !el.tagName) return false;
    const tag = el.tagName.toLowerCase();
    return tag === 'ytd-reel-video-renderer' || tag === 'reel-video-in-sequence-renderer';
  }

  function getYouTubeContentId(href) {
    try {
      const url = new URL(href, 'https://www.youtube.com');
      const parts = url.pathname.split('/').filter(Boolean);
      if (parts[0] === 'shorts' && parts[1]) return 'shorts:' + parts[1];
      const v = url.searchParams.get('v');
      if (v) return 'watch:' + v;
      if (parts[0] === 'embed' && parts[1]) return 'embed:' + parts[1];
      return url.pathname + url.search;
    } catch (_err) {
      return String(href || '');
    }
  }

  function isShortsPath(pathname) {
    return /^\/shorts\//i.test(pathname || '');
  }

  const api = {
    CONTAINER_SELECTORS,
    CONTAINER_SELECTOR: CONTAINER_SELECTORS.join(','),
    WATCH_SECTION_SELECTOR,
    BADGE_SELECTOR,
    WATCH_HEADER_SELECTOR,
    isAIBadgeLabel,
    isMadeWithAIDisclosureText,
    isMadeWithAIWatchSection,
    isShortsPlayerContainer,
    getYouTubeContentId,
    isShortsPath
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  root.ByebAIDetection = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
