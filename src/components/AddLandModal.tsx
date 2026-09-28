import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Land, IrrigationType, CropStage } from '../types';
import { StorageService } from '../services/storageService';
import { 
  X, 
  MapPin, 
  Navigation, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  Sprout,
  Droplets,
  Calendar,
  Sparkles
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onLandAdded: (land: Land) => void;
  existingLand?: Land | null;
}

export const AddLandModal: React.FC<Props> = ({
  isOpen,
  onClose,
  userId,
  onLandAdded,
  existingLand
}) => {
  const { t } = useLanguage();

  // Wizard Step: 1 = Crop, 2 = Land size, 3 = Planting date, 4 = Done
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form values
  const [name, setName] = useState(existingLand?.name || '');
  const [location, setLocation] = useState(existingLand?.location || '');
  const [district, setDistrict] = useState(existingLand?.district || 'Thanjavur');
  const [stateName, setStateName] = useState(existingLand?.state || 'Tamil Nadu');
  const [latitude, setLatitude] = useState(existingLand?.latitude || 10.7870);
  const [longitude, setLongitude] = useState(existingLand?.longitude || 79.1378);
  const [area, setArea] = useState(existingLand?.area?.toString() || '2.0');
  const [areaUnit, setAreaUnit] = useState<Land['areaUnit']>(existingLand?.areaUnit || 'Acres');
  const [irrigationType, setIrrigationType] = useState<IrrigationType>(
    existingLand?.irrigationType || 'Drip Irrigation'
  );
  const [currentCrop, setCurrentCrop] = useState(existingLand?.currentCrop || 'Watermelon');
  const [customCropInput, setCustomCropInput] = useState('');
  const [cropVariety, setCropVariety] = useState(existingLand?.cropVariety || 'Standard Hybrid');
  const [plantingDate, setPlantingDate] = useState(
    existingLand?.plantingDate || new Date().toISOString().split('T')[0]
  );
  const [cropStage, setCropStage] = useState<CropStage>(existingLand?.cropStage || 'Vegetative');

  if (!isOpen) return null;

  const popularCrops = [
    { name: 'Watermelon', icon: '🍉' },
    { name: 'Paddy (Rice)', icon: '🌾' },
    { name: 'Maize', icon: '🌽' },
    { name: 'Cotton', icon: '🌱' },
    { name: 'Wheat', icon: '🌿' },
    { name: 'Tomato', icon: '🍅' },
    { name: 'Sugarcane', icon: '🎋' },
    { name: 'Other', icon: '➕' }
  ];

  const irrigationOptions: IrrigationType[] = [
    'Drip Irrigation',
    'Sprinkler',
    'Flood / Canal',
    'Rainfed',
    'Borewell / Tube Well'
  ];

  const stageOptions: CropStage[] = [
    'Germination',
    'Vegetative',
    'Flowering',
    'Pod / Fruit Formation',
    'Harvest Ready'
  ];

  const handleDetectGps = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          if (!location) setLocation(`GPS Field (${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)})`);
        },
        (err) => console.warn(err.message),
        { enableHighAccuracy: true }
      );
    }
  };

  const handleSaveLand = () => {
    const activeCrop = currentCrop === 'Other' && customCropInput.trim() 
      ? customCropInput.trim() 
      : currentCrop;

    const landId = existingLand?.id || `land-${Date.now()}`;
    const newLand: Land = {
      id: landId,
      userId,
      name: name.trim() || `Land: ${activeCrop} Field`,
      location: location.trim() || `${district}, ${stateName}`,
      district: district.trim() || 'Thanjavur',
      state: stateName.trim() || 'Tamil Nadu',
      latitude: Number(latitude),
      longitude: Number(longitude),
      area: parseFloat(area) || 2.0,
      areaUnit,
      irrigationType,
      currentCrop: activeCrop || 'Watermelon',
      cropVariety: cropVariety.trim() || 'Standard',
      plantingDate,
      cropStage,
      soilStatus: existingLand?.soilStatus || 'good',
      createdAt: existingLand?.createdAt || new Date().toISOString()
    };

    StorageService.saveLand(userId, newLand);
    onLandAdded(newLand);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border-2 border-stone-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Step {currentStep} of 4
            </span>
            <h2 className="text-xl font-black text-stone-900 mt-1">
              {existingLand ? 'Edit Land' : 'Add Your Land'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] rounded-2xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: CROP? */}
        {currentStep === 1 && (
          <div className="mt-5 space-y-4">
            <div>
              <h3 className="text-lg font-black text-stone-900">
                🌱 Which crop are you growing?
              </h3>
              <p className="text-xs text-stone-600 font-semibold mt-0.5">
                Tap your crop below:
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {popularCrops.map((c) => {
                const isSelected = currentCrop === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setCurrentCrop(c.name)}
                    className={`min-h-[54px] p-3 rounded-2xl border-2 text-left transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-emerald-100 border-emerald-600 text-emerald-950 font-black ring-2 ring-emerald-500/20 shadow-sm'
                        : 'bg-stone-50 border-stone-200 text-stone-800 font-bold hover:border-stone-300'
                    }`}
                  >
                    <span className="text-2xl">{c.icon}</span>
                    <span className="text-sm">{c.name}</span>
                  </button>
                );
              })}
            </div>

            {currentCrop === 'Other' && (
              <div className="mt-3">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Type your crop name:
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={customCropInput}
                  onChange={(e) => setCustomCropInput(e.target.value)}
                  placeholder="e.g. Chilli, Onion, Mustard"
                  className="w-full min-h-[48px] px-3.5 py-2.5 bg-stone-50 border-2 border-stone-300 rounded-2xl text-sm font-bold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            )}

            <div className="pt-2">
              <label className="block text-xs font-bold text-stone-600 mb-1">
                Crop Variety (Optional):
              </label>
              <input
                type="text"
                value={cropVariety}
                onChange={(e) => setCropVariety(e.target.value)}
                placeholder="e.g. Hybrid, Sugar Baby, Pioneer"
                className="w-full min-h-[44px] px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full min-h-[50px] py-3 px-6 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <span>Next: Land Size</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: LAND SIZE? */}
        {currentStep === 2 && (
          <div className="mt-5 space-y-4">
            <div>
              <h3 className="text-lg font-black text-stone-900">
                📏 What is your land size and name?
              </h3>
              <p className="text-xs text-stone-600 font-semibold mt-0.5">
                Enter size in acres and field name.
              </p>
            </div>

            {/* Land Size & Unit */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-stone-800 mb-1">
                  Area Size *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="2.0"
                  className="w-full min-h-[48px] px-4 py-2.5 bg-stone-50 border-2 border-stone-300 rounded-2xl text-lg font-black text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-stone-800 mb-1">
                  Unit
                </label>
                <select
                  value={areaUnit}
                  onChange={(e) => setAreaUnit(e.target.value as any)}
                  className="w-full min-h-[48px] px-3 py-2.5 bg-stone-50 border-2 border-stone-300 rounded-2xl text-sm font-bold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Acres">Acres</option>
                  <option value="Hectares">Hectares</option>
                  <option value="Bigha">Bigha</option>
                  <option value="Guntha">Guntha</option>
                </select>
              </div>
            </div>

            {/* Land Name */}
            <div>
              <label className="block text-xs font-black text-stone-800 mb-1">
                Field Name / Plot Label
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. North Riverbed Plot / Land 1"
                className="w-full min-h-[48px] px-3.5 py-2.5 bg-stone-50 border-2 border-stone-300 rounded-2xl text-sm font-bold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Location & GPS */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-black text-stone-800">Village / Location</label>
                <button
                  type="button"
                  onClick={handleDetectGps}
                  className="text-xs font-black text-emerald-800 flex items-center gap-1 hover:underline"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Use GPS</span>
                </button>
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Papanasam, Thanjavur"
                className="w-full min-h-[48px] px-3.5 py-2.5 bg-stone-50 border-2 border-stone-300 rounded-2xl text-sm font-bold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="w-1/3 min-h-[50px] py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-2xl text-sm font-black flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="w-2/3 min-h-[50px] py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-md"
              >
                <span>Next: Planting Date</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PLANTING DATE? */}
        {currentStep === 3 && (
          <div className="mt-5 space-y-4">
            <div>
              <h3 className="text-lg font-black text-stone-900">
                📅 Planting Date & Water Method?
              </h3>
              <p className="text-xs text-stone-600 font-semibold mt-0.5">
                When did you sow seeds and how do you water?
              </p>
            </div>

            {/* Planting Date */}
            <div>
              <label className="block text-xs font-black text-stone-800 mb-1">
                Planting / Sowing Date
              </label>
              <input
                type="date"
                value={plantingDate}
                onChange={(e) => setPlantingDate(e.target.value)}
                className="w-full min-h-[48px] px-4 py-2.5 bg-stone-50 border-2 border-stone-300 rounded-2xl text-sm font-black text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Growth Stage */}
            <div>
              <label className="block text-xs font-black text-stone-800 mb-1.5">
                Current Crop Stage
              </label>
              <div className="grid grid-cols-2 gap-2">
                {stageOptions.map((stg) => (
                  <button
                    key={stg}
                    type="button"
                    onClick={() => setCropStage(stg)}
                    className={`min-h-[44px] p-2 rounded-xl border text-xs font-bold text-left transition-all ${
                      cropStage === stg
                        ? 'bg-emerald-100 border-emerald-600 text-emerald-950 font-black'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {stg}
                  </button>
                ))}
              </div>
            </div>

            {/* Irrigation Type */}
            <div>
              <label className="block text-xs font-black text-stone-800 mb-1.5">
                💧 Water Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                {irrigationOptions.map((irr) => (
                  <button
                    key={irr}
                    type="button"
                    onClick={() => setIrrigationType(irr)}
                    className={`min-h-[44px] p-2 rounded-xl border text-xs font-bold text-left transition-all ${
                      irrigationType === irr
                        ? 'bg-sky-100 border-sky-600 text-sky-950 font-black'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {irr}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-1/3 min-h-[50px] py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-2xl text-sm font-black flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="w-2/3 min-h-[50px] py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-md"
              >
                <span>Next: Review & Done</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: THEN DONE! */}
        {currentStep === 4 && (
          <div className="mt-5 space-y-4">
            <div>
              <h3 className="text-xl font-black text-stone-900">
                ✅ Done! Confirm and Save
              </h3>
              <p className="text-xs text-stone-600 font-semibold mt-0.5">
                Check details for your plot:
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border-2 border-emerald-300 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-600">Crop:</span>
                <span className="text-sm font-black text-stone-900">
                  {currentCrop === 'Other' && customCropInput ? customCropInput : currentCrop}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-600">Land Size:</span>
                <span className="text-sm font-black text-stone-900">{area} {areaUnit}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-600">Plot Name:</span>
                <span className="text-sm font-black text-stone-900">{name || 'Farm Plot'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-600">Planting Date:</span>
                <span className="text-sm font-black text-stone-900">{plantingDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-600">Water Method:</span>
                <span className="text-sm font-black text-stone-900">{irrigationType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-600">Stage:</span>
                <span className="text-sm font-black text-emerald-800">{cropStage}</span>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="w-1/3 min-h-[52px] py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-2xl text-sm font-black flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleSaveLand}
                className="w-2/3 min-h-[52px] py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-800/30"
              >
                <Check className="w-5 h-5 stroke-[3]" />
                <span>Save My Land</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
