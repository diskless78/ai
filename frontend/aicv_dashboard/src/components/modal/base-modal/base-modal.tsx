import { Box, Modal, Divider, useTheme, Typography } from '@mui/material';
import { pxToRem } from 'src/theme/styles';
import Row from 'src/components/common/row';
import ButtonIcon from 'src/components/button/button-icon/button-icon';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import BaseIcon from 'src/components/svg/base-icon/base-icon';
import Column from '../../common/column';
import type { BaseModalProps } from './types';

export default function BaseModal({
  title,
  open,
  children,
  height = 0,
  width = 0,
  onClose,
}: BaseModalProps) {
  const theme = useTheme();

  return (
    <Modal
      component='div'
      open={open ?? false}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box
        sx={{
          width: width > 0 ? pxToRem(width) : pxToRem(700),
          height: height > 0 ? pxToRem(height) : pxToRem(600),
          flexDirection: 'column',
          backgroundColor: 'common.white',
          borderRadius: pxToRem(12),
          border: `4px solid ${theme.palette.common.white}`,
          outline: 'none',
        }}
        role='presentation'
      >
        <Column sx={{ height: '100%' }}>
          <Column
            sx={{
              borderTopLeftRadius: pxToRem(10),
              borderTopRightRadius: pxToRem(10),
              padding: `${pxToRem(19)} ${pxToRem(24)}`,
              background:
                'linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, rgba(141, 44, 231, 0.14) 100%)',
            }}
          >
            <Row justifyContent='space-between' alignItems='center'>
              <Typography variant='h3' color={theme.palette.neutral[100]}>
                {title}
              </Typography>
              <ButtonIcon
                size='small'
                shape='square'
                color='grey'
                onClick={onClose}
              >
                <BaseIcon
                  size={24}
                  src={ASSET_CONSTANT.SVG.IconLinearCloseMultiply}
                  color='brand.secondary'
                />
              </ButtonIcon>
            </Row>
          </Column>
          <Divider sx={{ color: 'grey.200' }} />
          <Column sx={{ height: 'calc(100% - 68px)', overflow: 'hidden' }}>
            {children}
          </Column>
        </Column>
      </Box>
    </Modal>
  );
}
