"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "de" | "en";

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (de: string, en?: string) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("de");

  // 1x initial: URL ?lang lesen
  useEffect(() => {
    if (typeof window === "undefined") return;
    const qp = new URLSearchParams(window.location.search).get("lang");
    if (qp === "de" || qp === "en") {
      setLangState(qp);
    }
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);

    // URL aktualisieren, ohne Reload
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", next);
      window.history.replaceState(null, "", url.toString());
    }
  };

  const t = (de: string, en?: string) => (lang === "de" ? de : en ?? de);

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LangContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
