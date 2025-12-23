import { useState, useEffect, useCallback } from 'react';
import { ThemeConfigService } from 'src/services/firebase/theme-config.service';
import type { ColorItem } from 'src/components/color-editor';

export type ColorPalette = {
  [key: string]: ColorItem[];
};

export interface UseColorPaletteOptions {
  defaultPalette?: ColorPalette;
  enableFirebaseSync?: boolean;
}

export interface UseColorPaletteReturn {
  palette: ColorPalette;
  isLoading: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  error: string | null;
  savePalette: () => Promise<void>;
  resetPalette: () => Promise<void>;
  exportPalette: () => void;
  updateColor: (
    groupName: string,
    index: number,
    mode: 'light' | 'dark',
    newColor: string
  ) => void;
}

export function useColorPalette(
  options: UseColorPaletteOptions = {}
): UseColorPaletteReturn {
  const { defaultPalette = {}, enableFirebaseSync = true } = options;

  const [palette, setPalette] = useState<ColorPalette>(defaultPalette);
  const [isLoading, setIsLoading] = useState(enableFirebaseSync);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load palette from Firebase on mount
  const loadPalette = useCallback(async () => {
    if (!enableFirebaseSync) return;

    setIsLoading(true);
    setError(null);

    try {
      const firebasePalette = await ThemeConfigService.getColorPalette();

      if (firebasePalette) {
        setPalette(firebasePalette as unknown as ColorPalette);
      } else if (Object.keys(defaultPalette).length > 0) {
        // Initialize Firebase with default palette
        await ThemeConfigService.updateColorPalette(defaultPalette as any);
        setPalette(defaultPalette);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load palette';
      setError(errorMessage);
      console.error('Error loading color palette:', err);
      // Fallback to default palette
      setPalette(defaultPalette);
    } finally {
      setIsLoading(false);
    }
  }, [defaultPalette, enableFirebaseSync]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!enableFirebaseSync) return;

    const unsubscribe = ThemeConfigService.subscribeToColorPalette((firebasePalette) => {
      if (firebasePalette) {
        setPalette(firebasePalette as unknown as ColorPalette);
        setHasUnsavedChanges(false);
      }
    });

    return () => unsubscribe();
  }, [enableFirebaseSync]);

  // Initial load
  useEffect(() => {
    loadPalette();
  }, [loadPalette]);

  // Update a single color
  const updateColor = useCallback(
    (groupName: string, index: number, mode: 'light' | 'dark', newColor: string) => {
      setPalette((prev) => {
        const updated = { ...prev };
        const colors = [...(updated[groupName] || [])];

        if (colors[index]) {
          colors[index] = {
            ...colors[index],
            [mode === 'light' ? 'lightColor' : 'darkColor']: newColor,
          };
          updated[groupName] = colors;
        }

        return updated;
      });

      setHasUnsavedChanges(true);
    },
    []
  );

  // Save palette to Firebase
  const savePalette = useCallback(async () => {
    if (!enableFirebaseSync) return;

    setIsSaving(true);
    setError(null);

    try {
      await ThemeConfigService.updateColorPalette(palette as any);
      // Also backup to localStorage
      localStorage.setItem('colorPalette', JSON.stringify(palette));
      setHasUnsavedChanges(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save palette';
      setError(errorMessage);
      console.error('Error saving color palette:', err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [palette, enableFirebaseSync]);

  // Reset to Firebase version
  const resetPalette = useCallback(async () => {
    await loadPalette();
    setHasUnsavedChanges(false);
  }, [loadPalette]);

  // Export palette as JSON
  const exportPalette = useCallback(() => {
    const dataStr = JSON.stringify(palette, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `color-palette-${timestamp}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [palette]);

  return {
    palette,
    isLoading,
    isSaving,
    hasUnsavedChanges,
    error,
    savePalette,
    resetPalette,
    exportPalette,
    updateColor,
  };
}
