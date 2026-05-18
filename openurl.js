const form = document.getElementById('urlForm');
const urlInput = document.getElementById('url');
const urlError = document.getElementById('urlError');
const historyList = document.getElementById('history');

const HISTORY_KEY = 'openurl_history';
const MAX_HISTORY = 5;

function normalizeUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  // Prepend https:// if no protocol provided
  if (!/^https?:\/\//i.test(trimmed)) return 'https://' + trimmed;
  return trimmed;
}

function validateUrl(value) {
  if (!value) return 'Please enter a URL.';
  try {
    new URL(value);
    return '';
  } catch {
    return 'Enter a valid URL (e.g. https://example.com).';
  }
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveHistory(url) {
  const history = loadHistory().filter((u) => u !== url);
  history.unshift(url);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
}

function renderHistory() {
  const history = loadHistory();
  historyList.innerHTML = '';

  if (history.length === 0) return;

  const label = document.createElement('p');
  label.className = 'history-label';
  label.textContent = 'Recently opened';
  historyList.before(label);

  history.forEach((url) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = url;
    li.appendChild(a);
    historyList.appendChild(li);
  });
}

urlInput.addEventListener('input', () => {
  const normalized = normalizeUrl(urlInput.value);
  urlError.textContent = normalized ? validateUrl(normalized) : '';
  urlInput.classList.toggle('invalid', !!urlError.textContent);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const normalized = normalizeUrl(urlInput.value);
  const err = validateUrl(normalized);

  urlError.textContent = err;
  urlInput.classList.toggle('invalid', !!err);

  if (err) return;

  saveHistory(normalized);
  renderHistory();
  window.open(normalized, '_blank', 'noopener,noreferrer');
  urlInput.value = '';
});

renderHistory();
