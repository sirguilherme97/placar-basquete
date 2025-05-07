'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import pt from '@/translations/pt';
import en from '@/translations/en';

type Language = 'pt' | 'en';
type Translations = typeof pt | typeof en;

interface LanguageContextType {
  language: Language;
  translations: Translations;
  changeLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('pt');
  const [translations, setTranslations] = useState<Translations>(pt);

  useEffect(() => {
    // Verificar se window está definido (evita erros de SSR)
    if (typeof window !== 'undefined') {
      // Carregar idioma preferido do usuário do localStorage, se disponível
      const savedLanguage = localStorage.getItem('language') as Language | null;
      if (savedLanguage && (savedLanguage === 'pt' || savedLanguage === 'en')) {
        setLanguage(savedLanguage);
        setTranslations(savedLanguage === 'pt' ? pt : en);
      }
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    setTranslations(lang === 'pt' ? pt : en);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, translations, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 