'use client';

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';

type Direction = 'ltr' | 'rtl';

interface DirContextType {
  direction: Direction;
}

const DirContext = createContext<DirContextType | undefined>(undefined);

export function DirProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const [direction, setDirection] = useState<Direction>('ltr');

  useEffect(() => {
    // Definir RTL para árabe, hebraico e persa
    if (language === 'ar' || language === 'he' || language === 'fa') {
      setDirection('rtl');
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = language;
    } else {
      setDirection('ltr');
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  return (
    <DirContext.Provider value={{ direction }}>
      {children}
    </DirContext.Provider>
  );
}

export function useDirection(): DirContextType {
  const context = useContext(DirContext);
  if (!context) {
    throw new Error('useDirection must be used within a DirProvider');
  }
  return context;
} 