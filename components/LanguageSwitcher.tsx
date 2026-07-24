import React from 'react';
import { useLanguage, Language } from '../context/LanguageContext';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'ru', label: 'RU' },
  { code: 'uz', label: 'UZ' },
  { code: 'en', label: 'EN' },
];

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-1 text-xs tracking-widest">
      {LANGUAGES.map((lang, index) => (
        <React.Fragment key={lang.code}>
          {index > 0 && <span className="text-neutral-700">·</span>}
          <button
            onClick={() => setLanguage(lang.code)}
            className={`px-1 transition-colors ${
              language === lang.code ? 'text-white' : 'text-neutral-500 hover:text-white'
            }`}
          >
            {lang.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
