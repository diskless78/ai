import { useTheme } from '@mui/material';
import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { pxToRem } from 'src/theme/styles';
import { ETimeFilterType } from 'src/models/common/models.enum';
import type { ISelectDateValue } from 'src/components/input/input-select-date/types';
import { SvgColor } from 'src/components/svg/svg-color';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { useAppSelector } from 'src/store';
import { selectGroup } from 'src/store/selectors/system.selectors';
import InputSelect from 'src/components/input/input-select/input-select';
import InputSelectDate from 'src/components/input/input-select-date/input-select-date';
import Row from 'src/components/common/row';
import SizedBox from 'src/components/common/sized-box';
import TransactionInteractionChart from './transaction-interaction-chart';
import { BaseChartWidget } from 'src/components/chart/base-chart-widget';
import type { ITransactionAndInteractionChartRequest } from 'src/models/data-overview';
import { useTransactionAndInteraction } from '../../hooks/use-data-overview-service';

interface TransactionInteractionWidgetProps {
  groupId?: string;
  onGroupIdChange?: (value: string) => void;
  selectDate?: ISelectDateValue;
  onSelectDateChange?: (value: ISelectDateValue) => void;
}

const TransactionInteractionWidget: React.FC<
  TransactionInteractionWidgetProps
> = ({
  groupId: controlledGroupId,
  onGroupIdChange,
  selectDate: controlledSelectDate,
  onSelectDateChange,
}) => {
  const theme = useTheme();
  const groups = useAppSelector(selectGroup);

  // Internal state (used when component is uncontrolled)
  const [internalGroupId, setInternalGroupId] = useState('');
  const [internalSelectDate, setInternalSelectDate] =
    useState<ISelectDateValue>({
      timeFilterType: ETimeFilterType.Today,
      startDate: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
      endDate: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
    });

  // Use controlled values if provided, otherwise use internal state
  const groupId =
    controlledGroupId !== undefined ? controlledGroupId : internalGroupId;
  const selectDate =
    controlledSelectDate !== undefined
      ? controlledSelectDate
      : internalSelectDate;

  const handleGroupIdChange = (value: string) => {
    if (onGroupIdChange) {
      onGroupIdChange(value);
    } else {
      setInternalGroupId(value);
    }
  };

  const handleSelectDateChange = (value: ISelectDateValue) => {
    if (onSelectDateChange) {
      onSelectDateChange(value);
    } else {
      setInternalSelectDate(value);
    }
  };

  const transactionAndInteractionChartRequest: ITransactionAndInteractionChartRequest =
    useMemo(
      () => ({
        group_id: groupId,
        time_filter_type: selectDate.timeFilterType,
        start_date: selectDate.startDate,
        end_date: selectDate.endDate,
      }),
      [groupId, selectDate]
    );

  const { data: transactionAndInteractionChart } = useTransactionAndInteraction(
    transactionAndInteractionChartRequest
  );

  const categories =
    transactionAndInteractionChart?.data.map((item) => item.label) ?? [];

  const series = [
    {
      name: 'Transaction',
      type: 'column',
      data:
        transactionAndInteractionChart?.data.map(
          (item) => item.transaction.current_value
        ) ?? [],
      percent:
        transactionAndInteractionChart?.data.map(
          (item) => item.transaction.compare_percent
        ) ?? [],
    },
    {
      name: 'Interaction',
      type: 'column',
      data:
        transactionAndInteractionChart?.data.map(
          (item) => item.interaction.current_value
        ) ?? [],
      percent:
        transactionAndInteractionChart?.data.map(
          (item) => item.interaction.compare_percent
        ) ?? [],
    },
  ];

  const colors = [theme.palette.blue[60], theme.palette.blue[20]];

  const legends = [
    { type: 'bar' as const, color: 'blue.60', title: 'Transaction' },
    { type: 'bar' as const, color: 'blue.20', title: 'Interaction' },
  ];

  const headerControls = (
    <Row sx={{ gap: pxToRem(11) }}>
      <InputSelectDate
        value={selectDate}
        onChangeValue={handleSelectDateChange}
        placeholder='Select date range'
        width={pxToRem(240)}
      />
      <InputSelect
        value={groupId}
        list={groups}
        onChangeValue={handleGroupIdChange}
        placeholder='Choose store'
        showAllOption
        allOptionLabel='All Stores'
        startIcon={
          <SvgColor
            sx={{ marginRight: pxToRem(4) }}
            src={ASSET_CONSTANT.SVG.IconLinearHome3}
            width={pxToRem(24)}
            height={pxToRem(24)}
            color='neutral.100'
          />
        }
      />
    </Row>
  );

  return (
    <BaseChartWidget
      title='Transaction and Interaction'
      height={367}
      tooltipText=''
      legends={legends}
      headerControls={headerControls}
    >
      <SizedBox height={36} />
      <TransactionInteractionChart
        categories={categories}
        series={series}
        colors={colors}
      />
    </BaseChartWidget>
  );
};

export default React.memo(TransactionInteractionWidget);
