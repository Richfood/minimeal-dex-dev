import React, { useState, useCallback, useEffect } from 'react';
import SwapGraph from '../components/SwapGraph/SwapGraph';
import SwapWidget from '../components/SwapWidget/SwapWidget';
import { useTheme } from '../components/ThemeContext';

import { Box, Container } from '@mui/material';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

interface Token {
    name: string;
    symbol: string;
    address?: {
        contract_address: string;
        decimals: number;
    };
}

const IndexPage = () => {
    const { theme, toggleTheme } = useTheme();
    const handleThemeToggle = () => {
        toggleTheme();
    };

    const [show, setShow] = useState(true);
    const [isWidgetListActive, setIsWidgetListActive] = useState(false); // State to manage class

    const handleToggle = useCallback(() => {
        setShow(prevShow => !prevShow);
        setIsWidgetListActive(prevState => !prevState); // Toggle the class state
    }, []);



    const [zoomed, setZoomed] = useState(false);

    const handleZoomClick = () => {
        setZoomed(!zoomed);
    };

    // Automatically save tokens to local storage when they change
    useEffect(() => {
        // Set example token data
        const exampleToken0: Token = {
            name: 'PLS',
            symbol: 'PLS',
        };

        const exampleToken1: Token = {
            name: '9MM',
            symbol: '9MM',
            address: { contract_address: '0x7b39712Ef45F7dcED2bBDF11F3D5046bA61dA719', decimals: 18 },
        };

        // Save tokens to local storage after setting state
        localStorage.setItem('token0', JSON.stringify(exampleToken0));
        localStorage.setItem('token1', JSON.stringify(exampleToken1));
    }, []);

    return (
        <Box>
            <Header />
            <Container>
                <Box className="swap_graph_sec" sx={{ minHeight: 'calc(100vh - 149px)' }}>
                    {show &&
                        <Box className={theme === 'light' ? 'swap_graph_box white_box light-section' : 'swap_graph_box white_box dark-section'}>
                            <SwapGraph zoomed={zoomed} onClick={handleZoomClick} />
                        </Box>
                    }
                    <Box className="swap_widgets white_box" sx={{
                        mt: '50px', maxWidth: '1200px', position: 'relative', mb: '50px',
                        '@media (max-width: 1269px)': {
                            maxWidth: 'calc(100% - 40px)',
                        },
                    }}>
                        <Box>
                            <SwapWidget onToggle={handleToggle} />
                        </Box>
                    </Box>
                </Box>
            </Container>
            <Footer />
        </Box>
    );
};

export default IndexPage;
