import React from 'react';
import { SvgIcon, type SvgIconProps } from '@mui/material';

const LegendLineCircle = (props: SvgIconProps) => (
  <SvgIcon viewBox='0 0 28 8' width={28} height={8} fill='none' {...props}>
    <line x1='7' y1='4' x2='21' y2='4' stroke='currentColor' />
    <circle cx='3.5' cy='4' r='3' fill='white' stroke='currentColor' />
    <circle cx='24.5' cy='4' r='3' fill='white' stroke='currentColor' />
  </SvgIcon>
);

export default LegendLineCircle;
