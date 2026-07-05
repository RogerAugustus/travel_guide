import { useState, useCallback, useEffect, useRef } from 'react';
import { loadTrip, saveTrip, generateId } from '../services/storage';
import { createDefaultActivities } from '../data/defaultActivities';

// 创建一个默认的空行程
function createEmptyTrip() {
  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + 6);

  return {
    id: generateId(),
    name: '我的旅行',
    cities: [],
    startDate: today.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10),
    days: [],
    activityPool: createDefaultActivities(),
    createdAt: new Date().toISOString(),
  };
}

// 初始化行程中的日期
function initDays(trip) {
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const days = [];

  const existingMap = {};
  if (trip.days) {
    trip.days.forEach((d) => {
      existingMap[d.date] = d;
    });
  }

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().slice(0, 10);
    if (existingMap[dateStr]) {
      days.push(existingMap[dateStr]);
    } else {
      days.push(createEmptyDay(dateStr));
    }
  }

  return days;
}

function createEmptyDay(date) {
  return {
    date,
    city: '',
    accommodation: { name: '', address: '', checkIn: '', notes: '' },
    attractions: [],
    activities: [],
    notes: '',
  };
}

export default function useTripData() {
  const [trip, setTrip] = useState(() => {
    const saved = loadTrip();
    if (saved) {
      saved.days = initDays(saved);
      if (!saved.activityPool) {
        saved.activityPool = createDefaultActivities();
      }
      return saved;
    }
    const empty = createEmptyTrip();
    empty.days = initDays(empty);
    return empty;
  });

  const saveTimeout = useRef(null);
  const isInitial = useRef(true);

  // 自动保存到 LocalStorage（防抖）
  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      saveTrip(trip);
    }, 300);
    return () => clearTimeout(saveTimeout.current);
  }, [trip]);

  const updateTrip = useCallback((updates) => {
    setTrip((prev) => ({ ...prev, ...updates }));
  }, []);

  // 更新某一天的数据
  const updateDay = useCallback((date, updates) => {
    setTrip((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.date === date ? { ...d, ...updates } : d
      ),
    }));
  }, []);

  // 更新住宿
  const updateAccommodation = useCallback((date, accData) => {
    setTrip((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.date === date
          ? { ...d, accommodation: { ...d.accommodation, ...accData } }
          : d
      ),
    }));
  }, []);

  // 延续住宿到后续 N 天
  const extendAccommodation = useCallback((fromDate, nights) => {
    if (!nights || nights < 2) return;
    setTrip((prev) => {
      const fromDay = prev.days.find((d) => d.date === fromDate);
      if (!fromDay || !fromDay.accommodation?.name) return prev;

      const startIdx = prev.days.findIndex((d) => d.date === fromDate);
      if (startIdx === -1) return prev;

      const accData = { ...fromDay.accommodation };
      const newDays = prev.days.map((d, i) => {
        if (i > startIdx && i < startIdx + nights) {
          return { ...d, accommodation: { ...accData } };
        }
        return d;
      });

      return { ...prev, days: newDays };
    });
  }, []);

  // 添加景点
  const addAttraction = useCallback((date) => {
    const attr = {
      id: generateId(),
      name: '',
      time: '',
      location: null,
      notes: '',
    };
    setTrip((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.date === date
          ? { ...d, attractions: [...d.attractions, attr] }
          : d
      ),
    }));
    return attr.id;
  }, []);

  // 更新景点
  const updateAttraction = useCallback((date, attrId, updates) => {
    setTrip((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.date === date
          ? {
              ...d,
              attractions: d.attractions.map((a) =>
                a.id === attrId ? { ...a, ...updates } : a
              ),
            }
          : d
      ),
    }));
  }, []);

  // 删除景点
  const deleteAttraction = useCallback((date, attrId) => {
    setTrip((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.date === date
          ? { ...d, attractions: d.attractions.filter((a) => a.id !== attrId) }
          : d
      ),
    }));
  }, []);

  // 添加活动（从建议面板拖入或手动添加）
  const addActivity = useCallback((date, activity) => {
    const act = activity.id ? { ...activity } : { ...activity, id: generateId() };
    setTrip((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.date === date
          ? { ...d, activities: [...d.activities, act] }
          : d
      ),
    }));
    return act.id;
  }, []);

  // 更新活动
  const updateActivity = useCallback((date, actId, updates) => {
    setTrip((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.date === date
          ? {
              ...d,
              activities: d.activities.map((a) =>
                a.id === actId ? { ...a, ...updates } : a
              ),
            }
          : d
      ),
    }));
  }, []);

  // 删除活动
  const deleteActivity = useCallback((date, actId) => {
    setTrip((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.date === date
          ? { ...d, activities: d.activities.filter((a) => a.id !== actId) }
          : d
      ),
    }));
  }, []);

  // 交通 CRUD
  const addTransport = useCallback((date) => {
    const t = { id: generateId(), type: '', name: '', departure: '', arrival: '', from: '', to: '', notes: '' };
    setTrip((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.date === date ? { ...d, transports: [...(d.transports || []), t] } : d
      ),
    }));
    return t.id;
  }, []);

  const updateTransport = useCallback((date, tId, updates) => {
    setTrip((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.date === date
          ? { ...d, transports: (d.transports || []).map((t) => (t.id === tId ? { ...t, ...updates } : t)) }
          : d
      ),
    }));
  }, []);

  const deleteTransport = useCallback((date, tId) => {
    setTrip((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.date === date
          ? { ...d, transports: (d.transports || []).filter((t) => t.id !== tId) }
          : d
      ),
    }));
  }, []);

  // 活动建议池操作
  const addSuggestion = useCallback((suggestion) => {
    const sug = { ...suggestion, id: generateId(), isUserAdded: true };
    setTrip((prev) => ({
      ...prev,
      activityPool: [...prev.activityPool, sug],
    }));
    return sug.id;
  }, []);

  const updateSuggestion = useCallback((sugId, updates) => {
    setTrip((prev) => ({
      ...prev,
      activityPool: prev.activityPool.map((s) =>
        s.id === sugId ? { ...s, ...updates } : s
      ),
    }));
  }, []);

  const deleteSuggestion = useCallback((sugId) => {
    setTrip((prev) => ({
      ...prev,
      activityPool: prev.activityPool.filter((s) => s.id !== sugId),
    }));
  }, []);

  // 日期范围变更时重新初始化 days
  const updateDateRange = useCallback((startDate, endDate) => {
    setTrip((prev) => {
      const updated = { ...prev, startDate, endDate };
      updated.days = initDays(updated);
      return updated;
    });
  }, []);

  return {
    trip,
    updateTrip,
    updateDay,
    updateAccommodation,
    extendAccommodation,
    addAttraction,
    updateAttraction,
    deleteAttraction,
    addActivity,
    updateActivity,
    deleteActivity,
    addTransport,
    updateTransport,
    deleteTransport,
    addSuggestion,
    updateSuggestion,
    deleteSuggestion,
    updateDateRange,
  };
}
