import React, { useCallback, useEffect } from 'react';
import { Box, List, ListItem, ListItemButton, Button, Typography, ListItemText, Tooltip, IconButton, Menu, MenuItem } from '@mui/material';
import { IoSettingsOutline } from 'react-icons/io5';
import { IoIosArrowDown } from 'react-icons/io';
import { useTheme } from '../ThemeContext';
import styles from './header.module.css';
import { useRouter } from 'next/router';
import AppSettingsModal from '../AppSettingsModal/AppSettingsModal';
import Link from 'next/link';
import Image from 'next/image';
import { metaMask, hooks } from '../ConnectWallet/connector';
import NetworkMenu from './account';
const { useChainId, useAccounts, useProvider } = hooks;

const Header = () => {
  const [openSettingsModal, setOpenSettingsModal] = React.useState(false);
  // const [openWallet, setOpenWallet] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const accounts = useAccounts();
  const isConnected = useAccounts();
  const chainId = useChainId();
  const { theme } = useTheme();
  const router = useRouter();
  const [buttonText, setButtonText] = React.useState('Connect Wallet'); // Single useState

  const handleOpenSettings = () => setOpenSettingsModal(true);
  const handleCloseSettings = () => setOpenSettingsModal(false);

  // const handleOpenWallet = () => setOpenWallet(true);
  // const handleCloseWallet = () => setOpenWallet(false);

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };


  useEffect(() => {
    const updateButtonText = () => {
      if (accounts && accounts.length > 0 && isConnected) {
        const shortenedAddress = `${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`;
        setButtonText(shortenedAddress); // Update with shortened address
      } else {
        setButtonText('Connect Wallet');
      }
    };

    updateButtonText();
  }, [accounts, isConnected]);


  const handleClick = () => {
    if (isConnected) {
      console.log("🚀 ~ handleClick ~ isConnected:", isConnected);

      // Check if deactivate is available before calling it
      if (metaMask.deactivate) {
        metaMask.deactivate?.();
      } else {
        metaMask.resetState();
      }
    } else {
      metaMask.activate();
    }
  };

  const openMenu = Boolean(anchorEl);

  // Network images
  const networkImages = {
    PulseChain: '/images/pls.png',
    BASE: '/images/base.png',
  };

  return (
    <>
      <Box sx={{ bgcolor: '#173D3D' }} className={styles.header_desktop}>
        <Box className={styles.header_wrapper}>
          <Box className={styles.header_left}>
            <Box className={styles.brand_logo}>
              <Link href="/" passHref>
                <Image src="/images/logo.png" alt="Brand Logo" width={100} height={50} />
              </Link>
            </Box>
            <List className='leftLinkList'>
              <ListItem disablePadding>
                <ListItemButton
                  component="a"
                  onClick={() => router.push('/')}
                  sx={{ textDecoration: 'none' }}
                >
                  <ListItemText primary="Trade" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component="a"
                  onClick={() => router.push('/liquidity')}
                  sx={{ textDecoration: 'none' }}
                >
                  <ListItemText primary="Liquidity" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>

          <Box className={styles.header_right}>
            <List>
              <ListItem disablePadding>
                <ListItemButton sx={{ p: '5px' }} onClick={handleOpenSettings}>
                  <IoSettingsOutline style={{ width: '24px', height: '24px', color: '#fff' }} />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <Tooltip title="Account settings">
                  <IconButton
                    sx={{ borderRadius: '30px', bgcolor: 'var(--secondary-dark)', display: 'flex', gap: '10px', '&:hover': { bgcolor: 'var(--secondary-dark)' }, alignItems: 'center' }}
                    size="small"
                    onClick={handleClickMenu}
                    aria-controls={openMenu ? 'network-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMenu ? 'true' : undefined}
                  >
                    <Image src={networkImages['PulseChain']} width={24} height={24} alt="Profile" />
                    <Typography sx={{ fontWeight: '700', fontSize: '12px', display: 'flex', gap: '3px', color: 'var(--white)' }}>
                      PulseChain<IoIosArrowDown size={16} />
                    </Typography>
                  </IconButton>
                </Tooltip>
              </ListItem>

              <NetworkMenu
                anchorEl={anchorEl}
                openMenu={openMenu}
                handleCloseMenu={handleCloseMenu}
                metaMask={metaMask}
                networkImages={networkImages}
                theme={theme}
                chainId={chainId}
              />

              <ListItem disablePadding>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleClick}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    '& .MuiTypography-root': {
                      fontWeight: 700,
                      ml: '3px',
                      '@media (max-width: 899px)': {
                        display: 'none',
                      },
                    },
                  }}
                >
                  <Typography>{buttonText}</Typography>
                </Button>
              </ListItem>
            </List>
          </Box>
        </Box>

        <AppSettingsModal open={openSettingsModal} onClose={handleCloseSettings} />
      </Box>
    </>
  );
};

export default Header;
