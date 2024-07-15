// pages/index.tsx

import React from 'react';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import { Box, Button, Container } from '@mui/material';
import SwapGraph from '@/components/SwapGraph/SwapGraph';
import SwapWidget from '@/components/SwapWidget/SwapWidget';
import { useTheme } from './ThemeContext';


const IndexPage = () => {

    const { theme, toggleTheme } = useTheme();

    const handleThemeToggle = () => {
      toggleTheme(); 
    };
  


    return (
        <Box>
            <Header />
            <Container>
                <Box className="swap_graph_sec">

                    <Box  className={theme == 'light' ? 'swap_graph_box white_box light-section ' : 'swap_graph_box white_box dark-section' }>
                        <SwapGraph />
                    </Box>

                    <Box className="swap_widgets white_box" sx={{mt: '50px',maxWidth: '1200px' ,position: 'relative',mb: '175px'}}>
                       <SwapWidget />
                    </Box>

                </Box>
            </Container>
            <Footer />
        </Box>
    );
};

export default IndexPage;
