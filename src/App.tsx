/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { FarmerProfile, BuyerProfile, Land } from './types';
import { StorageService } from './services/storageService';
import { OnboardingFlow } from './components/OnboardingFlow';
import { Header } from './components/Header';
import { BottomNavigation, FarmerTab, BuyerTab } from './components/BottomNavigation';
import { FarmerDashboard } from './components/FarmerDashboard';
import { MyFarmView } from './components/MyFarmView';
import { ConflictResolverView } from './components/ConflictResolverView';
import { AIAssistantView } from './components/AIAssistantView';
import { CommunityView } from './components/CommunityView';
import { ProfileView } from './components/ProfileView';
import { BuyerPortal } from './components/BuyerPortal';
import { AddLandModal } from './components/AddLandModal';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';
import { NotificationModal } from './components/NotificationModal';
import { AlertsView } from './components/AlertsView';
import { IVRDemoView } from './components/IVRDemoView';
import { NotificationService } from './services/notificationService';

function MainApp() {
  const { t } = useLanguage();

  // Authentication & Profile state
  const [currentUser, setCurrentUser] = useState<{ id: string; role: 'farmer' | 'buyer' } | null>(() => 
    StorageService.getCurrentUser()
  );
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile | null>(null);
  const [buyerProfile, setBuyerProfile] = useState<BuyerProfile | null>(null);

  // Farmer Lands state
  const [lands, setLands] = useState<Land[]>([]);
  const [currentLand, setCurrentLand] = useState<Land | null>(null);

  // Navigation tab state
  const [farmerTab, setFarmerTab] = useState<FarmerTab>('home');
  const [buyerTab, setBuyerTab] = useState<BuyerTab>('home');
  const [myFarmSubTab, setMyFarmSubTab] = useState<string>('lands');

  // Modals & IVR Page state
  const [isAddLandModalOpen, setIsAddLandModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [isIVRDemoOpen, setIsIVRDemoOpen] = useState(() => {
    return typeof window !== 'undefined' && 
      (window.location.hash === '#ivr-demo' || window.location.search.includes('page=ivr-demo'));
  });

  // Listen to hash changes for #ivr-demo
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#ivr-demo' || window.location.search.includes('page=ivr-demo')) {
        setIsIVRDemoOpen(true);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Sync user profiles
  const reloadUserData = () => {
    const user = StorageService.getCurrentUser();
    setCurrentUser(user);

    if (user?.role === 'farmer') {
      const f = StorageService.getFarmerProfile(user.id);
      setFarmerProfile(f);
      const userLands = StorageService.getLands(user.id);
      setLands(userLands);
      if (userLands.length > 0) {
        // Keep currently selected land if exists, else pick first
        setCurrentLand(prev => {
          if (prev) {
            const found = userLands.find(l => l.id === prev.id);
            if (found) return found;
          }
          return userLands[0];
        });
      }
    } else if (user?.role === 'buyer') {
      const b = StorageService.getBuyerProfile();
      setBuyerProfile(b);
    }
  };

  useEffect(() => {
    reloadUserData();
  }, []);

  const handleLogout = () => {
    StorageService.setCurrentUser(null);
    setCurrentUser(null);
    setFarmerProfile(null);
    setBuyerProfile(null);
    setLands([]);
    setCurrentLand(null);
  };

  // Dedicated IVR Demo Page
  if (isIVRDemoOpen) {
    return (
      <div className="min-h-screen bg-stone-100 text-stone-900 py-4 sm:py-6">
        <IVRDemoView 
          onClose={() => {
            setIsIVRDemoOpen(false);
            if (typeof window !== 'undefined' && window.location.hash === '#ivr-demo') {
              window.location.hash = '';
            }
          }} 
        />
      </div>
    );
  }

  // If not logged in, show the comprehensive onboarding flow
  if (!currentUser) {
    return (
      <OnboardingFlow
        onComplete={() => {
          reloadUserData();
        }}
        onOpenIVRDemo={() => setIsIVRDemoOpen(true)}
      />
    );
  }

  // Farmer Role UI
  if (currentUser.role === 'farmer' && farmerProfile) {
    // If farmer has no lands yet, provide default or prompt
    const activeLand = currentLand || lands[0] || null;

    return (
      <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
        {/* Top Header with Land Selector and quick tools */}
        <Header
          role="farmer"
          currentLand={activeLand}
          lands={lands}
          onSelectLand={(l) => setCurrentLand(l)}
          onAddNewLand={() => setIsAddLandModalOpen(true)}
          onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
          onOpenSettingsModal={() => setFarmerTab('profile')}
          onOpenNotifications={() => setFarmerTab('alerts')}
          onOpenIVRDemo={() => setIsIVRDemoOpen(true)}
          unreadCount={unreadCount}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-2xl w-full mx-auto px-4 pt-3 pb-8">
          {activeLand ? (
            <>
              {farmerTab === 'home' && (
                <FarmerDashboard
                  land={activeLand}
                  farmerName={farmerProfile.name}
                  onNavigateTab={(tab) => {
                    setFarmerTab('myfarm');
                    setMyFarmSubTab(tab);
                  }}
                  onOpenResolver={() => {
                    setFarmerTab('myfarm');
                    setMyFarmSubTab('resolver');
                  }}
                  onOpenAIAssistant={() => setFarmerTab('ai')}
                  onSwitchLand={() => {
                    setFarmerTab('myfarm');
                    setMyFarmSubTab('menu');
                  }}
                />
              )}

              {farmerTab === 'myfarm' && (
                <MyFarmView
                  currentLand={activeLand}
                  lands={lands}
                  defaultSubTab={myFarmSubTab}
                  farmerProfile={farmerProfile}
                  onSelectLand={(l) => setCurrentLand(l)}
                  onAddNewLand={() => setIsAddLandModalOpen(true)}
                  onLandDeleted={(id) => {
                    const updated = StorageService.deleteLand(farmerProfile.id, id);
                    setLands(updated);
                    if (currentLand?.id === id) {
                      setCurrentLand(updated[0] || null);
                    }
                  }}
                />
              )}

              {farmerTab === 'ai' && (
                <AIAssistantView land={activeLand} />
              )}

              {farmerTab === 'alerts' && (
                <AlertsView
                  currentLand={activeLand}
                  onNavigateToSubTab={(subTab) => {
                    setFarmerTab('myfarm');
                    setMyFarmSubTab(subTab);
                  }}
                  onRefreshUnreadCount={() => setUnreadCount(prev => Math.max(0, prev - 1))}
                />
              )}

              {farmerTab === 'profile' && (
                <ProfileView
                  role="farmer"
                  farmer={farmerProfile}
                  lands={lands}
                  onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
                  onLogout={handleLogout}
                  onProfileUpdated={reloadUserData}
                />
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl p-6 border border-stone-200 mt-4">
              <h3 className="text-lg font-black text-stone-900">{t('noLandsYet')}</h3>
              <p className="text-xs text-stone-500 mt-1 mb-4">
                Register your farm or plot to get localized soil, weather and conflict advice.
              </p>
              <button
                type="button"
                onClick={() => setIsAddLandModalOpen(true)}
                className="py-3 px-6 bg-emerald-600 text-white rounded-2xl text-xs font-bold shadow-md"
              >
                {t('addNewLand')}
              </button>
            </div>
          )}
        </main>

        {/* Bottom Mobile Navigation */}
        <BottomNavigation
          role="farmer"
          activeTab={farmerTab}
          unreadCount={unreadCount}
          onTabChange={(tab) => {
            setFarmerTab(tab);
            if (tab === 'myfarm') setMyFarmSubTab('menu');
          }}
        />

        {/* Add Land Modal */}
        <AddLandModal
          isOpen={isAddLandModalOpen}
          userId={farmerProfile.id}
          onClose={() => setIsAddLandModalOpen(false)}
          onLandAdded={(newLand) => {
            const updated = StorageService.getLands(farmerProfile.id);
            setLands(updated);
            setCurrentLand(newLand);
          }}
        />

        {/* Language Modal */}
        <LanguageSelectorModal
          isOpen={isLanguageModalOpen}
          onClose={() => setIsLanguageModalOpen(false)}
        />

        {/* Notification Center Modal */}
        {activeLand && (
          <NotificationModal
            isOpen={isNotificationsOpen}
            onClose={() => {
              setIsNotificationsOpen(false);
              setUnreadCount(0);
            }}
            currentLand={activeLand}
            onNavigateToSubTab={(subTabId) => {
              setFarmerTab('myfarm');
              setMyFarmSubTab(subTabId);
            }}
          />
        )}
      </div>
    );
  }

  // Buyer Role UI
  if (currentUser.role === 'buyer' && buyerProfile) {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
        <Header
          role="buyer"
          onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
          onOpenSettingsModal={() => setBuyerTab('profile')}
          onOpenIVRDemo={() => setIsIVRDemoOpen(true)}
        />

        <main className="flex-1 max-w-2xl w-full mx-auto px-4 pt-3 pb-8">
          {(buyerTab === 'home' || buyerTab === 'findcrops' || buyerTab === 'enquiries') && (
            <BuyerPortal
              buyer={buyerProfile}
              activeTab={buyerTab}
              onNavigateTab={(tab) => setBuyerTab(tab)}
            />
          )}

          {buyerTab === 'profile' && (
            <ProfileView
              role="buyer"
              buyer={buyerProfile}
              onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
              onLogout={handleLogout}
              onProfileUpdated={reloadUserData}
            />
          )}
        </main>

        <BottomNavigation
          role="buyer"
          activeTab={buyerTab}
          onTabChange={(tab) => setBuyerTab(tab)}
        />

        <LanguageSelectorModal
          isOpen={isLanguageModalOpen}
          onClose={() => setIsLanguageModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <OnboardingFlow
      onComplete={() => reloadUserData()}
      onOpenIVRDemo={() => setIsIVRDemoOpen(true)}
    />
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}
