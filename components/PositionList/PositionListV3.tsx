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
import { V3PositionData } from '@/interfaces';
import tokenList from "../../utils/famousTokenTestnet.json";
import { tickToPrice } from '@/utils/utils';

interface PositionList {
    theme: 'light' | 'dark';
    data: V3PositionData;
}

export const PositionListV3 : React.FC<PositionList> = ({theme, data})=>{
    // const { theme, toggleTheme } = useTheme();

    const currentTick = Number(data.pool.tick);
    const upperTick = Number(data.tickUpper.tickIdx);
    const lowerTick = Number(data.tickLower.tickIdx);

    const token0 = tokenList.filter((elem) => {
        return elem.address.contract_address.toLowerCase() === data.token0.id;
    });
    
    const token1 = tokenList.filter((elem) => {
        return elem.address.contract_address.toLowerCase() === data.token1.id;
    });
    

    const decimalDifference = Number(data.token1.decimals) - Number(data.token1.decimals)

    return (
        <Box className="white_box" sx={{ p: 3, borderRadius: 2, boxShadow: 1, mb: '15px' }}>

<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
    <Box>
        <Box sx={{ position: 'relative' }}>
            <Image src={token0[0]?.logoURI} width={30} height={30} alt="Token" />
            <Image src={token1[0]?.logoURI} width={30} height={30} alt="Token" style={{ marginLeft: '-15px' }} />
        </Box>
        <Box sx={{ display: "flex", gap: '5px' }}>
            <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>{data.token0.symbol} / {data.token1.symbol}</Typography>
            <Typography component="span">{data.pool.feeTier}</Typography>
        </Box>
    </Box>
    <Box sx={{ color: '#2e7d32' }}>
        
            {currentTick < lowerTick ? (
                (<Badge color="error">Not In Range</Badge>)
            ):(
                currentTick > upperTick ? 
                (<Badge color="error">Not In Range</Badge>)
                :
                (<Badge color="success">In Range</Badge>))
            }
        
    </Box>
</Box>
<Box
    sx={{
        display: 'inline-flex',
        gap: '5px',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        '@media (max-width: 767px)': {
            flexDirection: 'column',
            alignItems: 'flex-start'
        },
    }}
>
    <Typography sx={{ color: theme === 'light' ? 'var(--cream)' : 'var(--white)' }}>Min: <Typography sx={{ color: theme === 'light' ? 'var(--primary)' : 'var(--cream)' }} component="span">{parseFloat(tickToPrice(lowerTick, decimalDifference).toFixed(3))} {data.token0.symbol} per {data.token1.symbol}</Typography></Typography>
    <Typography><VscArrowBoth /></Typography>
    <Typography sx={{ color: theme === 'light' ? 'var(--cream)' : 'var(--white)' }}>Max: <Typography sx={{ color: theme === 'light' ? 'var(--primary)' : 'var(--cream)' }} component="span">{parseFloat(tickToPrice(upperTick, decimalDifference).toFixed(3))} {data.token0.symbol} per {data.token1.symbol}</Typography></Typography>
</Box>
</Box>
    )

}