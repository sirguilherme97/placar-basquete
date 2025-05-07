'use client';

import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useDirection } from '../context/DirContext';
import { FaLinkedin, FaGithub, FaGlobe, FaLanguage } from 'react-icons/fa';
import LanguageSelectorModal from './LanguageSelectorModal';

export default function Footer() {
  const { language, translations } = useLanguage();
  const { direction } = useDirection();
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  return (
    <>
      <footer className="bg-zinc-800 text-white p-4 bottom-0 w-full">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <button
              onClick={() => setIsLanguageModalOpen(true)}
              className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-2 rounded-md cursor-pointer transition-colors"
            >
              <FaLanguage size={20} />
              <span>{translations.languageSelector}</span>
            </button>
          </div>
          
          <div className="flex items-center flex-wrap justify-center gap-4">
            <a 
              href="http://linkedin.com/in/sirguilherme97" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 hover:text-blue-400 transition-colors"
            >
              <FaLinkedin size={20} />
              <span className="text-sm hidden md:inline">LinkedIn</span>
            </a>
            <a 
              href="https://github.com/sirguilherme97/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 hover:text-gray-400 transition-colors"
            >
              <FaGithub size={20} />
              <span className="text-sm hidden md:inline">GitHub</span>
            </a>
            <a 
              href="https://impulse-rs.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 hover:text-green-400 transition-colors"
            >
              <FaGlobe size={20} />
              <span className="text-sm hidden md:inline">{translations.siteOficial}</span>
            </a>
          </div>
        </div>
        
        <div className="text-center mt-4 text-xs text-gray-400">
          © {new Date().getFullYear()} Basketball Scorer - {translations.copy}
        </div>
      </footer>

      <LanguageSelectorModal 
        isOpen={isLanguageModalOpen} 
        onClose={() => setIsLanguageModalOpen(false)} 
      />
    </>
  );
} 