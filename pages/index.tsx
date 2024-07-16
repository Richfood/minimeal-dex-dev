import React, { useState, useCallback } from 'react';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import SwapGraph from '@/components/SwapGraph/SwapGraph';
import SwapWidget from '@/components/SwapWidget/SwapWidget';
import { useTheme } from '../components/ThemeContext';

import { Box, Container } from '@mui/material';


const IndexPage = () => {
    const { theme, toggleTheme } = useTheme();

    const handleThemeToggle = () => {
        toggleTheme();
    };

    const [show, setShow] = useState(true);

    const handleToggle = useCallback(() => setShow(prevShow => !prevShow), []);

    return (
        <Box>
            <Header />
            <Container>
                <Box className="swap_graph_sec">
                    <Box className={theme === 'light' ? 'swap_graph_box white_box light-section' : 'swap_graph_box white_box dark-section'}>
                        <SwapGraph onToggle={handleToggle} />
                    </Box>
                    <Box className="swap_widgets white_box" sx={{ mt: '50px', maxWidth: '1200px', position: 'relative', mb: '175px' }}>
                        <SwapWidget  onToggle={handleToggle} />
                    </Box>
                </Box>
            </Container>
            <Footer />
        </Box>
    );
};

export default IndexPage;
