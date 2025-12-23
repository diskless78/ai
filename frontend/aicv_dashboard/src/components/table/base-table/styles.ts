import { TableContainer } from '@mui/material';
import { styled } from '@mui/material/styles';
import { pxToRem } from 'src/theme/styles';
import type { RowHighlightRule } from './types';

interface StyledTableOwnerState<T> {
  heightRow: number;
  rowHighlightConfig?: Record<string, RowHighlightRule<T>>;
  dataItems: T[];
  keyField: string;
  disabledIds: string[];
}

export function createStyledBaseTable<T>() {
  return styled(TableContainer)<{
    component?: React.ElementType;
    ownerState: StyledTableOwnerState<T>;
  }>(({ theme, ownerState }) => {
    const { heightRow, rowHighlightConfig, dataItems, keyField, disabledIds } =
      ownerState;

    const rowStyles: any = {};

    dataItems.forEach((row, index) => {
      const isPeak = rowHighlightConfig
        ? Object.keys(rowHighlightConfig).some(
            (key) => key === 'peak' && rowHighlightConfig[key].match(row, index)
          )
        : false;

      const isTotal = rowHighlightConfig
        ? Object.keys(rowHighlightConfig).some(
            (key) =>
              key === 'total' && rowHighlightConfig[key].match(row, index)
          )
        : false;

      const bgColor = isTotal
        ? theme.palette.neutral[10]
        : isPeak
          ? theme.palette.orange[10]
          : 'transparent';
      const hoverBgColor = isTotal
        ? theme.palette.neutral[10]
        : isPeak
          ? theme.palette.orange[10]
          : theme.palette.action.hover;
      const typography = isTotal ? theme.typography.t2SemiBold : null;
      const isDisabled = disabledIds.includes(row[keyField]);

      rowStyles[
        `& .MuiTableBody-root .MuiTableRow-root:nth-of-type(${index + 1})`
      ] = {
        backgroundColor: bgColor,
        transition: 'background-color 0.2s ease',

        '&:hover': {
          backgroundColor: hoverBgColor,
        },

        '& .MuiTableCell-root': {
          position: 'relative',
          ...(typography ? { ...typography } : {}),
          opacity: isDisabled ? 0.5 : 1,
        },

        ...(isPeak && {
          '& .MuiTableCell-root:first-of-type::before': {
            content: '"Peak"',
            position: 'absolute',
            left: pxToRem(11),
            top: '50%',
            transform: 'translateY(-50%)',
            padding: `${pxToRem(1)} ${pxToRem(4)} ${pxToRem(1)} ${pxToRem(4)}`,
            backgroundColor: theme.palette.orange[50],
            color: theme.palette.neutral[0],
            borderRadius: pxToRem(2),
            ...theme.typography.b4Medium,
            whiteSpace: 'nowrap',
          },
        }),
      };
    });

    return {
      borderRadius: pxToRem(8),
      overflow: 'hidden',

      '& .MuiTable-root': {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: 0,
        backgroundColor: theme.palette.neutral[0],
        borderRadius: pxToRem(8),

        '& .MuiTableHead-root': {
          '& .MuiTableRow-root': {
            '& .MuiTableCell-root': {
              ...theme.typography.t3Bold,
              color: theme.palette.neutral[999],
              backgroundColor: theme.palette.neutral[10],
              height: pxToRem(46),
              padding: `0 ${pxToRem(20)}`,
              borderBottom: 'none',
              border: 'none',
            },
          },
        },

        '& .MuiTableBody-root': {
          '& .MuiTableRow-root': {
            '& .MuiTableCell-root': {
              ...theme.typography.t3SemiBold,
              color: theme.palette.neutral[999],
              height: pxToRem(heightRow),
              padding: `0 ${pxToRem(20)}`,
              borderBottom: '1px solid',
              borderBottomColor: theme.palette.neutral[10],
            },

            '&:last-child': {
              '& .MuiTableCell-root': {
                // borderBottom: 'none',
                '&:first-of-type': {
                  borderBottomLeftRadius: pxToRem(8),
                },
                '&:last-of-type': {
                  borderBottomRightRadius: pxToRem(8),
                },
              },
            },
          },
        },

        ...rowStyles,
      },
    };
  });
}
