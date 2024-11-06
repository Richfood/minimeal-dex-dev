import React from 'react'
import AddLiquidityV2 from '../../../../../components/AddLiquidity/AddLiquidityV2'
import { Box, Container } from '@mui/material'
import { useRouter } from 'next/router';
import Header from '../../../../../components/Header/Header';
import Footer from '../../../../../components/Footer/Footer';
import { Protocol } from '@/interfaces';

// V2
const index = () => {
  return (
    <>
      <Header />
      <Container>
        <Box className="AddLiquidity" sx={{ minHeight: 'calc(100vh - 149px)', py: '50px' }}>
          <AddLiquidityV2  theme={'light'} defaultActiveProtocol={Protocol.V2}/>
        </Box>
      </Container>
      <Footer />
    </>
  )
}

export default index