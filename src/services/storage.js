// LocalStorage 读写封装

const PREFIX = 'travel-guide-';

const KEYS = {
  TRIP: `${PREFIX}current-trip`,
  ACTIVITY_POOL: `${PREFIX}activity-pool`,
  SETTINGS: `${PREFIX}settings`,
};

// 生成 UUID
export function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// 行程数据
export function loadTrip() {
  try {
    const raw = localStorage.getItem(KEYS.TRIP);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load trip:', e);
  }
  return null;
}

export function saveTrip(trip) {
  try {
    localStorage.setItem(KEYS.TRIP, JSON.stringify(trip));
    return true;
  } catch (e) {
    console.error('Failed to save trip:', e);
    return false;
  }
}

// 活动建议池
export function loadActivityPool() {
  try {
    const raw = localStorage.getItem(KEYS.ACTIVITY_POOL);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load activity pool:', e);
  }
  return null;
}

export function saveActivityPool(pool) {
  try {
    localStorage.setItem(KEYS.ACTIVITY_POOL, JSON.stringify(pool));
    return true;
  } catch (e) {
    console.error('Failed to save activity pool:', e);
    return false;
  }
}

// 设置
export function loadSettings() {
  try {
    const raw = localStorage.getItem(KEYS.SETTINGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return { weatherApiKey: '' };
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (e) {
    console.error('Failed to save settings:', e);
    return false;
  }
}

// 导出全部数据
export function exportAllData() {
  const data = {};
  for (const key of Object.values(KEYS)) {
    data[key] = localStorage.getItem(key);
  }
  return JSON.stringify(data, null, 2);
}

// 导入数据
export function importAllData(json) {
  try {
    const data = JSON.parse(json);
    for (const [key, value] of Object.entries(data)) {
      if (value) localStorage.setItem(key, value);
    }
    return true;
  } catch (e) {
    console.error('Failed to import data:', e);
    return false;
  }
}
