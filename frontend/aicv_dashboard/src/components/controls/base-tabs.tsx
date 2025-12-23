import { Box, Tab, Tabs, useTheme, Typography } from '@mui/material';
import { pxToRem } from 'src/theme/styles';

export type BaseTabsData = {
  label: string;
  value: number;
};

type BaseTabsVariant = 'fullWidth' | 'standard';

type Props = {
  value: number;
  onChangeValue: (newValue: number) => void;
  data: BaseTabsData[];
  variant?: BaseTabsVariant;
  gap?: number | string;
};

export default function BaseTabs({
  value,
  onChangeValue,
  data,
  variant = 'standard',
  gap,
}: Props) {
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={value}
        variant={variant}
        onChange={(_: React.SyntheticEvent, newValue: number) => {
          onChangeValue(newValue);
        }}
        TabIndicatorProps={{
          style: { backgroundColor: '#187EDF', height: '2px' },
        }}
        sx={{
          minHeight: pxToRem(41),
          '& .MuiTabs-flexContainer': {
            borderBottom: '1px solid',
            borderBottomColor: theme.palette.primary.light,
            gap,
          },
          '& .MuiTab-root': {
            '&.MuiButtonBase-root': {
              color: 'white',
              opacity: 0.3,
              minHeight: pxToRem(41),
              minWidth:
                variant === 'fullWidth' ? `calc(100% / ${data.length})` : null,
              py: pxToRem(10),
              px: pxToRem(6),
            },
            '&.Mui-selected': {
              opacity: 1,
            },
          },
        }}
      >
        {data.map((item) => (
          <Tab
            key={item.value}
            value={item.value}
            disableRipple
            label={<Typography variant='body1'>{item.label}</Typography>}
          />
        ))}
      </Tabs>
    </Box>
  );
}
