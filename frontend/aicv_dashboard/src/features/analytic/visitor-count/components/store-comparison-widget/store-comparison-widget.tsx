import Row from 'src/components/common/row';
import Column from 'src/components/common/column';
import { Typography } from '@mui/material';
import { pxToRem } from 'src/theme/styles';
import SizedBox from 'src/components/common/sized-box';
import { BaseAccordion } from 'src/components/common/base-accordion/base-accordion';
import BaseTable from 'src/components/table/base-table/base-table';
import BaseTooltip from 'src/components/tooltip/base-tooltip/base-tooltip';
import PercentageChip from 'src/features/data-overview/components/percentage-chip/percentage-chip';
import type {
  IStoreComparisonItem,
  IStoreComparisonRequest,
} from 'src/models/analystics';
import { ETimeFilterType } from 'src/models/common/models.enum';
import { useState } from 'react';
import { getLabelType } from 'src/utils/label.utils';
import {
  useExportStoreComparison,
  useStoreComparison,
} from '../../../hooks/use-analytics-service';
import InputSelectDate from 'src/components/input/input-select-date/input-select-date';
import type { ISelectDateValue } from 'src/components/input/input-select-date/types';
import dayjs from 'dayjs';
import { useAppSelector } from 'src/store';
import { selectGroup } from 'src/store/selectors/system.selectors';
import InputMultiSelect from 'src/components/input/input-multi-select/input-multi-select';
import { downloadExcelFile } from 'src/utils/download.utils';
import BaseButton from 'src/components/button/base-button/base-button';
import BaseIcon from 'src/components/svg/base-icon/base-icon';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';

const StoreComparisonWidget: React.FC = () => {
  const groups = useAppSelector(selectGroup);
  const [selectDate, setSelectDate] = useState<ISelectDateValue>({
    timeFilterType: ETimeFilterType.Today,
    startDate: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
  });
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const storeComparisonRequest: IStoreComparisonRequest = {
    group_ids: [],
    time_filter_type: selectDate.timeFilterType,
    start_date: selectDate.startDate,
    end_date: selectDate.endDate,
  };
  const { data: storeComparison } = useStoreComparison(storeComparisonRequest);

  const { refetch: exportStoreComparison, isFetching: isExporting } =
    useExportStoreComparison(storeComparisonRequest);

  const onExport = async () => {
    try {
      const result = await exportStoreComparison();
      if (result.data) {
        downloadExcelFile(result.data, 'store_comparison', {
          startDate: selectDate.startDate,
          endDate: selectDate.endDate,
          timeFilterType: selectDate.timeFilterType,
        });
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <Column py={pxToRem(8)}>
      <Row
        alignItems='center'
        justifyContent='space-between'
        padding={`${pxToRem(5)} ${pxToRem(4)}`}
      >
        <Row alignItems='center' gap={pxToRem(6)}>
          <Typography variant='t1SemiBold' color='neutral.100'>
            Store comparison
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
        <BaseTable<IStoreComparisonItem>
          data={{
            items: storeComparison?.data || [],
            page: 0,
            page_size: storeComparison?.data.length || 0,
            total: storeComparison?.data.length || 0,
            is_full: false,
          }}
          headersTable={[
            {
              title: 'Store name',
              field: 'group_name',
              align: 'center',
            },
            {
              title: 'Total traffic',
              field: 'total_traffic',
              align: 'center',
              renderItem: (data) => (
                <Row
                  alignItems='center'
                  justifyContent='center'
                  gap={pxToRem(10)}
                >
                  <Typography variant='t3SemiBold' color='neutral.100'>
                    {getLabelType('number', data.total_traffic.current_value)}
                  </Typography>
                  <PercentageChip value={data.total_traffic.compare_percent} />
                </Row>
              ),
            },
            {
              title: 'Entrance rate',
              field: 'entrance_rate',
              align: 'center',
              renderItem: (data) => (
                <Row
                  alignItems='center'
                  justifyContent='center'
                  gap={pxToRem(10)}
                >
                  <Typography variant='t3SemiBold' color='neutral.100'>
                    {getLabelType('percent', data.entrance_rate.current_value)}
                  </Typography>
                  <PercentageChip value={data.entrance_rate.compare_percent} />
                </Row>
              ),
            },
            {
              title: 'Transaction',
              field: 'transaction',
              align: 'center',
              renderItem: (data) => (
                <Row
                  alignItems='center'
                  justifyContent='center'
                  gap={pxToRem(10)}
                >
                  <Typography variant='t3SemiBold' color='neutral.100'>
                    {getLabelType('number', data.transaction.current_value)}
                  </Typography>
                  <PercentageChip value={data.transaction.compare_percent} />
                </Row>
              ),
            },
            {
              title: 'Conversion rate',
              field: 'conversion_rate',
              align: 'center',
              renderItem: (data) => (
                <Row
                  alignItems='center'
                  justifyContent='center'
                  gap={pxToRem(10)}
                >
                  <Typography variant='t3SemiBold' color='neutral.100'>
                    {getLabelType(
                      'percent',
                      data.conversion_rate.current_value
                    )}
                  </Typography>
                  <PercentageChip
                    value={data.conversion_rate.compare_percent}
                  />
                </Row>
              ),
            },
            {
              title: 'Dwell time',
              field: 'dwell_time',
              align: 'center',
              renderItem: (data) => (
                <Row
                  alignItems='center'
                  justifyContent='center'
                  gap={pxToRem(10)}
                >
                  <Typography variant='t3SemiBold' color='neutral.100'>
                    {getLabelType('seconds', data.dwell_time.current_value)}
                  </Typography>
                  <PercentageChip value={data.dwell_time.compare_percent} />
                </Row>
              ),
            },
          ]}
          rowHighlightConfig={{
            total: {
              match: (item) => item.is_row_total === true,
            },
          }}
        />
      </BaseAccordion>
    </Column>
  );
};

export default StoreComparisonWidget;
