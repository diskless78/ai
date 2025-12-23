import styled from '@emotion/styled';

export const ColorEditorContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-width: 900px;
  margin: 0 auto;
`;

export const ColorRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f9fafb;

    .edit-button {
      opacity: 1;
    }
  }
`;

export const ColorLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
`;

export const ColorDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

export const ColorCircle = styled.div<{ color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => props.color};
  border: 2px solid #e5e7eb;
  flex-shrink: 0;
`;

export const ColorCode = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
`;

export const EditButton = styled.button`
  opacity: 0;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e5e7eb;
    color: #1f2937;
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const ColorInput = styled.input`
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  border: 2px solid #3b82f6;
  border-radius: 6px;
  padding: 6px 10px;
  outline: none;
  background: #ffffff;
  width: 100px;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const ActionBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => props.variant === 'primary' ? `
    background: #3b82f6;
    color: #ffffff;

    &:hover:not(:disabled) {
      background: #2563eb;
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }
  ` : `
    background: #f3f4f6;
    color: #4b5563;

    &:hover:not(:disabled) {
      background: #e5e7eb;
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export const StatusMessage = styled.div<{ type: 'success' | 'error' }>`
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  animation: slideIn 0.3s ease;

  ${props => props.type === 'success' ? `
    background: #d1fae5;
    color: #065f46;
  ` : `
    background: #fee2e2;
    color: #991b1b;
  `}

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
