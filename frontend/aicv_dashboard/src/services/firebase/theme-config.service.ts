import { ref, set, get, onValue, off, type Unsubscribe } from 'firebase/database';
import { database } from 'src/config/firebase.config';
import type { ColorItem } from 'src/components/color-editor';

/**
 * Theme color palette structure
 * Supports multiple color groups (red, blue, green, etc.)
 */
export interface ThemeColorPalette {
  [key: string]: ColorItem[];
}

/**
 * Firebase paths for theme configuration
 */
const FIREBASE_PATHS = {
  THEME_CONFIG: 'theme-config',
  COLORS: 'theme-config/colors',
} as const;

/**
 * Error types for better error handling
 */
export class ThemeConfigError extends Error {
  constructor(
    message: string,
    public code: 'FETCH_ERROR' | 'UPDATE_ERROR' | 'SUBSCRIBE_ERROR' | 'INIT_ERROR'
  ) {
    super(message);
    this.name = 'ThemeConfigError';
  }
}

/**
 * Theme Configuration Service
 * Manages color palette configuration using Firebase Realtime Database
 */
export class ThemeConfigService {
  /**
   * Get the current theme color palette from Firebase
   * @returns Promise<ThemeColorPalette | null>
   * @throws ThemeConfigError if fetch fails
   */
  static async getColorPalette(): Promise<ThemeColorPalette | null> {
    try {
      const colorRef = ref(database, FIREBASE_PATHS.COLORS);
      const snapshot = await get(colorRef);

      if (snapshot.exists()) {
        return snapshot.val() as ThemeColorPalette;
      }

      return null;
    } catch (error) {
      console.error('[ThemeConfigService] Error fetching color palette:', error);
      throw new ThemeConfigError(
        'Failed to fetch color palette from Firebase',
        'FETCH_ERROR'
      );
    }
  }

  /**
   * Update the entire color palette in Firebase
   * @param palette - The complete color palette to save
   * @throws ThemeConfigError if update fails
   */
  static async updateColorPalette(palette: ThemeColorPalette): Promise<void> {
    try {
      const colorRef = ref(database, FIREBASE_PATHS.COLORS);
      await set(colorRef, palette);
      console.log('[ThemeConfigService] Color palette updated successfully');
    } catch (error) {
      console.error('[ThemeConfigService] Error updating color palette:', error);
      throw new ThemeConfigError(
        'Failed to update color palette in Firebase',
        'UPDATE_ERROR'
      );
    }
  }

  /**
   * Update a specific color group (e.g., 'red', 'blue')
   * @param groupName - Name of the color group
   * @param colors - Array of colors for this group
   * @throws ThemeConfigError if update fails
   */
  static async updateColorGroup(groupName: string, colors: ColorItem[]): Promise<void> {
    try {
      const groupRef = ref(database, `${FIREBASE_PATHS.COLORS}/${groupName}`);
      await set(groupRef, colors);
      console.log(`[ThemeConfigService] Color group '${groupName}' updated successfully`);
    } catch (error) {
      console.error(`[ThemeConfigService] Error updating ${groupName} color group:`, error);
      throw new ThemeConfigError(
        `Failed to update ${groupName} color group`,
        'UPDATE_ERROR'
      );
    }
  }

  /**
   * Update a single color in a specific group
   * @param groupName - Name of the color group
   * @param index - Index of the color in the group
   * @param mode - 'light' or 'dark' mode
   * @param newColor - New hex color value
   * @throws ThemeConfigError if update fails
   */
  static async updateSingleColor(
    groupName: string,
    index: number,
    mode: 'light' | 'dark',
    newColor: string
  ): Promise<void> {
    try {
      const colorField = mode === 'light' ? 'lightColor' : 'darkColor';
      const colorPath = `${FIREBASE_PATHS.COLORS}/${groupName}/${index}/${colorField}`;
      const colorRef = ref(database, colorPath);
      await set(colorRef, newColor);
      console.log(
        `[ThemeConfigService] Updated ${groupName}[${index}].${colorField} to ${newColor}`
      );
    } catch (error) {
      console.error('[ThemeConfigService] Error updating single color:', error);
      throw new ThemeConfigError('Failed to update color', 'UPDATE_ERROR');
    }
  }

  /**
   * Subscribe to real-time color palette updates
   * @param callback - Function to call when data changes
   * @returns Unsubscribe function to stop listening
   */
  static subscribeToColorPalette(
    callback: (palette: ThemeColorPalette | null) => void
  ): Unsubscribe {
    try {
      const colorRef = ref(database, FIREBASE_PATHS.COLORS);

      const listener = onValue(
        colorRef,
        (snapshot) => {
          if (snapshot.exists()) {
            callback(snapshot.val() as ThemeColorPalette);
          } else {
            callback(null);
          }
        },
        (error) => {
          console.error('[ThemeConfigService] Error in color palette subscription:', error);
          // Don't throw here, just log - subscription errors shouldn't crash the app
        }
      );

      // Return unsubscribe function
      return () => {
        off(colorRef, 'value', listener);
        console.log('[ThemeConfigService] Unsubscribed from color palette updates');
      };
    } catch (error) {
      console.error('[ThemeConfigService] Error setting up subscription:', error);
      throw new ThemeConfigError(
        'Failed to subscribe to color palette updates',
        'SUBSCRIBE_ERROR'
      );
    }
  }

  /**
   * Initialize default color palette if none exists
   * @param defaultPalette - Default palette to initialize with
   * @throws ThemeConfigError if initialization fails
   */
  static async initializeDefaultPalette(
    defaultPalette: ThemeColorPalette
  ): Promise<boolean> {
    try {
      const existing = await this.getColorPalette();

      if (!existing) {
        await this.updateColorPalette(defaultPalette);
        console.log('[ThemeConfigService] Default color palette initialized');
        return true;
      }

      console.log('[ThemeConfigService] Color palette already exists, skipping initialization');
      return false;
    } catch (error) {
      console.error('[ThemeConfigService] Error initializing default palette:', error);
      throw new ThemeConfigError(
        'Failed to initialize default color palette',
        'INIT_ERROR'
      );
    }
  }

  /**
   * Clear all color palette data (use with caution!)
   * @throws ThemeConfigError if deletion fails
   */
  static async clearColorPalette(): Promise<void> {
    try {
      const colorRef = ref(database, FIREBASE_PATHS.COLORS);
      await set(colorRef, null);
      console.log('[ThemeConfigService] Color palette cleared');
    } catch (error) {
      console.error('[ThemeConfigService] Error clearing color palette:', error);
      throw new ThemeConfigError('Failed to clear color palette', 'UPDATE_ERROR');
    }
  }
}
