import { Box, Drawer, Divider, useTheme, Typography } from '@mui/material';
import { pxToRem } from 'src/theme/styles';
import type { BaseDrawerProps } from './types';
import Column from '../../common/column';
import SizedBox from '../../common/sized-box';

export default function BaseDrawer({
  title,
  open,
  children,
  width = 0,
}: BaseDrawerProps) {
  const theme = useTheme();

  return (
    <Drawer
      anchor='right'
      open={open}
      ModalProps={{
        keepMounted: false, // Ensure the Drawer cleans up properly
        // onBackdropClick: () => {
        //   // Optional: Handle backdrop click logic
        // },
      }}
      slotProps={{
        paper: {
          sx: {
            overflow: 'visible',
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      <Box
        sx={{
          width: width > 0 ? pxToRem(width) : pxToRem(700),
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          backgroundColor: 'background.sectionprimary',
        }}
        role='presentation'
      >
        <Column>
          <Column
            padding={`${pxToRem(20)} ${pxToRem(14)} ${pxToRem(0)} ${pxToRem(20)}`}
            height={pxToRem(69)}
          >
            <SizedBox height={12} />
            <Typography variant='h3' color={theme.palette.neutral[100]}>
              {title}
            </Typography>
            <SizedBox height={12} />
            <Divider sx={{ color: 'neutral.30' }} />
          </Column>
          <Column>{children}</Column>
        </Column>
      </Box>
    </Drawer>
  );
}
