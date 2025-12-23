import type { PaletteColorOptions, PaletteMode } from '@mui/material/styles';
import type { Color, PaletteOptions, ColorSystemOptions } from '@mui/material';
import COLORS from './colors.json';
import { varAlpha, createPaletteChannel } from '../styles';

// ----------------------------------------------------------------------

declare module '@mui/material/styles' {
  interface CommonColors {
    whiteChannel: string;
    blackChannel: string;
  }
  interface Palette {
    red: Color;
    orange: Color;
    yellow: Color;
    green: Color;
    blue: Color;
    purple: Color;
    pink: Color;
    neutral: Color;
  }
  interface PaletteOptions {
    mode?: PaletteMode;
    red?: PaletteColorOptions;
    orange?: PaletteColorOptions;
    yellow?: PaletteColorOptions;
    green?: PaletteColorOptions;
    blue?: PaletteColorOptions;
    purple?: PaletteColorOptions;
    pink?: PaletteColorOptions;
    neutral?: PaletteColorOptions;
  }
}

declare module '@mui/material' {
  interface Color {
    [0]: string;
    [10]: string;
    [20]: string;
    [30]: string;
    [40]: string;
    [50]: string;
    [60]: string;
    [70]: string;
    [80]: string;
    [90]: string;
    [999]: string;
    ['0Channel']: string;
    ['10Channel']: string;
    ['20Channel']: string;
    ['30Channel']: string;
    ['40Channel']: string;
    ['50Channel']: string;
    ['60Channel']: string;
    ['70Channel']: string;
    ['80Channel']: string;
    ['90Channel']: string;
    ['100Channel']: string;
    ['200Channel']: string;
    ['300Channel']: string;
    ['400Channel']: string;
    ['500Channel']: string;
    ['600Channel']: string;
    ['700Channel']: string;
    ['800Channel']: string;
    ['900Channel']: string;
    ['999Channel']: string;
    white?: string;
    black?: string;
    black2?: string;
  }
}

// ----------------------------------------------------------------------

// Grey
export const grey = createPaletteChannel(COLORS.grey);

// Common
export const common = createPaletteChannel(COLORS.common);

// Red
const redLight = createPaletteChannel(COLORS.redLight);
const redDark = createPaletteChannel(COLORS.redDark);

// Orange
const orangeLight = createPaletteChannel(COLORS.orangeLight);
const orangeDark = createPaletteChannel(COLORS.orangeDark);

// Yellow
const yellowLight = createPaletteChannel(COLORS.yellowLight);
const yellowDark = createPaletteChannel(COLORS.yellowDark);

// Green
const greenLight = createPaletteChannel(COLORS.greenLight);
const greenDark = createPaletteChannel(COLORS.greenDark);

// Blue
const blueLight = createPaletteChannel(COLORS.blueLight);
const blueDark = createPaletteChannel(COLORS.blueDark);

// Purple
const purpleLight = createPaletteChannel(COLORS.purpleLight);
const purpleDark = createPaletteChannel(COLORS.purpleDark);

// Pink
const pinkLight = createPaletteChannel(COLORS.pinkLight);
const pinkDark = createPaletteChannel(COLORS.pinkDark);

// Neutral
const neutralLight = {
  ...createPaletteChannel(COLORS.neutralLight),
  black2: varAlpha(common.blackChannel, 0.02),
};
const neutralDark = {
  ...createPaletteChannel(COLORS.neutralDark),
  black2: varAlpha(common.whiteChannel, 0.02),
};

export const lightPalette: PaletteOptions = {
  mode: 'light',
  common,
  grey,
  primary: {
    main: purpleLight[50],
    light: purpleLight[30],
    dark: purpleLight[70],
    contrastText: common.white,
  },
  red: redLight,
  orange: orangeLight,
  yellow: yellowLight,
  green: greenLight,
  blue: blueLight,
  purple: purpleLight,
  pink: pinkLight,
  neutral: neutralLight,
};

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  common,
  grey,
  primary: {
    main: purpleDark[50],
    light: purpleDark[30],
    dark: purpleDark[70],
    contrastText: common.white,
  },
  red: redDark,
  orange: orangeDark,
  yellow: yellowDark,
  green: greenDark,
  blue: blueDark,
  purple: purpleDark,
  pink: pinkDark,
  neutral: neutralDark,
};

// ----------------------------------------------------------------------

export const colorSchemes: Partial<
  Record<'light' | 'dark', ColorSystemOptions>
> = {
  light: { palette: lightPalette },
  dark: { palette: darkPalette },
};
