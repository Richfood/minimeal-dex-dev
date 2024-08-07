import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useTheme } from '../ThemeContext';
import { IoCloseOutline } from 'react-icons/io5';
import Grid from '@mui/material/Grid';
import { BsQuestionCircle } from 'react-icons/bs';
import CustomTooltip from '../CustomTooltip/CustomTooltip';
import Tooltip from '@mui/material/Tooltip';
import Image from 'next/image';



const RoiCalculator = ({ open, handleClose }) => {
    const [active, setActive] = useState(0);

    const handleClick = (index) => {
        setActive(index);
    };

    const { theme } = useTheme();

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        fontSize: '14px',
        fontWeight: '500',
        transform: 'translate(-50%, -50%)',
        maxWidth: 900,
        width: 'calc(100% - 30px)',
        bgcolor: theme === 'light' ? 'var(--white)' : 'var(--primary)',
        boxShadow: 'rgba(0, 0, 0, 0.24) -40px 40px 80px -8px',
        borderRadius: '14px',
        color: theme === 'light' ? 'var(--primary)' : 'var(--white)',
        maxHeight: '80vh',
        overflowY: 'auto',
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Box className="modal_head">
                    <Typography variant="h6">ROI Calculator</Typography>
                    <Typography
                        sx={{ position: 'absolute', right: '10px', top: '5px', lineHeight: 'normal', cursor: 'pointer' }}
                        aria-label="Close"
                    >
                        <IoCloseOutline onClick={handleClose} size={24} />
                    </Typography>
                </Box>
                <Box className="modal_body">
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Box>
                                <Typography sx={{ color: 'var(--cream)', fontWeight: '600', mb: '15px' }}>
                                    Deposit Amount
                                </Typography>
                                <Box className="SwapWidgetInner" sx={{ mb: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column', gap: '15px' }}>
                                    <Box className="inputBox" sx={{ width: '100%' }}>
                                        <Box className="inputField" sx={{ pr: '45px !important', position: 'relative' }}>
                                            <input type="number" placeholder='0.0' style={{ textAlign: 'end' }} />
                                            <Typography component="span" sx={{ position: 'absolute', right: '10px', color: 'var(--cream)', fontWeight: '600' }}>
                                                USD
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box className="daBtnOuter" sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <Button
                                            className={active === 0 ? 'active' : ''}
                                            onClick={() => handleClick(0)}
                                        >
                                            $100
                                        </Button>
                                        <Button
                                            className={active === 1 ? 'active' : ''}
                                            onClick={() => handleClick(1)}
                                        >
                                            $1000
                                        </Button>
                                        <Button
                                            className={active === 2 ? 'active' : ''}
                                            onClick={() => handleClick(2)}
                                        >
                                            MAX
                                        </Button>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Tooltip
                                                title="Turn on subgraph health indicator all the time. Default is to show the indicator only when the network is delayed"
                                                arrow
                                                placement="top"
                                            >
                                                <BsQuestionCircle />
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box className="daBox">
                                    <Box className="free_tier" sx={{ bgcolor: theme === 'light' ? 'var(--gray)' : 'var(--secondary-dark)', textAlign: 'center' }}>
                                        <Box>
                                            <Box sx={{ display: "flex", alignItems: 'center', justifyContent: "space-between", mb: '15px' }}>
                                                <Box sx={{ display: "flex", alignItems: 'center', gap: '10px' }}>
                                                    <Image src="/images/pls.png" width={30} height={30} />
                                                    <Typography component="span">PLS</Typography>
                                                </Box>
                                                <Box sx={{ display: "flex", alignItems: 'center', gap: '10px' }}>

                                                    <Typography component="span" sx={{ fontWeight: '600' }}>0</Typography>
                                                </Box>

                                            </Box>
                                            <Box sx={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }}>
                                                <Box sx={{ display: "flex", alignItems: 'center', gap: '10px' }}>
                                                    <Image src="/images/9mm.png" width={30} height={30} />
                                                    <Typography component="span">9MM</Typography>
                                                </Box>
                                                <Box sx={{ display: "flex", alignItems: 'center', gap: '10px' }}>

                                                    <Typography component="span" sx={{ fontWeight: '600' }}>0</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>

                            <Box>
                                <Typography sx={{ color: 'var(--cream)', fontWeight: '600', mb: '15px' }}>
                                    Deposit Amount
                                </Typography>

                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>

                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Modal>
    );
};

export default RoiCalculator;
