import BaseTable from 'src/components/table/base-table/base-table';
import Row from 'src/components/common/row';
import { Typography } from '@mui/material';
import { pxToRem } from 'src/theme/styles';
import BaseChip from 'src/components/tag/base-chip/base-chip';
import type { ITotalAllStore } from 'src/models/analystics';
import { getLabelType } from 'src/utils/label.utils';

interface TopStoreRow {
  type: string;
  value: number;
  formatType: string;
  change: number;
}

interface TopStoreTableProps {
  data?: ITotalAllStore;
}

const TopStoreTable: React.FC<TopStoreTableProps> = ({ data }) => {
  return (
    <BaseTable<TopStoreRow>
      data={{
        items: [
          {
            type: 'Passby',
            value: data?.passby.current_value || 0,
            change: data?.passby.compare_percent || 0,
            formatType: 'number',
          },
          {
            type: 'Footfall',
            value: data?.footfall.current_value || 0,
            change: data?.footfall.compare_percent || 0,
            formatType: 'number',
          },
          {
            type: 'Total',
            value: data?.total_traffic.current_value || 0,
            change: data?.total_traffic.compare_percent || 0,
            formatType: 'number',
          },
          {
            type: 'Entrance rate',
            value: data?.entrance_rate.current_value || 0,
            change: data?.entrance_rate.compare_percent || 0,
            formatType: 'percent',
          },
          {
            type: 'Transaction',
            value: data?.transaction.current_value || 0,
            change: data?.transaction.compare_percent || 0,
            formatType: 'number',
          },
          {
            type: 'Conversion rate',
            value: data?.conversion_rate.current_value || 0,
            change: data?.conversion_rate.compare_percent || 0,
            formatType: 'percent',
          },
          {
            type: 'Dwell time',
            value: data?.dwell_time.current_value || 0,
            change: data?.dwell_time.compare_percent || 0,
            formatType: 'time',
          },
        ],
        page: 1,
        page_size: 10,
        total: 10,
        is_full: false,
      }}
      headersTable={[
        {
          title: 'Type',
          field: 'type',
          align: 'center',
        },
        {
          title: 'Number / % all stores',
          field: 'value',
          align: 'center',
          renderItem: (data) => (
            <Row alignItems='center' justifyContent='center' gap={pxToRem(10)}>
              <Typography variant='t3SemiBold' color='neutral.100'>
                {getLabelType(data.formatType, data.value)}
              </Typography>
              <BaseChip value={data.change} color='blue' />
            </Row>
          ),
        },
      ]}
    />
  );
};

export default TopStoreTable;
