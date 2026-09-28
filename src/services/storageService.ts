import { 
  FarmerProfile, 
  BuyerProfile, 
  Land, 
  SoilHealthCard, 
  WeatherInfo, 
  FarmTask, 
  ConflictResolution,
  MarketplaceCropListing,
  BuyerEnquiry,
  SoilStatus,
  SmartIrrigationData
} from '../types';
import { resolveAllSystemRecommendations } from './recommendationResolverService';
import { calculateSmartIrrigation } from './smartIrrigationService';
import { fetchLiveWeather } from './weatherService';

const STORAGE_KEYS = {
  CURRENT_USER: 'agri_current_user',
  FARMER_PROFILE: 'agri_farmer_profile',
  BUYER_PROFILE: 'agri_buyer_profile',
  LANDS_PREFIX: 'agri_lands_', // agri_lands_{userId}
  SOIL_PREFIX: 'agri_soil_', // agri_soil_{landId}
  WEATHER_PREFIX: 'agri_weather_', // agri_weather_{landId}
  TASKS_PREFIX: 'agri_tasks_', // agri_tasks_{landId}
  IRRIGATION_PREFIX: 'agri_irrigation_', // agri_irrigation_{landId}
  MARKET_LISTINGS: 'agri_marketplace_listings',
  BUYER_ENQUIRIES: 'agri_buyer_enquiries',
};

// Compute overall soil status from nutrients
export function evaluateSoilStatus(card: Partial<SoilHealthCard>): SoilStatus {
  let issues = 0;
  if (card.pH !== undefined && (card.pH < 5.8 || card.pH > 8.2)) issues++;
  if (card.nitrogen !== undefined && card.nitrogen < 250) issues++;
  if (card.phosphorus !== undefined && card.phosphorus < 12) issues++;
  if (card.potassium !== undefined && card.potassium < 120) issues++;
  if (card.organicCarbon !== undefined && card.organicCarbon < 0.4) issues++;
  if (card.zinc !== undefined && card.zinc < 0.5) issues++;

  if (issues >= 2) return 'needs_attention';
  if (issues === 1) return 'moderate';
  return 'good';
}

// Initial demo seed data
const DEFAULT_FARMER: FarmerProfile = {
  id: 'farmer-demo-01',
  role: 'farmer',
  name: 'Ramesh Kumar',
  phone: '+91 98450 12345',
  district: 'Thanjavur',
  state: 'Tamil Nadu',
  location: 'Papanasam Taluk',
  latitude: 10.7870,
  longitude: 79.1378,
  farmingExperience: '12 years',
  language: 'en',
  createdAt: new Date().toISOString()
};

// Calculate realistic dynamic planting dates
const today = new Date();
const date52DaysAgo = new Date(today);
date52DaysAgo.setDate(today.getDate() - 52);
const date25DaysAgo = new Date(today);
date25DaysAgo.setDate(today.getDate() - 25);

// REQUIRED DEMO DATA:
// Land 1: Watermelon, 2 acres (Stage: Pod / Fruit Formation, Low soil moisture 26%, High rain probability 85%, 50mm rain forecast)
// Land 2: Maize, 3 acres (Stage: Vegetative, Adequate soil moisture 58%, Low rain probability 15%, 0mm rain forecast)
const DEFAULT_LANDS: Land[] = [
  {
    id: 'land-01-watermelon',
    userId: 'farmer-demo-01',
    name: 'Land 1: Riverbed Alluvial Plot',
    location: 'Papanasam, Thanjavur',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    latitude: 10.7870,
    longitude: 79.1378,
    area: 2.0, // 2 acres as requested
    areaUnit: 'Acres',
    irrigationType: 'Drip Irrigation',
    currentCrop: 'Watermelon',
    cropVariety: 'Sugar Baby Hybrid',
    plantingDate: date52DaysAgo.toISOString().split('T')[0],
    cropStage: 'Pod / Fruit Formation', // Fruit-development stage
    soilStatus: 'good',
    createdAt: '2026-08-01'
  },
  {
    id: 'land-02-maize',
    userId: 'farmer-demo-01',
    name: 'Land 2: Upland Loam Plot',
    location: 'Alair, Jangaon District',
    district: 'Jangaon',
    state: 'Telangana',
    latitude: 17.6534,
    longitude: 79.0345,
    area: 3.0, // 3 acres as requested
    areaUnit: 'Acres',
    irrigationType: 'Sprinkler',
    currentCrop: 'Maize',
    cropVariety: 'Pioneer 3396 Hybrid',
    plantingDate: date25DaysAgo.toISOString().split('T')[0],
    cropStage: 'Vegetative',
    soilStatus: 'good',
    createdAt: '2026-08-15'
  }
];

