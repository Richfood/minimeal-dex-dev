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
import { addLiquidityV3 } from '@/utils/contract-methods/addLiquidity';
import addresses from "../../utils/address.json";
import { FeeAmount } from '@uniswap/v3-sdk';

interface AddLiquidityModalProps {
    isOpen: boolean;
    setOpenAddLiquidity: React.Dispatch<React.SetStateAction<boolean>>;
    handleCloseAddLiquidity: () => void;
    theme: 'light' | 'dark';
    amountInDesired: string;
    amountOutDesired: string;
    token0: TokenDetails | null;
    token1: TokenDetails | null;
    tradingFee: string;
    priceLowerEntered: string;
    priceUpperEntered: string;
    priceCurrent: string;
    slippageTolerance: number | null;
    setAddLiquidityRunning: React.Dispatch<React.SetStateAction<boolean>>;
    approvalAmount0: string;
    approvalAmount1: string;
    deadline: string;
    fee: FeeAmount | null;
    amount0Desired: string;
    amount1Desired: string;
    amount0Min: string;
    amount1Min: string;
    tickLower: string;
    tickUpper: string;
    sqrtPriceX96: string;
    isFullRange: boolean;
    reset: () => void;

}

const AddLiquidityModal: React.FC<AddLiquidityModalProps> = (
    { isOpen, handleCloseAddLiquidity, theme, amountInDesired, amountOutDesired, token0, token1, tradingFee,
        priceLowerEntered, priceUpperEntered, priceCurrent, slippageTolerance, setAddLiquidityRunning, approvalAmount0, approvalAmount1,
        deadline, fee, tickLower, tickUpper, amount0Desired, amount1Desired, amount0Min, amount1Min, sqrtPriceX96, isFullRange, reset, setOpenAddLiquidity }) => {

    const NFPMAddress = addresses.PancakePositionManagerAddress;

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        fontSize: '14px',
        fontWeight: '500',
        transform: 'translate(-50%, -50%)',
        maxWidth: "fitContent",
        width: 400,
        height: "45rem",
        bgcolor: theme === 'light' ? 'var(--white)' : 'var(--primary)',
        boxShadow: 'rgba(0, 0, 0, 0.24) -40px 40px 80px -8px',
        borderRadius: '14px',
        color: theme === 'light' ? 'var(--primary)' : 'var(--white)',
        maxHeight: '100dvh',
        overflowY: 'auto',
        overflowX: 'hidden',
    };

    const [range, setRange] = useState<string | null>("")
    const [isLiquidityAdded, setIsLiquidityAdded] = useState<boolean>(false);


    useEffect(() => {
        try {
            if (Number(priceCurrent) >= Number(priceLowerEntered) && Number(priceCurrent) <= Number(priceUpperEntered)) {
                setRange("Active");
            } else {
                setRange("Inactive");
            }
        } catch (error) {
            console.error("🚀 ~ Error calculating range ~", error);
        }
    }, [priceCurrent, priceLowerEntered, priceUpperEntered]);

    const handleAddLiquidity = async () => {
        if (!token0 || !token1 || !slippageTolerance) return;
        setIsLiquidityAdded(true);
        setAddLiquidityRunning(true);
        try {

            const addressToApprove = NFPMAddress;

            if (!isNative(token0)) {
                await getTokenApproval(token0, addressToApprove, approvalAmount0);
            }
            if (!isNative(token1)) {
                await getTokenApproval(token1, addressToApprove, approvalAmount1);
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
            if (fee && token0 && token1) {
                const addLiquidityTxHash = await addLiquidityV3(
                    NFPMAddress,
                    token0,
                    token1,
                    tickLower,
                    tickUpper,
                    amount0Desired,
                    amount1Desired,
                    amount0Min,
                    amount1Min,
                    unixDeadline,
                    sqrtPriceX96,
                    fee,
                    isFullRange
                )

                alert(`Liquidity added. tx hash : ${addLiquidityTxHash} `)
                setIsLiquidityAdded(false)
                setOpenAddLiquidity(false)
                reset();
            }
        }
        catch (error) {
            //console.log("Error adding liquidity", error);
            setAddLiquidityRunning(false);
            alert(`Error adding liquidity`);
        }
        setAddLiquidityRunning(false);
        setIsLiquidityAdded(false)
        setOpenAddLiquidity(false)

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
                                {`${token0?.symbol}-${token1?.symbol}`}
                            </Typography>
                            <Box sx={{ marginTop: "-15px" }}>
                                {range && (
                                    <Button
                                        sx={{ width: '100%' }}
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
                            backgroundColor: theme === 'light' ? 'transparent' : 'gray',
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
                                    {amountInDesired}
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
                                    {amountOutDesired}
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
                                    {tradingFee}
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
                                    backgroundColor: theme === 'light' ? 'transparent' : 'gray',
                                    borderRadius: "0.75rem",
                                    width: "9rem",
                                    padding: "15px",
                                    margin: "15px",
                                    border: `1px solid ${theme === 'light' ? 'rgb(115 115 115)' : '#666'}`,
                                    alignContent: "center"
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
                                        MIN PRICE
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
                                        {Number(priceLowerEntered).toFixed(2)}
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
                                    backgroundColor: theme === 'light' ? 'transparent' : 'gray',
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
                                        MAX PRICE
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
                                        {Number(priceUpperEntered).toFixed(2)}

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

                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                backgroundColor: theme === 'light' ? 'transparent' : 'gray',
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
                                    {Number(priceCurrent).toFixed(2)}
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

export default AddLiquidityModal;