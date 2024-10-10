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

interface SelectedTokenProps {
    openToken: boolean;
    handleCloseToken: () => void;
    mode: 'light' | 'dark';
    setToken0: React.Dispatch<React.SetStateAction<Token | null>>;
    setToken1: React.Dispatch<React.SetStateAction<Token | null>>;
    title?: string;
    description: string;
    tokenNumber: number;
    setCircleImages?: React.Dispatch<React.SetStateAction<Token | null>>;
}

interface Token {
    name: string;
    symbol: string;
    address: {
        contract_address: string;
        decimals: number;
    };
    image: string; // URL to the token's image
}


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

const SelectedToken: React.FC<SelectedTokenProps> = ({ openToken, handleCloseToken, mode, setToken0, setToken1, tokenNumber

}) => {
    const [openManage, setOpenManage] = useState(false);
    const [tokenSelected, setTokenSelected] = useState<string>("");
    const [coinData, setCoinData] = useState<any[]>([]);
    const [tokenA, setTokenA] = useState<Token | null>(null);
    const [tokenB, setTokenB] = useState<Token | null>(null);

    const handleOpenManage = () => setOpenManage(true);
    const handleCloseManage = () => setOpenManage(false);

    const handleSelectToken = (token: Token) => {

        if (tokenNumber === 0) {
            setToken0(token);
        }
        else {
            setToken1(token);
        }

        setTokenSelected(token.address?.contract_address)
        handleCloseToken()
    }


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

        // Check if savedTokenA exists before parsing
        if (savedTokenA) {
            setTokenA(JSON.parse(savedTokenA));
        } else {
            setTokenA(null); // Or set a default value if needed
        }

        // Check if savedTokenB exists before parsing
        if (savedTokenB) {
            setTokenB(JSON.parse(savedTokenB));
        } else {
            setTokenB(null); // Or set a default value if needed
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
                            <Box className="token_Outer" sx={{ py: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                <Box className="token_box">
                                    <img
                                        src="/images/pls.png"
                                        alt={tokenA?.symbol}
                                        style={{ width: 24, height: 24, marginRight: 8 }} // Adjust size and spacing as needed
                                    />
                                    <Typography>{tokenA?.symbol}</Typography>
                                </Box>
                                <Box className="token_box">
                                    <img
                                        src="/images/9mm.png"
                                        alt={tokenB?.symbol}
                                        style={{ width: 24, height: 24, marginRight: 8 }} // Adjust size and spacing as needed
                                    />
                                    <Typography>{tokenB?.symbol}</Typography>
                                </Box>
                                <Box className="token_Outer" sx={{ py: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {coinData.map((token, index) => (
                                        token.address !== tokenSelected ? (
                                            <Box className="token_box" key={index} onClick={() => handleSelectToken(token)}>
                                                <img
                                                      src={token.image}
                                                      alt={`${token.symbol} logo`}
                                                    style={{ width: 24, height: 24, marginRight: 8 }} // Adjust size and spacing as needed
                                                />
                                                <Typography>{token.name}</Typography>
                                            </Box>
                                        ) : (<></>)
                                    ))}
                                </Box>
                            </Box>
                            <Box className="token_list">
                                <List>
                                    {coinData.map(asset => (
                                        <ListItem
                                            key={asset.symbol}
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "flex-start",
                                                justifyContent: "flex-start",
                                                transition: "background-color 0.3s", // Smooth transition for background color
                                                '&:hover': {
                                                    backgroundColor: 'rgb(248 250 252)', // Change to your desired hover background color
                                                },
                                                padding: 1, // Optional: add padding for better spacing
                                            }}
                                            onClick={() => handleSelectToken(asset)}
                                        >
                                            {/* Image, Symbol, and Name in a row */}
                                            <Box sx={{ display: "flex", alignItems: "center", mb: 1, cursor: "pointer" }}>
                                                <img
                                                    src={asset.image}
                                                    alt={`${asset.symbol} logo`}
                                                    style={{ width: 24, height: 24, marginRight: 8 }} // Adjust size and spacing as needed
                                                />
                                                {/* Symbol and Name in a column */}
                                                <Box sx={{ display: "flex", flexDirection: "column" }}>
                                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                        {asset.symbol}
                                                    </Typography>
                                                    <Typography color="text.secondary" variant="body2">
                                                        {asset.name}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </ListItem>
                                    ))}


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
