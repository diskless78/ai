import React from 'react';
import { Typography } from '@mui/material';
import Row from 'src/components/common/row';
import { pxToRem } from 'src/theme/styles';

interface BaseChartTitleProps {
  title: string;
  textAlign?: 'left' | 'center' | 'right';
  paddingX?: number;
  variant?: 'b4Medium' | 'b4Regular' | 't1SemiBold';
  color?: string;
}

const BaseChartTitle: React.FC<BaseChartTitleProps> = ({
  title,
  textAlign = 'center',
  paddingX = 10,
  variant = 'b4Medium',
  color = 'neutral.100',
}) => {
  return (
    <Row justifyContent='space-between' px={pxToRem(paddingX)}>
      <Typography
        variant={variant}
        color={color}
        textAlign={textAlign}
        sx={{ whiteSpace: 'pre-line' }}
      >
        {title}
      </Typography>
    </Row>
  );
};

export default BaseChartTitle;