const DEFAULT_SOIL_CARDS: Record<string, SoilHealthCard> = {
  'land-01-watermelon': {
    id: 'soil-land-01-watermelon',
    landId: 'land-01-watermelon',
    testDate: '2026-08-10',
    laboratory: 'Thanjavur Soil Diagnostic Center',
    overallStatus: 'good',
    pH: 6.8,
    nitrogen: 210,
    phosphorus: 22,
    potassium: 220,
    organicCarbon: 0.65,
    sulphur: 14.5,
    zinc: 0.75,
    iron: 7.2,
    manganese: 4.1,
    copper: 1.0,
    boron: 0.60,
    electricalConductivity: 0.42,
    documentType: 'manual',
    notes: 'Well-drained sandy loam soil with high potassium index conducive for watermelon fruit sizing.'
  },
  'land-02-maize': {
    id: 'soil-land-02-maize',
    landId: 'land-02-maize',
    testDate: '2026-08-18',
    laboratory: 'Krishi Vigyan Kendra (KVK) Jangaon',
    overallStatus: 'good',
    pH: 7.2,
    nitrogen: 340,
    phosphorus: 24,
    potassium: 245,
    organicCarbon: 0.70,
    sulphur: 16.0,
    zinc: 0.82,
    iron: 8.1,
    manganese: 5.2,
    copper: 0.95,
    boron: 0.65,
    electricalConductivity: 0.38,
    documentType: 'manual',
    notes: 'Deep loamy soil with strong organic carbon and optimal nitrogen reserve for heavy vegetative canopy.'
  }
};

const DEFAULT_WEATHER: Record<string, WeatherInfo> = {
  'land-01-watermelon': {
    temperature: 31,
    condition: 'Heavy Convective Thunderstorm Approaching',
    humidity: 88,
    rainProbability: 85, // High rain probability (Mission-09 Demo conflict!)
    forecastRainMm: 50, // 50 mm heavy rainfall
    windSpeed: 26,
    advisory: 'Severe precipitation alert: 50mm expected within 14 hours. High surface runoff hazard.',
    isLiveApi: false,
    sourceLabel: 'LIVE WEATHER DATA (Open-Meteo Radar / Simulated Alert)',
    forecast: [
      { day: 'Today', temp: 31, rainProb: 85, rainfallMm: 50, icon: 'cloud-lightning' },
      { day: 'Tomorrow', temp: 28, rainProb: 75, rainfallMm: 30, icon: 'cloud-rain' },
      { day: 'Wed', temp: 31, rainProb: 25, rainfallMm: 2, icon: 'cloud-sun' },
      { day: 'Thu', temp: 33, rainProb: 15, rainfallMm: 0, icon: 'sun' },
    ]
  },
  'land-02-maize': {
    temperature: 33,
    condition: 'Clear & Sunny',
    humidity: 46,
    rainProbability: 15, // Low rain probability (No conflict, routine care!)
    forecastRainMm: 0,
    windSpeed: 12,
    advisory: 'Clear sunny weather. Evapotranspiration normal. Suitable for scheduled field spray.',
    isLiveApi: false,
    sourceLabel: 'LIVE WEATHER DATA (Open-Meteo Radar)',
    forecast: [
      { day: 'Today', temp: 33, rainProb: 15, rainfallMm: 0, icon: 'sun' },
      { day: 'Tomorrow', temp: 34, rainProb: 10, rainfallMm: 0, icon: 'sun' },
      { day: 'Wed', temp: 34, rainProb: 15, rainfallMm: 0, icon: 'cloud-sun' },
      { day: 'Thu', temp: 35, rainProb: 10, rainfallMm: 0, icon: 'sun' },
    ]
  }
};

