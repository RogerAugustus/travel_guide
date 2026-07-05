import { useState, useEffect } from 'react';
import { MapPin, Calendar, Settings, Save, Download, Upload, Key, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import EditableText from '../common/EditableText';
import Modal from '../common/Modal';
import { exportAllData, importAllData, loadSettings, saveSettings } from '../../services/storage';

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 20px',
  background: 'var(--color-surface)',
  borderBottom: '1px solid var(--color-border)',
  boxShadow: 'var(--shadow-sm)',
  zIndex: 10,
  gap: '16px',
  flexWrap: 'wrap',
};

const leftStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flex: 1,
  minWidth: '200px',
};

const centerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const dateInputStyle = {
  padding: '6px 10px',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '14px',
  background: 'var(--color-bg)',
  color: 'var(--color-text)',
};

const btnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  borderRadius: 'var(--radius-sm)',
  fontSize: '13px',
  fontWeight: 500,
  color: 'var(--color-text-secondary)',
  border: '1px solid var(--color-border)',
  background: 'var(--color-surface)',
  transition: 'all var(--transition)',
};

const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '14px',
  fontFamily: 'monospace',
  background: 'var(--color-bg)',
  color: 'var(--color-text)',
};

export default function Header({ trip, onUpdateTrip, onUpdateDateRange }) {
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const s = loadSettings();
    setApiKey(s.weatherApiKey || '');
  }, [showSettings]);

  const handleSaveApiKey = () => {
    saveSettings({ weatherApiKey: apiKey.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    // 刷新页面让 API Key 生效
    setTimeout(() => window.location.reload(), 1000);
  };

  const handleExport = () => {
    const json = exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `旅行路书-${trip.name}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const success = importAllData(ev.target.result);
          if (success) {
            alert('导入成功！请刷新页面查看。');
            window.location.reload();
          } else {
            alert('导入失败，请检查文件格式。');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const hasApiKey = apiKey && apiKey.trim().length > 0;

  return (
    <header style={headerStyle}>
      <div style={leftStyle}>
        <MapPin size={24} color="var(--color-primary)" />
        <EditableText
          value={trip.name}
          onChange={(val) => onUpdateTrip({ name: val })}
          style={{ fontWeight: 700, fontSize: '20px', color: 'var(--color-text)' }}
          placeholder="输入行程名称..."
        />
      </div>

      <div style={centerStyle}>
        <Calendar size={16} color="var(--color-text-secondary)" />
        <input
          type="date"
          value={trip.startDate}
          onChange={(e) => onUpdateDateRange(e.target.value, trip.endDate)}
          style={dateInputStyle}
        />
        <span style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>至</span>
        <input
          type="date"
          value={trip.endDate}
          onChange={(e) => onUpdateDateRange(trip.startDate, e.target.value)}
          style={dateInputStyle}
          min={trip.startDate}
        />
        <EditableText
          value={trip.cities.join('、')}
          onChange={(val) => onUpdateTrip({ cities: val.split(/[,，、\s]+/).filter(Boolean) })}
          placeholder="添加城市，用逗号分隔..."
          style={{
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
            minWidth: '120px',
            padding: '4px 8px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--color-bg)',
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button onClick={handleExport} style={btnStyle} title="导出数据">
          <Download size={14} />
          导出
        </button>
        <button onClick={handleImport} style={btnStyle} title="导入数据">
          <Upload size={14} />
          导入
        </button>
        <button
          onClick={() => setShowSettings(true)}
          style={{
            ...btnStyle,
            borderColor: hasApiKey ? 'var(--color-success)' : 'var(--color-warning)',
            color: hasApiKey ? 'var(--color-success)' : 'var(--color-warning)',
          }}
          title="设置"
        >
          <Settings size={14} />
          设置
        </button>
      </div>

      {/* 设置弹窗 */}
      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="设置">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 天气 API Key */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Key size={16} color="var(--color-primary)" />
              <span style={{ fontSize: '15px', fontWeight: 600 }}>和风天气 API Key</span>
              {hasApiKey ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', color: 'var(--color-success)' }}>
                  <CheckCircle size={12} /> 已配置
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', color: 'var(--color-warning)' }}>
                  <AlertCircle size={12} /> 未配置（使用模拟数据）
                </span>
              )}
            </div>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="在此粘贴你的和风天气 API Key..."
              style={inputStyle}
            />
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '6px', lineHeight: 1.5 }}>
              免费注册获取 Key：
              <a
                href="https://id.qweather.com/#/register"
                target="_blank"
                rel="noopener"
                style={{ color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
              >
                和风天气控制台 <ExternalLink size={11} />
              </a>
              ，注册后在「项目管理」创建 Key，选择「免费订阅」即可。
              免费版每日 1000 次调用，个人使用完全足够。
            </div>
          </div>

          {/* 保存按钮 */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              onClick={() => setShowSettings(false)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
              }}
            >
              取消
            </button>
            <button
              onClick={handleSaveApiKey}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                fontWeight: 500,
                color: 'white',
                background: saved ? 'var(--color-success)' : 'var(--color-primary)',
                transition: 'all var(--transition)',
              }}
            >
              {saved ? (
                <>
                  <CheckCircle size={14} /> 已保存，刷新中...
                </>
              ) : (
                <>
                  <Save size={14} /> 保存并刷新
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </header>
  );
}
