'use client';

import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { language, changeLanguage, translations } = useLanguage();

  return (
    <footer className="bg-zinc-800 text-white p-4  fixed bottom-0 w-full flex justify-center items-center">
      <div className="flex items-center space-x-2">
        <span>{translations.languageSelector}:</span>
        <select
          value={language}
          onChange={(e) => changeLanguage(e.target.value as 'pt' | 'en')}
          className="bg-zinc-700 text-white px-2 py-1 rounded-md cursor-pointer"
        >
          <option value="pt">Português</option>
          <option value="en">English</option>
        </select>
      </div>
    </footer>
  );
} 