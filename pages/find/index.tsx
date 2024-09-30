import React, { useCallback, useState } from 'react';
import { Box, Typography, Modal, Container, Button } from '@mui/material';
import { MdKeyboardBackspace } from 'react-icons/md';
import { IoCloseOutline } from 'react-icons/io5';
import { useTheme } from '../../components/ThemeContext';
import SelectedToken from '../../components/SelectToken/SelectedToken';
import { IoIosArrowDown } from 'react-icons/io';
import { HiPlus } from 'react-icons/hi2';
import { useRouter } from 'next/router';
import { BsArrowLeft } from 'react-icons/bs';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { TokenDetails } from '@/interfaces';



interface ImportPoolProps {
    open: boolean;
    onClose: () => void;
}

const ImportPool: React.FC<ImportPoolProps> = ({ open, onClose }) => {
    const { theme } = useTheme();
    const [openToken, setOpenToken] = useState(false);

    // Toggle token selection visibility
    const handleOpenToken = useCallback(() => setOpenToken(prev => !prev), []);
    const handleCloseToken = () => setOpenToken(false);

    const [token0,setToken0] =  useState<TokenDetails | null>(null);
    const [token1, setToken1] = useState<TokenDetails | null>(null);
    const [tokenBeingChosen, setTokenBeingChosen] = useState(0);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: 400,
        width: 'calc(100% - 30px)',
        bgcolor: theme === 'light' ? 'var(--white)' : 'var(--primary)',
        boxShadow: 'rgba(0, 0, 0, 0.24) -40px 40px 80px -8px',
        borderRadius: '16px',
        color: theme === 'light' ? 'var(--primary)' : 'var(--white)',

    };

    // Function to handle closing the expert mode (if needed)
    const handleCloseExpert: React.MouseEventHandler<SVGElement> = (event) => {
        // Implement functionality here if needed
        console.log('Close Expert Mode');
    };

    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    return (
        <>


            <Box>
                <Header />
                <Container>
                    <Box className="w-820" sx={{ minHeight: 'calc(100vh - 149px)', py: '50px' }}>

                        <Box className="white_box">

                            <Box sx={{display: 'flex',gap: '10px' }}>
                                <Typography
                                    onClick={handleGoBack}
                                    variant='h6'
                                    sx={{
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        display: 'flex',
                                        gap: '10px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <BsArrowLeft size={20} />
                                </Typography>
                                <Box>
                                    <Typography variant="h6" sx={{ lineHeight: 'normal', mb: '5px' }}>
                                        Import Pool
                                    </Typography>
                                    <Typography sx={{ fontSize: "12px", width: '100%', color: 'var(--cream)' }}>
                                        Import an existing pool
                                    </Typography>
                                </Box>
                            </Box>
                            <Box className="token-sec" sx={{ flexDirection: 'column', gap: '15px' }}>
                                <Box className="token-pair" onClick={handleOpenToken} sx={{ cursor: 'pointer', width: '100%', color: theme === 'light' ? 'var(--black)' : 'var(--white)', bgcolor: theme === 'light' ? 'var(--light_clr)' : 'var(--secondary-dark)' }}>
                                    <Box >
                                        <Typography sx={{ fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>PLS</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <IoIosArrowDown size={17} />
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <HiPlus size={20} />
                                </Box>
                                <Box onClick={handleOpenToken} className="token-pair" sx={{ width: '100%', color: theme === 'light' ? 'var(--black)' : 'var(--white)', bgcolor: theme === 'light' ? 'var(--light_clr)' : 'var(--secondary-dark)' }}>
                                    <Box >
                                        <Typography sx={{ fontSize: '14px', fontWeight: '700' }}>PLS</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <IoIosArrowDown size={17} />
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={{ textAlign: 'center', p: '20px', border: '1px solid var(--secondary)', borderRadius: '8px' }}>
                                <Typography sx={{ mb: '15px' }}>You don’t have liquidity in this pair yet.</Typography>
                                <Button variant="outlined" color="secondary"> Add Liquidity</Button>
                            </Box>
                        </Box>
                    </Box>
                </Container>
                <Footer />
            </Box>





            <SelectedToken
                openToken={openToken}
                handleCloseToken={handleCloseToken}
                mode={theme} // Ensure `theme` is passed correctly
                setToken0={setToken0}
                setToken1={setToken1}
                tokenNumber={tokenBeingChosen}
                description=''
            />
        </>
    );
};

export default ImportPool;
