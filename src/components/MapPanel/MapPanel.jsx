import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { AMAP_TILE_URL, AMAP_SUBDOMAINS, AMAP_ATTRIBUTION, getCityCoord } from '../../constants/mapTiles';

// 修复 Leaflet 默认图标问题
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// 自定义图标
const hotelIcon = new L.DivIcon({
  className: 'custom-marker',
  html: '<div style="background:#2563eb;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 4px rgba(0,0,0,0.3);border:2px solid white;">🏨</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const attractionIcon = new L.DivIcon({
  className: 'custom-marker',
  html: '<div style="background:#16a34a;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 4px rgba(0,0,0,0.3);border:2px solid white;">📍</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const activityIcon = new L.DivIcon({
  className: 'custom-marker',
  html: '<div style="background:#f59e0b;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 4px rgba(0,0,0,0.3);border:2px solid white;">🎯</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const cityIcon = new L.DivIcon({
  className: 'custom-marker',
  html: '<div style="background:#dc2626;color:white;border-radius:8px;padding:2px 8px;font-size:12px;font-weight:600;box-shadow:0 2px 4px rgba(0,0,0,0.3);white-space:nowrap;">城市</div>',
  iconSize: [60, 24],
  iconAnchor: [30, 12],
});

// 地图视野自动调整
function MapBoundsUpdater({ markers }) {
  const map = useMap();
  useEffect(() => {
    if (markers && markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
      if (markers.length === 1) {
        map.setView([markers[0].lat, markers[0].lng], 12);
      } else {
        map.fitBounds(bounds, { padding: [30, 30] });
      }
    }
  }, [markers, map]);
  return null;
}

// 聚焦到某日地点
function FocusController({ focusCoords }) {
  const map = useMap();
  useEffect(() => {
    if (focusCoords && focusCoords.length > 0) {
      const bounds = L.latLngBounds(focusCoords.map((c) => [c.lat, c.lng]));
      if (focusCoords.length === 1) {
        map.setView([focusCoords[0].lat, focusCoords[0].lng], 14);
      } else {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
    }
  }, [focusCoords, map]);
  return null;
}

export default function MapPanel({ trip, selectedDate, typhoonAlerts }) {
  // 收集所有位置标记
  const allMarkers = useMemo(() => {
    const markers = [];

    trip.cities.forEach((city) => {
      const coord = getCityCoord(city);
      if (coord) {
        markers.push({ ...coord, type: 'city', label: city });
      }
    });

    trip.days.forEach((day) => {
      if (day.accommodation?.name && day.city) {
        const coord = getCityCoord(day.city);
        if (coord) {
          markers.push({
            ...coord,
            type: 'hotel',
            label: day.accommodation.name,
            date: day.date,
          });
        }
      }

      day.attractions.forEach((attr) => {
        if (attr.location) {
          markers.push({
            ...attr.location,
            type: 'attraction',
            label: attr.name,
            date: day.date,
          });
        } else if (attr.name && day.city) {
          const coord = getCityCoord(day.city);
          if (coord) {
            markers.push({
              lat: coord.lat + (Math.random() - 0.5) * 0.02,
              lng: coord.lng + (Math.random() - 0.5) * 0.02,
              type: 'attraction',
              label: attr.name,
              date: day.date,
            });
          }
        }
      });
    });

    return markers;
  }, [trip]);

  // 选中日期聚焦
  const focusCoords = useMemo(() => {
    if (!selectedDate) return null;
    const dayMarkers = allMarkers.filter(
      (m) => m.date === selectedDate
    );
    if (dayMarkers.length === 0) {
      // 显示城市坐标
      const day = trip.days.find((d) => d.date === selectedDate);
      if (day?.city) {
        const coord = getCityCoord(day.city);
        return coord ? [coord] : null;
      }
      return null;
    }
    return dayMarkers;
  }, [allMarkers, selectedDate, trip.days]);

  // 路线连线
  const routePoints = useMemo(() => {
    const points = [];
    trip.days
      .filter((d) => d.city)
      .forEach((day) => {
        const coord = getCityCoord(day.city);
        if (coord) points.push([coord.lat, coord.lng]);
      });
    return points;
  }, [trip.days]);

  // 默认中心
  const defaultCenter = useMemo(() => {
    if (trip.cities.length > 0) {
      const coord = getCityCoord(trip.cities[0]);
      if (coord) return [coord.lat, coord.lng];
    }
    return [31.2304, 121.4737]; // 默认上海
  }, [trip.cities]);

  return (
    <div style={{ height: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <MapContainer
        center={defaultCenter}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        {/* 高德瓦片 */}
        <TileLayer
          url={AMAP_TILE_URL}
          subdomains={AMAP_SUBDOMAINS}
          attribution={AMAP_ATTRIBUTION}
        />

        {/* 所有标记 */}
        {allMarkers.map((marker, i) => {
          const icon =
            marker.type === 'city'
              ? cityIcon
              : marker.type === 'hotel'
              ? hotelIcon
              : marker.type === 'attraction'
              ? attractionIcon
              : activityIcon;

          return (
            <Marker key={`${marker.type}-${i}`} position={[marker.lat, marker.lng]} icon={icon}>
              <Popup>
                <div style={{ fontSize: '13px' }}>
                  <strong>{marker.label}</strong>
                  {marker.date && <div style={{ color: '#666', fontSize: '11px' }}>{marker.date}</div>}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* 路线连线 */}
        {routePoints.length > 1 && (
          <Polyline
            positions={routePoints}
            color="#2563eb"
            weight={2}
            opacity={0.5}
            dashArray="8 4"
          />
        )}

        {/* 台风预警区域（模拟） */}
        {typhoonAlerts.length > 0 && typhoonAlerts.some(a => a.city) && (() => {
          const alertCity = typhoonAlerts[0].city;
          const coord = getCityCoord(alertCity);
          if (!coord) return null;
          return (
            <Marker position={[coord.lat, coord.lng]} icon={new L.DivIcon({
              className: 'custom-marker',
              html: '<div style="background:rgba(220,38,38,0.2);border:3px solid #dc2626;border-radius:50%;width:60px;height:60px;display:flex;align-items:center;justify-content:center;font-size:20px;animation:pulse 2s infinite;">🌪️</div>',
              iconSize: [60, 60],
              iconAnchor: [30, 30],
            })}>
              <Popup>
                <div style={{ color: '#dc2626', fontWeight: 600 }}>
                  ⚠️ {typhoonAlerts[0].title}
                </div>
              </Popup>
            </Marker>
          );
        })()}

        <MapBoundsUpdater markers={allMarkers} />
        <FocusController focusCoords={focusCoords} />
      </MapContainer>
    </div>
  );
}
