import React from 'react';
import { Box, List, ListItem, ListItemButton, Button, Typography, ListItemText } from '@mui/material';
import { IoSettingsOutline } from 'react-icons/io5';
import { useTheme } from '../ThemeContext';
import styles from './header.module.css';
import ThemeModeSwitch from '../ThemeModeSwitch/ThemeModeSwitch';
import ConnectWallet from '../ConnectWallet/ConnectWallet';
import { useRouter } from 'next/router';
import AppSettingsModal from '../AppSettingsModal/AppSettingsModal'; // Import the renamed component
import Link from 'next/link'; // Import Link from Next.js

const Header = () => {
  const [open, setOpen] = React.useState(false);
  const [openWallet, setOpenWallet] = React.useState(false);
  const { theme } = useTheme();
  const router = useRouter();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenWallet = () => setOpenWallet(true);
  const handleCloseWallet = () => setOpenWallet(false);

  return (
    <Box sx={{ bgcolor: '#173D3D' }} className={styles.header_desktop}>
      <Box className={styles.header_wrapper}>
        <Box className={styles.header_left}>
          <Box className={styles.brand_logo}>
            <Link href="/" passHref>
              <img src="/images/logo.png" alt="Brand Logo" />
            </Link>
          </Box>
          <List className='leftLinkList'>
            <ListItem disablePadding>
              <ListItemButton
                component="a"
                onClick={() => router.push('/')}
                sx={{ textDecoration: 'none' }} // Optional: Removes default link styling
              >
                <ListItemText primary="Trade" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component="a"
                onClick={() => router.push('/liquidity')}
                sx={{ textDecoration: 'none' }} // Optional: Removes default link styling
              >
                <ListItemText primary="liquidity" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
        <Box className={styles.header_right}>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleOpen}>
                <IoSettingsOutline style={{ width: '24px', height: '24px', color: 'var(--white)' }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <Button variant="contained" color="primary" onClick={handleOpenWallet}>
                Connect Wallet
              </Button>
            </ListItem>
          </List>
        </Box>
      </Box>

      <AppSettingsModal open={open} onClose={handleClose} />
      <ConnectWallet open={openWallet} onClose={handleCloseWallet} mode={theme} />
    </Box>
  );
};

export default Header;
