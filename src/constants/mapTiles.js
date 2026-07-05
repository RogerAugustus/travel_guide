// 高德地图瓦片 URL 配置
export const AMAP_TILE_URL =
  'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}';

export const AMAP_SUBDOMAINS = ['1', '2', '3', '4'];

export const AMAP_ATTRIBUTION = '&copy; 高德地图';

// 中国主要城市坐标 (GCJ-02)
export const CITY_COORDS = {
  '广州': { lat: 23.1291, lng: 113.2644 },
  '上海': { lat: 31.2304, lng: 121.4737 },
  '北京': { lat: 39.9042, lng: 116.4074 },
  '深圳': { lat: 22.5431, lng: 114.0579 },
  '杭州': { lat: 30.2741, lng: 120.1551 },
  '成都': { lat: 30.5728, lng: 104.0668 },
  '重庆': { lat: 29.4316, lng: 106.9123 },
  '西安': { lat: 34.3416, lng: 108.9398 },
  '南京': { lat: 32.0603, lng: 118.7969 },
  '武汉': { lat: 30.5928, lng: 114.3055 },
  '厦门': { lat: 24.4798, lng: 118.0894 },
  '三亚': { lat: 18.2528, lng: 109.5120 },
  '昆明': { lat: 25.0389, lng: 102.7183 },
  '长沙': { lat: 28.2282, lng: 112.9388 },
  '苏州': { lat: 31.2990, lng: 120.5853 },
};

// 根据城市名获取坐标
export function getCityCoord(cityName) {
  for (const [name, coord] of Object.entries(CITY_COORDS)) {
    if (cityName.includes(name)) return coord;
  }
  return null;
}
