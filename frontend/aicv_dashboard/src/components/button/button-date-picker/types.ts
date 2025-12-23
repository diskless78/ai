export type ButtonDatePickerType = 'button';

export type ButtonDatePickerProps = {
  type: ButtonDatePickerType;
  onChange?: (date: Date | null) => void;
};
