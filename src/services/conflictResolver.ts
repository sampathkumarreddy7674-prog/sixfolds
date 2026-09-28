import { ConflictResolution, Land, SoilHealthCard, WeatherInfo } from '../types';
import { resolveAllSystemRecommendations } from './recommendationResolverService';
import { calculateSmartIrrigation } from './smartIrrigationService';

export function resolveAgriculturalConflicts(
  land: Land,
  soil: SoilHealthCard,
  weather: WeatherInfo
): ConflictResolution {
  const irrigation = calculateSmartIrrigation(land, weather);
  return resolveAllSystemRecommendations(land, soil, weather, irrigation);
}
