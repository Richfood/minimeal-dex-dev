import React from 'react';
import { Box, Container } from '@mui/material';
import Header from '../../../../components/Header/Header';
import Footer from '../../../../components/Footer/Footer';
import { useRouter } from 'next/router';
import RemoveLiquidityV2 from '@/../../components/RemoveLiquidity/RemoveLiquidityV2';

const Index = () => {
    const router = useRouter();
    const { pairaddress } = router.query;

    // Ensure tokenId is always a string
    const pairAddress = Array.isArray(pairaddress) ? pairaddress[0] : pairaddress || '';

    return (
        <>
            <Header />
                <Container>
                    <Box className="AddLiquidity" sx={{ minHeight: 'calc(100vh - 149px)', py: '50px' }}>
                        <RemoveLiquidityV2 pairAddress={pairAddress}/>
                    </Box>
                </Container>
            <Footer/>
        </>
    );
};

export default Index;
