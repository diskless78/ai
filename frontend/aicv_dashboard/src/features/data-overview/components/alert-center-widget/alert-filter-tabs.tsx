import React from 'react';
import { Box, Chip } from '@mui/material';
import { pxToRem } from 'src/theme/styles';

interface Props {
  filter: string;
  onChange: (value: any) => void;
}

const AlertFilterTabs: React.FC<Props> = ({ filter, onChange }) => {
  const tabs = [
    { label: 'Critical', value: 'critical', color: 'orange.80', count: 0 },
    { label: 'Warning', value: 'warning', color: 'orange.50', count: 0 },
    { label: 'Info', value: 'info', color: 'blue.50', count: 0 },
    { label: 'All', value: 'all', count: 0 },
  ];

  return (
    <Box display='flex' gap={1} flexWrap='wrap'>
      {tabs.map((t) => (
        <Chip
          key={t.value}
          label={`${t.label} (${t.count})`}
          onClick={() => onChange(t.value)}
          icon={
            t.color ? (
              <Box
                sx={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  backgroundColor: t.color,
                }}
              />
            ) : undefined
          }
          sx={{
            height: pxToRem(24),
            paddingLeft: pxToRem(5),
            paddingRight: pxToRem(10),
            borderRadius: pxToRem(8),
            backgroundColor: filter === t.value ? 'blue.20' : 'neutral.10',
            color: filter === t.value ? 'purple.100' : 'neutral.60',
            '&:hover': {
              backgroundColor: filter === t.value ? 'blue.20' : 'neutral.10',
            },
            '& .MuiChip-label': {
              paddingLeft: pxToRem(t.color ? 13 : 5),
              paddingRight: pxToRem(0),
            },
          }}
        />
      ))}
    </Box>
  );
};

export default AlertFilterTabs;
