import React, { useState } from 'react';
import { Box, Typography, Modal, Tabs, Tab, List, ListItem } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import { IoCloseOutline } from 'react-icons/io5';
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import {  Pagination } from 'swiper/modules';

interface ConnectWalletProps {
    open: boolean;
    onClose: () => void;
    mode: 'light' | 'dark';
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ open, onClose, mode }) => {
    const [value, setValue] = React.useState('0');
    const [showAll, setShowAll] = useState(false);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const toggleClass = () => {
        setShowAll(!showAll);
    };

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        fontSize: '14px',
        fontWeight: '500',
        transform: 'translate(-50%, -50%)',
        maxWidth: 800,
        width: 'calc(100% - 30px)',
        bgcolor: mode === 'light' ? 'var(--white)' : 'var(--primary)',
        boxShadow: 'rgba(0, 0, 0, 0.24) -40px 40px 80px -8px',
        borderRadius: '16px',
        color: mode === 'light' ? 'var(--primary)' : 'var(--white)',
        maxHeight: '90vh',
    };

    const walletListItems = Array.from({ length: 12 }, (_, index) => (
        <ListItem key={index} disablePadding>
            <img src="/images/metamask.png" alt="metamask" />
            <Box>
                <Typography sx={{ fontSize: '12px', mt: '10px' }}>Metamask</Typography>
            </Box>
        </ListItem>
    ));

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="connect-wallet-modal-title"
            aria-describedby="connect-wallet-modal-description"
        >
            <Box sx={style}>
                <Box className="modal_body connect_modal" sx={{ px: 0 }}>
                    <TabContext value={value}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="connect-wallet-tabs"
                            className='wallet_tabs'
                            sx={{ border: 'unset' }}
                        >
                            <Tab sx={{ background: mode === 'light' ? 'var(--light)' : 'var(--primary)' }} label="Connect Wallet" value="0" />
                            <Tab sx={{ background: mode === 'light' ? 'var(--light)' : 'var(--primary)' }} label="What's a Web3 Wallet?" value="1" />
                        </Tabs>
                        <TabPanel sx={{ p: '0' }} value="0">
                            <Box className="connectWallet">
                                <Box className="connectWalletLeft" sx={{ background: 'var(--white)' }}>
                                    <Box>
                                        <Typography sx={{ fontSize: '18px', fontWeight: '700', mb: '15px' }}>Connect Wallet</Typography>
                                        <Typography>Start by connecting with one of the wallets below. Be sure to store your private keys or seed phrase securely. Never share them with anyone.</Typography>
                                    </Box>
                                    <Box>
                                        <List className={`${showAll ? 'active connectWalletList' : 'connectWalletList'}`}>
                                            {walletListItems.slice(0, showAll ? walletListItems.length : 5)}
                                            {!showAll && (
                                                <ListItem className='more-btn' onClick={toggleClass} disablePadding>
                                                    <Box className="w-50">
                                                        <BiDotsHorizontalRounded />
                                                    </Box>
                                                    <Box>
                                                        <Typography sx={{ fontSize: '12px', mt: '10px' }}>More</Typography>
                                                    </Box>
                                                </ListItem>
                                            )}
                                        </List>
                                    </Box>
                                </Box>
                                <Box className="connectWalletRight">
                                    {/* Additional content */}
                                </Box>
                            </Box>
                        </TabPanel>
                        <TabPanel value="1">
                            <Box className="Web3Wallet" >
                                <Swiper
                                    modules={[ Pagination]}
                                    pagination={{ clickable: true }}
                                    className="mySwiper"
                                >
                                    <SwiperSlide>
                                        <Box className="walletSlider">
                                            <Box className="SliderTitle">
                                                <Typography>Your first step in the DeFi world</Typography>
                                            </Box>
                                            <Box className="SliderImg">
                                                <img src="/images/wallet_intro.png" alt="wallet_intro" />
                                            </Box>

                                            <Box className="walletDesc">
                                                <Typography>A Web3 Wallet allows you to send and receive crypto assets like bitcoin, BNB, ETH, NFTs and much more.</Typography>
                                            </Box>
                                        </Box>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <Box className="walletSlider">
                                            <Box className="SliderTitle">
                                                <Typography>Login using a wallet connection</Typography>
                                            </Box>
                                            <Box className="SliderImg">
                                                <img src="/images/world_lock.png" alt="world_lock" />
                                            </Box>

                                            <Box className="walletDesc">
                                                <Typography>Instead of setting up new accounts and passwords for every website, simply set up your wallet in one go, and connect it to your favorite DApps.</Typography>
                                            </Box>
                                        </Box>
                                    </SwiperSlide>
                                </Swiper>
                            </Box>
                        </TabPanel>
                    </TabContext>
                </Box>
            </Box>
        </Modal>
    );
};

export default ConnectWallet;
