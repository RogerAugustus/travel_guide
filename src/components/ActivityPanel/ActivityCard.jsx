import { useState } from 'react';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import EditableText from '../common/EditableText';

const CATEGORY_STYLES = {
  food: { bg: '#fef3c7', text: '#b45309', icon: '🍜' },
  drink: { bg: '#ede9fe', text: '#6d28d9', icon: '🍺' },
  attraction: { bg: '#dcfce7', text: '#16a34a', icon: '🏛️' },
  play: { bg: '#dbeafe', text: '#1d4ed8', icon: '🎯' },
  transport: { bg: '#fce7f3', text: '#be185d', icon: '🚌' },
};

export default function ActivityCard({
  activity,
  onUpdate,
  onDelete,
  onDragStart,
  onDragEnd,
}) {
  const [showEdit, setShowEdit] = useState(false);
  const catStyle = CATEGORY_STYLES[activity.category] || CATEGORY_STYLES.play;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{
        width: 'calc(50% - 3px)',
        minWidth: '140px',
        background: 'var(--color-bg)',
        borderRadius: 'var(--radius-sm)',
        padding: '8px',
        cursor: 'grab',
        border: '1px solid var(--color-border)',
        transition: 'all var(--transition)',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.borderColor = 'var(--color-primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'var(--color-border)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, minWidth: 0 }}>
          <GripVertical size={12} color="var(--color-text-muted)" style={{ flexShrink: 0 }} />
          <span
            style={{
              fontSize: '10px',
              padding: '1px 5px',
              borderRadius: '3px',
              fontWeight: 500,
              background: catStyle.bg,
              color: catStyle.text,
              flexShrink: 0,
            }}
          >
            {catStyle.icon}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
          <button
            onClick={() => setShowEdit(!showEdit)}
            style={{ padding: '2px', color: 'var(--color-text-muted)' }}
            title="编辑"
          >
            <Pencil size={11} />
          </button>
          <button
            onClick={() => onDelete(activity.id)}
            style={{ padding: '2px', color: 'var(--color-danger)' }}
            title="删除"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text)' }}>
        {showEdit ? (
          <EditableText
            value={activity.name}
            onChange={(val) => {
              onUpdate(activity.id, { name: val });
              setShowEdit(false);
            }}
            style={{
              width: '100%',
              padding: '2px 4px',
              border: '1px solid var(--color-border)',
              borderRadius: '3px',
              fontSize: '12px',
            }}
            placeholder="活动名称"
          />
        ) : (
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
            {activity.name}
          </span>
        )}
      </div>

      {activity.description && (
        <div
          style={{
            fontSize: '11px',
            color: 'var(--color-text-muted)',
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {showEdit ? (
            <EditableText
              value={activity.description}
              onChange={(val) => {
                onUpdate(activity.id, { description: val });
              }}
              style={{
                width: '100%',
                padding: '2px 4px',
                border: '1px solid var(--color-border)',
                borderRadius: '3px',
                fontSize: '11px',
              }}
              placeholder="描述"
              multiline
            />
          ) : (
            activity.description
          )}
        </div>
      )}

      {activity.city && (
        <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
          📍 {activity.city}
        </div>
      )}

      <div
        style={{
          fontSize: '10px',
          color: 'var(--color-primary)',
          textAlign: 'center',
          marginTop: '2px',
          fontWeight: 500,
        }}
      >
        ↕ 拖入日历
      </div>
    </div>
  );
}
