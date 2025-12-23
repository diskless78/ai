import type { Theme } from '@mui/material';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { formatValueByType } from './label.utils';

interface TooltipParams {
  title?: string;
  items: {
    label: string;
    color: string;
    value: number | string;
    suffix?: string;
    percent?: number;
    format?: 'number' | 'seconds';
  }[];
  comparePercent?: number;
  labelCompare?: string;
  theme: Theme;
  legend?: boolean;
  typePercent?: 'green' | 'red' | 'grey' | 'blue';
}

export const renderTooltipChart = ({
  title,
  items,
  comparePercent,
  labelCompare,
  theme,
  legend = true,
  typePercent,
}: TooltipParams): string => {
  const borderRadius = '8px';
  const tooltipShadow = theme.customShadows.card0;
  const t2SemiBold = theme.typography.t2SemiBold;
  const b4Medium = theme.typography.b4Medium;

  const getTypeByPercent = (percent: number) => {
    if (percent === 0) return 'grey';
    return percent > 0 ? 'green' : 'red';
  };

  const getColorByType = (
    type: 'green' | 'red' | 'grey' | 'blue',
    theme: Theme
  ) => {
    return {
      text:
        type === 'green'
          ? theme.palette.green[80]
          : type === 'red'
            ? theme.palette.red[70]
            : type === 'blue'
              ? theme.palette.blue[70]
              : theme.palette.neutral[70],

      bg:
        type === 'green'
          ? theme.palette.green[10]
          : type === 'red'
            ? theme.palette.red[10]
            : type === 'blue'
              ? theme.palette.blue[10]
              : theme.palette.neutral[20],
    };
  };

  const getArrowIcon = (type: 'green' | 'red' | 'grey' | 'blue') => {
    if (type === 'grey' || type === 'blue') return '';

    return `url('${
      type === 'green'
        ? ASSET_CONSTANT.SVG.IconLinearArrowUpRight
        : ASSET_CONSTANT.SVG.IconLinearArrowDownRight
    }')`;
  };

  const buildPercentageChip = (percent: number): string => {
    const type = typePercent || getTypeByPercent(percent);
    const { text, bg } = getColorByType(type, theme);
    const icon = getArrowIcon(type);

    return `
      <span style="
        display:inline-flex;
        align-items:center;
        gap:4px;
        background:${bg};
        color:${text};
        padding:3px 6px;
        border-radius:6px;
        font-weight:${b4Medium.fontWeight};
        font-size:${b4Medium.fontSize};
        line-height:${b4Medium.lineHeight};
      ">
        ${
          type !== 'grey' && type !== 'blue'
            ? `
          <span style="
            width:9px;
            height:9px;
            background-color:${text};
            -webkit-mask-image:${icon};
            mask-image:${icon};
            -webkit-mask-size:contain;
            mask-size:contain;
            -webkit-mask-repeat:no-repeat;
            mask-repeat:no-repeat;
          "></span>`
            : ''
        }
        ${Math.abs(percent)}%
      </span>
    `;
  };

  const TooltipChartStyle = {
    container: `
      padding:12px 10px;
      background:white;
      border-radius:${borderRadius};
      box-shadow:${tooltipShadow};
    `,
    header: `
      font-weight:${t2SemiBold.fontWeight};
      font-size:${t2SemiBold.fontSize};
      line-height:${t2SemiBold.lineHeight};
      border-bottom:1px solid #DFDFDF;
      padding-bottom:8px;
      margin-bottom:8px;
    `,
    item: `
      display:flex;
      align-items:center;
      gap:8px;
      margin-bottom:4px;
      font-weight:${b4Medium.fontWeight};
      font-size:${b4Medium.fontSize};
      line-height:${b4Medium.lineHeight};
      color:${theme.palette.neutral[100]};
    `,
    compareContainer: `
      font-weight:${b4Medium.fontWeight};
      font-size:${b4Medium.fontSize};
      line-height:${b4Medium.lineHeight};
      color:${theme.palette.neutral[100]};
      margin-top:6px;
      display:flex;
      align-items:center;
      gap:4px;
      text-align:left;
    `,
  };

  return `
    <div style="${TooltipChartStyle.container}">

      ${title ? `<div style="${TooltipChartStyle.header}">${title}</div>` : ''}

      ${items
        .map(
          (i) => `
        <div style="${TooltipChartStyle.item}">
          <span style="
            display:${legend ? 'inline-block' : 'none'};
            width:9px;
            height:9px;
            border-radius:50%;
            background:${i.color};
          "></span>

          ${i.label}: ${formatValueByType(i.value, i.format ?? 'number')}${i.suffix ?? ''}

          ${
            i.percent !== undefined
              ? `
              <div style="${TooltipChartStyle.compareContainer}">
                ${buildPercentageChip(i.percent)}
              </div>`
              : ''
          }
        </div>
      `
        )
        .join('')}

      ${
        comparePercent !== undefined
          ? `
        <div style="${TooltipChartStyle.compareContainer}">
          ${buildPercentageChip(comparePercent)}
          ${labelCompare}
        </div>
      `
          : ''
      }
    </div>
  `;
};
