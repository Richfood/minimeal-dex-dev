import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { IoCloseOutline } from 'react-icons/io5';
import { TokenDetails } from '@/interfaces';
import { Button, Divider } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { tickToPrice } from '@/utils/utils';

interface AddLiquidityModalProps {
    isOpen: boolean;
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
}

const AddLiquidityModal: React.FC<AddLiquidityModalProps> = ({ isOpen, handleCloseAddLiquidity, theme, amountInDesired, amountOutDesired, token0, token1, tradingFee, priceLowerEntered, priceUpperEntered, priceCurrent }) => {

  
    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        fontSize: '14px',
        fontWeight: '500',
        transform: 'translate(-50%, -50%)',
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
            if (priceCurrent >= priceLowerEntered && priceCurrent <= priceUpperEntered) {
                setRange("Active");
            } else {
                setRange("Inactive");
            }
        } catch (error) {
            console.error("🚀 ~ Error calculating range ~", error);
        }
    }, [priceCurrent, priceLowerEntered, priceUpperEntered]); 


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
                            <Box sx={{ display: "flex", width: "full" }}>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    backgroundColor: theme === 'light' ? 'transparent' : 'gray',
                                    borderRadius: "0.75rem",
                                    width: "20rem",
                                    padding: "15px 30px",
                                    margin: "15px",
                                    border: `1px solid ${theme === 'light' ? 'rgb(115 115 115)' : '#666'}`,
                                    justifyContent: "center"
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
                                        {priceLowerEntered}
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
                                    width: "20rem",
                                    padding: "15px 30px",
                                    margin: "15px",
                                    border: `1px solid ${theme === 'light' ? 'rgb(115 115 115)' : '#666'}`,
                                    justifyContent: "center"
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
                                        {priceUpperEntered}
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
                                padding: "15px",
                                margin: "15px",
                                border: `1px solid ${theme === 'light' ? 'rgb(115 115 115)' : '#666'}`,
                                justifyContent: "center",
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
                                    {priceCurrent}
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