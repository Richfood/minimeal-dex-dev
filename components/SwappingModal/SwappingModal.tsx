import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { IoCloseOutline } from 'react-icons/io5';
import { FaArrowRight } from 'react-icons/fa';
import { TokenDetails } from '@/interfaces';
import { Button } from '@mui/material';
import getTokenApproval from '@/utils/contract-methods/getTokenApproval';
import { swapExactTokensForTokens } from '@/utils/swapV2exacttokensfortokens';
import { swapV3 } from '@/utils/contract-methods/swapTokens';

import addresses from "@/utils/address.json";
import { expandIfNeeded } from '@/utils/generalFunctions';

interface SwappingModalProps {
    openSwap: boolean;
    handleCloseSwap: () => void;
    theme: 'light' | 'dark';
    amountIn: string;
    amountOut: string;
    token0: TokenDetails | null;
    token1: TokenDetails | null;
    slippageTolerance: number;
    setAmountIn: React.Dispatch<React.SetStateAction<string>>;
    setAmountOut: React.Dispatch<React.SetStateAction<string>>;
    dataForSwap: any;
    setOpenSwap: React.Dispatch<React.SetStateAction<boolean>>;

}

const SwappingModal: React.FC<SwappingModalProps> = ({ openSwap, handleCloseSwap, theme, amountIn, amountOut, token0, token1, slippageTolerance, setOpenSwap, setAmountIn, setAmountOut, dataForSwap }) => {

    const style = {
        position: 'absolute' as 'absolute',
        top: '30%',
        left: '50%',
        fontSize: '14px',
        fontWeight: '500',
        transform: 'translate(-50%, -50%)',
        width: 400,
        height: "30rem",
        bgcolor: theme === 'light' ? 'var(--white)' : 'var(--primary)',
        boxShadow: 'rgba(0, 0, 0, 0.24) -40px 40px 80px -8px',
        borderRadius: '14px',
        color: theme === 'light' ? 'var(--primary)' : 'var(--white)',
        maxHeight: '80vh',
        overflowY: 'auto',
    };

    const smartRouterAddress = addresses.PancakeRouterAddress;

    const handleSwap = async () => {

        if (!token0 || !token1) {
            console.log("🚀 ~ handleSwap ~ Missing tokens:", token0, token1);
            return; // Exit early if tokens are missing
        }

        try {
            // Approve token for the swap
            if (token0.symbol !== "PLS")
                await getTokenApproval(token0, smartRouterAddress, amountIn);

            // Execute the swap after approval
            // await swapExactTokensForTokens(token0, token1, amountIn, slippageTolerance, amountOut, routePath)
            
            let txHash: string;
            if (dataForSwap.protocol === "V3")
                txHash = await swapV3(token0, token1, dataForSwap, amountIn, amountOut, slippageTolerance);
            else {
                txHash = await swapExactTokensForTokens(token0, token1, amountIn, slippageTolerance, amountOut, dataForSwap);
            }

            alert(`Swapping done! TxHash : ${txHash}`);

            // Reset input/output values after swap
            setAmountIn("");
            setAmountOut("");
            setOpenSwap(false);

        } catch (error) {
            console.error("Error during swap process:", error);

            // Reset input/output values in case of an error
            setAmountIn("");
            setAmountOut("");
            setOpenSwap(false);

        }
    };


    return (
        <>
            <Modal
                open={openSwap}
                onClose={handleCloseSwap}

                aria-labelledby="settings-modal-title"
                aria-describedby="settings-modal-description"
            >
                <Box sx={style}>
                    <Box className="modal_head" sx={{ position: 'relative', mb: 2 }}>
                        <Typography id="settings-modal-title" variant="h6">
                            Confirm Swap
                        </Typography>
                        <IoCloseOutline
                            size={24}
                            style={{ position: 'absolute', right: '10px', top: '5px', cursor: 'pointer' }}
                            aria-label="Close settings modal"
                        />
                    </Box>
                    <Box className="modal_body">
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography
                                sx={{
                                    textTransform: 'uppercase',
                                    fontWeight: '600',
                                    mb: 2,
                                    color: theme === 'light' ? 'var(--primary)' : 'var(--white)',
                                    letterSpacing: '1px',
                                }}
                            >
                                {amountIn}
                            </Typography>
                            <Typography
                                sx={{
                                    textTransform: 'uppercase',
                                    fontWeight: '600',
                                    mb: 2,
                                    color: theme === 'light' ? 'var(--primary)' : 'var(--white)',
                                    letterSpacing: '1px',
                                }}
                            >
                                {token0?.symbol}
                            </Typography>

                        </Box>
                        <Box className="swapData" sx={{ display: 'flex', alignItems: 'flex-start', margin: '0 auto', backgroundColor: "none" }}>
                            <FaArrowRight />
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography
                                sx={{
                                    textTransform: 'uppercase',
                                    fontWeight: '600',
                                    mb: 2,
                                    color: theme === 'light' ? 'var(--primary)' : 'var(--white)',
                                    letterSpacing: '1px',
                                }}
                            >
                                {amountOut}
                            </Typography>
                            <Typography
                                sx={{
                                    textTransform: 'uppercase',
                                    fontWeight: '600',
                                    mb: 2,
                                    color: theme === 'light' ? 'var(--primary)' : 'var(--white)',
                                    letterSpacing: '1px',
                                }}
                            >
                                {token1?.symbol}
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography
                                sx={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    display: 'flex',
                                    gap: '5px',
                                    alignItems: 'center',
                                    mb: 2,
                                }}
                            >
                                Slippage Tolerance

                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    display: 'flex',
                                    gap: '5px',
                                    alignItems: 'center',
                                    mb: 2,
                                }}
                            >
                                {slippageTolerance}%

                            </Typography>

                        </Box>
                        <Typography
                            sx={{
                                fontSize: '14px',
                                fontWeight: '600',
                                display: 'flex',
                                gap: '5px',
                                alignItems: 'center',
                                mb: 2,
                            }}
                        >
                            Output is estimated. Amount out after slippage: {(Number(amountOut) - Number((Number(amountOut) * slippageTolerance / 100).toFixed(2))).toFixed(2)}{' '}
                            {token1?.symbol}, or the transaction will revert.
                        </Typography>



                    </Box>
                    <Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", paddingLeft: "24px", paddingRight: "24px" }}>
                            <Typography
                                sx={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    display: 'flex',
                                    gap: '5px',
                                    alignItems: 'center',
                                    mb: 2,
                                }}
                            >
                                Price

                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    display: 'flex',
                                    gap: '5px',
                                    alignItems: 'center',
                                    mb: 2,
                                }}
                            >
                                1%

                            </Typography>

                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", paddingLeft: "24px", paddingRight: "24px" }}>
                            <Typography
                                sx={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    display: 'flex',
                                    gap: '5px',
                                    alignItems: 'center',
                                    mb: 2,
                                }}
                            >
                                Minimum received
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    display: 'flex',
                                    gap: '5px',
                                    alignItems: 'center',
                                    mb: 2,
                                }}
                            >
                                {(Number(amountOut) - Number((Number(amountOut) * slippageTolerance / 100).toFixed(2))).toFixed(2)}

                            </Typography>

                        </Box>
                        <Box className="slippageSec dsls" sx={{ width: '90%', marginLeft: "15px" }}>

                            <Button
                                sx={{ width: '100%' }}
                                variant="contained"
                                color="secondary"
                                onClick={handleSwap}
                            >
                                Confirm Swap
                            </Button>

                        </Box>
                    </Box>

                </Box>
            </Modal>

        </>
    );
};

export default SwappingModal;