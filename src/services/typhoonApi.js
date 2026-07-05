// 台风预警数据获取
// 基于和风天气预警 API，筛选台风相关预警
import { getWeatherWarning, lookupCity } from './weatherApi';

// 获取行程涉及的所有城市的台风预警
export async function getTyphoonAlerts(cities) {
  const allAlerts = [];

  for (const city of cities) {
    try {
      const cityId = await lookupCity(city);
      const warnings = await getWeatherWarning(cityId);

      // 筛选台风相关预警
      const typhoonWarnings = warnings.filter((w) => {
        const type = w.type || '';
        return type.includes('台风') || type.includes('11') || type.includes('10');
      });

      for (const w of typhoonWarnings) {
        allAlerts.push({
          id: w.id || `tw-${Date.now()}-${city}`,
          date: w.pubTime ? w.pubTime.slice(0, 10) : new Date().toISOString().slice(0, 10),
          city,
          type: 'typhoon',
          level: mapSeverityLevel(w.severity || w.level),
          title: w.title || '台风预警',
          description: w.text || w.description || '',
          source: '和风天气',
          startTime: w.startTime || null,
          endTime: w.endTime || null,
        });
      }
    } catch (e) {
      console.error(`获取 ${city} 台风预警失败:`, e);
    }
  }

  return allAlerts;
}

// 根据行程日期范围生成模拟台风预警（演示用）
export function getMockTyphoonAlerts(cities, startDate, endDate) {
  // 模拟：7-8月广东/上海沿海有台风
  const month = new Date(startDate).getMonth() + 1;
  if (month < 6 || month > 10) return []; // 非台风季不模拟

  const alerts = [];

  for (const city of cities) {
    const cityName = city.includes('广州') || city.includes('广东') || city.includes('深圳')
      ? cities.find(c => c.includes('广州') || c.includes('广东') || c.includes('深圳')) || city
      : cities.find(c => c.includes('上海')) || city;

    if (cityName.includes('广州') || cityName.includes('深圳') || cityName.includes('上海')) {
      alerts.push({
        id: `mock-typhoon-${city}`,
        date: startDate,
        city,
        type: 'typhoon',
        level: 'orange',
        title: `台风"暹芭"预警 — ${city}`,
        description: `预计台风"暹芭"将于近日影响${city}地区，请密切关注天气变化，"
          + "合理安排出行计划。预计最大风力可达10-12级，伴有大到暴雨。`,
        source: '和风天气（模拟数据）',
        startTime: startDate,
        endTime: endDate,
      });
      break; // 只模拟一个台风
    }
  }

  return alerts;
}

function mapSeverityLevel(severity) {
  if (!severity) return 'yellow';
  const s = String(severity).toLowerCase();
  if (s.includes('red') || s.includes('红')) return 'red';
  if (s.includes('orange') || s.includes('橙')) return 'orange';
  if (s.includes('yellow') || s.includes('黄')) return 'yellow';
  return 'blue';
}
