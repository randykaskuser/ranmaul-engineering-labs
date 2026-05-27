"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";

type TranslationContextType = {
  alternateUrl: string | null;
  setAlternateUrl: (url: string | null) => void;
};

const TranslationContext = createContext<TranslationContextType>({
  alternateUrl: null,
  setAlternateUrl: () => {},
});

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [alternateUrl, setAlternateUrl] = useState<string | null>(null);
  const pathname = usePathname();

  // Reset alternate URL when pathname changes to avoid stale URLs on navigation
  useEffect(() => {
    setAlternateUrl(null);
  }, [pathname]);

  return (
    <TranslationContext.Provider value={{ alternateUrl, setAlternateUrl }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslationContext() {
  return useContext(TranslationContext);
}

export function TranslationSetter({ alternateUrl }: { alternateUrl: string | null }) {
  const { setAlternateUrl } = useTranslationContext();
  
  useEffect(() => {
    setAlternateUrl(alternateUrl);
    return () => setAlternateUrl(null);
  }, [alternateUrl, setAlternateUrl]);
  
  return null;
}
