// 天气代码到图标/文字映射 (和风天气)
export const WEATHER_ICON_MAP = {
  '100': { icon: '☀️', text: '晴' },
  '101': { icon: '🌤️', text: '多云' },
  '102': { icon: '⛅', text: '少云' },
  '103': { icon: '☁️', text: '晴间多云' },
  '104': { icon: '☁️', text: '阴' },
  '150': { icon: '🌙', text: '晴(夜)' },
  '151': { icon: '🌙', text: '多云(夜)' },
  '152': { icon: '🌙', text: '少云(夜)' },
  '153': { icon: '☁️', text: '晴间多云(夜)' },
  '300': { icon: '🌦️', text: '阵雨' },
  '301': { icon: '🌧️', text: '强阵雨' },
  '302': { icon: '⛈️', text: '雷阵雨' },
  '303': { icon: '⛈️', text: '强雷阵雨' },
  '304': { icon: '🌨️', text: '雷阵雨伴冰雹' },
  '305': { icon: '🌦️', text: '小雨' },
  '306': { icon: '🌧️', text: '中雨' },
  '307': { icon: '🌧️', text: '大雨' },
  '308': { icon: '🌧️', text: '暴雨' },
  '309': { icon: '🌧️', text: '大暴雨' },
  '310': { icon: '🌧️', text: '特大暴雨' },
  '400': { icon: '🌨️', text: '小雪' },
  '401': { icon: '❄️', text: '中雪' },
  '402': { icon: '❄️', text: '大雪' },
  '403': { icon: '🌨️', text: '暴雪' },
  '404': { icon: '🌧️', text: '雨夹雪' },
  '500': { icon: '🌫️', text: '雾' },
  '501': { icon: '🌫️', text: '浓雾' },
  '502': { icon: '🌫️', text: '霾' },
  '503': { icon: '💨', text: '扬沙' },
  '504': { icon: '🌪️', text: '浮尘' },
};

// 获取天气显示信息
export function getWeatherInfo(code) {
  return WEATHER_ICON_MAP[code] || { icon: '🌈', text: '未知' };
}

// 预警级别颜色
export const ALERT_COLORS = {
  blue: { bg: '#dbeafe', text: '#1d4ed8', label: '蓝色预警' },
  yellow: { bg: '#fef3c7', text: '#b45309', label: '黄色预警' },
  orange: { bg: '#fed7aa', text: '#c2410c', label: '橙色预警' },
  red: { bg: '#fecaca', text: '#dc2626', label: '红色预警' },
};
