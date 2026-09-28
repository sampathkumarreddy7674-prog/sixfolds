import { CropPlanningOption, Land, SoilHealthCard, WeatherInfo } from '../types';

export function generateCropPlanningRecommendations(
  land: Land,
  soil: SoilHealthCard,
  weather: WeatherInfo
): CropPlanningOption[] {
  const options: CropPlanningOption[] = [];

  // Soil assessment
  const isSandyOrLoam = soil.pH >= 6.0 && soil.pH <= 7.5;
  const isGoodPotassium = soil.potassium > 150;
  const isHighNitrogen = soil.nitrogen > 280;

  // 1. Watermelon
  const watermelonScore = (isSandyOrLoam ? 40 : 20) + (isGoodPotassium ? 30 : 15) + (land.irrigationType.includes('Drip') ? 25 : 15);
  options.push({
    cropName: 'Watermelon',
    variety: 'Sugar Baby / Black Magic Hybrid',
    suitabilityScore: Math.min(watermelonScore, 96),
    durationDays: 78, // ~75-80 days as requested in prompt!
    waterRequirement: 'Medium',
    waterMm: 450,
    soilSuitability: `Ideal for sandy loam / alluvial soil with pH ${soil.pH}. Potassium level (${soil.potassium} kg/ha) supports sugar development.`,
    season: 'Zaid (Summer)',
    reason: 'Short 78-day duration crop with rapid ROI. High market demand during warm summer months. Excels under controlled drip fertigation.',
    projectedProfitPerAcre: 52000
  });

  // 2. Maize (Corn)
  const maizeScore = (soil.nitrogen > 200 ? 35 : 20) + (soil.organicCarbon > 0.4 ? 30 : 15) + 25;
  options.push({
    cropName: 'Maize',
    variety: 'Pioneer 3396 / NK6240 Hybrid',
    suitabilityScore: Math.min(maizeScore, 92),
    durationDays: 105,
    waterRequirement: 'Medium',
    waterMm: 500,
    soilSuitability: `Well-adapted to well-drained loamy to black soils. Nitrogen requirement is high (${soil.nitrogen} kg/ha available).`,
    season: 'Kharif',
    reason: 'Sturdy crop with stable MSP procurement and industrial poultry feed market demand. Resilient to brief water shortages.',
    projectedProfitPerAcre: 38000
  });

  // 3. Paddy (Rice)
  const paddyScore = (land.irrigationType.includes('Canal') || land.irrigationType.includes('Borewell') ? 35 : 10) + (soil.pH >= 6.0 && soil.pH <= 7.2 ? 30 : 20) + 20;
  options.push({
    cropName: 'Paddy (Rice)',
    variety: 'BPT 5204 (Samba Masoori)',
    suitabilityScore: Math.min(paddyScore, 89),
    durationDays: 135,
    waterRequirement: 'High',
    waterMm: 1200,
    soilSuitability: `Heavy clayey or alluvial wetland soils with water retention capacity. pH ${soil.pH} is conducive.`,
    season: 'Kharif',
    reason: 'Established staple crop with guaranteed government minimum support price (MSP). Requires assured canal or tube well irrigation.',
    projectedProfitPerAcre: 41000
  });

  // 4. Groundnut / Pulses (Nitrogen fixer)
  const pulseScore = (soil.nitrogen < 250 ? 45 : 25) + (soil.phosphorus > 15 ? 30 : 15) + 20;
  options.push({
    cropName: 'Groundnut (Peanut)',
    variety: 'Kadiri 6 (K6) Bold',
    suitabilityScore: Math.min(pulseScore, 94),
    durationDays: 110,
    waterRequirement: 'Low',
    waterMm: 350,
    soilSuitability: `Light sandy soils facilitate easy peg penetration and pod development. Biological nitrogen fixation restores low soil N (${soil.nitrogen} kg/ha).`,
    season: 'Rabi',
    reason: 'Acts as a natural restorative rotation crop. Reduces future urea expenditure by replenishing soil nitrogen organically.',
    projectedProfitPerAcre: 44000
  });

  return options.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
}
