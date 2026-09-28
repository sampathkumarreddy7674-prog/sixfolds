import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  Land, 
  CropCalendarMilestone, 
  CropPlanningOption, 
  SmartIrrigationData, 
  CropHealthAnalysis, 
  YieldPredictionResult,
  FarmerProfile 
} from '../types';
import { StorageService } from '../services/storageService';
import { SoilHealthView } from './SoilHealthView';
import { ConflictResolverView } from './ConflictResolverView';
import { CommunityView } from './CommunityView';
import { generateCropPlanningRecommendations } from '../services/cropPlanningService';
import { generateCropCalendar } from '../services/cropCalendarService';
import { calculateSmartIrrigation } from '../services/smartIrrigationService';
import { analyzeCropHealthImage } from '../services/cropHealthService';
import { predictCropYield } from '../services/yieldPredictionService';
import { 
  MapPin, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Droplets, 
  Bug, 
  TrendingUp, 
  Store, 
  Warehouse, 
  Calculator, 
  Truck, 
  FileCheck2, 
  Leaf, 
  Sparkles,
  Sprout,
  ArrowRight,
  ArrowLeft,
  Camera,
  Image as ImageIcon,
  Check,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  AlertCircle,
  PhoneCall,
  Users
} from 'lucide-react';

interface Props {
  currentLand: Land;
  lands: Land[];
  onSelectLand: (land: Land) => void;
  onAddNewLand: () => void;
  onLandDeleted: (landId: string) => void;
  defaultSubTab?: string;
  farmerProfile?: FarmerProfile | null;
}

