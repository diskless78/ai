import { useState, useCallback } from 'react';

interface UseTableSelectionProps {
  disabledIds?: string[];
  onChangeSelectItems?: (value: string[]) => void;
  callbackSelectAll?: (value: boolean) => Promise<string[]>;
}

interface UseTableSelectionReturn {
  selectedItems: string[];
  selectedAll: boolean;
  handleSelectAll: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
  handleSelectOne: (
    event: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => void;
  isItemSelected: (id: string) => boolean;
}

export function useTableSelection({
  disabledIds = [],
  onChangeSelectItems,
  callbackSelectAll,
}: UseTableSelectionProps): UseTableSelectionReturn {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedAll, setSelectedAll] = useState<boolean>(false);

  const handleSelectAll = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      let newSelectedItems: string[] = [];

      if (event.target.checked) {
        if (callbackSelectAll) {
          const result = await callbackSelectAll(true);
          // Filter out disabled items
          const enabledItems = result.filter(
            (item) => !disabledIds.includes(item)
          );
          newSelectedItems = enabledItems;
        }
        setSelectedAll(true);
      } else {
        newSelectedItems = [];
        setSelectedAll(false);
        callbackSelectAll && callbackSelectAll(false);
      }

      setSelectedItems(newSelectedItems);
      onChangeSelectItems && onChangeSelectItems(newSelectedItems);
    },
    [callbackSelectAll, disabledIds, onChangeSelectItems]
  );

  const handleSelectOne = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
      const selectedIndex = selectedItems.indexOf(id);
      let newSelectedItems: string[] = [];

      if (selectedIndex === -1) {
        // Add item to selection
        newSelectedItems = [...selectedItems, id];
      } else if (selectedIndex === 0) {
        // Remove first item
        newSelectedItems = selectedItems.slice(1);
      } else if (selectedIndex === selectedItems.length - 1) {
        // Remove last item
        newSelectedItems = selectedItems.slice(0, -1);
      } else {
        // Remove item from middle
        newSelectedItems = [
          ...selectedItems.slice(0, selectedIndex),
          ...selectedItems.slice(selectedIndex + 1),
        ];
      }

      setSelectedItems(newSelectedItems);
      onChangeSelectItems && onChangeSelectItems(newSelectedItems);
    },
    [selectedItems, onChangeSelectItems]
  );

  const isItemSelected = useCallback(
    (id: string) => selectedItems.indexOf(id) !== -1,
    [selectedItems]
  );

  return {
    selectedItems,
    selectedAll,
    handleSelectAll,
    handleSelectOne,
    isItemSelected,
  };
}
