import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { AppNotification, Land, ConflictResolution } from '../types';
import { NotificationService } from '../services/notificationService';
import { StorageService } from '../services/storageService';
import { 
  Bell, 
  X, 
  CheckCheck, 
  AlertTriangle, 
  CloudRain, 
  Droplets, 
  Calendar, 
  Bug, 
  TrendingUp, 
  ShoppingBag, 
  Landmark, 
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentLand: Land;
  onNavigateToSubTab: (subTabId: string) => void;
}

export const NotificationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentLand,
  onNavigateToSubTab
}) => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    if (isOpen && currentLand) {
      const conflict = StorageService.getConflictResolution(currentLand);
      const items = NotificationService.getNotifications(currentLand, conflict);
      setNotifications(items);
    }
  }, [isOpen, currentLand]);

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    const updated = NotificationService.markAllAsRead();
    setNotifications(updated);
  };

  const handleItemClick = (item: AppNotification) => {
    NotificationService.markAsRead(item.id);
    setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));
    if (item.actionSubTab) {
      onNavigateToSubTab(item.actionSubTab);
      onClose();
    }
  };

  const getCategoryIcon = (category: AppNotification['category']) => {
    switch (category) {
      case 'rain': return CloudRain;
      case 'irrigation': return Droplets;
      case 'crop_calendar': return Calendar;
      case 'crop_health': return Bug;
      case 'market': return TrendingUp;
      case 'buyer_enquiry': return ShoppingBag;
      case 'gov_scheme': return Landmark;
      case 'conflict': return Sparkles;
      default: return Bell;
    }
  };

  const getCategoryColor = (category: AppNotification['category']) => {
    switch (category) {
      case 'conflict': return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'rain': return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'irrigation': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'crop_calendar': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'crop_health': return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'market': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'buyer_enquiry': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'gov_scheme': return 'bg-amber-100 text-amber-900 border-amber-300';
      default: return 'bg-stone-100 text-stone-800 border-stone-300';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold relative">
              <Bell className="w-5 h-5 text-emerald-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-base font-black text-stone-900">
                {t('notifications')}
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                {currentLand ? `Alerts for ${currentLand.name}` : 'Real-time Farm Alerts'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mark read</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-2xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notification list */}
        <div className="overflow-y-auto p-4 space-y-2.5 divide-y divide-stone-100">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-stone-600">No active alerts</p>
              <p className="text-xs text-stone-400 mt-1">All farming systems are operating within normal parameters.</p>
            </div>
          ) : (
            notifications.map((item) => {
              const Icon = getCategoryIcon(item.category);
              const colorClass = getCategoryColor(item.category);
              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`pt-2.5 first:pt-0 cursor-pointer group`}
                >
                  <div className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                    !item.read 
                      ? 'bg-emerald-50/40 border-emerald-200/80 shadow-xs' 
                      : 'bg-white border-stone-200/70 hover:bg-stone-50'
                  }`}>
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className={`text-xs leading-snug line-clamp-1 ${!item.read ? 'font-black text-stone-900' : 'font-bold text-stone-700'}`}>
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-stone-400 font-medium shrink-0">
                          {item.timestamp}
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 font-medium leading-relaxed line-clamp-2">
                        {item.description}
                      </p>

                      <div className="mt-2 flex items-center justify-between text-[11px]">
                        <span className={`font-bold uppercase tracking-wider text-[9px] px-1.5 py-0.5 rounded-md ${
                          item.priority === 'high' 
                            ? 'bg-rose-100 text-rose-800 font-black' 
                            : 'bg-stone-100 text-stone-600'
                        }`}>
                          {item.category.replace('_', ' ')}
                        </span>

                        {item.actionSubTab && (
                          <span className="text-emerald-700 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                            <span>Take action</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 text-center text-[11px] text-stone-500 font-medium">
          Synchronized with Open-Meteo Radar, Sensor Telemetry & Central AI Conflict Engine.
        </div>
      </div>
    </div>
  );
};
