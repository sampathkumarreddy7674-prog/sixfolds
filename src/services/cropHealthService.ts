import { CropHealthAnalysis, Land } from '../types';

export function analyzeCropHealthImage(
  land: Land,
  imageDataUrl?: string,
  selectedSymptomHint?: string
): CropHealthAnalysis {
  const isWatermelon = land.currentCrop.toLowerCase().includes('watermelon');
  const isMaize = land.currentCrop.toLowerCase().includes('maize');

  if (isWatermelon) {
    if (selectedSymptomHint === 'mildew' || !selectedSymptomHint) {
      return {
        id: `health-wm-${Date.now()}`,
        timestamp: new Date().toISOString(),
        imageUrl: imageDataUrl,
        isDemoAnalysis: true,
        possibleDiseaseOrPest: 'Downy Mildew (Pseudoperonospora cubensis)',
        pathogenType: 'Fungal',
        confidencePercent: 88,
        observedSymptoms: [
          'Angular yellow-green chlorotic lesions bounded by leaf veins on upper leaf surface',
          'Purplish-gray downy fungal sporulation visible on the leaf underside in humid mornings',
          'Premature leaf defoliation exposing developing watermelon fruits to sunscald'
        ],
        generalManagementGuidance: [
          'Avoid overhead sprinkler irrigation; keep leaf canopy dry using drip lines only',
          'Foliar spray with Copper Oxychloride 50 WP (2.5 g/Litre) or Cymoxanil + Mancozeb (2 g/Litre)',
          'Prune heavily infested lower runner leaves and bury them outside field boundaries'
        ],
        preventionGuidance: [
          'Ensure wide row spacing (2m) for adequate air circulation between vine beds',
          'Apply preventative bio-fungicide Trichoderma harzianum or Bacillus subtilis every 14 days'
        ],
        expertVerificationRecommended: false
      };
    } else {
      return {
        id: `health-wm-${Date.now()}`,
        timestamp: new Date().toISOString(),
        imageUrl: imageDataUrl,
        isDemoAnalysis: true,
        possibleDiseaseOrPest: 'Blossom End Rot (Calcium Deficiency / Moisture Stress)',
        pathogenType: 'Nutrient Abiotic Stress',
        confidencePercent: 78,
        observedSymptoms: [
          'Water-soaked circular brown depression at the blossom end of young fruits',
          'Black leathery dry rot developing as the melon expands',
          'Secondary saprophytic mold colonizing damaged rind tissue'
        ],
        generalManagementGuidance: [
          'Foliar spray Chelated Calcium (EDTA-Ca) @ 1.5 g/Litre during early fruit sizing',
          'Maintain stable, steady soil moisture; avoid severe cycles of drying and flooding'
        ],
        preventionGuidance: [
          'Apply Gypsum or Agricultural Lime before sowing to maintain soil calcium availability',
          'Do not over-apply ammonium-based nitrogen which antagonizes root calcium uptake'
        ],
        expertVerificationRecommended: true
      };
    }
  }

  if (isMaize) {
    return {
      id: `health-m-${Date.now()}`,
      timestamp: new Date().toISOString(),
      imageUrl: imageDataUrl,
      isDemoAnalysis: true,
      possibleDiseaseOrPest: 'Fall Armyworm (Spodoptera frugiperda)',
      pathogenType: 'Insect / Pest',
      confidencePercent: 91,
      observedSymptoms: [
        'Pin-hole and window-pane feeding punctures on young whorl leaves',
        'Abundant sawdust-like larval fecal frass accumulating deep inside central whorls',
        'Caterpillars with distinct inverted Y-shaped suture on the head capsule'
      ],
      generalManagementGuidance: [
        'Whorl application of Neem formulation (Azadirachtin 1500 ppm @ 5 ml/Litre)',
        'Release Trichogramma egg parasitoid cards (50,000 eggs/acre) in early stages',
        'For threshold breaches (>10% whorl damage): Whorl spot treatment with Spinetoram 11.7 SC (0.5 ml/Litre)'
      ],
      preventionGuidance: [
        'Erect 4 pheromone traps per acre for early adult moth flight monitoring',
        'Intercrop maize with cowpea or desmodium to repel ovipositing female moths'
      ],
      expertVerificationRecommended: false
    };
  }

  // Default healthy or mild surveillance
  return {
    id: `health-gen-${Date.now()}`,
    timestamp: new Date().toISOString(),
    imageUrl: imageDataUrl,
    isDemoAnalysis: true,
    possibleDiseaseOrPest: 'Healthy Canopy / No Severe Pathology Detected',
    pathogenType: 'Healthy',
    confidencePercent: 94,
    observedSymptoms: [
      'Normal leaf greenness index (SPAD values within standard range)',
      'No active fungal spores, wilting streaks, or chewing insect defoliation'
    ],
    generalManagementGuidance: [
      'Continue routine weekly visual canopy scouting across plot diagonal transect',
      'Maintain standard organic preventive schedule (2% Neem oil / Panchagavya spray)'
    ],
    preventionGuidance: [
      'Inspect field border grasses for aphid or whitefly vector colonies',
      'Keep field bunds cleared of alternate weed hosts'
    ],
    expertVerificationRecommended: false
  };
}
