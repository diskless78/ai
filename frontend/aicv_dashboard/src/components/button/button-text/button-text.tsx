import { Typography } from '@mui/material';
import { pxToRem } from 'src/theme/styles';
import Row from 'src/components/common/row';
import { StyledButtonText } from './styles';
import type { ButtonTextProps } from './types';

export default function ButtonText({
  text,
  textColor = 'text.heading',
  onClick,
  iconLeft,
  iconRight,
}: ButtonTextProps) {
  return (
    <StyledButtonText onClick={onClick}>
      <Row gap={pxToRem(8)} alignItems='end'>
        {iconLeft}
        <Typography variant='body1' color={textColor}>
          {text}
        </Typography>
        {iconRight}
      </Row>
    </StyledButtonText>
  );
}
