import { Box, Typography, TextField, Button, FormGroup, FormControlLabel, Checkbox } from '@mui/material'
import Image from 'next/image'
import React from 'react'

const RewardCard = () => {
    return (
        <>
            <Box className="RewardCard" sx={{ bgcolor: '#1B3C3C', p: '20px 28px', borderRadius: '35px' }}>
                <Box className="rewardCardHead" sx={{ textAlign: 'center' }}>
                    <Image src="/images/soil.svg" alt="Brand Logo" width={105} height={105} />
                </Box>
                <Box className="claimSec" sx={{ bgcolor: '#ffffff', p: '20px', borderRadius: '15px', mb: '20px' }}>
                    <Typography variant="h6" className="main-title" sx={{ mb: '12px',color: '#D1AC70' }}>SOIL-Claim</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mb: '12px' }}>
                        <Box>
                            <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>Verfügbare SUN-Points (offchain):</Typography>
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>10000.00 SOIL</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', }}>
                        <Box>
                            <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>Claim SOIL Menge:</Typography>
                        </Box>
                        <Box className='input-box'>
                            <TextField size="small" variant="filled" fullWidth />
                        </Box>
                    </Box>

                    <Box className="cusCheckbox" sx={{mb: '12px'}}>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        size="small"
                                        defaultChecked
                                        sx={{
                                            color: '#D1AC70', // unchecked color
                                            '&.Mui-checked': {
                                                color: '#D1AC70', // checked color
                                            },
                                        }}
                                    />
                                }
                                label={<><Typography component="span" sx={{fontSize: '12px',m: '0'}}>Ich akzeptiere hiermit ausdrücklich die Widerrufsbelehrung</Typography></>}
                            />
                        </FormGroup>
                    </Box>


                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', mb: '12px' }}>
                        <Box>
                            <Button
                                variant="contained"
                                sx={{ minWidth: '110px', borderRadius: '5px', boxShadow: 'none', backgroundColor: '#D1AC70', '&:hover': { backgroundColor: '#D1AC70' } }}
                            >
                                Claim
                            </Button>
                        </Box>
                        <Box className='input-box'>
                            <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>Transfer von SUN-Points in SOIL</Typography>
                        </Box>
                    </Box>


                </Box>

                <Box className="claimSec burnSec" sx={{ bgcolor: '#D1AC70', p: '20px', borderRadius: '15px' }}>
                    <Typography variant="h6" className="main-title" sx={{ mb: '12px',color: '#ffffff' }}>SOIL-Return (burn)</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mb: '12px' }}>
                        <Box>
                            <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>Verfügbare SUN-Points (offchain):</Typography>
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>10000.00 SOIL</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap',mb: '12px' }}>
                        <Box>
                            <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>Claim SOIL Menge:</Typography>
                        </Box>
                        <Box className='input-box'>
                            <TextField size="small" variant="filled" fullWidth />
                        </Box>
                    </Box>

                   


                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', mb: '12px' }}>
                        <Box>
                            <Button
                                variant="contained"
                                sx={{ minWidth: '110px', color: '#D1AC70', borderRadius: '5px', boxShadow: 'none', backgroundColor: '#1B3C3C', '&:hover': { backgroundColor: '#1B3C3C' } }}
                            >
                                Return
                            </Button>
                        </Box>
                        <Box className='input-box'>
                            <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>Transfer von SUN-Points in SOIL</Typography>
                        </Box>
                    </Box>


                </Box>
            </Box>
        </>
    )
}

export default RewardCard