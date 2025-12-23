import { Controller } from 'react-hook-form';
import BaseSwitch from '../base-switch/base-switch';

type Props = {
  label?: string;
  name: string;
  control: any;
  defaultValue?: boolean;
};

const FormBaseSwitch = ({ label, name, control, defaultValue = false }: Props) => (
  <Controller
    name={name}
    control={control}
    defaultValue={defaultValue}
    render={({ field }) => (
      <BaseSwitch label={label} checked={field.value} onChange={(value) => field.onChange(value)} />
    )}
  />
);

export default FormBaseSwitch;
