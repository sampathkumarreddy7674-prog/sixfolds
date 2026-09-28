import { AppNotification, Land, ConflictResolution } from '../types';

const NOTIFICATIONS_STORAGE_KEY = 'agri_app_notifications';

export function getInitialNotifications(land: Land, conflict: ConflictResolution): AppNotification[] {
  const isWatermelon = land.currentCrop.toLowerCase().includes('watermelon');

  // Exact 5 simple farmer notifications specified in Requirement 5:
  const notifications: AppNotification[] = [
    {
      id: 'notif-rain-01',
      category: 'rain',
      title: '🌧️ RAIN ALERT',
      description: 'Rain may come today.',
      timestamp: 'Just now',
      read: false,
      actionSubTab: 'irrigation',
      priority: 'high'
    },
    {
      id: 'notif-water-02',
      category: 'irrigation',
      title: '💧 WATER ALERT',
      description: 'Check your field.',
      timestamp: '15 min ago',
      read: false,
      actionSubTab: 'water',
      priority: 'high'
    },
    {
      id: 'notif-crop-03',
      category: 'crop_health',
      title: '🌱 CROP ALERT',
      description: 'Your crop needs attention.',
      timestamp: '1 hour ago',
      read: false,
      actionSubTab: 'crophealth',
      priority: 'medium'
    },
    {
      id: 'notif-market-04',
      category: 'market',
      title: '💰 MARKET ALERT',
      description: 'Market price changed.',
      timestamp: '3 hours ago',
      read: false,
      actionSubTab: 'market',
      priority: 'normal'
    },
    {
      id: 'notif-farm-05',
      category: 'conflict',
      title: '⚠️ FARM ALERT',
      description: 'Different advice was detected.',
      timestamp: '4 hours ago',
      read: false,
      actionSubTab: 'resolver',
      priority: 'high'
    }
  ];

  return notifications;
}

export const NotificationService = {
  getNotifications(land: Land, conflict: ConflictResolution): AppNotification[] {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    const initial = getInitialNotifications(land, conflict);
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  },

  markAsRead(id: string): AppNotification[] {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) return [];
    try {
      const items: AppNotification[] = JSON.parse(raw);
      const updated = items.map(n => n.id === id ? { ...n, read: true } : n);
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  markAllAsRead(): AppNotification[] {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) return [];
    try {
      const items: AppNotification[] = JSON.parse(raw);
      const updated = items.map(n => ({ ...n, read: true }));
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  }
};
