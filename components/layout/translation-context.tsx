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
  const pathname = usePathname();

  // Use pathname as a key to automatically reset state on navigation.
  // React will unmount/remount the inner provider when the key changes,
  // which resets alternateUrl to null without needing useEffect or refs.
  return (
    <TranslationProviderInner key={pathname}>
      {children}
    </TranslationProviderInner>
  );
}

function TranslationProviderInner({ children }: { children: ReactNode }) {
  const [alternateUrl, setAlternateUrl] = useState<string | null>(null);

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
