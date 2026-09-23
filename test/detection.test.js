const test = require('node:test');
const assert = require('node:assert/strict');
const d = require('../detection.js');

test('isAIBadgeLabel: YouTube English AI prefix', () => {
  assert.equal(d.isAIBadgeLabel('AI: Content was made with AI'), true);
  assert.equal(d.isAIBadgeLabel('AI: Altered or synthetic content'), true);
  assert.equal(d.isAIBadgeLabel('AI：Content was made with AI'), true);
});

test('isAIBadgeLabel: phrase fallbacks', () => {
  assert.equal(d.isAIBadgeLabel('Made with AI'), true);
  assert.equal(d.isAIBadgeLabel('This was altered with AI'), true);
});

test('isAIBadgeLabel: rejects unrelated labels', () => {
  assert.equal(d.isAIBadgeLabel(''), false);
  assert.equal(d.isAIBadgeLabel(null), false);
  assert.equal(d.isAIBadgeLabel('New'), false);
  assert.equal(d.isAIBadgeLabel('Live'), false);
  assert.equal(d.isAIBadgeLabel('4K'), false);
  assert.equal(d.isAIBadgeLabel('Contains synthetic leather review'), false);
});

test('isMadeWithAIDisclosureText: watch-page copy', () => {
  assert.equal(d.isMadeWithAIDisclosureText('How this was made\nMade with AI'), true);
  assert.equal(d.isMadeWithAIDisclosureText('Altered or synthetic content'), true);
  assert.equal(d.isMadeWithAIDisclosureText('Altered with AI tools'), true);
});

test('isMadeWithAIDisclosureText: does not match bare synthetic', () => {
  assert.equal(d.isMadeWithAIDisclosureText('synthetic'), false);
  assert.equal(
    d.isMadeWithAIDisclosureText('We discuss synthetic biology in this video'),
    false
  );
});

test('isMadeWithAIWatchSection: prefers header text', () => {
  const section = {
    querySelector(sel) {
      assert.match(sel, /BodyHeader/);
      return { textContent: 'Made with AI' };
    },
    textContent: 'synthetic biology unrelated wall of description'
  };
  assert.equal(d.isMadeWithAIWatchSection(section), true);
});

test('isMadeWithAIWatchSection: header miss uses section text with tight patterns', () => {
  const section = {
    querySelector() {
      return null;
    },
    textContent: 'A lecture on synthetic apertures in radar'
  };
  assert.equal(d.isMadeWithAIWatchSection(section), false);
});

test('getYouTubeContentId: watch vs shorts', () => {
  assert.equal(
    d.getYouTubeContentId('https://www.youtube.com/watch?v=abc123&t=10'),
    'watch:abc123'
  );
  assert.equal(
    d.getYouTubeContentId('https://www.youtube.com/shorts/xyz789'),
    'shorts:xyz789'
  );
  assert.equal(d.isShortsPath('/shorts/xyz789'), true);
  assert.equal(d.isShortsPath('/watch'), false);
});

test('container list includes shorts-related hosts', () => {
  assert.ok(d.CONTAINER_SELECTORS.includes('ytd-reel-video-renderer'));
  assert.ok(d.CONTAINER_SELECTORS.includes('ytm-shorts-lockup-view-model'));
  assert.equal(d.WATCH_SECTION_SELECTOR, 'how-this-was-made-section-view-model');
});

test('isShortsPlayerContainer: distinguishes full-screen player from feed cards', () => {
  assert.equal(d.isShortsPlayerContainer({ tagName: 'YTD-REEL-VIDEO-RENDERER' }), true);
  assert.equal(d.isShortsPlayerContainer({ tagName: 'reel-video-in-sequence-renderer' }), true);
  assert.equal(d.isShortsPlayerContainer({ tagName: 'YTD-RICH-ITEM-RENDERER' }), false);
  assert.equal(d.isShortsPlayerContainer({ tagName: 'ytm-shorts-lockup-view-model' }), false);
  assert.equal(d.isShortsPlayerContainer(null), false);
  assert.equal(d.isShortsPlayerContainer({}), false);
});

test('isAIBadgeLabel: generated with ai and case-insensitivity', () => {
  assert.equal(d.isAIBadgeLabel('Generated with AI'), true);
  assert.equal(d.isAIBadgeLabel('ai: generated with ai tools'), true);
  assert.equal(d.isAIBadgeLabel('  MADE WITH AI  '), true);
  assert.equal(d.isAIBadgeLabel('ai：altered or synthetic content'), true);
  assert.equal(d.isAIBadgeLabel('AIR quality index report'), false);
  assert.equal(d.isAIBadgeLabel('Aisle seat tour'), false);
  assert.equal(d.isAIBadgeLabel('Paid promotion'), false);
});

test('isMadeWithAIDisclosureText: generated with ai and negative tests', () => {
  assert.equal(d.isMadeWithAIDisclosureText('Generated with AI'), true);
  assert.equal(d.isMadeWithAIDisclosureText('Sound and visuals altered with AI'), true);
  assert.equal(d.isMadeWithAIDisclosureText('Synthesizer keyboard review in studio'), false);
  assert.equal(d.isMadeWithAIDisclosureText('Synthetic motor oil vs conventional oil'), false);
});

