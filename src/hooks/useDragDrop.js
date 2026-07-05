import { useCallback } from 'react';

// 简单的拖拽 Hook，用于活动卡片拖入日历
export default function useDragDrop() {
  const handleDragStart = useCallback((e, item) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'copy';
    e.currentTarget.classList.add('dragging');
  }, []);

  const handleDragEnd = useCallback((e) => {
    e.currentTarget.classList.remove('dragging');
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    e.currentTarget.classList.add('drag-over');
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.currentTarget.classList.remove('drag-over');
  }, []);

  const handleDrop = useCallback((e, onDropCallback) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (onDropCallback) onDropCallback(data);
    } catch (err) {
      console.error('Drop data parse error:', err);
    }
  }, []);

  return {
    dragHandlers: { handleDragStart, handleDragEnd },
    dropHandlers: { handleDragOver, handleDragLeave, handleDrop },
  };
}
