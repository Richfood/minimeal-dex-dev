// src/components/SwapWidget.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemButton, Badge } from '@mui/material';
import { IoIosArrowDown } from 'react-icons/io';
import { FaArrowRight } from 'react-icons/fa';
import { PiChartBar, PiCopy } from 'react-icons/pi';
import { RxCountdownTimer } from 'react-icons/rx';
import { GrRefresh } from 'react-icons/gr';
import { IoSettingsOutline } from 'react-icons/io5';
import { PiPencilSimpleBold } from 'react-icons/pi';
import { useTheme } from '../ThemeContext';
import SettingsModal from '../SettingModal/SettingModal';
import SelectedToken from '../SelectToken/SelectedToken';
import RecentTransactions from '../../components/RecentTransactions/RecentTransactions';
import { BsFire } from "react-icons/bs";
// import { getAmountOutV3 } from '@/utils/calculateSwap';
import { BigNumber } from 'ethers';
import { Pool } from '@uniswap/v3-sdk';
import { getPoolData } from '@/utils/api/getPoolData';
import { Protocol, SwapPoolData } from '@/interfaces';
import { getSmartOrderRoute } from '@/utils/api/getSmartOrderRoute';
import { TradeType } from '@uniswap/sdk-core';
import CircularProgress from '@mui/material/CircularProgress';

interface Token {
    name : string;
    symbol : string;
    address : string;
    decimals : number;
}

interface SwapWidgetProps {
    onToggle: () => void;
}

interface PoolDetails {
    sqrtPriceX96: BigNumber | string;
    liquidity: BigNumber | string;
    tick: number;
    fee: number;
}

