import { CropCalendarMilestone, Land } from '../types';

export function generateCropCalendar(land: Land): CropCalendarMilestone[] {
  const baseDate = new Date(land.plantingDate || new Date().toISOString().split('T')[0]);
  const isWatermelon = land.currentCrop.toLowerCase().includes('watermelon');
  const isMaize = land.currentCrop.toLowerCase().includes('maize') || land.currentCrop.toLowerCase().includes('corn');
  
  const addDays = (days: number): string => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const todayStr = new Date().toISOString().split('T')[0];

  if (isWatermelon) {
    // Watermelon 75-80 days phenology
    const rawMilestones = [
      {
        dayOffset: 0,
        stageName: 'Planting / Sowing',
        category: 'planting' as const,
        title: 'Bed Preparation & Seed Sowing',
        description: 'Sow treated hybrid watermelon seeds on raised beds with silver-black mulch and drip line.'
      },
      {
        dayOffset: 5,
        stageName: 'Germination',
        category: 'germination' as const,
        title: 'Seedling Emergence & Stand Count',
        description: 'Check cotyledon emergence (>90% germination target). Keep soil moist but avoid water ponding.'
      },
      {
        dayOffset: 15,
        stageName: 'Early Vine Growth',
        category: 'irrigation' as const,
        title: 'First Drip Fertigation Cycle',
        description: 'Inject 19:19:19 soluble NPK (3 kg/acre) via drip injector to stimulate root proliferation.'
      },
      {
        dayOffset: 25,
        stageName: 'Pest Surveillance',
        category: 'pest' as const,
        title: 'Monitor Red Pumpkin Beetle & Thrips',
        description: 'Inspect tender terminal shoots for sucking pests and leaf curl. Install yellow sticky traps (10/acre).'
      },
      {
        dayOffset: 38,
        stageName: 'Flowering Stage',
        category: 'growth' as const,
        title: 'Male & Female Blossom Opening',
        description: 'Crucial pollination window. Avoid spraying insecticides during peak bee pollination hours (07:00 AM - 11:00 AM).'
      },
      {
        dayOffset: 52,
        stageName: 'Fruit Development',
        category: 'nutrient' as const,
        title: 'High Potassium (0:0:50) Boost',
        description: 'Apply Potassium Sulphate (SOP) via fertigation to foster fruit sizing, rind thickness, and sugar translocation.'
      },
      {
        dayOffset: 65,
        stageName: 'Fruit Maturation',
        category: 'disease' as const,
        title: 'Downy Mildew & Fruit Rot Prevention',
        description: 'Keep water off leaves. Inspect underside of fruits touching soil. Turn fruits gently for uniform color.'
      },
      {
        dayOffset: 75,
        stageName: 'Harvest Window',
        category: 'harvest' as const,
        title: 'Fruit Harvest (Tendril Browning Check)',
        description: 'Harvest fruits when the tendril nearest the fruit stem dries completely and ground spot turns pale yellow.'
      }
    ];

    return rawMilestones.map((m, idx) => {
      const targetDate = addDays(m.dayOffset);
      const isPast = targetDate < todayStr;
      const isToday = targetDate === todayStr;
      return {
        id: `cal-wm-${idx}`,
        dayOffset: m.dayOffset,
        stageName: m.stageName,
        category: m.category,
        title: m.title,
        description: m.description,
        targetDate,
        completed: isPast,
        isToday
      };
    });
  }

  // Default / Maize 105-day schedule
  const rawMaize = [
    {
      dayOffset: 0,
      stageName: 'Sowing',
      category: 'planting' as const,
      title: 'Field Ridge Sowing',
      description: 'Sow seeds at 60cm row spacing, 20cm plant distance with basal DAP + Zinc Sulphate.'
    },
    {
      dayOffset: 6,
      stageName: 'Germination',
      category: 'germination' as const,
      title: 'Coleoptile Emergence',
      description: 'Check uniform seedling emergence and gap filling if necessary.'
    },
    {
      dayOffset: 22,
      stageName: 'Knee-High Stage',
      category: 'nutrient' as const,
      title: 'First Top Dressing of Urea',
      description: 'Side-dress 35 kg Urea per acre followed by light irrigation.'
    },
    {
      dayOffset: 35,
      stageName: 'Pest Monitoring',
      category: 'pest' as const,
      title: 'Fall Armyworm (FAW) Scouting',
      description: 'Scout whorls for FAW shot-holes and sawdust-like frass. Apply biological Nomuraea rileyi if found.'
    },
    {
      dayOffset: 55,
      stageName: 'Tasseling & Silking',
      category: 'irrigation' as const,
      title: 'Critical Moisture Window',
      description: 'Moisture stress during silking drops grain yield by 40%. Ensure adequate irrigation.'
    },
    {
      dayOffset: 80,
      stageName: 'Grain Filling (Dough)',
      category: 'growth' as const,
      title: 'Cob Sizing & Kernel Filling',
      description: 'Inspect cobs for complete tip filling. Guard against stem borer entry.'
    },
    {
      dayOffset: 105,
      stageName: 'Harvesting',
      category: 'harvest' as const,
      title: 'Harvest at Black Layer Maturity',
      description: 'Cob husk turns straw yellow; black layer forms at kernel base. Harvest and sun-dry.'
    }
  ];

  return rawMaize.map((m, idx) => {
    const targetDate = addDays(m.dayOffset);
    const isPast = targetDate < todayStr;
    const isToday = targetDate === todayStr;
    return {
      id: `cal-m-${idx}`,
      dayOffset: m.dayOffset,
      stageName: m.stageName,
      category: m.category,
      title: m.title,
      description: m.description,
      targetDate,
      completed: isPast,
      isToday
    };
  });
}
