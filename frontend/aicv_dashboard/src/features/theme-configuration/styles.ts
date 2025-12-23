import styled from '@emotion/styled';

export const PageContainer = styled.div`
  min-height: 100vh;
  background: #f9fafb;
  padding: 32px;
`;

export const PageHeader = styled.div`
  margin-bottom: 32px;
`;

export const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
`;

export const PageDescription = styled.p`
  font-size: 16px;
  color: #6b7280;
  margin: 0;
`;

export const PageContent = styled.div`
  max-width: 1200px;
`;

export const AlertBox = styled.div<{ type: 'info' | 'error' }>`
  display: flex;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  border-left: 4px solid;

  ${props => props.type === 'info' ? `
    background: #eff6ff;
    border-color: #3b82f6;
    color: #1e40af;

    svg {
      color: #3b82f6;
      flex-shrink: 0;
    }
  ` : `
    background: #fef2f2;
    border-color: #ef4444;
    color: #991b1b;

    svg {
      color: #ef4444;
      flex-shrink: 0;
    }
  `}

  strong {
    display: block;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  p {
    margin: 4px 0 0 0;
    font-size: 14px;
    line-height: 1.6;
  }

  code {
    background: rgba(0, 0, 0, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
    font-size: 13px;
  }
`;

export const InitButton = styled.button`
  margin-top: 12px;
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
