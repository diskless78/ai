import {
  type Theme,
  Snackbar,
  useTheme,
  type AlertColor,
  Typography,
  Box,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { BehaviorSubject } from 'rxjs';
import { useLanguage } from 'src/i18n/i18n';
import { pxToRem } from 'src/theme/styles';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { StyledToast } from './styles';
import Column from '../../common/column';
import BaseIcon from 'src/components/svg/base-icon/base-icon';

interface INotification {
  title?: string;
  message: string;
  type?: AlertColor;
  translate?: boolean;
}

const handleErrorSubject = new BehaviorSubject<INotification | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const toggleMessage = (value: INotification) => {
  handleErrorSubject.next(value);
};

export default function Toast() {
  const lang = useLanguage();
  const theme = useTheme();
  const [notify, setNotify] = useState<INotification & { isOpen: boolean }>({
    isOpen: false,
    message: '',
    type: 'success',
    translate: false,
  });

  useEffect(() => {
    const subscribe = handleErrorSubject.subscribe((noti) => {
      if (noti && noti.message) {
        setNotify({
          title: noti.title || getDefaultTitle(noti.type),
          isOpen: true,
          message: noti.translate === true ? lang(noti.message) : noti.message,
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
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClose={handleClose}
    >
      <StyledToast
        ownerState={{ color: notify.type }}
        severity={notify.type}
        onClose={handleClose}
        variant='filled'
        icon={<ToastIcon type={notify.type} />}
      >
        <Column gap={pxToRem(2)}>
          <Typography
            variant='t3SemiBold'
            color={colorTitle(theme, notify.type)}
          >
            {notify.title}
          </Typography>
          <Typography variant='b4Medium' color='neutral.0'>
            {notify.message}
          </Typography>
        </Column>
      </StyledToast>
    </Snackbar>
  );
}

function ToastIcon({ type }: { type?: AlertColor }) {
  let iconSrc = ASSET_CONSTANT.SVG.IconBoldCircleCheck;

  if (type === 'error') {
    iconSrc = ASSET_CONSTANT.SVG.IconLinearCloseMultiply;
  } else if (type === 'warning') {
    iconSrc = ASSET_CONSTANT.SVG.IconLinearCaution;
  } else if (type === 'info') {
    iconSrc = ASSET_CONSTANT.SVG.IconLinearCircleInformation;
  }

  return (
    <Box>
      <BaseIcon src={iconSrc} size={24} />
    </Box>
  );
}

function getDefaultTitle(type?: AlertColor): string {
  switch (type) {
    case 'error':
      return 'Error Occurred';
    case 'warning':
      return 'Warning';
    case 'info':
      return 'Information';
    default:
      return 'Saved Successfully';
  }
}

const colorTitle = (theme: Theme, type?: AlertColor | undefined): string => {
  switch (type) {
    case 'error':
      return theme.palette.red[50];
    case 'warning':
      return theme.palette.orange[60];
    case 'info':
      return theme.palette.blue[30];
    default:
      return theme.palette.green[60];
  }
};
