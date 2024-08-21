import React from 'react';
import { Box, List, ListItem, ListItemButton, Button, Typography, ListItemText, Tooltip, IconButton, Menu, MenuItem } from '@mui/material';
import { IoSettingsOutline } from 'react-icons/io5';
import { IoIosArrowDown } from 'react-icons/io';
import { useTheme } from '../ThemeContext';
import styles from './header.module.css';
import ConnectWallet from '../ConnectWallet/ConnectWallet';
import { useRouter } from 'next/router';
import AppSettingsModal from '../AppSettingsModal/AppSettingsModal';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  const [openSettingsModal, setOpenSettingsModal] = React.useState(false);
  const [openWallet, setOpenWallet] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedNetwork, setSelectedNetwork] = React.useState('PulseChain');
  const { theme } = useTheme();
  const router = useRouter();

  const handleOpenSettings = () => setOpenSettingsModal(true);
  const handleCloseSettings = () => setOpenSettingsModal(false);

  const handleOpenWallet = () => setOpenWallet(true);
  const handleCloseWallet = () => setOpenWallet(false);

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleChangeNetwork = (network: string) => {
    setSelectedNetwork(network);
    handleCloseMenu();
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
                    <Image src={networkImages[selectedNetwork]} width={24} height={24} alt="Profile" />
                    <Typography sx={{ fontWeight: '700', fontSize: '12px', display: 'flex', gap: '3px', color: 'var(--white)' }}>
                      {selectedNetwork} <IoIosArrowDown size={16} />
                    </Typography>
                  </IconButton>
                </Tooltip>
              </ListItem>

              <Menu
                anchorEl={anchorEl}
                id="network-menu"
                open={openMenu}
                onClose={handleCloseMenu}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    bgcolor: theme === 'light' ? 'var(--white)' : 'var(--secondary-dark)',
                    color: theme === 'light' ? 'var(--black)' : 'var(--white)',
                    borderRadius: '8px',
                    '& .MuiMenuItem-root': {
                      fontSize: '12px',
                      fontWeight: '700',
                      gap: '10px',
                      color: theme === 'light' ? 'var(--black)' : 'var(--white)',
                    },
                    '&::before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: theme === 'light' ? 'var(--white)' : 'var(--secondary-dark)',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={() => handleChangeNetwork('PulseChain')}>
                  <Image src={networkImages.PulseChain} width={24} height={24} alt="PulseChain" /> PulseChain
                </MenuItem>
                <MenuItem onClick={() => handleChangeNetwork('BASE')}>
                  <Image src={networkImages.BASE} width={24} height={24} alt="BASE" /> BASE
                </MenuItem>
              </Menu>

              <ListItem disablePadding>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenWallet}
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
                  Connect <Typography>Wallet</Typography>
                </Button>
              </ListItem>
            </List>
          </Box>
        </Box>

        <AppSettingsModal open={openSettingsModal} onClose={handleCloseSettings} />
        <ConnectWallet open={openWallet} onClose={handleCloseWallet} mode={theme} />
      </Box>
    </>
  );
};

export default Header;
