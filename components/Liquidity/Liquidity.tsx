import React, { useState, useCallback, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemButton, FormGroup, FormControlLabel, Tab, Tabs, Button } from '@mui/material';
import { IoSettingsOutline } from 'react-icons/io5';
import { RxCountdownTimer } from 'react-icons/rx';
import SettingsModal from '../SettingModal/SettingModal';
import RecentTransactions from '../RecentTransactions/RecentTransactions';
import Customcheckbox from '../Customcheckbox/Customcheckbox';
import { TabContext } from '@mui/lab';
import { FiPlus } from "react-icons/fi";
import router from 'next/router';
import ImportPool from '../ImportPool/ImportPool';
import { getV3PositionsData } from '@/utils/api/getV3Positions';
import { calculatePositionData } from '@/utils/calculatePositionData';
import { V3PositionData, TokenDetails, V2PositionsData } from '@/interfaces';
import Link from 'next/link';

import tokenList from "@/utils/tokenList.json";
import { getV2Positions } from '@/utils/api/getV2Positions';
import postionDataV2 from "@/utils/positionsDataV2.json";
import postionDataV3 from "@/utils/positionsDataV3.json";


interface LiquidityProps {
  theme: 'light' | 'dark';
  onToggle?: () => void;
}

const Liquidity: React.FC<LiquidityProps> = ({ theme, onToggle }) => {
  const [openPool, setOpenPool] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenRecent, setIsOpenRecent] = useState(false);
  const [value, setValue] = React.useState('0');

  const [v3Positions, setV3Positions] = useState<V3PositionData[]>([]);
  const [v2Positions, setV2Positions] = useState<V2PositionsData[]>([]);

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = () => setIsOpen(false);

  const handleOpenPool = useCallback(() => setOpenPool(true), []); // Changed to openPool
  const handleClosePool = () => setOpenPool(false); // Changed to openPool

  const handleOpenRecent = useCallback(() => setIsOpenRecent(true), []);
  const handleCloseRecent = () => setIsOpenRecent(false);

  const [startToken0, setStartToken0] = useState<TokenDetails>(tokenList.TokenB);
  const [startToken1, setStartToken1] = useState<TokenDetails>(tokenList.TokenA);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    const runGetPositionsData = async () => {

      if (value === "2") {
        let newPositions: V2PositionsData[] = await getV2Positions();
        console.log("🚀 ~ runGetPositionsData ~ V2 ~ newPositions:", newPositions)
        setV2Positions(newPositions)
      }
      else {
        let newPositions: V3PositionData[] = await getV3PositionsData();

        setV3Positions(newPositions);
      }
    }

    runGetPositionsData();
  }, [value])

  const color = theme === 'light' ? 'var(--primary)' : 'var(--cream)';

  return (
    <>
      <Box className="white_box">
        <Box className="Liq_top">
          <Box>
            <Typography variant="h4" className='sec_title' sx={{ mb: '10px' }}>Your Liquidity</Typography>
            <Typography sx={{ color: 'var(--cream)', fontSize: '14px', fontWeight: '500' }}>List of your liquidity positions</Typography>
          </Box>
          <Box>
            {/* <List sx={{ display: 'flex' }}>
              <ListItem sx={{ color }} className="widgetItem" disablePadding onClick={handleOpenRecent}>
                <ListItemButton sx={{ px: '8px' }}>
                  <RxCountdownTimer style={{ width: '24px', height: '24px', color: color }} />
                </ListItemButton>
              </ListItem>
              <ListItem sx={{ color }} className="widgetItem" disablePadding>
                <ListItemButton sx={{ px: '8px' }} onClick={handleOpen}>
                  <IoSettingsOutline style={{ width: '24px', height: '24px', color: color }} />
                </ListItemButton>
              </ListItem>
            </List> */}
          </Box>
        </Box>

        <Box className="Liq_mid">
          <Box>
            <FormGroup>
              <FormControlLabel
                sx={{ m: '0' }}
                control={<Customcheckbox />}
                label={
                  <Typography sx={{ ml: '5px', fontSize: '12px', mt: '3px', fontWeight: '400', color: 'var(--cream)' }}>
                    Hide closed positions
                  </Typography>
                }
              />
            </FormGroup>
          </Box>
          <Box>
            <TabContext value={value}>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="connect-wallet-tabs"
                sx={{ border: 'unset', minHeight: 'unset' }}
                className="tabsOuter"
              >
                <Tab label="All" value="0" />
                <Tab label="V3" value="1" />
                <Tab label="V2" value="2" />
              </Tabs>
            </TabContext>
          </Box>
        </Box>

        <Box className="tabsContent">
          {value === '0' && (
            <Box sx={{ py: '15px', textAlign: 'center' }}>
              <Typography sx={{ fontSize: '12px', color: 'var(--cream)' }}>No liquidity found</Typography>
            </Box>
          )}
          {value === '1' && (
            <Box sx={{ py: '15px', display: 'flex', justifyContent: 'center' }}>
              {v3Positions ? (
                <List sx={{ width: '100%', maxWidth: 'screen' }}>
                  {postionDataV3.map((elem) => (
                    <Link href={`/position`} passHref key={elem.id} style={{ textDecoration: 'none' }}> {/* Removes underline from link */}
                      <ListItem
                        component="a"
                        sx={{
                          width: '100%',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'var(--hover-color)',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: '100%',
                            background: theme === 'light' ? 'var(--light_clr)' : 'var(--secondary-dark)',
                            padding: '35px',
                            borderRadius: '10px',
                            textAlign: 'left',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Typography sx={{ fontSize: '12px', color: 'var(--cream)' }}>
                              {elem.token0.name} / {elem.token1.name}
                            </Typography>
                            <Typography sx={{ fontSize: '12px', color: 'var(--cream)' }}>
                              {elem.liquidity}
                            </Typography>
                            <Typography sx={{ fontSize: '12px', color: 'var(--cream)' }}>
                              {calculatePositionData(elem).humanReadableFeesToken0}
                            </Typography>
                          </Box>
                        </Box>
                      </ListItem>
                    </Link>
                  ))}
                </List>
              ) : (
                <Typography sx={{ fontSize: '12px', color: 'var(--cream)' }}>No liquidity found</Typography>
              )}
            </Box>
          )}



          {value === '2' && (
            <Box sx={{ py: '15px', textAlign: 'center' }}>
              {v2Positions ? (
                <List sx={{ width: '100%', maxWidth: 'screen' }}> {/* Set a max width for uniformity */}
                  {postionDataV3.map((elem) => {
                    return (
                      <ListItem sx={{ width: '100%' }}>
                        <Box
                          sx={{
                            width: '100%',
                            background: theme === 'light' ? 'var(--light_clr)' : 'var(--secondary-dark)',
                            padding: '35px',
                            borderRadius: '10px',
                            textAlign: 'left', // Align text to the left within each box
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center', // Center-align the box itself within each list item
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Typography sx={{ fontSize: '12px', color: 'var(--cream)' }}>{elem.token0.name} / {elem.token1.name}</Typography>
                            <Typography sx={{ fontSize: '12px', color: 'var(--cream)' }}>{elem.liquidity}</Typography>
                            <Typography sx={{ fontSize: '12px', color: 'var(--cream)' }}>{calculatePositionData(elem).humanReadableFeesToken0}</Typography>
                          </Box>
                        </Box>
                      </ListItem>
                    );
                  })}
                </List>
              ) : (
                <Typography sx={{ fontSize: '12px', color: 'var(--cream)' }}>No liquidity found</Typography>
              )}
            </Box>
          )}
        </Box>

        <Box sx={{ py: '15px', textAlign: 'center' }}>
          <Button
            onClick={() => {
              const pathVal = value === '2' ? "V2" : "V3";
              let path = `/add/${pathVal}/${startToken0.address.contract_address}/${startToken1.address.contract_address}`//`/add/${pathVal}/token/token`;

              // path = (value === '2' ? 'V2/' : 'V3/') + path;
              router.push(path)
            }}
            variant="contained"
            color="secondary"
            sx={{ width: '100%', gap: '5px' }}
          >
            <FiPlus style={{ width: '20px', height: '20px' }} /> Add Liquidity
          </Button>
        </Box>
      </Box>

      <RecentTransactions open={isOpenRecent} onClose={handleCloseRecent} />
      {/* <SettingsModal isOpen={isOpen} handleClose={handleClose} theme={theme} /> */}
      <ImportPool open={openPool} onClose={handleClosePool} />
    </>
  );
}

export default Liquidity;
