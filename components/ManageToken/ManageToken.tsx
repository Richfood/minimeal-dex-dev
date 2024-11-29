import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { IoCloseOutline } from 'react-icons/io5';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { TabContext, TabPanel } from '@mui/lab';
import { Tabs, Tab, Button, CircularProgress } from '@mui/material';
import { FaRegQuestionCircle } from 'react-icons/fa';
import ImportTokens from '../ImportTokens/ImportTokens';
import { ethers } from "ethers";
import { getTokenData } from '@/utils/api/getTokenDataRPC';
import { TokenDetails, TokenInfoFromAPI, TokenRpcData } from '@/interfaces';
import famousTokenTestnet from "../../utils/famousTokenTestnet.json";
import { CONSTANT_IMPORT_STRING, DEFAULT_LOGO_URL, makeTokenFromInfo } from '@/utils/generalFunctions';

console.log("🚀 ~ updateExistingTokens famousTokenTestnet:", famousTokenTestnet)

interface ManageTokenProps {
    open: boolean;
    handleClose: () => void;
    mode: 'light' | 'dark';
    handleSelectTokens: (token: TokenDetails) => void
    existingImportedTokens: TokenDetails[]
    updateImportedTokens: () => void
}

const ManageToken: React.FC<ManageTokenProps> = ({ open, handleClose, mode, handleSelectTokens, existingImportedTokens, updateImportedTokens}) => {
    const [value, setValue] = useState('1');
    const [importOpen, setImportOpen] = useState(false);
    const [tokenAddress, setTokenAddress] = useState("");
    const [token, setToken] = useState<TokenDetails | null>(null);
    const [tokenLoading, setTokenLoading] = useState(false);
    const [allExistingTokens, setAllExistingTokens] = useState<TokenDetails[]>();
    const [isExistingToken, setIsExistingToken] = useState(false);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setValue(newValue);
    };

    const handleCloseImport = () => {
        setImportOpen(false);
    };

    const handleOpenImport = () => {
        setImportOpen(true);
    };

    const reset = ()=>{
        setTokenAddress("");
        setToken(null);
        setAllExistingTokens([]);
    }

    const handleRemoveToken = (tokenAddressToRemove : string) => {
        const key = CONSTANT_IMPORT_STRING+tokenAddressToRemove;
        localStorage.removeItem(key);

        updateImportedTokens();
        updateExistingTokens();
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

    const updateExistingTokens = ()=>{
        let allTokens : TokenDetails[] = [];

        allTokens.push(...famousTokenTestnet);
        allTokens.push(...existingImportedTokens);
        setAllExistingTokens(allTokens);
    }
    
    const fetchTokenInfo = async () => {
        try {
            setTokenLoading(true);
            let tokenToSet : TokenDetails;

            const availableToken = allExistingTokens?.filter((token)=> token.address.contract_address.toLowerCase() === tokenAddress);

            if(availableToken && availableToken.length > 0){
                tokenToSet = availableToken[0];
                setIsExistingToken(true);
            }
            else{
                const tokenDetails : TokenInfoFromAPI = await getTokenData(tokenAddress);

                if(!tokenDetails || tokenDetails.type !== "ERC-20") throw("Token not fetched or not ERC20");

                tokenToSet = makeTokenFromInfo(tokenDetails)
                setIsExistingToken(false);
            }
            console.log("🚀 ~ ManageToken ~ token:", tokenToSet)

            setToken(tokenToSet);

        } catch (error) {
            console.error("Error fetching token info:", error);
            setTokenLoading(false);
        }

        setTokenLoading(false);
    };

    const ifValidAddress = ()=>{
        return ethers.utils.isAddress(tokenAddress);
    }

    useEffect(()=>{
        if(ifValidAddress())
            fetchTokenInfo();

    },[tokenAddress])

    useEffect(()=>{
        updateImportedTokens();
        updateExistingTokens();
    },[importOpen])
    
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
                        <IoCloseOutline onClick={()=>{
                            reset()
                            handleClose()
                        }} size={24} style={{ cursor: 'pointer' }} />
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
                                    {/* <Tab label="Lists" sx={{ border: 'unset' }} value="0" /> */}
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
                                                onChange={(e)=>setTokenAddress(e.target.value.toLowerCase())}
                                                value={tokenAddress}
                                            />
                                        </Search>
                                    </Box>
                                    <Box>
                                        {!tokenLoading ? 
                                            token ? (
                                                <Box className="soil_sec" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: '10px' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <Box className="que_sec">
                                                        <FaRegQuestionCircle style={{ width: 20, height: 20 }} />
                                                    </Box>
                                                    <Box className="soil_text">
                                                        <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>{token?.symbol}</Typography>
                                                        <Typography>{token?.name}</Typography>
                                                    </Box>
                                                </Box>
                                                <Box>
                                                    <Button variant="contained" color="primary" onClick={handleOpenImport} disabled={isExistingToken}>{isExistingToken ? "Already Exists" : "Import"}</Button>
                                                </Box>
                                            </Box>
                                            ) : null
                                         : <CircularProgress size={20}/>}
                                        
                                        <Box>
                                            {
                                                existingImportedTokens?.map((importedToken)=>{
                                                    return (
                                                        <Box className="soil_sec" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: '10px' }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                <Box className="que_sec">
                                                                    <FaRegQuestionCircle style={{ width: 20, height: 20 }} />
                                                                </Box>
                                                                <Box className="soil_text">
                                                                    <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>{importedToken.symbol}</Typography>
                                                                    <Typography>{importedToken.name}</Typography>
                                                                </Box>
                                                            </Box>
                                                            <Box>
                                                                <Button variant="contained" color="primary" onClick={()=>handleRemoveToken(importedToken.address.contract_address)}>Remove</Button>
                                                            </Box>
                                                        </Box>
                                                    )
                                                })
                                            }
                                        </Box>
                                        <Box sx={{ mt: '15px' }}>
                                            <Typography sx={{ color: 'var(--cream)', fontSize: '16px', fontWeight: '600' }}>{existingImportedTokens?.length || "0"} Imported Tokens</Typography>
                                        </Box>
                                    </Box>
                                </TabPanel>
                            </TabContext>
                        </Box>
                    </Box>
                </Box>
            </Modal>

            <ImportTokens open={importOpen} handleClose={handleCloseImport} mode={mode} token={token} handleSelectTokens={handleSelectTokens} reset={reset}/>
        </>
    );
};

export default ManageToken;
