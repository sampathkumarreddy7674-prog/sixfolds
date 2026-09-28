import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { AppNotification, Land } from '../types';
import { NotificationService } from '../services/notificationService';
import { StorageService } from '../services/storageService';
import { 
  Bell, 
  CheckCheck, 
  CloudRain, 
  Droplets, 
  Calendar, 
  Bug, 
  TrendingUp, 
  ShoppingBag, 
  Landmark, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface Props {
  currentLand: Land;
  onNavigateToSubTab: (subTabId: string) => void;
  onRefreshUnreadCount?: () => void;
}

export const AlertsView: React.FC<Props> = ({
  currentLand,
  onNavigateToSubTab,
  onRefreshUnreadCount
}) => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'urgent' | 'water' | 'crops'>('all');

  const reloadAlerts = () => {
    if (currentLand) {
      const conflict = StorageService.getConflictResolution(currentLand);
      const items = NotificationService.getNotifications(currentLand, conflict);
      setNotifications(items);
    }
  };

  useEffect(() => {
    reloadAlerts();
  }, [currentLand.id]);

  const handleMarkAllRead = () => {
    const updated = NotificationService.markAllAsRead();
    setNotifications(updated);
    onRefreshUnreadCount?.();
  };

  const handleItemClick = (item: AppNotification) => {
    NotificationService.markAsRead(item.id);
    setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));
    onRefreshUnreadCount?.();
    if (item.actionSubTab) {
      onNavigateToSubTab(item.actionSubTab);
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
      case 'conflict': return AlertTriangle;
      default: return Bell;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'urgent') return n.priority === 'high' || !n.read;
    if (activeFilter === 'water') return n.category === 'rain' || n.category === 'irrigation';
    if (activeFilter === 'crops') return n.category === 'crop_calendar' || n.category === 'crop_health';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-4 pb-20 max-w-2xl mx-auto">
      {/* Title Card */}
      <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold relative shrink-0">
            <Bell className="w-6 h-6 text-amber-800" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white text-[11px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-xl font-black text-stone-900 leading-tight">
              {t('navAlerts')}
            </h1>
            <p className="text-xs text-stone-600 font-semibold mt-0.5">
              {currentLand.name}
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="min-h-[44px] px-3.5 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition-all border border-stone-300"
          >
            <CheckCheck className="w-4 h-4 text-emerald-700" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'urgent', label: `Urgent (${notifications.filter(n => n.priority === 'high').length})` },
          { id: 'water', label: '💧 Water & Rain' },
          { id: 'crops', label: '🌱 Crops' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id as any)}
            className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border ${
              activeFilter === tab.id
                ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border-2 border-stone-200 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
            <h3 className="text-base font-black text-stone-900">No New Alerts</h3>
            <p className="text-xs text-stone-600 font-medium mt-1">
              All irrigation, crop health, and weather parameters for {currentLand.name} are normal.
            </p>
          </div>
        ) : (
          filteredNotifications.map((item) => {
            const Icon = getCategoryIcon(item.category);
            const isUrgent = item.priority === 'high';
            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`p-4 rounded-3xl border-2 transition-all cursor-pointer ${
                  !item.read
                    ? isUrgent
                      ? 'bg-rose-50/70 border-rose-300 shadow-sm'
                      : 'bg-emerald-50/60 border-emerald-300 shadow-sm'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isUrgent ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-black text-stone-900 line-clamp-1">
                        {item.title}
                      </h4>
                      <span className="text-[11px] text-stone-500 font-bold shrink-0">
                        {item.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-stone-700 font-medium leading-relaxed mt-1">
                      {item.description}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                        isUrgent ? 'bg-rose-200 text-rose-900' : 'bg-stone-200 text-stone-800'
                      }`}>
                        {item.category.replace('_', ' ')}
                      </span>

                      {item.actionSubTab && (
                        <span className="min-h-[32px] inline-flex items-center gap-1 text-xs font-black text-emerald-800 hover:text-emerald-950">
                          <span>Check details</span>
                          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
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
    </div>
  );
};
