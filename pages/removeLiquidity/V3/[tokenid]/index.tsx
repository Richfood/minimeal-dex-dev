import React from 'react';
import { Box, Container } from '@mui/material';
import Header from '../../../../components/Header/Header';
import Footer from '../../../../components/Footer/Footer';
import { useRouter } from 'next/router';
import RemoveLiquidity from '@/../../components/RemoveLiquidity/RemoveLiquidity';

const Index = () => {
    const router = useRouter();
    const { tokenid } = router.query;

    // Ensure tokenId is always a string
    const tokenId = Array.isArray(tokenid) ? tokenid[0] : tokenid || '';

    return (
        <>
            <Header />
                <Container>
                    <Box className="AddLiquidity" sx={{ minHeight: 'calc(100vh - 149px)', py: '50px' }}>
                        <RemoveLiquidity tokenId={tokenId}/>
                    </Box>
                </Container>
            <Footer/>
        </>
    );
};

export default Index;