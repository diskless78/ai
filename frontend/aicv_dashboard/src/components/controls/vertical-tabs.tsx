import { Tab, Tabs, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePathname } from 'src/routes/hooks';
import { pxToRem } from 'src/theme/styles';

export type VerticalTabsData = {
  label: string;
  value: string;
};

type Props = {
  data: VerticalTabsData[];
  onChangeValue?: (newValue: string) => void;
};

function VerticalTabs({ data, onChangeValue }: Props) {
  const pathname = usePathname();
  const activeTab = data.find((tab) => pathname.startsWith(tab.value))?.value;

  useEffect(() => {
    if (onChangeValue && activeTab) {
      onChangeValue(activeTab);
    }
  }, [activeTab, onChangeValue]);

  return (
    <Tabs
      orientation='vertical'
      variant='scrollable'
      value={activeTab}
      onChange={(_: React.SyntheticEvent, newValue: string) => {
        onChangeValue && onChangeValue(newValue);
      }}
      aria-label='Vertical tabs'
      TabIndicatorProps={{
        sx: {
          display: 'none',
          left: 0,
          top: `${pxToRem(6)} !important`,
          height: `${pxToRem(32)} !important`,
        },
      }}
      sx={{
        position: 'fixed',
        paddingTop: pxToRem(16),
        paddingBottom: pxToRem(16),
        borderRadius: pxToRem(12),
        backgroundColor: 'background.section',
        '& .MuiButtonBase-root': {
          color: 'neutral.500',
          position: 'relative',
          height: pxToRem(44),
          minHeight: pxToRem(44),
          alignItems: 'start',
          paddingLeft: pxToRem(16),
          paddingRight: pxToRem(16),
          '& .MuiTypography-root': {
            width: pxToRem(242),
            padding: `${pxToRem(11.5)} ${pxToRem(16)}`,
            color: 'text.body',
            textAlign: 'left',
            borderRadius: pxToRem(12),
            opacity: 0.5,
          },
          '&.Mui-selected': {
            '&:after': {
              position: 'absolute',
              content: '""',
              top: pxToRem(6),
              left: 0,
              height: pxToRem(32),
              width: pxToRem(4),
              backgroundColor: 'pink.700',
              borderTopRightRadius: pxToRem(4),
              borderBottomRightRadius: pxToRem(4),
            },
            '& .MuiTypography-root': {
              backgroundColor: 'background.tabdefault',
              borderColor: '#FFFFFF0D',
              opacity: 1,
            },
          },
        },
      }}
    >
      {data.map((item) => (
        <Tab
          key={item.value}
          value={item.value}
          component={Link}
          to={item.value}
          disableRipple
          label={<Typography>{item.label}</Typography>}
        />
      ))}
    </Tabs>
  );
}

export default VerticalTabs;
