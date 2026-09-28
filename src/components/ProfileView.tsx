import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { FarmerProfile, BuyerProfile, Land } from '../types';
import { StorageService } from '../services/storageService';
import { 
  User, 
  Phone, 
  MapPin, 
  Briefcase, 
  Globe2, 
  Bell, 
  ShieldCheck, 
  HelpCircle, 
  Info, 
  LogOut, 
  Save, 
  Check, 
  ExternalLink,
  PhoneCall,
  Sprout
} from 'lucide-react';

interface Props {
  role: 'farmer' | 'buyer';
  farmer?: FarmerProfile | null;
  buyer?: BuyerProfile | null;
  lands?: Land[];
  onOpenLanguageModal: () => void;
  onLogout: () => void;
  onProfileUpdated?: () => void;
}

export const ProfileView: React.FC<Props> = ({
  role,
  farmer,
  buyer,
  lands = [],
  onOpenLanguageModal,
  onLogout,
  onProfileUpdated
}) => {
  const { language, t } = useLanguage();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Farmer form state
  const [name, setName] = useState(farmer?.name || '');
  const [phone, setPhone] = useState(farmer?.phone || '');
  const [district, setDistrict] = useState(farmer?.district || '');
  const [stateName, setStateName] = useState(farmer?.state || '');
  const [farmingExp, setFarmingExp] = useState(farmer?.farmingExperience || '10 years');

  // Buyer form state
  const [buyerName, setBuyerName] = useState(buyer?.name || '');
  const [businessName, setBusinessName] = useState(buyer?.businessName || '');
  const [buyerContact, setBuyerContact] = useState(buyer?.phoneOrEmail || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'farmer' && farmer) {
      const updated: FarmerProfile = {
        ...farmer,
        name,
        phone,
        district,
        state: stateName,
        farmingExperience: farmingExp
      };
      StorageService.saveFarmerProfile(updated);
    } else if (role === 'buyer' && buyer) {
      const updated: BuyerProfile = {
        ...buyer,
        name: buyerName,
        businessName,
        phoneOrEmail: buyerContact
      };
      StorageService.saveBuyerProfile(updated);
    }

    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
    onProfileUpdated?.();
  };

  return (
    <div className="space-y-4 pb-20">
      
      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs relative overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-md ${
              role === 'farmer' ? 'bg-emerald-700' : 'bg-amber-600'
            }`}>
              {(role === 'farmer' ? (farmer?.name || 'F') : (buyer?.name || 'B')).charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-stone-900">
                  {role === 'farmer' ? farmer?.name : buyer?.name}
                </h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                  {role === 'farmer' ? 'Verified Farmer' : buyer?.buyerType || 'Buyer'}
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>
                  {role === 'farmer' 
                    ? `${farmer?.district}, ${farmer?.state}`
                    : `${buyer?.location || 'Mandi Hub'}`}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-all"
          >
            {isEditing ? t('cancel') : t('edit')}
          </button>
        </div>

        {/* Farmer Stats Overview */}
        {role === 'farmer' && (
          <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-stone-100 text-center">
            <div className="bg-stone-50 p-2.5 rounded-2xl">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wide block">
                Total Lands
              </span>
              <span className="text-base font-black text-stone-900">{lands.length}</span>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-2xl">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wide block">
                Acreage
              </span>
              <span className="text-base font-black text-stone-900">
                {lands.reduce((acc, l) => acc + (l.area || 0), 0)} Ac
              </span>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-2xl">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wide block">
                Experience
              </span>
              <span className="text-xs font-black text-stone-900 line-clamp-1 mt-0.5">
                {farmer?.farmingExperience}
              </span>
            </div>
          </div>
        )}

        {/* Edit Profile Form */}
        {isEditing && (
          <form onSubmit={handleSave} className="mt-4 pt-4 border-t border-stone-100 space-y-3">
            {role === 'farmer' ? (
              <>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">{t('fullNameLabel')}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">{t('phoneLabel')}</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">{t('districtLabel')}</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">{t('stateLabel')}</label>
                    <input
                      type="text"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">{t('fullNameLabel')}</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">{t('businessNameLabel')}</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">{t('buyerContactLabel')}</label>
                  <input
                    type="text"
                    value={buyerContact}
                    onChange={(e) => setBuyerContact(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t('save')}</span>
            </button>
          </form>
        )}

        {savedSuccess && (
          <div className="mt-3 p-2 bg-emerald-50 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>{t('successSaved')}</span>
          </div>
        )}
      </div>

      {/* Kisan Helpline Toll Free Direct Call */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-5 shadow-md flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
            Government of India Support
          </span>
          <h3 className="text-sm font-black mt-0.5">{t('kisanHelpline')}</h3>
          <p className="text-[11px] text-emerald-100 font-medium">Free 24x7 phone consultation with agronomists</p>
        </div>
        <a
          href="tel:18001801551"
          className="w-10 h-10 rounded-2xl bg-white text-emerald-900 flex items-center justify-center shadow-md font-bold shrink-0 hover:scale-105 transition-all"
          title="Call Toll Free"
        >
          <PhoneCall className="w-5 h-5 text-emerald-700" />
        </a>
      </div>

      {/* App Settings Menu */}
      <div className="bg-white rounded-3xl p-3 border border-stone-200 shadow-xs divide-y divide-stone-100">
        
        {/* Language switch */}
        <button
          type="button"
          onClick={onOpenLanguageModal}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-stone-50 rounded-2xl transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700">
              <Globe2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-stone-900 block">{t('settings')} - Language</span>
              <span className="text-[11px] text-stone-500 font-medium">Currently: {language.toUpperCase()}</span>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700">Change</span>
        </button>

        {/* Notifications toggle */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-stone-900 block">{t('notifications')}</span>
              <span className="text-[11px] text-stone-500 font-medium">Rain warnings, conflict alerts</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              notificationsEnabled ? 'bg-emerald-600' : 'bg-stone-300'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white shadow-xs absolute top-1 transition-transform ${
              notificationsEnabled ? 'right-1' : 'left-1'
            }`} />
          </button>
        </div>

        {/* Privacy */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-stone-900 block">{t('privacy')}</span>
              <span className="text-[11px] text-stone-500 font-medium">Farmer-isolated data protection</span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
            Secured
          </span>
        </div>

        {/* About */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-stone-900 block">{t('aboutAgriResolve')}</span>
              <span className="text-[11px] text-stone-500 font-medium">v1.2.0 • AI Conflict Resolver</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-rose-50 rounded-2xl transition-all text-rose-600 font-bold text-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <LogOut className="w-4 h-4" />
            </div>
            <span>{t('logout')}</span>
          </div>
        </button>

      </div>
    </div>
  );
};
