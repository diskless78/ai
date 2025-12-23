import { Box, useTheme, FormControlLabel } from '@mui/material';
import { pxToRem } from 'src/theme/styles';
import { StyledBaseSwitch } from './styles';

type Props = {
  label?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
};

const BaseSwitch = ({ label, checked, onChange, disabled }: Props) => {
  const theme = useTheme();

  const handleToggle = (event: any) => {
    onChange(event.target.checked);
  };

  return (
    <Box style={{ display: 'flex', alignItems: 'center' }}>
      <FormControlLabel
        sx={{
          m: 0,
          gap: pxToRem(12),
          height: pxToRem(25),
          '& .MuiTypography-root': {
            ...theme.typography.body1,
          },
        }}
        disabled={disabled}
        control={
          <StyledBaseSwitch
            checked={checked}
            onChange={handleToggle}
            color='primary'
          />
        }
        label={label}
      />
    </Box>
  );
};

export default BaseSwitch;
