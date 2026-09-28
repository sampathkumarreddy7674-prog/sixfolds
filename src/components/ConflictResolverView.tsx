import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Land, ConflictResolution, SystemRecommendationItem } from '../types';
import { StorageService } from '../services/storageService';
import { getConflictHistory, resolveAllSystemRecommendations } from '../services/recommendationResolverService';
import { calculateSmartIrrigation } from '../services/smartIrrigationService';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  CloudRain, 
  FlaskConical, 
  Droplets, 
  Sprout, 
  Bug, 
  Calendar, 
  TrendingUp, 
  Check, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp,
  RotateCw,
  History,
  Bot,
  HelpCircle,
  Lightbulb,
  ShieldAlert,
  BarChart3,
  Clock
} from 'lucide-react';

interface Props {
  land: Land;
}

export const ConflictResolverView: React.FC<Props> = ({ land }) => {
  const { t } = useLanguage();
  const [resolution, setResolution] = useState<ConflictResolution>(() => 
    StorageService.getConflictResolution(land)
  );
  const [history, setHistory] = useState<ConflictResolution[]>(() => 
    getConflictHistory(land.id)
  );
  const [isSimulating, setIsSimulating] = useState(false);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [showWhy, setShowWhy] = useState(true);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const weather = StorageService.getWeather(land.id);
  const soil = StorageService.getSoilHealthCard(land.id);

  // Sync resolution when land changes (strict per-land isolation)
  useEffect(() => {
    const res = StorageService.getConflictResolution(land);
    setResolution(res);
    setHistory(getConflictHistory(land.id));
    setCheckedItems({});
    setShowWhy(true);
  }, [land.id]);

  const handleRefresh = (overrideRainProb?: number, overrideRainMm?: number, overrideMoisture?: number) => {
    setIsSimulating(true);
    setTimeout(() => {
      const s = StorageService.getSoilHealthCard(land.id);
      let w = StorageService.getWeather(land.id);
      if (overrideRainProb !== undefined && overrideRainMm !== undefined) {
        w = {
          ...w,
          rainProbability: overrideRainProb,
          forecastRainMm: overrideRainMm
        };
      }
      const irrigation = calculateSmartIrrigation(land, w, overrideMoisture);
      const res = resolveAllSystemRecommendations(land, s, w, irrigation);
      setResolution(res);
      setHistory(getConflictHistory(land.id));
      setIsSimulating(false);
    }, 600);
  };

  const toggleChecklist = (idx: number) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const getSystemIcon = (systemKey: SystemRecommendationItem['systemKey']) => {
    switch (systemKey) {
      case 'soil': return FlaskConical;
      case 'weather': return CloudRain;
      case 'irrigation': return Droplets;
      case 'crop_planning': return Sprout;
      case 'crop_health': return Bug;
      case 'crop_calendar': return Calendar;
      case 'yield_prediction': return BarChart3;
      default: return Sparkles;
    }
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto pb-20">
      
      {/* 1. TOP TITLE */}
      <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            {land.name} • {land.currentCrop}
          </span>
          <h2 className="text-2xl font-black text-stone-900 leading-tight flex items-center gap-2 mt-0.5">
            <span>⚠️ DIFFERENT ADVICE</span>
          </h2>
        </div>

        <button
          type="button"
          onClick={() => handleRefresh()}
          disabled={isSimulating}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-black flex items-center gap-1.5 border border-stone-300 transition-all shrink-0"
        >
          <RotateCw className={`w-4 h-4 text-emerald-700 ${isSimulating ? 'animate-spin' : ''}`} />
          <span>Check Again</span>
        </button>
      </div>

      {/* 2. REQUIREMENT 3: CONFLICT CONTRADICTION CARDS */}
      <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-400 shadow-sm space-y-4">
        
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-full">
            Contradiction Detected
          </span>
          <p className="text-xs text-stone-600 font-bold mt-1.5">
            Different farming systems gave conflicting advice for your field:
          </p>
        </div>

        {/* Side-by-side or stacked Contradiction Examples */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Weather says */}
          <div className="p-4 rounded-2xl bg-white border-2 border-sky-300 shadow-xs">
            <div className="flex items-center gap-2 text-sky-800 font-black text-xs uppercase mb-1">
              <CloudRain className="w-4 h-4" />
              <span>Weather</span>
            </div>
            <p className="text-base font-black text-stone-900">"Rain is expected."</p>
            <p className="text-xs text-stone-600 font-semibold mt-0.5">
              {weather.rainProbability}% probability • ~{weather.forecastRainMm} mm forecast
            </p>
          </div>

          {/* Soil says */}
          <div className="p-4 rounded-2xl bg-white border-2 border-amber-300 shadow-xs">
            <div className="flex items-center gap-2 text-amber-800 font-black text-xs uppercase mb-1">
              <Droplets className="w-4 h-4" />
              <span>Soil / Irrigation</span>
            </div>
            <p className="text-base font-black text-stone-900">"Soil is dry."</p>
            <p className="text-xs text-stone-600 font-semibold mt-0.5">
              Root moisture: 26% • Requested irrigation run
            </p>
          </div>
        </div>

        {/* REQUIREMENT 3: 🤖 OUR SUGGESTION */}
        <div className="p-5 rounded-2xl bg-white border-2 border-emerald-600 shadow-md">
          <div className="flex items-center gap-2 text-emerald-800 font-black text-xs uppercase tracking-wider mb-1.5">
            <Bot className="w-5 h-5 text-emerald-600" />
            <span>🤖 OUR SUGGESTION</span>
          </div>

          <h3 className="text-xl font-black text-stone-900 leading-snug">
            "{resolution.masterAction}"
          </h3>

          {/* REQUIREMENT 3: "WHY?" */}
          <div className="mt-4 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setShowWhy(!showWhy)}
              className="min-h-[44px] flex items-center justify-between w-full text-left font-black text-xs text-stone-700 hover:text-stone-900"
            >
              <span className="flex items-center gap-1.5 text-emerald-800 font-black text-sm">
                <HelpCircle className="w-4 h-4" />
                <span>WHY?</span>
              </span>
              {showWhy ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showWhy && (
              <p className="text-xs font-bold text-stone-700 leading-relaxed mt-2 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                {resolution.explanation}
              </p>
            )}
          </div>
        </div>

        {/* REQUIREMENT 3: "MORE DETAILS" BUTTON */}
        <button
          type="button"
          onClick={() => setShowMoreDetails(!showMoreDetails)}
          className="w-full min-h-[50px] py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <span>{showMoreDetails ? 'Hide Technical Details' : 'More Details (Systems, Confidence, Checklist)'}</span>
          {showMoreDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

      </div>

      {/* 3. TECHNICAL "MORE DETAILS" SECTION */}
      {showMoreDetails && (
        <div className="space-y-4 pt-2 animate-in fade-in">
          
          {/* Confidence and Impact */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4 border-2 border-stone-200 text-center">
              <span className="text-[10px] font-bold text-stone-500 uppercase block">AI Confidence Score</span>
              <p className="text-2xl font-black text-emerald-700 mt-0.5">{resolution.confidenceScore}%</p>
              <span className="text-[10px] text-stone-400">Cross-verified</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border-2 border-stone-200 text-center">
              <span className="text-[10px] font-bold text-stone-500 uppercase block">Estimated Impact</span>
              <p className="text-xs font-black text-stone-900 mt-1">{resolution.estimatedImpact}</p>
              <span className="text-[10px] text-emerald-700 font-bold">Prevented Loss</span>
            </div>
          </div>

          {/* All 7 Systems Combined Recommendations */}
          <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-stone-900">
                All 7 Systems Recommendations:
              </h4>
              <span className="text-xs font-bold text-stone-500">
                {resolution.systems.length} Data Streams
              </span>
            </div>

            <div className="space-y-2">
              {resolution.systems.map((sys) => {
                const Icon = getSystemIcon(sys.systemKey);
                return (
                  <div
                    key={sys.id}
                    className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-xl bg-white border border-stone-300 flex items-center justify-center shrink-0 text-stone-700 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-stone-900">{sys.source}</span>
                        <span className="text-[10px] font-bold text-emerald-700">{sys.confidence}% Confidence</span>
                      </div>
                      <p className="text-xs font-bold text-stone-700 mt-0.5 leading-snug">
                        {sys.recommendation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Checklist */}
          {resolution.checklist && resolution.checklist.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm space-y-2.5">
              <h4 className="text-sm font-black text-stone-900">
                Farmer Action Checklist:
              </h4>
              <div className="space-y-2">
                {resolution.checklist.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleChecklist(idx)}
                    className="min-h-[44px] p-3 rounded-xl border border-stone-200 bg-stone-50 cursor-pointer flex items-center gap-3"
                  >
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      checkedItems[idx] ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-400 bg-white'
                    }`}>
                      {checkedItems[idx] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className={`text-xs font-bold ${checkedItems[idx] ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Check Time Notice */}
          <div className="p-4 rounded-2xl bg-stone-100 border border-stone-300 text-xs font-bold text-stone-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-stone-600" />
              <span>When to check field again:</span>
            </span>
            <span className="text-emerald-800 font-black">{resolution.whenToCheckAgain}</span>
          </div>

        </div>
      )}

    </div>
  );
};
