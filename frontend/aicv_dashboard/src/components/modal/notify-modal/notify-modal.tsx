import { Box, Modal, Typography } from '@mui/material';
import Column from 'src/components/common/column';
import Row from 'src/components/common/row';
import BaseButton from 'src/components/button/base-button/base-button';
import { pxToRem } from 'src/theme/styles';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { notifySelector, useAppDispatch, useAppSelector } from '../../../store';
import { setCloseNotifyModal } from 'src/store/slices/notify.slice';
import BaseIcon from 'src/components/svg/base-icon/base-icon';
import { StyledNotifyModal } from './styles';

export default function NotifyModal() {
  const dispatch = useAppDispatch();

  const { notifyModal } = useAppSelector(notifySelector);

  const getIconConfig = () => {
    switch (notifyModal.type) {
      case 'delete':
        return {
          icon: ASSET_CONSTANT.SVG.IconBoldTrash,
          bgColor: 'red.10',
        };
      case 'confirm':
        return {
          icon: ASSET_CONSTANT.SVG.IconBoldCircleInformation,
          bgColor: 'blue.10',
        };
      case 'caution':
        return {
          icon: ASSET_CONSTANT.SVG.IconBoldCircleInformation,
          bgColor: 'orange.10',
        };
      default:
        return {
          icon: ASSET_CONSTANT.SVG.IconBoldCircleInformation,
          bgColor: 'blue.10',
        };
    }
  };

  const getContentBgColor = () => {
    switch (notifyModal.type) {
      case 'delete':
        return 'red.10';
      case 'confirm':
        return 'blue.10';
      case 'caution':
        return 'orange.10';
      default:
        return 'blue.10';
    }
  };

  const iconConfig = getIconConfig();

  return (
    <Modal
      open={notifyModal.open}
      // onClose={() => dispatch(setCloseNotifyModal())}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& .MuiBackdrop-root': {
          backgroundColor: '#00000033!important',
          //backdropFilter: 'blur(12px)',
        },
      }}
    >
      <StyledNotifyModal ownerState={{ type: notifyModal.type }}>
        <Column padding={pxToRem(12)} gap={pxToRem(12)}>
          <Row gap={pxToRem(8)} alignItems='center'>
            <Box
              sx={{
                width: pxToRem(32),
                height: pxToRem(32),
                borderRadius: '50%',
                backgroundColor: iconConfig.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Box>
                <BaseIcon src={iconConfig.icon} size={24} color='red' />
              </Box>
            </Box>
            <Typography variant='t2SemiBold' color='neutral.100'>
              {notifyModal.title}
            </Typography>
          </Row>
          <Box
            sx={{
              backgroundColor: getContentBgColor(),
              padding: pxToRem(12),
              borderRadius: pxToRem(12),
              gap: pxToRem(10),
            }}
          >
            <Typography variant='b3Medium' color='neutral.90'>
              {notifyModal.content}
            </Typography>
          </Box>
        </Column>
        <Row
          padding={`${pxToRem(12)} ${pxToRem(16)}`}
          gap={pxToRem(8)}
          sx={{
            backgroundColor: 'common.neutralsecondary',
            borderTop: (theme) => `1px solid ${theme.palette.neutral[20]}`,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <BaseButton
            width={'20%'}
            size='small'
            variant='outlined'
            text='Cancel'
            mode='light'
            onClick={() => dispatch(setCloseNotifyModal())}
          />
          <BaseButton
            width={'40%'}
            size='small'
            variant='contained'
            color={notifyModal.type === 'delete' ? 'red' : 'primary'}
            text={notifyModal.textConfirm || 'Done'}
            onClick={() => {
              dispatch(setCloseNotifyModal());
              notifyModal.onConfirm && notifyModal.onConfirm();
            }}
          />
        </Row>
      </StyledNotifyModal>
    </Modal>
  );
}
