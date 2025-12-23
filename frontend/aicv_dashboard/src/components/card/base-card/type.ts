import type {
  TypographyPropsVariantOverrides,
  TypographyVariant,
} from '@mui/material';
import type { OverridableStringUnion } from '@mui/types';

export type BaseCardSize = 'small' | 'medium';

export interface BaseCardProps {
  title: string;
  children: React.ReactNode;
  size: BaseCardSize;
  variant?: OverridableStringUnion<
    TypographyVariant | 'inherit',
    TypographyPropsVariantOverrides
  >;
}
