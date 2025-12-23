import { createTheme, extendTheme } from '@mui/material/styles';
import {
  components,
  customShadows,
  darkPalette,
  effects,
  lightPalette,
  shadows,
  typography,
} from './core';

const initialLightTheme = createTheme({
  palette: lightPalette,
  shadows: shadows.dark,
  customShadows: customShadows(),
  effect: effects(),
  shape: { borderRadius: 8 },
  components,
  typography,
  cssVariables: { cssVarPrefix: '' },
});

const initialDarkTheme = createTheme({
  palette: darkPalette,
  shadows: shadows.dark,
  customShadows: customShadows(),
  effect: effects(),
  shape: { borderRadius: 8 },
  components,
  typography,
  cssVariables: { cssVarPrefix: '' },
});

export const lightTheme = extendTheme(initialLightTheme);

export const darkTheme = extendTheme(initialDarkTheme);
