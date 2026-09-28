import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageCode } from '../types';
import { Globe2, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isInitialSetup?: boolean;
}

export const LanguageSelectorModal: React.FC<Props> = ({ isOpen, onClose, isInitialSetup = false }) => {
  const { language, setLanguage, languages, t } = useLanguage();

  if (!isOpen) return null;

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    if (!isInitialSetup) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 text-stone-900">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Globe2 className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
              {t('selectLanguageTitle')}
            </h2>
            <p className="text-xs text-stone-600 font-medium">
              {t('selectLanguageSubtitle')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5 my-5">
          {languages.map((item) => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                onClick={() => handleSelect(item.code)}
                type="button"
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/80 shadow-sm ring-2 ring-emerald-600/20'
                    : 'border-stone-200 bg-white hover:border-emerald-300 hover:bg-stone-50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-stone-900">{item.nativeName}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-stone-200/80 text-stone-700 font-medium">
                      {item.name}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5 font-medium">{item.region}</p>
                </div>

                {isSelected ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-stone-300 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {isInitialSetup ? (
          <button
            onClick={onClose}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-2xl font-bold text-base shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2"
          >
            <span>{t('continueBtn')}</span>
            <span>→</span>
          </button>
        ) : (
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-2xl font-bold text-sm transition-all"
          >
            {t('close')}
          </button>
        )}
      </div>
    </div>
  );
};
