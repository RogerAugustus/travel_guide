import { useMemo, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DayCell from './DayCell';
import { getWeatherInfo } from '../../constants/weatherIcons';
import useMobile from '../../hooks/useMobile';

const calendarContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  background: 'var(--color-surface)',
  borderRadius: 'var(--radius-md)',
  boxShadow: 'var(--shadow-sm)',
  overflow: 'hidden',
};

const navStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 16px',
  borderBottom: '1px solid var(--color-border)',
};

const navBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--color-text-secondary)',
  transition: 'all var(--transition)',
};

const monthTitleStyle = {
  fontSize: '15px',
  fontWeight: 600,
  color: 'var(--color-text)',
};

const weekHeaderStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  padding: '6px 8px',
  borderBottom: '1px solid var(--color-border)',
  background: 'var(--color-bg)',
};

const weekDayStyle = {
  textAlign: 'center',
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--color-text-secondary)',
  padding: '4px 0',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  flex: 1,
  overflow: 'auto',
  padding: '4px',
};

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

export default function Calendar({
  trip,
  weatherData,
  selectedDate,
  onSelectDate,
  onMonthChange,
  onActivityDrop,
  dropHandlers,
}) {
  const isMobile = useMobile();
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayMonth = todayStr.slice(0, 7);

  const currentMonth = useMemo(() => {
    if (selectedDate) return selectedDate.slice(0, 7);
    // 默认显示今天所在的月份（如果在行程范围内）
    if (todayStr >= trip.startDate && todayStr <= trip.endDate) return todayMonth;
    return trip.startDate.slice(0, 7);
  }, [selectedDate, trip.startDate, todayMonth]);

  // 页面加载时自动跳到今天
  const hasAutoJumped = useRef(false);
  useEffect(() => {
    if (!hasAutoJumped.current && todayStr >= trip.startDate && todayStr <= trip.endDate) {
      hasAutoJumped.current = true;
      onSelectDate(todayStr);
    }
  }, [trip.startDate, trip.endDate]);

  // 点击「今天」按钮
  const goToToday = () => {
    onMonthChange?.(todayMonth);
    // 强制选中今天（即使已经选中也重新触发）
    onSelectDate(null);
    setTimeout(() => onSelectDate(todayStr), 0);
  };

  // 计算当月日历格子
  const calendarDays = useMemo(() => {
    const year = parseInt(currentMonth.slice(0, 4));
    const month = parseInt(currentMonth.slice(5, 7));

    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const startDayOfWeek = firstDay.getDay();

    const days = [];

    // 上月填充
    const prevLastDay = new Date(year, month - 1, 0);
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 2, prevLastDay.getDate() - i);
      days.push({ date: d.toISOString().slice(0, 10), isCurrentMonth: false });
    }

    // 当月
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month - 1, i);
      days.push({ date: d.toISOString().slice(0, 10), isCurrentMonth: true });
    }

    // 下月填充
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month, i);
      days.push({ date: d.toISOString().slice(0, 10), isCurrentMonth: false });
    }

    return days;
  }, [currentMonth]);

  const handlePrevMonth = () => {
    const d = new Date(currentMonth + '-01');
    d.setMonth(d.getMonth() - 1);
    const newMonth = d.toISOString().slice(0, 7);
    onMonthChange?.(newMonth);
  };

  const handleNextMonth = () => {
    const d = new Date(currentMonth + '-01');
    d.setMonth(d.getMonth() + 1);
    const newMonth = d.toISOString().slice(0, 7);
    onMonthChange?.(newMonth);
  };

  // 构建 dayMap
  const dayMap = useMemo(() => {
    const map = {};
    trip.days.forEach((d) => {
      map[d.date] = d;
    });
    return map;
  }, [trip.days]);

  // 判断日期是否在行程范围内
  const isInTripRange = (date) => {
    return date >= trip.startDate && date <= trip.endDate;
  };

  return (
    <div style={calendarContainerStyle}>
      <div style={navStyle}>
        <button style={navBtnStyle} onClick={handlePrevMonth}>
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={goToToday}
          style={{
            ...navBtnStyle,
            width: 'auto',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--color-primary)',
            background: 'var(--color-primary-light)',
            borderRadius: '50px',
          }}
        >
          今天
        </button>
        <span style={monthTitleStyle}>
          {currentMonth.replace('-', '年')}月
        </span>
        <button style={navBtnStyle} onClick={handleNextMonth}>
          <ChevronRight size={18} />
        </button>
      </div>

      <div style={weekHeaderStyle}>
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            style={{
              ...weekDayStyle,
              color: i === 0 || i === 6 ? 'var(--color-danger)' : undefined,
            }}
          >
            {w}
          </div>
        ))}
      </div>

      <div style={gridStyle}>
        {calendarDays.map(({ date, isCurrentMonth }) => {
          const dayData = dayMap[date];
          const weather = weatherData[date];
          const inRange = isInTripRange(date);
          const isToday = date === new Date().toISOString().slice(0, 10);
          const isSelected = date === selectedDate;

          return (
            <DayCell
              key={date}
              date={date}
              dayData={dayData}
              weather={weather}
              isCurrentMonth={isCurrentMonth}
              isInRange={inRange}
              isToday={isToday}
              isSelected={isSelected}
              isMobile={isMobile}
              onClick={() => onSelectDate(date)}
              onDragOver={dropHandlers?.handleDragOver}
              onDragLeave={dropHandlers?.handleDragLeave}
              onDrop={(e) => {
                dropHandlers?.handleDrop(e, (data) => {
                  if (onActivityDrop) onActivityDrop(date, data);
                });
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
