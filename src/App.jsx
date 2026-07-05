import { useState, useCallback, useMemo } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { CalendarDays, Map, FileText, Soup } from 'lucide-react';
import Header from './components/Header/Header';
import Calendar from './components/Calendar/Calendar';
import DayDetail from './components/Calendar/DayDetail';
import MapPanel from './components/MapPanel/MapPanel';
import WeatherBar from './components/WeatherBar/WeatherBar';
import TyphoonAlert from './components/WeatherBar/TyphoonAlert';
import ActivityPanel from './components/ActivityPanel/ActivityPanel';
import { loadSettings } from './services/storage';
import useTripData from './hooks/useTripData';
import useWeather from './hooks/useWeather';
import useDragDrop from './hooks/useDragDrop';
import useMobile from './hooks/useMobile';
import 'leaflet/dist/leaflet.css';

// ===== 共享样式 =====
const sectionLabelStyle = {
  fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)',
  padding: '4px 10px', background: 'var(--color-surface)',
  borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
  borderBottom: '2px solid var(--color-primary)',
  display: 'inline-flex', alignItems: 'center', gap: '6px', letterSpacing: '0.5px',
};

// ===== 桌面布局样式 =====
const desktopApp = { display: 'grid', gridTemplateColumns: '1fr 460px', gridTemplateRows: 'auto 1fr auto auto', height: '100vh', overflow: 'hidden' };

// ===== 手机布局样式 =====
const mobileApp = { display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--color-bg)' };
const mobileTabBar = {
  display: 'flex', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)',
  padding: '4px 8px', paddingBottom: 'max(4px, env(safe-area-inset-bottom))',
  flexShrink: 0, zIndex: 20,
};
const mobileTab = (active) => ({
  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
  padding: '6px 0', borderRadius: 'var(--radius-sm)', fontSize: '10px', fontWeight: 500,
  color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
  background: active ? 'var(--color-primary-light)' : 'transparent',
  cursor: 'pointer', border: 'none', transition: 'all var(--transition)',
});

// ===== 共享的 DayDetail props =====
const DAY_DETAIL_PROPS = [
  'date', 'dayData', 'weather', 'onClose', 'onUpdateDay', 'onUpdateAccommodation',
  'onExtendAccommodation', 'onAddAttraction', 'onUpdateAttraction', 'onDeleteAttraction',
  'onAddTransport', 'onUpdateTransport', 'onDeleteTransport',
  'onAddActivity', 'onUpdateActivity', 'onDeleteActivity',
];

