import React from 'react';
import Row from 'src/components/common/row';

export interface SidebarProps {
  width?: number | string;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  return (
    <Row>
      {/* <RootSidebar
        activeId={active}
        onChange={setActive}
        avatarSrc='https://i.pravatar.cc/64'
      /> */}
    </Row>
  );
};
