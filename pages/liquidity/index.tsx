import React, { useState, useCallback } from 'react';
import { Box, Container } from '@mui/material'
import Liquidity from '../../components/Liquidity/Liquidity';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';

const index = () => {
    return (
        <Box>
            <Header />
            <Container>
                <Box className="Liquidity w-820" sx={{ minHeight: 'calc(100vh - 149px)',py: '50px' }}>
                    <Liquidity theme={'light'} />
                </Box>
            </Container>
            <Footer />
        </Box>
    )
}

export default index