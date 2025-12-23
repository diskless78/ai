import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  Stack,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { ColorEditor } from 'src/components/color-editor';
import { DashboardContent } from 'src/layouts/dashboard/main';
import Column from 'src/components/common/column';
import { pxToRem } from 'src/theme/styles';
import { useColorPalette } from 'src/hooks/use-color-palette';
import colorPaletteData from './color-palette.json';
import { COLOR_PALETTE_CONSTANTS, COLOR_PALETTE_MESSAGES } from './constants';
import BaseButton from 'src/components/button/base-button/base-button';
import BaseIcon from 'src/components/svg/base-icon/base-icon';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';

const { COLOR_GROUPS } = COLOR_PALETTE_CONSTANTS;
const { SUCCESS, ERROR, INFO } = COLOR_PALETTE_MESSAGES;

const ColorPaletteView: React.FC = () => {
  const {
    palette,
    isLoading,
    isSaving,
    hasUnsavedChanges,
    error,
    savePalette,
    resetPalette,
    exportPalette,
    updateColor,
  } = useColorPalette({
    defaultPalette: colorPaletteData,
    enableFirebaseSync: true,
  });

  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSnackbar = (
    message: string,
    severity: 'success' | 'error' | 'info'
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSave = async () => {
    try {
      await savePalette();
      showSnackbar(SUCCESS.SAVE, 'success');
    } catch {
      showSnackbar(ERROR.SAVE, 'error');
    }
  };

  const handleReset = async () => {
    try {
      await resetPalette();
      showSnackbar(SUCCESS.RESET, 'info');
    } catch {
      showSnackbar(ERROR.RESET, 'error');
    }
  };

  const handleExport = () => {
    exportPalette();
    showSnackbar(SUCCESS.EXPORT, 'success');
  };

  if (isLoading && Object.keys(palette).length === 0) {
    return (
      <DashboardContent disablePadding maxWidth={false}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            gap: pxToRem(16),
          }}
        >
          <CircularProgress size={32} />
          <Typography variant='body1' color='text.secondary'>
            Loading color palette...
          </Typography>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent disablePadding maxWidth={false}>
      <Column
        padding={`${pxToRem(16)} ${pxToRem(16)} ${pxToRem(20)} ${pxToRem(16)}`}
        gap={pxToRem(20)}
      >
        <Box sx={{ maxWidth: pxToRem(1400), margin: '0 auto', width: '100%' }}>
          {error && (
            <Alert
              severity='warning'
              icon={<AlertCircle size={20} />}
              sx={{ mb: pxToRem(16) }}
            >
              {error}
            </Alert>
          )}

          {hasUnsavedChanges && (
            <Alert
              severity='info'
              icon={<AlertCircle size={20} />}
              sx={{ mb: pxToRem(16) }}
            >
              {INFO.UNSAVED_CHANGES}
            </Alert>
          )}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: pxToRem(32),
            }}
          >
            <Typography variant='h3'>Color Palette Configuration</Typography>
            <Stack direction='row' spacing={pxToRem(12)}>
              <BaseButton
                text='Reset'
                size='medium'
                color='white'
                variant='outlined'
                disabled={!hasUnsavedChanges || isLoading}
                onClick={handleReset}
                iconLeft={<RefreshCw size={18} />}
              />

              <BaseButton
                text='Export JSON'
                size='medium'
                color='white'
                variant='outlined'
                onClick={handleExport}
                iconLeft={
                  <BaseIcon
                    size={20}
                    src={ASSET_CONSTANT.SVG.IconLinearDownload}
                    color='purple.80'
                  />
                }
              />
              <BaseButton
                text='Save to Firebase'
                size='medium'
                color='primary'
                loading={isSaving}
                disabled={!hasUnsavedChanges || isSaving}
                onClick={handleSave}
              />
            </Stack>
          </Box>

          <Stack spacing={pxToRem(24)}>
            {COLOR_GROUPS.map((group) => (
              <ColorEditor
                key={group.key}
                title={group.title}
                colors={palette[group.key] || []}
                onColorChange={(index, mode, newColor) =>
                  updateColor(group.key, index, mode, newColor)
                }
              />
            ))}
          </Stack>

          <Box
            sx={{
              mt: pxToRem(32),
              p: pxToRem(20),
              bgcolor: 'background.paper',
              borderRadius: pxToRem(12),
              boxShadow: 1,
            }}
          >
            <Typography
              variant='subtitle1'
              sx={{
                fontWeight: 600,
                mb: pxToRem(12),
              }}
            >
              Hướng dẫn sử dụng:
            </Typography>
            <List
              sx={{
                listStyleType: 'disc',
                pl: pxToRem(20),
                '& .MuiListItem-root': {
                  display: 'list-item',
                  p: 0,
                  mb: pxToRem(4),
                },
              }}
            >
              <ListItem>
                <Typography variant='body2' color='text.secondary'>
                  Di chuột qua mỗi dòng màu để hiện nút{' '}
                  <Box component='strong' sx={{ fontWeight: 600 }}>
                    Edit
                  </Box>
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant='body2' color='text.secondary'>
                  Click vào nút{' '}
                  <Box component='strong' sx={{ fontWeight: 600 }}>
                    Edit
                  </Box>{' '}
                  để chỉnh sửa mã màu
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant='body2' color='text.secondary'>
                  Nhập mã màu hex (ví dụ: #FF0000)
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant='body2' color='text.secondary'>
                  Nhấn{' '}
                  <Box component='strong' sx={{ fontWeight: 600 }}>
                    Enter
                  </Box>{' '}
                  để lưu hoặc{' '}
                  <Box component='strong' sx={{ fontWeight: 600 }}>
                    Esc
                  </Box>{' '}
                  để hủy
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant='body2' color='text.secondary'>
                  Click{' '}
                  <Box component='strong' sx={{ fontWeight: 600 }}>
                    Save to Firebase
                  </Box>{' '}
                  để đồng bộ với tất cả devices (real-time sync)
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant='body2' color='text.secondary'>
                  Click{' '}
                  <Box component='strong' sx={{ fontWeight: 600 }}>
                    Export JSON
                  </Box>{' '}
                  để tải xuống file backup
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant='body2' color='text.secondary'>
                  Mở nhiều tabs/devices → Thay đổi sẽ đồng bộ tức thì! 🔄
                </Typography>
              </ListItem>
            </List>
          </Box>
        </Box>
      </Column>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          icon={
            snackbar.severity === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )
          }
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
};

export default ColorPaletteView;
