import type { TypographyVariantsOptions } from '@mui/material/styles';
import { setFont, pxToRem } from '../styles/utils';

// ----------------------------------------------------------------------

declare module '@mui/material/styles' {
  interface TypographyVariants {
    fontSecondaryFamily: React.CSSProperties['fontFamily'];
    fontWeightSemiBold: React.CSSProperties['fontWeight'];
  }
  interface TypographyVariantsOptions {
    fontSecondaryFamily?: React.CSSProperties['fontFamily'];
    fontWeightSemiBold?: React.CSSProperties['fontWeight'];
  }
  interface ThemeVars {
    typography: Theme['typography'];
  }
}

// ----------------------------------------------------------------------

export const defaultFont = 'Manrope';

export const primaryFont = setFont(defaultFont);

// export const secondaryFont = setFont('Barlow');

// ----------------------------------------------------------------------

declare module '@mui/material/styles' {
  interface TypographyVariants {
    fontSecondaryFamily: React.CSSProperties['fontFamily'];
    fontWeightSemiBold: React.CSSProperties['fontWeight'];
  }
  interface TypographyVariantsOptions {
    fontSecondaryFamily?: React.CSSProperties['fontFamily'];
    fontWeightSemiBold?: React.CSSProperties['fontWeight'];
  }
  interface ThemeVars {
    typography: Theme['typography'];
  }
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    t1SemiBold: React.CSSProperties;
    t1Bold: React.CSSProperties;
    t2SemiBold: React.CSSProperties;
    t2Bold: React.CSSProperties;
    t3SemiBold: React.CSSProperties;
    t3Bold: React.CSSProperties;
    t4SemiBold: React.CSSProperties;
    t4Bold: React.CSSProperties;
    b1Medium: React.CSSProperties;
    b1Regular: React.CSSProperties;
    b2Medium: React.CSSProperties;
    b2Regular: React.CSSProperties;
    b3Medium: React.CSSProperties;
    b3Regular: React.CSSProperties;
    b4Medium: React.CSSProperties;
    b4Regular: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    t1SemiBold?: React.CSSProperties;
    t1Bold?: React.CSSProperties;
    t2SemiBold?: React.CSSProperties;
    t2Bold?: React.CSSProperties;
    t3SemiBold?: React.CSSProperties;
    t3Bold?: React.CSSProperties;
    t4SemiBold?: React.CSSProperties;
    t4Bold?: React.CSSProperties;
    b1Medium?: React.CSSProperties;
    b1Regular?: React.CSSProperties;
    b2Medium?: React.CSSProperties;
    b2Regular?: React.CSSProperties;
    b3Medium?: React.CSSProperties;
    b3Regular?: React.CSSProperties;
    b4Medium?: React.CSSProperties;
    b4Regular?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    t1SemiBold?: true;
    t1Bold?: true;
    t2SemiBold?: true;
    t2Bold?: true;
    t3SemiBold?: true;
    t3Bold?: true;
    t4SemiBold?: true;
    t4Bold?: true;
    b1Medium?: true;
    b1Regular?: true;
    b2Medium?: true;
    b2Regular?: true;
    b3Medium?: true;
    b3Regular?: true;
    b4Medium?: true;
    b4Regular?: true;
  }
}

export const typography: TypographyVariantsOptions = {
  fontFamily: primaryFont,
  // fontSecondaryFamily: secondaryFont,
  fontWeightLight: '300',
  fontWeightRegular: '400',
  fontWeightMedium: '500',
  fontWeightSemiBold: '600',
  fontWeightBold: '700',
  allVariants: {
    lineHeight: 1,
  },
  h1: {
    fontWeight: 600,
    lineHeight: 34 / 28,
    fontSize: pxToRem(28),
  },
  h2: {
    fontWeight: 600,
    lineHeight: 29 / 24,
    fontSize: pxToRem(24),
  },
  h3: {
    fontWeight: 600,
    lineHeight: 31 / 22,
    fontSize: pxToRem(22),
  },
  h4: {
    fontWeight: 600,
    lineHeight: 28 / 20,
    fontSize: pxToRem(20),
  },
  h5: {
    fontWeight: 600,
    lineHeight: 25 / 18,
    fontSize: pxToRem(18),
  },
  t1SemiBold: {
    fontWeight: 600,
    lineHeight: 27 / 18,
    fontSize: pxToRem(18),
  },
  t1Bold: {
    fontWeight: 700,
    lineHeight: 27 / 18,
    fontSize: pxToRem(18),
  },
  t2SemiBold: {
    fontWeight: 600,
    lineHeight: 24 / 16,
    fontSize: pxToRem(16),
  },
  t2Bold: {
    fontWeight: 700,
    lineHeight: 24 / 16,
    fontSize: pxToRem(16),
  },
  t3SemiBold: {
    fontWeight: 600,
    lineHeight: 21 / 14,
    fontSize: pxToRem(14),
  },
  t3Bold: {
    fontWeight: 700,
    lineHeight: 21 / 14,
    fontSize: pxToRem(14),
  },
  t4SemiBold: {
    fontWeight: 600,
    lineHeight: 18 / 12,
    fontSize: pxToRem(12),
  },
  t4Bold: {
    fontWeight: 700,
    lineHeight: 18 / 12,
    fontSize: pxToRem(12),
  },
  b1Medium: {
    fontWeight: 500,
    lineHeight: 27 / 18,
    fontSize: pxToRem(18),
  },
  b1Regular: {
    fontWeight: 400,
    lineHeight: 27 / 18,
    fontSize: pxToRem(18),
  },
  b2Medium: {
    fontWeight: 500,
    lineHeight: 24 / 16,
    fontSize: pxToRem(16),
  },
  b2Regular: {
    fontWeight: 400,
    lineHeight: 24 / 16,
    fontSize: pxToRem(16),
  },
  b3Medium: {
    fontWeight: 500,
    lineHeight: 21 / 14,
    fontSize: pxToRem(14),
  },
  b3Regular: {
    fontWeight: 400,
    lineHeight: 21 / 14,
    fontSize: pxToRem(14),
  },
  b4Medium: {
    fontWeight: 500,
    lineHeight: 18 / 12,
    fontSize: pxToRem(12),
  },
  b4Regular: {
    fontWeight: 400,
    lineHeight: 18 / 12,
    fontSize: pxToRem(12),
  },
};
