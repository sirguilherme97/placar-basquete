'use client';

import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Image from 'next/image';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

export default function LanguageSelectorModal({ isOpen, onClose }: LanguageSelectorModalProps) {
  const { language, changeLanguage, translations } = useLanguage();
  
  const languageOptions: LanguageOption[] = [
    { code: 'ar', name: 'العربية', flag: 'https://flagcdn.com/w40/sa.png' },
    { code: 'bn', name: 'বাংলা', flag: 'https://flagcdn.com/w40/bd.png' },
    { code: 'id', name: 'Bahasa Indonesia', flag: 'https://flagcdn.com/w40/id.png' },
    { code: 'de', name: 'Deutsch', flag: 'https://flagcdn.com/w40/de.png' },
    { code: 'en', name: 'English', flag: 'https://flagcdn.com/w40/gb.png' },
    { code: 'es', name: 'Español', flag: 'https://flagcdn.com/w40/es.png' },
    { code: 'fa', name: 'فارسی', flag: 'https://flagcdn.com/w40/ir.png' },
    { code: 'fr', name: 'Français', flag: 'https://flagcdn.com/w40/fr.png' },
    { code: 'he', name: 'עברית', flag: 'https://flagcdn.com/w40/il.png' },
    { code: 'hi', name: 'हिन्दी', flag: 'https://flagcdn.com/w40/in.png' },
    { code: 'it', name: 'Italiano', flag: 'https://flagcdn.com/w40/it.png' },
    { code: 'ja', name: '日本語', flag: 'https://flagcdn.com/w40/jp.png' },
    { code: 'ko', name: '한국어', flag: 'https://flagcdn.com/w40/kr.png' },
    { code: 'pl', name: 'Polski', flag: 'https://flagcdn.com/w40/pl.png' },
    { code: 'pt', name: 'Português', flag: 'https://flagcdn.com/w40/br.png' },
    { code: 'ru', name: 'Русский', flag: 'https://flagcdn.com/w40/ru.png' },
    { code: 'th', name: 'ภาษาไทย', flag: 'https://flagcdn.com/w40/th.png' },
    { code: 'tr', name: 'Türkçe', flag: 'https://flagcdn.com/w40/tr.png' },
    { code: 'vi', name: 'Tiếng Việt', flag: 'https://flagcdn.com/w40/vn.png' },
    { code: 'zh', name: '中文', flag: 'https://flagcdn.com/w40/cn.png' },
  ];
  
  if (!isOpen) return null;

  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-zinc-700">
          <h2 className="text-xl font-semibold text-white">{translations.languageSelector}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {languageOptions.map((option) => (
            <button
              key={option.code}
              className={`flex items-center p-2 rounded-md transition-colors ${
                language === option.code ? 'bg-blue-600 text-white' : 'bg-zinc-700 hover:bg-zinc-600 text-gray-200'
              }`}
              onClick={() => handleLanguageChange(option.code)}
            >
              <div className="flex-shrink-0 w-10 h-6 relative mr-3 shadow overflow-hidden rounded">
                <Image
                  src={option.flag}
                  alt={`${option.name} flag`}
                  layout="fill"
                  objectFit="cover"
                  unoptimized
                />
              </div>
              <span dir={option.code === 'ar' || option.code === 'he' || option.code === 'fa' ? 'rtl' : 'ltr'}>
                {option.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 