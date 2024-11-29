import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { IoCloseOutline } from 'react-icons/io5';
import { Tab, Tabs, InputBase, Button, Tooltip, FormGroup, FormControlLabel } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import { FaRegQuestionCircle } from 'react-icons/fa';
import { GoAlertFill } from 'react-icons/go';
import { FiAlertCircle } from "react-icons/fi";
import { BsQuestionCircle } from "react-icons/bs";
import { IoMdRefreshCircle } from "react-icons/io";
import Customcheckbox from '../Customcheckbox/Customcheckbox';
import { TokenDetails } from '@/interfaces';
import { CONSTANT_IMPORT_STRING, truncateAddress } from '@/utils/generalFunctions';


interface ImportTokensProps {
    open: boolean;
    handleClose: () => void;
    mode: 'light' | 'dark';
    token: TokenDetails | null;
    handleSelectTokens : (token: TokenDetails) => void
    reset: () => void;
}

const ImportTokens: React.FC<ImportTokensProps> = ({ open, handleClose, mode, token, handleSelectTokens, reset }) => {
    console.log("🚀 ~ImportTokens token:", token)
    const [value, setValue] = useState("0");
    const [understand, setUnderstand] = useState(false);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const handleCheckboxChange = () => {
        setUnderstand((prev) => !prev); // Toggle the state
    };

    const handleImportToken = () => {
        if(!token) return;
        localStorage.setItem(CONSTANT_IMPORT_STRING+token.address.contract_address, JSON.stringify(token));
        alert("Token Imported");
        handleSelectTokens(token);

        handleCheckboxChange()
        reset();
        handleClose();
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
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="import-tokens-modal-title"
            aria-describedby="import-tokens-modal-description">
            <Box sx={style}>
                <Box className="modal_head" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">
                        Import Tokens
                    </Typography>
                    <IoCloseOutline onClick={handleClose} size={24} style={{ cursor: 'pointer' }} />
                </Box>
                <Box className="modal_body">
                    <Box className="warning-box">
                        <Box sx={{ color: 'var(--secondary)', fontSize: 20 }}>
                            <GoAlertFill />
                        </Box>
                        <Box sx={{ width: 'calc(100% - 30px)', color: 'var(--primary)    ' }}>
                            <Typography>Anyone can create a ERC20 token on PulseChain with any name, including creating fake versions of existing tokens and tokens that claim to represent projects that do not have a token.
                            </Typography>
                            <br />
                            <Typography>If you purchase an arbitrary token, you may be unable to sell it back.
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ my: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <Box sx={{ border: '1px solid var(--cream)', padding: '5px 7px', borderRadius: '30px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                <FiAlertCircle style={{ color: 'var(--cream)', width: '18px', height: '18px' }} />
                                <Typography sx={{ fontSize: '12px', color: 'var(--cream)' }}>Unknown Source </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: '5px', mt: '10px' }}>
                                <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>{token?.name}</Typography>
                                <Typography sx={{ fontSize: '16px', fontWeight: '600' }}> &#40; {token?.symbol} &#x29;</Typography>
                            </Box>
                            <Box>
                                <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>{token ? truncateAddress(token.address.contract_address) : ""}</Typography>
                            </Box>
                            {/* <Box>
                                <Typography sx={{ fontSize: '16px', fontWeight: '600', color: 'var(--cream)' }}>&#40; View on 9mmScan &#x29;</Typography>
                            </Box> */}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Tooltip title="A Risk scan results are provided by a third party AvengerDAO is reporting a risk level of Unknown Slippage nderstand However, this token has been labelled Unknown Risk due to not being listed on any of the built-in token lists. Please proceed with caution and always do your own research.dd" arrow>
                                <Box className="unknown_sec">
                                    Unknown <BsQuestionCircle />
                                </Box>
                            </Tooltip>
                            <IoMdRefreshCircle style={{ width: '20px', height: '20px' }} />
                        </Box>

                    </Box>
                    <Box>
                        <FormGroup sx={{ my: '10px' }}>
                            <FormControlLabel
                                sx={{ m: '0' }}
                                control={<Customcheckbox checked={understand} onChange={handleCheckboxChange}/>}
                                label={
                                    <>
                                        <Typography sx={{ ml: '5px', fontSize: '14px', mt: '3px', fontWeight: '600' }}>
                                            I understand
                                        </Typography>
                                    </>
                                }
                            />
                        </FormGroup>
                        <Box>
                            <Button variant="contained" color="secondary" sx={{ display: 'block', width: '100%' }} disabled={!understand} onClick={handleImportToken}>
                                Import
                            </Button>
                        </Box>
                    </Box>

                </Box>
            </Box>
        </Modal>
    );
};

export default ImportTokens;
