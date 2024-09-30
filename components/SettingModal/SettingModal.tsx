import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { IoCloseOutline } from 'react-icons/io5';
import { BsQuestionCircle } from 'react-icons/bs';
import { FormControlLabel } from '@mui/material';
import CustomTooltip from '../CustomTooltip/CustomTooltip';
import IOSSwitch from '../IOSSwitch/IOSSwitch';
import CustomSwitch from '../CustomSwitch/CustomSwitch';
import ExpertModeModal from '../ExpertModeModal/ExpertModeModal';
import CustomizeRouting from '../CustomizeRouting/CustomizeRouting';

interface SettingsModalProps {
    isOpen: boolean;
    handleClose: () => void;
    theme: 'light' | 'dark';
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, handleClose, theme }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(0);
    const [isExpertModalOpen, setExpertModalOpen] = useState<boolean>(false);
    const [isCustomize, setCustomize] = useState<boolean>(false);

    const slipToggleClass = (index: number) => {
        setActiveIndex(index === activeIndex ? null : index);
    };

    const openExpertModal = () => setExpertModalOpen(true);
    const closeExpertModal = () => setExpertModalOpen(false);

    const openCustomize = () => setCustomize(true);
    const closeCustomize = () => setCustomize(false);

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
        borderRadius: '14px',
        color: theme === 'light' ? 'var(--primary)' : 'var(--white)',
        maxHeight: '80vh',
        overflowY: 'auto',
    };

    return (
        <>
            <Modal
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="settings-modal-title"
                aria-describedby="settings-modal-description"
            >
                <Box sx={style}>
                    <Box className="modal_head" sx={{ position: 'relative', mb: 2 }}>
                        <Typography id="settings-modal-title" variant="h6">
                            Settings
                        </Typography>
                        <IoCloseOutline
                            onClick={handleClose}
                            size={24}
                            style={{ position: 'absolute', right: '10px', top: '5px', cursor: 'pointer' }}
                            aria-label="Close settings modal"
                        />
                    </Box>
                    <Box className="modal_body">
                        <Typography
                            sx={{
                                fontSize: '12px',
                                textTransform: 'uppercase',
                                fontWeight: '600',
                                mb: 2,
                                color: theme === 'light' ? 'var(--primary)' : 'var(--white)',
                                letterSpacing: '1px',
                            }}
                        >
                            SWAPS & LIQUIDITY
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: '14px',
                                fontWeight: '600',
                                display: 'flex',
                                gap: '5px',
                                alignItems: 'center',
                                mb: 2,
                            }}
                        >
                            Slippage Tolerance
                            <CustomTooltip
                                title="Setting a high slippage tolerance can help transactions succeed, but you may not get such a good price. Use with caution."
                                arrow
                                placement="top"
                            >
                                <BsQuestionCircle />
                            </CustomTooltip>
                        </Typography>

                        <Box className="Slippage_Tolerance">
                            {[0.1, 0.5, 1.0].map((value, index) => (
                                <Box key={value} className="Slippage_items">
                                    <Button
                                        className={activeIndex === index ? 'active' : ''}
                                        onClick={() => slipToggleClass(index)}
                                        sx={{
                                            bgcolor: theme === 'light' ? '#F7F0DF' : '#1f4e4e',
                                            color: theme === 'light' ? 'var(--primary)' : 'var(--white)',
                                            '&:hover': { background: theme === 'light' ? '#F7F0DF' : '#1f4e4e' },
                                        }}
                                    >
                                        {value}%
                                    </Button>
                                </Box>
                            ))}

                            <Box className="Slippage_items Slippage_input" sx={{ display: 'flex', alignItems: 'center', gap: '5px', mb: 2 }}>
                                <input
                                    type="number"
                                    placeholder="2.00"
                                    className={theme === 'light' ? 'lightInput' : 'darkInput'}
                                />
                                <Typography sx={{ fontSize: '18px', fontWeight: '700' }}>%</Typography>
                            </Box>
                        </Box>

                        <Box className="transFailContent" sx={{ mb: 2 }}>
                            <Typography sx={{ fontSize: '12px', color: '#FF5630', fontWeight: '700' }}>
                                Your transaction may fail
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography
                                sx={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    display: 'flex',
                                    gap: '5px',
                                    alignItems: 'center',
                                }}
                            >
                                Tx deadline (mins)
                                <CustomTooltip
                                    title="Your transaction will revert if it is left confirming for longer than this time."
                                    arrow
                                    placement="top"
                                >
                                    <BsQuestionCircle />
                                </CustomTooltip>
                            </Typography>
                            <Box className="Slippage_input">
                                <input
                                    type="number"
                                    placeholder="2.00"
                                    className={theme === 'light' ? 'lightInput' : 'darkInput'}
                                />
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography
                                sx={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    display: 'flex',
                                    gap: '5px',
                                    alignItems: 'center',
                                }}
                            >
                                Expert Mode
                                <CustomTooltip
                                    title="Bypasses confirmation modals and allows high slippage trades. Use at your own risk."
                                    arrow
                                    placement="top"
                                >
                                    <BsQuestionCircle />
                                </CustomTooltip>
                            </Typography>
                            <FormControlLabel
                                control={<IOSSwitch onChange={openExpertModal} />}
                                label=""
                            />
                        </Box>


                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography
                                sx={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    display: 'flex',
                                    gap: '5px',
                                    alignItems: 'center',
                                }}
                            >
                               Flippy sounds
                                <CustomTooltip
                                    title="Bypasses confirmation modals and allows high slippage trades. Use at your own risk."
                                    arrow
                                    placement="top"
                                >
                                    <BsQuestionCircle />
                                </CustomTooltip>
                            </Typography>
                            <FormControlLabel
                                control={<IOSSwitch onChange={openExpertModal} />}
                                label=""
                            />
                        </Box>


                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography
                                sx={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    display: 'flex',
                                    gap: '5px',
                                    alignItems: 'center',
                                }}
                            >
                                Fast routing (BETA)

                                <CustomTooltip
                                    title="Bypasses confirmation modals and allows high slippage trades. Use at your own risk."
                                    arrow
                                    placement="top"
                                >
                                    <BsQuestionCircle />
                                </CustomTooltip>
                            </Typography>
                            <FormControlLabel
                                control={<IOSSwitch onChange={openExpertModal} />}
                                label=""
                            />
                        </Box>

                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <Typography
                                onClick={openCustomize}
                                sx={{ fontSize: '14px', fontWeight: '600', color: 'var(--cream)', cursor: 'pointer' }}
                            >
                                Customize Routing
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Modal>

            <ExpertModeModal isOpen={isExpertModalOpen} handleCloseExpert={closeExpertModal} theme={theme} />
            <CustomizeRouting isOpen={isCustomize} handleCloseCustomize={closeCustomize} theme={theme} />
        </>
    );
};

export default SettingsModal;
