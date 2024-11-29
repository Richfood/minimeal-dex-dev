import React, { useContext, useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Badge, Box, Button, Typography, Link, IconButton, CircularProgress } from '@mui/material';
import { BsArrowLeft, BsArrowUpRight, BsMoon, BsSun } from 'react-icons/bs';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useTheme } from '../../components/ThemeContext'; // Adjust the path to your ThemeContext
import IOSSwitch from '../../components/IOSSwitch/IOSSwitch';
import { VscArrowBoth } from "react-icons/vsc";
import { TokenDetails, V2PairData, V2PositionsData, V3PositionData } from '@/interfaces';
import { getPositionByTokenId } from '@/utils/api/getPositionByTokenId';
import famousTokenTestnet from "../../utils/famousTokenTestnet.json";
import { decimalRound, expandIfNeeded } from '@/utils/generalFunctions';
import { ethers } from 'ethers';
import { calculatePositionData } from '@/utils/calculatePositionData';
import { collectFees } from '@/utils/contract-methods/collectFees';
import { getMaxRemovableTokensV2 } from '@/utils/api/getMaxRemovableTokensV2';
import { getV2Positions } from '@/utils/api/getV2Positions';
import { getPoolDataByAddressV2 } from '@/utils/api/getPoolDataByAddressV2';

interface PositionProps {
    pairAddress: string;
}

