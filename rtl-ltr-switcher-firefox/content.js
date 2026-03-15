chrome.storage.local.get(['siteSettings', 'autoApply'], r => {
  if (r.autoApply === false) return; // auto-apply disabled — wait for manual click
  const dir = (r.siteSettings || {})[location.hostname];
  if (dir) applyDirection(dir);
});

function applyDirection(dir) {
  cleanup();
  if (dir === 'smart' || dir === 'deep') {
    document.documentElement.removeAttribute('dir');
    inject(dir === 'deep' ? 'deep-fix' : 'smart-fix', dir === 'deep' ? deepCSS() : smartCSS());
  } else {
    document.documentElement.setAttribute('dir', dir);
    if (dir === 'rtl') inject('rtl-fix', 'html[dir=rtl] pre,html[dir=rtl] code{direction:ltr!important;text-align:left!important}');
  }
}

function cleanup() {
  ['rtl-fix', 'smart-fix', 'deep-fix'].forEach(id => { const s = document.getElementById(id); if (s) s.remove(); });
}

function inject(id, css) {
  if (document.getElementById(id)) return;
  const s = Object.assign(document.createElement('style'), { id, textContent: css });
  if (document.head) {
    document.head.appendChild(s);
  } else {
    document.addEventListener('DOMContentLoaded', () => document.head.appendChild(s), { once: true });
  }
}

function smartCSS() {
  const h = location.hostname;
  const sel = h.includes('google.')
    ? '#search span,#search h3,#search p,[data-hveid] span,[data-hveid] p,[data-sfc-cp] span,input[name=q],textarea[name=q]'
    : (h.includes('chatgpt.com') || h.includes('openai.com'))
    ? '.prose p,.prose li,.prose h1,.prose h2,.prose h3,textarea'
    : h.includes('claude.ai')
    ? '[data-is-streaming] p,[class*=prose] p,textarea'
    : 'p,li,h1,h2,h3,h4,h5,h6,span,td,th,label,blockquote,textarea';
  return sel + '{unicode-bidi:plaintext!important}' + codeGuard();
}

function deepCSS() {
  return '*{unicode-bidi:plaintext!important}' + codeGuard();
}

function codeGuard() {
  return 'pre,code,pre *,code *{unicode-bidi:normal!important;direction:ltr!important;text-align:left!important}';
}

chrome.runtime.onMessage.addListener((req, _, res) => {
  if (req.action === 'setDirection') { applyDirection(req.direction); res({ success: true }); }
});