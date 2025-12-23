// ThemeProvider.tsx
import { CssBaseline } from '@mui/material';
import { themeSelector, useAppSelector } from 'src/store';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { darkTheme, lightTheme } from './create-theme';

type Props = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: Props) {
  const { mode } = useAppSelector(themeSelector);
  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />

      {children}
    </MuiThemeProvider>
  );
}
