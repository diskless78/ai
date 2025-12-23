import React, { type FormEventHandler } from 'react';
import Column from 'src/components/common/column';
import { Scrollbar } from 'src/components/scrollbar';
import { pxToRem } from 'src/theme/styles';
import ToolbarDrawer, {
  type ToolbarDrawerProps,
} from '../toolbar-drawer/toolbar-drawer';

interface Props extends ToolbarDrawerProps {
  onSubmit?: FormEventHandler<HTMLFormElement>;
  children: React.ReactNode;
}

export default function BodyDrawer({
  onSubmit,
  children,
  textCancel,
  textSubmit,
  onCancel,
  onAccept,
  disabled,
}: Props) {
  return (
    <Column>
      <form onSubmit={onSubmit}>
        <Scrollbar
          sx={{
            height: `calc(100vh - ${pxToRem(138)})`,
            boxSizing: 'border-box',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {children}
        </Scrollbar>
        <ToolbarDrawer
          textCancel={textCancel}
          textSubmit={textSubmit}
          onCancel={onCancel}
          onAccept={onAccept}
          disabled={disabled}
        />
      </form>
    </Column>
  );
}
