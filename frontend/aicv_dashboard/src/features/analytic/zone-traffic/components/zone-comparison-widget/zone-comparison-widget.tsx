import Row from 'src/components/common/row';
import Column from 'src/components/common/column';
import { Typography } from '@mui/material';
import { pxToRem } from 'src/theme/styles';
import SizedBox from 'src/components/common/sized-box';
import { BaseAccordion } from 'src/components/common/base-accordion/base-accordion';
import BaseTable from 'src/components/table/base-table/base-table';
import BaseTooltip from 'src/components/tooltip/base-tooltip/base-tooltip';
import InputSelect from 'src/components/input/input-select/input-select';
import { SELECT_GATE_SHOP_DATA } from 'src/_mock/_data';
import PercentageChip from 'src/features/data-overview/components/percentage-chip/percentage-chip';
import {
  useExportZoneComparison,
  useZoneComparison,
} from 'src/features/analytic/hooks/use-analytics-service';
import { EGateShopType, ETimeFilterType } from 'src/models/common/models.enum';
import InputSelectDate from 'src/components/input/input-select-date/input-select-date';
import type { ISelectDateValue } from 'src/components/input/input-select-date/types';
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import type {
  IZoneComparisonItem,
  IZoneComparisonRequest,
} from 'src/models/analystics';
import BaseChip from 'src/components/tag/base-chip/base-chip';
import InputMultiSelect from 'src/components/input/input-multi-select/input-multi-select';
import { useAppSelector } from 'src/store';
import { selectGroup } from 'src/store/selectors/system.selectors';
import type { ITableHeader } from 'src/components/table/base-table';
import { downloadExcelFile } from 'src/utils/download.utils';
import BaseButton from 'src/components/button/base-button/base-button';
import BaseIcon from 'src/components/svg/base-icon/base-icon';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';

const ZoneComparisonWidget: React.FC = () => {
  const groups = useAppSelector(selectGroup);
  const [type, setType] = useState<EGateShopType>(EGateShopType.Gate);
  const [selectDate, setSelectDate] = useState<ISelectDateValue>({
    timeFilterType: ETimeFilterType.Today,
    startDate: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
  });

  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const zoneComparisonRequest: IZoneComparisonRequest = useMemo(
    () => ({
      time_filter_type: selectDate.timeFilterType,
      type: type,
      group_ids: selectedGroups,
      start_date: selectDate.startDate,
      end_date: selectDate.endDate,
    }),
    [type, selectedGroups, selectDate]
  );

  const { data: zoneComparison } = useZoneComparison(zoneComparisonRequest);

  const { refetch: exportZoneComparison, isFetching: isExporting } =
    useExportZoneComparison(zoneComparisonRequest);

  const onExport = async () => {
    try {
      const result = await exportZoneComparison();
      if (result.data) {
        downloadExcelFile(result.data, 'zone_comparison', {
          startDate: selectDate.startDate,
          endDate: selectDate.endDate,
          timeFilterType: selectDate.timeFilterType,
        });
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const headers: ITableHeader<IZoneComparisonItem>[] = [
    {
      title: 'Store name',
      field: 'group_name',
      align: 'center',
    },
    {
      title: 'Zone name',
      field: 'zone_name',
      align: 'center',
    },
    {
      title: type === EGateShopType.Gate ? 'Traffic' : 'Dwell time',
      field: 'current_value',
      align: 'center',
      format: type === EGateShopType.Gate ? 'number' : 'seconds',
    },
    {
      title: 'Compare to',
      field: 'compare_percent',
      align: 'center',
      renderItem: (data) => (
        <Row alignItems='center' justifyContent='center' gap={pxToRem(10)}>
          <PercentageChip value={data.compare_percent} />
        </Row>
      ),
    },
    {
      title: 'Percentage',
      field: 'percent_in_group',
      align: 'center',
      renderItem: (data) => (
        <Row alignItems='center' justifyContent='center' gap={pxToRem(10)}>
          <BaseChip value={data.percent_in_group} color='blue' />
        </Row>
      ),
    },
  ];

  return (
    <Column py={pxToRem(8)}>
      <Row
        alignItems='center'
        justifyContent='space-between'
        padding={`${pxToRem(5)} ${pxToRem(4)}`}
      >
        <Row alignItems='center' gap={pxToRem(6)}>
          <Typography variant='t1SemiBold' color='neutral.100'>
            Zone comparison
          </Typography>
          <BaseTooltip title='' size='small' />
        </Row>
        <Row gap={pxToRem(8)}>
          <InputSelectDate
            value={selectDate}
            onChangeValue={(value) => setSelectDate(value)}
            placeholder='Select date range'
            width={pxToRem(240)}
          />
          <InputSelect
            value={type}
            list={SELECT_GATE_SHOP_DATA}
            placeholder='Select type'
            onChangeValue={(value) => setType(value as EGateShopType)}
          />
          <InputMultiSelect
            list={groups}
            value={selectedGroups}
            onChangeValue={setSelectedGroups}
            showAllOption={true}
            allOptionLabel='All stores'
          />
          <BaseButton
            text='Export'
            size='medium'
            onClick={onExport}
            loading={isExporting}
            iconLeft={
              <BaseIcon
                size={20}
                src={ASSET_CONSTANT.SVG.IconLinearDownload}
                color='white'
              />
            }
          />
        </Row>
      </Row>
      <SizedBox height={8} />
      <BaseAccordion>
        <BaseTable<IZoneComparisonItem>
          data={{
            items: zoneComparison?.data ?? [],
            total: zoneComparison?.data.length ?? 0,
            page: 1,
            page_size: zoneComparison?.data.length ?? 0,
            is_full: true,
          }}
          headersTable={headers}
        />
      </BaseAccordion>
    </Column>
  );
};

export default ZoneComparisonWidget;
