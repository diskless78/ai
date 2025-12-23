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
  IStoreTransactionItem,
  IStoreTransactionRequest,
} from 'src/models/analystics';
import { useMemo } from 'react';
import { getLabelType } from 'src/utils/label.utils';
import { useStoreTransaction } from '../../../hooks/use-analytics-service';
import type { ISelectDateValue } from 'src/components/input/input-select-date/types';

interface StoreTransactionWidgetProps {
  groupId: string;
  selectDate: ISelectDateValue;
}

const StoreTransactionWidget: React.FC<StoreTransactionWidgetProps> = ({
  groupId,
  selectDate,
}) => {
  const storeTransactionRequest: IStoreTransactionRequest = useMemo(
    () => ({
      group_id: groupId,
      time_filter_type: selectDate.timeFilterType,
      start_date: selectDate.startDate,
      end_date: selectDate.endDate,
    }),
    [groupId, selectDate]
  );
  const { data: storeTransaction } = useStoreTransaction(
    storeTransactionRequest
  );

  return (
    <Column py={pxToRem(8)}>
      <Row
        alignItems='center'
        justifyContent='space-between'
        padding={`${pxToRem(5)} ${pxToRem(4)}`}
      >
        <Row alignItems='center' gap={pxToRem(6)}>
          <Typography variant='t1SemiBold' color='neutral.100'>
            Store Transaction
          </Typography>
          <BaseTooltip title='' size='small' />
        </Row>
      </Row>
      <SizedBox height={8} />
      <BaseAccordion>
        <BaseTable<IStoreTransactionItem>
          data={
            storeTransaction ?? {
              items: [],
              total: 0,
              is_full: true,
              page: 1,
              page_size: 10,
            }
          }
          headersTable={[
            {
              title: 'Store name',
              field: 'group_name',
              align: 'center',
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
              title: 'Interaction',
              field: 'interaction',
              align: 'center',
              renderItem: (data) => (
                <Row
                  alignItems='center'
                  justifyContent='center'
                  gap={pxToRem(10)}
                >
                  <Typography variant='t3SemiBold' color='neutral.100'>
                    {getLabelType('number', data.interaction.current_value)}
                  </Typography>
                  <PercentageChip value={data.interaction.compare_percent} />
                </Row>
              ),
            },
            {
              title: 'Avg. Transactions Rate',
              field: 'transaction_rate',
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
                      data.transaction_rate.current_value
                    )}
                  </Typography>
                  <PercentageChip
                    value={data.transaction_rate.compare_percent}
                  />
                </Row>
              ),
            },
            {
              title: 'Waiting Time',
              field: 'waiting_time',
              align: 'center',
              renderItem: (data) => (
                <Row
                  alignItems='center'
                  justifyContent='center'
                  gap={pxToRem(10)}
                >
                  <Typography variant='t3SemiBold' color='neutral.100'>
                    {getLabelType('time', data.waiting_time.current_value)}
                  </Typography>
                  <PercentageChip value={data.waiting_time.compare_percent} />
                </Row>
              ),
            },
            {
              title: 'Transaction Time',
              field: 'transaction_time',
              align: 'center',
              renderItem: (data) => (
                <Row
                  alignItems='center'
                  justifyContent='center'
                  gap={pxToRem(10)}
                >
                  <Typography variant='t3SemiBold' color='neutral.100'>
                    {getLabelType('time', data.transaction_time.current_value)}
                  </Typography>
                  <PercentageChip
                    value={data.transaction_time.compare_percent}
                  />
                </Row>
              ),
            },
          ]}
        />
      </BaseAccordion>
    </Column>
  );
};

export default StoreTransactionWidget;
