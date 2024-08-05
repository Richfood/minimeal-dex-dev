// components/ExpertModeModal.tsx

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useTheme } from '../ThemeContext';
import { IoCloseOutline } from 'react-icons/io5';
import { MdKeyboardBackspace } from "react-icons/md";
import { GoAlertFill } from "react-icons/go";
import { Button, FormControl, FormControlLabel, FormGroup } from '@mui/material';
import Customcheckbox from '../Customcheckbox/Customcheckbox'; 

interface ExpertModeModalProps {
    isOpen: boolean;
    handleCloseExpert: () => void;
    theme: 'light' | 'dark'; 
}

const ExpertModeModal: React.FC<ExpertModeModalProps> = ({ isOpen, handleCloseExpert, theme }) => {
    const { theme: currentTheme } = useTheme();

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        fontSize: '14px',
        fontWeight: '500',
        transform: 'translate(-50%, -50%)',
        width: 450,
        bgcolor: theme === 'light' ? 'var(--white)' : 'var(--primary)',
        boxShadow: 'rgba(0, 0, 0, 0.24) -40px 40px 80px -8px',
        borderRadius: '16px',
        color: theme === 'light' ? 'var(--primary)' : 'var(--white)',
    };

    return (
        <Modal
            open={isOpen}
            onClose={handleCloseExpert}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Box className="modal_head">
                    <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <MdKeyboardBackspace onClick={handleCloseExpert} size={24} style={{ cursor: 'pointer' }} />
                        <Typography variant="h6" sx={{ lineHeight: 'normal' }}>
                            Expert Mode
                        </Typography>
                    </Box>
                    <IoCloseOutline onClick={handleCloseExpert} size={24} style={{ cursor: 'pointer' }} />
                </Box>

                <Box className="modal_body" sx={{ my: '15px' }}>
                    <Box className="warning-box">
                        <Box sx={{ color: 'var(--secondary)', fontSize: 20 }}>
                            <GoAlertFill />
                        </Box>
                        <Box sx={{ width: 'calc(100% - 30px)', color: 'var(--primary)' }}>
                            <Typography>Expert mode turns off the 'Confirm' transaction prompt, and allows high slippage trades that often result in bad rates and lost funds.</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ my: '15px' }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: '700' }}>Only use this mode if you know what you’re doing.</Typography>
                    </Box>

                    <Box sx={{ mb: '20px' }}>
                        <FormGroup>
                            <FormControlLabel
                                sx={{ m: '0' }}
                                control={<Customcheckbox />}
                                label={
                                    <>
                                        <Typography sx={{ ml: '5px', fontSize: '14px', mt: '3px', fontWeight: '600' }}>
                                            Don't show this again
                                        </Typography>
                                    </>
                                }
                            />
                        </FormGroup>
                    </Box>

                    <Box sx={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
                        <Button sx={{ width: '100%' }} color="secondary" variant="contained">Turn On Expert Mode</Button>
                        <Button sx={{ width: '100%' }} color="secondary" variant="outlined">Cancel</Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default ExpertModeModal;
