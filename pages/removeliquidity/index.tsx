import React, { useCallback, useContext, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Badge, Box, Button, Typography, Link, IconButton } from '@mui/material';
import { BsArrowLeft, BsArrowUpRight, BsMoon, BsSun } from 'react-icons/bs';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useTheme } from '../../components/ThemeContext'; // Adjust the path to your ThemeContext
import IOSSwitch from '../../components/IOSSwitch/IOSSwitch';
import { IoSettingsOutline } from 'react-icons/io5';
import SettingsModal from '@/components/SettingModal/SettingModal-addLiquidity';

const RemoveLiquidity = () => {
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [slippageTolerance, setSlippageTolerance] = useState<number | null>(null);
    const [deadline, setDeadline] = useState<string>('');

    const handleThemeToggle = () => {
        toggleTheme();
    };

    const handleGoBack = () => {
        router.back();
    };

    const settingsModal = useCallback(() => setIsOpen((prev) => !prev), []);


    const [checked, setChecked] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };


    const [value, setValue] = useState(50);

    // Handle the range slider change
    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(Number(event.target.value));
    };

    // Handle the preset button clicks
    const handleButtonClick = (newValue: number) => {
        setValue(newValue);
    };


    return (
        <>
            <Header />
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
                                <Image src="/images/9mm.png" width={30} height={30} alt="Token" />
                                <Image src="/images/9mm.png" width={30} height={30} alt="Token" style={{ marginLeft: '-15px' }} />
                            </Box>
                            <Box sx={{ display: "flex", gap: '5px' }}>
                                <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>USDC/ETH</Typography>

                            </Box>
                        </Box>

                        <Box sx={{ background: theme === 'light' ? 'var(--light_clr)' : 'var(--secondary-dark)', padding: '15px', borderRadius: '10px', mb: '15px' }}>
                            <Typography sx={{ mb: '15px', fontWeight: '600' }}>Liquidity</Typography>

                            <Box sx={{ my: '20px' }}>
                                <Typography component="span" sx={{ fontSize: '16px', fontWeight: '600', marginRight: '10px', maxWidth: '50px', width: '100%', display: 'inline-block' }}>{value}%</Typography>

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
                                    value={value}
                                    className='custom-range-slider'
                                    onChange={handleSliderChange}
                                    style={{ width: '100%' }}
                                />
                            </Box>
                        </Box>


                        <Box sx={{ background: theme === 'light' ? 'var(--light_clr)' : 'var(--secondary-dark)', padding: '15px', borderRadius: '10px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '15px' }}>

                                <Box sx={{ display: 'flex', gap: '10px' }}>
                                    <Typography sx={{ fontSize: '18px', fontWeight: '600' }}>Pooled USDC:</Typography>

                                </Box>
                                <Box sx={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Typography sx={{ fontSize: '18px', fontWeight: '600', color: theme === 'light' ? 'var(--primary)' : 'var(--white)' }}>45.7</Typography>
                                    <Image src="/images/9mm.png" width={30} height={30} alt="Token" />
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', }}>

                                <Box sx={{ display: 'flex', gap: '10px' }}>
                                    <Typography sx={{ fontSize: '18px', fontWeight: '600' }}>Pooled ETH:</Typography>

                                </Box>
                                <Box sx={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Typography sx={{ fontSize: '18px', fontWeight: '600', color: theme === 'light' ? 'var(--primary)' : 'var(--white)' }}>0.03561</Typography>
                                    <Image src="/images/9mm.png" width={30} height={30} alt="Token" />
                                </Box>
                            </Box>



                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: '15px' }}>
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

                        <Box>
                            <Button variant="contained" color="secondary" sx={{ width: '100%' }}>
                                Remove
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
            <Footer />
        </>
    );
};

export default RemoveLiquidity;
