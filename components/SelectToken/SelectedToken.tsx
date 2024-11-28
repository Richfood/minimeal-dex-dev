import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { IoCloseOutline } from 'react-icons/io5';
import { List, ListItem, TextField } from '@mui/material';
import ManageToken from '../ManageToken/ManageToken';
import Image from 'next/image';
import { metaMask, hooks } from '../ConnectWallet/connector';
import tokenList from "../../utils/tokenList.json"
const { useChainId, useAccounts } = hooks;

// import famousToken from "../../utils/famousToken.json";
import famousTokenTestnet from "../../utils/famousTokenTestnet.json";
const CONSTANT_IMPORT_STRING = "Imported Token : ";

import { TokenDetails } from '@/interfaces';
import ImportTokens from '../ImportTokens/ImportTokens';

interface SelectedTokenProps {
    openToken: boolean;
    handleCloseToken: () => void;
    mode: 'light' | 'dark';
    setToken0: React.Dispatch<React.SetStateAction<TokenDetails | null>>;
    setToken1: React.Dispatch<React.SetStateAction<TokenDetails | null>>;
    title?: string;
    description: string;
    tokenNumber: number;
    token0: TokenDetails | null;
    token1: TokenDetails | null;
    setTokensSelected: React.Dispatch<React.SetStateAction<boolean>>;
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

// const fetchCoinStablecoins = async () => {
//     try {

//         const idsArray = ["0xaiswap", "1000bonk", "16dao", "1ex", "2080",
//             "2fai", "doge-on-pulsechain", "5g-cash", "404ver", "xen-crypto-pulsechain"]
//         const response = await fetch('api/coins', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ idsArray }),
//         });

//         if (!response.ok) {
//             console.log('Failed to fetch data from API:', response);
//             return null;
//         }

//         const data = await response.json();
//         console.log("🚀 ~ fetchCoinStablecoins ~ response:", response)

//         return data;
//     } catch (error) {
//         console.log('Error fetching data from API:', error);
//         return null;

//     }
// };

const SelectedToken: React.FC<SelectedTokenProps> = ({ openToken, handleCloseToken, mode, setToken0, setToken1, tokenNumber, token0, token1, setTokensSelected

}) => {
    console.log("🚀 ~SelectedToken token1:", token1)
    console.log("🚀 ~SelectedToken token0:", token0)
    const [openManage, setOpenManage] = useState(false);
    // const [coinData, setCoinData] = useState<any[]>([]);
    const [tokens, setTokens] = useState<TokenDetails[]>([]);
    const [tokensOfLiquidity, setTokensOfLiquidity] = useState<TokenDetails[]>([]);

    console.log("🚀 ~ tokens:", tokens)
    const isConnected = useAccounts();
    const chainId = useChainId();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredResults, setFilteredResults] = useState<any>([]);
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
    const [existingImportedTokens, setExistingImportedTokens] = useState<TokenDetails[]>([]);

    const handleOpenManage = () => setOpenManage(true);
    const handleCloseManage = () => setOpenManage(false);

    useEffect(() => {
        if (true || tokens.length === famousTokenTestnet.length) { // Ensure only setting when the value changes
            console.log("🚀 ~ useEffect ~ famousTokenTestnet:", tokens)
            setTokens(famousTokenTestnet);
        }
    }, [famousTokenTestnet]);

    const handleSelectToken = (token: TokenDetails) => {
        console.log("🚀 ~ handleSelectToken ~ token:", token)

        if (tokenNumber === 0) {
            if (token.address === token1?.address) {
                console.log("🚀 ~ handleSelectToken0 ~ token:", token)
                setToken0(token);
                setToken1(token0);
            } else {
                setToken0(token);
            }
        } else {
            if (token.address === token0?.address) {
                console.log("🚀 ~ handleSelectToken1 ~ token:", token)
                setToken1(token);
                setToken0(token1);
            } else {
                console.log("🚀 ~ handleSelectToken2 ~ token:", token)

                setToken1(token);
            }
        }

        setSearchTerm("");
        handleCloseToken();
        setTokensSelected(true);
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
        maxHeight: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
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

    const performSearch = (value: string) => {
        console.log("🚀  performSearch  value:", typeof value);

        if (value.trim()) {
            console.log("🚀  performSearch  value.trim():", value.trim());

            // Filter tokens based on name, symbol, and contract_address
            const filtered = tokens.filter((item) => {
                const nameMatch = item.name && item.name.toLowerCase().includes(value.toLowerCase()); // Match name
                const symbolMatch = item.symbol && item.symbol.toLowerCase().includes(value.toLowerCase()); // Match symbol
                const addressMatch = item.address && item.address.contract_address && item.address.contract_address.toLowerCase().includes(value.toLowerCase()); // Match address        
                return nameMatch || symbolMatch || addressMatch; // Return true if any match is found
            });

            const filteredImported = existingImportedTokens.filter((item) => {
                const nameMatch = item.name && item.name.toLowerCase().includes(value.toLowerCase()); // Match name
                const symbolMatch = item.symbol && item.symbol.toLowerCase().includes(value.toLowerCase()); // Match symbol
                const addressMatch = item.address && item.address.contract_address && item.address.contract_address.toLowerCase().includes(value.toLowerCase()); // Match address        
                return nameMatch || symbolMatch || addressMatch; // Return true if any match is found
            });

            console.log("🚀  performSearch  filtered tokens:", filtered);
            setFilteredResults(filtered.concat(filteredImported)); // Update filtered results
        } else {
            setFilteredResults([]); // Clear results if input is empty
        }
    };


    const DEBOUNCE_DELAY = 500;

    // Function to handle input change and debounce logic
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Clear the previous timeout if the user is typing again
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        // Set a new timeout to call performSearch after the debounce delay
        const timer = setTimeout(() => {
            performSearch(value);  // Call the search function after typing stops
        }, DEBOUNCE_DELAY);

        // Store the new timer
        setDebounceTimer(timer);
    };

