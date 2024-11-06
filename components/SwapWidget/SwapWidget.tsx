// src/components/SwapWidget.tsx
import React, { useState, useCallback, useEffect, useRef, ChangeEvent } from 'react';
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
import { getPoolData } from '@/utils/api/getPoolData';
import { Protocol, SwapPoolData, TokenDetails } from '@/interfaces';
import { getSmartOrderRoute } from '@/utils/api/getSmartOrderRoute';
import { TradeType } from '@uniswap/sdk-core';
import CircularProgress from '@mui/material/CircularProgress';
import famousToken from "../../utils/famousToken.json";
import famousTokenTestnet from "../../utils/famousTokenTestnet.json";
import { hooks, metaMask } from '../ConnectWallet/connector';
import tokenList from "../../utils/tokenList.json";
import { swapV3 } from '@/utils/contract-methods/swapTokens';
import addresses from "@/utils/address.json";
import { flushSync } from 'react-dom';
import { getTokenUsdPrice } from "@/utils/api/getTokenUsdPrice"
import getTokenApproval from '@/utils/contract-methods/getTokenApproval';
import { debounce } from '@syncfusion/ej2-base';
import getUserBalance from '@/utils/api/getUserBalance';
const { useChainId, useIsActive, useAccounts } = hooks;

const fetchCoinUSDPrice = async (tokenAddress?: string) => {
    if (!tokenAddress) {
        console.error('Invalid token address!');
        return null;
    }

    try {
        const usdData = await getTokenUsdPrice(tokenAddress);
        console.log("🚀 ~ fetchCoinUSDPrice ~ usdData:", usdData);
        return usdData;
    } catch (error) {
        console.error('Error fetching data from API:', error);
        return null;
    }
};

interface SwapWidgetProps {
    pageLoading: (isLoading: boolean) => void; // Expecting a function, not a boolean
}

