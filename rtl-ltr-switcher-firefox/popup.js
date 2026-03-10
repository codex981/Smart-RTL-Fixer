const translations = {
  en: { title: "Direction Switcher", rtl: "Switch to RTL", ltr: "Switch to LTR", auto: "Auto (Default)", smart: "Smart Fix", settings: "Settings", save: "Save", selectLang: "Select Language", saveSite: "Save for this site" },
  ar: { title: "مُبدّل الاتجاه", rtl: "يمين لليسار (RTL)", ltr: "يسار لليمين (LTR)", auto: "تلقائي", smart: "إصلاح ذكي (Smart Fix)", settings: "الإعدادات", save: "حفظ", selectLang: "اختر اللغة", saveSite: "حفظ التغييرات لهذا الموقع" },
  he: { title: "מחליף כיוון", rtl: "ימין לשמאל (RTL)", ltr: "שמאל לימין (LTR)", auto: "אוטומטי", smart: "תיקון חכם (Smart Fix)", settings: "הגדרות", save: "שמור", selectLang: "בחר שפה", saveSite: "שמור עבור אתר זה" },
  fa: { title: "تغییر جهت", rtl: "راست به چپ (RTL)", ltr: "چپ به راست (LTR)", auto: "خودکار", smart: "اصلاح هوشمند (Smart Fix)", settings: "تنظیمات", save: "ذخیره", selectLang: "انتخاب زبان", saveSite: "ذخیره برای این سایت" },
  ur: { title: "سمت تبدیل کریں", rtl: "دائیں سے بائیں (RTL)", ltr: "بائیں سے دائیں (LTR)", auto: "خودکار", smart: "اسمارٹ فکس", settings: "ترتیبات", save: "محفوظ کریں", selectLang: "زبان منتخب کریں", saveSite: "اس سائٹ کے لیے محفوظ کریں" },
  ku: { title: "گۆڕینی ئاراستە", rtl: "ڕاست بۆ چەپ (RTL)", ltr: "چەپ بۆ ڕاست (LTR)", auto: "خۆکار", smart: "چاکسازی زیرەک", settings: "ڕێکخستنەکان", save: "پاشەکەوت", selectLang: "زمان هەڵبژێرە", saveSite: "پاشەکەوت بکە بۆ ئەم سایتە" },
  az: { title: "İstiqamət Dəyişdirici", rtl: "Sağdan Sola (RTL)", ltr: "Soldan Sağa (LTR)", auto: "Avtomatik", smart: "Ağıllı Düzəliş (Smart Fix)", settings: "Parametrlər", save: "Yadda saxla", selectLang: "Dil seçin", saveSite: "Bu sayt üçün yadda saxla" },
  dv: { title: "ޑިރެކްޝަން ބަދަލުކުރާ", rtl: "ކަނާތުން ވާތަށް (RTL)", ltr: "ވާތުން ކަނާތަށް (LTR)", auto: "އޮޓޯ", smart: "ސްމާޓް ފިކްސް", settings: "ސެޓިންގްސް", save: "ސޭވް", selectLang: "ބަސް ޚިޔާރުކުރައްވާ", saveSite: "މި ސައިޓަށް ސޭވްކުރޭ" },
  arc: { title: "ܡܚܠܦܢܐ ܕܨܘܒܐ", rtl: "ܝܡܝܢܐ ܠܣܡܠܐ (RTL)", ltr: "ܣܡܠܐ ܠܝܡܝܢܐ (LTR)", auto: "ܐܘܛܘܡܛܝܩܝ", smart: "ܬܘܩܢܐ ܚܟܝܡܐ (Smart Fix)", settings: "ܛܘܝܒ̈ܐ", save: "ܚܡܝ", selectLang: "ܓܒܝ ܠܫܢܐ", saveSite: "ܚܡܝ ܠܗܢܐ ܫܘܦܐ" }
};

const apiNamespace = browser;
const storage = apiNamespace.storage.local;

const mainView = document.getElementById('main-view');
const settingsView = document.getElementById('settings-view');
const langSelect = document.getElementById('lang-select');

const elTitleMain = document.getElementById('title-main');
const elTitleSettings = document.getElementById('title-settings');
const elBtnRtl = document.getElementById('btn-rtl');
const elBtnLtr = document.getElementById('btn-ltr');
const elBtnAuto = document.getElementById('btn-auto');
const elBtnSmart = document.getElementById('btn-smart');
const elBtnSettings = document.getElementById('btn-settings');
const elBtnSaveLang = document.getElementById('btn-save-lang');
const elBtnTheme = document.getElementById('btn-theme');
const elToggleSaveSite = document.getElementById('toggle-save-site');
const elLabelSaveSite = document.getElementById('label-save-site');