const SwapWidget: React.FC<SwapWidgetProps> = ({ onToggle }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(0);
    const [isActive, setIsActive] = useState(false);
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [openToken, setOpenToken] = useState(false);
    const [isOpenRecent, setIsOpenRecent] = useState(false);
    const [isOpenExpert, setIsOpenExpert] = useState(false);
    const [selectedGraph, setSelectedGraph] = useState<'graph1' | 'graph2'>('graph1');
    const [activeCurrency, setActiveCurrency] = useState<'PLS/9MM' | '9MM/PLS'>('PLS/9MM');
    const [series, setSeries] = useState<{ name: string; data: { x: number; y: number; }[] }[]>([]);
    const [circleImages, setCircleImages] = useState<{ circle1: string; circle2: string }>({
        circle1: '/images/circle1.svg',
        circle2: '/images/circle2.svg',
    });
    // const [activeNewCurrency, setActiveNewCurrency] = useState<{ active1: string; active2: string }>({
    //     active1: 'PLS',
    //     active2: '9MM'
    // });

    const [token0, setToken0] = useState<Token | null>(null);
    const [token1, setToken1] = useState<Token | null>(null);
    const [tokenBeingChosen, setTokenBeingChosen] = useState(0);

    const [amountIn, setAmountIn] = useState("");
    const [amountOut, setAmountOut] = useState("");

    const [amountOutLoading, setAmountOutLoading] = useState(false);
    const [amountInLoading, setAmountInLoading] = useState(false);

    const { theme } = useTheme();

    const handleOpenToken = useCallback((tokenNumber : number) => {
        setTokenBeingChosen(tokenNumber)
        setOpenToken(prev => !prev)
    }, []);
    const handleCloseToken = () => setOpenToken(false);

    const handleOpen = useCallback(() => setIsOpen(prev => !prev), []);
    const handleClose = () => setIsOpen(false);

    const handleOpenRecent = useCallback(() => setIsOpenRecent(prev => !prev), []);
    const handleCloseRecent = () => setIsOpenRecent(false);

    const handleOpenExpert = useCallback(() => setIsOpenExpert(prev => !prev), []);
    const handleCloseExpert = () => setIsOpenExpert(false);

    const handleItemClick = (item: string) => {
        setActiveItem(prevItem => (prevItem === item ? null : item));
        if (item === 'settings') {
            setIsOpen(true);
        }
        onToggle();
    };

    const handleAmountIn = async ()=>{
        setAmountOut("");
        setAmountOutLoading(true);
        await fetchSmartOrderRoute();
        setAmountOutLoading(false);
    }

    const handleAmountOut = async ()=>{
        setAmountIn("");
        setAmountInLoading(true);
        await fetchSmartOrderRoute();
        setAmountInLoading(false);
    }


    const toggleGraph = () => {
        setSelectedGraph(prevGraph => (prevGraph === 'graph1' ? 'graph2' : 'graph1'));

        if (activeCurrency === 'PLS/9MM') {
            setSeries([
                {
                    name: 'Graph 1',
                    data: [
                        { x: new Date().getTime() - 1000, y: 45 },
                        { x: new Date().getTime(), y: 50 }
                    ]
                }
            ]);
            setActiveCurrency('9MM/PLS');
            setCircleImages({
                circle1: '/images/circle2.svg',
                circle2: '/images/circle1.svg',
            });
            // setActiveNewCurrency({
            //     active1: 'PLS',
            //     active2: '9MM'
            // });
        } else {
            setSeries([
                {
                    name: 'Graph 1',
                    data: [
                        { x: new Date().getTime() - 1000, y: 50 },
                        { x: new Date().getTime(), y: 45 }
                    ]
                }
            ]);
            setActiveCurrency('PLS/9MM');
            setCircleImages({
                circle1: '/images/circle1.svg',
                circle2: '/images/circle2.svg',
            });
            // setActiveNewCurrency({
            //     active1: '9MM',
            //     active2: 'PLS'
            // });
        }
    };

    const fetchSmartOrderRoute = async ()=>{

        if(!token0 || !token1) return;

        console.log("Fetch Run");

        let protocol = Protocol.V3;
        let tradeType : TradeType;
        if(amountIn) {
            tradeType = TradeType.EXACT_INPUT;
            const amountOutAmountFromRoute = await getSmartOrderRoute(token0, token1, amountIn, [protocol], tradeType);
            setAmountOut(amountOutAmountFromRoute?.toString() || "");
        }
        else {
            tradeType = TradeType.EXACT_OUTPUT;
            const amountInAmountFromRoute = await getSmartOrderRoute(token1, token0, amountOut, [protocol], tradeType);
            setAmountIn(amountInAmountFromRoute?.toString() || "");
        }
    }

    return (
        <>
            <Box className="SwapWidgetSec">
                <Box className="SwapWidgetInner">
                    <Box className="inputBox" sx={{ width: 'calc(50% - 48px)' }}>
                        <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center', mb: '10px' }}>
                            <img src={circleImages.circle1} alt="circle1" style={{ width: '20px', height: '20px' }} />
                            <Typography onClick={()=>handleOpenToken(0)} sx={{ fontSize: '14px', fontWeight: '700', lineHeight: 'normal', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                {token0 ? token0.symbol : "Select a Currency"} <IoIosArrowDown />
                            </Typography>
                        </Box>
                        <Box className="inputField">
                            {amountInLoading ? (
                                <CircularProgress size={30}/>
                            ) : (
                            <Box>
                                <input
                                    type="number"
                                    placeholder="0.0"
                                    onChange={(e) => {
                                        if (token0) {
                                            setAmountIn(e.target.value);
                                            setAmountOut("");
                                        }
                                    }}
                                    onBlur={handleAmountIn}
                                    value={amountIn}
                                />
                                <Typography sx={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '500' }}>~195,194.61 USD</Typography>
                            </Box>
                            )}
                        </Box>

                        <Box className="slippageSec dsls">
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                <Typography sx={{ fontSize: '12px', fontWeight: '500' }}>Slippage Tolerance <PiPencilSimpleBold /></Typography>
                                <Typography sx={{ fontSize: '14px', fontWeight: '700' }}>0.5%</Typography>
                            </Box>
                            <Box sx={{ mt: '25px' }}>
                                <Button variant="contained" color="secondary">Connect Wallet</Button>
                            </Box>
                        </Box>


                    </Box>

                    <Box className="arrowBox" sx={{ pt: '40px' }}>
                        <Box className="swapData" sx={{ display: 'flex', alignItems: 'flex-start', margin: '0 auto' }}>
                            <FaArrowRight onClick={toggleGraph} />
                        </Box>
                    </Box>

                    <Box className="inputBox" sx={{ width: 'calc(50% - 48px)' }}>
                        <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center', mb: '10px' }}>
                            <img src={circleImages.circle2} alt="circle2" style={{ width: '20px', height: '20px' }} />
                            <Typography onClick={()=>handleOpenToken(1)} sx={{ fontSize: '14px', fontWeight: '700', lineHeight: 'normal', display: 'flex', alignItems: 'center' }}>
                                {token1 ? token1.symbol : "Select a Currency"} <IoIosArrowDown /> <Typography component="span" sx={{ ml: '5px', cursor: 'pointer' }}><PiCopy /></Typography>
                            </Typography>
                        </Box>
                        <Box className="inputField">
                            {amountOutLoading ? (
                                <CircularProgress size={30}/>
                                ) : (
                                <Box>
                                    <input 
                                        type="number" 
                                        placeholder='0.0' 
                                        onChange={(e)=>{
                                            if(token1){
                                                setAmountOut(e.target.value);
                                                setAmountIn("");
                                            }
                                        }} 
                                        onBlur={handleAmountOut} 
                                        value={amountOut}
                                    />
                                    <Typography sx={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '500' }}>~195,194.61 USD</Typography>
                                </Box>
                                )}
                        </Box>
                    </Box>


                    <Box className="slippageSec msls" sx={{display: "none"}}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                            <Typography sx={{ fontSize: '12px', fontWeight: '500' }}>Slippage Tolerance <PiPencilSimpleBold /></Typography>
                            <Typography sx={{ fontSize: '14px', fontWeight: '700' }}>0.5%</Typography>
                        </Box>
                        <Box sx={{ mt: '25px' }}>
                            <Button variant="contained" color="secondary">Connect Wallet</Button>
                        </Box>
                    </Box>



                </Box>



                <Box className="SwapWidgetBox">
                    <Box className="SwapWidgetBoxTitle">
                        <Typography variant="h4" className='sec_title'>Swap</Typography>
                        <Typography sx={{ fontSize: '12px', mb: '20px' }}>Trade Token in an instant</Typography>
                    </Box>
                    <Box className={`widgetList ${activeItem ? 'active' : ''}`}>
                        <List>
                            <ListItem className={`widgetItem piechartIcon ${activeItem === 'chart' ? 'active' : ''}`} onClick={() => handleItemClick('chart')} disablePadding>
                                <ListItemButton>
                                    <PiChartBar />
                                </ListItemButton>
                            </ListItem>
                            {/* <ListItem className="widgetItem" disablePadding>
                                <ListItemButton onClick={handleOpen}>
                                    <BsFire />
                                </ListItemButton>
                            </ListItem> */}
                            <ListItem className="widgetItem" disablePadding>
                                <ListItemButton onClick={handleOpen}>
                                    <Badge color="secondary" variant="dot">
                                        <IoSettingsOutline />
                                    </Badge>
                                </ListItemButton>
                            </ListItem>
                            <ListItem onClick={handleOpenRecent} className="widgetItem" disablePadding>
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

                <SettingsModal isOpen={isOpen} handleClose={handleClose} theme={theme} />
                <RecentTransactions open={isOpenRecent} onClose={handleCloseRecent} />
                <SelectedToken 
                    openToken={openToken} 
                    handleCloseToken={handleCloseToken} 
                    mode={theme} setToken0={setToken0} 
                    setToken1={setToken1} 
                    tokenNumber={tokenBeingChosen} 
                    description=''
                />
            </Box>
        </>
    );
};

export default SwapWidget;
