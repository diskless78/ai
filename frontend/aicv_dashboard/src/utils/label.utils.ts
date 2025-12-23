import { ETimeFilterType } from 'src/models/common/models.enum';
import { fDate, formatTimeHHMMSS, secondsToHMS } from './format-time';
import { formatNumber } from './format-number';
import dayjs from 'dayjs';

export type LabelType = 'current' | 'compare';

const LABEL_MAP: Record<ETimeFilterType, { current: string; compare: string }> =
  {
    [ETimeFilterType.Today]: {
      current: 'Today',
      compare: 'Yesterday',
    },
    [ETimeFilterType.CurrentWeek]: {
      current: 'Current week',
      compare: 'Last week',
    },
    [ETimeFilterType.CurrentMonth]: {
      current: 'Current month',
      compare: 'Last month',
    },
    [ETimeFilterType.CurrentQuarter]: {
      current: 'Current quarter',
      compare: 'Last quarter',
    },
    [ETimeFilterType.CurrentYear]: {
      current: 'Current year',
      compare: 'Last year',
    },
    [ETimeFilterType.Custom]: {
      current: 'Current',
      compare: 'Last period',
    },
  };

export function getLabelCompare(
  timeFilterType: ETimeFilterType,
  type: LabelType
): string {
  const label = LABEL_MAP[timeFilterType]?.[type] ?? String(type);

  return label;
}

export function getRangeDateCompare({
  timeFilterType,
  type,
  useTooltip = false,
  currentStartDate,
  currentEndDate,
  compareStartDate,
  compareEndDate,
  breakLine = false,
}: {
  timeFilterType: ETimeFilterType;
  type: LabelType;
  useTooltip?: boolean;
  currentStartDate?: string | null;
  currentEndDate?: string | null;
  compareStartDate?: string | null;
  compareEndDate?: string | null;
  breakLine?: boolean;
}): string {
  if (useTooltip && timeFilterType != ETimeFilterType.Custom) {
    return '';
  }

  // Helper: format range khi cùng năm
  const formatSmartRange = (start: string, end: string) => {
    const startDate = dayjs(start);
    const endDate = dayjs(end);

    if (
      startDate.date() === endDate.date() &&
      startDate.month() === endDate.month() &&
      startDate.year() === endDate.year()
    ) {
      return `${startDate.format('DD/MM/YYYY')}`;
    } else if (startDate.year() === endDate.year()) {
      return `${startDate.format('DD/MM')} - ${endDate.format('DD/MM/YYYY')}`;
    }

    return `${startDate.format('DD/MM/YYYY')} - ${endDate.format('DD/MM/YYYY')}`;
  };

  if (
    timeFilterType == ETimeFilterType.Custom &&
    compareStartDate &&
    compareEndDate &&
    type === 'compare'
  ) {
    return breakLine
      ? `<br/>${formatSmartRange(compareStartDate, compareEndDate)}`
      : formatSmartRange(compareStartDate, compareEndDate);
  }

  if (
    timeFilterType == ETimeFilterType.Custom &&
    currentStartDate &&
    currentEndDate &&
    type === 'current'
  ) {
    return breakLine
      ? `<br/>${formatSmartRange(currentStartDate, currentEndDate)}`
      : formatSmartRange(currentStartDate, currentEndDate);
  }

  const label = LABEL_MAP[timeFilterType]?.[type] ?? String(type);
  return label;
}

export const getLabelType = (type: string, value: string | number) => {
  if (type === 'seconds' && typeof value === 'number') {
    return secondsToHMS(value);
  } else if (type === 'time' && typeof value === 'number') {
    return formatTimeHHMMSS(value);
  } else if (type === 'percent' && typeof value === 'number') {
    return `${value}%`;
  } else if (type === 'label' && typeof value === 'string') {
    return value;
  } else if (type === 'number' && typeof value === 'number') {
    return formatNumber(value);
  }
  return value;
};

export const formatValueByType = (
  value: string | number,
  type: 'date' | 'number' | 'percent' | 'seconds' | 'float' | 'time' | undefined
): string => {
  switch (type) {
    case 'date':
      return value ? (fDate(new Date(value as any)) ?? '') : '';

    case 'number':
      return value ? formatNumber(value as number) : '0';

    case 'percent':
      return value ? `${value}%` : '0%';

    case 'seconds':
      return value ? secondsToHMS(value as number) : '0s';

    case 'float':
      return value
        ? formatNumber(value as number, { minimumFractionDigits: 2 })
        : '0';

    case 'time':
      return value ? formatTimeHHMMSS(value as number) : '00:00:00';

    default:
      return value != null ? String(value) : '';
  }
};
