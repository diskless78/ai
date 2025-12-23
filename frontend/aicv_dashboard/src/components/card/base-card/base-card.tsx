import { Box, Typography, type BoxProps } from '@mui/material';
import { pxToRem } from 'src/theme/styles';
import Row from 'src/components/common/row';
import type { BaseCardProps } from './type';
import BaseTooltip from 'src/components/tooltip/base-tooltip/base-tooltip';

//------------------------------------------------------------------

export function BaseCard({
  title,
  children,
  size = 'small',
  variant = 't1SemiBold',
  ...props
}: BaseCardProps & BoxProps) {
  return (
    <Box
      width='100%'
      height='100%'
      display='flex'
      flexDirection='column'
      border={size === 'small' ? 'none' : '1px solid'}
      borderColor={size === 'small' ? 'neutral.0' : 'neutral.20'}
      borderRadius={pxToRem(8)}
      {...props}
    >
      <Row
        gap={pxToRem(6)}
        alignItems='center'
        sx={{
          minHeight: pxToRem(size === 'small' ? 40 : 46),
          padding: `${pxToRem(0)} ${pxToRem(size === 'small' ? 8 : 10)} ${pxToRem(0)} ${pxToRem(size === 'small' ? 12 : 14)}`,
          backgroundColor: size === 'small' ? 'neutral.20' : 'neutral.10',
          borderTopLeftRadius: pxToRem(8),
          borderTopRightRadius: pxToRem(8),
        }}
      >
        <Typography
          variant={variant}
          flex={1}
          textOverflow='ellipsis'
          overflow='hidden'
          whiteSpace='nowrap'
        >
          {title}
        </Typography>
        <BaseTooltip title='' />
      </Row>
      {children}
    </Box>
  );
}
