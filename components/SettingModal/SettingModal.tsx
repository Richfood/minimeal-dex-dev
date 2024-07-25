import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { IoCloseOutline } from 'react-icons/io5';
import { BsQuestionCircle } from 'react-icons/bs';
import { FormControlLabel, styled, Switch, SwitchProps, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';
import { useTheme } from '../ThemeContext';
import ExpertModeModal from '../ExpertModeModal/ExpertModeModal';

interface SettingsModalProps {
    isOpen: boolean;
    handleClose: () => void;
    theme: 'light' | 'dark'; // Assuming you have a theme prop
}


const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.mode === 'light' ? 'var(--primary)' : 'var(--white)',
      color: theme.palette.mode === 'light' ? 'var(--white)' : 'var(--primary)',
      boxShadow: theme.shadows[1],
      fontSize: 12,
      padding: '10px'
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: '#173D3D',
    },
  }));

const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(0px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.mode === 'dark' ? '#39393d' : '#39393d',
                opacity: 1,
                border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color:
                theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[600],
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22,
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#E9E9EA',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
    },
}));

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, handleClose, theme }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(0);
    const [isExpertModalOpen, setExpertModalOpen] = useState<boolean>(false);

    const slipToggleClass = (index: number) => {
        setActiveIndex(index === activeIndex ? null : index);
    };

    

    const { toggleTheme } = useTheme(); // Assuming you have a toggleTheme function in your useTheme hook

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        fontSize: '14px',
        fontWeight: '500',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: theme === 'light' ? 'var(--white)' : 'var(--primary)',
        boxShadow: 'rgba(0, 0, 0, 0.24) -40px 40px 80px -8px',
        borderRadius: '16px',
        color: theme === 'light' ? 'var(--primary)' : 'var(--white)',
    };

    const openExpertModal = () => setExpertModalOpen(true);
    const closeExpertModal = () => setExpertModalOpen(false);

    return (
        <>
            <Modal
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box className="modal_head">
                        <Typography variant="h6" >
                            Settings
                        </Typography>
                        <IoCloseOutline onClick={handleClose} size={24} style={{ cursor: 'pointer' }} />
                    </Box>
                    <Box className="modal_body">
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: '12px',
                                    textTransform: 'uppercase',
                                    fontWeight: '600',
                                    mb: '15px',
                                    color: theme === 'light' ? 'var(--primary)' : 'var(--white)',
                                    letterSpacing: '1px',
                                }}
                            >
                                SWAPS & LIQUIDITY
                            </Typography>
                        </Box>
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    display: 'flex',
                                    gap: '5px',
                                    alignItems: 'center',
                                    mb: '15px',
                                }}
                            >
                                Slippage Tolerance
                                <Tooltip
                                    title="Setting a high slippage tolerance can help transactions succeed, but you may not get such a good price. Use with caution."
                                    arrow
                                    placement="top"
                                >
                                    <BsQuestionCircle />
                                </Tooltip>
                            </Typography>
    
                            <Box className="Slippage_Tolerance">
                                <Box className="Slippage_items">
                                    <Button
                                        className={` ${activeIndex === 0 ? 'active transFail' : ''}`}
                                        onClick={() => slipToggleClass(0)}
                                        sx={{
                                            bgcolor: theme === 'light' ? '#F7F0DF' : '#1f4e4e',
                                            color: theme === 'light' ? 'var(--primary)' : 'var(--white)',
                                            '&:hover': { background: theme === 'light' ? '#F7F0DF' : '#1f4e4e' },
                                        }}
                                    >
                                        0.1%
                                    </Button>
                                </Box>
    
                                <Box className="Slippage_items">
                                    <Button
                                        className={activeIndex === 1 ? 'active' : ''}
                                        onClick={() => slipToggleClass(1)}
                                        sx={{
                                            bgcolor: theme === 'light' ? '#F7F0DF' : '#1f4e4e',
                                            color: theme === 'light' ? 'var(--primary)' : 'var(--white)',
                                            '&:hover': { background: theme === 'light' ? '#F7F0DF' : '#1f4e4e' },
                                        }}
                                    >
                                        0.5%
                                    </Button>
                                </Box>
    
                                <Box className="Slippage_items">
                                    <Button
                                        className={activeIndex === 2 ? 'active' : ''}
                                        onClick={() => slipToggleClass(2)}
                                        sx={{
                                            bgcolor: theme === 'light' ? '#F7F0DF' : '#1f4e4e',
                                            color: theme === 'light' ? 'var(--primary)' : 'var(--white)',
                                            '&:hover': { background: theme === 'light' ? '#F7F0DF' : '#1f4e4e' },
                                        }}
                                    >
                                        1.0%
                                    </Button>
                                </Box>
    
                                <Box className="Slippage_items Slippage_input" sx={{ display: 'flex', alignItems: 'center', gap: '5px', mb: '20px' }}>
                                    <input type="text" placeholder="2.00" className={`${theme === 'light' ? 'lightInput' : 'darkInput'}`} />
                                    <Typography sx={{ fontSize: '18px', fontWeight: '700' }}>%</Typography>
                                </Box>
                            </Box>
                            <Box className="transFailContent" sx={{ mb: '20px' }}>
                                <Typography sx={{ fontSize: '12px', color: '#FF5630', fontWeight: '700' }}>Your transaction may fail</Typography>
                            </Box>
    
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '20px' }}>
                                <Typography sx={{ fontSize: '16px', fontWeight: '600', display: 'flex', gap: '5px', alignItems: 'center' }}>
                                    Tx deadline (mins)
                                    <Tooltip
                                        title="Your transaction will revert if it is left confirming for longer than this time."
                                        arrow
                                        placement="top"
                                    >
                                        <BsQuestionCircle />
                                    </Tooltip>
                                </Typography>
                                <Box className="Slippage_input">
                                    <input type="text" placeholder="2.00" className={`${theme === 'light' ? 'lightInput' : 'darkInput'}`} />
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '20px' }}>
                                <Typography sx={{ fontSize: '16px', fontWeight: '600', display: 'flex', gap: '5px', alignItems: 'center' }}>
                                    Expert Mode
                                    <Tooltip
                                        title="Bypasses confirmation modals and allows high slippage trades. Use at your own risk."
                                        arrow
                                        placement="top"
                                    >
                                        <BsQuestionCircle />
                                    </Tooltip>
                                </Typography>
                                <Box sx={{ textAlign: 'end' }}>
                                    <FormControlLabel control={<IOSSwitch onChange={openExpertModal} />} label="" />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Modal>
    
            <ExpertModeModal isOpen={isExpertModalOpen} handleCloseExpert={closeExpertModal} theme={theme} />
        </>
    );
};

export default SettingsModal;
