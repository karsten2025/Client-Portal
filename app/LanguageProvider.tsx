"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Lang, normalizeLang, t as tBase } from "./lib/i18n";

type LangContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
};

const LangContext = createContext<LangContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("de");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("lang");
    if (stored) {
      setLangState(normalizeLang(stored));
    }
  }, []);

  function setLang(next: Lang) {
    setLangState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("lang", next);
    }
  }

  return (
    <LangContext.Provider
      value={{
        lang,
        setLang,
        t: (key: string) => tBase(lang, key),
      }}
    >
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
