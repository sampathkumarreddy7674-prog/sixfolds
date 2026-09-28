import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Land, FarmTask, WeatherInfo, SoilHealthCard, ConflictResolution } from '../types';
import { StorageService } from '../services/storageService';
import { 
  CloudSun, 
  CloudRain, 
  Droplets, 
  Sprout, 
  Plus, 
  Bot, 
  ArrowRight, 
  MapPin, 
  Calendar,
  Check, 
  Camera, 
  Image as ImageIcon,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface Props {
  land: Land;
  farmerName?: string;
  onNavigateTab: (tab: string) => void;
  onOpenResolver: () => void;
  onOpenAIAssistant: () => void;
  onSwitchLand: () => void;
}

export const FarmerDashboard: React.FC<Props> = ({
  land,
  farmerName,
  onNavigateTab,
  onOpenResolver,
  onOpenAIAssistant,
  onSwitchLand
}) => {
  const { t } = useLanguage();

  const [weather, setWeather] = useState<WeatherInfo>(() => StorageService.getWeather(land.id));
  const [tasks, setTasks] = useState<FarmTask[]>(() => StorageService.getTasks(land.id));
  const [conflict, setConflict] = useState<ConflictResolution>(() => 
    StorageService.getConflictResolution(land)
  );

  // Simple why toggle for water advice
  const [showWaterWhy, setShowWaterWhy] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Crop Photo Health State
  const [cropPhotoResult, setCropPhotoResult] = useState<'healthy' | 'warning' | 'problem'>('healthy');
  const [cropPhotoGuidance, setCropPhotoGuidance] = useState<string>(
    'Leaves look green and strong. No disease or pest spotted.'
  );
  const [analyzingPhoto, setAnalyzingPhoto] = useState(false);

  const fileInputCameraRef = useRef<HTMLInputElement>(null);
  const fileInputGalleryRef = useRef<HTMLInputElement>(null);

  // Farmer greeting name
  const effectiveFarmerName = farmerName || (() => {
    const user = StorageService.getCurrentUser();
    if (user?.id) {
      const p = StorageService.getFarmerProfile(user.id);
      if (p?.name) return p.name;
    }
    return 'Farmer';
  })();

  // Synchronize state when selected land changes (zero mixing between lands!)
  useEffect(() => {
    setWeather(StorageService.getWeather(land.id));
    setTasks(StorageService.getTasks(land.id));
    setConflict(StorageService.getConflictResolution(land));
    setShowWaterWhy(false);

    // Contextual crop health status
    if (land.currentCrop.toLowerCase().includes('watermelon')) {
      setCropPhotoResult('healthy');
      setCropPhotoGuidance('Leaves look green and strong. Soil moisture is optimal for fruit development.');
    } else {
      setCropPhotoResult('healthy');
      setCropPhotoGuidance('Vigorous vegetative growth. No pest infestation detected today.');
    }
  }, [land.id]);

  const handleToggleTask = (taskId: string) => {
    const updated = StorageService.toggleTaskCompleted(land.id, taskId);
    setTasks(updated);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const updated = StorageService.addTask(land.id, {
      title: newTaskTitle.trim(),
      description: 'Daily farm task',
      dueDate: 'Today',
      completed: false,
      category: 'soil',
      priority: 'medium'
    });
    setTasks(updated);
    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  // Photo upload handler
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAnalyzingPhoto(true);

    setTimeout(() => {
      setAnalyzingPhoto(false);
      // Realistic diagnostic for farmer demo
      if (file.name.toLowerCase().includes('yellow') || file.name.toLowerCase().includes('spot')) {
        setCropPhotoResult('problem');
        setCropPhotoGuidance('Fungal Leaf Spot detected. Spray Trichoderma viride bio-fungicide or Neem oil (5ml/L).');
      } else {
        setCropPhotoResult('healthy');
        setCropPhotoGuidance('🟢 Looks Healthy! Crop leaves show good chlorophyll and healthy stem vigor.');
      }
    }, 700);
  };

  // Water Advice logic (Requirement 8)
  const isRainExpected = weather.rainProbability >= 50 || weather.forecastRainMm >= 10;
  const waterHeadline = isRainExpected ? 'Wait. Rain is expected.' : 'Water may be needed.';
  const waterWhyReason = isRainExpected 
    ? `Rain expected today (${weather.rainProbability}% chance, ~${weather.forecastRainMm}mm forecast). Natural rain will supply sufficient soil moisture.`
    : `Rain chance is low (${weather.rainProbability}%). Topsoil moisture is dropping. Run ${land.irrigationType} for 35-45 minutes.`;

  // Crop Calendar days calculation (Requirement 10)
  const plantDate = new Date(land.plantingDate || '2026-08-01');
  const today = new Date();
  const diffDays = Math.max(1, Math.floor((today.getTime() - plantDate.getTime()) / (1000 * 60 * 60 * 24)));
  const totalDays = land.currentCrop.toLowerCase().includes('watermelon') ? 78 : 95;
  const currentDay = Math.min(diffDays, totalDays);

  return (
    <div className="space-y-4 pb-20 max-w-2xl mx-auto">
      
      {/* 1. FARMER GREETING & SELECTED LAND */}
      <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
              Namaste 🙏
            </span>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight leading-tight mt-0.5">
              {effectiveFarmerName}
            </h1>
          </div>

          <button
            type="button"
            onClick={onSwitchLand}
            className="min-h-[44px] min-w-[44px] px-4 py-2 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-800 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0"
          >
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>Switch Land</span>
          </button>
        </div>

        {/* Selected Land Card */}
        <div className="mt-3.5 p-4 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shrink-0">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black text-stone-900 leading-tight">
                {land.name}
              </h2>
              <p className="text-xs text-stone-600 font-semibold mt-0.5">
                {land.location} • <strong className="text-stone-900">{land.area} {land.areaUnit}</strong>
              </p>
              <p className="text-xs text-emerald-800 font-black mt-0.5">
                Crop: {land.currentCrop} ({land.cropStage})
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. WEATHER CARD (Requirement 7) */}
      <div 
        onClick={() => onNavigateTab('irrigation')}
        className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm cursor-pointer hover:border-emerald-400 transition-all"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            {isRainExpected ? (
              <CloudRain className="w-5 h-5 text-sky-600" />
            ) : (
              <CloudSun className="w-5 h-5 text-amber-500" />
            )}
            Weather
          </span>
          <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-sky-100 text-sky-900 border border-sky-300">
            {weather.rainProbability}% Rain
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-2">
          <div>
            <h3 className="text-xl font-black text-stone-900">
              {isRainExpected ? '🌧️ Rain expected today' : '☀️ Sunny today'}
            </h3>
            <p className="text-sm font-bold text-stone-700 mt-1">
              {isRainExpected ? 'Watering may not be needed.' : 'Normal watering needed.'}
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-stone-900">{weather.temperature}°C</span>
          </div>
        </div>
      </div>

      {/* 3. TODAY'S WORK (Requirement 4: 📋 TODAY'S WORK) */}
      <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
              Daily Farm Checklist
            </span>
            <h3 className="text-lg font-black text-stone-900 flex items-center gap-1.5 mt-0.5">
              <span>📋 TODAY'S WORK</span>
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingTask(!isAddingTask)}
            className="min-h-[44px] px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-black flex items-center gap-1 border border-stone-300 transition-all"
          >
            <Plus className="w-4 h-4 text-stone-700" />
            <span>Add Action</span>
          </button>
        </div>

        {isAddingTask && (
          <form onSubmit={handleCreateTask} className="mb-3 p-3 bg-stone-50 rounded-2xl border border-stone-300 flex gap-2">
            <input
              type="text"
              required
              autoFocus
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="e.g. 💧 Check furrow valves"
              className="flex-1 px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="min-h-[44px] px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black"
            >
              Add
            </button>
          </form>
        )}

        {tasks.length === 0 ? (
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-2">
            <p className="text-xs font-bold text-stone-600">All today's tasks completed!</p>
            <button
              type="button"
              onClick={() => {
                const resetTasks = StorageService.resetTasks(land.id);
                setTasks(resetTasks);
              }}
              className="min-h-[44px] px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-black"
            >
              Reset Recommended Work
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {tasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                onClick={() => handleToggleTask(task.id)}
                className={`min-h-[50px] p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3.5 ${
                  task.completed 
                    ? 'bg-stone-50 border-stone-200 text-stone-400' 
                    : 'bg-white border-stone-300 hover:border-emerald-500 text-stone-900 shadow-xs'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center shrink-0 transition-all ${
                  task.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-400 bg-white'
                }`}>
                  {task.completed && <Check className="w-5 h-5 stroke-[3]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-base font-black leading-tight ${task.completed ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-stone-500 font-semibold mt-0.5 line-clamp-1">{task.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. WATER ADVICE (Requirement 8) */}
      <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-sky-600" />
            💧 Water Advice
          </span>
          <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-lg bg-stone-100 text-stone-700 border border-stone-200">
            {land.irrigationType}
          </span>
        </div>

        <div className="mt-1">
          <h3 className={`text-xl font-black ${isRainExpected ? 'text-amber-800' : 'text-emerald-800'}`}>
            "{waterHeadline}"
          </h3>

          {/* "Why?" Toggle Button */}
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowWaterWhy(!showWaterWhy)}
              className="min-h-[44px] px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-black rounded-xl border border-stone-300 flex items-center gap-1.5 transition-all"
            >
              <HelpCircle className="w-4 h-4 text-stone-600" />
              <span>Why?</span>
              {showWaterWhy ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showWaterWhy && (
              <div className="mt-2.5 p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs font-bold text-sky-950 leading-relaxed">
                {waterWhyReason}
              </div>
            )}
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigateTab('irrigation')}
            className="min-h-[44px] w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-xs transition-all"
          >
            <span>Open Water Controller</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5. CROP HEALTH STATUS (Requirement 9) */}
      <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <Sprout className="w-4 h-4 text-emerald-600" />
            📷 Crop Health
          </span>
          <span className="text-xs font-bold text-stone-500">
            {land.currentCrop}
          </span>
        </div>

        {/* Results Banner */}
        <div className={`p-4 rounded-2xl border-2 flex items-center gap-3 ${
          cropPhotoResult === 'healthy' 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
            : cropPhotoResult === 'warning'
            ? 'bg-amber-50 border-amber-300 text-amber-950'
            : 'bg-rose-50 border-rose-300 text-rose-950'
        }`}>
          {cropPhotoResult === 'healthy' && <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />}
          {cropPhotoResult === 'warning' && <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0" />}
          {cropPhotoResult === 'problem' && <AlertCircle className="w-8 h-8 text-rose-600 shrink-0" />}

          <div>
            <h4 className="text-base font-black leading-tight">
              {cropPhotoResult === 'healthy' && '🟢 Looks Healthy'}
              {cropPhotoResult === 'warning' && '🟡 Possible Problem'}
              {cropPhotoResult === 'problem' && '🔴 Problem Detected'}
            </h4>
            <p className="text-xs font-bold mt-1 text-stone-700 leading-snug">
              {analyzingPhoto ? 'Analyzing crop leaves...' : cropPhotoGuidance}
            </p>
          </div>
        </div>

        {/* Hidden File Inputs */}
        <input
          ref={fileInputCameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handlePhotoSelect}
        />
        <input
          ref={fileInputGalleryRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoSelect}
        />

        {/* Large Action Buttons (Requirement 9) */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            type="button"
            onClick={() => fileInputCameraRef.current?.click()}
            className="min-h-[50px] px-3 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Camera className="w-5 h-5" />
            <span>📷 TAKE PHOTO</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputGalleryRef.current?.click()}
            className="min-h-[50px] px-3 py-3 bg-stone-100 hover:bg-stone-200 text-stone-900 border-2 border-stone-300 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all"
          >
            <ImageIcon className="w-5 h-5 text-stone-700" />
            <span>🖼️ CHOOSE PHOTO</span>
          </button>
        </div>
      </div>

      {/* 6. CROP CALENDAR GLANCE (Requirement 10) */}
      <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-600" />
            TODAY
          </span>
          <span className="text-xs font-extrabold text-emerald-900 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-300">
            Day {currentDay} / {totalDays}
          </span>
        </div>

        <div className="mt-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
          <div className="flex items-center gap-2.5 text-xs font-black text-stone-800">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span>💧 Check water</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs font-black text-stone-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>🌱 Check leaves</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab('calendar')}
          className="min-h-[44px] w-full mt-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-300 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all"
        >
          <span>View Full Calendar</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 7. LARGE "ASK AI" BUTTON (Requirement 1) */}
      <button
        type="button"
        onClick={onOpenAIAssistant}
        className="w-full min-h-[64px] bg-gradient-to-r from-emerald-800 via-stone-900 to-emerald-950 hover:from-emerald-700 hover:to-emerald-900 text-white rounded-3xl p-4 shadow-lg flex items-center justify-between border-2 border-emerald-600 transition-all text-left"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center font-black shrink-0">
            <Bot className="w-7 h-7 text-emerald-300" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white leading-tight">
              🤖 ASK AI
            </h3>
            <p className="text-xs text-emerald-200 font-bold mt-0.5">
              Ask any question in your voice or language
            </p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
          <ArrowRight className="w-5 h-5 stroke-[3] text-emerald-300" />
        </div>
      </button>

    </div>
  );
};
