import { useState, useMemo } from 'react';
import { Plus, UtensilsCrossed, GlassWater, Gamepad2, Landmark, Bus, Search, ChevronUp, ChevronDown } from 'lucide-react';
import ActivityCard from './ActivityCard';
import Modal from '../common/Modal';

const CATEGORIES = [
  { key: 'all', label: '全部', icon: null },
  { key: 'food', label: '美食', icon: <UtensilsCrossed size={14} /> },
  { key: 'drink', label: '饮品', icon: <GlassWater size={14} /> },
  { key: 'attraction', label: '景点', icon: <Landmark size={14} /> },
  { key: 'play', label: '娱乐', icon: <Gamepad2 size={14} /> },
  { key: 'transport', label: '交通', icon: <Bus size={14} /> },
];

const LABEL_STYLE = {
  fontSize: '12px',
  color: 'var(--color-text-muted)',
  marginBottom: '4px',
  display: 'block',
};

const INPUT_STYLE = {
  width: '100%',
  padding: '6px 8px',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '13px',
  background: 'white',
  color: 'var(--color-text)',
};

const SELECT_STYLE = {
  width: '100%',
  padding: '6px 8px',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '13px',
  background: 'white',
  color: 'var(--color-text)',
};

export default function ActivityPanel({
  activityPool,
  tripCities,
  onAddSuggestion,
  onUpdateSuggestion,
  onDeleteSuggestion,
  onDragToDay,
  dragHandlers,
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [newActivity, setNewActivity] = useState({
    name: '',
    category: 'food',
    description: '',
    city: '',
  });

  const filteredActivities = useMemo(() => {
    if (!activityPool || !Array.isArray(activityPool)) return [];
    return activityPool.filter((act) => {
      if (activeCategory !== 'all' && act.category !== activeCategory) return false;
      if (searchText && !act.name.includes(searchText) && !act.description.includes(searchText))
        return false;
      return true;
    });
  }, [activityPool, activeCategory, searchText]);

  const handleAdd = () => {
    if (!newActivity.name.trim()) return;
    onAddSuggestion({
      ...newActivity,
      city: newActivity.city || tripCities[0] || '',
      location: null,
    });
    setNewActivity({ name: '', category: 'food', description: '', city: '' });
    setShowAddModal(false);
  };

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* 头部 — 仅保留新增按钮和折叠 */}
      <div
        style={{
          padding: '6px 10px',
          borderBottom: collapsed ? 'none' : '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '6px',
        }}
      >
        {!collapsed && (
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px',
              borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 500,
              color: 'var(--color-primary)', background: 'var(--color-primary-light)',
              cursor: 'pointer', border: 'none',
            }}
          >
            <Plus size={14} /> 新增
          </button>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            display: 'flex', alignItems: 'center', gap: '2px', padding: '4px 8px',
            borderRadius: 'var(--radius-sm)', fontSize: '11px',
            color: 'var(--color-text-muted)', border: '1px solid var(--color-border)',
            background: 'var(--color-bg)', cursor: 'pointer',
          }}
        >
          {collapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {collapsed ? '展开' : '收起'}
        </button>
      </div>

      {!collapsed && (<>
      {/* 搜索 + 分类筛选 */}
      <div style={{ padding: '6px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={14}
            color="var(--color-text-muted)"
            style={{ position: 'absolute', left: '8px', top: '7px' }}
          />
          <input
            type="text"
            placeholder="搜索..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ ...INPUT_STYLE, paddingLeft: '28px', fontSize: '12px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '4px', overflow: 'auto' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                padding: '3px 10px',
                borderRadius: '50px',
                fontSize: '12px',
                fontWeight: activeCategory === cat.key ? 600 : 400,
                color:
                  activeCategory === cat.key
                    ? 'var(--color-primary)'
                    : 'var(--color-text-secondary)',
                background:
                  activeCategory === cat.key
                    ? 'var(--color-primary-light)'
                    : 'var(--color-bg)',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition)',
              }}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 活动卡片列表 */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '4px 8px 8px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          alignContent: 'flex-start',
        }}
      >
        {filteredActivities.length === 0 && (
          <div
            style={{
              width: '100%',
              textAlign: 'center',
              padding: '20px',
              color: 'var(--color-text-muted)',
              fontSize: '13px',
            }}
          >
            暂无匹配的活动建议，点击"新增"添加
          </div>
        )}
        {filteredActivities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onUpdate={onUpdateSuggestion}
            onDelete={onDeleteSuggestion}
            onDragStart={(e) => dragHandlers.handleDragStart(e, activity)}
            onDragEnd={dragHandlers.handleDragEnd}
          />
        ))}
      </div>

      </>)}
      {/* 新增活动 Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="新增活动建议"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={LABEL_STYLE}>名称 *</label>
            <input
              type="text"
              value={newActivity.name}
              onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
              style={INPUT_STYLE}
              placeholder="如：点都德早茶"
            />
          </div>
          <div>
            <label style={LABEL_STYLE}>分类</label>
            <select
              value={newActivity.category}
              onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value })}
              style={SELECT_STYLE}
            >
              <option value="food">🍜 美食</option>
              <option value="drink">🍺 饮品</option>
              <option value="attraction">🏛️ 景点</option>
              <option value="play">🎯 娱乐</option>
              <option value="transport">🚌 交通</option>
            </select>
          </div>
          <div>
            <label style={LABEL_STYLE}>城市</label>
            <input
              type="text"
              value={newActivity.city}
              onChange={(e) => setNewActivity({ ...newActivity, city: e.target.value })}
              style={INPUT_STYLE}
              placeholder="关联城市（可选）"
            />
          </div>
          <div>
            <label style={LABEL_STYLE}>描述</label>
            <textarea
              value={newActivity.description}
              onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
              style={{ ...INPUT_STYLE, resize: 'vertical', minHeight: '60px' }}
              rows={3}
              placeholder="简短描述..."
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              onClick={() => setShowAddModal(false)}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
              }}
            >
              取消
            </button>
            <button
              onClick={handleAdd}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                background: 'var(--color-primary)',
                color: 'white',
                fontWeight: 500,
              }}
            >
              添加
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
