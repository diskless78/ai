import React, { type FormEventHandler } from 'react';
import Column from 'src/components/common/column';
import { Scrollbar } from 'src/components/scrollbar';
import ToolbarModal, {
  type ToolbarModalProps,
} from '../toolbar-modal/toolbar-modal';

interface Props extends ToolbarModalProps {
  onSubmit?: FormEventHandler<HTMLFormElement>;
  children: React.ReactNode;
}

export default function BodyModal({
  onSubmit,
  children,
  textCancel,
  textSubmit,
  onCancel,
  onAccept,
  disabled,
}: Props) {
  return (
    <form onSubmit={onSubmit} style={{ height: '100%' }}>
      <Column sx={{ height: '100%', overflow: 'hidden' }}>
        <Scrollbar sx={{ height: '100%' }}>{children}</Scrollbar>
        <ToolbarModal
          textCancel={textCancel}
          textSubmit={textSubmit}
          onCancel={onCancel}
          onAccept={onAccept}
          disabled={disabled}
        />
      </Column>
    </form>
  );
}
