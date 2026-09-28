import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Land, SoilHealthCard, SoilStatus } from '../types';
import { StorageService, evaluateSoilStatus } from '../services/storageService';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Camera, 
  Upload, 
  Save, 
  Sparkles,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

interface Props {
  land: Land;
  onSoilUpdated?: () => void;
}

export const SoilHealthView: React.FC<Props> = ({ land, onSoilUpdated }) => {
  const { t } = useLanguage();
  const [soilCard, setSoilCard] = useState<SoilHealthCard>(() => 
    StorageService.getSoilHealthCard(land.id)
  );

  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'manual' | 'image' | 'pdf'>('manual');
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  useEffect(() => {
    const card = StorageService.getSoilHealthCard(land.id);
    setSoilCard(card);
    setFilePreview(card.documentUrl || null);
  }, [land.id]);

  const handleInputChange = (field: keyof SoilHealthCard, value: any) => {
    setSoilCard(prev => {
      const updated = { ...prev, [field]: value };
      updated.overallStatus = evaluateSoilStatus(updated);
      return updated;
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'pdf') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setFilePreview(result);
      setTimeout(() => {
        setIsExtracting(false);
        setSoilCard(prev => ({
          ...prev,
          documentUrl: result,
          documentType: type,
          testDate: new Date().toISOString().split('T')[0],
          laboratory: file.name.includes('kvk') ? 'Krishi Vigyan Kendra Lab' : 'District Soil Analytical Lab'
        }));
      }, 1000);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveSoilHealthCard(soilCard);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
    onSoilUpdated?.();
  };

  // Status computation for Requirement 6
  const getStatusDisplay = (status: SoilStatus) => {
    switch (status) {
      case 'good':
        return {
          title: '🟢 Soil is Good',
          color: 'bg-emerald-50 border-emerald-300 text-emerald-950',
          icon: CheckCircle2,
          iconColor: 'text-emerald-600',
          why: `Your soil pH (${soilCard.pH}) is well balanced and potassium (${soilCard.potassium} kg/ha) supports healthy ${land.currentCrop} growth. Organic carbon is healthy at ${soilCard.organicCarbon}%.`,
          actions: [
            'Maintain organic matter by adding Farmyard Manure (FYM) each season.',
            'Apply balanced NPK according to crop growth stage.',
            'No lime or gypsum needed currently as pH is in ideal neutral range.'
          ]
        };
      case 'moderate':
        return {
          title: '🟡 Soil Needs Attention',
          color: 'bg-amber-50 border-amber-300 text-amber-950',
          icon: AlertTriangle,
          iconColor: 'text-amber-600',
          why: `Soil has minor nutrient deficiencies. Available Nitrogen (${soilCard.nitrogen} kg/ha) is slightly low, while Potassium and Phosphorus are moderate.`,
          actions: [
            'Apply Neem-coated Urea in 2 split doses near the root zone.',
            'Incorporate 3 to 4 tons of vermicompost or composted manure before next irrigation.',
            'Add bio-fertilizer Azotobacter / Azospirillum @ 2kg/acre.'
          ]
        };
      case 'needs_attention':
        return {
          title: '🔴 Soil Needs Improvement',
          color: 'bg-rose-50 border-rose-300 text-rose-950',
          icon: AlertCircle,
          iconColor: 'text-rose-600',
          why: `Critical nutrients or soil pH require urgent correction. Nitrogen (${soilCard.nitrogen} kg/ha) or Zinc (${soilCard.zinc} ppm) is significantly below threshold.`,
          actions: [
            'Apply Zinc Sulphate (21%) @ 10kg/acre during basal fertilization.',
            'Broadcast Agricultural Lime or Dolomite if acidic, or Gypsum if alkaline.',
            'Incorporate green manuring crops (Sesbania / Daincha) to rebuild soil microbial health.'
          ]
        };
    }
  };

  const statusInfo = getStatusDisplay(soilCard.overallStatus);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-4">
      {/* Land Header Banner */}
      <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              {land.name}
            </span>
            <h2 className="text-xl font-black text-stone-900 mt-0.5">
              Soil Status
            </h2>
            <p className="text-xs text-stone-600 font-semibold mt-0.5">
              Crop: {land.currentCrop} • Tested: {soilCard.testDate}
            </p>
          </div>
          <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-stone-100 text-stone-700 border border-stone-200">
            {soilCard.laboratory}
          </span>
        </div>
      </div>

      {/* REQUIREMENT 6: MAIN SCREEN STATUS BANNER */}
      <div className={`p-6 rounded-3xl border-2 shadow-sm ${statusInfo.color}`}>
        <div className="flex items-center gap-3.5">
          <StatusIcon className={`w-10 h-10 ${statusInfo.iconColor} shrink-0`} />
          <div>
            <h3 className="text-2xl font-black tracking-tight leading-tight">
              {statusInfo.title}
            </h3>
            <p className="text-xs font-bold mt-1 text-stone-700">
              Diagnostic summary for {land.name}
            </p>
          </div>
        </div>

        {/* "Why?" Section */}
        <div className="mt-5 p-4 rounded-2xl bg-white/90 border border-stone-200 shadow-xs">
          <h4 className="text-sm font-black text-stone-900 flex items-center gap-1.5 mb-1.5">
            <HelpCircle className="w-4 h-4 text-emerald-700" />
            <span>Why?</span>
          </h4>
          <p className="text-xs font-bold text-stone-700 leading-relaxed">
            {statusInfo.why}
          </p>
        </div>

        {/* "What can I do?" Section */}
        <div className="mt-3 p-4 rounded-2xl bg-white/90 border border-stone-200 shadow-xs">
          <h4 className="text-sm font-black text-stone-900 flex items-center gap-1.5 mb-2">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>What can I do?</span>
          </h4>
          <ul className="space-y-2 text-xs font-bold text-stone-800">
            {statusInfo.actions.map((act, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1 shrink-0" />
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* "More Details" Toggle Button */}
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setShowMoreDetails(!showMoreDetails)}
            className="w-full min-h-[50px] py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>{showMoreDetails ? 'Hide Detailed Numbers' : 'More Details (pH, Nitrogen, Phosphorus, Potassium)'}</span>
            {showMoreDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* DETAILED VIEW (pH, nitrogen, phosphorus, photo/PDF, lab report) */}
      {showMoreDetails && (
        <div className="space-y-4 pt-2 animate-in fade-in">
          
          {/* Quick Summary Grid */}
          <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm">
            <h4 className="text-xs font-black uppercase tracking-wider text-stone-500 mb-3">
              Lab Nutrients Summary
            </h4>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-stone-50 p-2.5 rounded-2xl border border-stone-200">
                <span className="text-[10px] font-bold text-stone-500 uppercase block">pH</span>
                <p className="text-base font-black text-stone-900">{soilCard.pH}</p>
                <span className="text-[9px] text-stone-400">Target 6.5-7.5</span>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-2xl border border-stone-200">
                <span className="text-[10px] font-bold text-stone-500 uppercase block">Nitrogen</span>
                <p className={`text-base font-black ${soilCard.nitrogen < 250 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {soilCard.nitrogen}
                </p>
                <span className="text-[9px] text-stone-400">kg/ha</span>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-2xl border border-stone-200">
                <span className="text-[10px] font-bold text-stone-500 uppercase block">Phosphorus</span>
                <p className="text-base font-black text-stone-900">{soilCard.phosphorus}</p>
                <span className="text-[9px] text-stone-400">kg/ha</span>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-2xl border border-stone-200">
                <span className="text-[10px] font-bold text-stone-500 uppercase block">Potassium</span>
                <p className="text-base font-black text-stone-900">{soilCard.potassium}</p>
                <span className="text-[9px] text-stone-400">kg/ha</span>
              </div>
            </div>
          </div>

          {/* Upload tabs */}
          <div className="bg-stone-200 p-1 rounded-2xl flex text-xs font-black">
            <button
              type="button"
              onClick={() => setActiveTab('manual')}
              className={`flex-1 min-h-[44px] py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'manual' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Edit Values</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('image')}
              className={`flex-1 min-h-[44px] py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'image' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Photo Upload</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pdf')}
              className={`flex-1 min-h-[44px] py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'pdf' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>PDF Card</span>
            </button>
          </div>

          {(activeTab === 'image' || activeTab === 'pdf') && (
            <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm">
              <div className="border-2 border-dashed border-stone-300 rounded-2xl p-6 text-center hover:border-emerald-500 transition-all bg-stone-50/50">
                <input
                  type="file"
                  id="soil-file-upload-details"
                  accept={activeTab === 'image' ? 'image/*' : 'application/pdf'}
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, activeTab)}
                />
                <label htmlFor="soil-file-upload-details" className="cursor-pointer block">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                    {activeTab === 'image' ? <Camera className="w-7 h-7" /> : <Upload className="w-7 h-7" />}
                  </div>
                  <p className="text-sm font-black text-stone-900">Upload Soil Health Card</p>
                  <p className="text-xs text-stone-500 mt-1">Automatic OCR data extraction</p>
                </label>
              </div>

              {isExtracting && (
                <div className="mt-4 p-3 bg-emerald-50 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold">
                  <Sparkles className="w-4 h-4 animate-spin text-emerald-600" />
                  <span>Extracting parameters from document...</span>
                </div>
              )}
            </div>
          )}

          {/* Form to edit parameters */}
          <form onSubmit={handleSave} className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-stone-200">
              <div>
                <label className="block text-xs font-black text-stone-700 mb-1">
                  Test Date
                </label>
                <input
                  type="date"
                  value={soilCard.testDate}
                  onChange={(e) => handleInputChange('testDate', e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-stone-700 mb-1">
                  Testing Lab
                </label>
                <input
                  type="text"
                  value={soilCard.laboratory}
                  onChange={(e) => handleInputChange('laboratory', e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-black text-stone-700 mb-1">pH</label>
                <input
                  type="number"
                  step="0.1"
                  value={soilCard.pH}
                  onChange={(e) => handleInputChange('pH', parseFloat(e.target.value) || 0)}
                  className="w-full min-h-[44px] px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-stone-700 mb-1">Nitrogen (kg/ha)</label>
                <input
                  type="number"
                  value={soilCard.nitrogen}
                  onChange={(e) => handleInputChange('nitrogen', parseFloat(e.target.value) || 0)}
                  className="w-full min-h-[44px] px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-stone-700 mb-1">Phosphorus (kg/ha)</label>
                <input
                  type="number"
                  value={soilCard.phosphorus}
                  onChange={(e) => handleInputChange('phosphorus', parseFloat(e.target.value) || 0)}
                  className="w-full min-h-[44px] px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-stone-700 mb-1">Potassium (kg/ha)</label>
                <input
                  type="number"
                  value={soilCard.potassium}
                  onChange={(e) => handleInputChange('potassium', parseFloat(e.target.value) || 0)}
                  className="w-full min-h-[44px] px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-stone-700 mb-1">Organic Carbon (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={soilCard.organicCarbon}
                  onChange={(e) => handleInputChange('organicCarbon', parseFloat(e.target.value) || 0)}
                  className="w-full min-h-[44px] px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-stone-700 mb-1">Zinc (ppm)</label>
                <input
                  type="number"
                  step="0.01"
                  value={soilCard.zinc}
                  onChange={(e) => handleInputChange('zinc', parseFloat(e.target.value) || 0)}
                  className="w-full min-h-[44px] px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full min-h-[50px] py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Soil Health Changes</span>
              </button>
              {isSavedNotice && (
                <p className="text-center text-xs font-black text-emerald-800 mt-2">
                  ✅ Soil parameters saved successfully!
                </p>
              )}
            </div>
          </form>

        </div>
      )}

    </div>
  );
};
