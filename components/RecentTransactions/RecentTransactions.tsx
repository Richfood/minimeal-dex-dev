// components/RecentTransactions.tsx

import React from 'react';
import { Box, Typography, Button, Modal } from '@mui/material';
import { IoCloseOutline } from 'react-icons/io5';
import { useTheme } from '../ThemeContext';

interface RecentTransactionsProps {
    open: boolean;
    onClose: () => void;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ open, onClose }) => {
    const { theme } = useTheme();

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        fontSize: '14px',
        fontWeight: '500',
        transform: 'translate(-50%, -50%)',
        maxWidth: 400,
        width: 'calc(100% - 30px)',
        bgcolor: theme === 'light' ? 'var(--white)' : 'var(--primary)',
        boxShadow: 'rgba(0, 0, 0, 0.24) -40px 40px 80px -8px',
        borderRadius: '16px',
        color: theme === 'light' ? 'var(--primary)' : 'var(--white)',
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Box className="modal_head">
                    <Typography  variant="h6">
                        Recent Transactions
                    </Typography>
                    <Typography sx={{ position: 'absolute', right: '10px', top: '5px', lineHeight: 'normal', cursor: 'pointer' }}>
                        <IoCloseOutline onClick={onClose} size={24} />
                    </Typography>
                </Box>
                <Box className="modal_body" sx={{ textAlign: 'center' }}>
                    <Button variant="contained" color="secondary">Connect Wallet</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default RecentTransactions;