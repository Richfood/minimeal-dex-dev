import React from 'react';
import { Box, Typography, TextField, Button, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import Image from 'next/image';
import RewardCard from '../../components/RewardCard/RewardCard';

const Index = () => {
  return (
    <Box className="sunRewards">
      <Box className="customContainer">
        <Box className="customRow">

          {/* First Column with RewardCard */}
          <Box className="customCol">
            <Box className="rewardBox">
              <Box
                className="RewardCard"
                sx={{ bgcolor: '#1B3C3C', p: '20px 28px', borderRadius: '35px' }}
              >
                <Box className="rewardCardHead" sx={{ textAlign: 'center' }}>
                  <Image src="/images/soil.svg" alt="Brand Logo" width={105} height={105} />
                </Box>

                {/* Claim Section */}
                <Box
                  className="claimSec"
                  sx={{ bgcolor: '#ffffff', p: '20px', borderRadius: '15px', mb: '20px' }}
                >
                  <Typography variant="h6" className="main-title" sx={{ mb: '12px', color: '#D1AC70' }}>
                    SOIL-Claim
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mb: '12px' }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>
                      Verfügbare SUN-Points (offchain):
                    </Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>
                      10000.00 SOIL
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',gap: '10px', flexWrap: 'wrap' }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>
                      Claim SOIL Menge:
                    </Typography>
                    <Box className='input-box'>
                      <TextField size="small" variant="filled" fullWidth />
                    </Box>
                  </Box>

                  {/* Checkbox Section */}
                  <Box className="cusCheckbox" sx={{ mb: '12px' }}>
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
                        label={
                          <Typography component="span" sx={{ fontSize: '12px', margin: '0' }}>
                            Ich akzeptiere hiermit ausdrücklich die Widerrufsbelehrung
                          </Typography>
                        }
                      />
                    </FormGroup>
                  </Box>

                  {/* Claim Button Section */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',gap: '10px', flexWrap: 'wrap', mb: '12px' }}>
                    <Button
                      variant="contained"
                      sx={{
                        minWidth: '110px',
                        borderRadius: '5px',
                        boxShadow: 'none',
                        backgroundColor: '#D1AC70',
                        '&:hover': { backgroundColor: '#D1AC70' }
                      }}
                    >
                      Claim
                    </Button>
                    <Box className='input-box'>
                      <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>
                        Transfer von SUN-Points in SOIL
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Burn Section */}
                <Box
                  className="claimSec burnSec"
                  sx={{ bgcolor: '#D1AC70', p: '20px', borderRadius: '15px' }}
                >
                  <Typography variant="h6" className="main-title" sx={{ mb: '12px', color: '#ffffff' }}>
                    SOIL-Return (burn)
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mb: '12px' }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>
                      Verfügbare SUN-Points (offchain):
                    </Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>
                      10000.00 SOIL
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',gap: '10px', flexWrap: 'wrap', mb: '12px' }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>
                      Claim SOIL Menge:
                    </Typography>
                    <Box className='input-box'>
                      <TextField size="small" variant="filled" fullWidth />
                    </Box>
                  </Box>

                  {/* Return Button Section */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',gap: '10px', flexWrap: 'wrap', mb: '12px' }}>
                    <Button
                      variant="contained"
                      sx={{
                        minWidth: '110px',
                        color: '#D1AC70',
                        borderRadius: '5px',
                        boxShadow: 'none',
                        backgroundColor: '#1B3C3C',
                        '&:hover': { backgroundColor: '#1B3C3C' }
                      }}
                    >
                      Return
                    </Button>
                    <Box className='input-box'>
                      <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>
                        Transfer von SUN-Points in SOIL
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
             
            </Box>
          </Box>

          <Box className="customCol">
            <Box className="rewardBox yellowBox">
              <Box
                className="RewardCard"
                sx={{ bgcolor: '#FCCF0D', p: '20px 28px', borderRadius: '35px' }}
              >
                <Box className="rewardCardHead" sx={{ textAlign: 'center' }}>
                  <Image src="/images/stbl.svg" alt="Brand Logo" width={105} height={105} />
                </Box>

                {/* Claim Section */}
                <Box
                  className="claimSec"
                  sx={{ bgcolor: '#ffffff', p: '20px', borderRadius: '15px', mb: '20px' }}
                >
                  <Typography variant="h6" className="main-title" sx={{ mb: '12px', color: '#D1AC70' }}>
                  STBL-Claim
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mb: '12px' }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>
                    Verfügbare STBL (offchain):
                    </Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>
                    10000.00 STBL
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',gap: '10px', flexWrap: 'wrap' }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>
                    Claim STBL Menge:
                    </Typography>
                    <Box className='input-box'>
                      <TextField size="small" variant="filled" fullWidth />
                    </Box>
                  </Box>

                  {/* Checkbox Section */}
                  <Box className="cusCheckbox" sx={{ mb: '12px' }}>
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
                        label={
                          <Typography component="span" sx={{ fontSize: '12px', margin: '0' }}>
                           Ichakzeptere hitousdrücklich die Widerrufsbelehrung
                          </Typography>
                        }
                      />
                    </FormGroup>
                  </Box>

                  {/* Claim Button Section */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',gap: '10px', flexWrap: 'wrap', mb: '12px' }}>
                    <Button
                      variant="contained"
                      sx={{
                        minWidth: '110px',
                        borderRadius: '5px',
                        boxShadow: 'none',
                        backgroundColor: '#D1AC70',
                        '&:hover': { backgroundColor: '#D1AC70' }
                      }}
                    >
                      Claim
                    </Button>
                    <Box className='input-box'>
                      <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>
                      Transfer von STBL auf die Blockchain
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Burn Section */}
                <Box
                  className="claimSec burnSec"
                  sx={{ bgcolor: '#D1AC70', p: '20px', borderRadius: '15px' }}
                >
                  <Typography variant="h6" className="main-title" sx={{ mb: '12px', color: '#ffffff' }}>
                  STBL-Return (burn)
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mb: '12px' }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>
                    Verfügbare STBL  (onchain):
                    </Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>
                    10000.00 STBL
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',gap: '10px', flexWrap: 'wrap', mb: '12px' }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>
                    Return STBL Menge: 
                    </Typography>
                    <Box className='input-box'>
                      <TextField size="small" variant="filled" fullWidth />
                    </Box>
                  </Box>

                  {/* Return Button Section */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',gap: '10px', flexWrap: 'wrap', mb: '12px' }}>
                    <Button
                      variant="contained"
                      sx={{
                        minWidth: '110px',
                        color: '#D1AC70',
                        borderRadius: '5px',
                        boxShadow: 'none',
                        backgroundColor: '#1B3C3C',
                        '&:hover': { backgroundColor: '#1B3C3C' }
                      }}
                    >
                      Return
                    </Button>
                    <Box className='input-box'>
                      <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>
                      Rückgabe der STBL
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
             
            </Box>
          </Box>


          <Box className="customCol">
            <Box className="rewardBox">
              <Box
                className="RewardCard"
                sx={{ bgcolor: '#D1AC70', p: '20px 28px', borderRadius: '35px' }}
              >
                <Box className="rewardCardHead" sx={{ textAlign: 'center' }}>
                  <Image src="/images/sun.svg" alt="Brand Logo" width={105} height={105} />
                </Box>

                {/* Claim Section */}
                <Box
                  className="claimSec"
                  sx={{ bgcolor: '#ffffff', p: '20px', borderRadius: '15px', mb: '20px' }}
                >
                  <Typography variant="h6" className="main-title" sx={{ mb: '12px', color: '#D1AC70' }}>
                  STBL-EINLÖSUNG
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mb: '12px' }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>
                    Verfügbare STBL (onchain):
                    </Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>
                    10000.00 STBL
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',gap: '10px', flexWrap: 'wrap' }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>
                    Swap STBL to $V:
                    </Typography>
                    <Box className='input-box'>
                      <TextField size="small" variant="filled" fullWidth />
                    </Box>
                  </Box>

                  {/* Checkbox Section */}
                  <Box className="cusCheckbox" sx={{ mb: '12px' }}>
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
                        label={
                          <Typography component="span" sx={{ fontSize: '12px', margin: '0' }}>
                           Ich akzeptiere hiermit ausdrücklich die Widerrufsbelehrung
                          </Typography>
                        }
                      />
                    </FormGroup>
                  </Box>

                  {/* Claim Button Section */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',gap: '10px', flexWrap: 'wrap', mb: '12px' }}>
                    <Button
                      variant="contained"
                      sx={{
                        minWidth: '110px',
                        borderRadius: '5px',
                        boxShadow: 'none',
                        backgroundColor: '#D1AC70',
                        '&:hover': { backgroundColor: '#D1AC70' }
                      }}
                    >
                     Einlösen
                    </Button>
                    <Box className='input-box'>
                      <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>
                      1 STBL = 1 SUN Minimeal Voucher ($V)
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Burn Section */}
                <Box
                  className="claimSec burnSec"
                  sx={{ bgcolor: '#1B3C3C', p: '20px', borderRadius: '15px' }}
                >
                  <Typography variant="h6" className="main-title" sx={{ mb: '12px', color: '#ffffff' }}>
                  SUN Minimeal Vouchers ($V)
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mb: '12px' }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>
                    Verfügbar:
                    </Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>
                    300.00 $V
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',gap: '10px', flexWrap: 'wrap', mb: '12px' }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>
                    Swap $V to STBL:
                    </Typography>
                    <Box className='input-box'>
                      <TextField size="small" variant="filled" fullWidth />
                    </Box>
                  </Box>

                  {/* Return Button Section */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',gap: '10px', flexWrap: 'wrap', mb: '12px' }}>
                    <Button
                      variant="contained"
                      sx={{
                        minWidth: '110px',
                        color: '#1B3C3C',
                        borderRadius: '5px',
                        boxShadow: 'none',
                        backgroundColor: '#ffffff',
                        '&:hover': { backgroundColor: '#ffffff' }
                      }}
                    >
                      Claim
                    </Button>
                    <Box className='input-box'>
                      <Typography sx={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>
                      1 $V-1 STBL (onchain)
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
             
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Index;