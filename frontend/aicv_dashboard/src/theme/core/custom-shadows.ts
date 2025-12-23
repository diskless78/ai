export interface CustomShadows {
  card0?: string;
  card0Light?: string;
  dropShadow?: string;
}

declare module '@mui/material/styles' {
  interface Theme {
    customShadows: CustomShadows;
  }
  interface ThemeOptions {
    customShadows?: CustomShadows;
  }
  interface ThemeVars {
    customShadows: CustomShadows;
  }
}

export function customShadows() {
  return {
    card0: `0px 8px 24px 0px #0000002E`,
    card0Light: `0px 2px 20px 0px #0000000F`,
    dropShadow: `0px 3px 7.6px 0px #2121210A`,
  };
}