const PositionV2 = ({ pairAddress }: PositionProps) => {
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
    const handleThemeToggle = () => {
        toggleTheme();
    };

    const handleGoBack = () => {
        router.back();
    };

    const [checked, setChecked] = useState(false);
    const [position, setPosition] = useState<V3PositionData | null>(null);

    const [positionLoading, setPositionLoading] = useState(true);
    const [positionLoadingError, setPositionLoadingError] = useState(false);

    const [token0Deposited, setToken0Deposited] = useState("");
    const [token1Deposited, setToken1Deposited] = useState("");
    const [token0, setToken0] = useState<TokenDetails | null>(null);
    const [token1, setToken1] = useState<TokenDetails | null>(null);
    const [feesEarned0, setFeesEarned0] = useState("");
    const [feesEarned1, setFeesEarned1] = useState("");
    const [feeTier, setFeeTier] = useState<number | null>(0.25);


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };

    const showAmount = (amount:string, decimal:number | null)=>{
        if(decimal === null){
            return "";
        }

        return parseFloat(decimalRound(ethers.utils.formatUnits(expandIfNeeded(decimalRound(amount,0)), decimal),2));
    }

    useEffect(() => {
        const getPosition = async () => {
            setPositionLoading(true);
            try {
                const tokenResult : {amount0:number,amount1:number} | null = await getMaxRemovableTokensV2(pairAddress);
                const positionToUse : V2PairData | null = await getPoolDataByAddressV2(pairAddress);

                if(!tokenResult || !positionToUse) throw("No data for this position");

                console.log(tokenResult)

                const token0ToUse: TokenDetails = famousTokenTestnet.filter((token) => token.address.contract_address.toLowerCase() === positionToUse.token0.id)[0];
                const token1ToUse: TokenDetails = famousTokenTestnet.filter((token) => token.address.contract_address.toLowerCase() === positionToUse.token1.id)[0];

                setToken0(token0ToUse);
                setToken1(token1ToUse);

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

    }, [pairAddress])

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
                                ? "Can't Fetch Position Data. Please Refresh to try again"
                                : <>Loading Position... <CircularProgress size={20} /></>}
                        </Typography>
                    </Box>
                </Box>
            ) : (
                <Box component="main" sx={{ minHeight: "calc(100vh - 150px)" }}>
                    <Box sx={{ maxWidth: '800px', margin: '0 auto', py: '50px', px: "16px" }}>
                        <Box sx={{ mb: '15px', display: 'flex', alignItems: 'center' }}>
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
                                <BsArrowLeft size={20} /> Back to Positions
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'space-between', mb: '15px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Box sx={{ position: 'relative' }}>
                                    <Image src={token0?.logoURI || ""} width={30} height={30} alt="Token" />
                                    <Image src={token1?.logoURI || ""} width={30} height={30} alt="Token" style={{ marginLeft: '-15px' }} />
                                </Box>
                                <Box sx={{ display: "flex", gap: '5px' }}>
                                    <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>{token0?.symbol + "/" + token1?.symbol}</Typography>
                                    <Typography component="span">{feeTier + "%"}</Typography>
                                </Box>
                                <Box sx={{ color: '#2e7d32' }}>
                                    <Badge color="success" variant="dot">
                                        In range
                                    </Badge>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: "wrap", alignItems: 'center', gap: '10px' }}>
                                <Button
                                    sx={{
                                        border: '1px solid',
                                        lineHeight: '12px',
                                        color: theme === 'light' ? 'var(--primary)' : 'var(--secondary)',
                                        borderColor: theme === 'light' ? 'var(--primary)' : 'var(--secondary)',
                                        padding: '10px 20px',
                                        textDecoration: 'none',
                                        borderRadius: '30px',
                                        cursor: 'pointer'
                                    }}

                                    onClick={() => {
                                        console.log("PPPPP");
                                        router.push(`/increaseLiquidity/V2/${pairAddress}`)
                                    }}
                                >
                                    Increase liquidity
                                </Button>
                                <Button variant="contained" color="primary"
                                    onClick={() => {
                                        console.log("PPPPP");
                                        router.push(`/removeLiquidity/V2/${pairAddress}`)
                                    }}
                                >
                                    Remove liquidity
                                </Button>
                            </Box>
                        </Box>

                        <Box className="white_box" sx={{ p: 3, borderRadius: 2, boxShadow: 1, mb: '15px' }}>
                            <Box>
                                <Typography sx={{ mb: '15px', fontWeight: '600' }}>Deposited Tokens</Typography>
                                {/* <Typography sx={{ fontSize: '24px', fontWeight: '600', mb: '15px' }}>$103.88</Typography> */}

                                <Box sx={{ background: theme === 'light' ? 'var(--light_clr)' : 'var(--secondary-dark)', padding: '10px', borderRadius: '10px' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '15px' }}>
                                        <Box sx={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Image src={token0?.logoURI || ""} width={30} height={30} alt="Token" />
                                            <Typography sx={{ fontSize: '18px', fontWeight: '600', color: theme === 'light' ? 'var(--primary)' : 'var(--white)' }}>{token0?.symbol} <BsArrowUpRight /></Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: '10px' }}>
                                            <Typography sx={{ fontWeight: '600' }}>{showAmount(token0Deposited, token0?.address.decimals || null)}</Typography>
                                            {/* <Typography sx={{ fontWeight: '600' }}>44%</Typography> */}
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Image src={token1?.logoURI || ""} width={30} height={30} alt="Token" />
                                            <Typography sx={{ fontSize: '18px', fontWeight: '600', color: theme === 'light' ? 'var(--primary)' : 'var(--white)' }}>{token1?.symbol} <BsArrowUpRight /></Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: '10px' }}>
                                            <Typography sx={{ fontWeight: '600' }}>{showAmount(token1Deposited, token1?.address.decimals || null)}</Typography>
                                            {/* <Typography sx={{ fontWeight: '600' }}>44%</Typography> */}
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                    {/* <Box className="white_box" sx={{ p: 3, borderRadius: 2, boxShadow: 1, mb: '15px' }}>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                            <Box>
                                <Box sx={{ position: 'relative' }}>
                                    <Image src="/images/9mm.png" width={30} height={30} alt="Token" />
                                    <Image src="/images/9mm.png" width={30} height={30} alt="Token" style={{ marginLeft: '-15px' }} />
                                </Box>
                                <Box sx={{ display: "flex", gap: '5px' }}>
                                    <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>USDC/ETH</Typography>
                                    <Typography component="span">0.05%</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ color: '#2e7d32' }}>
                                <Badge color="success" variant="dot">
                                    In range
                                </Badge>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                gap: '5px',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                '@media (max-width: 767px)': {
                                    flexDirection: 'column',
                                    alignItems: 'flex-start'
                                },
                            }}
                        >
                            <Typography sx={{ color: theme === 'light' ? 'var(--cream)' : 'var(--white)' }}>Min: <Typography sx={{ color: theme === 'light' ? 'var(--primary)' : 'var(--cream)' }} component="span">1,616.52 USDC per ETH</Typography></Typography>
                            <Typography><VscArrowBoth /></Typography>
                            <Typography sx={{ color: theme === 'light' ? 'var(--cream)' : 'var(--white)' }}>Max: <Typography sx={{ color: theme === 'light' ? 'var(--primary)' : 'var(--cream)' }} component="span">1,650.83 USDC per ETH</Typography></Typography>
                        </Box>
                    </Box> */}



                </Box>
                </Box >
            )}
        </>
    );
};

export default PositionV2;
