const DONATE_URL = 'https://ko-fi.com/vish72';

const toggle = document.getElementById('toggle');
const toggleLabel = document.getElementById('toggle-label');
const countEl = document.getElementById('count');
const donateEl = document.getElementById('donate');

donateEl.href = DONATE_URL;

function render(enabled, count) {
  toggle.checked = enabled;
  toggleLabel.textContent = enabled ? 'Enabled' : 'Disabled';
  countEl.textContent = count;
}

chrome.storage.local.get(['byebaiEnabled', 'byebaiBlockedCount'], (res) => {
  const enabled = res.byebaiEnabled !== false;
  const count = res.byebaiBlockedCount || 0;
  render(enabled, count);
});

toggle.addEventListener('change', () => {
  chrome.storage.local.set({ byebaiEnabled: toggle.checked });
  toggleLabel.textContent = toggle.checked ? 'Enabled' : 'Disabled';
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;
  if (changes.byebaiBlockedCount) {
    countEl.textContent = changes.byebaiBlockedCount.newValue || 0;
  }
});
