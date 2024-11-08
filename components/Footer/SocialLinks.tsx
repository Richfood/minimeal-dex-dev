// SocialLinks.tsx
import React from 'react';
import { Box, List, ListItem, Link } from '@mui/material';
import { FaXTwitter } from "react-icons/fa6";
import { PiTelegramLogo, PiGithubLogo } from "react-icons/pi";
import styles from './Footer.module.css';

const SocialLinks: React.FC = () => {
  return (
    <Box className='social_links'>
      <List>
        <ListItem disablePadding>
          <Link href="#" target="_blank" rel="noopener noreferrer">
            <FaXTwitter />
          </Link>
        </ListItem>
        <ListItem disablePadding>
          <Link href="#" target="_blank" rel="noopener noreferrer">
            <PiTelegramLogo />
          </Link>
        </ListItem>
        <ListItem disablePadding>
          <Link href="#" target="_blank" rel="noopener noreferrer">
            <PiGithubLogo />
          </Link>
        </ListItem>
      </List>
    </Box>
  );
};

export default SocialLinks;