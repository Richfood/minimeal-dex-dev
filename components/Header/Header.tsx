import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemButton, Button, Typography, ListItemText, Tooltip, IconButton, Menu, MenuItem, Drawer } from '@mui/material';
import { IoSettingsOutline, IoMenu } from 'react-icons/io5';
import { IoIosArrowDown } from 'react-icons/io';
import { useTheme } from '../ThemeContext';
import styles from './header.module.css';
import { useRouter } from 'next/router';
import AppSettingsModal from '../AppSettingsModal/AppSettingsModal';
import Link from 'next/link';
import Image from 'next/image';
import { metaMask, hooks } from '../ConnectWallet/connector';
import NetworkMenu from './account';
const { useChainId, useAccounts, useIsActive } = hooks;

const Header = () => {
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile menu
  const accounts = useAccounts();
  const isConnected = useAccounts();
  const chainId = useChainId();
  const { theme } = useTheme();
  const router = useRouter();
  const isActive = useIsActive();
  const [buttonText, setButtonText] = useState('Connect Wallet');
  const [isMainnet, setIsMainnet] = useState<boolean | null>(true);

  const handleOpenSettings = () => setOpenSettingsModal(true);
  const handleCloseSettings = () => setOpenSettingsModal(false);

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleToggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    const updateButtonText = async () => {
      if (typeof window === 'undefined') return;

      const domain = window.location.hostname;

      if (domain === 'dex.sunrewards.io') {
        setIsMainnet(true);
        if (isActive && chainId !== 369) {
          await metaMask.activate(369);
        }
      }

      if (accounts && accounts.length > 0 && isConnected) {
        const shortenedAddress = `${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`;
        setButtonText(shortenedAddress);
      } else {
        setButtonText('Connect Wallet');
      }
    };

    updateButtonText();
  }, [accounts, isConnected, chainId, isActive]);

  const handleClick = () => {
    if (isConnected) {
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

  const mobileMenuItems = [
    { text: 'Trade', onClick: () => router.push('/') },
    { text: 'Liquidity', onClick: () => router.push('/liquidity') },
  ];

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
              <ListItem sx={{ display: { md: 'block', xs: "none" } }} disablePadding>
                <ListItemButton
                  component="a"
                  onClick={() => router.push('/')}
                  sx={{ textDecoration: 'none' }}
                >
                  <ListItemText primary="Trade" />
                </ListItemButton>
              </ListItem>
              <ListItem sx={{ display: { md: 'block', xs: "none" } }} disablePadding>
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
              {/* <ListItem disablePadding>
                <ListItemButton sx={{ p: '5px' }} onClick={handleOpenSettings}>
                  <IoSettingsOutline style={{ width: '24px', height: '24px', color: '#fff' }} />
                </ListItemButton>
              </ListItem> */}

              <ListItem sx={{ display: { md: 'block', xs: 'none' } }} disablePadding>
                <Tooltip title="Account settings">
                  <IconButton
                    sx={{
                      borderRadius: '30px',
                      bgcolor: 'var(--secondary-dark)',
                      display: 'flex',
                      gap: '10px',
                      '&:hover': { bgcolor: 'var(--secondary-dark)' },
                      alignItems: 'center',
                    }}
                    size="small"
                    onClick={handleClickMenu}
                    aria-controls={openMenu ? 'network-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMenu ? 'true' : undefined}
                  >
                    <Image
                      src={networkImages['PulseChain']}
                      width={24}
                      height={24}
                      alt="Profile"
                    />
                    <Typography
                      sx={{
                        fontWeight: '700',
                        fontSize: '12px',
                        display: 'flex',
                        gap: '3px',
                        color: 'var(--white)',
                      }}
                    >
                      {(isMainnet ? 'PulseChain Mainnet' : (chainId === 943 ? 'PulseChain Testnet' : 'PulseChain Mainnet'))}
                      <IoIosArrowDown size={16} />
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
                isMainnet={isMainnet}
              />

              <ListItem sx={{ display: { md: 'block', xs: 'none' } }} disablePadding>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleClick}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    minWidth: '120px',
                    '@media (max-width: 899px)': {
                      padding: '6px 12px',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      ml: '5px',
                      fontSize: '1rem',
                      '@media (max-width: 899px)': {
                        fontSize: '0.85rem',
                      },
                    }}
                  >
                    {buttonText}
                  </Typography>
                </Button>
              </ListItem>

              <ListItem sx={{ display: { md: 'none', sm: 'block' } }} disablePadding >
                <IconButton onClick={handleToggleMobileMenu}>
                  <IoMenu style={{ color: '#fff', fontSize: '24px' }} />
                </IconButton>
              </ListItem>
            </List>
          </Box>
        </Box>

        <AppSettingsModal open={openSettingsModal} onClose={handleCloseSettings} />

        <Drawer anchor="right" open={mobileMenuOpen} onClose={handleToggleMobileMenu}>
          <Box sx={{ width: 250, px: '15px', height: '100%', py: '30px' }} role="presentation" onClick={handleToggleMobileMenu} onKeyDown={handleToggleMobileMenu}>
            <List sx={{ p: '0' }}>
              {mobileMenuItems.map((item) => (
                <ListItem sx={{ p: '0', mb: '15px' }} button key={item.text} onClick={item.onClick}>
                  <ListItemText sx={{ fontSize: '16px', fontWeight: "600" }} primary={item.text} />
                </ListItem>
              ))}
            </List>

            <NetworkMenu
              anchorEl={anchorEl}
              openMenu={openMenu}
              handleCloseMenu={handleCloseMenu}
              metaMask={metaMask}
              networkImages={networkImages}
              theme={theme}
              chainId={chainId}
              isMainnet={isMainnet}
            />

            <Tooltip title="Account settings">
              <IconButton
                sx={{
                  borderRadius: '30px',
                  width: '100%',
                  mb: '15px',
                  bgcolor: 'var(--secondary-dark)',
                  display: 'flex',
                  gap: '10px',
                  '&:hover': { bgcolor: 'var(--secondary-dark)' },
                  alignItems: 'center',
                }}
                size="small"
                onClick={handleClickMenu}
                aria-controls={openMenu ? 'network-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openMenu ? 'true' : undefined}
              >
                <Image
                  src={networkImages['PulseChain']}
                  width={24}
                  height={24}
                  alt="Profile"
                />
                <Typography
                  sx={{
                    fontWeight: '700',
                    fontSize: '12px',
                    display: 'flex',
                    gap: '3px',
                    color: 'var(--white)',
                  }}
                >
                  {(isMainnet ? 'PulseChain Mainnet' : (chainId === 943 ? 'PulseChain Testnet' : 'PulseChain Mainnet'))}
                  <IoIosArrowDown size={16} />
                </Typography>
              </IconButton>
            </Tooltip>

            <Button
              variant="contained"
              color="primary"
              onClick={handleClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 16px',
                borderRadius: '20px',
                width: '100%',
                minWidth: '120px',
                '@media (max-width: 899px)': {
                  padding: '6px 12px',
                },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  ml: '5px',
                  fontSize: '1rem',
                  '@media (max-width: 899px)': {
                    fontSize: '0.85rem',
                  },
                }}
              >
                {buttonText}
              </Typography>
            </Button>

          </Box>
        </Drawer>
      </Box>
    </>
  );
};

export default Header;