// pages/index.tsx

import React from 'react';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import { Box, Button, Container } from '@mui/material';
import SwapGraph from '@/components/SwapGraph/SwapGraph';


const IndexPage = () => {
    return (
        <Box>
            <Header />
            <Container>
                <Box className="swap_graph_sec">
                    <Box className="swap_graph_box">
                        <SwapGraph />
                    </Box>
                </Box>
            </Container>
            <Footer />
        </Box>
    );
};

export default IndexPage;
