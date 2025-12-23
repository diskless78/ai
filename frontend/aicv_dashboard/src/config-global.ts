import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  expandedSidebar: boolean;
  toggleLanguage: boolean;
  toggleTheme: boolean;
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  appName: 'CXVIEW Dashboard',
  appVersion: packageJson.version,
  expandedSidebar: false,
  toggleLanguage: false,
  toggleTheme: false,
};
