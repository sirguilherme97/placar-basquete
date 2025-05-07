'use client';

import { useLanguage } from '../context/LanguageContext';
import { FaLinkedin, FaInstagram, FaGithub, FaGlobe } from 'react-icons/fa';

export default function Footer() {
  const { language, changeLanguage, translations } = useLanguage();

  return (
    <footer className="bg-zinc-800 text-white p-4 bottom-0 w-full">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
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
        
        <div className="flex items-center flex-wrap justify-center gap-4 mt-5">
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
        © {new Date().getFullYear()} Basketball Scorer - Record your games
      </div>
    </footer>
  );
} 