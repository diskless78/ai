import { Box, styled, Button } from '@mui/material';
import { pxToRem } from 'src/theme/styles';

interface StyleNotifyModalProps {
    type: 'delete' | 'confirm' | 'caution';
}

export const StyledNotifyModal = styled(Box)<{
    ownerState: StyleNotifyModalProps;
}>(({ theme, ownerState: { type } }) => {
    const getIconColor = () => {
        switch (type) {
            case 'delete':
                return theme.palette.orange[70];
            case 'confirm':
                return theme.palette.blue[60];
            case 'caution':
                return theme.palette.orange[70];
            default:
                return theme.palette.blue[60];
        }
    };

    return {
        width: pxToRem(350),
        backgroundColor: 'white',
        border: '1px solid #0000001A',
        borderRadius: pxToRem(8),
        boxShadow: theme.customShadows.card0,
        display: 'flex',
        flexDirection: 'column',
        gap: pxToRem(20),
        '& .MuiBaseIcon-root': {
            color: getIconColor(),
        },
        // '& > div:nth-of-type(2) button:nth-of-type(2)': {
        //     ...(type === 'delete' && {
        //         backgroundColor: `${theme.palette.red[60]}!important`,
        //         '&:hover': {
        //             backgroundColor: `${theme.palette.red[60]}!important`,
        //         },
        //     }),
        // },
    };
});
