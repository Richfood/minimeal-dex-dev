import React, { useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemButton, Badge } from '@mui/material';
import { IoIosArrowDown } from "react-icons/io";
import { FaArrowRight } from "react-icons/fa";
import { PiChartBar } from "react-icons/pi";
import { RxCountdownTimer } from "react-icons/rx";
import { GrRefresh } from "react-icons/gr";
import { IoSettingsOutline } from 'react-icons/io5';
import { PiPencilSimpleBold } from "react-icons/pi";

interface SwapWidgetProps {
    onToggle: () => void; // Explicitly defining onToggle prop type
}

const SwapWidget: React.FC<SwapWidgetProps> = ({ onToggle }) => {
    const [activeItem, setActiveItem] = useState<string | null>(null);


    const handleItemClick = (item: string) => {
        setActiveItem(prevItem => (prevItem === item ? null : item));
        if (item === 'settings') {
            setBadgeVisible(false);
        }
        onToggle();
    };

    return (
        <>
            <Box className="SwapWidgetSec">
                <Box className="SwapWidgetInner">
                    <Box className="inputBox" sx={{ width: 'calc(50% - 48px)' }}>
                        <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center', mb: '10px' }}>
                            <img src="/images/circle1.svg" alt="circle1" style={{ width: '20px', height: '20px' }} />
                            <Typography sx={{ fontSize: '14px', fontWeight: '700', lineHeight: 'normal', display: 'flex', alignItems: 'center' }}>PLS <IoIosArrowDown /></Typography>
                        </Box>
                        <Box className="inputField">
                            <input type="text" placeholder='0.0' />
                            <Typography sx={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '500' }}>~195,194.61 USD</Typography>
                        </Box>
                    </Box>

                    <Box className="arrowBox">
                        <Box className="swapData" sx={{ display: 'flex', alignItems: 'center', margin: '0 auto' }}>
                            <FaArrowRight />
                        </Box>
                    </Box>

                    <Box className="inputBox" sx={{ width: 'calc(50% - 48px)' }}>
                        <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center', mb: '10px' }}>
                            <img src="/images/circle2.svg" alt="circle1" style={{ width: '20px', height: '20px' }} />
                            <Typography sx={{ fontSize: '14px', fontWeight: '700', lineHeight: 'normal', display: 'flex', alignItems: 'center' }}>9MM <IoIosArrowDown /></Typography>
                        </Box>
                        <Box className="inputField">
                            <input type="text" placeholder='0.0' />
                            <Typography sx={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '500' }}>~195,194.61 USD</Typography>
                        </Box>
                    </Box>
                </Box>

                <Box className="slippageSec">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <Typography sx={{ fontSize: '12px', fontWeight: '500' }}>Slippage Tolerance <PiPencilSimpleBold /></Typography>
                        <Typography sx={{ fontSize: '14px', fontWeight: '700' }}>0.5%</Typography>
                    </Box>
                    <Box sx={{ mt: '25px' }}>
                        <Button variant="contained" color="secondary">Connect Wallet</Button>
                    </Box>
                </Box>

                <Box className="SwapWidgetBox">
                    <Box className="SwapWidgetBoxTitle">
                        <Typography variant="h4">Swap</Typography>
                        <Typography sx={{ fontSize: '12px', mb: '20px' }}>Trade Token in an instant</Typography>
                    </Box>
                    <Box className={`widgetList ${activeItem ? 'active' : ''}`}>
                        <List>
                            <ListItem className={`widgetItem piechartIcon ${activeItem === 'chart' ? 'active' : ''}`} onClick={() => handleItemClick('chart')} disablePadding>
                                <ListItemButton>
                                    <PiChartBar />
                                </ListItemButton>
                            </ListItem>
                            <ListItem className="widgetItem" disablePadding>
                                <ListItemButton>
                                    <Badge  color="secondary" variant="dot">
                                        <IoSettingsOutline />
                                    </Badge>
                                </ListItemButton>
                            </ListItem>
                            <ListItem className="widgetItem" disablePadding>
                                <ListItemButton>
                                    <RxCountdownTimer />
                                </ListItemButton>
                            </ListItem>
                            <ListItem className="widgetItem" disablePadding>
                                <ListItemButton>
                                    <GrRefresh />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default SwapWidget;
function setBadgeVisible(arg0: boolean) {
    throw new Error('Function not implemented.');
}

