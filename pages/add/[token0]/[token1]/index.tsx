import React from 'react'
import AddLiquidity from '../../../../components/AddLiquidity/AddLiquidity'
import { Box, Container } from '@mui/material'
import { useRouter } from 'next/router';
import Header from '../../../../components/header/Header';
import Footer from '../../../../components/footer/Footer';


const index = () => {

  

  return (
    <>
      <Header />
      <Container>
        <Box className="AddLiquidity" sx={{ minHeight: 'calc(100vh - 149px)', py: '50px' }}>
          <AddLiquidity  theme={'light'} />
        </Box>
      </Container>
      <Footer />
    </>
  )
}

export default index