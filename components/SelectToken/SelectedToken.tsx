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
import { metaMask, hooks } from '../ConnectWallet/connector';

const { useChainId, useAccounts } = hooks;

import famousToken from "../../utils/famousToken.json";
import famousTokenTestnet from "../../utils/famousTokenTestnet.json";

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

        const idsArray = ["0xaiswap", "1000bonk", "16dao", "1ex", "2080",
            "2fai", "doge-on-pulsechain", "5g-cash", "404ver", "xen-crypto-pulsechain"]
        const response = await fetch('api/coins', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idsArray }),
        });

        if (!response.ok) {
            console.log('Failed to fetch data from API:', response);
            return null;
        }

        const data = await response.json();
        console.log("🚀 ~ fetchCoinStablecoins ~ response:", response)

        return data;
    } catch (error) {
        console.log('Error fetching data from API:', error);
        return null;

    }
};

const SelectedToken: React.FC<SelectedTokenProps> = ({ openToken, handleCloseToken, mode, setToken0, setToken1, tokenNumber, token0, token1

}) => {
    console.log("🚀 ~ tokenNumber:", tokenNumber)
    const [openManage, setOpenManage] = useState(false);
    const [coinData, setCoinData] = useState<any[]>([]);
    console.log("🚀 ~ coinData:", coinData)
    const [tokens, setTokens] = useState<TokenDetails[]>([]);
    console.log("🚀 ~ tokens:", tokens)
    const isConnected = useAccounts();
    const chainId = useChainId();

    const handleOpenManage = () => setOpenManage(true);
    const handleCloseManage = () => setOpenManage(false);

    useEffect(() => {
        const initializeData = async () => {
            const data = await fetchStablecoins();

            const usableCoinData = await fetchCoinStablecoins();
            setCoinData(usableCoinData);

            const isTestnet = chainId === 943;

            const tokenData = isTestnet ? famousTokenTestnet : famousToken;
            setTokens(tokenData);

        };

        initializeData();
    }, [isConnected, chainId]); // Add dependencies


    const handleSelectToken = (token: TokenDetails) => {
        console.log("🚀 ~ handleSelectToken ~ tokenNumber1:", tokenNumber);
        if (tokenNumber === 0) {
            if (token.address === token1?.address) {
                // If the selected token is already token1, swap it with token0
                setToken0(token);
                setToken1(token0);
            } else {
                // Set the selected token as token0
                setToken0(token);
            }
        } else {
            if (token.address === token0?.address) {
                // If the selected token is already token0, swap it with token1
                setToken1(token);
                setToken0(token1);
            } else {
                // Set the selected token as token1
                setToken1(token);
            }
        }

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

                                <Box className="token_Outer" sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {tokens?.map((token, index) => {
                                        const selectedToken = tokenNumber === 0 ? token0 : token1;


                                        // Check if the token should be disabled
                                        const isTokenDisabled = token.address === selectedToken?.address;


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
                                                    src={token.logoURI}
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
                                    {/* Mapping over tokens */}
                                    {tokens?.map((token) => {
                                        // Select the relevant token based on tokenNumber
                                        const selectedToken = tokenNumber === 0 ? token0 : token1;


                                        // Check if the token should be disabled
                                        const isTokenDisabled = token.address === selectedToken?.address;

                                        return (
                                            <ListItem
                                                key={token.symbol}
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "flex-start",
                                                    transition: "background-color 0.3s",
                                                    '&:hover': { backgroundColor: 'rgb(248 250 252)' },
                                                    padding: 1,
                                                }}
                                                onClick={!isTokenDisabled ? () => handleSelectToken(token) : undefined} // Only enable click if not disabled
                                            >
                                                <Box
                                                    className="token_box"
                                                    sx={{
                                                        cursor: isTokenDisabled ? "default" : "pointer",
                                                        opacity: isTokenDisabled ? 0.4 : 1,
                                                        display: "flex",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <img
                                                        src={token.logoURI}
                                                        alt={`${token.symbol} logo`}
                                                        style={{ width: 24, height: 24, marginRight: 8 }}
                                                    />
                                                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                            {token.symbol.toUpperCase()}
                                                        </Typography>
                                                        <Typography color="text.secondary" variant="body2">
                                                            {token.name}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </ListItem>
                                        );
                                    })}

                                    {/* Mapping over coinData */}
                                    {/* {coinData?.map((asset) => {
                                        const selectedToken = tokenNumber === 0 ? token0 : token1;
                                        const isTokenDisabled =
                                            asset.address?.contract_address === selectedToken?.address?.contract_address;

                                        return (
                                            <ListItem
                                                key={asset.symbol}
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "flex-start",
                                                    transition: "background-color 0.3s",
                                                    '&:hover': { backgroundColor: 'rgb(248 250 252)' },
                                                    padding: 1,
                                                }}
                                                onClick={!isTokenDisabled ? () => handleSelectToken(asset) : undefined}
                                            >
                                                <Box
                                                    sx={{
                                                        cursor: isTokenDisabled ? "default" : "pointer",
                                                        opacity: isTokenDisabled ? 0.4 : 1,
                                                    }}
                                                >
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <img
                                                            src={asset.image}
                                                            alt={`${asset.symbol} logo`}
                                                            style={{ width: 24, height: 24, marginRight: 8 }}
                                                        />
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
                                    })} */}
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
            </Modal >
            <ManageToken open={openManage} handleClose={handleCloseManage} mode={mode} />
        </>
    );
};

export default SelectedToken;
