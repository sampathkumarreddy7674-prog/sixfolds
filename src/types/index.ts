export type LanguageCode = 'en' | 'ta' | 'te' | 'hi';

export type UserRole = 'farmer' | 'buyer';

export type SoilStatus = 'good' | 'moderate' | 'needs_attention';

export type IrrigationType = 
  | 'Drip Irrigation'
  | 'Sprinkler'
  | 'Flood / Canal'
  | 'Rainfed'
  | 'Borewell / Tube Well';

export type CropStage = 
  | 'Germination'
  | 'Vegetative'
  | 'Flowering'
  | 'Pod / Fruit Formation'
  | 'Maturity / Ripening'
  | 'Harvest Ready';

export interface SoilHealthCard {
  id: string;
  landId: string;
  testDate: string;
  laboratory: string;
  overallStatus: SoilStatus;
  pH: number; // e.g. 6.8
  nitrogen: number; // kg/ha, normal 280-560
  phosphorus: number; // kg/ha, normal 10-25
  potassium: number; // kg/ha, normal 110-280
  organicCarbon: number; // %, normal 0.5-0.75
  sulphur: number; // ppm, normal >10
  zinc: number; // ppm, normal >0.6
  iron: number; // ppm, normal >4.5
  manganese: number; // ppm, normal >2.0
  copper: number; // ppm, normal >0.2
  boron: number; // ppm, normal >0.5
  electricalConductivity: number; // dS/m, normal <1.0
  documentUrl?: string; // base64 or upload ref
  documentType?: 'manual' | 'image' | 'pdf';
  notes?: string;
}

export interface Land {
  id: string;
  userId: string;
  name: string;
  location: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  area: number;
  areaUnit: 'Acres' | 'Hectares' | 'Bigha' | 'Guntha';
  irrigationType: IrrigationType;
  currentCrop: string;
  cropVariety: string;
  plantingDate: string;
  cropStage: CropStage;
  soilStatus: SoilStatus;
  createdAt: string;
}

export interface FarmerProfile {
  id: string;
  role: 'farmer';
  name: string;
  phone: string;
  district: string;
  state: string;
  location: string;
  latitude?: number;
  longitude?: number;
  farmingExperience: string; // e.g. "8 years"
  language: LanguageCode;
  createdAt: string;
}

export interface BuyerProfile {
  id: string;
  role: 'buyer';
  name: string;
  businessName: string;
  phoneOrEmail: string;
  location: string;
  district: string;
  state: string;
  buyerType: 'Wholesaler' | 'Retailer' | 'Exporter' | 'Food Processor' | 'FPO' | 'Direct Consumer';
  cropsInterestedIn: string[];
  language: LanguageCode;
  createdAt: string;
}

export type SystemSource = 
  | 'Soil System'
  | 'Weather Radar'
  | 'Smart Irrigation'
  | 'Crop Planning'
  | 'Crop Health'
  | 'Crop Calendar'
  | 'Yield Predictor';

export interface SystemRecommendationItem {
  id: string;
  source: SystemSource;
  systemKey: 'soil' | 'weather' | 'irrigation' | 'crop_planning' | 'crop_health' | 'crop_calendar' | 'yield_prediction';
  sourceName: string;
  recommendation: string;
  confidence: number; // e.g. 92%
  timestamp: string;
  dataFreshness: string; // e.g. "Live Radar (4 min ago)"
  landId: string;
  crop: string;
  cropStage: string;
  supportingFactors: string[];
  urgency: 'high' | 'medium' | 'low';
  parameters?: Record<string, string | number>;
}

export interface ConflictResolution {
  id: string;
  landId: string;
  landName: string;
  timestamp: string;
  title: string;
  conflictDetected: boolean;
  conflictDescription: string;
  systems: SystemRecommendationItem[];
  masterAction: string;
  explanation: string;
  priorityLevel: 'immediate' | 'monitor' | 'routine';
  confidenceScore: number; // e.g. 94%
  dataConsidered: string[];
  whenToCheckAgain: string;
  insufficientEvidence?: boolean;
  estimatedImpact: string;
  warnings: string[];
  checklist: string[];
}

