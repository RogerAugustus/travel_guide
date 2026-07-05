import { useState } from 'react';
import {
  X, Hotel, MapPin, Coffee, Bus, Plus, Trash2, Calendar, Clock,
  ChevronDown, ChevronUp, EyeOff,
} from 'lucide-react';
import EditableText from '../common/EditableText';
import { generateId } from '../../services/storage';

const sectionStyle = {
  padding: '10px 0',
  borderBottom: '1px solid var(--color-border)',
};

const sectionTitleStyle = {
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--color-text-secondary)',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};

const itemCardStyle = {
  background: 'var(--color-bg)',
  borderRadius: 'var(--radius-sm)',
  padding: '8px 10px',
  marginBottom: '6px',
};

const inputStyle = {
  width: '100%',
  padding: '6px 8px',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '13px',
  background: 'white',
  color: 'var(--color-text)',
};

const btnPrimaryStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 10px',
  borderRadius: 'var(--radius-sm)',
  fontSize: '12px',
  fontWeight: 500,
  color: 'var(--color-primary)',
  background: 'var(--color-primary-light)',
  cursor: 'pointer',
  border: 'none',
};

const btnDangerStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '2px 4px',
  borderRadius: '3px',
  color: 'var(--color-danger)',
  cursor: 'pointer',
  border: 'none',
  background: 'none',
};

const labelStyle = { fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '2px', display: 'block' };

const TRANSPORT_TYPES = ['🚄 高铁', '✈️ 飞机', '🚌 大巴', '🚗 自驾', '🚇 地铁', '🚕 打车', '🚢 轮渡', '其他'];

