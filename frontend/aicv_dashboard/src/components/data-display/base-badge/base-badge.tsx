import { StyledBaseBadge } from './styles';

type BaseBadgeProps = {
  count: number;
};

export const BaseBadge = ({ count }: BaseBadgeProps) => {
  return <StyledBaseBadge badgeContent={count} />;
};
