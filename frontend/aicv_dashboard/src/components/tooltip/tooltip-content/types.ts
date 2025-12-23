import type { ReactNode, ReactElement } from 'react';

export interface ReportTooltipProps {
  title: ReactNode;
  children: ReactElement;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export interface TooltipContentProps {
  progressValue: number;
  titleText: string;
  subtitleText: string;
  descriptionText: string;
}
