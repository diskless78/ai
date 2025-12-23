import BaseChip from 'src/components/tag/base-chip/base-chip';

interface PercentageChipProps {
  value: number;
}

const PercentageChip: React.FC<PercentageChipProps> = ({ value }) => (
  <BaseChip
    value={value}
    color={value > 0 ? 'green' : value < 0 ? 'red' : 'grey'}
  />
);

export default PercentageChip;
