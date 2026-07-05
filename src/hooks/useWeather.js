import { useState, useEffect, useCallback } from 'react';
import { lookupCity, getWeather7d, getMockWeatherForRange } from '../services/weatherApi';
import { getTyphoonAlerts, getMockTyphoonAlerts } from '../services/typhoonApi';
import { getWeatherInfo } from '../constants/weatherIcons';
import { loadSettings } from '../services/storage';

export default function useWeather(cities, startDate, endDate) {
  const [weatherData, setWeatherData] = useState({}); // { date: { temp, icon, text, ... } }
  const [typhoonAlerts, setTyphoonAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(null);

    const weatherMap = {};
    const allAlerts = [];

    // 没有城市时默认查广州
    const targetCities = (cities && cities.length > 0) ? cities : ['广州'];

    for (const city of targetCities) {
      try {
        const cityId = await lookupCity(city);
        const daily = await getWeather7d(cityId);

        if (daily) {
          daily.forEach((d) => {
            const info = getWeatherInfo(d.iconDay);
            weatherMap[d.fxDate] = {
              date: d.fxDate,
              tempMax: d.tempMax,
              tempMin: d.tempMin,
              icon: info.icon,
              text: d.textDay,
              windDir: d.windDirDay,
              windScale: d.windScaleDay,
              humidity: d.humidity,
              precip: d.precip,
            };
          });
        }

        if (city !== '默认') {
          const alerts = await getTyphoonAlerts([city]);
          allAlerts.push(...alerts);
        }
      } catch (e) {
        console.error(`获取 ${city} 天气失败:`, e);
      }
    }

    setWeatherData(weatherMap);

    // 仅在没有 API Key 时才使用模拟台风预警
    if (allAlerts.length === 0) {
      const settings = loadSettings();
      const hasKey = !!(settings.weatherApiKey && settings.weatherApiKey.trim());
      if (!hasKey) {
        const displayCities = (cities && cities.length > 0) ? cities : ['广州'];
        const mockAlerts = getMockTyphoonAlerts(displayCities, startDate, endDate);
        setTyphoonAlerts(mockAlerts);
      } else {
        setTyphoonAlerts([]); // 有 Key 但无预警 → 正常情况，不显示
      }
    } else {
      setTyphoonAlerts(allAlerts);
    }

    setLoading(false);
  }, [cities, startDate, endDate]);

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 3600 * 1000);
    return () => clearInterval(interval);
  }, [cities, startDate, endDate, fetchWeather]);

  return { weatherData, typhoonAlerts, loading, error, refresh: fetchWeather };
}
