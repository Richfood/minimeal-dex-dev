import React, { useState } from 'react';
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
}

interface Token {
    name : string;
    symbol : string;
    address : string;
    decimals : number;
}

const SelectedToken: React.FC<SelectedTokenProps> = ({ openToken, handleCloseToken, mode, setToken0, setToken1, tokenNumber }) => {
    const [openManage, setOpenManage] = useState(false);
    const [tokenSelected, setTokenSelected] = useState<string>("");

    const handleOpenManage = () => setOpenManage(true);
    const handleCloseManage = () => setOpenManage(false);

    const handleSelectToken = (token : Token) => {
        if(tokenNumber === 0){
            setToken0(token);
        }
        else{
            setToken1(token);
        }

        setTokenSelected(token.address)
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
                                {tokenList.map((token, index) => (
                                    token.address !== tokenSelected ?(
                                        <Box className="token_box" key={index} onClick={()=>handleSelectToken(token)}>
                                                <Typography>{token.name}</Typography>
                                        </Box>
                                    ) : (<></>)
                                ))}
                            </Box>
                            <Box className="token_list">
                                <List>
                                    {Array(10).fill(0).map((_, index) => (
                                        <ListItem className='token_list_item' disablePadding key={index}>
                                            <Box>
                                                <Image src="/images/pulsechain.png" width={20} height={20} alt="PLS" />
                                            </Box>
                                            <Box className="token_list_details">
                                                <Typography className="token_title">PLS</Typography>
                                                <Typography className="token_desc">PLS</Typography>
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
