import { Box, List, ListItem, ListItemButton, ListItemText ,Button} from '@mui/material'
import Link from 'next/link'
import React from 'react'
import styles from './header.module.css'
import { GrLanguage } from "react-icons/gr";
import { IoSettingsOutline } from "react-icons/io5";

const Header = () => {
  return (
    <Box sx={{ bgcolor: '#173D3D' }} className={styles.header_desktop}>
      <Box className={styles.header_wrapper}>
        <Box className={styles.header_left}>
          <Box className={styles.brand_logo}>
            <Link href="/" passHref>
              <img src="/images/logo.png" alt="Brand Logo"  />
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
            {/* <ListItem disablePadding>
              <ListItemButton component="a">
                <ListItemText primary="Stats & Graphs" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a">
                <ListItemText primary="Staking" />
              </ListItemButton>
            </ListItem> */}
          </List>
        </Box>
        <Box className={styles.header_right}>
          <List>
            {/* <ListItem disablePadding>
              <ListItemButton component="a">
                <GrLanguage />
              </ListItemButton>
            </ListItem> */}
            <ListItem disablePadding>
              <ListItemButton component="a">
                <IoSettingsOutline />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              
               <Button variant="contained" color='primary'>Connect Wallet</Button>
             
            </ListItem>
           
          </List>
        </Box>
      </Box>
    </Box>
  )
}

export default Header
