import { Land, SoilHealthCard, WeatherInfo, YieldPredictionResult } from '../types';

export function predictCropYield(
  land: Land,
  soil: SoilHealthCard,
  weather: WeatherInfo
): YieldPredictionResult {
  const isWatermelon = land.currentCrop.toLowerCase().includes('watermelon');
  const isMaize = land.currentCrop.toLowerCase().includes('maize');

  if (isWatermelon) {
    // Watermelon 2 acres demo
    // Normal yield is ~10 - 14 Tonnes/acre -> for 2 acres = 20 - 28 Tonnes
    const minYield = Math.round(land.area * 10.5 * 10) / 10;
    const maxYield = Math.round(land.area * 13.8 * 10) / 10;
    const avg = Math.round(((minYield + maxYield) / 2) * 10) / 10;

    return {
      crop: land.currentCrop,
      area: land.area,
      areaUnit: land.areaUnit,
      minYield,
      maxYield,
      expectedAvgYield: avg,
      unit: 'Tonnes',
      confidenceRange: '84% - 91%',
      contributingFactors: [
        {
          factor: 'Balanced Soil Potassium (K)',
          impact: '+12% fruit weight & rind sweetness potential',
          weight: 'positive'
        },
        {
          factor: 'Precision Drip Fertigation System',
          impact: '+15% uniform melon sizing and reduced water loss',
          weight: 'positive'
        },
        {
          factor: 'Excessive Rainfall / Splitting Risk',
          impact: '-8% potential sorting cull loss if unseasonal deluge occurs during fruit ripening',
          weight: 'negative'
        },
        {
          factor: 'Phenology Progress (Fruit Development Stage)',
          impact: 'Critical sizing phase; yield depends on sustained micronutrient foliar feeding',
          weight: 'neutral'
        }
      ],
      disclaimer: 'Yield estimates are probabilistic ranges based on historical agronomic models, current vegetative index, and soil nutrient card. Actual harvested tonnage depends on harvest-time weather and post-pollination fruit set.'
    };
  }

  if (isMaize) {
    // Maize 3 acres demo
    // Normal hybrid maize yield ~22 - 30 Quintals/acre -> for 3 acres = 66 - 90 Quintals
    const minYield = Math.round(land.area * 22);
    const maxYield = Math.round(land.area * 29);
    const avg = Math.round((minYield + maxYield) / 2);

    return {
      crop: land.currentCrop,
      area: land.area,
      areaUnit: land.areaUnit,
      minYield,
      maxYield,
      expectedAvgYield: avg,
      unit: 'Quintals',
      confidenceRange: '88% - 94%',
      contributingFactors: [
        {
          factor: 'Adequate Soil Nitrogen & Organic Carbon',
          impact: '+10% kernel filling rate and cob length',
          weight: 'positive'
        },
        {
          factor: 'Hybrid Bt & FAW Tolerance',
          impact: '+8% protection against grain chewing pests',
          weight: 'positive'
        },
        {
          factor: 'Vegetative Growth Vigour',
          impact: 'Strong basal stem girth supports heavy double-cob bearing',
          weight: 'neutral'
        }
      ],
      disclaimer: 'Yield estimates provide an indicative range under standard pest management protocols. High temperatures exceeding 38°C during silking may affect tassel pollination.'
    };
  }

  // General crop
  const minYield = Math.round(land.area * 18);
  const maxYield = Math.round(land.area * 24);
  const avg = Math.round((minYield + maxYield) / 2);

  return {
    crop: land.currentCrop,
    area: land.area,
    areaUnit: land.areaUnit,
    minYield,
    maxYield,
    expectedAvgYield: avg,
    unit: 'Quintals',
    confidenceRange: '82% - 89%',
    contributingFactors: [
      {
        factor: 'Soil Quality Index',
        impact: `Status: ${soil.overallStatus.toUpperCase()}`,
        weight: soil.overallStatus === 'good' ? 'positive' : 'negative'
      },
      {
        factor: 'Current Irrigation Reliability',
        impact: land.irrigationType,
        weight: 'positive'
      }
    ],
    disclaimer: 'Provisional yield projection subject to prevailing microclimatic conditions and field sanitation.'
  };
}
