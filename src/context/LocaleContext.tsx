"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import type { Locale } from "@/lib/i18n";
import fr from "../../messages/fr.json";
import en from "../../messages/en.json";

const messages = { fr, en };

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  tArray: <T>(key: string) => T[];
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "fr",
  setLocale: () => {},
  t: (k) => k,
  tArray: () => [],
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    document.documentElement.lang = l;
  }, []);

  const t = useCallback(
    (key: string): string => {
      const parts = key.split(".");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let val: any = messages[locale];
      for (const part of parts) {
        val = val?.[part];
      }
      return typeof val === "string" ? val : key;
    },
    [locale]
  );

  const tArray = useCallback(
    <T,>(key: string): T[] => {
      const parts = key.split(".");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let val: any = messages[locale];
      for (const part of parts) {
        val = val?.[part];
      }
      return Array.isArray(val) ? val : [];
    },
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, tArray }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
