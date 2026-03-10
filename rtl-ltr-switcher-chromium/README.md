# 🌐 Web Page Fixer: RTL/LTR (Chromium Edition)

A powerful, privacy-first, zero-lag browser extension designed to fix Right-to-Left (RTL) text formatting (Arabic, Hebrew, Persian) on modern AI streaming platforms like LM Arena, ChatGPT, Claude, and Google AI Studio. 

This specific version is built and optimized for **Google Chrome, Microsoft Edge, Brave, and other Chromium-based browsers**.

---

## ✨ Core Features
- **Smart RTL Mode:** Dynamically forces `dir="auto"` specifically on chat bubbles and paragraphs, letting the browser naturally align mixed RTL/LTR text without altering the root `<html>` direction.
- **Code Block Immunity:** 🛡️ Strictly protects `<pre>` and `<code>` blocks, ensuring your syntax highlighting and left-to-right code alignments remain perfectly intact.
- **Extreme Performance:** Implements a highly optimized 250ms debounced `MutationObserver`. It waits for React/Gradio to finish rapidly streaming text chunks before safely sweeping the DOM, saving your CPU and battery from infinite render loops.
- **Edge Iframe Support:** Utilizes `match_about_blank` and localized fallback intervals to ensure the extension reliably docks into deeply nested, `about:blank` streaming side-by-side iframes (crucial for LM Arena on Microsoft Edge).
- **Zero-Layout Breakage:** Aggressively untangles stubborn CSS frameworks (like Tailwind `.prose`) using nuclear specificity so sidebars, absolute buttons, and flex row margins don't overlap when flipped.

---

## 🛡️ Absolute Transparency & Permissions
We believe in 100% open-source transparency. **This extension collects ZERO user data, runs no analytics, and connects to NO external servers.**

To function seamlessly, the extension requires the following permissions in `manifest.json`:
- `"storage"`: Used exclusively and locally on your machine to save your toggle preference (RTL/LTR/Smart) per website domain.
- `"<all_urls>"` (Host Permission): **Critical for AI Platforms.** Many AI tools (especially LM Arena) render their chat models inside dynamic, cross-origin iframes. This permission allows the script to reach inside the active tab's nested iframes to align the text. 

---

## 💻 Tech Stack
- **JavaScript (Vanilla JS):** Zero external libraries. Pure, lightning-fast DOM manipulation.
- **Manifest V3:** The latest, most secure standard for browser extensions.
- **CSS3:** Nuclear-specificity injection to override rigid framework alignments.

---

## 🚀 Installation Guide (Manual Sideloading)

1. Download this directory or the source code.
2. Open your Chromium-based browser (Chrome, Edge, Brave) and navigate to the Extensions page (`chrome://extensions/` or `edge://extensions/`).
3. Enable **"Developer mode"** (usually a toggle in the top right corner).
4. Click the **"Load unpacked"** button.
5. Select this exact folder (`rtl-ltr-switcher-chromium`).
6. The extension is installed! Pin it to your toolbar for easy access.
