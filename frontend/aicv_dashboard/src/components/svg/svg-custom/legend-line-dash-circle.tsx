import SvgIcon, { type SvgIconProps } from '@mui/material/SvgIcon';

const LegendLineDashCircle = (props: SvgIconProps) => (
  <SvgIcon width={28} height={8} viewBox='0 0 28 8' {...props}>
    <line
      x1='7'
      y1='4'
      x2='21'
      y2='4'
      stroke='currentColor'
      strokeDasharray='2 2'
    />
    <circle cx='3.5' cy='4' r='3' fill='white' stroke='currentColor' />
    <circle cx='24.5' cy='4' r='3' fill='white' stroke='currentColor' />
  </SvgIcon>
);

export default LegendLineDashCircle;
