import React, { useState, useCallback, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemButton, FormGroup, FormControlLabel, Tab, Tabs, Button, CircularProgress } from '@mui/material';
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

import tokenList from "@/utils/famousToken.json";
import { getV2Positions } from '@/utils/api/getV2Positions';
import postionDataV2 from "@/utils/positionsDataV2.json";
// import postionDataV3 from "@/utils/positionsDataV3.json";
import { PositionListV3 } from '../PositionList/PositionListV3';
import { PositionListV2 } from '../PositionList/PositionListV2';
import { ethers } from 'ethers';


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

  const [userAddress, setUserAddress] = useState("");

  const [isLoadingPosition, setIsLoadingPosition] = useState(false);

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = () => setIsOpen(false);

  const handleOpenPool = useCallback(() => setOpenPool(true), []); // Changed to openPool
  const handleClosePool = () => setOpenPool(false); // Changed to openPool

  const handleOpenRecent = useCallback(() => setIsOpenRecent(true), []);
  const handleCloseRecent = () => setIsOpenRecent(false);

  const [startToken0, setStartToken0] = useState<TokenDetails>(tokenList.filter((token)=>token.symbol === "SOIL")[0]);
  const [startToken1, setStartToken1] = useState<TokenDetails>(tokenList.filter((token)=>token.symbol === "STBL")[0]);

  const [prevUserAddress, setPrevUserAddress] = useState("");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handlePositionClick = (protocol : string, id: string)=>{
    if(protocol === "V3"){
      router.push(`/positionV3/${id}`)
    }
    else{
      router.push(`/positionV2/${id}`)
    }
  }

  useEffect(() => {
    const getUserAddress = async () => {
        try {
            const newProvider = new ethers.providers.Web3Provider(window.ethereum);
            const newSigner = newProvider.getSigner();
            const userAddressToSet = await newSigner.getAddress();
            setUserAddress(userAddressToSet);
        } catch (error) {
            console.error("Error fetching user address:", error);
            setUserAddress("");
        }
    };

    if (window.ethereum) {
        getUserAddress();

        // Listen for account changes
        const handleAccountsChanged = (accounts : any[]) => {
            if (accounts.length > 0) {
                setUserAddress(accounts[0]);
            } else {
                setUserAddress(""); // User disconnected wallet
            }
        };

        // Add event listener
        window.ethereum.on("accountsChanged", handleAccountsChanged);

        // Cleanup the event listener on unmount
        return () => {
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        };
    } else {
        setUserAddress("");
    }
}, []); // Dependency array empty so it runs once on mount

  useEffect(() => {
    const runGetPositionsData = async () => {
      setIsLoadingPosition(true);

      if(value === "0" && (v2Positions.length === 0 || v3Positions.length === 0 || userAddress !== prevUserAddress)){
        let newV3Positions: V3PositionData[] = await getV3PositionsData();
        setV3Positions(newV3Positions);

        let newV2Positions: V2PositionsData[] = await getV2Positions();
        setV2Positions(newV2Positions)
        
        setPrevUserAddress(userAddress);
      }
      else if (value === "2" && v2Positions.length === 0 || userAddress !== prevUserAddress) {
        let newPositions: V2PositionsData[] = await getV2Positions();
        setV2Positions(newPositions)
        setPrevUserAddress(userAddress);
      }
      else if(value === "1" && v3Positions.length === 0 || userAddress !== prevUserAddress){
        let newPositions: V3PositionData[] = await getV3PositionsData();
        setV3Positions(newPositions);
        setPrevUserAddress(userAddress);
      }

      setIsLoadingPosition(false);
    }
    runGetPositionsData();
  }, [value, userAddress])

  const color = theme === 'light' ? 'var(--primary)' : 'var(--cream)';


  console.log(value !== '2' && PositionListV3.length>3)
  return (
    <>
      <Box className="white_box">
        <Box className="Liq_top">
          <Box>
            <Typography variant="h4" className='sec_title' sx={{ mb: '10px' }}>Your Positions</Typography>
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
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
    {(value === '2' && v2Positions.length>3) || (value !== '2' && v3Positions.length>3) ? (
      <Box>
        <Button
          onClick={() => {
            const pathVal = value === '2' ? "V2" : "V3";
            const path = `/add/${pathVal}/${startToken0.address.contract_address}/${startToken1.address.contract_address}`;
            router.push(path);
          }}
          variant="contained"
          color="secondary"
          sx={{           
            padding: '12px 12px',
            fontSize: '12px',
            gap: '5px',
            minWidth: 'auto',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          Add Liquidity
        </Button>
    </Box>
    ) : null}
</Box>



        <Box className="tabsContent">
          {isLoadingPosition ? 
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress size={30} />
            </Box>
            :
            <Box>
              {value === '1' && (
                <Box sx={{ py: '15px', display: 'flex', justifyContent: 'center' }}>
                  {v3Positions.length ? (
                    <List sx={{ width: '100%', maxWidth: 'screen' }}>
                      {v3Positions.map((elem) => (
                        <Box onClick={()=>handlePositionClick("V3", elem.id)} sx={{cursor:"pointer"}}>
                          <PositionListV3 theme={theme} data={elem}/>
                        </Box>
                      ))}
                    </List>
                  ) : (
                    <Typography sx={{ fontSize: '12px', color: 'var(--cream)' }}>No liquidity found</Typography>
                  )}
                </Box>
              )}
              {value === '2' && (
                <Box sx={{ py: '15px', textAlign: 'center' }}>
                  {v2Positions.length ? (
                    <List sx={{ width: '100%', maxWidth: 'screen' }}> 
                      {v2Positions.map((elem) => (
                        <Box onClick={()=>handlePositionClick("V2", elem.pair.id)} sx={{cursor:"pointer"}}>
                          <PositionListV2 theme={theme} data={elem}/>
                        </Box>
                      ))}
                    </List>
                  ) : (
                    <Typography sx={{ fontSize: '12px', color: 'var(--cream)' }}>No liquidity found</Typography>
                  )}
                </Box>
              )}
              {value === '0' && (
                <Box sx={{ py: '15px', display: 'flex', justifyContent: 'center' }}>
                  {v3Positions.length || v2Positions.length ? (
                      <List sx={{ width: '100%', maxWidth: 'screen' }}>
                        {v3Positions.map((elem) => (
                          <Box onClick={()=>handlePositionClick("V3", elem.id)} sx={{cursor:"pointer"}}>
                            <PositionListV3 theme={theme} data={elem}/>
                          </Box>
                        ))}
                        {v2Positions.map((elem)=>
                          <Box onClick={()=>handlePositionClick("V2", elem.pair.id)} sx={{cursor:"pointer"}}>
                            <PositionListV2 theme={theme} data={elem}/>
                          </Box>
                        )
                      }
                      </List>
                  ) : (
                    <Typography sx={{ fontSize: '12px', color: 'var(--cream)' }}>No liquidity found</Typography>
                  )}
                </Box>
              )}
            </Box>
          }
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