export default function DayDetail({
  date,
  dayData,
  weather,
  onClose,
  onUpdateDay,
  onUpdateAccommodation,
  onExtendAccommodation,
  onAddAttraction,
  onUpdateAttraction,
  onDeleteAttraction,
  onAddTransport,
  onUpdateTransport,
  onDeleteTransport,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
}) {
  if (!dayData) {
    dayData = {
      date,
      city: '',
      accommodation: { name: '', address: '', checkIn: '', notes: '' },
      attractions: [],
      transports: [],
      activities: [],
      notes: '',
    };
  }

  const acc = dayData.accommodation || { name: '', address: '', checkIn: '', notes: '' };
  const transports = dayData.transports || [];
  const dateDisplay = `${date} 星期${['日', '一', '二', '三', '四', '五', '六'][new Date(date).getDay()]}`;

  // 折叠状态
  const [collapsed, setCollapsed] = useState({});
  const toggleCollapse = (key) => setCollapsed((c) => ({ ...c, [key]: !c[key] }));

  const sectionKeys = ['accommodation', 'transport', 'attractions', 'activities', 'notes'];
  const hiddenKeys = sectionKeys.filter((k) => collapsed[k]);

  // 可折叠的 section 包装组件
  const SectionHeader = ({ icon, title, count, sectionKey }) => (
    <div
      onClick={() => toggleCollapse(sectionKey)}
      style={{
        ...sectionTitleStyle,
        cursor: 'pointer',
        userSelect: 'none',
        justifyContent: 'space-between',
        marginBottom: collapsed[sectionKey] ? 0 : '8px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {icon}
        <span>{title}{count !== undefined && ` (${count})`}</span>
      </div>
      {collapsed[sectionKey] ? <ChevronDown size={14} color="var(--color-text-muted)" /> : <ChevronUp size={14} color="var(--color-text-muted)" />}
    </div>
  );

  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: '0 0 var(--radius-md) var(--radius-md)',
      overflow: 'auto',
      height: '100%',
    }}>
      {/* 头部 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', borderBottom: '1px solid var(--color-border)',
        position: 'sticky', top: 0, background: 'var(--color-surface)', zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} color="var(--color-primary)" />
          <span style={{ fontSize: '16px', fontWeight: 600 }}>{dateDisplay}</span>
          {weather && (
            <span style={{ fontSize: '14px' }} title={weather.text}>
              {weather.icon} {weather.tempMin}~{weather.tempMax}°
            </span>
          )}
        </div>
        <button onClick={onClose} style={{ padding: '4px', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-secondary)', cursor: 'pointer', border: 'none', background: 'none' }}>
          <X size={20} />
        </button>
      </div>

      <div style={{ padding: '8px 16px 16px' }}>
        {/* === 城市 === */}
        <div style={{ marginBottom: '10px' }}>
          <label style={labelStyle}>所在城市</label>
          <EditableText value={dayData.city} onChange={(val) => onUpdateDay(date, { city: val })} style={{ ...inputStyle }} placeholder="输入城市名..." />
        </div>

        {/* === 住宿 === */}
        <div style={sectionStyle}>
          <SectionHeader icon={<Hotel size={14} />} title="住宿" sectionKey="accommodation" />
          {!collapsed['accommodation'] && (
            <div style={itemCardStyle}>
              <div style={{ marginBottom: '6px' }}>
                <label style={labelStyle}>酒店名称</label>
                <EditableText value={acc.name} onChange={(val) => onUpdateAccommodation(date, { name: val })} style={{ ...inputStyle }} placeholder="酒店/民宿名称..." />
              </div>
              <div style={{ marginBottom: '6px' }}>
                <label style={labelStyle}>地址</label>
                <EditableText value={acc.address} onChange={(val) => onUpdateAccommodation(date, { address: val })} style={{ ...inputStyle }} placeholder="地址..." />
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>入住时间</label>
                  <EditableText value={acc.checkIn} onChange={(val) => onUpdateAccommodation(date, { checkIn: val })} style={{ ...inputStyle }} placeholder="14:00" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>入住天数</label>
                  <select
                    value={acc.nights || '1'}
                    onChange={(e) => {
                      const n = parseInt(e.target.value);
                      onUpdateAccommodation(date, { nights: n });
                      if (n > 1) onExtendAccommodation(date, n);
                    }}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    {[1,2,3,4,5,6,7,8,9,10,14,21].map(n => (
                      <option key={n} value={n}>{n}晚</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>备注</label>
                <EditableText value={acc.notes} onChange={(val) => onUpdateAccommodation(date, { notes: val })} style={{ ...inputStyle, fontSize: '12px' }} placeholder="酒店备注..." multiline />
              </div>
            </div>
          )}
        </div>

        {/* === 交通 === */}
        <div style={sectionStyle}>
          <SectionHeader icon={<Bus size={14} />} title="交通" count={transports.length} sectionKey="transport" />
          {!collapsed['transport'] && (<>
          {transports.map((t) => (
            <div key={t.id} style={itemCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>交通方式</label>
                      <select
                        value={t.type}
                        onChange={(e) => onUpdateTransport(date, t.id, { type: e.target.value })}
                        style={{ ...inputStyle, cursor: 'pointer' }}
                      >
                        <option value="">选择方式...</option>
                        {TRANSPORT_TYPES.map((tt) => (
                          <option key={tt} value={tt}>{tt}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>班次/车号</label>
                      <EditableText value={t.name} onChange={(val) => onUpdateTransport(date, t.id, { name: val })} style={{ ...inputStyle }} placeholder="如 G1234" />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>出发地</label>
                      <EditableText value={t.from} onChange={(val) => onUpdateTransport(date, t.id, { from: val })} style={{ ...inputStyle }} placeholder="广州南站" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>目的地</label>
                      <EditableText value={t.to} onChange={(val) => onUpdateTransport(date, t.id, { to: val })} style={{ ...inputStyle }} placeholder="上海虹桥" />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>出发时间</label>
                      <EditableText value={t.departure} onChange={(val) => onUpdateTransport(date, t.id, { departure: val })} style={{ ...inputStyle }} placeholder="08:00" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>到达时间</label>
                      <EditableText value={t.arrival} onChange={(val) => onUpdateTransport(date, t.id, { arrival: val })} style={{ ...inputStyle }} placeholder="14:30" />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>备注</label>
                    <EditableText value={t.notes} onChange={(val) => onUpdateTransport(date, t.id, { notes: val })} style={{ ...inputStyle, fontSize: '12px' }} placeholder="备注..." multiline />
                  </div>
                </div>
                <button style={btnDangerStyle} onClick={() => onDeleteTransport(date, t.id)} title="删除交通">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          <button style={btnPrimaryStyle} onClick={() => onAddTransport(date)}>
            <Plus size={14} /> 添加交通
          </button>
          </>)}
        </div>

        {/* === 景点 === */}
        <div style={sectionStyle}>
          <SectionHeader icon={<MapPin size={14} />} title="景点" count={(dayData.attractions || []).length} sectionKey="attractions" />
          {!collapsed['attractions'] && (<>
          {(dayData.attractions || []).map((attr) => (
            <div key={attr.id} style={itemCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <EditableText value={attr.name} onChange={(val) => onUpdateAttraction(date, attr.id, { name: val })} style={{ ...inputStyle, fontWeight: 500 }} placeholder="景点名称..." />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>时间</label>
                      <EditableText value={attr.time} onChange={(val) => onUpdateAttraction(date, attr.id, { time: val })} style={{ ...inputStyle }} placeholder="09:00-11:00" />
                    </div>
                  </div>
                  <div style={{ marginTop: '4px' }}>
                    <label style={labelStyle}>备注</label>
                    <EditableText value={attr.notes} onChange={(val) => onUpdateAttraction(date, attr.id, { notes: val })} style={{ ...inputStyle, fontSize: '12px' }} placeholder="备注..." multiline />
                  </div>
                </div>
                <button style={btnDangerStyle} onClick={() => onDeleteAttraction(date, attr.id)} title="删除景点">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          <button style={btnPrimaryStyle} onClick={() => onAddAttraction(date)}>
            <Plus size={14} /> 添加景点
          </button>
          </>)}
        </div>

        {/* === 活动 === */}
        <div style={sectionStyle}>
          <SectionHeader icon={<Coffee size={14} />} title="活动" count={(dayData.activities || []).length} sectionKey="activities" />
          {!collapsed['activities'] && (<>
          {(dayData.activities || []).map((act) => (
            <div key={act.id} style={itemCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      fontSize: '10px', padding: '1px 6px', borderRadius: '3px', fontWeight: 500,
                      background: act.category === 'food' ? '#fef3c7' : act.category === 'drink' ? '#ede9fe' : act.category === 'transport' ? '#fce7f3' : '#dbeafe',
                      color: act.category === 'food' ? '#b45309' : act.category === 'drink' ? '#6d28d9' : act.category === 'transport' ? '#be185d' : '#1d4ed8',
                    }}>
                      {{ food: '美食', drink: '饮品', attraction: '景点', play: '娱乐', transport: '交通' }[act.category] || '其他'}
                    </span>
                  </div>
                  <EditableText value={act.name} onChange={(val) => onUpdateActivity(date, act.id, { name: val })} style={{ ...inputStyle, fontWeight: 500, marginTop: '4px' }} placeholder="活动名称..." />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>时间</label>
                      <EditableText value={act.time} onChange={(val) => onUpdateActivity(date, act.id, { time: val })} style={{ ...inputStyle }} placeholder="18:00" />
                    </div>
                  </div>
                  <div style={{ marginTop: '4px' }}>
                    <label style={labelStyle}>备注</label>
                    <EditableText value={act.notes} onChange={(val) => onUpdateActivity(date, act.id, { notes: val })} style={{ ...inputStyle, fontSize: '12px' }} placeholder="备注..." multiline />
                  </div>
                </div>
                <button style={btnDangerStyle} onClick={() => onDeleteActivity(date, act.id)} title="删除活动">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          <button style={btnPrimaryStyle} onClick={() => { onAddActivity(date, { id: generateId(), name: '', time: '', category: 'food', notes: '' }); }}>
            <Plus size={14} /> 添加活动
          </button>
          </>)}
        </div>

        {/* === 备注 === */}
        <div style={{ ...sectionStyle, borderBottom: 'none' }}>
          <SectionHeader icon={<Clock size={14} />} title="当日备注" sectionKey="notes" />
          {!collapsed['notes'] && (
            <EditableText value={dayData.notes} onChange={(val) => onUpdateDay(date, { notes: val })} style={{ ...inputStyle, minHeight: '60px', width: '100%' }} placeholder="写点备注..." multiline as="textarea" />
          )}
        </div>

        {/* === 已收起的模块 === */}
        {hiddenKeys.length > 0 && (
          <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '2px dashed var(--color-border)' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <EyeOff size={12} /> 已收起 ({hiddenKeys.length})
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {hiddenKeys.map((k) => {
                const labels = { accommodation: '🏨 住宿', transport: '🚌 交通', attractions: '📍 景点', activities: '🎯 活动', notes: '📝 备注' };
                return (
                  <button
                    key={k}
                    onClick={() => toggleCollapse(k)}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '50px',
                      fontSize: '11px',
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-bg)',
                      color: 'var(--color-text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                    }}
                  >
                    {labels[k] || k}
                    <ChevronDown size={10} />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
