import type { ITableHeader } from './types';
import { formatValueByType } from 'src/utils/label.utils';

/**
 * Formats a cell value based on the field configuration
 * @param field - The table header configuration
 * @param item - The data item
 * @returns The formatted cell content
 */
export function formatCellValue<T>(
  field: ITableHeader<T>,
  item: T
): React.ReactNode {
  // Custom render function takes precedence
  if (field.renderItem) {
    return field.renderItem(item);
  }

  // If no field is specified, return null
  if (!field.field) {
    return null;
  }

  const value = item[field.field];

  // Handle object values
  if (typeof value === 'object') {
    return null;
  }

  // Format based on the specified format type
  return formatValueByType(value as string | number, field.format ?? undefined);
}

/**
 * Calculates the total number of columns in the table
 * @param headersCount - Number of visible headers
 * @param showIndex - Whether index column is shown
 * @param type - Table type (single or multiple)
 * @returns Total column count
 */
export function calculateColumnCount(
  headersCount: number,
  showIndex: boolean,
  type: 'single' | 'multiple'
): number {
  let count = headersCount;
  if (showIndex) count += 1;
  if (type === 'multiple') count += 1;
  return count;
}