export interface WeatherInfo {
  temperature: number;
  condition: string;
  humidity: number;
  rainProbability: number;
  forecastRainMm: number;
  windSpeed: number;
  advisory: string;
  isLiveApi?: boolean;
  sourceLabel: string; // "LIVE WEATHER DATA (Open-Meteo)" or "DEMO WEATHER DATA"
  forecast: Array<{
    day: string;
    temp: number;
    rainProb: number;
    rainfallMm?: number;
    icon: string;
  }>;
}

export interface CropPlanningOption {
  cropName: string;
  variety: string;
  suitabilityScore: number; // 0-100
  durationDays: number;
  waterRequirement: 'Low' | 'Medium' | 'High';
  waterMm: number;
  soilSuitability: string;
  season: 'Kharif' | 'Rabi' | 'Zaid (Summer)' | 'All Season';
  reason: string;
  projectedProfitPerAcre: number;
}

export interface CropCalendarMilestone {
  id: string;
  dayOffset: number;
  stageName: string;
  category: 'planting' | 'germination' | 'growth' | 'irrigation' | 'nutrient' | 'pest' | 'disease' | 'harvest';
  title: string;
  description: string;
  targetDate: string;
  completed: boolean;
  isToday?: boolean;
}

export interface SmartIrrigationData {
  soilMoisturePercent: number; // e.g. 26% (manual or sensor)
  isManualInput: boolean;
  fieldCapacityPercent: number; // e.g. 70%
  recentRainfallMm: number;
  forecastRainfallMm: number;
  irrigationGuidance: string;
  shouldIrrigate: boolean;
  suggestedDurationMinutes: number;
  confidence: number;
  uncertaintyDisclaimer: string;
  nextCheckTime: string;
}

export interface CropHealthAnalysis {
  id: string;
  timestamp: string;
  imageUrl?: string;
  isDemoAnalysis: boolean;
  possibleDiseaseOrPest: string;
  pathogenType: 'Fungal' | 'Bacterial' | 'Viral' | 'Insect / Pest' | 'Nutrient Abiotic Stress' | 'Healthy';
  confidencePercent: number;
  observedSymptoms: string[];
  generalManagementGuidance: string[];
  preventionGuidance: string[];
  expertVerificationRecommended: boolean;
}

export interface YieldPredictionResult {
  crop: string;
  area: number;
  areaUnit: string;
  minYield: number;
  maxYield: number;
  expectedAvgYield: number;
  unit: 'Quintals' | 'Tonnes' | 'Kg';
  confidenceRange: string; // "85% - 92%"
  contributingFactors: Array<{ factor: string; impact: string; weight: 'positive' | 'negative' | 'neutral' }>;
  disclaimer: string;
}

export interface AppNotification {
  id: string;
  category: 'rain' | 'irrigation' | 'crop_calendar' | 'crop_health' | 'market' | 'buyer_enquiry' | 'gov_scheme' | 'conflict';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  actionSubTab?: string;
  priority: 'high' | 'medium' | 'normal';
}

export interface FarmTask {
  id: string;
  landId: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  category: 'fertilizer' | 'irrigation' | 'pest' | 'harvest' | 'soil';
  priority: 'high' | 'medium' | 'low';
}

export interface MarketplaceCropListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  landName: string;
  district: string;
  state: string;
  crop: string;
  variety: string;
  expectedYieldKg: number;
  pricePerKg: number;
  harvestDate: string;
  qualityGrade: 'Grade A (Export)' | 'Grade B (Standard)' | 'Organic Certified';
  imageUrl?: string;
}

export interface BuyerEnquiry {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerBusiness: string;
  buyerContact: string;
  listingId: string;
  crop: string;
  offeredPricePerKg: number;
  quantityRequestedKg: number;
  message: string;
  status: 'Pending' | 'Accepted' | 'Declined';
  date: string;
}
