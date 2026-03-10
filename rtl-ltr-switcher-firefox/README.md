# 🌐 Web Page Fixer: RTL/LTR (Firefox Edition)

A powerful, privacy-first, zero-lag browser extension designed to fix Right-to-Left (RTL) text formatting (Arabic, Hebrew, Persian,....etc) on modern AI streaming platforms like LM Arena, ChatGPT, Claude, and Google AI Studio. 

This specific version is built and safely validated for **Mozilla Firefox (Desktop & Android v142+)**.

---

## ✨ Core Features
- **Smart RTL Mode:** Dynamically forces `dir="auto"` specifically on chat bubbles and paragraphs, letting the browser naturally align mixed RTL/LTR text without altering the root `<html>` direction.
- **Code Block Immunity:** 🛡️ Strictly protects `<pre>` and `<code>` blocks, ensuring your syntax highlighting and left-to-right code alignments remain perfectly intact.
- **Extreme Performance:** Implements a highly optimized 250ms debounced `MutationObserver`. It waits for React/Gradio to finish rapidly streaming text chunks before safely sweeping the DOM, saving your CPU and battery from infinite render loops.
- **Iframe Support:** Utilizes `match_about_blank` to ensure the extension reliably docks into deeply nested, `about:blank` streaming side-by-side iframes (crucial for LM Arena).
- **Zero-Layout Breakage:** Aggressively untangles stubborn CSS frameworks (like Tailwind `.prose`) using nuclear specificity so sidebars, absolute buttons, and flex row margins don't overlap when flipped.

---

## 🛡️ Absolute Transparency & Permissions
We believe in 100% open-source transparency. **This extension collects ZERO user data, runs no analytics, and connects to NO external servers.** In accordance with strict Mozilla AMO guidelines, our `manifest.json` strictly declares `data_collection_permissions: none`.

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
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
3. Click **"Load Temporary Add-on..."**.
4. Select the `manifest.json` file inside this exact folder (`rtl-ltr-switcher-firefox`).
5. The extension is now active and ready to use! *(Note: Temporary add-ons in Firefox must be re-loaded if you restart the browser).*
