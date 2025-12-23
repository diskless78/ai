import { StyledBaseArrcordion } from './styles';
import type { BoxProps } from '@mui/material';

export type BaseAccordionProps = {
  children: React.ReactNode;
};

export const BaseAccordion = ({
  children,
  ...other
}: BoxProps & BaseAccordionProps) => {
  return <StyledBaseArrcordion {...other}>{children}</StyledBaseArrcordion>;
};
