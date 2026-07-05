import { Hotel, MapPin, Coffee, Bus } from 'lucide-react';

export default function DayCell({
  date,
  dayData,
  weather,
  isCurrentMonth,
  isInRange,
  isToday,
  isSelected,
  isMobile,
  onClick,
  onDragOver,
  onDragLeave,
  onDrop,
}) {
  const dayNum = parseInt(date.slice(8, 10));
  const dayOfWeek = new Date(date).getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  const hasAccommodation = dayData?.accommodation?.name;
  const attractionCount = dayData?.attractions?.length || 0;
  const transportCount = dayData?.transports?.length || 0;
  const activityCount = dayData?.activities?.length || 0;
  const hasNotes = dayData?.notes;

  return (
    <div
      onClick={onClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop && onDrop(e, date)}
      style={{
        border: isSelected
          ? '2px solid var(--color-primary)'
          : '1px solid var(--color-border)',
        borderRadius: 'var(--radius-sm)',
        padding: isMobile ? '3px 4px' : '4px 6px',
        minHeight: isMobile ? '56px' : '72px',
        cursor: 'pointer',
        background: isInRange
          ? isSelected
            ? 'var(--color-primary-light)'
            : 'var(--color-surface)'
          : '#f1f5f9',
        opacity: isCurrentMonth ? 1 : 0.4,
        transition: 'all var(--transition)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1px',
        overflow: 'hidden',
        position: 'relative',
      }}
      title={`${date} — 点击查看详情`}
    >
      {/* 日期头 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2px',
        }}
      >
        <span
          style={{
            fontSize: '13px',
            fontWeight: isToday ? 700 : isWeekend ? 500 : 400,
            color: isToday
              ? 'var(--color-primary)'
              : isWeekend
              ? 'var(--color-danger)'
              : isCurrentMonth
              ? 'var(--color-text)'
              : 'var(--color-text-muted)',
            background: isToday ? 'var(--color-primary-light)' : 'transparent',
            borderRadius: '50%',
            width: '22px',
            height: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
          }}
        >
          {dayNum}
        </span>
        {weather && (
          <span style={{ fontSize: '14px' }} title={weather.text}>
            {weather.icon}
          </span>
        )}
      </div>

      {/* 天气温度 */}
      {weather && isInRange && (
        <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', lineHeight: 1 }}>
          {weather.tempMin}~{weather.tempMax}° {weather.text}
        </div>
      )}

      {/* 住宿标记 */}
      {hasAccommodation && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            fontSize: '10px',
            color: 'var(--color-primary)',
            background: 'var(--color-primary-light)',
            borderRadius: '3px',
            padding: '1px 4px',
            lineHeight: 1.3,
          }}
        >
          <Hotel size={10} />
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {dayData.accommodation.name}
          </span>
        </div>
      )}

      {/* 景点列表 */}
      {dayData?.attractions?.slice(0, 2).map((attr) => (
        <div
          key={attr.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            fontSize: '10px',
            color: 'var(--color-success)',
            lineHeight: 1.3,
          }}
        >
          <MapPin size={10} />
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {attr.name || '未命名景点'}
            {attr.time && ` ${attr.time}`}
          </span>
        </div>
      ))}

      {/* 交通列表 */}
      {dayData?.transports?.slice(0, 1).map((t) => (
        <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '10px', color: '#ec4899', lineHeight: 1.3 }}>
          <Bus size={10} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {t.type ? t.type.replace(/[^一-龥]/g, '') : '交通'}
            {t.from && t.to ? ` ${t.from}→${t.to}` : ''}
            {t.name && ` ${t.name}`}
          </span>
        </div>
      ))}

      {/* 活动列表 */}
      {dayData?.activities?.slice(0, 2).map((act) => (
        <div
          key={act.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            fontSize: '10px',
            color:
              act.category === 'food'
                ? '#f59e0b'
                : act.category === 'drink'
                ? '#8b5cf6'
                : act.category === 'transport'
                ? '#ec4899'
                : '#3b82f6',
            lineHeight: 1.3,
          }}
        >
          <Coffee size={10} />
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {act.name}
          </span>
        </div>
      ))}

      {/* 更多提示 */}
      {attractionCount + transportCount + activityCount > 3 && (
        <div
          style={{
            fontSize: '9px',
            color: 'var(--color-text-muted)',
            textAlign: 'center',
          }}
        >
          +{attractionCount + transportCount + activityCount - 3} 更多...
        </div>
      )}

      {/* 备注标记 */}
      {hasNotes && (
        <div
          style={{
            position: 'absolute',
            top: '3px',
            right: '3px',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--color-warning)',
          }}
        />
      )}
    </div>
  );
}
