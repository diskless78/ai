import Column from 'src/components/common/column';
import { pxToRem } from 'src/theme/styles';
import CameraPreview, {
  type CameraPreviewHandle,
} from 'src/components/image/camera-preview/camera-preview';
import { BaseCard } from 'src/components/card/base-card/base-card';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import InputSelect from 'src/components/input/input-select/input-select';
import { SvgColor } from 'src/components/svg/svg-color';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { useRouteMapByCam } from 'src/features/analytic/hooks/use-route-map-service';
import type { IRouteMapRequest } from 'src/models/route-map';
import ArrowImage from 'src/components/chart/route-chart';
import type { ICameraItem } from 'src/models/camera';
import type { ISelectDateValue } from 'src/components/input/input-select-date/types';

type RouteMapWidgetProps = {
  cameraList: ICameraItem[];
  selectDate: ISelectDateValue;
};

const RouteMapWidget: React.FC<RouteMapWidgetProps> = ({
  cameraList,
  selectDate,
}) => {
  const previewRef = useRef<CameraPreviewHandle>(null);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');

  const routeMapRequest: IRouteMapRequest = useMemo(
    () => ({
      camera_id: selectedCameraId,
      time_filter_type: selectDate.timeFilterType,
      start_date: selectDate.startDate,
      end_date: selectDate.endDate,
    }),
    [selectedCameraId, selectDate]
  );

  const { data: routeMapData } = useRouteMapByCam(routeMapRequest);

  useEffect(() => {
    if (cameraList && cameraList.length > 0 && !selectedCameraId) {
      setSelectedCameraId(cameraList[0].id);
    }
  }, [cameraList, selectedCameraId]);

  useEffect(() => {
    previewRef.current?.updateSrc(routeMapData?.data.image || '');
  }, [routeMapData]);

  return (
    <BaseCard title='Route map' size='medium'>
      <Column p={`${pxToRem(10)}`} position='relative'>
        <div style={{ position: 'relative' }}>
          <CameraPreview
            ratio={16 / 9}
            ref={previewRef}
            placeholder='No route data available'
          />

          {routeMapData && routeMapData.data?.routes?.length > 0 && (
            <>
              {routeMapData.data.routes.map(
                (route: any, routeIndex: number) => (
                  <ArrowImage
                    key={routeIndex}
                    x1={route.start[0]}
                    y1={route.start[1]}
                    x2={route.end[0]}
                    y2={route.end[1]}
                    x3={route.mid[0]}
                    y3={route.mid[1]}
                    color={route.color}
                    valueX={routeMapData.data.percentage[routeIndex]?.x}
                    valueY={routeMapData.data.percentage[routeIndex]?.y}
                    totalPeople={
                      routeMapData.data.percentage[routeIndex]?.totalPeople
                    }
                    value={routeMapData.data.percentage[routeIndex]?.text}
                    fillColor='black'
                    fontSize={100}
                    index={route.id}
                  />
                )
              )}
            </>
          )}
        </div>
        {cameraList.length > 0 && (
          <InputSelect
            width={pxToRem(260)}
            sx={{
              position: 'absolute',
              top: pxToRem(20),
              right: pxToRem(20),
              zIndex: 1,
            }}
            value={selectedCameraId}
            onChangeValue={(value) => setSelectedCameraId(value as string)}
            placeholder='Select Camera'
            startIcon={
              <SvgColor
                sx={{ marginRight: pxToRem(4) }}
                src={ASSET_CONSTANT.SVG.IconBoldCamera}
                width={pxToRem(24)}
                height={pxToRem(24)}
                color='neutral.100'
              />
            }
            list={cameraList || []}
          />
        )}
      </Column>
    </BaseCard>
  );
};

export default React.memo(RouteMapWidget);
