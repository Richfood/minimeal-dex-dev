// components/CustomTooltip.tsx
import React from 'react';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.mode === 'light' ? 'var(--primary)' : 'var(--white)',
        color: theme.palette.mode === 'light' ? 'var(--white)' : 'var(--primary)',
        boxShadow: theme.shadows[1],
        fontSize: '12px',
        padding: '10px',
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.mode === 'light' ? 'var(--primary)' : 'var(--white)',
    },
}));

export default CustomTooltip;
