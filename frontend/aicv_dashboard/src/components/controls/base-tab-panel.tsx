import { Box, type BoxProps } from '@mui/material';

type BaseTabPanelProps = BoxProps & {
  children?: React.ReactNode;
  index: number;
  value: number;
};

export default function BaseTabPanel(props: BaseTabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role='tabpanel'
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      sx={{
        display: value === index ? 'flex' : 'none',
        flex: '1 1 auto',
        flexDirection: 'column',
      }}
      {...other}
    >
      <Box sx={{ p: 0 }}>{children}</Box>
    </Box>
  );
}
