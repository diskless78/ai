import { Box, Typography } from '@mui/material';
import Column from 'src/components/common/column';
import Row from 'src/components/common/row';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { pxToRem } from 'src/theme/styles';
import DateTimeNow from '../../view/components/date-time-now';
import BaseTable from 'src/components/table/base-table/base-table';
import { useEffect, useState } from 'react';
import SizedBox from 'src/components/common/sized-box';
import InputSelect from 'src/components/input/input-select/input-select';
import ButtonTheme from 'src/components/button/button-theme/button-theme';
import BaseButton from 'src/components/button/base-button/base-button';
import { ProductCompareModal } from '../../view/components/product-compare-modal';
import { CheckStatus } from '../../view/components/check-status';
import ScanModeToggle, {
  type ScanMode,
} from '../../view/components/scan-mode-toggle';
import { SvgColor } from 'src/components/svg/svg-color';
import CameraPreviewContainer from 'src/components/image/camera-preview/camera-preview-container';
import ProductDetailCard from '../../view/components/product-detail-card';
import { Logo } from 'src/components/logo';
import BaseImage from 'src/components/image/image-network/base-image';
import { useLanguage } from 'src/i18n/i18n';
import LanguageToggle from 'src/components/controls/language-toggle';
import { mockSampleProducts, type SampleProduct } from './_data';

export type ColorData = {
  width: number;
  height: number;
  area: number;
  rgb: {
    red: number[];
    green: number[];
    blue: number[];
    gray: number[];
    range: number[];
  };
  cielab: {
    l: number[];
    a: number[];
    b: number[];
    range: [number, number];
  };
};

export type ResponseData = {
  frame_current: any;
  colormatch: ColorMatchData;
  frame_timestamp_str: string;
  frame_id: string;
};

export type ColorMatchData = {
  color: ColorData;
  score: number;
  action: string;
  first_decision: string;
  check_jpeg: number[];
  match_jpeg: number[];
  image_src: string;
  image_match_src: string;
  best_match: string;
  norm_diff: number[][];
  threshold_lv1: number;
  threshold_lv2: number;

  date_time: string;
  product_code: string;
  frame_id: string;
};

