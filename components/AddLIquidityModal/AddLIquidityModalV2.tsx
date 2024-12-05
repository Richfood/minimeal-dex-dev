import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { IoCloseOutline } from 'react-icons/io5';
import { TokenDetails } from '@/interfaces';
import { Button, Divider } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { tickToPrice } from '@/utils/utils';
import { isNative } from '@/utils/generalFunctions';
import getTokenApproval from "../../utils/contract-methods/getTokenApproval";
import { addLiquidityETH, addLiquidityV2, addLiquidityV3 } from '@/utils/contract-methods/addLiquidity';
import addresses from "../../utils/address.json";
import { FeeAmount } from '@uniswap/v3-sdk';

interface AddLiquidityModalProps {
    isOpen: boolean;
    setOpenAddLiquidity: React.Dispatch<React.SetStateAction<boolean>>;
    handleCloseAddLiquidity: () => void;
    theme: 'light' | 'dark';
    token0: TokenDetails | null;
    token1: TokenDetails | null;
    slippageTolerance: number | null;
    setAddLiquidityRunning: React.Dispatch<React.SetStateAction<boolean>>;
    deadline: string;
    amount0Desired: string;
    amount1Desired: string;
    currentPrice : number;
    reset: () => void;
}

const AddLiquidityModalV2: React.FC<AddLiquidityModalProps> = (
    { isOpen, handleCloseAddLiquidity, theme, token0, token1,
        slippageTolerance, setAddLiquidityRunning,
        deadline, amount0Desired, amount1Desired, reset, setOpenAddLiquidity, currentPrice }) => {

    const v2RouterAddress = addresses.PancakeV2RouterAddress;

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        fontSize: '14px',
        fontWeight: '500',
        transform: 'translate(-50%, -50%)',
        maxWidth: "fitContent",
        width: 400,
        height: "35rem",
        bgcolor: theme === 'light' ? "rgb(241 245 249)" : "#173D3D",
        boxShadow: 'rgba(0, 0, 0, 0.24) -40px 40px 80px -8px',
        borderRadius: '14px',
        color: theme === 'light' ? 'var(--primary)' : 'var(--white)',
        maxHeight: '100dvh',
        overflowY: 'auto',
        overflowX: 'hidden',
    };

    const [range, setRange] = useState<string | null>("")
    const [isLiquidityAdded, setIsLiquidityAdded] = useState<boolean>(false);

    console.log("🚀 ~ theme === light:", theme === "light")

    const handleAddLiquidity = async () => {
        if (!token0 || !token1 || !slippageTolerance) return;
    
        setAddLiquidityRunning(true);
        try {
    
          const addressToApprove = v2RouterAddress;
    
          if (!isNative(token0)) {
            await getTokenApproval(token0, addressToApprove, amount0Desired);
          }
          if (!isNative(token1)) {
            await getTokenApproval(token1, addressToApprove, amount1Desired);
          }
    
          alert("Tokens Approved!");
        }
        catch (error) {
          setAddLiquidityRunning(false);
          alert("Error approving tokens");
          console.log(error)
          return;
        }
    
        const unixDeadline = (Math.floor((Date.now() + Number(deadline) * 60 * 1000) / 1000)).toString();
        try {
          if (token0 && token1 && amount0Desired && amount1Desired) {
            console.log("🚀 ~ handleAddLiquidity ~ amount1Desired:", amount1Desired)
            console.log("🚀 ~ handleAddLiquidity ~ amount0Desired:", amount0Desired)
            console.log("🚀 ~ handleAddLiquidity ~ token1:", token1)
            console.log("🚀 ~ handleAddLiquidity ~ token0:", token0)
    
            let addLiquidityTxHash: any;
    
            if (token0.symbol === "PLS" || token1.symbol === "PLS") {
              let amountTokenDesired: string;
              let amountETHDesired: string;
              let PLS: TokenDetails;
              let Token: TokenDetails;
    
              if (token0.symbol === "PLS") {
                PLS = token0;
                Token = token1;
                amountETHDesired = amount0Desired;
                amountTokenDesired = amount1Desired;
              }
              else {
                PLS = token1;
                Token = token0;
                amountETHDesired = amount1Desired;
                amountTokenDesired = amount0Desired;
              }
    
              addLiquidityTxHash = await addLiquidityETH(
                Token,
                amountETHDesired,
                amountTokenDesired,
                unixDeadline,
                slippageTolerance
              )
            }
            else {
              addLiquidityTxHash = await addLiquidityV2(
                token0,
                token1,
                amount0Desired,
                amount1Desired,
                unixDeadline,
                slippageTolerance
              )
            }
    
            alert(`Liquidity added. tx hash : ${addLiquidityTxHash}`);
          }
        }
        catch (error) {
          console.log("Error adding V2 liquidity", error);
          setAddLiquidityRunning(false);
          alert(`Error adding liquidity`);
        }
        setAddLiquidityRunning(false);
        reset();
      }

    return (
        <>
            <Modal
                open={isOpen}
                onClose={handleCloseAddLiquidity}
                aria-labelledby="settings-modal-title"
                aria-describedby="settings-modal-description"
            >
                <Box sx={style}>
                    <Box className="modal_head" sx={{ position: 'relative', mb: 2 }}>
                        <Typography id="settings-modal-title" variant="h6">
                            Add Liquidity
                        </Typography>
                        <IoCloseOutline
                            size={24}
                            style={{ position: 'absolute', right: '10px', top: '5px', cursor: 'pointer' }}
                            aria-label="Close settings modal"
                            onClick={() => {
                                handleCloseAddLiquidity()
                            }}
                        />
                    </Box>
                    <Box className="modal_body" sx={{
                        backgroundColor: theme === "light" ? "rgb(241 245 249)" : "#173D3D"
                    }}
                    >
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
                                {`${token0?.symbol}-${token1?.symbol}`}
                            </Typography>
                            <Box sx={{ marginTop: "-15px" }}>
                                {range && (
                                    <Button
                                        sx={{ width: '100%', cursor:"default"}}
                                        variant="contained"
                                        color="secondary"
                                    >
                                        {range}
                                    </Button>
                                )
                                }

                            </Box>
                        </Box>

                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            backgroundColor: theme === 'light' ? 'rgb(203 213 225)' : 'rgb(71 85 105)',
                            borderRadius: "0.75rem",
                            width: "20rem",
                            padding: "10px",
                            margin: "15px",
                            border: `1px solid ${theme === 'light' ? 'rgb(115 115 115)' : '#666'}`,
                        }}>
                            <Box sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "10px"
                            }}>
                                <Typography
                                    sx={{
                                        textTransform: 'uppercase',
                                        fontWeight: '600',
                                        color: theme === 'light' ? 'var(--primary)' : 'var(--white)',
                                        letterSpacing: '1px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap' // Prevent text wrapping
                                    }}
                                >
                                    {token0?.symbol}
                                </Typography>
                                <Typography
                                    sx={{
                                        textTransform: 'uppercase',
                                        fontWeight: '600',
                                        color: theme === 'light' ? 'var(--primary)' : 'var(--white)',
                                        letterSpacing: '1px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap' // Prevent text wrapping
                                    }}
                                >
                                    {amount0Desired}
                                </Typography>
                            </Box>

                            <Box sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "10px"
                            }}>
                                <Typography
                                    sx={{
                                        textTransform: 'uppercase',
                                        fontWeight: '600',
                                        color: theme === 'light' ? 'var(--primary)' : 'var(--white)',
                                        letterSpacing: '1px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap' // Prevent text wrapping
                                    }}
                                >
                                    {token1?.symbol}
                                </Typography>
                                <Typography
                                    sx={{
                                        textTransform: 'uppercase',
                                        fontWeight: '600',
                                        color: theme === 'light' ? 'var(--primary)' : 'var(--white)',
                                        letterSpacing: '1px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap' // Prevent text wrapping
                                    }}
                                >
                                    {amount1Desired}
                                </Typography>
                            </Box>

                            <Divider sx={{
                                borderBottom: `1px solid ${theme === 'light' ? 'rgb(212 212 212)' : '#666'}`,
                                marginBottom: "20px"
                            }} />

                            <Box sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "10px"
                            }}>
                                <Typography
                                    sx={{
                                        textTransform: 'uppercase',
                                        fontWeight: '600',
                                        color: theme === 'light' ? 'var(--primary)' : 'var(--white)',
                                        letterSpacing: '1px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap' // Prevent text wrapping
                                    }}
                                >
                                    Fee Tier
                                </Typography>
                                <Typography
                                    sx={{
                                        textTransform: 'uppercase',
                                        fontWeight: '600',
                                        color: theme === 'light' ? 'var(--primary)' : 'var(--white)',
                                        letterSpacing: '1px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap' // Prevent text wrapping
                                    }}
                                >
                                    0.25%
                                </Typography>
                            </Box>

                        </Box>

                        <Box sx={{
                            display: "flex", flexDirection: "column", textAlign: "center"
                        }}>
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    backgroundColor: theme === 'light' ? 'rgb(203 213 225)' : 'rgb(71 85 105)',
                                    borderRadius: "0.75rem",
                                    width: "9rem",
                                    padding: "15px",
                                    margin: "15px",
                                    border: `1px solid ${theme === 'light' ? 'rgb(115 115 115)' : '#666'}`,
                                    alignItems: "center"
                                }}>
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
                                        Price {token0?.symbol} / {token1?.symbol}
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
                                        {currentPrice.toFixed(2)}
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
                                        {`${token1?.symbol}/${token0?.symbol}`}
                                    </Typography>
                                </Box>

                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    backgroundColor: theme === 'light' ? 'rgb(203 213 225)' : 'rgb(71 85 105)',
                                    borderRadius: "0.75rem",
                                    width: "9rem",
                                    padding: "15px",
                                    margin: "15px",
                                    border: `1px solid ${theme === 'light' ? 'rgb(115 115 115)' : '#666'}`,
                                    alignItems: 'center',
                                }}>
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
                                        Price {token1?.symbol} / {token0?.symbol}
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
                                        {currentPrice.toFixed(2)}

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
                                        {`${token1?.symbol}/${token0?.symbol}`}
                                    </Typography>
                                </Box>

                            </Box>

                            {/* <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                backgroundColor: theme === 'light' ? 'rgb(203 213 225)' : 'rgb(71 85 105)',
                                borderRadius: "0.75rem",
                                width: "90%",
                                paddingTop: "15px",
                                margin: "15px",
                                border: `1px solid ${theme === 'light' ? 'rgb(115 115 115)' : '#666'}`,
                                alignItems: 'center',
                            }}>
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
                                    CURRENT PRICE
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
                                    {currentPrice.toFixed(2)}
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
                                    {`${token1?.symbol}/${token0?.symbol}`}
                                </Typography>
                            </Box> */}

                        </Box>

                        <Box className="slippageSec dsls" sx={{ width: '90%', marginLeft: "15px" }}>
                            {isLiquidityAdded ? (
                                <Button
                                    sx={{ width: '100%' }}
                                    variant="contained"
                                    color="secondary"
                                >
                                    <CircularProgress size={24} sx={{ color: "inherit" }} />
                                </Button>
                            ) :
                                (<Button
                                    sx={{ width: '100%' }}
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleAddLiquidity}
                                >
                                    Add
                                </Button>)
                            }
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default AddLiquidityModalV2;