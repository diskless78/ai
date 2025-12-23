import type { ReactNode } from 'react';
import type { BoxProps } from '@mui/material';

export interface FormPanelProps extends BoxProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  variant?: 'default' | 'compact';
  messageError?: string;
}
