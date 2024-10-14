import React, { useState, useCallback } from 'react';
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

interface LiquidityProps {
  theme: 'light' | 'dark';
  onToggle?: () => void; 
}

const Liquidity: React.FC<LiquidityProps> = ({ theme, onToggle }) => {
  const [openPool, setOpenPool] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenRecent, setIsOpenRecent] = useState(false);
  const [value, setValue] = React.useState('0');

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = () => setIsOpen(false);

  const handleOpenPool = useCallback(() => setOpenPool(true), []); // Changed to openPool
  const handleClosePool = () => setOpenPool(false); // Changed to openPool

  const handleOpenRecent = useCallback(() => setIsOpenRecent(true), []);
  const handleCloseRecent = () => setIsOpenRecent(false);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

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
            <List sx={{ display: 'flex' }}>
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
            </List>
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
            <Box sx={{ py: '15px', textAlign: 'center' }}>
              <Typography sx={{ fontSize: '12px', color: 'var(--cream)' }}>No liquidity found</Typography>
            </Box>
          )}
          {value === '2' && (
            <Box sx={{ py: '15px', textAlign: 'center' }}>
              <Typography sx={{ color: 'var(--cream)', fontWeight: '600', mb: '10px' }}>Don't see a pair you joined?</Typography>
              <Button  onClick={() => router.push('/find')}  sx={{ color: 'var(--cream)', border: '1px solid var(--cream)' }}>
                Find other LP tokens
              </Button>
            </Box>
          )}
        </Box>

        <Box sx={{ py: '15px', textAlign: 'center' }}>
          <Button 
            onClick={() => {
              const pathVal = value === '2' ? "V2" : "V3";
              let path = `/add/${pathVal}/token/token`;
              
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
      <SettingsModal isOpen={isOpen} handleClose={handleClose} theme={theme} />
      <ImportPool open={openPool} onClose={handleClosePool} /> 
    </>
  );
}

export default Liquidity;
