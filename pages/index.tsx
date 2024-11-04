import React, { useState, useCallback, useEffect } from 'react';
import SwapGraph from '../components/SwapGraph/SwapGraph';
import SwapWidget from '../components/SwapWidget/SwapWidget';
import { useTheme } from '../components/ThemeContext';

import { Box, CircularProgress, Container } from '@mui/material';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const IndexPage = () => {
    const { theme, toggleTheme } = useTheme();
    const handleThemeToggle = () => {
        toggleTheme();
    };

    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handlePageLoading = (loading: boolean) => {
        setLoading(loading); // Update parent state
    };



    const [zoomed, setZoomed] = useState(false);

    const handleZoomClick = () => {
        setZoomed(!zoomed);
    };
    return (
        <>
            <Box>
                <Header />
                <Container>
                    <Box className="swap_graph_sec" sx={{ minHeight: 'calc(100vh - 149px)' }}>
                        {show && (
                            <Box
                                className={
                                    theme === 'light'
                                        ? 'swap_graph_box white_box light-section'
                                        : 'swap_graph_box white_box dark-section'
                                }
                            >
                                <SwapGraph zoomed={zoomed} onClick={handleZoomClick} />
                            </Box>
                        )}
                        <Box
                            className="swap_widgets white_box"
                            sx={{
                                mt: '50px',
                                maxWidth: '1200px',
                                position: 'relative',
                                mb: '50px',
                                '@media (max-width: 1269px)': {
                                    maxWidth: 'calc(100% - 40px)',
                                },
                            }}
                        >
                            <Box>
                                <SwapWidget pageLoading={handlePageLoading} />
                            </Box>
                        </Box>
                    </Box>
                </Container>
                <Footer />
            </Box>


        </>
    );

};

export default IndexPage;
