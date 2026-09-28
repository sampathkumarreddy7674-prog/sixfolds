import { WeatherInfo } from '../types';

export async function fetchLiveWeather(
  latitude: number,
  longitude: number,
  fallbackDistrict: string,
  forceDemoRainProbability?: number,
  forceDemoForecastRainMm?: number
): Promise<WeatherInfo> {
  // If demo parameters are explicitly requested (e.g. for Mission-09 Demo conflict on Land 1)
  if (forceDemoRainProbability !== undefined && forceDemoForecastRainMm !== undefined) {
    return {
      temperature: 31,
      condition: 'Heavy Convective Storm Approaching',
      humidity: 88,
      rainProbability: forceDemoRainProbability,
      forecastRainMm: forceDemoForecastRainMm,
      windSpeed: 28,
      advisory: `High precipitation alert (${forceDemoForecastRainMm}mm rain, ${forceDemoRainProbability}% chance) for ${fallbackDistrict}. High risk of waterlogging.`,
      isLiveApi: false,
      sourceLabel: 'DEMO WEATHER DATA (Mission-09 Simulation)',
      forecast: [
        { day: 'Today', temp: 31, rainProb: forceDemoRainProbability, rainfallMm: forceDemoForecastRainMm, icon: 'cloud-lightning' },
        { day: 'Tomorrow', temp: 28, rainProb: 75, rainfallMm: 35, icon: 'cloud-rain' },
        { day: 'Day 3', temp: 30, rainProb: 30, rainfallMm: 5, icon: 'cloud-sun' },
        { day: 'Day 4', temp: 33, rainProb: 15, rainfallMm: 0, icon: 'sun' },
      ]
    };
  }

  // Attempt live meteorological API call
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,precipitation_sum,precipitation_probability_max&timezone=auto`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      const current = data.current || {};
      const daily = data.daily || {};
      
      const temp = Math.round(current.temperature_2m ?? 30);
      const humidity = Math.round(current.relative_humidity_2m ?? 65);
      const windSpeed = Math.round(current.wind_speed_10m ?? 12);
      const rainProbability = Math.round(daily.precipitation_probability_max?.[0] ?? 20);
      const forecastRainMm = Math.round(daily.precipitation_sum?.[0] ?? 0);

      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const forecast = (daily.time || []).slice(0, 4).map((dateStr: string, idx: number) => {
        const d = new Date(dateStr);
        const dayLabel = idx === 0 ? 'Today' : daysOfWeek[d.getDay()];
        const maxTemp = Math.round(daily.temperature_2m_max?.[idx] ?? temp);
        const rainProb = Math.round(daily.precipitation_probability_max?.[idx] ?? 10);
        const rainMm = Math.round(daily.precipitation_sum?.[idx] ?? 0);
        return {
          day: dayLabel,
          temp: maxTemp,
          rainProb,
          rainfallMm: rainMm,
          icon: rainProb > 60 ? 'cloud-rain' : rainProb > 30 ? 'cloud-sun' : 'sun'
        };
      });

      let condition = 'Clear Skies';
      if (rainProbability > 65) condition = 'Rain & Thunderstorms Expected';
      else if (rainProbability > 35) condition = 'Scattered Showers';
      else if (humidity > 75) condition = 'Humid & Overcast';
      else condition = 'Partly Sunny & Dry';

      return {
        temperature: temp,
        condition,
        humidity,
        rainProbability,
        forecastRainMm,
        windSpeed,
        advisory: rainProbability > 60 
          ? `High rain probability (${rainProbability}%). Postpone granular fertilizing and check bund drainage.`
          : `Favorable atmospheric parameters (${temp}°C, ${humidity}% humidity). Regular field schedule.`,
        isLiveApi: true,
        sourceLabel: 'LIVE WEATHER DATA (Open-Meteo Radar)',
        forecast: forecast.length > 0 ? forecast : [
          { day: 'Today', temp, rainProb: rainProbability, rainfallMm: forecastRainMm, icon: 'sun' },
          { day: 'Tomorrow', temp: temp + 1, rainProb: 15, rainfallMm: 0, icon: 'sun' },
        ]
      };
    }
  } catch {
    // Graceful fallback to localized demo data
  }

  // Fallback demo weather
  return {
    temperature: 32,
    condition: 'Partly Sunny',
    humidity: 62,
    rainProbability: 25,
    forecastRainMm: 2,
    windSpeed: 14,
    advisory: `Moderate conditions for ${fallbackDistrict}. Evapotranspiration normal.`,
    isLiveApi: false,
    sourceLabel: 'DEMO WEATHER DATA (Satellite Model Fallback)',
    forecast: [
      { day: 'Today', temp: 32, rainProb: 25, rainfallMm: 2, icon: 'cloud-sun' },
      { day: 'Tomorrow', temp: 33, rainProb: 20, rainfallMm: 0, icon: 'sun' },
      { day: 'Wed', temp: 34, rainProb: 15, rainfallMm: 0, icon: 'sun' },
      { day: 'Thu', temp: 31, rainProb: 35, rainfallMm: 6, icon: 'cloud-rain' },
    ]
  };
}
