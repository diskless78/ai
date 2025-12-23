export type InputDateRangeProps = {
  startInputDate?: Date | string | null;
  endInputDate?: Date | string | null;
  onChangeValue?: (value: { startDate: Date; endDate: Date }) => void;
};
