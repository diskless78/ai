import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { pxToRem } from 'src/theme/styles';
import {
  focusOutlineMixin,
  inputTokens,
} from 'src/theme/styles/input-components';
import { baseIconClasses } from 'src/components/svg/svg-color';

export const StyleInputDateRange = styled(Box)(({ theme }) => {
  const borderColorDefault = theme.palette.neutral[20];
  const borderColorFocus = theme.palette.blue[60];

  return {
    position: 'relative',
    display: 'inline-block',

    // Focus outline effect
    ...focusOutlineMixin(theme, 'normal'),

    '& .MuiInputDateRange-root': {
      padding: `${pxToRem(8)} ${pxToRem(36)} ${pxToRem(8)} ${pxToRem(8)}`,
      gap: pxToRem(4),
      width: '100%',
      height: inputTokens.height.medium,
      backgroundColor: theme.palette.neutral[10],
      borderRadius: inputTokens.borderRadius,
      border: `${inputTokens.borderWidth} solid ${borderColorDefault}`,
      alignItems: 'center',
      justifyContent: 'center',

      [`& .${baseIconClasses.root}`]: {
        width: pxToRem(24),
        height: pxToRem(24),
        color: theme.palette.neutral[100],
      },

      '& .MuiInputBase-root': {
        height: inputTokens.height.medium,
        cursor: 'pointer',
        border: 'none',

        '& input': {
          ...theme.typography.body2,
          WebkitTextFillColor: theme.palette.neutral[100],
          color: theme.palette.neutral[100],
          boxSizing: 'border-box',
          padding: 0,
          width: pxToRem(88),
        },

        '& fieldset': {
          border: 'none',
        },
      },
    },
    // 👇 border when focused
    '&.focused .MuiInputDateRange-root': {
      borderColor: borderColorFocus,
    },

    '&:hover .MuiInputDateRange-root': {
      borderColor: borderColorFocus,
    },
  };
});

export const StyledModalDateRange = styled(Box)<{
  ownerState: {
    alignRight: boolean;
  };
}>(({ theme, ownerState: { alignRight } }) => {
  return {
    position: 'absolute',
    top: '100%',
    left: alignRight ? 'auto' : 0,
    right: alignRight ? 0 : 'auto',
    zIndex: 999,
    backgroundColor: 'white',
    boxShadow: '0px 4px 8px rgba(0,0,0,0.15)',
    marginTop: '10px',

    '& .rdrCalendarWrapper': {
      '& .rdrDateDisplayWrapper': {
        display: 'none',
      },
      '& .rdrMonths': {
        '& .rdrMonth': {
          '& .rdrDay': {
            height: pxToRem(46),

            '& .rdrInRange': {
              background: theme.palette.purple[10],
            },
            '& .rdrDayNumber > span': {
              color: 'rgba(27, 27, 31, 1)',
            },

            // '&.rdrDayStardPrevious': {
            //   background: 'linear-gradient(180deg, #9333EA 0%, #7D16E0 100%)',
            // },

            '& .rdrStartEdge': {
              background: 'linear-gradient(180deg, #9333EA 0%, #7D16E0 100%)',
              '&.rdrDayNumber > span': {
                color: 'white!important',
              },
            },
            '& .rdrEndEdge': {
              background: 'linear-gradient(180deg, #9333EA 0%, #7D16E0 100%)',
            },
          },
        },
      },
    },
  };
});
