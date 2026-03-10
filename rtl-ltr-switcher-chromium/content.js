// Auto-apply saved direction
chrome.storage.local.get(['siteSettings'], (result) => {
  const settings = result.siteSettings || {};
  const host = window.location.hostname;
  if (settings[host]) {
    const dir = settings[host];
    if (dir === 'rtl' || dir === 'ltr' || dir === 'smart') {
      applyDirection(dir);
    }
  }
});

let smartRtlObserver = null;
let smartModifiedElements = new Set(); // Track modified elements for clean cleanup

function applyDirection(dir) {
  // Always clean up previous modes
  removeSmartFix();
  document.documentElement.classList.remove('rtl-fix-active');

  if (dir === 'smart') {
    document.documentElement.removeAttribute('dir');
    applySmartFix();
  } else {
    document.documentElement.setAttribute('dir', dir);
    if (dir === 'rtl') {
      document.documentElement.classList.add('rtl-fix-active');
      injectRTLFixes();
    } else {
      removeRTLFixes();
    }
  }
}

function injectRTLFixes() {
  if (document.getElementById('rtl-switcher-fixes')) return;
  const style = document.createElement('style');
  style.id = 'rtl-switcher-fixes';
  style.textContent = `
    /* Smart RTL Fixes for common layout breaks */
    .rtl-fix-active pre, 
    .rtl-fix-active code, 
    .rtl-fix-active .code-block {
      direction: ltr !important;
      text-align: left !important;
    }
    /* Fix for AI Studio and similar apps where sidebars break */
    .rtl-fix-active mat-sidenav,
    .rtl-fix-active aside,
    .rtl-fix-active .sidebar {
      /* Try to keep sidebars behaving normally */
    }
  `;
  if (document.head) {
    document.head.appendChild(style);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.head.appendChild(style);
    });
  }
}

function removeRTLFixes() {
  const style = document.getElementById('rtl-switcher-fixes');
  if (style) style.remove();
}

function injectSmartFixStyles() {
  if (document.getElementById('smart-fix-styles')) return;
  const style = document.createElement('style');
  style.id = 'smart-fix-styles';
  style.textContent = `
    html.smart-fix-active body pre, 
    html.smart-fix-active body code {
      direction: ltr !important;
      text-align: left !important;
    }
  `;
  document.head.appendChild(style);
}

function removeSmartFixStyles() {
  const style = document.getElementById('smart-fix-styles');
  if (style) style.remove();
}

let smartDebounceTimer = null;
let smartIntervalTimer = null;

function applySmartFix() {
  document.documentElement.classList.add('smart-fix-active');
  injectSmartFixStyles();

  const selectors = '.prose p, div[class*="prose"], textarea, input[type="text"]';

  const enforceDirAuto = () => {
    document.querySelectorAll(selectors).forEach(el => {
      if (el.getAttribute('dir') !== 'auto' && el.tagName !== 'PRE' && el.tagName !== 'CODE') {
        el.setAttribute('dir', 'auto');
        smartModifiedElements.add(el);
      }
    });
  };

  enforceDirAuto();

  smartRtlObserver = new MutationObserver(() => {
    if (smartDebounceTimer) clearTimeout(smartDebounceTimer);
    smartDebounceTimer = setTimeout(() => {
      enforceDirAuto();
    }, 250);
  });

  smartRtlObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  smartIntervalTimer = setInterval(enforceDirAuto, 2000);
}

function removeSmartFix() {
  document.documentElement.classList.remove('smart-fix-active');
  removeSmartFixStyles();

  if (smartRtlObserver) {
    smartRtlObserver.disconnect();
    smartRtlObserver = null;
  }

  if (smartDebounceTimer) {
    clearTimeout(smartDebounceTimer);
    smartDebounceTimer = null;
  }

  if (smartIntervalTimer) {
    clearInterval(smartIntervalTimer);
    smartIntervalTimer = null;
  }

  // Cleanly remove dir="auto" from elements we dynamically modified
  smartModifiedElements.forEach(node => {
    if (node && node.getAttribute('dir') === 'auto') {
      node.removeAttribute('dir');
    }
  });
  smartModifiedElements.clear();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'setDirection') {
    applyDirection(request.direction);
    sendResponse({ success: true });
  }
});