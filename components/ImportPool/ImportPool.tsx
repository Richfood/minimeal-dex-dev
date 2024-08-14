import React, { useCallback, useState } from 'react';
import { Box, Typography, Modal } from '@mui/material';
import { MdKeyboardBackspace } from 'react-icons/md';
import { IoCloseOutline } from 'react-icons/io5';
import { useTheme } from '../ThemeContext';
import SelectedToken from '../SelectToken/SelectedToken';
import { IoIosArrowDown } from 'react-icons/io';
import { HiPlus } from 'react-icons/hi2';

interface ImportPoolProps {
  open: boolean;
  onClose: () => void;
}

const ImportPool: React.FC<ImportPoolProps> = ({ open, onClose }) => {
  const { theme } = useTheme();
  const [openToken, setOpenToken] = useState(false);

  // Toggle token selection visibility
  const handleOpenToken = useCallback(() => setOpenToken(prev => !prev), []);
  const handleCloseToken = () => setOpenToken(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 400,
    width: 'calc(100% - 30px)',
    bgcolor: theme === 'light' ? 'var(--white)' : 'var(--primary)',
    boxShadow: 'rgba(0, 0, 0, 0.24) -40px 40px 80px -8px',
    borderRadius: '16px',
    color: theme === 'light' ? 'var(--primary)' : 'var(--white)',
   
  };

  // Function to handle closing the expert mode (if needed)
  const handleCloseExpert: React.MouseEventHandler<SVGElement> = (event) => {
    // Implement functionality here if needed
    console.log('Close Expert Mode');
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box className="modal_head" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <MdKeyboardBackspace onClick={onClose} size={24} style={{ cursor: 'pointer' }} />
              <Box>
                <Typography variant="h6" sx={{ lineHeight: 'normal', mb: '5px' }}>
                  Import Pool
                </Typography>
                <Typography sx={{ fontSize: "12px", width: '100%', color: 'var(--cream)' }}>
                  Import an existing pool
                </Typography>
              </Box>
            </Box>
            <IoCloseOutline onClick={handleCloseExpert} size={24} style={{ cursor: 'pointer' }} />
          </Box>
          <Box className="modal_body">
            <Box className="token-sec" sx={{flexDirection: 'column',gap: '15px'}}>
              <Box className="token-pair" onClick={handleOpenToken} sx={{ cursor: 'pointer',width: '100%', color: theme === 'light' ? 'var(--black)' : 'var(--white)', bgcolor: theme === 'light' ? 'var(--light_clr)' : 'var(--secondary-dark)' }}>
                <Box >
                  <Typography sx={{ fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>PLS</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IoIosArrowDown size={17} />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HiPlus size={20} />
              </Box>
              <Box onClick={handleOpenToken} className="token-pair" sx={{ width: '100%', color: theme === 'light' ? 'var(--black)' : 'var(--white)', bgcolor: theme === 'light' ? 'var(--light_clr)' : 'var(--secondary-dark)' }}>
                <Box >
                  <Typography sx={{ fontSize: '14px', fontWeight: '700' }}>PLS</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IoIosArrowDown size={17} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>

      <SelectedToken
        openToken={openToken}
        handleCloseToken={handleCloseToken}
        mode={theme} // Ensure `theme` is passed correctly
      />
    </>
  );
};

export default ImportPool;
