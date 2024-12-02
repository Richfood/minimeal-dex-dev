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
import { TokenDetails, V3PositionData } from '@/interfaces';
import { getPositionByTokenId } from '@/utils/api/getPositionByTokenId';
import famousTokenTestnet from "../../utils/famousTokenTestnet.json";
import { decimalRound, makeTokenFromInfo } from '@/utils/generalFunctions';
import { ethers } from 'ethers';
import { calculatePositionData } from '@/utils/calculatePositionData';
import { collectFees } from '@/utils/contract-methods/collectFees';

interface PositionProps {
    tokenId: string;
}

const PositionV3 = ({ tokenId }: PositionProps) => {
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
    const [runningCollectFees, setRunningCollectFees] = useState(false);

    const [positionLoading, setPositionLoading] = useState(true);
    const [positionLoadingError, setPositionLoadingError] = useState(false);

    const [token0Deposited, setToken0Deposited] = useState("");
    const [token1Deposited, setToken1Deposited] = useState("");
    const [token0, setToken0] = useState<TokenDetails | null>(null);
    const [token1, setToken1] = useState<TokenDetails | null>(null);
    const [feesEarned0, setFeesEarned0] = useState("");
    const [feesEarned1, setFeesEarned1] = useState("");
    const [feeTier, setFeeTier] = useState<number | null>(null);

    const [userAddress, setUserAddress] = useState("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };

    const handleCollectFees = async()=>{
        setRunningCollectFees(true);
        try{
            const txHash = await collectFees(
                feesEarned0,
                feesEarned1,
                tokenId
            )

            alert(`Fee Collected. TxHash : ${txHash}`);
        }
        catch(error){
            console.log(error);
            alert(`Error Collecting Fees`);
            setRunningCollectFees(false);
        }
        setRunningCollectFees(false);
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
                const positionToUse: V3PositionData = await getPositionByTokenId(tokenId, userAddress);

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
                setToken0Deposited(positionToUse.depositedToken0);
                setToken1Deposited(positionToUse.depositedToken1);

                const { humanReadableFeesToken0, humanReadableFeesToken1 } = calculatePositionData(positionToUse);

                setFeesEarned0(humanReadableFeesToken0);
                setFeesEarned1(humanReadableFeesToken1);

                setFeeTier(Number(positionToUse.pool.feeTier) / 10000)
            }
            catch (error) {
                console.log(error);
                setPositionLoadingError(true);
                setPositionLoading(false);
            }
            setPositionLoading(false);
            setPositionLoadingError(false);
        }

        getPosition()

    }, [tokenId, userAddress])

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
                                        router.push(`/increaseLiquidity/V3/${tokenId}`)
                                    }}
                                >
                                    Increase liquidity
                                </Button>
                                <Button variant="contained" color="primary"
                                    onClick={() => {
                                        console.log("PPPPP");
                                        router.push(`/removeLiquidity/V3/${tokenId}`)
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
                                            <Typography sx={{ fontWeight: '600' }}>{decimalRound(token0Deposited, 2)}</Typography>
                                            {/* <Typography sx={{ fontWeight: '600' }}>44%</Typography> */}
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Image src={token1?.logoURI || ""} width={30} height={30} alt="Token" />
                                            <Typography sx={{ fontSize: '18px', fontWeight: '600', color: theme === 'light' ? 'var(--primary)' : 'var(--white)' }}>{token1?.symbol} <BsArrowUpRight /></Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: '10px' }}>
                                            <Typography sx={{ fontWeight: '600' }}>{decimalRound(token1Deposited, 2)}</Typography>
                                            {/* <Typography sx={{ fontWeight: '600' }}>44%</Typography> */}
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>



                        <Box
                            className="white_box"
                            sx={{ p: 3, borderRadius: 2, boxShadow: 1, mb: '15px' }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '15px' }}>
                                <Typography sx={{ fontWeight: '600' }}>Unclaimed Fees</Typography>
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: 'var(--primary)',
                                        color: 'white',
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        fontWeight: '600',
                                        '&:hover': {
                                            backgroundColor: 'var(--primary)',
                                        },
                                    }}
                                    onClick={handleCollectFees}
                                >
                                    {runningCollectFees ? <CircularProgress size={20}/> : "Collect Fees"}
                                </Button>
                            </Box>
                            <Typography sx={{ fontSize: '24px', fontWeight: '600', mb: '15px' }}>
                                {feesEarned1 + ' ' + token1?.symbol}
                            </Typography>

                            <Box
                                sx={{
                                    background: theme === 'light' ? 'var(--light_clr)' : 'var(--secondary-dark)',
                                    padding: '10px',
                                    borderRadius: '10px',
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        mb: '15px',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            color: 'var(--primary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                        }}
                                    >
                                        <Image
                                            src={token0?.logoURI || ''}
                                            width={30}
                                            height={30}
                                            alt="Token"
                                        />
                                        <Typography
                                            sx={{
                                                fontSize: '18px',
                                                fontWeight: '600',
                                                color:
                                                    theme === 'light'
                                                        ? 'var(--primary)'
                                                        : 'var(--white)',
                                            }}
                                        >
                                            {token0?.symbol}
                                            <BsArrowUpRight />
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: '10px' }}>
                                        <Typography sx={{ fontWeight: '600' }}>{feesEarned0}</Typography>
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            color: 'var(--primary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                        }}
                                    >
                                        <Image
                                            src={token1?.logoURI || ''}
                                            width={30}
                                            height={30}
                                            alt="Token"
                                        />
                                        <Typography
                                            sx={{
                                                fontSize: '18px',
                                                fontWeight: '600',
                                                color:
                                                    theme === 'light'
                                                        ? 'var(--primary)'
                                                        : 'var(--white)',
                                            }}
                                        >
                                            {token1?.symbol}
                                            <BsArrowUpRight />
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: '10px' }}>
                                        <Typography sx={{ fontWeight: '600' }}>{feesEarned1}</Typography>
                                    </Box>
                                </Box>
                            </Box>

                        {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: '15px' }}>
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

export default PositionV3;
