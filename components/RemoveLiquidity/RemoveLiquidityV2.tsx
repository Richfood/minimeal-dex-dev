import React, { useCallback, useContext, useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Badge, Box, Button, Typography, Link, IconButton, CircularProgress } from '@mui/material';
import { BsArrowLeft, BsArrowUpRight, BsMoon, BsSun } from 'react-icons/bs';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useTheme } from '../../components/ThemeContext'; // Adjust the path to your ThemeContext
import IOSSwitch from '../../components/IOSSwitch/IOSSwitch';
import { IoSettingsOutline } from 'react-icons/io5';
import SettingsModal from '@/components/SettingModal/SettingModal-addLiquidity';
import { removeLiquidityV2, removeLiquidityV3 } from '@/utils/contract-methods/removeLiquidity';
import { TokenDetails, V2PairData, V3PositionData } from '@/interfaces';
import famousTokenTestnet from "../../utils/famousTokenTestnet.json";
import { getPositionByTokenId } from '@/utils/api/getPositionByTokenId';
import addresses from "../../utils/address.json";
import { decimalRound, expandIfNeeded, makeTokenFromInfo } from '@/utils/generalFunctions';
import emulateDecreaseLiquidity from '@/utils/emulate-decreaseLiquidity';
import { FeeAmount } from '@uniswap/v3-sdk';
import { debounce } from '@syncfusion/ej2-base';
import { ethers } from 'ethers';
import { getMaxRemovableTokensV2 } from '@/utils/api/getMaxRemovableTokensV2';
import { getPoolDataByAddressV2 } from '@/utils/api/getPoolDataByAddressV2';
import { getUserNativeBalance } from '@/utils/api/getUserBalance';
import { getPancakeRouterApproval } from '@/utils/api/getPancakeRouterApproval';

interface RemoveLiquidityProps {
    pairAddress: string;
}

