import React from 'react'
import AddLiquidityV3 from '../../../../../components/AddLiquidity/AddLiquidityV3'
import { Box, Container } from '@mui/material'
import { useRouter } from 'next/router';
import Header from '../../../../../components/Header/Header';
import Footer from '../../../../../components/Footer/Footer';
import { Protocol } from '@/interfaces';

// V3
const index = () => {
  return (
    <>
      <Header />
      <Container>
        <Box className="AddLiquidity" sx={{ minHeight: 'calc(100vh - 149px)', py: '50px' }}>
          <AddLiquidityV3  theme={'light'} defaultActiveProtocol={Protocol.V3}/>
        </Box>
      </Container>
      <Footer />
    </>
  )
}

export default index