import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { IoCloseOutline } from 'react-icons/io5';
import CustomTooltip from '../CustomTooltip/CustomTooltip';
import { BsQuestionCircle } from 'react-icons/bs';
import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import IOSSwitch from '../IOSSwitch/IOSSwitch';
import Customcheckbox from '../Customcheckbox/Customcheckbox';

interface CustomizeRoutingProps {
    isOpen: boolean;
    handleCloseCustomize: () => void;
    theme: 'light' | 'dark';
    allowSwapForV2: boolean;
    allowSwapForV3: boolean;
    onToggleV2: (newValue: boolean) => void;
    onToggleV3: (newValue: boolean) => void;
}

const CustomizeRouting: React.FC<CustomizeRoutingProps> = ({
    isOpen,
    handleCloseCustomize,
    theme,
    allowSwapForV2,
    allowSwapForV3,
    onToggleV2, onToggleV3
}) => {

    const handleToggleChange = (type: 'V2' | 'V3') => {
        if (type === 'V2') {
            const newValue = !allowSwapForV2;
            onToggleV2(newValue); // Send updated value to grandparent
        } else {
            const newValue = !allowSwapForV3;
            onToggleV3(newValue); // Send updated value to grandparent
        }
    };

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        fontSize: '14px',
        fontWeight: '500',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: theme === 'light' ? 'var(--white)' : 'var(--primary)',
        boxShadow: 'rgba(0, 0, 0, 0.24) -40px 40px 80px -8px',
        borderRadius: '14px',
        color: theme === 'light' ? 'var(--primary)' : 'var(--white)',

        maxHeight: '80vh',
        overflowY: 'auto',
    };

    return (
        <Modal
            open={isOpen}
            onClose={handleCloseCustomize}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Box className="modal_head" sx={{ position: 'relative', mb: 2 }}>
                    <Typography variant="h6">Customize Routing</Typography>
                    <Box sx={{
                        position: 'absolute',
                        right: '10px',
                        top: '10px',
                        cursor: 'pointer',
                    }}>
                        <Typography>

                        </Typography>
                        <Typography>
                            <IoCloseOutline onClick={handleCloseCustomize} size={24} />
                        </Typography>
                    </Box>
                </Box>
                <Box className="modal_body">
                    <Box>
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
                            LIQUIDITY SOURCE

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
                            9mm Swap V3


                            <CustomTooltip
                                title="Bypasses confirmation modals and allows high slippage trades. Use at your own risk."
                                arrow
                                placement="top"
                            >
                                <BsQuestionCircle />
                            </CustomTooltip>
                        </Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={allowSwapForV2}
                                    onChange={() => handleToggleChange('V2')} // Trigger toggle for V2
                                />
                            }
                            label={`V2 Swap is ${allowSwapForV2 ? 'Enabled' : 'Disabled'}`}
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
                            9mm Swap V2


                            <CustomTooltip
                                title="Bypasses confirmation modals and allows high slippage trades. Use at your own risk."
                                arrow
                                placement="top"
                            >
                                <BsQuestionCircle />
                            </CustomTooltip>
                        </Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={allowSwapForV3}
                                    onChange={() => handleToggleChange('V3')} // Trigger toggle for V3
                                />
                            }
                            label={`V3 Swap is ${allowSwapForV3 ? 'Enabled' : 'Disabled'}`}
                        />
                    </Box>

                    <Box>
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
                            ROUTING PREFERENCE
                        </Typography>
                    </Box>

                    <Box>
                        <FormGroup sx={{ m: '0 0 16px 0 ' }}>
                            <FormControlLabel
                                sx={{ m: '0' }}
                                control={<Customcheckbox />}
                                label={
                                    <>
                                        <Box>
                                            <Typography sx={{ ml: '5px', fontSize: '14px', mt: '3px', fontWeight: '600', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '5px' }}>
                                                Allow Multihops
                                                <CustomTooltip
                                                    title="Your transaction will revert if it is left confirming for longer than this time."
                                                    arrow
                                                    placement="top"
                                                >
                                                    <BsQuestionCircle />
                                                </CustomTooltip>
                                            </Typography>
                                        </Box>


                                    </>
                                }
                            />
                        </FormGroup>
                    </Box>

                    <Box>
                        <FormGroup>
                            <FormControlLabel
                                sx={{ m: '0' }}
                                control={<Customcheckbox />}
                                label={
                                    <>
                                        <Box>
                                            <Typography sx={{ ml: '5px', fontSize: '14px', mt: '3px', fontWeight: '600', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '5px' }}>
                                                Allow Multihops
                                                <CustomTooltip
                                                    title="Your transaction will revert if it is left confirming for longer than this time."
                                                    arrow
                                                    placement="top"
                                                >
                                                    <BsQuestionCircle />
                                                </CustomTooltip>
                                            </Typography>
                                        </Box>


                                    </>
                                }
                            />
                        </FormGroup>
                    </Box>


                </Box>
            </Box>
        </Modal>
    );
};

export default CustomizeRouting;