const RemoveLiquidityV2 = ({ pairAddress }: RemoveLiquidityProps) => {
    const router = useRouter();

    const { theme, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [slippageTolerance, setSlippageTolerance] = useState<number | null>(1);
    const [deadline, setDeadline] = useState<string>("10");
    const [checked, setChecked] = useState(false);

    const v2RouterAddress = addresses.PancakeV2RouterAddress;

    const [percentLiquidityToRemove, setPercentLiquidityToRemove] = useState(50);
    const [liquidtyToBeRemoved, setLiquidityToBeRemoved] = useState<string>("");
    const [totalLiquidty, setTotalLiquidity] = useState<string>("");
    const [totalSupply, setTotalSupply] = useState("");

    const [token0, setToken0] = useState<TokenDetails | null>(null);
    const [token1, setToken1] = useState<TokenDetails | null>(null);
    const [amount0Min, setAmount0Min] = useState<string>("");
    const [amount1Min, setAmount1Min] = useState<string>("");

    const [token0Deposited, setToken0Deposited] = useState<string>("");
    const [token1Deposited, setToken1Deposited] = useState<string>("");

    const [positionLoading, setPositionLoading] = useState(true);
    const [positionLoadingError, setPositionLoadingError] = useState(false);

    const [removeLiquidityRunning, setRemoveLiquidityRunning] = useState(false);
    const [userAddress, setUserAddress] = useState("");

    const handleThemeToggle = () => {
        toggleTheme();
    };

    const handleGoBack = () => {
        router.back();
    };

    const settingsModal = useCallback(() => setIsOpen((prev) => !prev), []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };

    // Handle the range slider change
    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPercentLiquidityToRemove(Number(event.target.value));
    };

    // Handle the preset button clicks
    const handleButtonClick = (newValue: number) => {
        setPercentLiquidityToRemove(newValue);
    };

    const convertToReadable = (value: string, decimals: number | null): string => {
        if (value && decimals) {
            return decimalRound(ethers.utils.formatUnits(expandIfNeeded(value), decimals), 2);
        }
        else return ""
    }

    const calculate = async () => {
        if(!token0Deposited || !percentLiquidityToRemove || !totalLiquidty || !totalSupply) return;
        try {
            const liquidityToRemove = Math.round(Number(totalLiquidty) * percentLiquidityToRemove / 100);
            const amount0MinCalculated = Math.round(Number(token0Deposited) * percentLiquidityToRemove / 100);
            console.log("🚀 ~ calculate ~ amount0MinCalculated:", amount0MinCalculated)
            const amount1MinCalculated = Math.round(Number(token1Deposited) * percentLiquidityToRemove / 100);
            console.log("🚀 ~ calculate ~ amount1MinCalculated:", amount1MinCalculated)

            setAmount0Min(expandIfNeeded(amount0MinCalculated.toString()))
            setAmount1Min(expandIfNeeded(amount1MinCalculated.toString()));
            setLiquidityToBeRemoved(expandIfNeeded(liquidityToRemove.toString()));
            
        }
        catch (error) {
            console.log("Emulate Error", error);
        }
    }


    const handleRemoveLiquidity = async () => {

        if (!token0 || !token1 || !pairAddress) return;

        const unixDeadline = (Math.floor((Date.now() + Number(deadline) * 60 * 1000) / 1000)).toString();

        setRemoveLiquidityRunning(true);
        try {

            await getPancakeRouterApproval(pairAddress, v2RouterAddress, liquidtyToBeRemoved);

            const removeLiquidityTx = await removeLiquidityV2(
                token0,
                token1,
                v2RouterAddress,
                liquidtyToBeRemoved,
                amount0Min,
                amount1Min,
                unixDeadline
            )

            alert(`Liquidity Removed. Tx Hash : ${removeLiquidityTx}`)
        }
        catch (error) {
            console.log("Error Removing liquidity", error);
            alert("Error Removing Liquidity");
            setRemoveLiquidityRunning(false);
        }

        setRemoveLiquidityRunning(false);

    }

    useEffect(() => {
        const getUserAddress = async () => {
            try {
                const newProvider = new ethers.providers.Web3Provider(window.ethereum);
                const newSigner = newProvider.getSigner();
                const userAddressToSet = await newSigner.getAddress();
                setUserAddress(userAddressToSet);
            } catch (error) {
                console.error("Error fetching user address:", error);
                setUserAddress("");
            }
        };
    
        if (window.ethereum) {
            getUserAddress();
    
            // Listen for account changes
            const handleAccountsChanged = (accounts : any[]) => {
                if (accounts.length > 0) {
                    setUserAddress(accounts[0]);
                } else {
                    setUserAddress(""); // User disconnected wallet
                }
            };
    
            // Add event listener
            window.ethereum.on("accountsChanged", handleAccountsChanged);
    
            // Cleanup the event listener on unmount
            return () => {
                window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
            };
        } else {
            setUserAddress("");
        }
    }, []); // Dependency array empty so it runs once on mount

    useEffect(() => {
        const getPosition = async () => {
            setPositionLoading(true);
            try {
                const tokenResult : {amount0:number,amount1:number,liquidity:string,totalSupply:string} | null = await getMaxRemovableTokensV2(pairAddress);
                const positionToUse : V2PairData | null = await getPoolDataByAddressV2(pairAddress);

                if(!tokenResult || !positionToUse) throw("Position not found");

                console.log(tokenResult)

                const token0ToUse: TokenDetails = makeTokenFromInfo({
                    name : positionToUse.token0.name,
                    symbol : positionToUse.token0.symbol,
                    address : positionToUse.token0.id,
                    decimals : positionToUse.token0.decimals
                  })
              
                  const token1ToUse: TokenDetails = makeTokenFromInfo({
                    name : positionToUse.token1.name,
                    symbol : positionToUse.token1.symbol,
                    address : positionToUse.token1.id,
                    decimals : positionToUse.token1.decimals
                  })

                setToken0(token0ToUse);
                setToken1(token1ToUse);

                setTotalLiquidity(tokenResult.liquidity);
                setTotalSupply(tokenResult.totalSupply);

                setToken0Deposited(tokenResult.amount0.toString());
                setToken1Deposited(tokenResult.amount1.toString());

                setPositionLoading(false);
                setPositionLoadingError(false);
            }
            catch (error) {
                setPositionLoadingError(true);
                setPositionLoading(false);
                console.log(error);
            }
        }

        getPosition()

    }, [pairAddress, userAddress])

    useEffect(() => {
        // console.log("inside useeffec")
        const runCalculate = async () => {
            await calculate();
        }

        runCalculate();
    }, [percentLiquidityToRemove, token0])


    return (
        <>
            {positionLoading || positionLoadingError ? (
                <Box component="main" sx={{ minHeight: "calc(100vh - 150px)" }}>
                    <Box
                        sx={{
                            maxWidth: "800px",
                            margin: "0 auto",
                            py: "50px",
                            px: "16px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontSize: "16px",
                                fontWeight: "600",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                cursor: "pointer",
                            }}
                        >
                            {positionLoadingError
                                ? "Unable to Fetch Position. Please Refresh to Try Again"
                                : <>Loading Position... <CircularProgress size={20} /></>}
                        </Typography>
                    </Box>
                </Box>
            ) : (
                <>
                    <Box component="main" sx={{ minHeight: "calc(100vh - 150px)" }}>
                        <Box sx={{ maxWidth: '800px', margin: '0 auto', py: '50px', px: '15px' }}>

                            <Box className="white_box">
                                <Box sx={{ mb: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography
                                        onClick={handleGoBack}
                                        variant="h6"
                                        sx={{
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <BsArrowLeft size={20} /> Remove liquidity
                                    </Typography>
                                    <Box onClick={settingsModal}
                                    >
                                        <IoSettingsOutline style={{ width: '24px', height: '24px', color: theme === 'light' ? 'var(--primary)' : 'var(--cream)', cursor: 'pointer' }} />
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', mb: "15px" }}>
                                    <Box sx={{ position: 'relative' }}>
                                        <Image src={token0?.logoURI || ""} width={30} height={30} alt="Token" />
                                        <Image src={token1?.logoURI || ""} width={30} height={30} alt="Token" style={{ marginLeft: '-15px' }} />
                                    </Box>
                                    <Box sx={{ display: "flex", gap: '5px' }}>
                                        {token0 && token1 ? <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>{`${token0.symbol} / ${token1.symbol}`}</Typography> : null}
                                    </Box>
                                </Box>

                                <Box sx={{ background: theme === 'light' ? 'var(--light_clr)' : 'var(--secondary-dark)', padding: '15px', borderRadius: '10px', mb: '15px' }}>
                                    <Typography sx={{ mb: '15px', fontWeight: '600' }}>Liquidity</Typography>

                                    <Box sx={{ my: '20px' }}>
                                        <Typography component="span" sx={{ fontSize: '16px', fontWeight: '600', marginRight: '10px', maxWidth: '50px', width: '100%', display: 'inline-block' }}>{percentLiquidityToRemove}%</Typography>

                                        <Button
                                            onClick={() => handleButtonClick(25)}
                                            sx={{
                                                marginRight: '10px',
                                                border: `1px solid ${theme === 'light' ? 'var(--primary)' : 'var(--cream)'}`,
                                                color: theme === 'light' ? 'var(--primary)' : 'var(--cream)',
                                            }}
                                        >
                                            25%
                                        </Button>
                                        <Button
                                            onClick={() => handleButtonClick(50)}
                                            sx={{
                                                marginRight: '10px',
                                                border: `1px solid ${theme === 'light' ? 'var(--primary)' : 'var(--cream)'}`,
                                                color: theme === 'light' ? 'var(--primary)' : 'var(--cream)',
                                            }}
                                        >
                                            50%
                                        </Button>
                                        <Button
                                            onClick={() => handleButtonClick(75)}
                                            sx={{
                                                marginRight: '10px',
                                                border: `1px solid ${theme === 'light' ? 'var(--primary)' : 'var(--cream)'}`,
                                                color: theme === 'light' ? 'var(--primary)' : 'var(--cream)',
                                            }}
                                        >
                                            75%
                                        </Button>
                                        <Button sx={{
                                            marginRight: '10px',
                                            border: `1px solid ${theme === 'light' ? 'var(--primary)' : 'var(--cream)'}`,
                                            color: theme === 'light' ? 'var(--primary)' : 'var(--cream)',
                                        }} onClick={() => handleButtonClick(100)}>
                                            Max
                                        </Button>
                                    </Box>

                                    <Box>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            step="1"
                                            value={percentLiquidityToRemove}
                                            className='custom-range-slider'
                                            onChange={handleSliderChange}
                                            style={{ width: '100%' }}
                                        />
                                    </Box>
                                </Box>



                                <Box sx={{ background: theme === 'light' ? 'var(--light_clr)' : 'var(--secondary-dark)', padding: '15px', borderRadius: '10px' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '15px' }}>

                                        <Box sx={{ display: 'flex', gap: '10px' }}>
                                            <Typography sx={{ fontSize: '18px', fontWeight: '600' }}>Pooled {token0?.symbol}:</Typography>

                                        </Box>
                                        <Box sx={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Typography sx={{ fontSize: '18px', fontWeight: '600', color: theme === 'light' ? 'var(--primary)' : 'var(--white)' }}>{convertToReadable(amount0Min, token0?.address.decimals || null)}</Typography>
                                            <Image src={token0?.logoURI || ""} width={30} height={30} alt="Token" />
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', }}>

                                        <Box sx={{ display: 'flex', gap: '10px' }}>
                                            <Typography sx={{ fontSize: '18px', fontWeight: '600' }}>Pooled {token1?.symbol}:</Typography>

                                        </Box>
                                        <Box sx={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Typography sx={{ fontSize: '18px', fontWeight: '600', color: theme === 'light' ? 'var(--primary)' : 'var(--white)' }}>{convertToReadable(amount1Min, token1?.address.decimals || null)}</Typography>
                                            <Image src={token1?.logoURI || ""} width={30} height={30} alt="Token" />
                                        </Box>
                                    </Box>



                                </Box>

                                {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: '15px' }}>
                                    <Box>
                                        <Typography sx={{ fontWeight: '600' }}>Collect as WETH</Typography>
                                    </Box>
                                    <Box>
                                        <IOSSwitch
                                            checked={checked}
                                            onChange={handleChange}
                                            color="default"
                                        />
                                    </Box>
                                </Box> */}

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: '15px' }}>
                                    <Button variant="contained" color="secondary" sx={{ width: '100%' }} onClick={handleRemoveLiquidity} disabled={removeLiquidityRunning}>
                                        {removeLiquidityRunning ? <CircularProgress size={20} /> : "Remove"}
                                    </Button>
                                </Box>

                            </Box>
                        </Box>
                    </Box>
                    <SettingsModal
                        isOpen={isOpen}
                        handleClose={settingsModal}
                        theme="light"
                        slippageTolerance={slippageTolerance}
                        setSlippageTolerance={setSlippageTolerance}
                        deadline={deadline}
                        setDeadline={setDeadline}
                    />
                </>
            )}
        </>
    );
};

export default RemoveLiquidityV2;
