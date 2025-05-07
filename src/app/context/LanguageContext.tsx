'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import pt from '@/translations/pt';
import en from '@/translations/en';
import es from '@/translations/es';
import de from '@/translations/de';
import ru from '@/translations/ru';
import fr from '@/translations/fr';
import zh from '@/translations/zh';
import hi from '@/translations/hi';
import ar from '@/translations/ar';
import ja from '@/translations/ja';
import it from '@/translations/it';
import bn from '@/translations/bn';
import he from '@/translations/he';
import ko from '@/translations/ko';
import id from '@/translations/id';
import tr from '@/translations/tr';
import vi from '@/translations/vi';
import pl from '@/translations/pl';
import th from '@/translations/th';
import fa from '@/translations/fa';

type Language = 'pt' | 'en' | 'es' | 'de' | 'ru' | 'fr' | 'zh' | 'hi' | 'ar' | 'ja' | 'it' | 'bn' | 'he' | 'ko' | 'id' | 'tr' | 'vi' | 'pl' | 'th' | 'fa';
type Translations = typeof pt | typeof en | typeof es | typeof de | typeof ru | typeof fr | typeof zh | typeof hi | typeof ar | typeof ja | typeof it | typeof bn | typeof he | typeof ko | typeof id | typeof tr | typeof vi | typeof pl | typeof th | typeof fa;

interface LanguageContextType {
  language: Language;
  translations: Translations;
  changeLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translations>(en);

  useEffect(() => {
    // Verificar se window está definido (evita erros de SSR)
    if (typeof window !== 'undefined') {
      // Carregar idioma preferido do usuário do localStorage, se disponível
      const savedLanguage = localStorage.getItem('language') as Language | null;
      if (savedLanguage && (savedLanguage === 'pt' || savedLanguage === 'en' || savedLanguage === 'es' || savedLanguage === 'de' || savedLanguage === 'ru' || savedLanguage === 'fr' || savedLanguage === 'zh' || savedLanguage === 'hi' || savedLanguage === 'ar' || savedLanguage === 'ja' || savedLanguage === 'it' || savedLanguage === 'bn' || savedLanguage === 'he' || savedLanguage === 'ko' || savedLanguage === 'id' || savedLanguage === 'tr' || savedLanguage === 'vi' || savedLanguage === 'pl' || savedLanguage === 'th' || savedLanguage === 'fa')) {
        setLanguage(savedLanguage);
        if (savedLanguage === 'pt') {
          setTranslations(pt);
        } else if (savedLanguage === 'en') {
          setTranslations(en);
        } else if (savedLanguage === 'es') {
          setTranslations(es);
        } else if (savedLanguage === 'de') {
          setTranslations(de);
        } else if (savedLanguage === 'ru') {
          setTranslations(ru);
        } else if (savedLanguage === 'fr') {
          setTranslations(fr);
        } else if (savedLanguage === 'zh') {
          setTranslations(zh);
        } else if (savedLanguage === 'hi') {
          setTranslations(hi);
        } else if (savedLanguage === 'ar') {
          setTranslations(ar);
        } else if (savedLanguage === 'ja') {
          setTranslations(ja);
        } else if (savedLanguage === 'it') {
          setTranslations(it);
        } else if (savedLanguage === 'bn') {
          setTranslations(bn);
        } else if (savedLanguage === 'he') {
          setTranslations(he);
        } else if (savedLanguage === 'ko') {
          setTranslations(ko);
        } else if (savedLanguage === 'id') {
          setTranslations(id);
        } else if (savedLanguage === 'tr') {
          setTranslations(tr);
        } else if (savedLanguage === 'vi') {
          setTranslations(vi);
        } else if (savedLanguage === 'pl') {
          setTranslations(pl);
        } else if (savedLanguage === 'th') {
          setTranslations(th);
        } else if (savedLanguage === 'fa') {
          setTranslations(fa);
        }
      }
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    if (lang === 'pt') {
      setTranslations(pt);
    } else if (lang === 'en') {
      setTranslations(en);
    } else if (lang === 'es') {
      setTranslations(es);
    } else if (lang === 'de') {
      setTranslations(de);
    } else if (lang === 'ru') {
      setTranslations(ru);
    } else if (lang === 'fr') {
      setTranslations(fr);
    } else if (lang === 'zh') {
      setTranslations(zh);
    } else if (lang === 'hi') {
      setTranslations(hi);
    } else if (lang === 'ar') {
      setTranslations(ar);
    } else if (lang === 'ja') {
      setTranslations(ja);
    } else if (lang === 'it') {
      setTranslations(it);
    } else if (lang === 'bn') {
      setTranslations(bn);
    } else if (lang === 'he') {
      setTranslations(he);
    } else if (lang === 'ko') {
      setTranslations(ko);
    } else if (lang === 'id') {
      setTranslations(id);
    } else if (lang === 'tr') {
      setTranslations(tr);
    } else if (lang === 'vi') {
      setTranslations(vi);
    } else if (lang === 'pl') {
      setTranslations(pl);
    } else if (lang === 'th') {
      setTranslations(th);
    } else if (lang === 'fa') {
      setTranslations(fa);
    }
    
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