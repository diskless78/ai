import { useState, useCallback } from 'react';

export function useNavCollapse(
  initialCollapsed: boolean,
  onCollapseChange: (collapsed: boolean) => void
) {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const handleCollapse = useCallback(() => {
    setIsCollapsed((prev) => {
      const newValue = !prev;
      onCollapseChange(newValue);
      if (newValue) {
        setOpenItems(new Set());
      }
      return newValue;
    });
  }, [onCollapseChange]);

  const toggleItem = useCallback((title: string) => {
    setOpenItems((prev) => {
      const newOpenItems = new Set(prev);
      if (newOpenItems.has(title)) {
        newOpenItems.delete(title);
      } else {
        newOpenItems.add(title);
      }
      return newOpenItems;
    });
  }, []);

  return {
    isCollapsed,
    openItems,
    handleCollapse,
    toggleItem,
  };
}
