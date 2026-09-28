import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode } from '../types';
import { translations, TranslationDictionary } from './translations';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: keyof TranslationDictionary) => string;
  languages: Array<{ code: LanguageCode; name: string; nativeName: string; region: string }>;
}

const LANGUAGES_META: Array<{ code: LanguageCode; name: string; nativeName: string; region: string }> = [
  { code: 'en', name: 'English', nativeName: 'English', region: 'Global' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', region: 'Tamil Nadu & Puducherry' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'Andhra Pradesh & Telangana' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'National' },
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('agri_resolve_lang');
    if (saved && (saved === 'en' || saved === 'ta' || saved === 'te' || saved === 'hi')) {
      return saved as LanguageCode;
    }
    return 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('agri_resolve_lang', lang);
  };

  const t = (key: keyof TranslationDictionary): string => {
    const dict = translations[language] || translations.en;
    return dict[key] || translations.en[key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: LANGUAGES_META }}>
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
