import Column from 'src/components/common/column';
import { pxToRem } from 'src/theme/styles';
import CameraPreview, {
  type CameraPreviewHandle,
} from 'src/components/image/camera-preview/camera-preview';
import { useRef } from 'react';
import { BaseCard } from 'src/components/card/base-card/base-card';
import React from 'react';

const HeatmapWidget: React.FC = () => {
  const previewRef = useRef<CameraPreviewHandle>(null);

  // useEffect(() => {
  //   previewRef.current?.updateSrc('/assets/images/temp/heatmap.png');
  // }, []);

  return (
    <BaseCard title='Heatmap' size='medium'>
      <Column p={`${pxToRem(10)}`} position='relative'>
        {/* <InputSelect
          sx={{
            position: 'absolute',
            top: pxToRem(20),
            right: pxToRem(20),
            zIndex: 1,
          }}
          startIcon={
            <SvgColor
              sx={{ marginRight: pxToRem(4) }}
              src={ASSET_CONSTANT.SVG.IconLinearHome3}
              width={pxToRem(24)}
              height={pxToRem(24)}
              color='neutral.100'
            />
          }
          list={[
            {
              id: '1',
              name: 'Floor 1',
            },
            {
              id: '2',
              name: 'Floor 2',
            },
            {
              id: '3',
              name: 'Floor 3',
            },
          ]}
        /> */}
        <CameraPreview
          ratio={16 / 9}
          ref={previewRef}
          placeholder={'No heatmap data available'}
        />
      </Column>
    </BaseCard>
  );
};

export default React.memo(HeatmapWidget);
