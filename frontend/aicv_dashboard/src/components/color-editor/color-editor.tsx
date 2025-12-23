import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import {
  ColorEditorContainer,
  ColorRow,
  ColorLabel,
  ColorDisplay,
  ColorCircle,
  ColorCode,
  EditButton,
  ColorInput,
} from './styles';

export interface ColorItem {
  label: string;
  lightColor: string;
  darkColor: string;
}

export interface ColorEditorProps {
  title: string;
  colors: ColorItem[];
  onColorChange?: (index: number, mode: 'light' | 'dark', newColor: string) => void;
  readonly?: boolean;
}

export const ColorEditor: React.FC<ColorEditorProps> = ({
  title,
  colors,
  onColorChange,
  readonly = false,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingMode, setEditingMode] = useState<'light' | 'dark' | null>(null);
  const [tempColor, setTempColor] = useState<string>('');

  const handleEditClick = (index: number, mode: 'light' | 'dark', currentColor: string) => {
    if (readonly) return;
    setEditingIndex(index);
    setEditingMode(mode);
    setTempColor(currentColor);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempColor(e.target.value);
  };

  const handleBlur = () => {
    if (editingIndex !== null && editingMode && onColorChange) {
      // Validate hex color
      const hexRegex = /^#[0-9A-Fa-f]{6}$/;
      if (hexRegex.test(tempColor)) {
        onColorChange(editingIndex, editingMode, tempColor);
      }
    }
    setEditingIndex(null);
    setEditingMode(null);
    setTempColor('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditingIndex(null);
      setEditingMode(null);
      setTempColor('');
    }
  };

  if (colors.length === 0) {
    return (
      <ColorEditorContainer>
        <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
          No colors available
        </div>
      </ColorEditorContainer>
    );
  }

  return (
    <ColorEditorContainer>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>{title}</h3>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '120px 1fr 1fr',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        {/* Header Row */}
        <div></div>
        <div style={{ fontSize: '14px', fontWeight: '500', color: '#666' }}>Lightmode</div>
        <div style={{ fontSize: '14px', fontWeight: '500', color: '#666' }}>Darkmode</div>

        {/* Color Rows */}
        {colors.map((color, index) => (
          <React.Fragment key={`${color.label}-${index}`}>
            <ColorLabel>{color.label}</ColorLabel>

            {/* Light Mode */}
            <ColorRow>
              <ColorDisplay>
                <ColorCircle color={color.lightColor} />
                {editingIndex === index && editingMode === 'light' ? (
                  <ColorInput
                    type="text"
                    value={tempColor}
                    onChange={handleColorChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                ) : (
                  <ColorCode>{color.lightColor}</ColorCode>
                )}
              </ColorDisplay>
              {!readonly && (
                <EditButton
                  onClick={() => handleEditClick(index, 'light', color.lightColor)}
                  className="edit-button"
                  aria-label={`Edit ${color.label} light color`}
                >
                  <Pencil size={16} />
                </EditButton>
              )}
            </ColorRow>

            {/* Dark Mode */}
            <ColorRow>
              <ColorDisplay>
                <ColorCircle color={color.darkColor} />
                {editingIndex === index && editingMode === 'dark' ? (
                  <ColorInput
                    type="text"
                    value={tempColor}
                    onChange={handleColorChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                ) : (
                  <ColorCode>{color.darkColor}</ColorCode>
                )}
              </ColorDisplay>
              {!readonly && (
                <EditButton
                  onClick={() => handleEditClick(index, 'dark', color.darkColor)}
                  className="edit-button"
                  aria-label={`Edit ${color.label} dark color`}
                >
                  <Pencil size={16} />
                </EditButton>
              )}
            </ColorRow>
          </React.Fragment>
        ))}
      </div>
    </ColorEditorContainer>
  );
};