function App() {
  const isMobile = useMobile();

  const {
    trip, updateTrip, updateDay, updateAccommodation, extendAccommodation,
    addAttraction, updateAttraction, deleteAttraction,
    addActivity, updateActivity, deleteActivity,
    addTransport, updateTransport, deleteTransport,
    addSuggestion, updateSuggestion, deleteSuggestion, updateDateRange,
  } = useTripData();

  const [selectedDate, setSelectedDate] = useState(null);
  const [mobileTab, setMobileTab] = useState('calendar');

  const effectiveCities = useMemo(() => {
    if (trip.cities && trip.cities.length > 0) return trip.cities;
    const set = new Set();
    trip.days.forEach((d) => { if (d.city) set.add(d.city); });
    return [...set];
  }, [trip.cities, trip.days]);

  const { weatherData, typhoonAlerts } = useWeather(effectiveCities, trip.startDate, trip.endDate);

  const hasApiKey = useMemo(() => {
    const s = loadSettings();
    return !!(s.weatherApiKey && s.weatherApiKey.trim());
  }, []);

  const { dragHandlers, dropHandlers } = useDragDrop();

  const handleActivityDrop = useCallback((date, data) => {
    if (data?.name) {
      addActivity(date, { id: undefined, name: data.name, time: '', category: data.category || 'food', notes: data.description || '' });
      toast.success(`已添加「${data.name}」到 ${date}`);
    }
  }, [addActivity]);

  const selectedDayData = useMemo(() => {
    if (!selectedDate) return null;
    return trip.days.find((d) => d.date === selectedDate);
  }, [selectedDate, trip.days]);

  const selectedWeather = useMemo(() => {
    if (!selectedDate) return null;
    return weatherData[selectedDate];
  }, [selectedDate, weatherData]);

  const onSelectDate = (date) => {
    setSelectedDate((prev) => (prev === date && !isMobile ? null : date));
    if (isMobile && date) setMobileTab('detail');
  };

  const handleCloseDetail = () => setSelectedDate(null);

  // 日期详情组件 props
  const detailProps = {
    date: selectedDate, dayData: selectedDayData, weather: selectedWeather,
    onClose: handleCloseDetail, onUpdateDay: updateDay,
    onUpdateAccommodation: updateAccommodation, onExtendAccommodation: extendAccommodation,
    onAddAttraction: addAttraction, onUpdateAttraction: updateAttraction, onDeleteAttraction: deleteAttraction,
    onAddTransport: addTransport, onUpdateTransport: updateTransport, onDeleteTransport: deleteTransport,
    onAddActivity: addActivity, onUpdateActivity: updateActivity, onDeleteActivity: deleteActivity,
  };

  // ================ 桌面布局 ================
  if (!isMobile) {
    return (
      <div style={desktopApp}>
        <Toaster position="top-center" toastOptions={{ duration: 2000, style: { fontSize: '13px', borderRadius: '8px' } }} />

        <div style={{ gridColumn: '1 / -1', gridRow: '1' }}>
          <Header trip={trip} onUpdateTrip={updateTrip} onUpdateDateRange={updateDateRange} />
        </div>

        <div style={{ gridColumn: '1', gridRow: '2', overflow: 'hidden', padding: '8px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ ...sectionLabelStyle, borderRadius: 'var(--radius-md) var(--radius-md) 0 0' }}>📅 行程日历</div>
          <Calendar trip={trip} weatherData={weatherData} selectedDate={selectedDate}
            onSelectDate={(d) => setSelectedDate((prev) => (prev === d ? null : d))}
            onActivityDrop={handleActivityDrop} dropHandlers={dropHandlers} />
        </div>

        <div style={{ gridColumn: '2', gridRow: '2 / 4', display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px 8px 8px 0', overflow: 'hidden' }}>
          <div style={{ flex: selectedDate ? '0 0 35%' : '0 0 55%', display: 'flex', flexDirection: 'column', transition: 'flex 0.2s ease' }}>
            <div style={{ ...sectionLabelStyle, borderRadius: 'var(--radius-md) var(--radius-md) 0 0' }}>🗺️ 行程地图</div>
            <div style={{ flex: 1, borderRadius: '0 0 var(--radius-md) var(--radius-md)', overflow: 'hidden' }}>
              <MapPanel trip={trip} selectedDate={selectedDate} typhoonAlerts={typhoonAlerts} />
            </div>
          </div>
          <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ ...sectionLabelStyle, borderRadius: 'var(--radius-md) var(--radius-md) 0 0' }}>📋 日详情</div>
            <div style={{ flex: 1, overflow: 'auto' }}>
              {selectedDate && selectedDayData ? (
                <DayDetail {...detailProps} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)', fontSize: '13px', textAlign: 'center', padding: '20px', background: 'var(--color-surface)', borderRadius: '0 0 var(--radius-md) var(--radius-md)' }}>
                  <div><div style={{ fontSize: '32px', marginBottom: '8px' }}>📋</div><div>点击日历中的日期</div><div>查看和编辑当日详情</div></div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ gridColumn: '1', gridRow: '3', padding: '4px 8px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ ...sectionLabelStyle, borderRadius: 'var(--radius-md) var(--radius-md) 0 0', alignSelf: 'flex-start' }}>🌦️ 天气预报</div>
          <TyphoonAlert alerts={typhoonAlerts} hasApiKey={hasApiKey} />
          <WeatherBar weatherData={weatherData} trip={trip} hasApiKey={hasApiKey} />
        </div>

        <div style={{ gridColumn: '1 / -1', gridRow: '4', height: '200px', padding: '0 8px 8px 8px', overflow: 'hidden' }}>
          <ActivityPanel activityPool={trip.activityPool} tripCities={trip.cities}
            onAddSuggestion={addSuggestion} onUpdateSuggestion={updateSuggestion} onDeleteSuggestion={deleteSuggestion}
            onDragToDay={handleActivityDrop} dragHandlers={dragHandlers} />
        </div>
      </div>
    );
  }

  // ================ 手机布局 ================
  return (
    <div style={mobileApp}>
      <Toaster position="top-center" toastOptions={{ duration: 1500, style: { fontSize: '13px', borderRadius: '8px' } }} />

      {/* 顶部 Header（精简版） */}
      <Header trip={trip} onUpdateTrip={updateTrip} onUpdateDateRange={updateDateRange} />

      {/* 内容区 - 根据 tab 切换 */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {mobileTab === 'calendar' && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '4px' }}>
            <Calendar trip={trip} weatherData={weatherData} selectedDate={selectedDate}
              onSelectDate={onSelectDate} onActivityDrop={handleActivityDrop} dropHandlers={dropHandlers} />
            <div style={{ padding: '4px 0' }}>
              <TyphoonAlert alerts={typhoonAlerts} hasApiKey={hasApiKey} />
              <WeatherBar weatherData={weatherData} trip={trip} hasApiKey={hasApiKey} />
            </div>
          </div>
        )}

        {mobileTab === 'map' && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ ...sectionLabelStyle, alignSelf: 'flex-start', margin: '4px' }}>🗺️ 行程地图</div>
            <div style={{ flex: 1, margin: '0 4px 4px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <MapPanel trip={trip} selectedDate={selectedDate} typhoonAlerts={typhoonAlerts} />
            </div>
          </div>
        )}

        {mobileTab === 'detail' && (
          <div style={{ height: '100%', overflow: 'auto' }}>
            {selectedDate && selectedDayData ? (
              <DayDetail {...detailProps} onClose={() => { handleCloseDetail(); setMobileTab('calendar'); }} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)', fontSize: '14px', textAlign: 'center', padding: '40px 20px', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '48px' }}>📋</div>
                <div>在日历中选择一个日期</div>
                <button onClick={() => setMobileTab('calendar')} style={{ padding: '8px 20px', borderRadius: '50px', background: 'var(--color-primary)', color: 'white', fontSize: '14px', border: 'none', cursor: 'pointer' }}>去日历</button>
              </div>
            )}
          </div>
        )}

        {mobileTab === 'activities' && (
          <div style={{ height: '100%', overflow: 'hidden' }}>
            <ActivityPanel activityPool={trip.activityPool} tripCities={trip.cities}
              onAddSuggestion={addSuggestion} onUpdateSuggestion={updateSuggestion} onDeleteSuggestion={deleteSuggestion}
              onDragToDay={handleActivityDrop} dragHandlers={dragHandlers} />
          </div>
        )}
      </div>

      {/* 底部导航栏 */}
      <div style={mobileTabBar}>
        {[
          { key: 'calendar', icon: <CalendarDays size={20} />, label: '日历' },
          { key: 'map', icon: <Map size={20} />, label: '地图' },
          { key: 'detail', icon: <FileText size={20} />, label: '详情' },
          { key: 'activities', icon: <Soup size={20} />, label: '吃喝玩乐' },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setMobileTab(tab.key)} style={mobileTab(mobileTab === tab.key)}>
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
