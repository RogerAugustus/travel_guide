import { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, X, Wind } from 'lucide-react';
import { ALERT_COLORS } from '../../constants/weatherIcons';

export default function TyphoonAlert({ alerts, hasApiKey }) {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(new Set());

  const activeAlerts = alerts.filter((a) => !dismissed.has(a.id));

  if (activeAlerts.length === 0) return null;

  const isMock = alerts.some((a) => a.source && a.source.includes('模拟'));

  const handleDismiss = (id) => {
    setDismissed((prev) => new Set([...prev, id]));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {isMock && (
        <div style={{
          fontSize: '11px', color: 'var(--color-warning)',
          background: 'var(--color-warning-light)',
          padding: '4px 10px', borderRadius: 'var(--radius-sm)',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          ⚠️ 当前为演示预警数据。配置 API Key 后可获取真实台风/暴雨预警信息。
        </div>
      )}
      {activeAlerts.slice(0, expanded ? activeAlerts.length : 1).map((alert) => {
        const colors = ALERT_COLORS[alert.level] || ALERT_COLORS.yellow;

        return (
          <div
            key={alert.id}
            style={{
              background: colors.bg,
              border: `1px solid ${colors.text}`,
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              animation: 'fadeIn 0.3s ease',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                <Wind size={18} color={colors.text} style={{ flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: colors.text,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    ⚠️ {alert.title}
                    <span
                      style={{
                        fontSize: '10px',
                        padding: '1px 6px',
                        borderRadius: '3px',
                        background: colors.text,
                        color: 'white',
                        fontWeight: 600,
                      }}
                    >
                      {colors.label}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--color-text-secondary)',
                      marginTop: '2px',
                      lineHeight: 1.4,
                    }}
                  >
                    {alert.description}
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: 'var(--color-text-muted)',
                      marginTop: '4px',
                    }}
                  >
                    影响城市: {alert.city} · 来源: {alert.source}
                    {alert.startTime && ` · ${alert.startTime}~${alert.endTime || ''}`}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDismiss(alert.id)}
                style={{
                  padding: '4px',
                  borderRadius: 'var(--radius-sm)',
                  color: colors.text,
                  flexShrink: 0,
                }}
                title="关闭"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        );
      })}

      {activeAlerts.length > 1 && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            padding: '4px',
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
          }}
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? '收起' : `查看全部 ${activeAlerts.length} 条预警`}
        </button>
      )}
    </div>
  );
}
