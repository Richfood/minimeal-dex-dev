import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { IoCloseOutline } from 'react-icons/io5';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { TabContext, TabPanel } from '@mui/lab';
import { Tabs, Tab, Button } from '@mui/material';
import { FaRegQuestionCircle } from 'react-icons/fa';
import ImportTokens from '../ImportTokens/ImportTokens';
import { ethers } from "ethers";

interface ManageTokenProps {
    open: boolean;
    handleClose: () => void;
    mode: 'light' | 'dark';
}

const ManageToken: React.FC<ManageTokenProps> = ({ open, handleClose, mode }) => {
    const [value, setValue] = useState('0');
    const [importOpen, setImportOpen] = useState(false);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setValue(newValue);
    };

    const handleCloseImport = () => {
        setImportOpen(false);
    };

    const handleOpenImport = () => {
        setImportOpen(true);
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

    const provider = new ethers.providers.JsonRpcProvider("https://pulsechain-testnet-rpc.publicnode.com");
    
    // Replace with your token's contract address
    const tokenAddress = "0xYourTokenContractAddress";
    
    // Minimum ERC20 ABI to fetch token details
    const abi = [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function decimals() view returns (uint8)",
        "function totalSupply() view returns (uint256)"
    ];
    
    const fetchTokenInfo = async (tokenAddress: string) => {
        try {
            const tokenContract = new ethers.Contract(tokenAddress, abi, provider);
    
            const name = await tokenContract.name();
            const symbol = await tokenContract.symbol();
            const decimals = await tokenContract.decimals();
            const totalSupply = await tokenContract.totalSupply();
    
            console.log(`Token Address: ${tokenAddress}`);
            console.log("Token Name:", name);
            console.log("Token Symbol:", symbol);
            console.log("Token Decimals:", decimals);
            console.log("Total Supply:", ethers.utils.formatUnits(totalSupply, decimals));
        } catch (error) {
            console.error("Error fetching token info:", error);
        }
    };
    
    fetchTokenInfo(tokenAddress);
    
    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="manage-token-modal-title"
                aria-describedby="manage-token-modal-description"
            >
                <Box sx={style}>
                    <Box className="modal_head" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">
                            Manage Token
                        </Typography>
                        <IoCloseOutline onClick={handleClose} size={24} style={{ cursor: 'pointer' }} />
                    </Box>
                    <Box className="modal_body" sx={{ px: '0 !important' }}>
                        <Box className="manageTokenTabs">
                            <TabContext value={value}>
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label="scrollable auto tabs example"
                                    sx={{ bgcolor: mode === 'light' ? 'var(--gray)' : '#274343', border: 'unset', p: '10px' }}
                                >
                                    <Tab label="Lists" sx={{ border: 'unset' }} value="0" />
                                    <Tab label="Tokens" sx={{ border: 'unset' }} value="1" />
                                </Tabs>
                                <TabPanel sx={{ padding: '24px' }} value="0">
                                    <Box className="search_box">
                                        <Search>
                                            <StyledInputBase
                                                placeholder="https:// or ipfs://"
                                                inputProps={{ 'aria-label': 'search' }}
                                            />
                                        </Search>
                                    </Box>
                                </TabPanel>
                                <TabPanel sx={{ padding: '24px' }} value="1">
                                    <Box className="search_box">
                                        <Search>
                                            <StyledInputBase
                                                placeholder="0x0000"
                                                inputProps={{ 'aria-label': 'search' }}
                                            />
                                        </Search>
                                    </Box>
                                    <Box className="soil_sec" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: '10px' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Box className="que_sec">
                                                <FaRegQuestionCircle style={{ width: 20, height: 20 }} />
                                            </Box>
                                            <Box className="soil_text">
                                                <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>SOIL</Typography>
                                                <Typography>Sun Minimeal</Typography>
                                            </Box>
                                        </Box>
                                        <Box>
                                            <Button variant="contained" color="primary" onClick={handleOpenImport}>Import</Button>
                                        </Box>
                                    </Box>
                                    <Box sx={{ mt: '15px' }}>
                                        <Typography sx={{ color: 'var(--cream)', fontSize: '16px', fontWeight: '600' }}>0 Imported Tokens</Typography>
                                    </Box>
                                </TabPanel>
                            </TabContext>
                        </Box>
                    </Box>
                </Box>
            </Modal>

            <ImportTokens open={importOpen} handleClose={handleCloseImport} mode={mode} />
        </>
    );
};

export default ManageToken;
