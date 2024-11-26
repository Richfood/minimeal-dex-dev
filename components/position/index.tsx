import React, { useContext, useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Badge, Box, Button, Typography, Link, IconButton } from '@mui/material';
import { BsArrowLeft, BsArrowUpRight, BsMoon, BsSun } from 'react-icons/bs';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useTheme } from '../../components/ThemeContext'; // Adjust the path to your ThemeContext
import IOSSwitch from '../../components/IOSSwitch/IOSSwitch';
import { VscArrowBoth } from "react-icons/vsc";
import { V3PositionData } from '@/interfaces';
import { getPositionByTokenId } from '@/utils/api/getPositionByTokenId';

interface PositionProps {
    tokenId: string;
  }

const Position = ({tokenId} : PositionProps) => {
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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };

    useEffect(()=>{
        const getPosition = async()=>{
          const positionToUse = await getPositionByTokenId(tokenId);
        }
    
        getPosition()
    
      },[])

    return (
        <>
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
                            <BsArrowLeft size={20} /> Back to pools
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'space-between', mb: '15px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Box sx={{ position: 'relative' }}>
                                <Image src="/images/9mm.png" width={30} height={30} alt="Token" />
                                <Image src="/images/9mm.png" width={30} height={30} alt="Token" style={{ marginLeft: '-15px' }} />
                            </Box>
                            <Box sx={{ display: "flex", gap: '5px' }}>
                                <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>USDC/ETH</Typography>
                                <Typography component="span">0.05%</Typography>
                            </Box>
                            <Box sx={{ color: '#2e7d32' }}>
                                <Badge color="success" variant="dot">
                                    In range
                                </Badge>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex',flexWrap: "wrap", alignItems: 'center', gap: '10px' }}>
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

                                onClick={()=>{
                                    console.log("PPPPP");
                                    router.push(`/increaseLiquidity/V3/${tokenId}`)
                                }}
                            >
                                Increase liquidity
                            </Button>
                            <Button variant="contained" color="primary"
                                onClick={()=>{
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
                            <Typography sx={{ mb: '15px', fontWeight: '600' }}>Liquidity</Typography>
                            <Typography sx={{ fontSize: '24px', fontWeight: '600', mb: '15px' }}>$103.88</Typography>

                            <Box sx={{ background: theme === 'light' ? 'var(--light_clr)' : 'var(--secondary-dark)', padding: '10px', borderRadius: '10px' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '15px' }}>
                                    <Box sx={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Image src="/images/9mm.png" width={30} height={30} alt="Token" />
                                        <Typography sx={{ fontSize: '18px', fontWeight: '600', color: theme === 'light' ? 'var(--primary)' : 'var(--white)' }}>USDC <BsArrowUpRight /></Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: '10px' }}>
                                        <Typography sx={{ fontWeight: '600' }}>45.77</Typography>
                                        <Typography sx={{ fontWeight: '600' }}>44%</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box sx={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Image src="/images/9mm.png" width={30} height={30} alt="Token" />
                                        <Typography sx={{ fontSize: '18px', fontWeight: '600', color: theme === 'light' ? 'var(--primary)' : 'var(--white)' }}>USDC <BsArrowUpRight /></Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: '10px' }}>
                                        <Typography sx={{ fontWeight: '600' }}>45.77</Typography>
                                        <Typography sx={{ fontWeight: '600' }}>44%</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>



                    <Box className="white_box" sx={{ p: 3, borderRadius: 2, boxShadow: 1, mb: '15px' }}>
                        <Box>
                            <Typography sx={{ mb: '15px', fontWeight: '600' }}>Unclaimed fees</Typography>
                            <Typography sx={{ fontSize: '24px', fontWeight: '600', mb: '15px' }}>$1.62</Typography>

                            <Box sx={{ background: theme === 'light' ? 'var(--light_clr)' : 'var(--secondary-dark)', padding: '10px', borderRadius: '10px' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '15px' }}>
                                    <Box sx={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Image src="/images/9mm.png" width={30} height={30} alt="Token" />
                                        <Typography sx={{ fontSize: '18px', fontWeight: '600', color: theme === 'light' ? 'var(--primary)' : 'var(--white)' }}>USDC <BsArrowUpRight /></Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: '10px' }}>
                                        <Typography sx={{ fontWeight: '600' }}>0.8129</Typography>

                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box sx={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Image src="/images/9mm.png" width={30} height={30} alt="Token" />
                                        <Typography sx={{ fontSize: '18px', fontWeight: '600', color: theme === 'light' ? 'var(--primary)' : 'var(--white)' }}>USDC <BsArrowUpRight /></Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: '10px' }}>
                                        <Typography sx={{ fontWeight: '600' }}>0.004994</Typography>

                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: '15px' }}>
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
            </Box>
        </>
    );
};

export default Position;
