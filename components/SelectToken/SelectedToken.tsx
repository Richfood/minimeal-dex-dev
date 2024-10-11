import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { IoCloseOutline } from 'react-icons/io5';
import { List, ListItem } from '@mui/material';
import ManageToken from '../ManageToken/ManageToken';
import Image from 'next/image';

import tokenList from "../../utils/tokenList.json";
import { TokenDetails } from '@/interfaces';

interface SelectedTokenProps {
    openToken: boolean;
    handleCloseToken: () => void;
    mode: 'light' | 'dark';
    setToken0: React.Dispatch<React.SetStateAction<TokenDetails | null>>;
    setToken1: React.Dispatch<React.SetStateAction<TokenDetails | null>>;
    title?: string;
    description: string;
    tokenNumber: number;
    token0: TokenDetails | null
    token1: TokenDetails | null

}

// interface Token {
//     name: string;
//     symbol: string;
//     address: {
//         contract_address: string;
//         decimals: number;
//     };
//     image: string; // URL to the token's image
// }


const fetchStablecoins = async (): Promise<any> => {
    const url = 'https://api.coingecko.com/api/v3/coins/list';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'x-cg-api-key': 'CG-FKLVTYvNVHpiLV7WntH31dPF'
        }
    };

    try {
        const res = await fetch(url, options);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const json = await res.json();
        return json;
    } catch (err) {
        console.error('Error:', err);
        return null;
    }
};

const fetchCoinStablecoins = async () => {
    try {

        const idsArray = ["tether", "usd-coin-pulsechain", "pulsecoin", "pulsebitcoin-pulsechain", "dai-on-pulsechain",
            "hex-pulsechain", "doge-on-pulsechain", "wrapped-bitcoin-pulsechain", "bitcoin", "xen-crypto-pulsechain"]
        const response = await fetch('api/coins', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idsArray }),
        });

        if (!response.ok) {
            console.error('Failed to fetch data from API:', response);
            return null;
        }

        const data = await response.json();
        console.log("🚀 ~ fetchCoinStablecoins ~ response:", response)

        return data;
    } catch (error) {
        console.error('Error fetching data from API:', error);
        return null;

    }
};

