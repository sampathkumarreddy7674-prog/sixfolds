import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Land } from '../types';
import { 
  Sprout, 
  ChevronDown, 
  PlusCircle, 
  Globe2, 
  Settings, 
  MapPin, 
  Check,
  Building2,
  Sparkles,
  Bell,
  PhoneCall
} from 'lucide-react';

interface Props {
  role: 'farmer' | 'buyer';
  currentLand?: Land | null;
  lands?: Land[];
  onSelectLand?: (land: Land) => void;
  onAddNewLand?: () => void;
  onOpenLanguageModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenNotifications?: () => void;
  onOpenIVRDemo?: () => void;
  unreadCount?: number;
}

export const Header: React.FC<Props> = ({
  role,
  currentLand,
  lands = [],
  onSelectLand,
  onAddNewLand,
  onOpenLanguageModal,
  onOpenSettingsModal,
  onOpenNotifications,
  onOpenIVRDemo,
  unreadCount = 0
}) => {
  const { language, t } = useLanguage();
  const [isLandDropdownOpen, setIsLandDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-800/20 shrink-0">
            <Sprout className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg text-stone-900 tracking-tight leading-none">
                AgriResolve
              </span>
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                {role === 'farmer' ? 'Kisan' : 'Trader'}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-semibold line-clamp-1">
              {role === 'farmer' && currentLand ? `${currentLand.district}, ${currentLand.state}` : 'Smart Agriculture'}
            </p>
          </div>
        </div>

        {/* Right action area: Land Selector + Language + Settings */}
        <div className="flex items-center gap-2">
          {/* Land Selector (for farmer) */}
          {role === 'farmer' && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLandDropdownOpen(!isLandDropdownOpen)}
                className="min-h-[44px] flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-stone-100 hover:bg-emerald-50 hover:border-emerald-300 border border-stone-300 text-stone-900 text-xs font-black transition-all shadow-xs"
              >
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="max-w-[110px] truncate">
                  {currentLand ? currentLand.name : t('allLands')}
                </span>
                <ChevronDown className="w-4 h-4 text-stone-600 shrink-0" />
              </button>

              {/* Land Dropdown Menu */}
              {isLandDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setIsLandDropdownOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-40 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 border-b border-stone-100 mb-1">
                      <p className="text-[11px] font-extrabold text-stone-400 uppercase tracking-wider">
                        {t('selectedLandLabel')}
                      </p>
                      <p className="text-xs font-bold text-stone-700">
                        {lands.length} {lands.length === 1 ? 'Land Registered' : 'Lands Registered'}
                      </p>
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-1">
                      {lands.map((land) => {
                        const isCurrent = currentLand?.id === land.id;
                        return (
                          <button
                            key={land.id}
                            type="button"
                            onClick={() => {
                              onSelectLand?.(land);
                              setIsLandDropdownOpen(false);
                            }}
                            className={`min-h-[48px] w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start justify-between ${
                              isCurrent 
                                ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200' 
                                : 'hover:bg-stone-50 text-stone-800'
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-1.5 font-bold">
                                <span>{land.name}</span>
                                {isCurrent && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                              </div>
                              <p className="text-[11px] text-stone-500 font-medium">
                                {land.area} {land.areaUnit} • {land.currentCrop}
                              </p>
                              <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded-md mt-1 font-semibold ${
                                land.soilStatus === 'good' 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : land.soilStatus === 'moderate' 
                                  ? 'bg-amber-100 text-amber-800' 
                                  : 'bg-rose-100 text-rose-800'
                              }`}>
                                Soil: {land.soilStatus.toUpperCase().replace('_', ' ')}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 mt-1 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => {
                          setIsLandDropdownOpen(false);
                          onAddNewLand?.();
                        }}
                        className="min-h-[44px] w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>{t('addNewLand')}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* IVR Demo Quick Button */}
          {onOpenIVRDemo && (
            <button
              type="button"
              onClick={onOpenIVRDemo}
              className="min-h-[44px] flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black transition-all shadow-xs"
              title="Open IVR Voice Helpline Demo"
            >
              <PhoneCall className="w-4 h-4 text-emerald-200" />
              <span className="hidden sm:inline">IVR Demo</span>
            </button>
          )}

          {/* Notification Center Bell */}
          {onOpenNotifications && (
            <button
              type="button"
              onClick={onOpenNotifications}
              className="relative min-w-[44px] min-h-[44px] rounded-2xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-800 transition-all border border-stone-300"
              title="Farm Alerts & Notifications"
            >
              <Bell className="w-5 h-5 text-stone-800" />
              {unreadCount > 0 && (
                <span className="absolute 1 top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          )}

          {/* Language Switch Quick Button */}
          <button
            type="button"
            onClick={onOpenLanguageModal}
            className="min-h-[44px] flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-black transition-all"
            title="Switch Language"
          >
            <Globe2 className="w-4 h-4 text-stone-700" />
            <span className="uppercase">{language}</span>
          </button>

          {/* Settings Button */}
          <button
            type="button"
            onClick={onOpenSettingsModal}
            className="min-w-[44px] min-h-[44px] rounded-2xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-800 transition-all border border-stone-300"
            title="Settings & Help"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
