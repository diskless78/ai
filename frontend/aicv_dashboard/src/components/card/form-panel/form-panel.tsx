import { Box, Divider, Typography } from '@mui/material';
import { StyledFormPanel } from './styles';
import type { FormPanelProps } from './types';
import Row from 'src/components/common/row';
import Column from 'src/components/common/column';
import FormError from 'src/components/common/form-error';
import { pxToRem } from 'src/theme/styles';

export default function FormPanel({
  title,
  children,
  action,
  variant = 'default',
  messageError,
  ...boxProps
}: FormPanelProps) {
  return (
    <StyledFormPanel
      ownerState={{ variant, hasError: !!messageError }}
      {...boxProps}
    >
      <Column className='MuiFormPanelHeader-root'>
        <Row justifyContent='space-between'>
          <Typography variant='h4' color='purple.80'>
            {title}
          </Typography>
          {action && action}
        </Row>
        <Divider sx={{ color: 'neutral.30', width: '100%' }} />
      </Column>
      <Box className='MuiFormPanelContent-root'>
        {children}
        {messageError && (
          <Box mt={pxToRem(20)}>
            <FormError message={messageError} />
          </Box>
        )}
      </Box>
    </StyledFormPanel>
  );
}
