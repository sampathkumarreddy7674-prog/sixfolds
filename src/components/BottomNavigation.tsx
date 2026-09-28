import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  Home, 
  Sprout, 
  Bot, 
  Bell, 
  User, 
  Search, 
  MessageSquareText, 
  ShoppingBag 
} from 'lucide-react';

export type FarmerTab = 'home' | 'myfarm' | 'ai' | 'alerts' | 'profile';
export type BuyerTab = 'home' | 'findcrops' | 'enquiries' | 'profile';

interface Props {
  role: 'farmer' | 'buyer';
  activeTab: string;
  onTabChange: (tab: any) => void;
  unreadCount?: number;
}

export const BottomNavigation: React.FC<Props> = ({ role, activeTab, onTabChange, unreadCount = 0 }) => {
  const { t } = useLanguage();

  if (role === 'farmer') {
    const items = [
      { id: 'home' as FarmerTab, label: t('navHome'), icon: Home },
      { id: 'myfarm' as FarmerTab, label: t('navMyFarm'), icon: Sprout },
      { id: 'ai' as FarmerTab, label: t('navAIAssistant'), icon: Bot, isHighlight: true },
      { id: 'alerts' as FarmerTab, label: t('navAlerts'), icon: Bell, badge: unreadCount },
      { id: 'profile' as FarmerTab, label: t('navProfile'), icon: User },
    ];

    return (
      <nav 
        aria-label="Farmer Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-300 shadow-lg pb-safe"
      >
        <div className="max-w-md mx-auto grid grid-cols-5 h-16 px-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`min-h-[48px] min-w-[44px] flex flex-col items-center justify-center gap-0.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                  isActive ? 'text-emerald-800 font-extrabold' : 'text-stone-600 hover:text-stone-900 font-bold'
                }`}
              >
                <div className={`relative p-1 rounded-xl transition-all ${
                  isActive ? 'bg-emerald-100 text-emerald-800 scale-105' : ''
                }`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
                  {item.badge && item.badge > 0 ? (
                    <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  ) : item.isHighlight && !isActive ? (
                    <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white" />
                  ) : null}
                </div>
                <span className="text-[11px] font-bold leading-tight line-clamp-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  // Buyer Navigation
  const buyerItems = [
    { id: 'home' as BuyerTab, label: t('navHome'), icon: ShoppingBag },
    { id: 'findcrops' as BuyerTab, label: t('navFindCrops'), icon: Search },
    { id: 'enquiries' as BuyerTab, label: t('navMyEnquiries'), icon: MessageSquareText },
    { id: 'profile' as BuyerTab, label: t('navProfile'), icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-lg pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-4 h-16 px-1">
        {buyerItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-all ${
                isActive ? 'text-amber-700 font-extrabold' : 'text-stone-500 hover:text-stone-800 font-semibold'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${
                isActive ? 'bg-amber-50 text-amber-700 scale-105' : ''
              }`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span className="text-[10px] leading-tight line-clamp-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