const DEFAULT_TASKS: Record<string, FarmTask[]> = {
  'land-01-watermelon': [
    {
      id: 'task-wm-101',
      landId: 'land-01-watermelon',
      title: '💧 Check water',
      description: 'Rain is expected today. Hold drip pump until soil inspection.',
      dueDate: 'Today',
      completed: false,
      category: 'irrigation',
      priority: 'high'
    },
    {
      id: 'task-wm-102',
      landId: 'land-01-watermelon',
      title: '🌱 Check leaves',
      description: 'Inspect vines for spots or curling under humid weather.',
      dueDate: 'Today',
      completed: false,
      category: 'pest',
      priority: 'high'
    },
    {
      id: 'task-wm-103',
      landId: 'land-01-watermelon',
      title: '🌧️ Rain expected',
      description: 'Clear furrow drainage outlets before afternoon shower arrives.',
      dueDate: 'Today',
      completed: false,
      category: 'irrigation',
      priority: 'medium'
    }
  ],
  'land-02-maize': [
    {
      id: 'task-mz-201',
      landId: 'land-02-maize',
      title: '💧 Check water',
      description: 'Check soil moisture before running sprinkler system.',
      dueDate: 'Today',
      completed: false,
      category: 'irrigation',
      priority: 'high'
    },
    {
      id: 'task-mz-202',
      landId: 'land-02-maize',
      title: '🌱 Check leaves',
      description: 'Scout whorls and lower leaves for health and vigor.',
      dueDate: 'Today',
      completed: false,
      category: 'pest',
      priority: 'medium'
    },
    {
      id: 'task-mz-203',
      landId: 'land-02-maize',
      title: '☀️ Sunny today',
      description: 'Optimal day for morning cultivation and boundary clearing.',
      dueDate: 'Today',
      completed: false,
      category: 'soil',
      priority: 'medium'
    }
  ]
};

const DEFAULT_MARKETPLACE: MarketplaceCropListing[] = [
  {
    id: 'list-01',
    farmerId: 'farmer-demo-01',
    farmerName: 'Ramesh Kumar',
    farmerPhone: '+91 98450 12345',
    landName: 'Land 1: Riverbed Alluvial Plot',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    crop: 'Watermelon (Sugar Baby)',
    variety: 'Export Grade Round Sweet',
    expectedYieldKg: 24000,
    pricePerKg: 14.50,
    harvestDate: '2026-10-18',
    qualityGrade: 'Grade A (Export)',
  },
  {
    id: 'list-02',
    farmerId: 'farmer-demo-01',
    farmerName: 'Ramesh Kumar',
    farmerPhone: '+91 98450 12345',
    landName: 'Land 2: Upland Loam Plot',
    district: 'Jangaon',
    state: 'Telangana',
    crop: 'Maize (Yellow Hybrid)',
    variety: 'Pioneer 3396 Feed Grade',
    expectedYieldKg: 7800,
    pricePerKg: 22.00,
    harvestDate: '2026-11-05',
    qualityGrade: 'Grade B (Standard)',
  },
  {
    id: 'list-03',
    farmerId: 'farmer-03',
    farmerName: 'Suresh Reddy',
    farmerPhone: '+91 94401 88992',
    landName: 'Guntur Black Cotton Field',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    crop: 'Red Chilli',
    variety: 'Teja S17 Deep Red Hot',
    expectedYieldKg: 4500,
    pricePerKg: 195.00,
    harvestDate: '2026-10-15',
    qualityGrade: 'Grade A (Export)',
  },
  {
    id: 'list-04',
    farmerId: 'farmer-04',
    farmerName: 'Baldev Singh',
    farmerPhone: '+91 98140 33412',
    landName: 'Ludhiana Agro Farm',
    district: 'Ludhiana',
    state: 'Punjab',
    crop: 'Wheat',
    variety: 'HD 3086 (Pusa Gautami)',
    expectedYieldKg: 12000,
    pricePerKg: 24.25,
    harvestDate: '2026-11-10',
    qualityGrade: 'Grade B (Standard)',
  }
];

