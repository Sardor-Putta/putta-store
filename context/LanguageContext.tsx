import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import ru from '../locales/ru.json';
import en from '../locales/en.json';
import uz from '../locales/uz.json';

export type Language = 'ru' | 'uz' | 'en';

const DICTIONARIES: Record<Language, any> = { ru, en, uz };

const STORAGE_KEY = 'putta_lang';

const isValidLanguage = (value: string | null): value is Language =>
  value === 'ru' || value === 'uz' || value === 'en';

const resolvePath = (dict: any, key: string): unknown =>
  key.split('.').reduce((node: any, part: string) => node?.[part], dict);

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  /** Looks up a dot-separated key (e.g. "checkout.title") and returns a string, falling back to English, then the key itself. */
  t: (key: string) => string;
  /** Raw dictionary for the active language, for structured data (arrays, objects) that t() can't return. */
  dict: typeof ru;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return isValidLanguage(saved) ? saved : 'ru';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const t = (key: string): string => {
    const value = resolvePath(DICTIONARIES[language], key);
    if (typeof value === 'string') return value;

    const fallback = resolvePath(DICTIONARIES.en, key);
    return typeof fallback === 'string' ? fallback : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dict: DICTIONARIES[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};