    const updateImportedTokens = () => {
        let importedTokens: TokenDetails[] = [];
        console.log("🚀 ~ updateExistingTokens0 ~ importedTokens:", importedTokens)

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            if (key && key.includes(CONSTANT_IMPORT_STRING)) {
                const item = localStorage.getItem(key);
                if (item)
                    importedTokens.push(JSON.parse(item));
            }
        }

        setExistingImportedTokens(importedTokens);
    }

    useEffect(() => {
        updateImportedTokens();
    }, [])


    return (
        <>
            <Modal
                open={openToken}
                onClose={()=>{
                    setSearchTerm("");
                    handleCloseToken()
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box className="modal_head" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">Select a Token</Typography>
                        <IoCloseOutline onClick={()=>{
                            setSearchTerm("");
                            handleCloseToken();
                        }} size={24} style={{ cursor: 'pointer' }} />
                    </Box>
                    <Box className="modal_body">
                        <Box className="search_box" sx={{ marginBottom: 2 }}>
                            <TextField
                                type="text"
                                placeholder="Search name or paste address"
                                value={searchTerm}
                                onChange={handleInputChange}
                                sx={{
                                    position: 'relative',
                                    borderRadius: '10px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)', // or use a theme color
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.25)', // hover color
                                    },
                                    width: '100%',
                                    '& .MuiInputBase-root': {
                                        // padding: '10px 15px',
                                        fontSize: '14px',
                                        lineHeight: '1.2',
                                    },
                                }}
                                inputProps={{
                                    'aria-label': 'search',
                                }}
                            />
                        </Box>
                        <Box className="common_token" sx={{ pt: '20px' }}>
                            {searchTerm !== "" ?
                                (<Box className="token_list">
                                    <List>
                                        {filteredResults?.map((token: TokenDetails) => {
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

                                    </List>
                                </Box>)
                                :
                                (
                                    <Box>
                                        <Typography sx={{ fontWeight: '500', fontSize: '14px' }}>Common tokens</Typography>
                                        <Box
                                            className="token_Outer"
                                            sx={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: '10px',
                                                backgroundColor: '#fdf5e6', // Light cream color
                                                padding: '10px', // Optional: Add some padding for spacing
                                                borderRadius: '8px', // Optional: Rounded corners for a smoother look
                                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Optional: Add a subtle shadow for depth
                                            }}
                                        >
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
                                                            backgroundColor: isTokenDisabled ? '#f5f5f5' : 'white', // Subtle background for tokens
                                                            padding: '8px', // Optional: Add padding inside each token box
                                                            borderRadius: '6px', // Optional: Rounded corners for individual tokens
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            boxShadow: isTokenDisabled ? 'none' : '0px 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow for active tokens
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


                                        <Typography sx={{ fontWeight: '500', fontSize: '14px', marginTop: '20px' }}>Imported Tokens</Typography>
                                        <Box
                                            className="token_Outer"
                                            sx={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: '10px',
                                                backgroundColor: '#fdf5e6', // Light cream color
                                                padding: '10px', // Optional: Add some padding for spacing
                                                borderRadius: '8px', // Optional: Rounded corners for a smoother look
                                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Optional: Add a subtle shadow for depth
                                            }}
                                        >
                                            {existingImportedTokens?.map((token, index) => {
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
                                                            backgroundColor: isTokenDisabled ? '#f5f5f5' : 'white', // Subtle background for tokens
                                                            padding: '8px', // Optional: Add padding inside each token box
                                                            borderRadius: '6px', // Optional: Rounded corners for individual tokens
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            boxShadow: isTokenDisabled ? 'none' : '0px 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow for active tokens
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
                                        <Typography sx={{ fontWeight: '500', fontSize: '14px', marginTop: '20px' }}>All Tokens</Typography>
                                        <Box className="token_list">
                                            <List>
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

                                                {/* {tokensOfLiquidity?.map((token: TokenDetails) => {
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
                                    })} */}
                                            </List>
                                        </Box>
                                    </Box>
                                )}



                        </Box>
                        <Box sx={{ textAlign: 'center', mt: '20px' }}>
                            <Typography
                                variant="h6"
                                sx={{ color: 'var(--cream)', cursor: 'pointer', }}
                                onClick={handleOpenManage}
                            >
                                Manage Tokens
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Modal >
            <ManageToken open={openManage} handleClose={handleCloseManage} mode={mode} handleSelectTokens={handleSelectToken} existingImportedTokens={existingImportedTokens} updateImportedTokens={updateImportedTokens} />
        </>
    );
};

export default SelectedToken;
