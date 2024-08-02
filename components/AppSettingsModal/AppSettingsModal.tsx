// components/AppSettingsModal.tsx
import React from 'react';
import { Box, Typography, Modal, FormControlLabel } from '@mui/material';
import { IoCloseOutline } from 'react-icons/io5';
import { BsQuestionCircle } from 'react-icons/bs';
import { useTheme } from '../ThemeContext';
import ThemeModeSwitch from '../ThemeModeSwitch/ThemeModeSwitch';
import CustomTooltip from '../CustomTooltip/CustomTooltip'; // Import the custom tooltip if defined separately
import IOSSwitch from '../IOSSwitch/IOSSwitch'; // Import the custom switch if defined separately

interface AppSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const AppSettingsModal: React.FC<AppSettingsModalProps> = ({ open, onClose }) => {
  const { theme } = useTheme();

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
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="settings-modal-title"
      aria-describedby="settings-modal-description"
    >
      <Box sx={style}>
        <Box className="modal_head">
          <Typography variant="h6">
             Settings
          </Typography>
          <Typography sx={{ position: 'absolute', right: '10px', top: '5px', lineHeight: 'normal', cursor: 'pointer' }}>
            <IoCloseOutline onClick={onClose} size={24} />
          </Typography>
        </Box>

        <Box sx={{ p: '24px' }}>
          <Typography sx={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: '600', mb: '15px', color: 'var(--cream)', letterSpacing: '1px' }}>
            GLOBAL
          </Typography>

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
  );
};

export default AppSettingsModal;
