import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { ListItemButton } from '@mui/material';
import { IoSettingsOutline } from 'react-icons/io5';
import MenuIcon from '@mui/icons-material/Menu';
import Image from 'next/image';


const pages = ['Trade', 'Liquidity'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleToggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    // Implement your logic here
  };

  const handleOpenWallet = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Implement your logic here
  };

  return (
    <AppBar position="static" sx={{ px: '30px', background: 'var(--primary)', '@media (max-width: 900px)': { px: '0' } }}>
      <Container sx={{ maxWidth: '100% !important' }}>
        <Toolbar disableGutters>
        

          <Box sx={{ display: { xs: 'none', md: 'flex' },mr: 1 }}>
            <Image src="/images/logo.png" width={160} height={50} alt={'brandlogo'} />
          </Box>


          <Box sx={{  display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="open drawer"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleToggleDrawer}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={handleCloseDrawer}
            >
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={handleCloseDrawer}
                onKeyDown={handleCloseDrawer}
              >
                <List>
                  {pages.map((page) => (
                    <ListItem button key={page}>
                      <ListItemText primary={page} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>
          </Box>


          <Box sx={{ display: { xs: 'flex', md: 'none' },justifyContent: 'center', flexGrow: 1, }}>
            <Image src="/images/logo.png" width={160} height={50} alt={'brandlogo'} />
          </Box>


     
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <List sx={{ display: 'flex' }}>
              <ListItem disablePadding sx={{ width: 'unset' }}>
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
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
