"use client";

import { useLanguage } from "../lang/LanguageContext";

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        type="button"
        onClick={() => setLang("de")}
        className={
          lang === "de"
            ? "font-semibold text-slate-900"
            : "text-slate-500 hover:text-slate-900"
        }
      >
        DE
      </button>
      <span className="text-slate-400">|</span>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={
          lang === "en"
            ? "font-semibold text-slate-900"
            : "text-slate-500 hover:text-slate-900"
        }
      >
        EN
      </button>
    </div>
  );
}
