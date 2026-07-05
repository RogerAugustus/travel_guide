// 和风天气 API 调用服务
// 免费开发版: https://dev.qweather.com/

const GEO_BASE = 'https://geoapi.qweather.com/v2';
const WEATHER_BASE = 'https://devapi.qweather.com/v7';

// 简单缓存
const cache = new Map();

function getCached(key, maxAge) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.time < maxAge) {
    return entry.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, time: Date.now() });
}

function getApiKey() {
  // 从 localStorage 读取用户设置的 API Key
  try {
    const raw = localStorage.getItem('travel-guide-settings');
    if (raw) {
      const settings = JSON.parse(raw);
      return settings.weatherApiKey || '';
    }
  } catch (e) { /* ignore */ }
  return '';
}

// 城市搜索 → 获取 locationId
export async function lookupCity(cityName) {
  const key = getApiKey();
  if (!key) {
    console.warn('未设置和风天气 API Key，使用模拟数据');
    return getMockCityId(cityName);
  }

  const cacheKey = `city-${cityName}`;
  const cached = getCached(cacheKey, 7 * 24 * 3600 * 1000); // 7天缓存
  if (cached) return cached;

  try {
    const res = await fetch(`${GEO_BASE}/city/lookup?location=${encodeURIComponent(cityName)}&key=${key}`);
    const data = await res.json();
    if (data.code === '200' && data.location?.length > 0) {
      const result = data.location[0].id;
      setCache(cacheKey, result);
      return result;
    }
  } catch (e) {
    console.error('城市查询失败:', e);
  }
  return getMockCityId(cityName);
}

// 7天天气预报
export async function getWeather7d(cityId) {
  const key = getApiKey();
  if (!key) return getMockWeather7d();

  const cacheKey = `weather-7d-${cityId}`;
  const cached = getCached(cacheKey, 3600 * 1000); // 1小时缓存
  if (cached) return cached;

  try {
    const res = await fetch(`${WEATHER_BASE}/weather/7d?location=${cityId}&key=${key}`);
    const data = await res.json();
    if (data.code === '200') {
      setCache(cacheKey, data.daily);
      return data.daily;
    }
  } catch (e) {
    console.error('天气查询失败:', e);
  }
  return getMockWeather7d();
}

// 天气预警
export async function getWeatherWarning(cityId) {
  const key = getApiKey();
  if (!key) return [];

  const cacheKey = `warning-${cityId}`;
  const cached = getCached(cacheKey, 1800 * 1000); // 30分钟缓存
  if (cached !== null) return cached;

  try {
    const res = await fetch(`${WEATHER_BASE}/warning/now?location=${cityId}&key=${key}`);
    const data = await res.json();
    if (data.code === '200' && data.warning) {
      setCache(cacheKey, data.warning);
      return data.warning;
    }
  } catch (e) {
    console.error('预警查询失败:', e);
  }
  setCache(cacheKey, []);
  return [];
}

// ===== 模拟数据（无 API Key 时使用） =====

const MOCK_CITY_IDS = {
  '广州': '101280101',
  '上海': '101020100',
  '北京': '101010100',
  '深圳': '101280601',
  '杭州': '101210101',
  '成都': '101270101',
};

function getMockCityId(cityName) {
  for (const [name, id] of Object.entries(MOCK_CITY_IDS)) {
    if (cityName.includes(name)) return id;
  }
  return '101280101'; // 默认广州
}

function getMockWeather7d() {
  const today = new Date();
  const conditions = [
    { iconDay: '100', textDay: '晴', tempMax: '33', tempMin: '26' },
    { iconDay: '101', textDay: '多云', tempMax: '32', tempMin: '25' },
    { iconDay: '305', textDay: '小雨', tempMax: '30', tempMin: '24' },
    { iconDay: '300', textDay: '阵雨', tempMax: '29', tempMin: '23' },
    { iconDay: '302', textDay: '雷阵雨', tempMax: '28', tempMin: '22' },
    { iconDay: '100', textDay: '晴', tempMax: '31', tempMin: '25' },
    { iconDay: '101', textDay: '多云', tempMax: '32', tempMin: '26' },
  ];

  return conditions.map((c, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return {
      fxDate: d.toISOString().slice(0, 10),
      ...c,
      sunrise: '05:45',
      sunset: '19:15',
      windDirDay: '东南风',
      windScaleDay: '3-4',
      humidity: '65',
      precip: c.textDay.includes('雨') ? '60' : '10',
      uvIndex: c.textDay === '晴' ? '9' : '5',
    };
  });
}

// 为任意日期范围生成模拟天气
export function getMockWeatherForRange(startDate, endDate) {
  const conditions = [
    { iconDay: '100', textDay: '晴', tempMax: '33', tempMin: '26' },
    { iconDay: '101', textDay: '多云', tempMax: '32', tempMin: '25' },
    { iconDay: '305', textDay: '小雨', tempMax: '30', tempMin: '24' },
    { iconDay: '300', textDay: '阵雨', tempMax: '29', tempMin: '23' },
    { iconDay: '302', textDay: '雷阵雨', tempMax: '28', tempMin: '22' },
    { iconDay: '100', textDay: '晴', tempMax: '31', tempMin: '25' },
    { iconDay: '101', textDay: '多云', tempMax: '32', tempMin: '26' },
  ];

  const start = new Date(startDate);
  const end = new Date(endDate);
  const result = [];
  const d = new Date(start);

  while (d <= end) {
    const i = result.length % conditions.length;
    result.push({
      fxDate: d.toISOString().slice(0, 10),
      ...conditions[i],
      sunrise: '05:45',
      sunset: '19:15',
      windDirDay: '东南风',
      windScaleDay: '3-4',
      humidity: '65',
      precip: conditions[i].textDay.includes('雨') ? '60' : '10',
      uvIndex: conditions[i].textDay === '晴' ? '9' : '5',
    });
    d.setDate(d.getDate() + 1);
  }

  return result;
}
