import React from 'react';
import {
  Box,
  Modal,
  Typography,
  Divider,
  TextField,
  useTheme,
} from '@mui/material';
import type { ColorMatchData } from '../../product/color-check/color-check-view';
import Row from 'src/components/common/row';
import Column from 'src/components/common/column';
import SizedBox from 'src/components/common/sized-box';
import BaseImage from 'src/components/image/image-network/base-image';
import { pxToRem } from 'src/theme/styles';
import { DifferenceScore } from './difference-score';
import BaseButton from 'src/components/button/base-button/base-button';
import OverlayErrorBox from './overlay-error-box';
import { useLanguage } from 'src/i18n/i18n';

interface ProductCompareModalProps {
  open: boolean;
  data: ColorMatchData | null;
  onClose: () => void;
}

export const ProductCompareModal: React.FC<ProductCompareModalProps> = ({
  open,
  data,
  onClose,
}) => {
  const lang = useLanguage();

  const handleClose = (
    _event: unknown,
    reason?: 'backdropClick' | 'escapeKeyDown'
  ) => {
    if (reason === 'backdropClick') return;
    onClose();
  };

  const handleConfirm = () => {
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 1000,
          bgcolor: 'white',
          borderRadius: pxToRem(16),
          boxShadow: 24,
          padding: `${pxToRem(15)} ${pxToRem(20)} ${pxToRem(22)} ${pxToRem(20)}`,
          outline: 'none',
        }}
      >
        <Column>
          <Row gap={pxToRem(32)}>
            <Column flex={1}>
              <Row gap={pxToRem(24)}>
                <Column>
                  <Typography variant='h4' color='purple.90'>
                    {lang('ColorCheck.CapturedImage')}
                  </Typography>
                  <SizedBox height={8} />
                  <BaseImage
                    borderRadius={6}
                    src={data?.image_src ?? ''}
                    aspectRatio={'16/9'}
                    overlay={
                      <OverlayErrorBox
                        data={data?.norm_diff ?? []}
                        threshold_lv1={data?.threshold_lv1 ?? 0}
                        threshold_lv2={data?.threshold_lv2 ?? 0}
                        action={data?.action ?? ''}
                      />
                    }
                  />
                </Column>
                <Column>
                  <Typography variant='h4' color='purple.90'>
                    {lang('ColorCheck.SampleProduct')}
                  </Typography>
                  <SizedBox height={8} />
                  <BaseImage
                    borderRadius={6}
                    src={data?.image_match_src ?? ''}
                    aspectRatio={'16/9'}
                    // objectFit='contain'
                  />
                </Column>
              </Row>

              <SizedBox height={20} />

              <Row gap={pxToRem(24)}>
                <Column
                  flex={1}
                  sx={{
                    borderRadius: 2,
                  }}
                >
                  <Row
                    justifyContent='space-between'
                    alignItems='center'
                    paddingBlock={pxToRem(16)}
                  >
                    <Typography variant='t3Bold' color='neutral.100'>
                      Frame ID
                    </Typography>
                    <Typography variant='t3SemiBold' color='neutral.100'>
                      {data?.frame_id}
                    </Typography>
                  </Row>
                  <Divider sx={{ color: 'neutral.20' }} />

                  <Row
                    justifyContent='space-between'
                    alignItems='center'
                    paddingBlock={pxToRem(16)}
                  >
                    <Typography variant='t3Bold' color='neutral.100'>
                      {lang('ColorCheck.Time')}
                    </Typography>
                    <Typography variant='t3SemiBold' color='neutral.100'>
                      {data?.date_time}
                    </Typography>
                  </Row>
                  <Divider sx={{ color: 'neutral.20' }} />

                  <Row
                    justifyContent='space-between'
                    alignItems='center'
                    paddingBlock={pxToRem(16)}
                  >
                    <Typography variant='t3Bold' color='neutral.100'>
                      {lang('ColorCheck.ProductName')}
                    </Typography>
                    <Typography variant='t3SemiBold' color='neutral.100'>
                      {data?.product_code}
                    </Typography>
                  </Row>
                  <Divider sx={{ color: 'neutral.20' }} />

                  <Row
                    justifyContent='space-between'
                    alignItems='center'
                    paddingBlock={pxToRem(16)}
                  >
                    <Typography variant='t3Bold' color='neutral.100'>
                      {lang('ColorCheck.SKU')}
                    </Typography>
                    <Typography variant='t3SemiBold' color='neutral.100'>
                      {data?.product_code}
                    </Typography>
                  </Row>
                  <Divider sx={{ color: 'neutral.20' }} />

                  {/* <Row
                    justifyContent='space-between'
                    alignItems='center'
                    paddingBlock={pxToRem(10.5)}
                  >
                    <Typography variant='t3Bold' color='neutral.100'>
                      Kết quả
                    </Typography>
                    <CheckStatus action={data?.action ?? ''} />
                  </Row>
                  <Divider sx={{ color: 'neutral.20' }} /> */}

                  <Row paddingTop={pxToRem(14)}>
                    <Typography variant='t3Bold' color='neutral.100' mb={1}>
                      {lang('ColorCheck.Note')}
                    </Typography>
                    <SizedBox width={21} />
                    <Box flex={1}>
                      <CustomInput data={data} />
                    </Box>
                  </Row>
                </Column>

                <Column flex={1}>
                  <DifferenceScore action={data?.action ?? ''} />
                </Column>
              </Row>

              <SizedBox height={25} />

              <BaseButton
                type='button'
                fullWidth
                size='medium'
                variant='contained'
                text={lang('ColorCheck.Confirm')}
                onClick={handleConfirm}
              />
            </Column>
          </Row>
        </Column>
      </Box>
    </Modal>
  );
};

const CustomInput = ({ data }: { data?: ColorMatchData | null }) => {
  const theme = useTheme();
  const lang = useLanguage();

  return (
    <TextField
      fullWidth
      multiline
      minRows={3}
      variant='outlined'
      defaultValue={
        data?.action === 'pass'
          ? lang('ColorCheck.ResultPass')
          : data?.action === 'recheck'
            ? lang('ColorCheck.ResultReCheck')
            : lang('ColorCheck.ResultFail')
      }
      placeholder={lang('ColorCheck.Note')}
      slotProps={{
        input: {
          style: {
            paddingBlock: pxToRem(8),
            paddingInline: pxToRem(16),
            backgroundColor: theme.palette.neutral[10],
            ...theme.typography.t3SemiBold,
            color: theme.palette.neutral[100],
          },
        },
      }}
      sx={{
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
          {
            border: 'none',
          },
        paddingY: '4px',
      }}
    />
  );
};
