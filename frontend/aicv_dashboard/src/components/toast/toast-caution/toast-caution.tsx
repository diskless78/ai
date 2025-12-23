import { Snackbar, useTheme, type AlertColor, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { BehaviorSubject } from 'rxjs';
import { useLanguage } from 'src/i18n/i18n';
import { pxToRem } from 'src/theme/styles';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { StyledToastCaution } from './styles';
import Column from '../../common/column';
import Row from 'src/components/common/row';
import { SvgColor } from 'src/components/svg/svg-color';
import BaseAvatar from 'src/components/data-display/base-avatar/base-avatar';
import { fDate } from 'src/utils/format-time';
import { urlImage } from 'src/utils/common.utils';

interface INotification {
  data: any;
  // title?: string;
  // message: string;
  type?: AlertColor;
  // translate?: boolean;
}

const handleErrorSubject = new BehaviorSubject<INotification | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const toggleCaution = (value: INotification) => {
  handleErrorSubject.next(value);
};

export default function ToastCaution() {
  const lang = useLanguage();
  const theme = useTheme();
  const [notify, setNotify] = useState<INotification & { isOpen: boolean }>({
    isOpen: false,
    type: 'success',
    data: {} as any,
  });

  useEffect(() => {
    const subscribe = handleErrorSubject.subscribe((noti) => {
      console.log('noti: ', noti);
      if (noti && noti.data) {
        setNotify({
          data: noti.data,
          isOpen: true,
          type: noti.type || 'success',
        });
      }
    });
    return () => {
      subscribe.unsubscribe();
    };
  }, [lang]);

  const handleClose = () => {
    setNotify((pre) => ({
      ...pre,
      isOpen: false,
    }));
  };

  return (
    <Snackbar
      open={notify.isOpen}
      autoHideDuration={5000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      onClose={handleClose}
    >
      <StyledToastCaution
        severity={notify.type}
        onClose={handleClose}
        variant='filled'
      >
        <Column gap={pxToRem(12)}>
          <Row alignItems='center' gap={pxToRem(6)}>
            <Row
              width={32}
              height={32}
              bgcolor={
                notify.type === 'error'
                  ? theme.palette.yellow[10]
                  : theme.palette.green[10]
              }
              borderRadius='50%'
              alignItems='center'
              justifyContent='center'
            >
              <SvgColor
                src={
                  notify.type === 'error'
                    ? ASSET_CONSTANT.SVG.IconBoldCaution
                    : ASSET_CONSTANT.SVG.IconBoldCircleCheck
                }
                width={24}
                height={24}
                color={
                  notify.type === 'error'
                    ? theme.palette.orange[70]
                    : theme.palette.green[80]
                }
              />
            </Row>
            <Typography variant='t2SemiBold'>
              {renderTitle(notify.type)}
            </Typography>
          </Row>

          <Row
            gap={pxToRem(12)}
            padding={pxToRem(12)}
            borderRadius={pxToRem(12)}
            bgcolor={notify.type === 'error' ? '#D0570314' : '#1AB1791A'}
            width={'100%'}
            flex={1}
          >
            {notify.data.face_id ? (
              <>
                <BaseAvatar
                  size={44}
                  src={urlImage(notify.data.user?.avatar)}
                />
                <Column gap={pxToRem(2)}>
                  <Typography variant='t2Bold'>
                    {notify.data.user?.full_name} {' - '}
                    {notify.data.user?.employee_id}
                  </Typography>
                  <Typography variant='b2Medium'>
                    {notify.data.reason}
                  </Typography>
                </Column>
              </>
            ) : (
              <>
                <Typography variant='b3Medium'>
                  <Typography variant='b2Medium'>Stranger detected </Typography>
                  at {fDate(notify.data.timestamp, 'HH:mm:ss, DD/MM/YYYY')}
                </Typography>
              </>
            )}
          </Row>
        </Column>
      </StyledToastCaution>
    </Snackbar>
  );
}

const renderTitle = (type?: AlertColor | undefined): string => {
  switch (type) {
    case 'error':
      return 'Access denied';
    default:
      return 'Access granted';
  }
};
