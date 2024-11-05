import React, { useState, useEffect } from 'react';
import { Menu, MenuItem } from '@mui/material';
import Image from 'next/image';

interface NetworkMenuProps {
  anchorEl: HTMLElement | null;
  openMenu: boolean;
  handleCloseMenu: () => void;
  metaMask: any;
  networkImages: { [key: string]: string };
  theme: 'light' | 'dark';
  chainId: number | undefined;
  isMainnet: boolean;
}

export default function NetworkMenu({
  anchorEl,
  openMenu,
  handleCloseMenu,
  metaMask,
  networkImages,
  theme,
  chainId,
  isMainnet
}: NetworkMenuProps) {
  const [selectedChainId, setSelectedChainId] = useState<number | undefined>(undefined);

  // Fetch the currently connected network (if already connected)
  useEffect(() => {
    const currentChainId = chainId; // Call the hook to get the current chain ID
    setSelectedChainId(currentChainId);
  }, [chainId]); // Ensure the dependency array includes the chainId hook

  const handleNetworkSelect = async (chainId: number) => {
    try {
      await metaMask.activate(chainId);
      setSelectedChainId(chainId);
      handleCloseMenu(); // Close the menu after selection
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  return (
    <>
      {!isMainnet && (<Menu
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
        <MenuItem
          onClick={() => handleNetworkSelect(369)}
          disabled={selectedChainId === 369}
        >
          <Image src={networkImages.PulseChain} width={24} height={24} alt="Mainnet" /> Mainnet
        </MenuItem>
        <MenuItem
          onClick={() => handleNetworkSelect(943)}
          disabled={selectedChainId === 943}
        >
          <Image src={networkImages.PulseChain} width={24} height={24} alt="Testnet" /> Testnet
        </MenuItem>
      </Menu>)
      }
    </>
  );
}
