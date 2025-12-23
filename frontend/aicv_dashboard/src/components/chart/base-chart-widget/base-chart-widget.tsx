import React, { type ReactNode } from 'react';
import { Typography } from '@mui/material';
import Row from 'src/components/common/row';
import Column from 'src/components/common/column';
import SizedBox from 'src/components/common/sized-box';
import BaseTooltip from 'src/components/tooltip/base-tooltip/base-tooltip';
import { pxToRem } from 'src/theme/styles';
import BaseLegend from '../base-legend';

export interface LegendItem {
  type: 'bar' | 'line';
  color: string;
  title: string;
}

interface BaseChartWidgetProps {
  title: string;
  height?: number;
  tooltipText?: string;
  legends?: LegendItem[];
  headerControls?: ReactNode;
  chartTitle?: ReactNode;
  children: ReactNode;
  chartTitleSpacing?: number;
  chartPaddingX?: number;
  headerPadding?: string;
}

const BaseChartWidget: React.FC<BaseChartWidgetProps> = ({
  title,
  height = 382,
  tooltipText = '',
  legends = [],
  headerControls,
  chartTitle,
  children,
  chartTitleSpacing = 0,
  chartPaddingX = 10,
  headerPadding = `${pxToRem(5)} ${pxToRem(4)}`,
}) => {
  return (
    <Column justifyContent='space-between' height={height}>
      {/* Header Section */}
      <Column>
        <Row
          alignItems='center'
          justifyContent='space-between'
          padding={headerPadding}
        >
          {title && (
            <Row alignItems='center' gap={pxToRem(6)}>
              <Typography variant='t1SemiBold' color='neutral.100'>
                {title}
              </Typography>
              <BaseTooltip title={tooltipText} size='small' />
            </Row>
          )}
          {headerControls && <Row gap={pxToRem(8)}>{headerControls}</Row>}
        </Row>

        {legends.length > 0 && (
          <Row alignItems='center' gap={pxToRem(8)} height={pxToRem(28)}>
            {legends.map((legend, index) => {
              return (
                <BaseLegend
                  key={`legend-${index}`}
                  type={legend.type}
                  color={legend.color}
                  title={legend.title}
                />
              );
            })}
          </Row>
        )}
      </Column>

      {/* Chart Container */}
      <Column px={pxToRem(chartPaddingX)}>
        {/* Chart Title (Y-axis label) */}
        {chartTitle}

        {/* Spacing between chart title and chart */}
        {chartTitle && chartTitleSpacing > 0 && (
          <SizedBox height={chartTitleSpacing} />
        )}

        {/* Actual Chart */}
        {children}
      </Column>
    </Column>
  );
};

export default BaseChartWidget;
