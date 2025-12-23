/**
 * Color palette configuration constants
 */

export const COLOR_PALETTE_CONSTANTS = {
  /**
   * Available color groups in the palette
   */
  COLOR_GROUPS: [
    { key: 'red', title: 'RED' },
    { key: 'orange', title: 'ORANGE' },
    { key: 'yellow', title: 'YELLOW' },
    { key: 'green', title: 'GREEN' },
    { key: 'blue', title: 'BLUE' },
    { key: 'purple', title: 'PURPLE' },
    { key: 'pink', title: 'PINK' },
    { key: 'neutral', title: 'NEUTRAL' },
  ] as const,

  /**
   * Color intensity levels (100 = darkest, 10 = lightest)
   */
  INTENSITY_LEVELS: [100, 90, 80, 70, 60, 50, 40, 30, 20, 10] as const,

  /**
   * LocalStorage key for backup
   */
  STORAGE_KEY: 'colorPalette',

  /**
   * Export filename prefix
   */
  EXPORT_FILENAME_PREFIX: 'color-palette',

  /**
   * Snackbar auto-hide duration (ms)
   */
  SNACKBAR_DURATION: 4000,

  /**
   * Validation regex for hex colors
   */
  HEX_COLOR_REGEX: /^#[0-9A-Fa-f]{6}$/,
} as const;

/**
 * Success/Error messages
 */
export const COLOR_PALETTE_MESSAGES = {
  SUCCESS: {
    SAVE: 'Color palette saved successfully! 🎉',
    EXPORT: 'Exported successfully!',
    RESET: 'Reset to saved version',
    INIT: 'Initialized default color palette',
  },
  ERROR: {
    SAVE: 'Failed to save color palette. Please try again.',
    LOAD: 'Failed to load from Firebase. Using local data.',
    RESET: 'Failed to reset',
    FIREBASE_CONNECTION: 'Failed to connect to Firebase. Using local data.',
  },
  INFO: {
    UNSAVED_CHANGES:
      'You have unsaved changes. Click "Save to Firebase" to sync across all devices.',
  },
} as const;

/**
 * Type helper for color group keys
 */
export type ColorGroupKey = (typeof COLOR_PALETTE_CONSTANTS.COLOR_GROUPS)[number]['key'];

/**
 * Type helper for intensity levels
 */
export type IntensityLevel = (typeof COLOR_PALETTE_CONSTANTS.INTENSITY_LEVELS)[number];
