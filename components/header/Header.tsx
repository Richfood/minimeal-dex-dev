import React from 'react';
import { Box, List, ListItem, ListItemButton, Button, Modal, Typography, ListItemText, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';
import Link from 'next/link';
import { IoSettingsOutline, IoCloseOutline } from 'react-icons/io5';
import { useTheme } from '../ThemeContext';
import styles from './header.module.css';
import ThemeModeSwitch from '../ThemeModeSwitch/ThemeModeSwitch';
import { BsQuestionCircle } from "react-icons/bs";
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch, { SwitchProps } from '@mui/material/Switch';



// Define the custom tooltip using styled
const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.mode === 'light' ? 'var(--primary)' : 'var(--white)',
    color: theme.palette.mode === 'light' ? 'var(--white)' : 'var(--primary)',
    boxShadow: theme.shadows[1],
    fontSize: 12,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: '#173D3D',
  },
}));

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

const Header = () => {
  const [open, setOpen] = React.useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    fontSize: '14px',
    fontWeight: '500',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: theme === 'light' ? 'var(--white)' : 'var(--primary)',
    boxShadow: 'rgba(0, 0, 0, 0.24) -40px 40px 80px -8px',
    borderRadius: '16px',
    color: theme === 'light' ? 'var(--primary)' : 'var(--white)',
  };

  return (
    <Box sx={{ bgcolor: '#173D3D' }} className={styles.header_desktop}>
      <Box className={styles.header_wrapper}>
        <Box className={styles.header_left}>
          <Box className={styles.brand_logo}>
            <Link href="/" passHref>
              <img src="/images/logo.png" alt="Brand Logo" />
            </Link>
          </Box>
          <List>
            <ListItem disablePadding>
              <ListItemButton component="a">
                <ListItemText primary="Swap" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a">
                <ListItemText primary="Pools" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
        <Box className={styles.header_right}>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleOpen} component="a">
                <IoSettingsOutline />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <Button variant="contained" color="primary">
                Connect Wallet
              </Button>
            </ListItem>
          </List>
        </Box>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed rgba(145, 158, 171, 0.7)', p: '24px', pb: '10px' }}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Settings
            </Typography>
            <Typography sx={{ position: 'absolute', right: '10px', top: '5px', lineHeight: 'normal',cursor: 'pointer' }}>
              <IoCloseOutline onClick={handleClose} size={24} />
            </Typography>
          </Box>

          <Box sx={{ p: '24px' }}>
            <Box>
              <Typography sx={{ fontSize: '14px', textTransform: 'uppercase', fontWeight: '600', mb: '15px' }}>
                GLOBAL
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '15px' }}>
              <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>
                Dark mode
              </Typography>
              <ThemeModeSwitch />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '16px', fontWeight: '600', display: 'flex', gap: '5px', alignItems: 'center' }}>
                Subgraph Health Indicator
                <CustomTooltip
                  title="Turn on subgraph health indicator all the time. Default is to show the indicator only when the network is delayed"
                  arrow
                  placement='top'
                >
                  <Typography component="span" sx={{ display: 'flex' }}>
                    <BsQuestionCircle />
                  </Typography>
                </CustomTooltip>
              </Typography>
              <FormControlLabel
                control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
                label=""
              />
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Header;
