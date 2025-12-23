import Row from 'src/components/common/row';
import Column from 'src/components/common/column';
import { Typography } from '@mui/material';
import { pxToRem } from 'src/theme/styles';
import SizedBox from 'src/components/common/sized-box';
import { BaseAccordion } from 'src/components/common/base-accordion/base-accordion';
import BaseTable from 'src/components/table/base-table/base-table';
import BaseTooltip from 'src/components/tooltip/base-tooltip/base-tooltip';
import type { ITableHeader } from 'src/components/table/base-table/types';
import type { ISummaryTableItem } from 'src/models/analystics';
import BaseButton from 'src/components/button/base-button/base-button';
import { useMemo, useState } from 'react';
import BaseIcon from 'src/components/svg/base-icon/base-icon';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';

type SummaryTableWidgetProps = {
  site: 'visitor-count' | 'zone-traffic';
  data: ISummaryTableItem[];
};

const SummaryTableWidget: React.FC<SummaryTableWidgetProps> = ({
  site,
  data,
}) => {
  const headers: ITableHeader<ISummaryTableItem>[] = [
    {
      title: 'Time',
      field: 'time_label',
      align: 'center',
      minWidth: site === 'visitor-count' ? 162 : 'unset',
    },
    {
      title: 'Passby',
      field: 'passby',
      align: 'center',
      format: 'number',
      visible: site === 'visitor-count',
    },
    {
      title: 'Footfall',
      field: 'footfall',
      align: 'center',
      format: 'number',
    },
    {
      title: 'Entrance Rate',
      field: 'entrance_rate',
      align: 'center',
      format: 'percent',
      visible: site === 'visitor-count',
    },
    {
      title: 'Transaction',
      field: 'transaction',
      align: 'center',
      format: 'number',
      visible: site === 'visitor-count',
    },
    {
      title: 'Conversion Rate',
      field: 'conversion_rate',
      align: 'center',
      format: 'percent',
      visible: site === 'visitor-count',
    },
    {
      title: 'Dwell time',
      field: 'dwell_time',
      align: 'center',
      format: 'seconds',
    },
  ];

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const filteredData = useMemo(
    () =>
      handleSummaryTableData(
        data,
        isExpanded,
        new Date().toTimeString().slice(0, 5)
      ),
    [data, isExpanded]
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
            Summary table
          </Typography>
          <BaseTooltip title='' size='small' />
        </Row>
        <BaseButton
          text={isExpanded ? 'Collapse' : 'Expand'}
          size='medium'
          color='white'
          iconRight={
            isExpanded ? (
              <BaseIcon
                src={ASSET_CONSTANT.SVG.IconLinearArrowUp}
                size={24}
                color='purple.80'
              />
            ) : (
              <BaseIcon
                src={ASSET_CONSTANT.SVG.IconLinearArrowDown}
                size={24}
                color='purple.80'
              />
            )
          }
          onClick={() => setIsExpanded(!isExpanded)}
        />
      </Row>
      <SizedBox height={8} />
      <BaseAccordion>
        <BaseTable<ISummaryTableItem>
          data={{
            items: filteredData,
            page: 1,
            page_size: filteredData.length,
            total: filteredData.length,
            is_full: true,
          }}
          headersTable={headers}
          rowHighlightConfig={{
            peak: {
              match: (item) => item.peak === true,
            },
            total: {
              match: (item) => item.is_row_total === true,
            },
          }}
        />
      </BaseAccordion>
    </Column>
  );
};

export default SummaryTableWidget;

function handleSummaryTableData(
  data: ISummaryTableItem[],
  isExpanded: boolean,
  currentTime: string
): ISummaryTableItem[] {
  if (isExpanded) return data;

  const [h] = currentTime.split(':').map(Number);
  const currentHourLabel = `${String(h).padStart(2, '0')}:00`;

  const sortedData = [...data]
    .filter((item) => /^\d{2}:\d{2}$/.test(item.time_label))
    .sort((a, b) => a.time_label.localeCompare(b.time_label));

  const currentIndex = sortedData.findIndex(
    (item) => item.time_label === currentHourLabel
  );

  if (currentIndex === -1) return [];

  const start = Math.max(0, currentIndex - 4);
  const selectedData = sortedData.slice(start, currentIndex + 1);

  const totalRow = data.find((item) => item.is_row_total === true);

  return totalRow ? [...selectedData, totalRow] : selectedData;
}
