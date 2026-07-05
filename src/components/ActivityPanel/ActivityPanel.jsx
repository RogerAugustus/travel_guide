import { useState, useMemo } from 'react';
import { Plus, UtensilsCrossed, GlassWater, Gamepad2, Landmark, Bus, Search, ChevronUp, ChevronDown, ExternalLink, Sparkles } from 'lucide-react';
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
  collapsed = false,
  onToggleCollapse,
  onAddSuggestion,
  onUpdateSuggestion,
  onDeleteSuggestion,
  onDragToDay,
  dragHandlers,
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
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

  // 折叠状态：只显示一条窄栏
  if (collapsed) {
    return (
      <div style={{
        background: 'var(--color-surface)', borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '4px 10px', height: '100%',
        gap: '6px',
      }}>
        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          🍜 吃喝玩乐
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>({activityPool?.length || 0}条)</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button onClick={() => { setShowAddModal(true); onToggleCollapse(); }} style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '3px 8px', borderRadius: 'var(--radius-sm)', fontSize: '11px', fontWeight: 500, color: 'var(--color-primary)', background: 'var(--color-primary-light)', cursor: 'pointer', border: 'none' }}>
            <Plus size={12} /> 新增
          </button>
          <button onClick={() => { setShowSearchModal(true); onToggleCollapse(); }} style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '3px 8px', borderRadius: 'var(--radius-sm)', fontSize: '11px', fontWeight: 500, color: '#7c3aed', background: '#ede9fe', cursor: 'pointer', border: 'none' }}>
            <Sparkles size={12} /> 搜推荐
          </button>
          <button onClick={onToggleCollapse} style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '3px 8px', borderRadius: 'var(--radius-sm)', fontSize: '11px', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', background: 'var(--color-bg)', cursor: 'pointer' }}>
            <ChevronUp size={14} /> 展开
          </button>
        </div>
      </div>
    );
  }

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
      {/* 头部 — 新增、搜推荐、收起按钮 */}
      <div
        style={{
          padding: '6px 10px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '6px',
        }}
      >
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
        <button
          onClick={() => setShowSearchModal(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px',
            borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 500,
            color: '#7c3aed', background: '#ede9fe',
            cursor: 'pointer', border: 'none',
          }}
        >
          <Sparkles size={14} /> 搜推荐
        </button>
        <button
          onClick={onToggleCollapse}
          style={{
            display: 'flex', alignItems: 'center', gap: '2px', padding: '4px 8px',
            borderRadius: 'var(--radius-sm)', fontSize: '11px',
            color: 'var(--color-text-muted)', border: '1px solid var(--color-border)',
            background: 'var(--color-bg)', cursor: 'pointer',
          }}
        >
          <ChevronDown size={14} /> 收起
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

      {/* 搜索推荐 Modal */}
      <Modal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} title="🔍 搜索推荐" width="520px">
        {(() => {
          const city = tripCities[0] || '广州';
          const catLabel = CATEGORIES.find(c => c.key === activeCategory)?.label || '美食';
          const catCN = activeCategory === 'all' ? '美食' : catLabel;
          const query = `${city} ${catCN} 推荐`;

          const platforms = [
            { name: '小红书', url: `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(query)}`, color: '#ff2442', icon: '📕' },
            { name: '大众点评', url: `https://m.dianping.com/search/keyword/1/0_${encodeURIComponent(city + catCN)}`, color: '#ff9500', icon: '⭐' },
            { name: '马蜂窝', url: `https://www.mafengwo.cn/search/q.php?q=${encodeURIComponent(query)}`, color: '#ff9d00', icon: '🐝' },
            { name: '抖音', url: `https://www.douyin.com/search/${encodeURIComponent(query + ' 探店')}`, color: '#000000', icon: '🎵' },
            { name: '百度', url: `https://www.baidu.com/s?wd=${encodeURIComponent(query + ' 攻略')}`, color: '#2932e1', icon: '🔍' },
          ];

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                基于当前城市 <strong>{city}</strong> 和分类 <strong>{catCN}</strong>，
                点击下方平台搜索，找到喜欢的直接复制名称回来添加。
              </div>

              {/* 平台搜索链接 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {platforms.map((p) => (
                  <a
                    key={p.name}
                    href={p.url}
                    target="_blank"
                    rel="noopener"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                      background: 'var(--color-bg)', border: '1px solid var(--color-border)',
                      textDecoration: 'none', color: 'var(--color-text)',
                      transition: 'all var(--transition)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = p.color;
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{p.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>搜索「{query}」</div>
                    </div>
                    <ExternalLink size={14} color="var(--color-text-muted)" />
                  </a>
                ))}
              </div>

              {/* 快速添加区 */}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={14} color="#7c3aed" /> 快速添加
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    id="quick-add-input"
                    type="text"
                    placeholder="粘贴找到的店名/景点名..."
                    style={{
                      flex: 1, padding: '8px 10px', border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)', fontSize: '13px', outline: 'none',
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        onAddSuggestion({
                          name: e.target.value.trim(),
                          category: activeCategory === 'all' ? 'food' : activeCategory,
                          description: '',
                          city,
                          location: null,
                        });
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    style={{
                      padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontSize: '13px',
                      background: '#7c3aed', color: 'white', fontWeight: 500, border: 'none', cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                    onClick={() => {
                      const input = document.querySelector('#quick-add-input');
                      if (input && input.value.trim()) {
                        onAddSuggestion({
                          name: input.value.trim(),
                          category: activeCategory === 'all' ? 'food' : activeCategory,
                          description: '',
                          city,
                          location: null,
                        });
                        input.value = '';
                      }
                    }}
                  >
                    添加
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
