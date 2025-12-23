import { Typography } from '@mui/material';
import { StyledTagContained } from './styles';
import type { TagContainedProps } from './types';

export default function TagContained({
  label,
  textColor,
  backgroundColor,
  alignSelf = 'start',
  iconLeft,
  hasBorder = false,
}: TagContainedProps) {
  return (
    <StyledTagContained
      ownerState={{
        bgColor: backgroundColor,
        txtColor: textColor,
        alignSelf,
        hasBorder,
      }}
    >
      {iconLeft && iconLeft}
      <Typography variant='t3SemiBold'>{label}</Typography>
    </StyledTagContained>
  );
}
