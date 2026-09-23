// ByebAI content script — youtube.com / m.youtube.com
// Detects YouTube's own "Made with AI" / "Altered with AI" labels.
// Heuristics live in detection.js (loaded first).

(function () {
  const D = globalThis.ByebAIDetection;
  const STORAGE = {
    enabled: 'byebaiEnabled',
    blockedCount: 'byebaiBlockedCount'
  };

  let enabled = true;
  let lastContentId = D.getYouTubeContentId(location.href);
  const processedContainers = new WeakSet();
  const checkedSectionIds = new WeakMap();
  const watchAnywayIds = new Set();

  let countDelta = 0;
  let countFlushScheduled = false;

  function incrementBlockedCount() {
    countDelta += 1;
    if (countFlushScheduled) return;
    countFlushScheduled = true;
    chrome.storage.local.get([STORAGE.blockedCount], (res) => {
      const add = countDelta;
      countDelta = 0;
      countFlushScheduled = false;
      const n = (res[STORAGE.blockedCount] || 0) + add;
      chrome.storage.local.set({ [STORAGE.blockedCount]: n });
    });
  }

  function hideContainer(container) {
    if (!container || processedContainers.has(container)) return;
    processedContainers.add(container);
    container.style.setProperty('display', 'none', 'important');
    container.dataset.byebaiBlocked = 'true';
    incrementBlockedCount();
  }

  function unhideContainer(container) {
    if (!container) return;
    container.style.removeProperty('display');
    container.removeAttribute('data-byebai-blocked');
    processedContainers.delete(container);
  }

  function hasAIBadge(container) {
    const badges = container.querySelectorAll(D.BADGE_SELECTOR);
    for (const badge of badges) {
      if (D.isAIBadgeLabel(badge.getAttribute('aria-label'))) {
        return true;
      }
    }
    return false;
  }

  function restoreHidden() {
    document.querySelectorAll('[data-byebai-blocked="true"]').forEach((el) => {
      unhideContainer(el);
    });
    const overlay = document.getElementById('byebai-overlay');
    if (overlay) {
      removeWatchOverlay();
      const v = pageVideo();
      if (v && v.paused) {
        v.play().catch(() => {});
      }
    }
  }

  function removeWatchOverlay() {
    const overlay = document.getElementById('byebai-overlay');
    if (overlay) overlay.remove();
  }

  function pageVideo() {
    return document.querySelector('ytd-watch-flexy video, ytd-reel-video-renderer video, shorts-video video, video');
  }

  function skipShort() {
    const nextBtn = document.querySelector(
      '#navigation-button-down button, ytd-shorts [aria-label="Next video"], ytm-shorts [aria-label="Next video"]'
    );
    if (nextBtn) {
      nextBtn.click();
      return;
    }
    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        code: 'ArrowDown',
        keyCode: 40,
        which: 40,
        bubbles: true
      })
    );
  }

  function showWatchOverlay(isShorts = false) {
    const id = D.getYouTubeContentId(location.href);
    if (watchAnywayIds.has(id)) return;
    if (document.getElementById('byebai-overlay')) return;
    incrementBlockedCount();

    const overlay = document.createElement('div');
    overlay.id = 'byebai-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'byebai-overlay-title');

    const box = document.createElement('div');
    box.className = 'byebai-overlay-box';

    const title = document.createElement('p');
    title.className = 'byebai-overlay-title';
    title.id = 'byebai-overlay-title';
    title.textContent = 'Blocked by ByebAI';

    const body = document.createElement('p');
    body.className = 'byebai-overlay-body';
    body.textContent = isShorts
      ? 'YouTube labels this Short as made or altered with AI.'
      : 'YouTube labels this video as made or altered with AI.';

    const actions = document.createElement('div');
    actions.className = 'byebai-overlay-actions';

    const primaryBtn = document.createElement('button');
    primaryBtn.id = 'byebai-back';
    primaryBtn.type = 'button';
    primaryBtn.textContent = isShorts ? 'Skip short' : 'Go back';

    const watchBtn = document.createElement('button');
    watchBtn.id = 'byebai-watch-anyway';
    watchBtn.type = 'button';
    watchBtn.textContent = 'Watch anyway';

    actions.append(primaryBtn, watchBtn);
    box.append(title, body, actions);
    overlay.append(box);
    document.body.appendChild(overlay);

    const video = pageVideo();
    if (video) video.pause();

    watchBtn.addEventListener('click', () => {
      watchAnywayIds.add(id);
      removeWatchOverlay();
      const v = pageVideo();
      if (v) v.play().catch(() => {});
    });

    primaryBtn.addEventListener('click', () => {
      removeWatchOverlay();
      if (isShorts) {
        skipShort();
      } else {
        history.back();
      }
    });
    primaryBtn.focus();
  }

  function collectMatches(root, selector) {
    const nodes = [];
    if (!root) return nodes;
    if (root.matches && root.matches(selector)) nodes.push(root);
    if (root.querySelectorAll) {
      root.querySelectorAll(selector).forEach((n) => nodes.push(n));
    }
    return nodes;
  }

  function scan(root) {
    if (!enabled || !root) return;

    // Check previously blocked containers in case YouTube recycled them for non-AI content
    collectMatches(root, '[data-byebai-blocked="true"]').forEach((blocked) => {
      if (!hasAIBadge(blocked)) {
        unhideContainer(blocked);
      }
    });

    collectMatches(root, D.BADGE_SELECTOR).forEach((badge) => {
      if (!D.isAIBadgeLabel(badge.getAttribute('aria-label'))) return;
      const container = badge.closest(D.CONTAINER_SELECTOR);
      if (container) {
        if (D.isShortsPlayerContainer(container)) {
          showWatchOverlay(true);
        } else {
          hideContainer(container);
        }
        return;
      }
      // Full-screen Shorts player often has no feed-card ancestor.
      if (D.isShortsPath(location.pathname)) showWatchOverlay(true);
    });

    const currentId = D.getYouTubeContentId(location.href);
    const isShorts = D.isShortsPath(location.pathname);

    const watchSections = collectMatches(root, D.WATCH_SECTION_SELECTOR);
    if (root.closest) {
      const ancestor = root.closest(D.WATCH_SECTION_SELECTOR);
      if (ancestor && !watchSections.includes(ancestor)) {
        watchSections.push(ancestor);
      }
    }

    watchSections.forEach((section) => {
      if (checkedSectionIds.get(section) === currentId) return;
      if (D.isMadeWithAIWatchSection(section)) {
        checkedSectionIds.set(section, currentId);
        showWatchOverlay(isShorts);
      }
    });
  }

  function onNavigateStart() {
    removeWatchOverlay();
  }

  function handleNavigation(force = false) {
    const id = D.getYouTubeContentId(location.href);
    if (!force && id === lastContentId) return;
    lastContentId = id;
    removeWatchOverlay();
    if (enabled) {
      scan(document);
      // Engagement panels and structured descriptions often render 100-1500ms after navigation
      [150, 400, 800, 1500].forEach((delay) => {
        setTimeout(() => {
          if (enabled && D.getYouTubeContentId(location.href) === id) {
            scan(document);
          }
        }, delay);
      });
    }
  }

  let pendingNodes = new Set();
  let rafScheduled = false;

  function flushPending() {
    rafScheduled = false;
    const currentId = D.getYouTubeContentId(location.href);
    if (currentId !== lastContentId) {
      handleNavigation();
    }
    const nodes = pendingNodes;
    pendingNodes = new Set();
    if (!enabled) return;
    nodes.forEach((node) => scan(node));
  }

  function scheduleScan(node) {
    pendingNodes.add(node);
    if (!rafScheduled) {
      rafScheduled = true;
      requestAnimationFrame(flushPending);
    }
  }

  const observer = new MutationObserver((mutations) => {
    if (!enabled) {
      const currentId = D.getYouTubeContentId(location.href);
      if (currentId !== lastContentId) {
        handleNavigation();
      }
      return;
    }
    for (const m of mutations) {
      if (m.type === 'attributes') {
        if (m.target && m.target.nodeType === 1) scheduleScan(m.target);
        continue;
      }
      m.addedNodes.forEach((node) => {
        if (node.nodeType === 1) scheduleScan(node);
      });
    }
  });

  function start() {
    lastContentId = D.getYouTubeContentId(location.href);
    if (enabled) {
      scan(document);
      [150, 400, 800, 1500].forEach((delay) => {
        setTimeout(() => {
          if (enabled) scan(document);
        }, delay);
      });
    }
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-label']
    });

    window.addEventListener('yt-navigate-start', onNavigateStart);
    document.addEventListener('yt-navigate-start', onNavigateStart);

    const navFinishEvents = ['yt-navigate-finish', 'yt-page-data-updated', 'spfdone'];
    navFinishEvents.forEach((evt) => {
      window.addEventListener(evt, () => handleNavigation());
      document.addEventListener(evt, () => handleNavigation());
    });
    window.addEventListener('popstate', () => handleNavigation());

    // Polling fallback to catch SPA navigation in Shorts carousel where events might be skipped
    setInterval(() => {
      const currentId = D.getYouTubeContentId(location.href);
      if (currentId !== lastContentId) {
        handleNavigation();
      }
    }, 200);
  }

  chrome.storage.local.get([STORAGE.enabled], (res) => {
    enabled = res[STORAGE.enabled] !== false;
    start();
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local' || !changes[STORAGE.enabled]) return;
    enabled = changes[STORAGE.enabled].newValue !== false;
    if (enabled) {
      scan(document);
    } else {
      restoreHidden();
    }
  });
})();
