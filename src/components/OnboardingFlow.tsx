import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageCode, UserRole, FarmerProfile, BuyerProfile } from '../types';
import { StorageService } from '../services/storageService';
import { 
  Sprout, 
  ShoppingBag, 
  MapPin, 
  Phone, 
  User, 
  Briefcase, 
  Check, 
  Navigation, 
  Globe2,
  AlertCircle,
  PhoneCall
} from 'lucide-react';

interface Props {
  onComplete: () => void;
  onOpenIVRDemo?: () => void;
}

export const OnboardingFlow: React.FC<Props> = ({ onComplete, onOpenIVRDemo }) => {
  const { language, setLanguage, languages, t } = useLanguage();
  
  // Step 1: Language selection
  // Step 2: Role selection (Farmer or Buyer)
  // Step 3: Registration form (Farmer or Buyer)
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');

  // Farmer form state
  const [farmerName, setFarmerName] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('+91 ');
  const [district, setDistrict] = useState('');
  const [stateName, setStateName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [farmingExp, setFarmingExp] = useState('4 to 10 Years');
  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Buyer form state
  const [buyerName, setBuyerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [buyerContact, setBuyerContact] = useState('');
  const [buyerLocation, setBuyerLocation] = useState('');
  const [buyerType, setBuyerType] = useState<BuyerProfile['buyerType']>('Wholesaler');
  const [selectedCrops, setSelectedCrops] = useState<string[]>(['Paddy (Rice)', 'Cotton']);

  const availableCrops = [
    'Paddy (Rice)', 'Cotton', 'Wheat', 'Chilli', 'Tomato', 'Maize', 'Sugarcane', 'Onion', 'Turmeric', 'Soybean'
  ];

  const handleLanguageSelect = (code: LanguageCode) => {
    setLanguage(code);
  };

  const handleGpsRequest = () => {
    setDetectingGps(true);
    setGpsError(null);

    if (!('geolocation' in navigator)) {
      setGpsError('Geolocation is not supported by your browser.');
      setDetectingGps(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setDetectingGps(false);
        if (!locationName) {
          setLocationName(`GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        }
      },
      (err) => {
        console.warn('Geolocation denied or error:', err.message);
        setGpsError(t('manualLocationNotice'));
        setDetectingGps(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const toggleCrop = (crop: string) => {
    if (selectedCrops.includes(crop)) {
      setSelectedCrops(selectedCrops.filter(c => c !== crop));
    } else {
      setSelectedCrops([...selectedCrops, crop]);
    }
  };

  const handleFarmerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `farmer-${Date.now()}`;
    const newProfile: FarmerProfile = {
      id,
      role: 'farmer',
      name: farmerName || 'Krishi Mitra',
      phone: farmerPhone,
      district: district || 'Thanjavur',
      state: stateName || 'Tamil Nadu',
      location: locationName || 'District Farm',
      latitude: latitude ?? 10.7870,
      longitude: longitude ?? 79.1378,
      farmingExperience: farmingExp,
      language,
      createdAt: new Date().toISOString()
    };
    StorageService.saveFarmerProfile(newProfile);
    StorageService.setCurrentUser({ id, role: 'farmer' });
    onComplete();
  };

  const handleBuyerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `buyer-${Date.now()}`;
    const newProfile: BuyerProfile = {
      id,
      role: 'buyer',
      name: buyerName || 'Agri Commodity Buyer',
      businessName: businessName || 'Fresh Agri Trades',
      phoneOrEmail: buyerContact || '+91 98888 77777',
      location: buyerLocation || 'South Mandi Hub',
      district: buyerLocation || 'Regional Mandi',
      state: stateName || 'India',
      buyerType,
      cropsInterestedIn: selectedCrops.length ? selectedCrops : ['Paddy (Rice)', 'Cotton'],
      language,
      createdAt: new Date().toISOString()
    };
    StorageService.saveBuyerProfile(newProfile);
    StorageService.setCurrentUser({ id, role: 'buyer' });
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-stone-50 to-stone-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-stone-200/90 overflow-hidden my-6">
        
        {/* Header Branding */}
        <div className="bg-emerald-800 text-white p-6 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-700/50 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                <Sprout className="w-7 h-7 text-emerald-300" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight">{t('appName')}</h1>
                <p className="text-xs text-emerald-200 font-medium">{t('appTagline')}</p>
              </div>
            </div>

            {onOpenIVRDemo && (
              <button
                type="button"
                onClick={onOpenIVRDemo}
                className="min-h-[40px] px-3.5 py-2 rounded-2xl bg-white/20 hover:bg-white/30 active:scale-95 text-white text-xs font-black flex items-center gap-1.5 transition-all border border-white/25 shadow-sm cursor-pointer"
                title="Simulate AgriResolve Kisan Helpline IVR"
              >
                <PhoneCall className="w-4 h-4 text-emerald-300" />
                <span>IVR Demo</span>
              </button>
            )}
          </div>

          {/* Stepper indicator */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-emerald-700/60 text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 1 ? 'bg-emerald-400 text-emerald-950' : 'bg-emerald-900 text-emerald-400'
              }`}>1</span>
              <span className="font-semibold text-emerald-100">Language</span>
            </div>
            <div className="h-0.5 w-8 bg-emerald-700" />
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 2 ? 'bg-emerald-400 text-emerald-950' : 'bg-emerald-900 text-emerald-400'
              }`}>2</span>
              <span className="font-semibold text-emerald-100">Role</span>
            </div>
            <div className="h-0.5 w-8 bg-emerald-700" />
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 3 ? 'bg-emerald-400 text-emerald-950' : 'bg-emerald-900 text-emerald-400'
              }`}>3</span>
              <span className="font-semibold text-emerald-100">Profile</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* STEP 1: LANGUAGE SELECTION */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-6 text-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
                  <Globe2 className="w-4 h-4" />
                  Language
                </span>
                <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                  Choose your language
                </h2>
                <p className="text-xs text-stone-600 font-semibold mt-1">
                  Select your preferred language for advice, weather, and AI
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {languages.map((item) => {
                  const isSelected = language === item.code;
                  return (
                    <button
                      key={item.code}
                      onClick={() => handleLanguageSelect(item.code)}
                      type="button"
                      className={`min-h-[64px] flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/90 shadow-md ring-2 ring-emerald-600/30'
                          : 'border-stone-300 bg-white hover:border-emerald-400 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base ${
                          isSelected ? 'bg-emerald-700 text-white shadow-sm' : 'bg-stone-100 text-stone-700'
                        }`}>
                          {item.code.toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-black text-stone-900">{item.nativeName}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 font-bold">
                              {item.name}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 font-semibold mt-0.5">{item.region}</p>
                        </div>
                      </div>

                      {isSelected ? (
                        <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-stone-300" />
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="mt-6 w-full min-h-[56px] py-4 px-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-2xl font-black text-base shadow-lg shadow-emerald-800/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <span>→</span>
              </button>
            </div>
          )}

          {/* STEP 2: ROLE SELECTION (Farmer or Buyer) */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-5 text-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
                  Step 2 of 3
                </span>
                <h2 className="text-xl font-black text-stone-900">{t('roleQuestion')}</h2>
                <p className="text-xs text-stone-600 mt-1">{t('roleSubtitle')}</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Farmer Option */}
                <button
                  type="button"
                  onClick={() => setSelectedRole('farmer')}
                  className={`p-5 rounded-3xl border-2 transition-all text-left flex items-start gap-4 ${
                    selectedRole === 'farmer'
                      ? 'border-emerald-600 bg-emerald-50/90 shadow-md ring-2 ring-emerald-600/20'
                      : 'border-stone-200 bg-white hover:border-emerald-300 hover:bg-stone-50'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                    selectedRole === 'farmer' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/30' : 'bg-stone-100 text-stone-600'
                  }`}>
                    <Sprout className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-stone-900">{t('farmerRoleTitle')}</h3>
                      {selectedRole === 'farmer' && (
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{t('farmerRoleDesc')}</p>
                  </div>
                </button>

                {/* Buyer Option */}
                <button
                  type="button"
                  onClick={() => setSelectedRole('buyer')}
                  className={`p-5 rounded-3xl border-2 transition-all text-left flex items-start gap-4 ${
                    selectedRole === 'buyer'
                      ? 'border-amber-600 bg-amber-50/90 shadow-md ring-2 ring-amber-600/20'
                      : 'border-stone-200 bg-white hover:border-amber-300 hover:bg-stone-50'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                    selectedRole === 'buyer' ? 'bg-amber-600 text-white shadow-md shadow-amber-700/30' : 'bg-stone-100 text-stone-600'
                  }`}>
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-stone-900">{t('buyerRoleTitle')}</h3>
                      {selectedRole === 'buyer' && (
                        <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{t('buyerRoleDesc')}</p>
                  </div>
                </button>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-2xl font-bold text-sm transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className={`w-2/3 py-3.5 px-4 text-white rounded-2xl font-bold text-base shadow-md transition-all flex items-center justify-center gap-2 ${
                    selectedRole === 'farmer'
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-700/20'
                      : 'bg-amber-600 hover:bg-amber-700 shadow-amber-700/20'
                  }`}
                >
                  <span>{t('continueBtn')}</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: REGISTRATION FOR FARMER */}
          {step === 3 && selectedRole === 'farmer' && (
            <form onSubmit={handleFarmerSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-3 text-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
                  Step 3 of 3 • Farmer Account
                </span>
                <h2 className="text-xl font-black text-stone-900">{t('farmerRegTitle')}</h2>
                <p className="text-xs text-stone-600">{t('farmerRegSubtitle')}</p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t('fullNameLabel')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-semibold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t('phoneLabel')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="tel"
                    required
                    value={farmerPhone}
                    onChange={(e) => setFarmerPhone(e.target.value)}
                    placeholder="+91 98450 12345"
                    className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-semibold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* District & State */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t('districtLabel')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Thanjavur / Guntur"
                    className="w-full px-3.5 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-semibold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t('stateLabel')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="e.g. Tamil Nadu"
                    className="w-full px-3.5 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-semibold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Location & GPS Button */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-700">
                    {t('locationLabel')}
                  </label>
                  <button
                    type="button"
                    onClick={handleGpsRequest}
                    disabled={detectingGps}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-xl transition-all"
                  >
                    <Navigation className={`w-3.5 h-3.5 ${detectingGps ? 'animate-spin' : ''}`} />
                    <span>{detectingGps ? t('locationDetecting') : t('useCurrentLocation')}</span>
                  </button>
                </div>
                <div className="relative">
                  <MapPin className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="Village or Town (manual entry allowed)"
                    className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-semibold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                {gpsError && (
                  <p className="text-[11px] text-amber-700 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {gpsError}
                  </p>
                )}
                {latitude && longitude && (
                  <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    GPS coordinates locked ({latitude.toFixed(3)}, {longitude.toFixed(3)})
                  </p>
                )}
              </div>

              {/* Farming Experience */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t('farmingExpLabel')}
                </label>
                <select
                  value={farmingExp}
                  onChange={(e) => setFarmingExp(e.target.value)}
                  className="w-full px-3.5 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-semibold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="1 to 3 Years">{t('farmingExp1')}</option>
                  <option value="4 to 10 Years">{t('farmingExp2')}</option>
                  <option value="10 to 20 Years">{t('farmingExp3')}</option>
                  <option value="20+ Years">{t('farmingExp4')}</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-3.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-2xl font-bold text-sm"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-2xl font-bold text-base shadow-lg shadow-emerald-700/20"
                >
                  {t('createFarmerAccount')}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: REGISTRATION FOR BUYER */}
          {step === 3 && selectedRole === 'buyer' && (
            <form onSubmit={handleBuyerSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-3 text-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-1">
                  Step 3 of 3 • Buyer Profile
                </span>
                <h2 className="text-xl font-black text-stone-900">{t('buyerRegTitle')}</h2>
                <p className="text-xs text-stone-600">{t('buyerRegSubtitle')}</p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t('fullNameLabel')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="e.g. Anand Sharma"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-semibold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Business Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t('businessNameLabel')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Mahalakshmi Agro Traders"
                    className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-semibold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Contact Phone / Email */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t('buyerContactLabel')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={buyerContact}
                  onChange={(e) => setBuyerContact(e.target.value)}
                  placeholder="Phone number or Email"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-semibold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Location & Buyer Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t('locationLabel')}
                  </label>
                  <input
                    type="text"
                    value={buyerLocation}
                    onChange={(e) => setBuyerLocation(e.target.value)}
                    placeholder="City / Mandi Hub"
                    className="w-full px-3.5 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-semibold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t('buyerTypeLabel')}
                  </label>
                  <select
                    value={buyerType}
                    onChange={(e) => setBuyerType(e.target.value as any)}
                    className="w-full px-3 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-semibold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Wholesaler">Wholesaler</option>
                    <option value="Retailer">Retailer</option>
                    <option value="Exporter">Exporter</option>
                    <option value="Food Processor">Food Processor</option>
                    <option value="FPO">FPO</option>
                    <option value="Direct Consumer">Direct Consumer</option>
                  </select>
                </div>
              </div>

              {/* Crops Interested In */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {t('cropsInterestedLabel')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableCrops.map((crop) => {
                    const isSelected = selectedCrops.includes(crop);
                    return (
                      <button
                        key={crop}
                        type="button"
                        onClick={() => toggleCrop(crop)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all border ${
                          isSelected
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-amber-400'
                        }`}
                      >
                        {isSelected && '✓ '}
                        {crop}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-3.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-2xl font-bold text-sm"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3.5 px-4 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-2xl font-bold text-base shadow-lg shadow-amber-700/20"
                >
                  {t('createBuyerAccount')}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
