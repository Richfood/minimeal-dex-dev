import React, { useContext, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Badge, Box, Button, Typography, Link, IconButton } from '@mui/material';
import { BsArrowLeft, BsArrowUpRight, BsMoon, BsSun } from 'react-icons/bs';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useTheme } from '../../components/ThemeContext'; // Adjust the path to your ThemeContext
import IOSSwitch from '../../components/IOSSwitch/IOSSwitch';
import { VscArrowBoth } from "react-icons/vsc";
import { V2PositionsData, V3PositionData } from '@/interfaces';
import tokenList from "../../utils/famousTokenTestnet.json";
import { tickToPrice } from '@/utils/utils';

interface PositionList {
    theme: 'light' | 'dark';
    data: V2PositionsData;
}

export const PositionListV2 : React.FC<PositionList> = ({theme, data})=>{

    const token0 = tokenList.filter((elem)=>{
        return elem.address.contract_address.toLowerCase() === data.pair.token0.id;
    })

    const token1 = tokenList.filter((elem)=>{
        return elem.address.contract_address.toLowerCase() === data.pair.token1.id;
    })

    return (
        <Box className="white_box" sx={{ p: 3, borderRadius: 2, boxShadow: 1, mb: '15px' }}>

<Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
  <Box>
    <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
      {/* First Token Image */}
      <Image 
        src={token0[0]?.logoURI} 
        width={30} 
        height={30} 
        alt="Token" 
        style={{ zIndex: 2 }} 
      />
      {/* Second Token Image with overlapping style */}
      <Image 
        src={token1[0]?.logoURI} 
        width={30} 
        height={30} 
        alt="Token" 
        style={{ 
          marginLeft: '-15px', // Overlap the tokens
          zIndex: 1 
        }} 
      />
    </Box>
    <Box sx={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
      <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>
        {data.pair.token0.symbol} / {data.pair.token1.symbol}
      </Typography>
      <Typography component="span">0.25%</Typography>
    </Box>
  </Box>

    <Box 
        sx={{ 
            color: '#993902', 
            backgroundColor: 'rgba(153, 57, 2, 0.2)', // Translucent brown
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            width: '30px', // Adjust to your desired size
            height: '30px', // Same as width to make it a circle
            borderRadius: '50%', // Makes the container circular
        }}
    >
        <Badge>V2</Badge>
    </Box>
</Box>
<Box
    sx={{
        display: 'flex',
        gap: '5px',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-start',
        '@media (max-width: 767px)': {
            flexDirection: 'column',
            alignItems: 'flex-start'
        },
    }}
>
    <Typography sx={{ color: theme === 'light' ? 'var(--cream)' : 'var(--white)' }}>Price : <Typography  component="span">{parseFloat(Number(data.pair.token0Price).toFixed(3))} {data.pair.token0.symbol} / {data.pair.token1.symbol}</Typography></Typography>
</Box>
</Box>
    )

}