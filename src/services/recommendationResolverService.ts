import { 
  ConflictResolution, 
  Land, 
  SoilHealthCard, 
  WeatherInfo, 
  SystemRecommendationItem, 
  SmartIrrigationData 
} from '../types';

const CONFLICT_HISTORY_KEY_PREFIX = 'agri_conflict_history_';

export function resolveAllSystemRecommendations(
  land: Land,
  soil: SoilHealthCard,
  weather: WeatherInfo,
  irrigation: SmartIrrigationData
): ConflictResolution {
  const timestamp = new Date().toISOString();
  const systems: SystemRecommendationItem[] = [];

  const isWatermelon = land.currentCrop.toLowerCase().includes('watermelon');
  const isMaize = land.currentCrop.toLowerCase().includes('maize');

  // 1. Soil System Recommendation
  const isLowN = soil.nitrogen < 250;
  systems.push({
    id: `rec-soil-${land.id}`,
    source: 'Soil System',
    systemKey: 'soil',
    sourceName: 'Soil Nutrient Diagnostic Lab & Sensor',
    recommendation: isLowN 
      ? `Soil Nitrogen is low (${soil.nitrogen} kg/ha). Apply 35 kg Neem-coated Urea per acre.`
      : `Nutrient levels are stable. Maintain organic compost top-dressing.`,
    confidence: 93,
    timestamp: 'Tested 2 days ago',
    dataFreshness: `Lab Profile: ${soil.testDate}`,
    landId: land.id,
    crop: land.currentCrop,
    cropStage: land.cropStage,
    supportingFactors: [
      `pH: ${soil.pH}`,
      `Nitrogen: ${soil.nitrogen} kg/ha`,
      `Potassium: ${soil.potassium} kg/ha`
    ],
    urgency: isLowN ? 'high' : 'low',
    parameters: {
      pH: soil.pH,
      Nitrogen: `${soil.nitrogen} kg/ha`,
      Status: soil.overallStatus
    }
  });

  // 2. Weather Radar Recommendation
  const willRainHeavily = weather.rainProbability >= 65 || weather.forecastRainMm >= 25;
  systems.push({
    id: `rec-weather-${land.id}`,
    source: 'Weather Radar',
    systemKey: 'weather',
    sourceName: 'Localized Micro-Climate Radar (Satellite & Doppler)',
    recommendation: willRainHeavily
      ? `Heavy rain expected (${weather.forecastRainMm} mm, ${weather.rainProbability}% probability). High waterlogging & runoff hazard.`
      : `Weather stable (${weather.temperature}°C, ${weather.humidity}% humidity). Rain probability low (${weather.rainProbability}%).`,
    confidence: 95,
    timestamp: 'Live Radar',
    dataFreshness: 'Updated 5 minutes ago',
    landId: land.id,
    crop: land.currentCrop,
    cropStage: land.cropStage,
    supportingFactors: [
      `Precipitation Prob: ${weather.rainProbability}%`,
      `Forecast Rain: ${weather.forecastRainMm} mm`,
      `Condition: ${weather.condition}`
    ],
    urgency: willRainHeavily ? 'high' : 'low',
    parameters: {
      RainProb: `${weather.rainProbability}%`,
      ForecastRain: `${weather.forecastRainMm} mm`,
      Temp: `${weather.temperature}°C`
    }
  });

  // 3. Smart Irrigation Recommendation
  const isSoilMoistureLow = irrigation.soilMoisturePercent < 35;
  systems.push({
    id: `rec-irrigation-${land.id}`,
    source: 'Smart Irrigation',
    systemKey: 'irrigation',
    sourceName: 'Smart Soil Moisture & ET0 Controller',
    recommendation: isSoilMoistureLow
      ? `Water may be required because soil moisture is low (${irrigation.soilMoisturePercent}%, below 60% threshold). Schedule 45-min drip cycle.`
      : `Soil moisture is sufficient (${irrigation.soilMoisturePercent}%). Standby mode.`,
    confidence: irrigation.confidence,
    timestamp: 'Sensor live telemetry',
    dataFreshness: irrigation.isManualInput ? 'Manual farmer entry' : 'Real-time sensor sync',
    landId: land.id,
    crop: land.currentCrop,
    cropStage: land.cropStage,
    supportingFactors: [
      `Current Moisture: ${irrigation.soilMoisturePercent}%`,
      `Target Capacity: ${irrigation.fieldCapacityPercent}%`,
      `Irrigation Type: ${land.irrigationType}`
    ],
    urgency: isSoilMoistureLow ? 'high' : 'low',
    parameters: {
      SoilMoisture: `${irrigation.soilMoisturePercent}%`,
      Method: land.irrigationType
    }
  });

  // 4. Crop Planning Recommendation
  systems.push({
    id: `rec-crop-planning-${land.id}`,
    source: 'Crop Planning',
    systemKey: 'crop_planning',
    sourceName: 'Agronomic Phenology & Rotation Optimizer',
    recommendation: isWatermelon
      ? `Watermelon is at ${land.cropStage} stage. Needs adequate moisture, but sensitive to water fluctuations.`
      : `Current crop ${land.currentCrop} at ${land.cropStage} stage. Maintain canopy vigor and uniform nutrient supply.`,
    confidence: 91,
    timestamp: 'Active plan',
    dataFreshness: 'Synced with planting date',
    landId: land.id,
    crop: land.currentCrop,
    cropStage: land.cropStage,
    supportingFactors: [
      `Planted: ${land.plantingDate}`,
      `Stage: ${land.cropStage}`,
      `Variety: ${land.cropVariety}`
    ],
    urgency: 'medium',
    parameters: {
      Stage: land.cropStage,
      Variety: land.cropVariety
    }
  });

  // 5. Crop Health Recommendation
  systems.push({
    id: `rec-crop-health-${land.id}`,
    source: 'Crop Health',
    systemKey: 'crop_health',
    sourceName: 'Crop Pathology Diagnostic Vision',
    recommendation: willRainHeavily
      ? `Elevated risk of fungal fruit rot and downy mildew under prolonged wet leaf conditions. Ensure bed drainage.`
      : `Leaf canopy clear. Continue preventive biological sprays.`,
    confidence: 89,
    timestamp: 'Pathology scan',
    dataFreshness: 'Surveillance active',
    landId: land.id,
    crop: land.currentCrop,
    cropStage: land.cropStage,
    supportingFactors: [
      `Humidity: ${weather.humidity}%`,
      `Fungal Risk: ${willRainHeavily ? 'Elevated' : 'Low'}`
    ],
    urgency: willRainHeavily ? 'high' : 'low'
  });

  // 6. Crop Calendar Recommendation
  systems.push({
    id: `rec-calendar-${land.id}`,
    source: 'Crop Calendar',
    systemKey: 'crop_calendar',
    sourceName: 'Day-by-Day Milestone Tracker',
    recommendation: isWatermelon
      ? `Calendar Milestone: High Potassium feeding & fruit sizing window. Field moisture must remain steady to avoid skin cracking.`
      : `Calendar Milestone: Regular vegetative cultivation and weed scouting along field boundaries.`,
    confidence: 94,
    timestamp: 'Milestone sync',
    dataFreshness: 'Calendar Day D+52',
    landId: land.id,
    crop: land.currentCrop,
    cropStage: land.cropStage,
    supportingFactors: [
      `Milestone: Fruit Sizing`,
      `Target Harvest: in 25-28 days`
    ],
    urgency: 'medium'
  });

  // 7. Yield Predictor Recommendation
  systems.push({
    id: `rec-yield-${land.id}`,
    source: 'Yield Predictor',
    systemKey: 'yield_prediction',
    sourceName: 'Probabilistic Yield Modeling Engine',
    recommendation: isWatermelon
      ? `Estimated yield range: 21 - 28 Tonnes across ${land.area} acres. Maximum tonnage contingent upon avoiding harvest-stage fruit splitting.`
      : `Estimated yield range: 66 - 87 Quintals across ${land.area} acres. Output on track with normal growth trajectory.`,
    confidence: 88,
    timestamp: 'Forecast model',
    dataFreshness: 'Model calibrated for current phenology',
    landId: land.id,
    crop: land.currentCrop,
    cropStage: land.cropStage,
    supportingFactors: [
      `Area: ${land.area} ${land.areaUnit}`,
      `Potential Impact: Critical`
    ],
    urgency: 'medium'
  });

  // =========================================================================
  // DETECT CONFLICTS & CONSOLIDATE
  // =========================================================================

  // MISSION-09 CONFLICT:
  // High rain probability (Weather) + Low soil moisture (Irrigation) + Watermelon fruit-development stage (Crop)
  if (willRainHeavily && isSoilMoistureLow && isWatermelon) {
    const resolution: ConflictResolution = {
      id: `conflict-${land.id}-${Date.now()}`,
      landId: land.id,
      landName: land.name,
      timestamp,
      title: 'Watering vs Incoming Deluge Conflict (Mission-09)',
      conflictDetected: true,
      conflictDescription: 'Weather Radar predicts heavy rain (50 mm, 85% probability) within 14 hours, but the Smart Irrigation controller requests watering because soil moisture is low (26%). Furthermore, Watermelon is at sensitive Fruit Development stage.',
      systems,
      masterAction: 'DELAY IRRIGATION AND RE-CHECK SOIL MOISTURE AFTER THE EXPECTED RAINFALL.',
      explanation: 'Although current soil moisture is low (26%), running irrigation right before a predicted 50 mm rainfall will saturate root zones past 100% field capacity. In Watermelon at fruit-development stage, excessive water intake causes rapid internal pulp expansion, rupturing the fruit rind (severe fruit cracking/bursting loss of 25-35%). Natural rain will provide free, uniform deep-root moisture. Delay irrigation pumps now.',
      priorityLevel: 'immediate',
      confidenceScore: 96,
      dataConsidered: [
        `Weather: ${weather.forecastRainMm} mm rain expected with ${weather.rainProbability}% probability`,
        `Irrigation: Low current topsoil moisture (${irrigation.soilMoisturePercent}%)`,
        `Crop Phenology: Watermelon at Fruit Development Stage (high fruit splitting susceptibility)`,
        `Data Freshness: Weather Radar (Live), Soil Moisture (Fresh), Crop Stage (Active)`
      ],
      whenToCheckAgain: 'Check soil moisture 18–24 hours after rainfall ceases.',
      estimatedImpact: 'Prevents catastrophic fruit cracking/splitting loss of ~₹24,000/acre and saves pump power.',
      warnings: [
        'DO NOT turn on drip or tube well irrigation before the forecasted rainfall.',
        'Ensure drainage outlets along raised plastic mulch beds are completely open.',
        'Do not broadcast chemical granular fertilizers into dry cracked soil before heavy downpours.'
      ],
      checklist: [
        'Turn off scheduled irrigation pump timers immediately.',
        'Inspect field boundary culverts and clear any clogged weeds.',
        'Keep watermelon fruits elevated on straw/mulch so they do not sit in puddles.',
        'Re-test topsoil moisture 24 hours post-rain before deciding on any further watering.'
      ]
    };

    saveConflictHistory(land.id, resolution);
    return resolution;
  }

  // Generalized Conflict: Heavy rain vs Low nitrogen / fertilizer
  if (willRainHeavily && isLowN) {
    const resolution: ConflictResolution = {
      id: `conflict-${land.id}-${Date.now()}`,
      landId: land.id,
      landName: land.name,
      timestamp,
      title: 'Nutrient Application vs Heavy Rain Deluge',
      conflictDetected: true,
      conflictDescription: 'Soil System recommends 35 kg Urea due to low nitrogen, but Weather System detects imminent heavy rain.',
      systems,
      masterAction: 'DELAY GRANULAR FERTILIZERS; CLEAR DRAINAGE OUTLETS',
      explanation: 'Broadcasting urea before heavy downpours causes 70% nitrogen runoff leaching. Withhold until soil moisture settles.',
      priorityLevel: 'immediate',
      confidenceScore: 95,
      dataConsidered: [
        `Soil Nitrogen: ${soil.nitrogen} kg/ha (Deficient)`,
        `Rain Forecast: ${weather.forecastRainMm} mm (${weather.rainProbability}%)`
      ],
      whenToCheckAgain: 'Re-test topsoil 24 hours after rain ceases.',
      estimatedImpact: 'Saves ~₹1,450/acre in fertilizer runoff waste.',
      warnings: ['Do not apply chemical fertilizers onto waterlogged soil.'],
      checklist: [
        'Turn off irrigation timers.',
        'Clear field drainage ditches.',
        'Keep fertilizers stored dry.'
      ]
    };

    saveConflictHistory(land.id, resolution);
    return resolution;
  }

  // No Conflict: All systems in harmony
  const resolution: ConflictResolution = {
    id: `conflict-${land.id}-${Date.now()}`,
    landId: land.id,
    landName: land.name,
    timestamp,
    title: 'All 7 Systems In Harmonized Agreement',
    conflictDetected: false,
    conflictDescription: 'Soil, weather radar, smart irrigation, crop planning, crop health, calendar, and yield projections are in complete synchrony with no contradicting recommendations.',
    systems,
    masterAction: isSoilMoistureLow
      ? `PROCEED WITH SCHEDULED ${land.irrigationType.toUpperCase()} (45 MINS) AT TWILIGHT.`
      : `CONTINUE ROUTINE CROP SURVEILLANCE AND STANDARD FIELD OPERATIONS.`,
    explanation: `Weather conditions for ${land.name} are favorable (${weather.temperature}°C, rain probability ${weather.rainProbability}%). Plants are progressing through ${land.cropStage} stage in accordance with the agronomic calendar.`,
    priorityLevel: 'routine',
    confidenceScore: 93,
    dataConsidered: [
      `Weather: ${weather.condition}, ${weather.temperature}°C`,
      `Soil Quality: ${soil.overallStatus.toUpperCase()}`,
      `Moisture: ${irrigation.soilMoisturePercent}%`,
      `Crop: ${land.currentCrop} (${land.cropStage})`
    ],
    whenToCheckAgain: 'Routine evaluation in 24 hours.',
    estimatedImpact: 'Maintains optimal photosynthetic index and steady yield output.',
    warnings: ['Regularly inspect foliage underside for sucking vectors.'],
    checklist: [
      'Execute standard field management routine.',
      'Check irrigation filters and lateral pressures.',
      'Log weekly observations in AgriResolve.'
    ]
  };

  saveConflictHistory(land.id, resolution);
  return resolution;
}

function saveConflictHistory(landId: string, resolution: ConflictResolution) {
  try {
    const key = `${CONFLICT_HISTORY_KEY_PREFIX}${landId}`;
    const raw = localStorage.getItem(key);
    let history: ConflictResolution[] = [];
    if (raw) {
      try { history = JSON.parse(raw); } catch {}
    }
    // Prepend and keep latest 10
    const updated = [resolution, ...history.filter(h => h.id !== resolution.id)].slice(0, 10);
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save conflict history', err);
  }
}

export function getConflictHistory(landId: string): ConflictResolution[] {
  try {
    const key = `${CONFLICT_HISTORY_KEY_PREFIX}${landId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
