// Auto-apply saved direction on page load
chrome.storage.local.get(['siteSettings'], (result) => {
  const settings = result.siteSettings || {};
  const host = window.location.hostname;
  if (settings[host]) {
    const dir = settings[host];
    if (dir === 'rtl' || dir === 'ltr' || dir === 'smart' || dir === 'deep') {
      applyDirection(dir);
    }
  }
});

// ---------------------------------------------------------------------------
// Main direction dispatcher
// ---------------------------------------------------------------------------
function applyDirection(dir) {
  // Clean slate — remove all previous modes first
  removeSmartFix();
  removeRTLFixes();
  document.documentElement.classList.remove('rtl-fix-active', 'smart-fix-active');

  if (dir === 'smart') {
    document.documentElement.removeAttribute('dir');
    applySmartFix();
  } else if (dir === 'deep') {
    document.documentElement.removeAttribute('dir');
    applyDeepFix();
  } else {
    document.documentElement.setAttribute('dir', dir);
    if (dir === 'rtl') {
      document.documentElement.classList.add('rtl-fix-active');
      injectRTLFixes();
    }
  }
}

// ---------------------------------------------------------------------------
// RTL mode — full page flip with code-block protection
// ---------------------------------------------------------------------------
function injectRTLFixes() {
  if (document.getElementById('rtl-switcher-fixes')) return;
  const style = document.createElement('style');
  style.id = 'rtl-switcher-fixes';
  style.textContent = `
    .rtl-fix-active pre,
    .rtl-fix-active code,
    .rtl-fix-active .code-block {
      direction: ltr !important;
      text-align: left !important;
    }
  `;
  // Firefox safe injection
  if (document.head) {
    document.head.appendChild(style);
  } else {
    document.addEventListener('DOMContentLoaded', () => document.head.appendChild(style));
  }
}

function removeRTLFixes() {
  const style = document.getElementById('rtl-switcher-fixes');
  if (style) style.remove();
}

// ---------------------------------------------------------------------------
// SMART FIX — unicode-bidi: plaintext on targeted text elements
//
// Works like: document.querySelectorAll('*').forEach(e => e.style.unicodeBidi = 'plaintext')
// but as a targeted CSS injection — no layout breakage, auto-applies to new DOM nodes,
// and is cleanly reversible by removing the <style> tag.
// ---------------------------------------------------------------------------

/**
 * Returns the CSS selector scope for Smart Fix based on the current site.
 * Prefer stable attributes/ids over obfuscated class names.
 */
function getSmartFixScope() {
  const host = window.location.hostname;

  if (host.includes('google.')) {
    // Google Search — target result area precisely using stable data attributes & IDs
    // Avoids obfuscated class names like Y3BBE/VjHub that change each deploy
    return [
      '#search span',
      '#search h3',
      '#search p',
      '#rso span',
      '#rso h3',
      '#rso p',
      '[data-hveid] span',
      '[data-hveid] h3',
      '[data-hveid] p',
      '[data-sfc-cp] span',
      '[data-sfc-cp] p',
      '[data-processed] span',
      'input[name="q"]',
      'textarea[name="q"]',
    ];
  }

  if (host.includes('chatgpt.com') || host.includes('chat.openai.com')) {
    return ['.prose p', '.prose li', '.prose h1', '.prose h2', '.prose h3', 'textarea'];
  }

  if (host.includes('claude.ai')) {
    return ['[data-is-streaming] p', '[class*="prose"] p', 'textarea'];
  }

  // Generic fallback — broad but still limited to text containers
  return [
    'p', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'span', 'td', 'th', 'label', 'blockquote',
    'textarea', 'input[type="text"]',
  ];
}

function applySmartFix() {
  if (document.getElementById('smart-fix-styles')) return;
  document.documentElement.classList.add('smart-fix-active');

  const scope = getSmartFixScope().join(',\n  ');

  const style = document.createElement('style');
  style.id = 'smart-fix-styles';
  style.textContent = `
  /* Smart Fix — per-element text direction via unicode-bidi: plaintext
     Equivalent to: document.querySelectorAll('*').forEach(e => e.style.unicodeBidi = 'plaintext')
     but surgical, CSS-based, and auto-applies to dynamic/streamed content. */
  ${scope} {
    unicode-bidi: plaintext !important;
  }

  /* Always protect code blocks — they must stay LTR */
  html.smart-fix-active pre,
  html.smart-fix-active code,
  html.smart-fix-active code * {
    unicode-bidi: normal !important;
    direction: ltr !important;
    text-align: left !important;
  }
  `;

  // Firefox safe injection
  if (document.head) {
    document.head.appendChild(style);
  } else {
    document.addEventListener('DOMContentLoaded', () => document.head.appendChild(style));
  }
}

function removeSmartFix() {
  document.documentElement.classList.remove('smart-fix-active');
  const s1 = document.getElementById('smart-fix-styles');
  if (s1) s1.remove();
  const s2 = document.getElementById('deep-fix-styles');
  if (s2) s2.remove();
}

// ---------------------------------------------------------------------------
// DEEP FIX — nuclear option: unicode-bidi: plaintext on ALL elements
//
// Mirrors exactly: document.querySelectorAll('*').forEach(e => e.style.unicodeBidi = 'plaintext')
// Useful when Smart Fix scope isn't enough (e.g. very custom site layouts).
// ---------------------------------------------------------------------------
function applyDeepFix() {
  if (document.getElementById('deep-fix-styles')) return;
  document.documentElement.classList.add('smart-fix-active');

  const style = document.createElement('style');
  style.id = 'deep-fix-styles';
  style.textContent = `
  /* Deep Fix — applies unicode-bidi: plaintext to every element on the page.
     Equivalent to the console snippet:
       document.querySelectorAll('*').forEach(e => e.style.unicodeBidi = 'plaintext')
     but CSS-based so it persists for dynamically loaded content. */
  * {
    unicode-bidi: plaintext !important;
  }

  /* Protect code blocks */
  pre, code, pre *, code * {
    unicode-bidi: normal !important;
    direction: ltr !important;
    text-align: left !important;
  }
  `;

  // Firefox safe injection
  if (document.head) {
    document.head.appendChild(style);
  } else {
    document.addEventListener('DOMContentLoaded', () => document.head.appendChild(style));
  }
}

// ---------------------------------------------------------------------------
// Message listener — receives commands from popup.js
// ---------------------------------------------------------------------------
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'setDirection') {
    applyDirection(request.direction);
    sendResponse({ success: true });
  }
});