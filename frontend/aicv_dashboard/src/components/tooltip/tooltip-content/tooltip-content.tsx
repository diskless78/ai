import Tooltip, {
  type TooltipProps,
  tooltipClasses,
} from '@mui/material/Tooltip';
import { styled } from '@mui/material';

import { pxToRem } from 'src/theme/styles';
import type { ReportTooltipProps } from './types';

export const StyledTooltipWrapper = styled(
  ({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  )
)(({ theme }) => {
  return {
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#121C2E',
      color: '#fff',
      padding: '8px 12px',
      fontSize: pxToRem(14),
      borderRadius: '6px',
      maxWidth: 400,
      boxShadow: theme.shadows[8],
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: '#121C2E',
    },
  };
});

export default function TooltipWrapper({
  title,
  children,
  placement = 'top',
  ...props
}: ReportTooltipProps) {
  return (
    <StyledTooltipWrapper title={title} arrow placement={placement} {...props}>
      {children}
    </StyledTooltipWrapper>
  );
}