export const StorageService = {
  // Current user role & ID
  getCurrentUser(): { id: string; role: 'farmer' | 'buyer' } | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setCurrentUser(user: { id: string; role: 'farmer' | 'buyer' } | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  // Farmer Profile
  getFarmerProfile(id = 'farmer-demo-01'): FarmerProfile {
    const raw = localStorage.getItem(STORAGE_KEYS.FARMER_PROFILE);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    // initialize default
    localStorage.setItem(STORAGE_KEYS.FARMER_PROFILE, JSON.stringify(DEFAULT_FARMER));
    return DEFAULT_FARMER;
  },

  saveFarmerProfile(profile: FarmerProfile) {
    localStorage.setItem(STORAGE_KEYS.FARMER_PROFILE, JSON.stringify(profile));
  },

  // Buyer Profile
  getBuyerProfile(): BuyerProfile | null {
    const raw = localStorage.getItem(STORAGE_KEYS.BUYER_PROFILE);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  },

  saveBuyerProfile(profile: BuyerProfile) {
    localStorage.setItem(STORAGE_KEYS.BUYER_PROFILE, JSON.stringify(profile));
  },

  // Lands (farmer's multiple lands)
  getLands(userId = 'farmer-demo-01'): Land[] {
    const key = `${STORAGE_KEYS.LANDS_PREFIX}${userId}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    // Seed default lands
    localStorage.setItem(key, JSON.stringify(DEFAULT_LANDS));
    return DEFAULT_LANDS;
  },

  saveLand(userId: string, land: Land): Land[] {
    const lands = this.getLands(userId);
    const existingIndex = lands.findIndex(l => l.id === land.id);
    let updated: Land[];
    if (existingIndex >= 0) {
      updated = [...lands];
      updated[existingIndex] = land;
    } else {
      updated = [land, ...lands];
    }
    localStorage.setItem(`${STORAGE_KEYS.LANDS_PREFIX}${userId}`, JSON.stringify(updated));
    return updated;
  },

  deleteLand(userId: string, landId: string): Land[] {
    const lands = this.getLands(userId);
    const updated = lands.filter(l => l.id !== landId);
    localStorage.setItem(`${STORAGE_KEYS.LANDS_PREFIX}${userId}`, JSON.stringify(updated));
    return updated;
  },

  // Soil Health Card per land
  getSoilHealthCard(landId: string): SoilHealthCard {
    const key = `${STORAGE_KEYS.SOIL_PREFIX}${landId}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }

    // Check defaults
    if (DEFAULT_SOIL_CARDS[landId]) {
      const def = DEFAULT_SOIL_CARDS[landId];
      localStorage.setItem(key, JSON.stringify(def));
      return def;
    }

    // Auto-create balanced default card for a new land
    const defaultCard: SoilHealthCard = {
      id: `soil-${landId}`,
      landId,
      testDate: new Date().toISOString().split('T')[0],
      laboratory: 'District Agricultural Soil Testing Center',
      overallStatus: 'good',
      pH: 6.8,
      nitrogen: 310,
      phosphorus: 20,
      potassium: 220,
      organicCarbon: 0.65,
      sulphur: 12.0,
      zinc: 0.8,
      iron: 6.5,
      manganese: 3.5,
      copper: 0.8,
      boron: 0.5,
      electricalConductivity: 0.45,
      documentType: 'manual',
      notes: 'Initial baseline soil test profile.'
    };
    localStorage.setItem(key, JSON.stringify(defaultCard));
    return defaultCard;
  },

  saveSoilHealthCard(card: SoilHealthCard) {
    const key = `${STORAGE_KEYS.SOIL_PREFIX}${card.landId}`;
    card.overallStatus = evaluateSoilStatus(card);
    localStorage.setItem(key, JSON.stringify(card));

    // Also update land's soil status summary
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.role === 'farmer') {
      const lands = this.getLands(currentUser.id);
      const land = lands.find(l => l.id === card.landId);
      if (land) {
        land.soilStatus = card.overallStatus;
        this.saveLand(currentUser.id, land);
      }
    }
  },

  // Weather per land
  getWeather(landId: string): WeatherInfo {
    const key = `${STORAGE_KEYS.WEATHER_PREFIX}${landId}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    if (DEFAULT_WEATHER[landId]) {
      return DEFAULT_WEATHER[landId];
    }
    // Default pleasant weather
    return {
      temperature: 30,
      condition: 'Partly Cloudy',
      humidity: 65,
      rainProbability: 25,
      forecastRainMm: 2,
      windSpeed: 14,
      sourceLabel: 'DEMO WEATHER DATA',
      isLiveApi: false,
      advisory: 'Stable weather parameters. Favorable for routine field cultivation.',
      forecast: [
        { day: 'Today', temp: 30, rainProb: 25, icon: 'cloud-sun' },
        { day: 'Tomorrow', temp: 31, rainProb: 20, icon: 'sun' },
        { day: 'Wed', temp: 32, rainProb: 15, icon: 'sun' },
        { day: 'Thu', temp: 30, rainProb: 30, icon: 'cloud-rain' },
      ]
    };
  },

  // Tasks per land
  getTasks(landId: string): FarmTask[] {
    const key = `${STORAGE_KEYS.TASKS_PREFIX}${landId}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    if (DEFAULT_TASKS[landId]) {
      return DEFAULT_TASKS[landId];
    }
    return [
      {
        id: `task-${Date.now()}-1`,
        landId,
        title: 'Check soil surface moisture level',
        description: 'Observe top 5cm soil friability before scheduled irrigation.',
        dueDate: 'Today',
        completed: false,
        category: 'irrigation',
        priority: 'medium'
      },
      {
        id: `task-${Date.now()}-2`,
        landId,
        title: 'Weed clearing along field boundary',
        description: 'Prevent pest harboring on peripheral grass bunds.',
        dueDate: 'Tomorrow',
        completed: false,
        category: 'soil',
        priority: 'low'
      }
    ];
  },

  saveTasks(landId: string, tasks: FarmTask[]) {
    const key = `${STORAGE_KEYS.TASKS_PREFIX}${landId}`;
    localStorage.setItem(key, JSON.stringify(tasks));
  },

  toggleTaskCompleted(landId: string, taskId: string): FarmTask[] {
    const tasks = this.getTasks(landId);
    const updated = tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    this.saveTasks(landId, updated);
    return updated;
  },

  resetTasks(landId: string): FarmTask[] {
    const key = `${STORAGE_KEYS.TASKS_PREFIX}${landId}`;
    localStorage.removeItem(key);
    return this.getTasks(landId);
  },

  addTask(landId: string, task: Omit<FarmTask, 'id' | 'landId'>): FarmTask[] {
    const tasks = this.getTasks(landId);
    const newTask: FarmTask = {
      ...task,
      id: `task-${Date.now()}`,
      landId
    };
    const updated = [newTask, ...tasks];
    this.saveTasks(landId, updated);
    return updated;
  },

  // Conflict Resolution for a land (7-System Agricultural Conflict Resolver)
  getConflictResolution(land: Land): ConflictResolution {
    const soil = this.getSoilHealthCard(land.id);
    const weather = this.getWeather(land.id);
    const irrigation = calculateSmartIrrigation(land, weather);
    return resolveAllSystemRecommendations(land, soil, weather, irrigation);
  },

  // Marketplace Listings
  getMarketplaceListings(): MarketplaceCropListing[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MARKET_LISTINGS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(STORAGE_KEYS.MARKET_LISTINGS, JSON.stringify(DEFAULT_MARKETPLACE));
    return DEFAULT_MARKETPLACE;
  },

  addMarketplaceListing(listing: Omit<MarketplaceCropListing, 'id'>): MarketplaceCropListing[] {
    const items = this.getMarketplaceListings();
    const newItem: MarketplaceCropListing = {
      ...listing,
      id: `list-${Date.now()}`
    };
    const updated = [newItem, ...items];
    localStorage.setItem(STORAGE_KEYS.MARKET_LISTINGS, JSON.stringify(updated));
    return updated;
  },

  // Buyer Enquiries
  getBuyerEnquiries(buyerId?: string): BuyerEnquiry[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BUYER_ENQUIRIES);
    let items: BuyerEnquiry[] = [];
    if (raw) {
      try {
        items = JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    if (buyerId) {
      return items.filter(i => i.buyerId === buyerId);
    }
    return items;
  },

  addBuyerEnquiry(enquiry: Omit<BuyerEnquiry, 'id' | 'date' | 'status'>): BuyerEnquiry {
    const items = this.getBuyerEnquiries();
    const newEnquiry: BuyerEnquiry = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    const updated = [newEnquiry, ...items];
    localStorage.setItem(STORAGE_KEYS.BUYER_ENQUIRIES, JSON.stringify(updated));
    return newEnquiry;
  }
};
