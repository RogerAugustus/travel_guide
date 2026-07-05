import { useState, useRef, useEffect } from 'react';

// 双击可编辑的文本组件
export default function EditableText({
  value,
  onChange,
  placeholder = '双击编辑...',
  as = 'input', // 'input' | 'textarea'
  className = '',
  style = {},
  multiline = false,
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value || '');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!editing) setText(value || '');
  }, [value, editing]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      if (as === 'input') inputRef.current.select();
    }
  }, [editing, as]);

  const commit = () => {
    setEditing(false);
    if (onChange && text !== value) {
      onChange(text);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      commit();
    }
    if (e.key === 'Escape') {
      setText(value || '');
      setEditing(false);
    }
  };

  if (!editing) {
    return (
      <span
        className={`editable-text ${className}`}
        style={{ cursor: 'pointer', minWidth: '20px', display: 'inline-block', ...style }}
        onDoubleClick={() => setEditing(true)}
        title="双击编辑"
      >
        {value || <span style={{ color: 'var(--color-text-muted)' }}>{placeholder}</span>}
      </span>
    );
  }

  const inputStyle = {
    border: '2px solid var(--color-primary)',
    borderRadius: 'var(--radius-sm)',
    padding: '4px 8px',
    fontSize: 'inherit',
    fontFamily: 'inherit',
    background: 'white',
    outline: 'none',
    width: '100%',
    ...style,
  };

  if (multiline || as === 'textarea') {
    return (
      <textarea
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={{ ...inputStyle, resize: 'vertical', minHeight: '60px' }}
        rows={3}
      />
    );
  }

  return (
    <input
      ref={inputRef}
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={commit}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      style={inputStyle}
    />
  );
}