const SwapWidget: React.FC<SwapWidgetProps> = ({ pageLoading }) => {
    // const [activeIndex, setActiveIndex] = useState<number | null>(0);
    // const [activeItem, setActiveItem] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [openToken, setOpenToken] = useState(false);
    // const [isOpenRecent, setIsOpenRecent] = useState(false);
    // const [isOpenExpert, setIsOpenExpert] = useState(false);
    // const [selectedGraph, setSelectedGraph] = useState<'graph1' | 'graph2'>('graph1');
    const [activeCurrency, setActiveCurrency] = useState<'PLS/9MM' | '9MM/PLS'>('PLS/9MM');
    // const [series, setSeries] = useState<{ name: string; data: { x: number; y: number; }[] }[]>([]);
    const chainId = useChainId();
    const [token0, setToken0] = useState<TokenDetails | null>(tokenList.TokenC);
    const [token1, setToken1] = useState<TokenDetails | null>(tokenList.TokenD);
    const [token0Price, setToken0Price] = useState<string | null>("0");
    const [token1Price, setToken1Price] = useState<string | null>("0");
    const [tokenBeingChosen, setTokenBeingChosen] = useState(0);
    const [routePath, setRoutePath] = useState<TokenDetails[] | null>(null);
    const [amountIn, setAmountIn] = useState("");
    const [amountOut, setAmountOut] = useState("");
    const [dataForSwap, setDataForSwap] = useState<any>(null);
    const [amountOutLoading, setAmountOutLoading] = useState(false);
    const [amountInLoading, setAmountInLoading] = useState(false);
    const { theme } = useTheme();
    const isActive = useIsActive();
    const accounts = useAccounts();
    const isConnected = useAccounts();
    const [address, setAddress] = React.useState<string | null>(null);
    const [buttonText, setButtonText] = React.useState<string | null>(null);
    const [slippageTolerance, setSlippageTolerance] = useState(0.5);
    const [userBalance, setUserBalance] = useState<string | null>(null);
    const [prevTokens, setPrevTokens] = useState<{ token0: TokenDetails | null; token1: TokenDetails | null }>({
        token0: null,
        token1: null,
    });
    console.log("🚀 ~ SwapWidget ~ prevTokens:", prevTokens)
    const smartRouterAddress = addresses.SmartRouterAddress;
    const [isTestnet, setIsTestnet] = React.useState<boolean | null>(null);
    const [allowSwapForV2, setAllowSwapForV2] = useState<boolean>(true);
    const [allowSwapForV3, setAllowSwapForV3] = useState<boolean>(true);
    const [isSwapping, setIsSwapping] = useState<boolean>(false);

    useEffect(() => {
        if (!token0) return;

        const runGetUserBalance = async () => {
            const balance = await getUserBalance(token0);
            setUserBalance(balance);
        }

        runGetUserBalance();

    }, [amountIn, isConnected]);


    console.log(userBalance, amountIn);
    // Load token data from local storage and set it to state
    useEffect(() => {
        const isTestnet = chainId === 943;
        setIsTestnet(isTestnet)
        console.log("🚀 ~ useEffect ~ isTestnet:", isTestnet)

        const tokenData = isTestnet ? famousTokenTestnet : famousToken;

        // if (tokenData.length > 0) {
        //     setToken0(tokenData[0]);
        //     setToken1(tokenData[1]);
        // }
    }, [chainId]);

    const handleOpenToken = useCallback((tokenNumber: number) => {
        setTokenBeingChosen(tokenNumber)
        setOpenToken(prev => !prev)
    }, []);

    useEffect(() => {
        const updateAddressAndButtonText = async () => {
            if (accounts && accounts.length > 0 && isConnected) {
                // Shorten the address for display (e.g., 0x123...789)
                const shortenedAddress = `${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`;
                setAddress(shortenedAddress);
            }
            setButtonText(isConnected ? address : 'Connect Wallet');


            // Update the button text based on connection status
        };

        updateAddressAndButtonText();
    }, [accounts, isConnected]);

    // Using useRef to maintain a consistent timeout reference across renders
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);



    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAmountIn(value); // Update state immediately
        handleAmountInChange(value); // Trigger debounced handler
    };

    const handleOutputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAmountOut(value); // Update state immediately
        handleAmountOutChange(value); // Trigger debounced handler
    };

    // const handleNetworkSelect = (chainId: number) => {
    //   metaMask.activate(chainId);
    //   setSelectedChainId(chainId);
    //   handleCloseMenu(); // Close the menu after selection
    // };

    const handleClick = () => {
        if (isConnected) {
            console.log("🚀 ~ handleClick ~ isConnected:", isConnected);

            // Check if deactivate is available before calling it
            if (metaMask.deactivate) {
                metaMask.deactivate?.();
            } else {
                console.log(metaMask.resetState());
            }
        } else {
            metaMask.activate();
        }
    };

    const handleCloseToken = () => setOpenToken(false);

    const settingsModal = useCallback(() => setIsOpen((prev) => !prev), []);


    // const handleOpenRecent = useCallback(() => setIsOpenRecent(prev => !prev), []);
    // const handleCloseRecent = () => setIsOpenRecent(false);

    // const handleOpenExpert = useCallback(() => setIsOpenExpert(prev => !prev), []);
    // const handleCloseExpert = () => setIsOpenExpert(false);

    // const handleItemClick = (item: string) => {
    //     setActiveItem(prevItem => (prevItem === item ? null : item));
    //     if (item === 'settings') {
    //         setIsOpen(true);
    //     }
    //     onToggle();
    // };    

    // Handler to toggle V2 state
    const handleToggleV2 = (newValue: boolean) => {
        setAllowSwapForV2(newValue);
        console.log('Toggle V2:', newValue ? 'Enabled' : 'Disabled');
    };

    // Handler to toggle V3 state
    const handleToggleV3 = (newValue: boolean) => {
        setAllowSwapForV3(newValue);
        console.log('Toggle V3:', newValue ? 'Enabled' : 'Disabled');
    };

    const handlePriceForToken0 = async (tokenValue: string): Promise<any> => {
        try {
            // Fetch the USD price for the token
            const usdPrice = await fetchCoinUSDPrice(token0?.address?.contract_address);

            if (!usdPrice) {
                console.log('Failed to fetch USD price');
                return;
            }

            // Ensure tokenValue is a number before multiplying
            const numericTokenValue = parseFloat(tokenValue);
            if (isNaN(numericTokenValue)) {
                console.log('Invalid token value');
                return;
            }

            // Calculate the total value in USD and convert to a string with 3 decimals
            const totalValue = (numericTokenValue * usdPrice).toFixed(3);
            setToken0Price(totalValue);
        } catch (error) {
            console.log('Error in handlePriceForToken0:', error);
        }
    };

    const handlePriceForToken1 = async (tokenValue: string): Promise<any> => {
        try {
            // Fetch the USD price for the token
            const usdPrice = await fetchCoinUSDPrice(token1?.address?.contract_address);
            console.log("🚀 ~ handlePriceForToken1 ~ usdPrice:", usdPrice)

            if (!usdPrice) {
                console.error('Failed to fetch USD price');
                return;
            }

            // Ensure tokenValue is a number before multiplying
            const numericTokenValue = parseFloat(tokenValue);
            if (isNaN(numericTokenValue)) {
                console.error('Invalid token value');
                return;
            }

            // Calculate the total value in USD and convert to a string with 3 decimals
            const totalValue = (numericTokenValue * usdPrice).toFixed(3);

            // Set the formatted value as a string
            setToken1Price(totalValue);
        } catch (error) {
            console.log("🚀 ~ handlePriceForToken1 ~ error:", error)
        }
    };

    const handleSwap = async () => {
        setIsSwapping(true); // Start loading indicator

        if (!token0 || !token1) {
            console.log("🚀 ~ handleSwap ~ Missing tokens:", token0, token1);
            setIsSwapping(false); // Stop loading indicator on error
            return; // Exit early if tokens are missing
        }

        try {
            // Approve token for the swap
            await getTokenApproval(token0, smartRouterAddress, amountIn);

            // Execute the swap after approval
            await swapV3(token0, dataForSwap, amountIn, slippageTolerance);

            // Reset input/output values after swap
            setAmountIn("");
            setAmountOut("");

        } catch (error) {
            console.error("Error during swap process:", error);

            // Reset input/output values in case of an error
            setAmountIn("");
            setAmountOut("");

        } finally {
            setIsSwapping(false); // Stop loading indicator regardless of outcome
        }
    };


    const toggleGraph = async () => {


        if (activeCurrency === "PLS/9MM") {
            setActiveCurrency("9MM/PLS");  // Assume you want to toggle back

        } else if (activeCurrency === "9MM/PLS") {
            setActiveCurrency("PLS/9MM");  // Assume you want to toggle back

        }

        // Swap token0 and token1 regardless of currency
        const tempToken = token0;
        setToken0(token1);
        setToken1(tempToken);
    };


    const fetchSmartOrderRoute = useCallback(
        async (tokenAmount: string, isAmountIn: boolean) => {
            // Check if tokens are available
            if (!token0 || !token1) {
                console.warn("Tokens not available:", { token0, token1 });
                return;
            }

            let protocol: Protocol; // Declare protocol as a single Protocol type

            // Determine which protocol(s) are enabled
            if (allowSwapForV2 && allowSwapForV3) {
                // Both V2 and V3 are enabled
                protocol = Protocol.V3; // Choose one protocol (you can decide which one to prefer)
                // Optionally handle the V3 case separately in the API call if needed
            } else if (allowSwapForV2) {
                // Only V2 is enabled
                protocol = Protocol.V2; // Assign only V2 protocol
            } else if (allowSwapForV3) {
                // Only V3 is enabled
                protocol = Protocol.V3; // Assign only V3 protocol
            } else {
                // Both are disabled, exit the function
                return;
            }

            const tradeType = isAmountIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT;

            try {
                // Always pass the selected protocol as a tuple (array with one element)
                const { data, value } = await getSmartOrderRoute(
                    token0,
                    token1,
                    tokenAmount,
                    [protocol], // Wrap the selected protocol in an array
                    tradeType
                );

                // Check if the response contains a valid token path
                if (data?.finalRoute?.tokenPath) {
                    setRoutePath(data.finalRoute.tokenPath);
                    setDataForSwap(data.finalRoute);

                    if (isAmountIn) {
                        console.log("🚀 ~ isAmountIn:", isAmountIn)
                        const token1Price = await handlePriceForToken1(value);
                        setToken1Price(token1Price);
                        setAmountOut(value?.toString() || "");
                    } else {
                        console.log("🚀 ~ isAmountIn:", isAmountIn)

                        const token0Price = await handlePriceForToken0(value);
                        setToken0Price(token0Price);
                        setAmountIn(value?.toString() || "");
                    }
                } else {
                    console.error("Token path not found in response.");
                }
            } catch (error) {
                console.error("Error fetching route:", error);
            }
        },
        [token0, token1, allowSwapForV2, allowSwapForV3, setRoutePath, setDataForSwap, setToken1Price, setAmountOut, setToken0Price, setAmountIn] // Ensure allowSwapForV2 and allowSwapForV3 are dependencies
    );




    const handleAmountInChange = useCallback(
        (amountIn: string) => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current); // Clear previous timeout
            flushSync(() => setAmountOut("")); // Clear amount out

            timeoutRef.current = setTimeout(async () => {
                try {
                    flushSync(() => setAmountOutLoading(true)); // Show loading state
                    await fetchSmartOrderRoute(amountIn, true); // Use latest tokens
                } finally {
                    flushSync(() => setAmountOutLoading(false)); // Hide loading state
                }
            }, 1000); // 1-second debounce
        },
        [fetchSmartOrderRoute, setAmountOut] // Add dependencies
    );


    const handleAmountOutChange = useCallback(
        (amountOut: string) => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current); // Clear previous timeout
            flushSync(() => setAmountIn("")); // Clear amount out

            timeoutRef.current = setTimeout(async () => {
                try {
                    flushSync(() => setAmountInLoading(true)); // Show loading state
                    await fetchSmartOrderRoute(amountOut, false); // Use latest tokens
                } finally {
                    flushSync(() => setAmountInLoading(false)); // Hide loading state
                }
            }, 1000); // 1-second debounce
        },
        [fetchSmartOrderRoute, setAmountIn] // Add dependencies
    );

    const copyToClipboard = (text: string | undefined) => {
        console.log("🚀 ~ copyToClipboard ~ text:", text)
        if (!text || text.trim() === "") {
            alert("Empty address");
        }
        else {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    alert("Address copied to clipboard!");
                }).catch(err => {
                    console.error("Failed to copy text to clipboard", err);
                });
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand("copy");
                    alert("Address copied to clipboard!");
                } catch (err) {
                    console.error("Failed to copy text to clipboard", err);
                }
                document.body.removeChild(textArea);
            }
        }

    };



    return (
        <>
            <Box className="SwapWidgetSec">
                <Box className="SwapWidgetInner">
                    <Box sx={{ display: "flex", justifyContent: "space-evenly",width: '100%' }}>
                        <Box className="inputBox" sx={{ width: 'calc(50% - 48px)' }}>
                            <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center', mb: '10px' }}>
                                <img src={token0?.logoURI} alt="logoURI" style={{ width: '20px', height: '20px' }} />
                                <Typography onClick={() => handleOpenToken(0)} sx={{ fontSize: '14px', fontWeight: '700', lineHeight: 'normal', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                    {token0?.symbol} <IoIosArrowDown />
                                </Typography>
                                <Typography
                                    onClick={() => copyToClipboard(token0?.address?.contract_address)}
                                    component="span"
                                    sx={{ ml: '5px', cursor: 'pointer' }}
                                >
                                    {token0?.symbol !== "PLS" && <PiCopy />}
                                </Typography>
                            </Box>

                            <Box className="inputField" sx={{minHeight: '60px'}}>
                                {amountInLoading ? (
                                    <CircularProgress size={24} />
                                ) : (
                                    <Box>
                                        <input
                                            type="number"
                                            placeholder="0.0"
                                            value={amountIn}
                                            onChange={handleInputChange} // Use updated handler
                                        />
                                        {(!isTestnet && Number(amountIn) > 0) && ( // Ensure amountIn is treated as a number
                                            <Typography
                                                sx={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '500' }}
                                            >
                                                ~{Number(token0Price || 0).toLocaleString(undefined, {
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 3
                                                })} USD
                                            </Typography>
                                        )}
                                    </Box>
                                )}
                            </Box>


                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    gap: '5px',
                                    marginTop: "10px",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    gap: '5px',
                                    marginTop: "10px",
                                }}>
                                    <Typography sx={{ color: 'var(--primary)', fontWeight: '700' }}>Route</Typography>
                                    <Box>
                                        <span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={2.5}  // Bold effect
                                                stroke="currentColor"
                                                width="20px"
                                                height="20px"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                                                />
                                            </svg>
                                        </span>

                                    </Box>

                                </Box>
                                <Box>
                                    <ul style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: 0, fontWeight: "700" }}>
                                        {amountOut && routePath?.length ? (
                                            routePath.map((route, index) => (
                                                <React.Fragment key={index}>
                                                    <li className="route-item" style={{ listStyle: 'none' }}>
                                                        <p>{route.symbol}</p>
                                                    </li>

                                                    {index < (routePath?.length ?? 0) - 1 && (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="24" height="24"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={2}
                                                            stroke="currentColor"
                                                            fill="none"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            style={{ display: 'inline-block', width: "16px", height: "16px", marginBottom: "5px", fontWeight: "700" }}
                                                        >
                                                            <path d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                                        </svg>
                                                    )}
                                                </React.Fragment>
                                            ))
                                        ) : null}
                                    </ul>

                                </Box>
                            </Box>
                            <Box className="slippageSec dsls">
                                {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Typography sx={{ fontSize: '12px', fontWeight: '500' }}>Slippage Tolerance <PiPencilSimpleBold /></Typography>
        <Typography sx={{ fontSize: '14px', fontWeight: '700' }}>0.5%</Typography>
    </Box> */}
                                <Box sx={{ mt: '25px' }}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={isActive ? handleSwap : handleClick} // Conditional onClick handler
                                        disabled={isActive && (amountInLoading || amountOutLoading || !userBalance || Number(userBalance) < Number(amountIn))}
                                    >
                                        {isSwapping ? (
                                            <CircularProgress size={24} color="inherit" />
                                        ) : isActive ? (
                                            userBalance && Number(userBalance) >= Number(amountIn) ? "Swap" : "Insufficient Balance"
                                        ) : "Connect Wallet"}
                                    </Button>
                                </Box>


                            </Box>


                        </Box>

                        <Box className="arrowBox" sx={{ pt: '40px', mt: "-8rem" }}>
                            <Box className="swapData" sx={{ display: 'flex', alignItems: 'flex-start', margin: '0 auto' }}>
                                <FaArrowRight onClick={toggleGraph} />
                            </Box>
                        </Box>

                        <Box className="inputBox" sx={{ width: 'calc(50% - 48px)' }}>
                            <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center', mb: '10px' }}>
                                <img src={token1?.logoURI} alt="circle2" style={{ width: '20px', height: '20px' }} />
                                <Typography onClick={() => handleOpenToken(1)} sx={{ fontSize: '14px', fontWeight: '700', lineHeight: 'normal', display: 'flex', alignItems: 'center', cursor: "pointer" }}>
                                    {token1 && token1.symbol.toUpperCase()}
                                    <IoIosArrowDown />
                                </Typography>
                                <Typography component="span" sx={{ ml: '5px', cursor: 'pointer' }} onClick={() => copyToClipboard(token1?.address?.contract_address)}>
                                    {token1?.symbol !== "PLS" && <PiCopy />}
                                </Typography>
                            </Box>


                            <Box className="inputField" sx={{minHeight: '60px'}}>
                                {amountOutLoading ? (
                                    <CircularProgress size={24} />
                                ) : (
                                    <Box>
                                        <input
                                            type="number"
                                            placeholder="0.0"
                                            value={amountOut}
                                            onChange={handleOutputChange} // Use updated handler
                                        />
                                        {!isTestnet && Number(amountOut) > 0 && (
                                            <Typography
                                                sx={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '500' }}
                                            >
                                                ~{Number(token1Price || 0).toLocaleString(undefined, {
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 3
                                                })} USD
                                            </Typography>
                                        )}
                                    </Box>
                                )}
                            </Box>

                        </Box>
                    </Box>
                    <Badge
                        className="widgetItem"
                        color="secondary"
                        onClick={settingsModal}
                    >
                        <IoSettingsOutline style={{ fontSize: '20px' }} /> {/* Adjust icon size */}
                    </Badge>

                    <Box className="slippageSec msls" sx={{ display: "none" }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                            <Typography sx={{ fontSize: '12px', fontWeight: '500' }}>Slippage Tolerance <PiPencilSimpleBold /></Typography>
                            <Typography sx={{ fontSize: '14px', fontWeight: '700' }}>0.5%</Typography>
                        </Box>
                        <Box sx={{ mt: '25px' }}>
                            <Button variant="contained" color="secondary">Connect Wallet</Button>
                        </Box>
                    </Box>
                </Box>
                {/* <Box className="SwapWidgetBox">
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
                            <ListItem className="widgetItem" disablePadding>
                                <ListItemButton onClick={handleOpen}>
                                    <BsFire />
                                </ListItemButton>
                            </ListItem>
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
                </Box> */}

                <SettingsModal
                    isOpen={isOpen}
                    handleClose={settingsModal}
                    theme={theme}
                    onToggleV2={handleToggleV2}
                    onToggleV3={handleToggleV3}
                    allowSwapForV2={allowSwapForV2}
                    allowSwapForV3={allowSwapForV3}
                />
                {/* <RecentTransactions open={isOpenRecent} onClose={handleCloseRecent} /> */}
                <SelectedToken
                    openToken={openToken}
                    handleCloseToken={handleCloseToken}
                    mode={theme}
                    setToken0={setToken0}
                    setToken1={setToken1}
                    tokenNumber={tokenBeingChosen}
                    description=''
                    token0={token0}
                    token1={token1}
                />
            </Box>
        </>
    );
};

export default SwapWidget;