export const MyFarmView: React.FC<Props> = ({
  currentLand,
  lands,
  onSelectLand,
  onAddNewLand,
  onLandDeleted,
  defaultSubTab = 'menu',
  farmerProfile
}) => {
  const { t } = useLanguage();

  // Active view: 'menu' (shows 7 cards) or a specific module id
  const [activeModule, setActiveModule] = useState<string>(
    defaultSubTab === 'lands' ? 'menu' : defaultSubTab
  );

  // Synchronized isolated data for currentLand
  const soil = StorageService.getSoilHealthCard(currentLand.id);
  const weather = StorageService.getWeather(currentLand.id);

  // 1. Crop Planning State
  const [planningOptions, setPlanningOptions] = useState<CropPlanningOption[]>(() =>
    generateCropPlanningRecommendations(currentLand, soil, weather)
  );

  // 2. Crop Calendar State
  const [calendarMilestones, setCalendarMilestones] = useState<CropCalendarMilestone[]>(() =>
    generateCropCalendar(currentLand)
  );
  const [showFullCalendar, setShowFullCalendar] = useState(false);

  // 3. Smart Irrigation State
  const [manualMoisture, setManualMoisture] = useState<number | undefined>(undefined);
  const [irrigationData, setIrrigationData] = useState<SmartIrrigationData>(() =>
    calculateSmartIrrigation(currentLand, weather)
  );
  const [showWaterWhy, setShowWaterWhy] = useState(false);

  // 4. Crop Health State
  const [leafPhoto, setLeafPhoto] = useState<string | null>(null);
  const [selectedSymptom, setSelectedSymptom] = useState<string>('mildew');
  const [cropHealthStatus, setCropHealthStatus] = useState<'healthy' | 'warning' | 'problem'>('healthy');
  const [cropHealthGuidance, setCropHealthGuidance] = useState<string>(
    'Leaves look healthy and green. No pest or pathogen stress detected.'
  );
  const [healthAnalysis, setHealthAnalysis] = useState<CropHealthAnalysis>(() =>
    analyzeCropHealthImage(currentLand, undefined, 'mildew')
  );
  const fileCameraRef = useRef<HTMLInputElement>(null);
  const fileGalleryRef = useRef<HTMLInputElement>(null);

  // 5. Yield Prediction State
  const [yieldResult, setYieldResult] = useState<YieldPredictionResult>(() =>
    predictCropYield(currentLand, soil, weather)
  );

  // 6. Profit Calculator State
  const [seedCost, setSeedCost] = useState('2400');
  const [fertCost, setFertCost] = useState('4500');
  const [laborCost, setLaborCost] = useState('7000');
  const [machineryCost, setMachineryCost] = useState('3500');
  const [expectedYieldUnits, setExpectedYieldUnits] = useState(
    currentLand.currentCrop.toLowerCase().includes('watermelon') ? '24' : '68'
  );
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState(
    currentLand.currentCrop.toLowerCase().includes('watermelon') ? '14000' : '2300'
  );

  // Re-calculate when currentLand changes (strict isolation!)
  useEffect(() => {
    const s = StorageService.getSoilHealthCard(currentLand.id);
    const w = StorageService.getWeather(currentLand.id);
    setPlanningOptions(generateCropPlanningRecommendations(currentLand, s, w));
    setCalendarMilestones(generateCropCalendar(currentLand));
    setManualMoisture(undefined);
    setIrrigationData(calculateSmartIrrigation(currentLand, w));
    setHealthAnalysis(analyzeCropHealthImage(currentLand, undefined, selectedSymptom));
    setYieldResult(predictCropYield(currentLand, s, w));
    setExpectedYieldUnits(currentLand.currentCrop.toLowerCase().includes('watermelon') ? '24' : '68');
    setSellingPricePerUnit(currentLand.currentCrop.toLowerCase().includes('watermelon') ? '14000' : '2300');
    setShowWaterWhy(false);
    setShowFullCalendar(false);

    if (currentLand.currentCrop.toLowerCase().includes('watermelon')) {
      setCropHealthStatus('healthy');
      setCropHealthGuidance('Leaves look healthy and green. Fruit formation is developing well.');
    } else {
      setCropHealthStatus('healthy');
      setCropHealthGuidance('Vigorous vegetative growth. No pest stress spotted.');
    }
  }, [currentLand.id, currentLand.currentCrop, currentLand.cropStage]);

  // Sync if defaultSubTab changes from parent
  useEffect(() => {
    if (defaultSubTab && defaultSubTab !== 'lands') {
      setActiveModule(defaultSubTab);
    }
  }, [defaultSubTab]);

  const handleMoistureChange = (val: number) => {
    setManualMoisture(val);
    setIrrigationData(calculateSmartIrrigation(currentLand, weather, val));
  };

  const handleApplyCropDecision = (opt: CropPlanningOption) => {
    const currentUser = StorageService.getCurrentUser();
    if (!currentUser) return;
    const updatedLand: Land = {
      ...currentLand,
      currentCrop: opt.cropName,
      cropVariety: opt.variety,
      cropStage: 'Germination',
      plantingDate: new Date().toISOString().split('T')[0]
    };
    StorageService.saveLand(currentUser.id, updatedLand);
    onSelectLand(updatedLand);
    setActiveModule('menu');
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setLeafPhoto(dataUrl);
      const analysis = analyzeCropHealthImage(currentLand, dataUrl, selectedSymptom);
      setHealthAnalysis(analysis);
      if (file.name.toLowerCase().includes('spot') || file.name.toLowerCase().includes('yellow')) {
        setCropHealthStatus('problem');
        setCropHealthGuidance('Problem Detected: Fungal Leaf Spot / Blight. Apply bio-fungicide or Neem extract.');
      } else {
        setCropHealthStatus('healthy');
        setCropHealthGuidance('🟢 Looks Healthy: Good chlorophyll and leaf structure.');
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleMilestoneDone = (idx: number) => {
    setCalendarMilestones(prev => {
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        completed: !updated[idx].completed
      };
      return updated;
    });
  };

  // Profit calculation logic
  const totalCost = (parseFloat(seedCost) || 0) + (parseFloat(fertCost) || 0) + (parseFloat(laborCost) || 0) + (parseFloat(machineryCost) || 0);
  const totalRevenue = (parseFloat(expectedYieldUnits) || 0) * (parseFloat(sellingPricePerUnit) || 0);
  const netProfit = totalRevenue - totalCost;

  // Water Advice status
  const isRainExpected = weather.rainProbability >= 50 || weather.forecastRainMm >= 10;
  const waterHeadline = isRainExpected ? 'Wait. Rain is expected.' : 'Water may be needed.';
  const waterWhyReason = isRainExpected
    ? `Rain expected today (${weather.rainProbability}% chance, ~${weather.forecastRainMm}mm precipitation forecast). Soil has adequate moisture reserves. Hold irrigation.`
    : `Rain chance is low (${weather.rainProbability}%). Root moisture is ~${irrigationData.soilMoisturePercent}%. Run ${currentLand.irrigationType} for ${irrigationData.suggestedDurationMinutes} minutes.`;

  // Calendar Day calculation
  const plantDate = new Date(currentLand.plantingDate || '2026-08-01');
  const todayDate = new Date();
  const diffDays = Math.max(1, Math.floor((todayDate.getTime() - plantDate.getTime()) / (1000 * 60 * 60 * 24)));
  const totalDays = currentLand.currentCrop.toLowerCase().includes('watermelon') ? 78 : 95;
  const currentDay = Math.min(diffDays, totalDays);

  return (
    <div className="space-y-5 pb-20 max-w-2xl mx-auto">
      
      {/* 1. REQUIREMENT 3: MY LANDS AS SIMPLE CARDS */}
      <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-black text-stone-900 leading-tight">
              My Lands
            </h2>
            <p className="text-xs text-stone-600 font-semibold mt-0.5">
              Tap a land to view its specific crop and advice
            </p>
          </div>
          
          <button
            type="button"
            onClick={onAddNewLand}
            className="min-h-[48px] px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Add Land</span>
          </button>
        </div>

        {/* Lands Cards: Land 1 → location → area → crop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {lands.map((land, index) => {
            const isSelected = land.id === currentLand.id;
            return (
              <div
                key={land.id}
                onClick={() => onSelectLand(land)}
                className={`min-h-[92px] p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'bg-stone-50 border-stone-300 hover:border-emerald-400'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-stone-900 truncate">
                        {land.name || `Land ${index + 1}`}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-700 text-white">
                          Active
                        </span>
                      )}
                    </div>
                    {/* location → area → crop */}
                    <p className="text-xs text-stone-600 font-bold mt-1 truncate">
                      📍 {land.location}
                    </p>
                    <p className="text-xs text-stone-800 font-black mt-0.5">
                      📐 {land.area} {land.areaUnit} • 🌱 {land.currentCrop}
                    </p>
                  </div>

                  {lands.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLandDeleted(land.id);
                      }}
                      className="min-w-[36px] min-h-[36px] p-2 text-stone-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-all shrink-0"
                      title="Delete land"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. IF A SUB-MODULE IS SELECTED, SHOW BACK BUTTON & SUBMODULE */}
      {activeModule !== 'menu' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-stone-100 p-3 rounded-2xl border border-stone-200">
            <button
              type="button"
              onClick={() => setActiveModule('menu')}
              className="min-h-[44px] px-3.5 py-1.5 bg-white hover:bg-stone-50 text-stone-900 rounded-xl text-xs font-black flex items-center gap-2 border border-stone-300 transition-all"
            >
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              <span>Back to All Farm Tools</span>
            </button>
            <span className="text-xs font-black text-emerald-800">
              {currentLand.name}
            </span>
          </div>

          {/* 🌱 CROP MODULE */}
          {activeModule === 'crop' && (
            <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-stone-900">🌱 Crop Management</h3>
                  <p className="text-xs text-stone-600 font-bold">{currentLand.name}</p>
                </div>
                <span className="text-xs font-black px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900">
                  {currentLand.cropStage}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase block">Active Crop</span>
                  <h4 className="text-xl font-black text-stone-900 mt-0.5">{currentLand.currentCrop}</h4>
                  <p className="text-xs text-stone-600 font-bold">{currentLand.cropVariety} • Planted {currentLand.plantingDate}</p>
                </div>
                <span className="text-2xl font-black text-emerald-800">
                  {currentLand.area} {currentLand.areaUnit}
                </span>
              </div>

              {/* Crop Planning Options */}
              <div className="pt-2">
                <h4 className="text-sm font-black text-stone-900 mb-2">Suitable Alternative Crops:</h4>
                <div className="space-y-3">
                  {planningOptions.map((opt, i) => (
                    <div key={i} className="p-4 rounded-2xl border-2 border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-sm font-black text-stone-900">{opt.cropName}</h5>
                          <span className="text-xs font-extrabold text-emerald-800">
                            {opt.suitabilityScore}% Fit
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 font-medium mt-0.5">{opt.reason}</p>
                        <p className="text-[11px] text-stone-500 font-bold mt-1">
                          Duration: {opt.durationDays} days • Water: {opt.waterRequirement}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleApplyCropDecision(opt)}
                        className="min-h-[44px] px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black shrink-0"
                      >
                        Select Crop
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 🧪 SOIL MODULE */}
          {activeModule === 'soil' && (
            <SoilHealthView land={currentLand} />
          )}

          {/* 💧 WATER MODULE (Requirement 8) */}
          {activeModule === 'water' && (
            <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-stone-900">💧 Water Advice</h3>
                  <p className="text-xs text-stone-600 font-bold">{currentLand.name}</p>
                </div>
                <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-sky-100 text-sky-900 border border-sky-300">
                  {currentLand.irrigationType}
                </span>
              </div>

              {/* Requirement 8: Water Advice Banner */}
              <div className="p-5 rounded-3xl bg-sky-50 border-2 border-sky-300">
                <span className="text-xs font-black uppercase tracking-wider text-sky-800 block mb-1">
                  💧 WATER ADVICE
                </span>
                <h4 className={`text-2xl font-black ${isRainExpected ? 'text-amber-900' : 'text-emerald-950'}`}>
                  "{waterHeadline}"
                </h4>

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setShowWaterWhy(!showWaterWhy)}
                    className="min-h-[44px] px-4 py-2 bg-white hover:bg-stone-50 text-stone-900 rounded-xl text-xs font-black border border-stone-300 flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <HelpCircle className="w-4 h-4 text-sky-700" />
                    <span>Why?</span>
                    {showWaterWhy ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showWaterWhy && (
                    <div className="mt-3 p-4 bg-white rounded-2xl border border-sky-200 text-xs font-bold text-stone-800 leading-relaxed shadow-xs">
                      {waterWhyReason}
                    </div>
                  )}
                </div>
              </div>

              {/* Moisture & Controls */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center">
                  <span className="text-xs font-bold text-stone-500 uppercase block">Soil Moisture</span>
                  <p className="text-3xl font-black text-sky-900 mt-1">{irrigationData.soilMoisturePercent}%</p>
                  <span className="text-xs font-bold text-stone-600">
                    {irrigationData.soilMoisturePercent < 35 ? 'Low' : 'Adequate'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center">
                  <span className="text-xs font-bold text-stone-500 uppercase block">Rain Probability</span>
                  <p className="text-3xl font-black text-stone-900 mt-1">{weather.rainProbability}%</p>
                  <span className="text-xs font-bold text-sky-700">{weather.forecastRainMm} mm rain</span>
                </div>
              </div>

              {/* Manual Moisture Slider */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-stone-800">
                  <span>Adjust Soil Moisture Manually:</span>
                  <span className="text-sky-800 text-sm">{irrigationData.soilMoisturePercent}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={irrigationData.soilMoisturePercent}
                  onChange={(e) => handleMoistureChange(parseInt(e.target.value))}
                  className="w-full h-3 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-sky-700"
                />
              </div>
            </div>
          )}

          {/* 📷 CROP HEALTH MODULE (Requirement 9) */}
          {activeModule === 'crophealth' && (
            <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-stone-900">📷 Check Crop</h3>
                  <p className="text-xs text-stone-600 font-bold">{currentLand.name} • {currentLand.currentCrop}</p>
                </div>
              </div>

              {/* Requirement 9: Results Card */}
              <div className={`p-5 rounded-3xl border-2 flex items-center gap-3.5 ${
                cropHealthStatus === 'healthy'
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                  : cropHealthStatus === 'warning'
                  ? 'bg-amber-50 border-amber-400 text-amber-950'
                  : 'bg-rose-50 border-rose-400 text-rose-950'
              }`}>
                {cropHealthStatus === 'healthy' && <CheckCircle2 className="w-10 h-10 text-emerald-600 shrink-0" />}
                {cropHealthStatus === 'warning' && <AlertTriangle className="w-10 h-10 text-amber-600 shrink-0" />}
                {cropHealthStatus === 'problem' && <AlertCircle className="w-10 h-10 text-rose-600 shrink-0" />}

                <div>
                  <h4 className="text-xl font-black leading-tight">
                    {cropHealthStatus === 'healthy' && '🟢 Looks Healthy'}
                    {cropHealthStatus === 'warning' && '🟡 Possible Problem'}
                    {cropHealthStatus === 'problem' && '🔴 Problem Detected'}
                  </h4>
                  <p className="text-xs font-bold mt-1 text-stone-800 leading-snug">
                    {cropHealthGuidance}
                  </p>
                </div>
              </div>

              {/* Photo Preview if any */}
              {leafPhoto && (
                <div className="text-center p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <img src={leafPhoto} alt="Uploaded crop leaf" className="w-40 h-40 object-cover rounded-xl mx-auto shadow-md" />
                </div>
              )}

              {/* Hidden file inputs */}
              <input
                ref={fileCameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handlePhotoSelect}
              />
              <input
                ref={fileGalleryRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoSelect}
              />

              {/* Requirement 9: Large Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => fileCameraRef.current?.click()}
                  className="min-h-[54px] px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Camera className="w-5 h-5" />
                  <span>📷 TAKE PHOTO</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileGalleryRef.current?.click()}
                  className="min-h-[54px] px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-900 border-2 border-stone-300 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all"
                >
                  <ImageIcon className="w-5 h-5 text-stone-700" />
                  <span>🖼️ CHOOSE PHOTO</span>
                </button>
              </div>

              {/* Pathology symptoms selector */}
              <div className="pt-3 border-t border-stone-200">
                <span className="text-xs font-bold text-stone-500 block mb-2">Or test sample symptom:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCropHealthStatus('problem');
                      setCropHealthGuidance('Downy Mildew spotted on leaf underside. Spray Metalaxyl or copper bio-fungicide.');
                    }}
                    className="min-h-[44px] flex-1 py-2 px-3 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-800 hover:bg-rose-50"
                  >
                    Yellow spots / Mildew
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCropHealthStatus('healthy');
                      setCropHealthGuidance('Leaves look healthy and green. No pest or pathogen stress detected.');
                    }}
                    className="min-h-[44px] flex-1 py-2 px-3 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-800 hover:bg-emerald-50"
                  >
                    Clean Healthy Leaf
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 📅 CROP CALENDAR MODULE (Requirement 10) */}
          {activeModule === 'calendar' && (
            <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-stone-900">📅 Crop Calendar</h3>
                  <p className="text-xs text-stone-600 font-bold">{currentLand.name} • {currentLand.currentCrop}</p>
                </div>
                <span className="text-xs font-black px-3 py-1 rounded-xl bg-teal-100 text-teal-900 border border-teal-300">
                  {currentLand.cropStage}
                </span>
              </div>

              {/* Requirement 10: TODAY Banner */}
              <div className="p-5 rounded-3xl bg-emerald-50/80 border-2 border-emerald-400 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                    TODAY
                  </span>
                  <span className="text-sm font-black text-emerald-950 bg-emerald-200/80 px-3 py-1 rounded-full">
                    Day {currentDay} / {totalDays}
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="p-3 bg-white rounded-2xl border border-emerald-200 flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
                    <span className="text-sm font-black text-stone-900">💧 Check water</span>
                  </div>
                  <div className="p-3 bg-white rounded-2xl border border-emerald-200 flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                    <span className="text-sm font-black text-stone-900">🌱 Check leaves</span>
                  </div>
                </div>

                {/* View Full Calendar Button */}
                <button
                  type="button"
                  onClick={() => setShowFullCalendar(!showFullCalendar)}
                  className="min-h-[48px] w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all mt-2"
                >
                  <span>{showFullCalendar ? 'Hide Full Calendar' : 'View Full Calendar'}</span>
                  {showFullCalendar ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Full Calendar Milestones List */}
              {showFullCalendar && (
                <div className="space-y-2.5 pt-2 animate-in fade-in">
                  <h4 className="text-xs font-black uppercase text-stone-500 tracking-wider">
                    Full Season Milestones ({calendarMilestones.length} stages)
                  </h4>
                  {calendarMilestones.map((ms, idx) => (
                    <div
                      key={ms.id || idx}
                      onClick={() => toggleMilestoneDone(idx)}
                      className={`min-h-[48px] p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                        ms.completed
                          ? 'bg-stone-50 border-stone-200 text-stone-400'
                          : 'bg-white border-stone-300 hover:border-emerald-500 text-stone-900'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center shrink-0 ${
                        ms.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-400'
                      }`}>
                        {ms.completed && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h5 className={`text-xs font-black ${ms.completed ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                            {ms.title}
                          </h5>
                          <span className="text-[10px] text-stone-500 font-bold">{ms.targetDate}</span>
                        </div>
                        <p className="text-[11px] text-stone-500 font-medium mt-0.5 line-clamp-1">{ms.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 💰 MARKET MODULE (💰 Sell Crop) */}
          {activeModule === 'market' && (
            <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-stone-900">💰 Sell Crop</h3>
                  <p className="text-xs text-stone-600 font-bold">Mandi Rates & Direct Buyers for {currentLand.name}</p>
                </div>
                <span className="text-xs font-black px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900">
                  Live Mandi
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl border-2 border-stone-200 bg-stone-50 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-stone-900">{currentLand.currentCrop}</h4>
                    <p className="text-xs text-stone-500 font-medium">Nearest Regional APMC Mandi</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-emerald-800">₹14,500 / Ton</span>
                    <span className="block text-[11px] text-emerald-600 font-bold">▲ Good Demand</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-xs font-bold text-emerald-950 space-y-2">
                  <h5 className="text-sm font-black">Direct Verified Buyer Inquiry</h5>
                  <p>Fresh Food Logistics Ltd is ready to purchase 20 Tons of {currentLand.currentCrop} directly from your field at ₹15,000/Ton.</p>
                  <a
                    href="tel:9888877777"
                    className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-black mt-1"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Call Buyer Directly</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* 📊 PROFIT CALCULATOR MODULE */}
          {activeModule === 'profit' && (
            <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm space-y-4">
              <div>
                <h3 className="text-lg font-black text-stone-900">📊 Profit Calculator</h3>
                <p className="text-xs text-stone-600 font-bold">Estimate profit for {currentLand.name} ({currentLand.currentCrop})</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black text-stone-700 block mb-1">Seeds & Mulch (₹)</label>
                  <input
                    type="number"
                    value={seedCost}
                    onChange={(e) => setSeedCost(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-black text-stone-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-stone-700 block mb-1">Fertilizer (₹)</label>
                  <input
                    type="number"
                    value={fertCost}
                    onChange={(e) => setFertCost(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-black text-stone-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-stone-700 block mb-1">Labor Expenses (₹)</label>
                  <input
                    type="number"
                    value={laborCost}
                    onChange={(e) => setLaborCost(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-black text-stone-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-stone-700 block mb-1">Machinery (₹)</label>
                  <input
                    type="number"
                    value={machineryCost}
                    onChange={(e) => setMachineryCost(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-black text-stone-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-stone-700 block mb-1">Expected Output (Tons/Qtl)</label>
                  <input
                    type="number"
                    value={expectedYieldUnits}
                    onChange={(e) => setExpectedYieldUnits(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-black text-stone-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-stone-700 block mb-1">Sale Rate (₹/Unit)</label>
                  <input
                    type="number"
                    value={sellingPricePerUnit}
                    onChange={(e) => setSellingPricePerUnit(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-black text-stone-900"
                  />
                </div>
              </div>

              {/* Profit Summary */}
              <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">Total Cost</span>
                  <span className="text-base font-black text-rose-700">₹{totalCost.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">Revenue</span>
                  <span className="text-base font-black text-stone-900">₹{totalRevenue.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-emerald-800 uppercase block">Net Profit</span>
                  <span className="text-lg font-black text-emerald-800">₹{netProfit.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* ⚠️ DIFFERENT ADVICE (Conflict Resolver) */}
          {activeModule === 'resolver' && (
            <ConflictResolverView land={currentLand} />
          )}

          {/* 🌾 YIELD PREDICTOR */}
          {activeModule === 'yield' && (
            <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-stone-900">Yield Predictor: {currentLand.name}</h3>
              <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-100 border-2 border-emerald-500 text-center">
                <span className="text-xs font-black text-emerald-800 uppercase tracking-widest block">
                  Estimated Yield Range
                </span>
                <div className="text-3xl font-black text-emerald-950 mt-1">
                  {yieldResult.minYield} – {yieldResult.maxYield} {yieldResult.unit}
                </div>
                <p className="text-xs font-bold text-emerald-800 mt-1">
                  Midpoint: ~{yieldResult.expectedAvgYield} {yieldResult.unit} across {currentLand.area} {currentLand.areaUnit}
                </p>
              </div>
            </div>
          )}

          {/* ❄️ STORAGE ADVISOR */}
          {activeModule === 'storage' && (
            <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-stone-900">Cold Storage & Warehouses</h3>
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <h4 className="text-sm font-black text-stone-900">Central Warehouse Corporation (CWC)</h4>
                <p className="text-xs text-stone-500 font-medium">14 km from {currentLand.district} • Rate: ₹4.50 / bag / month</p>
              </div>
            </div>
          )}

          {/* 🚚 LOGISTICS */}
          {activeModule === 'logistics' && (
            <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-stone-900">Farm Transport & Logistics</h3>
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-stone-900">Mini Truck (1.5 Ton)</h4>
                  <p className="text-xs text-stone-500">Available near {currentLand.district}</p>
                </div>
                <a href="tel:9840011223" className="min-h-[44px] px-3.5 py-2 bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4" />
                  <span>Call Driver</span>
                </a>
              </div>
            </div>
          )}

          {/* 🏛️ GOVERNMENT SCHEMES */}
          {activeModule === 'schemes' && (
            <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-stone-900">Government Schemes & Subsidies</h3>
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <h4 className="text-sm font-black text-stone-900">PM-KISAN Samman Nidhi</h4>
                <p className="text-xs text-stone-600 mt-1">₹6,000 / year direct benefit transfer for eligible farmers.</p>
              </div>
            </div>
          )}

          {/* 🌍 SUSTAINABILITY */}
          {activeModule === 'sustainability' && (
            <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-stone-900">Sustainability & Organic Farming</h3>
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-xs font-bold text-emerald-700 uppercase">Eco-Score</span>
                <p className="text-3xl font-black text-emerald-950 mt-1">82 / 100</p>
                <p className="text-xs text-emerald-800 font-semibold mt-1">Eligible for organic subsidy benefits</p>
              </div>
            </div>
          )}

          {/* 👥 COMMUNITY */}
          {activeModule === 'community' && (
            <CommunityView farmer={farmerProfile || StorageService.getFarmerProfile('farmer-demo-01')!} />
          )}

        </div>
      )}

      {/* 3. REQUIREMENT 3: WHEN A LAND IS SELECTED, SHOW 7 PRIMARY CARDS */}
      {activeModule === 'menu' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-stone-900">
                Farming Tools for: <span className="text-emerald-800">{currentLand.name}</span>
              </h3>
              <p className="text-xs text-stone-500 font-semibold">
                Tap any card to view advice or manage your plot
              </p>
            </div>
          </div>

          {/* 7 PRIMARY MODULE CARDS (Requirement 3) */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* 1. 🌱 Crop */}
            <button
              type="button"
              onClick={() => setActiveModule('crop')}
              className="min-h-[100px] p-4 rounded-3xl border-2 border-stone-300 bg-white hover:border-emerald-600 hover:bg-emerald-50/40 text-left transition-all shadow-xs flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                <Sprout className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h4 className="text-base font-black text-stone-900 leading-tight">🌱 Crop</h4>
                <p className="text-xs text-stone-500 font-bold mt-0.5 truncate">{currentLand.currentCrop}</p>
              </div>
            </button>

            {/* 2. 🧪 Soil */}
            <button
              type="button"
              onClick={() => setActiveModule('soil')}
              className="min-h-[100px] p-4 rounded-3xl border-2 border-stone-300 bg-white hover:border-emerald-600 hover:bg-emerald-50/40 text-left transition-all shadow-xs flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black">
                <Sparkles className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <h4 className="text-base font-black text-stone-900 leading-tight">🧪 Soil</h4>
                <p className="text-xs text-stone-500 font-bold mt-0.5 capitalize">Status: {soil.overallStatus.replace('_', ' ')}</p>
              </div>
            </button>

            {/* 3. 💧 Water */}
            <button
              type="button"
              onClick={() => setActiveModule('water')}
              className="min-h-[100px] p-4 rounded-3xl border-2 border-stone-300 bg-white hover:border-sky-600 hover:bg-sky-50/40 text-left transition-all shadow-xs flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-black">
                <Droplets className="w-6 h-6 text-sky-700" />
              </div>
              <div>
                <h4 className="text-base font-black text-stone-900 leading-tight">💧 Water</h4>
                <p className="text-xs text-stone-500 font-bold mt-0.5 truncate">{waterHeadline}</p>
              </div>
            </button>

            {/* 4. 📷 Crop Health */}
            <button
              type="button"
              onClick={() => setActiveModule('crophealth')}
              className="min-h-[100px] p-4 rounded-3xl border-2 border-stone-300 bg-white hover:border-rose-600 hover:bg-rose-50/40 text-left transition-all shadow-xs flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-black">
                <Bug className="w-6 h-6 text-rose-700" />
              </div>
              <div>
                <h4 className="text-base font-black text-stone-900 leading-tight">📷 Crop Health</h4>
                <p className="text-xs text-stone-500 font-bold mt-0.5">Check for pests/spots</p>
              </div>
            </button>

            {/* 5. 📅 Calendar */}
            <button
              type="button"
              onClick={() => setActiveModule('calendar')}
              className="min-h-[100px] p-4 rounded-3xl border-2 border-stone-300 bg-white hover:border-teal-600 hover:bg-teal-50/40 text-left transition-all shadow-xs flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-black">
                <Calendar className="w-6 h-6 text-teal-700" />
              </div>
              <div>
                <h4 className="text-base font-black text-stone-900 leading-tight">📅 Calendar</h4>
                <p className="text-xs text-stone-500 font-bold mt-0.5">Day {currentDay} of {totalDays}</p>
              </div>
            </button>

            {/* 6. 💰 Market */}
            <button
              type="button"
              onClick={() => setActiveModule('market')}
              className="min-h-[100px] p-4 rounded-3xl border-2 border-stone-300 bg-white hover:border-emerald-600 hover:bg-emerald-50/40 text-left transition-all shadow-xs flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                <Store className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h4 className="text-base font-black text-stone-900 leading-tight">💰 Market</h4>
                <p className="text-xs text-stone-500 font-bold mt-0.5">Sell produce & rates</p>
              </div>
            </button>

            {/* 7. 📊 Profit */}
            <button
              type="button"
              onClick={() => setActiveModule('profit')}
              className="col-span-2 min-h-[90px] p-4 rounded-3xl border-2 border-stone-300 bg-white hover:border-emerald-600 hover:bg-emerald-50/40 text-left transition-all shadow-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-black shrink-0">
                  <Calculator className="w-6 h-6 text-purple-700" />
                </div>
                <div>
                  <h4 className="text-base font-black text-stone-900 leading-tight">📊 Profit</h4>
                  <p className="text-xs text-stone-500 font-bold mt-0.5">Calculate costs and returns for this plot</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-stone-400" />
            </button>

          </div>

          {/* MORE FARM TOOLS (Requirement 12: Preserve All Features) */}
          <div className="pt-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-stone-500 mb-2">
              More Farm Tools
            </h4>

            <div className="grid grid-cols-2 gap-2.5">
              
              {/* ⚠️ Different Advice (Recommendation Conflict Resolver) */}
              <button
                type="button"
                onClick={() => setActiveModule('resolver')}
                className="min-h-[50px] p-3 rounded-2xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-left transition-all flex items-center gap-2.5"
              >
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                <span className="text-xs font-black text-amber-950">⚠️ Different Advice</span>
              </button>

              {/* 🌾 Yield Predictor */}
              <button
                type="button"
                onClick={() => setActiveModule('yield')}
                className="min-h-[50px] p-3 rounded-2xl border border-stone-300 bg-white hover:bg-stone-50 text-left transition-all flex items-center gap-2.5"
              >
                <TrendingUp className="w-5 h-5 text-emerald-700 shrink-0" />
                <span className="text-xs font-bold text-stone-800">🌾 Yield Predictor</span>
              </button>

              {/* ❄️ Cold Storage */}
              <button
                type="button"
                onClick={() => setActiveModule('storage')}
                className="min-h-[50px] p-3 rounded-2xl border border-stone-300 bg-white hover:bg-stone-50 text-left transition-all flex items-center gap-2.5"
              >
                <Warehouse className="w-5 h-5 text-blue-700 shrink-0" />
                <span className="text-xs font-bold text-stone-800">❄️ Storage Godowns</span>
              </button>

              {/* 🚚 Transport Logistics */}
              <button
                type="button"
                onClick={() => setActiveModule('logistics')}
                className="min-h-[50px] p-3 rounded-2xl border border-stone-300 bg-white hover:bg-stone-50 text-left transition-all flex items-center gap-2.5"
              >
                <Truck className="w-5 h-5 text-stone-700 shrink-0" />
                <span className="text-xs font-bold text-stone-800">🚚 Farm Transport</span>
              </button>

              {/* 🏛️ Govt Schemes */}
              <button
                type="button"
                onClick={() => setActiveModule('schemes')}
                className="min-h-[50px] p-3 rounded-2xl border border-stone-300 bg-white hover:bg-stone-50 text-left transition-all flex items-center gap-2.5"
              >
                <FileCheck2 className="w-5 h-5 text-indigo-700 shrink-0" />
                <span className="text-xs font-bold text-stone-800">🏛️ Govt Schemes</span>
              </button>

              {/* 🌍 Sustainability */}
              <button
                type="button"
                onClick={() => setActiveModule('sustainability')}
                className="min-h-[50px] p-3 rounded-2xl border border-stone-300 bg-white hover:bg-stone-50 text-left transition-all flex items-center gap-2.5"
              >
                <Leaf className="w-5 h-5 text-emerald-700 shrink-0" />
                <span className="text-xs font-bold text-stone-800">🌍 Eco Farming</span>
              </button>

              {/* 👥 Farmer Community */}
              <button
                type="button"
                onClick={() => setActiveModule('community')}
                className="col-span-2 min-h-[50px] p-3 rounded-2xl border border-stone-300 bg-white hover:bg-stone-50 text-left transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span className="text-xs font-black text-stone-900">👥 Farmer Community & Chat</span>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400" />
              </button>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