export function ColorCheckView() {
  const BASE_URL = 'http://192.168.1.45:8000';
  const CAM_ID = 'cam_01';
  const lang = useLanguage();
  const [tableData, setTableData] = useState<ColorMatchData[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [selectItem, setSelectItem] = useState<ColorMatchData | null>(null);
  const [scanMode, setScanMode] = useState<ScanMode>('auto');
  const [sampleProducts] = useState<SampleProduct[]>(mockSampleProducts);
  const [selectedProduct, setSelectedProduct] = useState<SampleProduct | null>(
    sampleProducts[0]
  );

  const handleCapture = async () => {
    // bạn có thể tái sử dụng cùng logic fetchChartData như phần auto poll
    await fetchChartData();
  };

  const fetchChartData = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/ckpt/ckpt_01/${CAM_ID}/json/pull`,
        { method: 'GET' }
      );
      if (!response.ok) {
        console.log('❌ Request failed:', response.statusText);
        return;
      }
      const data: ResponseData = await response.json();

      console.log('data.colormatch: ', data.colormatch);

      const uint8Array = new Uint8Array(data.colormatch.check_jpeg);
      const blob = new Blob([uint8Array], { type: 'image/jpeg' });
      const objectUrl = URL.createObjectURL(blob);

      const matchUint8Array = new Uint8Array(data.colormatch.match_jpeg);
      const matchBlob = new Blob([matchUint8Array], { type: 'image/jpeg' });
      const matchBobjectUrl = URL.createObjectURL(matchBlob);

      const date = new Date(data.frame_timestamp_str);
      const formatted = date
        .toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
        .replace(',', '');

      const productCode = getFileName(data.colormatch.best_match).toUpperCase();
      const frameId = data.frame_id.toUpperCase(); // getFrameId(data.frame_id).toUpperCase();

      setTableData((prev) => {
        const updated = [
          {
            ...data.colormatch,
            image_src: objectUrl,
            image_match_src: matchBobjectUrl,
            date_time: formatted,
            product_code: productCode,
            frame_id: frameId,
          },
          ...prev,
        ];

        return updated.length > 10 ? updated.slice(0, 10) : updated;
      });
    } catch (error) {
      console.log('Error fetching chart data:', error);
    }
  };

  // 🕐 Auto poll khi ở chế độ tự động
  useEffect(() => {
    if (scanMode !== 'auto') return;

    fetchChartData();
    const chartInterval = setInterval(fetchChartData, 3000);
    return () => clearInterval(chartInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanMode]);

  const getFileName = (path: string) => {
    if (!path) return '';
    return path?.replace(/\\/g, '/')?.split('/')?.pop()?.split('.')[0] || '';
  };

  return (
    <>
      <ProductCompareModal
        open={open}
        data={selectItem}
        onClose={() => setOpen(false)}
      />
      <DashboardContent disablePadding maxWidth={false}>
        <Column>
          <Row
            padding={`${pxToRem(16)} ${pxToRem(20)} ${pxToRem(16)} ${pxToRem(17)}`}
            justifyContent='space-between'
            borderBottom='1px solid'
            borderColor='neutral.20'
          >
            <Row gap={pxToRem(14)} alignItems='center'>
              <Logo width={149} height={38} />
              <ScanModeToggle value={scanMode} onChange={setScanMode} />
            </Row>
            <Row gap={pxToRem(12)} alignItems='center'>
              <LanguageToggle />
              <ButtonTheme size='small' />
              <DateTimeNow />
            </Row>
          </Row>

          <Column
            padding={`${pxToRem(20)} ${pxToRem(20)} ${pxToRem(35)} ${pxToRem(20)}`}
          >
            <Row gap={pxToRem(20)}>
              <Column sx={{ width: '60%' }}>
                <Row justifyContent='space-between' alignItems='center'>
                  <Column height={pxToRem(40)} justifyContent='center'>
                    <Typography variant='h2' color='purple.90'>
                      {lang('ColorCheck.ProductScanningScreen')}
                    </Typography>
                  </Column>
                  {scanMode !== 'auto' && (
                    <BaseButton
                      text={lang('ColorCheck.TapToCapture')}
                      size='small'
                      color='secondary'
                      onClick={handleCapture}
                      iconLeft={
                        <SvgColor
                          src={ASSET_CONSTANT.SVG.IconBoldCamera1}
                          width={20}
                          height={20}
                          color='neutral.80'
                        />
                      }
                    />
                  )}
                </Row>
                <SizedBox height={12} />

                <CameraPreviewContainer fps={15} autoPoll />
              </Column>

              <Column sx={{ width: '40%' }}>
                <Row justifyContent='space-between' alignItems='center'>
                  <Typography variant='h2' color='purple.90'>
                    {lang('ColorCheck.SampleProduct')}
                  </Typography>
                  <InputSelect
                    placeholder='Chọn sản phẩm đối chiếu'
                    width={pxToRem(280)}
                    value={selectedProduct?.id}
                    list={sampleProducts.map((item) => ({
                      id: item.id,
                      name: `${item.id} - ${item.productName}`,
                    }))}
                    onChangeValue={(value) => {
                      const product = sampleProducts.find(
                        (item) => item.id === value
                      );
                      setSelectedProduct(product || null);
                    }}
                  />
                </Row>
                <SizedBox height={12} />

                <Box sx={{ flex: 1 }}>
                  <ProductDetailCard
                    imageUrl={selectedProduct?.imageUrl || ''}
                    productCode={selectedProduct?.id || ''}
                    productName={selectedProduct?.productName || ''}
                    category={selectedProduct?.category || ''}
                    productType={selectedProduct?.type || ''}
                  />
                </Box>
              </Column>
            </Row>

            <SizedBox height={20} />
            <Column>
              <Typography variant='h3' color='purple.90'>
                {lang('ColorCheck.Activity')}
              </Typography>
              <SizedBox height={12} />
              <BaseTable<ColorMatchData>
                showIndex
                heightRow={60}
                placeholder={lang('ColorCheck.NoActivityYet')}
                headersTable={[
                  {
                    title: lang('ColorCheck.DateTime'),
                    field: 'date_time',
                    align: 'left',
                  },
                  {
                    title: lang('ColorCheck.CapturedImage'),
                    field: 'image_src',
                    align: 'center',
                    renderItem: (item) => (
                      <Row justifyContent='center' py={pxToRem(9)}>
                        <BaseImage
                          width={42}
                          height={42}
                          src={item.image_src}
                        />
                      </Row>
                    ),
                  },
                  {
                    title: lang('ColorCheck.SampleProduct'),
                    field: 'image_match_src',
                    align: 'center',
                    renderItem: (item) => (
                      <Row justifyContent='center' py={pxToRem(9)}>
                        <BaseImage
                          width={42}
                          height={42}
                          src={item.image_match_src}
                        />
                      </Row>
                    ),
                  },
                  {
                    title: lang('ColorCheck.Status'),
                    field: 'action',
                    align: 'left',
                    renderItem: (data) => {
                      return <CheckStatus action={data.action} />;
                    },
                  },
                  {
                    title: lang('ColorCheck.Score'),
                    field: 'score',
                    align: 'left',
                    renderItem: (data) => data.score.toFixed(1),
                  },
                  {
                    title: lang('ColorCheck.Note'),
                    field: 'action',
                    align: 'left',
                    renderItem: (data) => (
                      <Typography
                        variant='t3SemiBold'
                        color='neutral.100'
                        sx={{ whiteSpace: 'pre-wrap' }}
                      >
                        {data.action === 'pass'
                          ? lang('ColorCheck.ResultPass')
                          : data.action === 'recheck'
                            ? lang('ColorCheck.ResultReCheck')
                            : lang('ColorCheck.ResultFail')}
                      </Typography>
                    ),
                  },
                  {
                    title: lang('ColorCheck.Detail'),
                    field: 'score',
                    align: 'center',
                    renderItem: (data) => (
                      <BaseButton
                        text={lang('ColorCheck.View')}
                        size='small'
                        color='secondary'
                        onClick={() => {
                          setOpen(true);
                          setSelectItem(data);
                        }}
                      />
                    ),
                  },
                ]}
                data={{
                  items: tableData.reverse() ?? [],
                  page: 1,
                  page_size: 10,
                  total: 0,
                  is_full: false,
                }}
                onChangePaging={() => {}}
              />
            </Column>
          </Column>
        </Column>
      </DashboardContent>
    </>
  );
}