const SelectedToken: React.FC<SelectedTokenProps> = ({ openToken, handleCloseToken, mode, setToken0, setToken1, tokenNumber, token0, token1

}) => {
    console.log("🚀 ~ token0:", token0)
    console.log("🚀 ~ tokenNumber:", tokenNumber === 0)
    console.log("🚀 ~ token1:", token1)

    const [openManage, setOpenManage] = useState(false);
    const [tokenSelected, setTokenSelected] = useState<string>("");
    const [coinData, setCoinData] = useState<any[]>([]);
    const [tokenA, setTokenA] = useState<TokenDetails | any>(null);
    const [tokenB, setTokenB] = useState<TokenDetails | any>(null);

    const handleOpenManage = () => setOpenManage(true);
    const handleCloseManage = () => setOpenManage(false);

    const handleSelectToken = (token: TokenDetails) => {
        console.log("🚀 ~ handleSelectToken ~ token:", token)
        if (tokenNumber === 0) {
            console.log("🚀 ~ handleSelectToken ~ tokenNumber:0", tokenNumber)
            // Check if the selected token is already token0
            console.log("🚀 ~ handleSelectToken ~ token?.address?.contract_address === token1?.address?.contract_address:", token?.address?.contract_address === token1?.address?.contract_address)
            if (token?.address?.contract_address === token1?.address?.contract_address) {
                console.log("🚀 ~ handleSelectToken ~ token?.address?.contract_address:0", token?.address?.contract_address)
                // If the selected token is token0, swap with token1
                setToken0(token);
                setToken1(token0);
            } else {
                console.log("🚀 ~ handleSelectToken ~ token?.address?.contract_address:0 else", token?.address?.contract_address)

                // Set token0 to the selected token
                setToken0(token);
            }
        } else {
            console.log("🚀 ~ handleSelectToken ~ tokenNumber:1", tokenNumber)

            // Check if the selected token is already token1
            if (token?.address?.contract_address === token0?.address?.contract_address) {
                console.log("🚀 ~ handleSelectToken ~ token?.address?.contract_address:", token?.address?.contract_address)
                // If the selected token is token1, swap with token0
                setToken1(token);
                setToken0(token1);
            } else {
                console.log("🚀 ~ handleSelectToken ~ token?.address?.contract_address:else", token?.address?.contract_address)

                // Set token1 to the selected token
                setToken1(token);
            }
        }

        setTokenSelected(token?.address?.contract_address);
        handleCloseToken(); 
    };



    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        fontSize: '14px',
        fontWeight: '500',
        transform: 'translate(-50%, -50%)',
        maxWidth: 600,
        width: 'calc(100% - 30px)',
        bgcolor: mode === 'light' ? 'var(--white)' : 'var(--primary)',
        boxShadow: 'rgba(0, 0, 0, 0.24) -40px 40px 80px -8px',
        borderRadius: '16px',
        color: mode === 'light' ? 'var(--primary)' : 'var(--white)',
        maxHeight: '90vh',
        overflow: 'hidden'
    };

    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: '10px',
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        width: '100%',
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        background: mode === 'light' ? 'var(--gray)' : 'inherit',
        width: '100%',
        borderRadius: '10px',
        '& .MuiInputBase-input': {
            padding: '10px 15px',
            fontSize: '14px',
            transition: theme.transitions.create('width'),
            width: '100%',
            lineHeight: '1.2'
        },
    }));

    useEffect(() => {
        const getStablecoins = async () => {
            const data = await fetchStablecoins();
            console.log("🚀 ~ getStablecoins ~ data:", data)
            const usableCoinData = await fetchCoinStablecoins(); // Pass the array of IDs to the function
            console.log("🚀 ~ getStablecoins ~ usableCoinData:", usableCoinData);
            setCoinData(usableCoinData)
        }

        getStablecoins();
    }, []);

    useEffect(() => {
        const savedTokenA = localStorage.getItem('token0');
        const savedTokenB = localStorage.getItem('token1');

        if (savedTokenA) {
            setTokenA(JSON.parse(savedTokenA));
        } else {
            setTokenA(null);
        }

        if (savedTokenB) {
            setTokenB(JSON.parse(savedTokenB));
        } else {
            setTokenB(null);
        }
    }, []);

    return (
        <>
            <Modal
                open={openToken}
                onClose={handleCloseToken}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box className="modal_head" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">Select a Token</Typography>
                        <IoCloseOutline onClick={handleCloseToken} size={24} style={{ cursor: 'pointer' }} />
                    </Box>
                    <Box className="modal_body">
                        <Box className="search_box">
                            <Search>
                                <StyledInputBase
                                    placeholder="Search name or paste address"
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </Search>
                        </Box>
                        <Box className="common_token" sx={{ pt: '20px' }}>
                            <Typography sx={{ fontWeight: '500', fontSize: '14px' }}>Common tokens</Typography>
                            <Box className="token_Outer" sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>

                                <Box
                                    className="token_box"
                                    sx={{
                                        cursor: (tokenNumber === 0 && token0?.address?.contract_address === tokenA?.address?.contract_address) ? "default" : "pointer",
                                        opacity: (tokenNumber === 0 && token0?.address?.contract_address === tokenA?.address?.contract_address) ? 0.4 : 1,
                                    }}
                                    onClick={(tokenNumber === 0 && token0?.address?.contract_address === tokenA?.address?.contract_address) ? undefined : () => handleSelectToken(tokenA)}
                                >
                                    <img
                                        src="/images/pls.png"
                                        alt={tokenA?.symbol}
                                        style={{ width: 24, height: 24, marginRight: 8 }} // Adjust size and spacing as needed
                                    />
                                    <Typography>{tokenA?.symbol.toUpperCase()}</Typography>
                                </Box>


                                <Box
                                    className="token_box"
                                    sx={{
                                        cursor: (tokenNumber === 1 && token1?.address?.contract_address === tokenB?.address?.contract_address) ? "default" : "pointer",
                                        opacity: (tokenNumber === 1 && token1?.address?.contract_address === tokenB?.address?.contract_address) ? 0.4 : 1,
                                    }}
                                    onClick={(tokenNumber === 1 && token1?.address?.contract_address === tokenB?.address?.contract_address) ? undefined : () => handleSelectToken(tokenB)}
                                >
                                    <img
                                        src="/images/9mm.png"
                                        alt={tokenB?.symbol}
                                        style={{ width: 24, height: 24, marginRight: 8 }} // Adjust size and spacing as needed
                                    />
                                    <Typography>{tokenB?.symbol.toUpperCase()}</Typography>
                                </Box>


                                <Box className="token_Outer" sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {coinData?.map((token, index) => {
                                        // Determine the current token based on tokenNumber
                                        const selectedToken = tokenNumber === 0 ? token0 : token1;

                                        // Check if the current token from the list is the selected token
                                        const isTokenDisabled = token.address?.contract_address === selectedToken?.address?.contract_address;

                                        return (
                                            <Box
                                                key={index}
                                                className="token_box"
                                                sx={{
                                                    cursor: isTokenDisabled ? "default" : "pointer",
                                                    opacity: isTokenDisabled ? 0.4 : 1,
                                                }}
                                                onClick={!isTokenDisabled ? () => handleSelectToken(token) : undefined} // Allow click only if token is not disabled
                                            >
                                                <img
                                                    src={token.image}
                                                    alt={`${token.symbol} logo`}
                                                    style={{ width: 24, height: 24, marginRight: 8 }} // Adjust size and spacing as needed
                                                />
                                                <Typography>{token.symbol.toUpperCase()}</Typography>
                                            </Box>
                                        );
                                    })}

                                </Box>
                            </Box>
                            <Box className="token_list">
                                <List>
                                    {coinData?.map(asset => {
                                        // Determine the current token based on tokenNumber
                                        const selectedToken = tokenNumber === 0 ? token0 : token1;

                                        // Check if the current token from the list is the selected token
                                        const isTokenDisabled = asset.address?.contract_address === selectedToken?.address?.contract_address;

                                        return (
                                            <ListItem
                                                key={asset.symbol}
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "flex-start",
                                                    justifyContent: "flex-start",
                                                    transition: "background-color 0.3s",
                                                    '&:hover': {
                                                        backgroundColor: 'rgb(248 250 252)', // Hover background color
                                                    },
                                                    padding: 1, // Optional: add padding for better spacing
                                                }}
                                                onClick={!isTokenDisabled ? () => handleSelectToken(asset) : undefined} // Allow click only if token is not disabled
                                            >
                                                {/* Image, Symbol, and Name in a row */}
                                                <Box
                                                    sx={{
                                                        cursor: isTokenDisabled ? "default" : "pointer",
                                                        opacity: isTokenDisabled ? 0.4 : 1,
                                                    }}
                                                    onClick={isTokenDisabled ? undefined : () => handleSelectToken(asset)}
                                                >
                                                    {/* Flexbox layout for image and text */}
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <img
                                                            src={asset.image}
                                                            alt={`${asset.symbol} logo`}
                                                            style={{ width: 24, height: 24, marginRight: 8 }} // Adjust size and spacing as needed
                                                        />
                                                        {/* Symbol and Name in a column */}
                                                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                                {asset.symbol.toUpperCase()}
                                                            </Typography>
                                                            <Typography color="text.secondary" variant="body2">
                                                                {asset.name}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </Box>

                            <Box sx={{ textAlign: 'center', mt: '20px' }}>
                                <Typography
                                    variant="h6"
                                    sx={{ color: 'var(--cream)', cursor: 'pointer' }}
                                    onClick={handleOpenManage}
                                >
                                    Manage Tokens
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Modal>
            <ManageToken open={openManage} handleClose={handleCloseManage} mode={mode} />
        </>
    );
};

export default SelectedToken;
