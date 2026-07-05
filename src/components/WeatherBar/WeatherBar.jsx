export default function WeatherBar({ weatherData, trip, hasApiKey }) {
  if (!trip.days || trip.days.length === 0) return null;

  const days = trip.days.slice(0, 7); // 最多显示7天

  return (
    <div
      style={{
        display: 'flex',
        gap: '4px',
        overflow: 'auto',
        padding: '8px 12px',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-sm)',
        boxShadow: 'var(--shadow-sm)',
        position: 'relative',
      }}
    >
      {!hasApiKey && (
        <div style={{
          position: 'absolute', top: '2px', right: '8px',
          fontSize: '10px', color: 'var(--color-warning)',
          background: 'var(--color-warning-light)', padding: '1px 6px',
          borderRadius: '3px', zIndex: 1,
        }}>
          演示数据 · 点右上角「设置」配置 API Key
        </div>
      )}
      {days.map((day) => {
        const weather = weatherData[day.date];
        const dateLabel = day.date.slice(5); // MM-DD
        const dayOfWeek = ['日', '一', '二', '三', '四', '五', '六'][new Date(day.date).getDay()];

        return (
          <div
            key={day.date}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-bg)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              minWidth: '110px',
              justifyContent: 'center',
              border: new Date(day.date).toDateString() === new Date().toDateString()
                ? '1px solid var(--color-primary)'
                : '1px solid transparent',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text)' }}>
                {dateLabel}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                周{dayOfWeek}
              </div>
            </div>
            {weather ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px' }}>{weather.icon}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', lineHeight: 1.2 }}>
                  {weather.tempMin}~{weather.tempMax}°
                </div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                  {weather.text}
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                暂无数据
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
