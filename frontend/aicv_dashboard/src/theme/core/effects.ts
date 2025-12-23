export interface Effect {
  primary?: { boxShadow: string; backdropFilter: string };
  secondary?: { boxShadow: string; backdropFilter: string };
}

declare module '@mui/material/styles' {
  interface Theme {
    effect: Effect;
  }
  interface ThemeOptions {
    effect?: Effect;
  }
  interface ThemeVars {
    effect: Effect;
  }
}

export function effects() {
  return {
    primary: {
      boxShadow: '2px 2px 50px 0px #0D0D0D29',
      backdropFilter: 'blur(50px)',
    },
    secondary: {
      boxShadow: '0px 2px 80px 0px #14236480',
      backdropFilter: 'blur(29.899999618530273px)',
    },
  };
}
