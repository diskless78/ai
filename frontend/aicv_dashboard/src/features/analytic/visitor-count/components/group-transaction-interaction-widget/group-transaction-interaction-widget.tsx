import { useState } from 'react';
import dayjs from 'dayjs';
import Column from 'src/components/common/column';
import TransactionInteractionWidget from 'src/features/data-overview/components/store-transaction-interaction/transaction-interaction-widget';
import StoreTransactionWidget from '../store-transaction-widget/store-transaction-widget';
import { FeatureFlag } from 'src/constants/feature-flags.constant';
import { useFeatureFlag } from 'src/hooks/use-feature-flag';
import type { ISelectDateValue } from 'src/components/input/input-select-date/types';
import { ETimeFilterType } from 'src/models/common/models.enum';

const GroupTransactionInteractionWidget: React.FC = () => {
  const { hasAccess } = useFeatureFlag();

  // Shared state for both widgets
  const [groupId, setGroupId] = useState('');
  const [selectDate, setSelectDate] = useState<ISelectDateValue>({
    timeFilterType: ETimeFilterType.Today,
    startDate: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
  });

  return (
    <Column>
      {hasAccess(FeatureFlag.TRANSACTION_AND_INTERACTION) && (
        <TransactionInteractionWidget
          groupId={groupId}
          onGroupIdChange={setGroupId}
          selectDate={selectDate}
          onSelectDateChange={setSelectDate}
        />
      )}
      {hasAccess(FeatureFlag.STORE_TRANSACTION) && (
        <StoreTransactionWidget groupId={groupId} selectDate={selectDate} />
      )}
    </Column>
  );
};

export default GroupTransactionInteractionWidget;