let currentTheme = 'light';
let currentHost = '';
let currentDir = 'auto';

// Get current tab host
apiNamespace.tabs.query({ active: true, currentWindow: true }).then(tabs => {
  if (tabs[0] && tabs[0].url) {
    try {
      const url = new URL(tabs[0].url);
      currentHost = url.hostname;
      storage.get(['siteSettings'], (result) => {
        const settings = result.siteSettings || {};
        if (settings[currentHost]) {
          elToggleSaveSite.checked = true;
          currentDir = settings[currentHost];
        }
      });
    } catch (e) { }
  }
});

elToggleSaveSite.addEventListener('change', (e) => {
  if (!currentHost) return;
  storage.get(['siteSettings'], (result) => {
    const settings = result.siteSettings || {};
    if (e.target.checked) {
      settings[currentHost] = currentDir;
    } else {
      delete settings[currentHost];
    }
    storage.set({ siteSettings: settings });
  });
});

function applyTheme(theme) {
  currentTheme = theme;
  if (theme === 'dark') {
    document.body.classList.add('dark');
    elBtnTheme.textContent = '☀️';
  } else {
    document.body.classList.remove('dark');
    elBtnTheme.textContent = '🌙';
  }
}

elBtnTheme.addEventListener('click', () => {
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  storage.set({ appTheme: newTheme }, () => applyTheme(newTheme));
});

function detectLanguage() {
  const navLang = navigator.language.split('-')[0];
  const supported = ['ar', 'he', 'fa', 'ur', 'ku', 'az', 'dv', 'arc', 'en'];
  return supported.includes(navLang) ? navLang : 'en';
}

function applyTranslations(lang) {
  const t = translations[lang] || translations['en'];
  elTitleMain.textContent = t.title;
  elTitleSettings.textContent = t.selectLang;
  elBtnRtl.textContent = t.rtl;
  elBtnLtr.textContent = t.ltr;
  elBtnAuto.textContent = t.auto;
  if (elBtnSmart) elBtnSmart.textContent = t.smart || "Smart Fix";
  elBtnSettings.title = t.settings;
  elBtnSaveLang.textContent = t.save;
  elLabelSaveSite.textContent = t.saveSite;

  const isRtl = ['ar', 'he', 'fa', 'ur', 'ku', 'dv', 'arc'].includes(lang);
  document.body.dir = isRtl ? 'rtl' : 'ltr';
}

function showMainView(lang) {
  applyTranslations(lang);
  settingsView.classList.add('hidden');
  mainView.classList.remove('hidden');
}

function showSettingsView(currentLang) {
  langSelect.value = currentLang || detectLanguage();
  applyTranslations(langSelect.value);
  mainView.classList.add('hidden');
  settingsView.classList.remove('hidden');
}

langSelect.addEventListener('change', (e) => {
  applyTranslations(e.target.value);
});

storage.get(['appLang', 'appTheme'], (result) => {
  if (result.appTheme) {
    applyTheme(result.appTheme);
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  if (result.appLang) {
    showMainView(result.appLang);
  } else {
    showSettingsView();
  }
});

elBtnSettings.addEventListener('click', () => {
  storage.get(['appLang'], (result) => showSettingsView(result.appLang));
});

elBtnSaveLang.addEventListener('click', () => {
  const selectedLang = langSelect.value;
  storage.set({ appLang: selectedLang }, () => {
    showMainView(selectedLang);
  });
});

async function setDirection(dir) {
  currentDir = dir;
  try {
    const tabs = await apiNamespace.tabs.query({ active: true, currentWindow: true });
    if (!tabs[0] || !tabs[0].id) return;

    if (elToggleSaveSite.checked && currentHost) {
      storage.get(['siteSettings'], (result) => {
        const settings = result.siteSettings || {};
        settings[currentHost] = dir;
        storage.set({ siteSettings: settings });
      });
    }

    await apiNamespace.tabs.sendMessage(tabs[0].id, { action: 'setDirection', direction: dir }).catch(async () => {
      // Fallback if content script is not loaded
      await apiNamespace.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: (direction) => {
          document.documentElement.setAttribute('dir', direction);
          if (direction === 'rtl') {
            document.documentElement.classList.add('rtl-fix-active');
          } else {
            document.documentElement.classList.remove('rtl-fix-active');
          }
        },
        args: [dir]
      });
    });
  } catch (err) {
    console.error('Failed to switch direction:', err);
  }
}

elBtnRtl.addEventListener('click', () => setDirection('rtl'));
elBtnLtr.addEventListener('click', () => setDirection('ltr'));
elBtnAuto.addEventListener('click', () => setDirection('auto'));
elBtnSmart.addEventListener('click', () => setDirection('smart'));