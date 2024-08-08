import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Image from 'next/image';
import { IoCloseOutline } from 'react-icons/io5';
import { BsQuestionCircle } from 'react-icons/bs';
import { LiaExchangeAltSolid } from 'react-icons/lia';
import { SlGraph } from 'react-icons/sl';
import CustomCheckbox from '../Customcheckbox/Customcheckbox';
import { useTheme } from '../ThemeContext';
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { List, ListItem } from '@mui/material';
import IOSSwitch from '../IOSSwitch/IOSSwitch';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import ThemeModeSwitch from '../ThemeModeSwitch/ThemeModeSwitch';
import InputAdornment from '@mui/material/InputAdornment';


const RoiCalculator = ({ open, handleClose }) => {

    // State to manage edit mode
    const [isEditing, setIsEditing] = useState(false);
    // State to manage balance value
    const [balance, setBalance] = useState('$0.000036158');

    // Toggle edit mode
    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    // Handle balance change
    const handleBalanceChange = () => {
        setBalance(event.target.value);
    };

    // Handle reset (if needed)
    const handleResetClick = () => {
        setIsEditing(false);
        // Optionally reset the balance to its original value
        setBalance('$0.000036158');
    };


    const [active, setActive] = useState(0);
    const [timeInterval, setTimeInterval] = useState('24Hours');
    const [stakedTime, setStakedTime] = useState('1D');
    const [disableTime, setDisableTime] = useState(false);
    const [compoundingTime, setCompoundingTime] = useState('12H');
    const [toggleClass, setToggleClass] = useState(false);
    const [activeSwitch, setActiveSwitch] = useState(false);

    const switchActive = () => {
        setActiveSwitch(!activeSwitch)
    }


    const handletoggle = () => {
        setToggleClass(!toggleClass);
    }


    const handleStakeTime = (index) => {
        setStakedTime(index);
    };

    const handleClickInterval = (index) => {
        setTimeInterval(index);
    };

    const handleCompounding = (time) => {
        if (!disableTime) {
            setCompoundingTime(time);
        }
    };

    const handleCheckboxChange = () => {
        setDisableTime(prev => !prev);
    };

    const handleClick = (index) => {
        setActive(index);
    };

    const { theme } = useTheme();

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        fontSize: '14px',
        fontWeight: '500',
        transform: 'translate(-50%, -50%)',
        maxWidth: 900,
        width: 'calc(100% - 30px)',
        bgcolor: theme === 'light' ? 'var(--white)' : 'var(--primary)',
        boxShadow: 'rgba(0, 0, 0, 0.24) -40px 40px 80px -8px',
        borderRadius: '14px',
        color: theme === 'light' ? 'var(--primary)' : 'var(--white)',
        maxHeight: '80vh',
        overflowY: 'hidden',
        border: 'unset'
    };

    return (
        <Modal
            open={true}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style} className={`${toggleClass ? 'active' : ''} roiCalculator`}>
                <Box className="modal_head">
                    <Typography variant="h6" >ROI Calculator</Typography>
                    <Typography
                        sx={{ position: 'absolute', right: '10px', top: '5px', lineHeight: 'normal', cursor: 'pointer' }}
                        aria-label="Close"
                    >
                        <IoCloseOutline onClick={handleClose} size={24} />
                    </Typography>
                </Box>
                <Box className="modal_body">
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ mb: '15px' }}>
                                    <Typography className='mainTitle' variant='h6' sx={{ mb: '15px' }}>
                                        Deposit Amount
                                    </Typography>
                                    <Box className="SwapWidgetInner" sx={{ mb: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column', gap: '15px' }}>
                                        <Box className="inputBox" sx={{ width: '100%' }}>
                                            <Box className="inputField" sx={{ pr: '45px !important', position: 'relative' }}>
                                                <input type="number" placeholder='0.0' style={{ textAlign: 'end' }} />
                                                <Typography component="span" sx={{ position: 'absolute', right: '10px', color: 'var(--cream)', fontWeight: '600' }}>
                                                    USD
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box className="daBtnOuter" sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            <Button
                                                className={active === 0 ? 'active' : ''}
                                                onClick={() => handleClick(0)}
                                            >
                                                $100
                                            </Button>
                                            <Button
                                                className={active === 1 ? 'active' : ''}
                                                onClick={() => handleClick(1)}
                                            >
                                                $1000
                                            </Button>
                                            <Button
                                                className={active === 2 ? 'active' : ''}
                                                onClick={() => handleClick(2)}
                                            >
                                                MAX
                                            </Button>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Tooltip
                                                    title="Turn on subgraph health indicator all the time. Default is to show the indicator only when the network is delayed"
                                                    arrow
                                                    placement="top"
                                                >
                                                    <BsQuestionCircle />
                                                </Tooltip>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box className="daBox">
                                        <Box className="free_tier" sx={{ bgcolor: theme === 'light' ? 'var(--gray)' : 'var(--secondary-dark)', textAlign: 'center' }}>
                                            <Box>
                                                <Box sx={{ display: "flex", alignItems: 'center', justifyContent: "space-between", mb: '15px' }}>
                                                    <Box sx={{ display: "flex", alignItems: 'center', gap: '10px' }}>
                                                        <Image src="/images/pls.png" width={30} height={30} />
                                                        <Typography component="span">PLS</Typography>
                                                    </Box>
                                                    <Box sx={{ display: "flex", alignItems: 'center', gap: '10px' }}>
                                                        <Typography component="span" sx={{ fontWeight: '600' }}>0</Typography>
                                                    </Box>
                                                </Box>
                                                <Box sx={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }}>
                                                    <Box sx={{ display: "flex", alignItems: 'center', gap: '10px' }}>
                                                        <Image src="/images/9mm.png" width={30} height={30} />
                                                        <Typography component="span">9MM</Typography>
                                                    </Box>
                                                    <Box sx={{ display: "flex", alignItems: 'center', gap: '10px' }}>
                                                        <Typography component="span" sx={{ fontWeight: '600' }}>0</Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>

                                <Box className="historyPrice">
                                    <Typography className='mainTitle' variant='h6' sx={{ mb: '15px' }}>
                                        History price
                                    </Typography>

                                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: "end", mb: "15px", width: '100%' }}>
                                        <Typography sx={{
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            color: 'var(--cream)',
                                            textAlign: 'end'
                                        }}>View prices in</Typography>
                                        <Typography
                                            className='pickData'
                                            component="span"
                                            sx={{
                                                border: `1px solid ${theme === 'light' ? 'var(--primary)' : 'var(--cream)'}`,
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                p: '5px 7px',
                                                display: 'flex',
                                                gap: '10px',
                                                borderRadius: '30px',
                                                cursor: 'pointer',
                                                color: theme === 'light' ? 'var(--primary)' : 'var(--cream)'
                                            }}>
                                            <LiaExchangeAltSolid size={20} />
                                            PLS
                                        </Typography>
                                    </Box>

                                    <Box className="toolbar-button">
                                        <Button className={timeInterval === '24Hours' ? 'active' : ''} onClick={() => handleClickInterval('24Hours')}>24h</Button>
                                        <Button className={timeInterval === '1Week' ? 'active' : ''} onClick={() => handleClickInterval('1Week')}>1w</Button>
                                        <Button className={timeInterval === '1Month' ? 'active' : ''} onClick={() => handleClickInterval('1Month')}>1m</Button>
                                        <Button className={timeInterval === '1Year' ? 'active' : ''} onClick={() => handleClickInterval('1Year')}>1y</Button>
                                    </Box>

                                    <Box sx={{ minHeight: '200px' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Box sx={{ textAlign: 'center', minHeight: '200px', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                                                <SlGraph size={50} />
                                                <Typography sx={{ fontSize: '18px', fontWeight: '600' }}>Price will appear here</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ mb: '15px' }}>
                                    <Typography className='mainTitle' variant='h6' sx={{ mb: '15px' }}>
                                        Staked for
                                    </Typography>
                                    <Box className="toolbar-button" sx={{ width: '100%' }}>
                                        <Button sx={{ width: '20%' }} className={stakedTime === '1D' ? 'active' : ''} onClick={() => handleStakeTime('1D')}>1D</Button>
                                        <Button sx={{ width: '20%' }} className={stakedTime === '2W' ? 'active' : ''} onClick={() => handleStakeTime('2W')}>2W</Button>
                                        <Button sx={{ width: '20%' }} className={stakedTime === '30D' ? 'active' : ''} onClick={() => handleStakeTime('30D')}>30D</Button>
                                        <Button sx={{ width: '20%' }} className={stakedTime === '1Y' ? 'active' : ''} onClick={() => handleStakeTime('1Y')}>1Y</Button>
                                        <Button sx={{ width: '20%' }} className={stakedTime === '5Y' ? 'active' : ''} onClick={() => handleStakeTime('5Y')}>5Y</Button>
                                    </Box>
                                </Box>

                                <Box sx={{ mb: '15px' }}>
                                    <Typography className='mainTitle' variant='h6' sx={{ mb: '15px' }}>
                                        Compounding every
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <CustomCheckbox onChange={handleCheckboxChange} checked={disableTime} />
                                        <Box className="toolbar-button" sx={{ width: '100%' }}>
                                            <Button
                                                sx={{ width: '25%' }}
                                                className={compoundingTime === '12H' ? 'active' : ''}
                                                onClick={() => handleCompounding('12H')}
                                                disabled={disableTime}
                                            >
                                                12H
                                            </Button>
                                            <Button
                                                sx={{ width: '25%' }}
                                                className={compoundingTime === '1D' ? 'active' : ''}
                                                onClick={() => handleCompounding('1D')}
                                                disabled={disableTime}
                                            >
                                                1D
                                            </Button>
                                            <Button
                                                sx={{ width: '25%' }}
                                                className={compoundingTime === '2W' ? 'active' : ''}
                                                onClick={() => handleCompounding('2W')}
                                                disabled={disableTime}
                                            >
                                                2W
                                            </Button>
                                            <Button
                                                sx={{ width: '25%' }}
                                                className={compoundingTime === '30D' ? 'active' : ''}
                                                onClick={() => handleCompounding('30D')}
                                                disabled={disableTime}
                                            >
                                                30D
                                            </Button>
                                        </Box>

                                    </Box>
                                </Box>


                                <Box sx={{ mb: '15px' }}>
                                    <Typography className='mainTitle' variant='h6' sx={{ mb: '15px' }}>
                                        Set price range
                                    </Typography>
                                    <Box sx={{ minHeight: '200px' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Box sx={{ textAlign: 'center', minHeight: '200px', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                                                <SlGraph size={50} />
                                                <Typography sx={{ fontSize: '18px', fontWeight: '600' }}>Price will appear here</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: "end", mb: "15px", width: '100%' }}>
                                        <Typography sx={{
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            color: 'var(--cream)',
                                            textAlign: 'end'
                                        }}>View prices in</Typography>
                                        <Typography
                                            className='pickData'
                                            component="span"
                                            sx={{
                                                border: `1px solid ${theme === 'light' ? 'var(--primary)' : 'var(--cream)'}`,
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                p: '5px 7px',
                                                display: 'flex',
                                                gap: '10px',
                                                borderRadius: '30px',
                                                cursor: 'pointer',
                                                color: theme === 'light' ? 'var(--primary)' : 'var(--cream)'
                                            }}>
                                            <LiaExchangeAltSolid size={20} />
                                            PLS
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: '15px', justifyContent: 'space-between', mb: '15px' }}>

                                        {/* free_tier */}
                                        <Box className="free_tier" sx={{ bgcolor: theme === 'light' ? 'var(--gray)' : 'var(--secondary-dark)', width: '50%', textAlign: 'center' }}>
                                            <Typography sx={{ fontWeight: '600' }}>Min Price</Typography>

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box><FaMinus /></Box>
                                                <Box className="inputBox" sx={{ width: '100%', my: '15px' }}>
                                                    <input type="number" placeholder="0.0" style={{ textAlign: 'center' }} />
                                                </Box>
                                                <Box><FaPlus /></Box>
                                            </Box>

                                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                                                <Typography sx={{ fontWeight: '600' }}>9MM</Typography>
                                                <Typography sx={{ fontWeight: '600' }}>Per</Typography>
                                                <Typography sx={{ fontWeight: '600' }}>PLS</Typography>
                                            </Box>

                                        </Box>
                                        {/* free_tier */}

                                        <Box className="free_tier" sx={{ bgcolor: theme === 'light' ? 'var(--gray)' : 'var(--secondary-dark)', width: '50%', textAlign: 'center' }}>
                                            <Typography sx={{ fontWeight: '600' }}>Max Price</Typography>

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box><FaMinus /></Box>
                                                <Box className="inputBox" sx={{ width: '100%', my: '15px' }}>
                                                    <input type="number" placeholder="0.0" style={{ textAlign: 'center' }} />
                                                </Box>
                                                <Box><FaPlus /></Box>
                                            </Box>

                                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                                                <Typography sx={{ fontWeight: '600' }}>9MM</Typography>
                                                <Typography sx={{ fontWeight: '600' }}>Per</Typography>
                                                <Typography sx={{ fontWeight: '600' }}>PLS</Typography>
                                            </Box>
                                        </Box>
                                        {/* free_tier */}
                                    </Box>

                                    <Box>

                                        <Box sx={{
                                            width: '100%',
                                            border: `1px solid ${theme === 'light' ? 'var(--primary)' : 'var(--cream)'}`,
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            p: '5px 7px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            gap: '10px',
                                            borderRadius: '30px',
                                            cursor: 'pointer',
                                            color: theme === 'light' ? 'var(--primary)' : 'var(--cream)'
                                        }}>
                                            Full Range
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                        <Box sx={{ bgcolor: theme === 'light' ? 'var(--gray)' : 'var(--secondary-dark)', p: '16px', borderRadius: '16px' }}>
                            <Box>
                                <Box sx={{ mb: '15px' }}>
                                    <Typography variant="h6" className='mainTitle'>Calculate impermanent loss</Typography>
                                </Box>
                                <Box onClick={switchActive}>
                                    <IOSSwitch />
                                </Box>
                                <Box className={`${activeSwitch ? 'active' : ''} switchData `}>
                                    <Grid container spacing={0} sx={{ mt: '15px' }}>
                                        <Grid item xs={6}>
                                            <Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: '15px' }}>
                                                    <Box>
                                                        <Typography variant="h6" className='mainTitle'>Entry Price</Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <Typography onClick={handleEditClick} className='commonBadge' sx={{ cursor: 'pointer' }}>
                                                            {isEditing ? 'Save' : 'Edit'}
                                                        </Typography>
                                                        <Typography onClick={handleResetClick} className='commonBadge' sx={{ cursor: 'pointer' }}>
                                                            Reset
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Box className="daBox" sx={{ border: '1px solid var(--cream)', borderRadius: '8px', boxShadow: 'var(--cream) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px' }}>
                                                    <Box className="free_tier" sx={{ bgcolor: theme === 'light' ? 'var(--gray)' : 'var(--secondary-dark)', textAlign: 'center', p: '0 !important' }}>
                                                        <TableContainer>
                                                            <Table>
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell>
                                                                            <Typography variant="h6" className='mainTitle'>Asset</Typography>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Typography variant="h6" className='mainTitle'>Price</Typography>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Typography variant="h6" className='mainTitle'>Balance</Typography>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Typography variant="h6" className='mainTitle'>Value</Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    <TableRow>
                                                                        <TableCell>
                                                                            <Box sx={{ display: "flex", alignItems: 'center', gap: '10px' }}>
                                                                                <Image src="/images/pls.png" width={30} height={30} />
                                                                                <Typography component="span">PLS</Typography>
                                                                            </Box>
                                                                        </TableCell>

                                                                        <TableCell>
                                                                            {isEditing ? (
                                                                                <TextField
                                                                                    className='editBal'
                                                                                    value={balance}
                                                                                    onChange={handleBalanceChange}
                                                                                    size="small"
                                                                                    sx={{ p: '0', fontSize: '14px', minHeight: 'unset', fontWeight: '600' }}
                                                                                />
                                                                            ) : (
                                                                                <Typography component="span" sx={{ fontWeight: '600' }}>{balance}</Typography>
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Typography component="span" sx={{ fontWeight: '600' }}>1.41M</Typography>
                                                                        </TableCell>

                                                                        <TableCell>
                                                                            <Typography component="span" sx={{ fontWeight: '600' }}>$50.81</Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell>
                                                                            <Box sx={{ display: "flex", alignItems: 'center', gap: '10px' }}>
                                                                                <Image src="/images/pls.png" width={30} height={30} />
                                                                                <Typography component="span">PLS</Typography>
                                                                            </Box>
                                                                        </TableCell>

                                                                        <TableCell>
                                                                            {isEditing ? (
                                                                                <TextField
                                                                                    InputProps={{
                                                                                        startAdornment: <InputAdornment position="start">kg</InputAdornment>,
                                                                                    }}
                                                                                    className='editBal'
                                                                                    value={balance}
                                                                                    onChange={handleBalanceChange}
                                                                                    size="small"
                                                                                    sx={{ p: '0', fontSize: '14px', minHeight: 'unset', fontWeight: '600' }}
                                                                                />
                                                                            ) : (
                                                                                <Typography component="span" sx={{ fontWeight: '600' }}>{balance}</Typography>
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Typography component="span" sx={{ fontWeight: '600' }}>1.41M</Typography>
                                                                        </TableCell>

                                                                        <TableCell>
                                                                            <Typography component="span" sx={{ fontWeight: '600' }}>$50.81</Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    </Box>
                                                </Box>
                                            </Box>


                                            <Box sx={{ mt: '30px' }}>
                                                <Typography variant="h6" className='mainTitle'>Projected results</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center', my: '15px' }}>
                                                <Box>
                                                    <Typography variant="h6">100$ <Typography component="span" sx={{ color: '#11c711' }}>(0%)</Typography></Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>

                                                    <Box><Typography className='commonBadge' sx={{ cursor: 'pointer' }}>HOLD  Tokens</Typography></Box>
                                                </Box>
                                            </Box>

                                        <Box className="daBox" sx={{ border: '1px solid var(--cream)', borderRadius: '8px', boxShadow: 'var(--cream) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px' }}>
                                                    <Box className="free_tier" sx={{ bgcolor: theme === 'light' ? 'var(--gray)' : 'var(--secondary-dark)', textAlign: 'center', p: '0 !important' }}>
                                                        <TableContainer>
                                                            <Table>
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell>
                                                                            <Typography variant="h6" className='mainTitle'>Asset</Typography>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Typography variant="h6" className='mainTitle'>Price</Typography>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Typography variant="h6" className='mainTitle'>Balance</Typography>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Typography variant="h6" className='mainTitle'>Value</Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    <TableRow>
                                                                        <TableCell>
                                                                            <Box sx={{ display: "flex", alignItems: 'center', gap: '10px' }}>
                                                                                <Image src="/images/pls.png" width={30} height={30} />
                                                                                <Typography component="span">PLS</Typography>
                                                                            </Box>
                                                                        </TableCell>

                                                                        <TableCell>
                                                                            {isEditing ? (
                                                                                <TextField
                                                                                    className='editBal'
                                                                                    value={balance}
                                                                                    onChange={handleBalanceChange}
                                                                                    size="small"
                                                                                    sx={{ p: '0', fontSize: '14px', minHeight: 'unset', fontWeight: '600' }}
                                                                                />
                                                                            ) : (
                                                                                <Typography component="span" sx={{ fontWeight: '600' }}>{balance}</Typography>
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Typography component="span" sx={{ fontWeight: '600' }}>1.41M</Typography>
                                                                        </TableCell>

                                                                        <TableCell>
                                                                            <Typography component="span" sx={{ fontWeight: '600' }}>$50.81</Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell>
                                                                            <Box sx={{ display: "flex", alignItems: 'center', gap: '10px' }}>
                                                                                <Image src="/images/pls.png" width={30} height={30} />
                                                                                <Typography component="span">PLS</Typography>
                                                                            </Box>
                                                                        </TableCell>

                                                                        <TableCell>
                                                                            {isEditing ? (
                                                                                <TextField
                                                                                    InputProps={{
                                                                                        startAdornment: <InputAdornment position="start">kg</InputAdornment>,
                                                                                    }}
                                                                                    className='editBal'
                                                                                    value={balance}
                                                                                    onChange={handleBalanceChange}
                                                                                    size="small"
                                                                                    sx={{ p: '0', fontSize: '14px', minHeight: 'unset', fontWeight: '600' }}
                                                                                />
                                                                            ) : (
                                                                                <Typography component="span" sx={{ fontWeight: '600' }}>{balance}</Typography>
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Typography component="span" sx={{ fontWeight: '600' }}>1.41M</Typography>
                                                                        </TableCell>

                                                                        <TableCell>
                                                                            <Typography component="span" sx={{ fontWeight: '600' }}>$50.81</Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    </Box>
                                                </Box>


                                        </Grid>

                                        <Grid item xs={6} sx={{ pl: '15px' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: '15px' }}>
                                                <Box>
                                                    <Typography variant="h6" className='mainTitle'>Entry Price</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                                                    <Box><Typography className='commonBadge' sx={{ cursor: 'pointer' }}>Edit</Typography></Box>
                                                    <Box><Typography className='commonBadge' sx={{ cursor: 'pointer' }}>Reset</Typography></Box>
                                                </Box>
                                            </Box>

                                           
                                            <Box className="daBox" sx={{ border: '1px solid var(--cream)', borderRadius: '8px', boxShadow: 'var(--cream) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px' }}>
                                                <Box className="free_tier" sx={{ bgcolor: theme === 'light' ? 'var(--gray)' : 'var(--secondary-dark)', textAlign: 'center', p: '0 !important' }}>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <Typography variant="h6" className='mainTitle'>Asset</Typography>
                                                                </TableCell>

                                                                <TableCell>
                                                                    <Typography variant="h6" className='mainTitle'>Balance</Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant="h6" className='mainTitle'>Value</Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell>

                                                                    <Box sx={{ display: "flex", alignItems: 'center', gap: '10px' }}>
                                                                        <Image src="/images/pls.png" width={30} height={30} />
                                                                        <Typography component="span">PLS</Typography>
                                                                    </Box>
                                                                </TableCell>

                                                                <TableCell>
                                                                    <Typography component="span" sx={{ fontWeight: '600' }}>1.41M</Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography component="span" sx={{ fontWeight: '600' }}>$50.81</Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <Box sx={{ display: "flex", alignItems: 'center', gap: '10px' }}>
                                                                        <Image src="/images/9mm.png" width={30} height={30} />
                                                                        <Typography component="span">9MM</Typography>
                                                                    </Box>
                                                                </TableCell>

                                                                <TableCell>
                                                                    <Typography component="span" sx={{ fontWeight: '600' }}>1.41M</Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography component="span" sx={{ fontWeight: '600' }}>$50.81</Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </Box>


                                            <Box sx={{ mt: '30px' }}>
                                                <Typography variant="h6" className='mainTitle'> &nbsp;</Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center', my: '15px' }}>
                                                <Box>
                                                    <Typography variant="h6">$652.772 <Typography component="span" sx={{ color: '#11c711' }}>(552.77%)</Typography></Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>

                                                    <Box><Typography className='commonBadge' sx={{ cursor: 'pointer' }}>Provide Liquidity</Typography></Box>
                                                </Box>
                                            </Box>

                                            <Box className="daBox" sx={{ border: '1px solid var(--cream)', borderRadius: '8px', boxShadow: 'var(--cream) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px' }}>
                                                <Box className="free_tier" sx={{ bgcolor: theme === 'light' ? 'var(--gray)' : 'var(--secondary-dark)', textAlign: 'center', p: '0 !important' }}>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <Typography variant="h6" className='mainTitle'>Asset</Typography>
                                                                </TableCell>

                                                                <TableCell>
                                                                    <Typography variant="h6" className='mainTitle'>Balance</Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant="h6" className='mainTitle'>Value</Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell>

                                                                    <Box sx={{ display: "flex", alignItems: 'center', gap: '10px' }}>
                                                                        <Image src="/images/pls.png" width={30} height={30} />
                                                                        <Typography component="span">PLS</Typography>
                                                                    </Box>
                                                                </TableCell>

                                                                <TableCell>
                                                                    <Typography component="span" sx={{ fontWeight: '600' }}>1.41M</Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography component="span" sx={{ fontWeight: '600' }}>$50.81</Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <Box sx={{ display: "flex", alignItems: 'center', gap: '10px' }}>
                                                                        <Image src="/images/9mm.png" width={30} height={30} />
                                                                        <Typography component="span">9MM</Typography>
                                                                    </Box>
                                                                </TableCell>

                                                                <TableCell>
                                                                    <Typography component="span" sx={{ fontWeight: '600' }}>1.41M</Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography component="span" sx={{ fontWeight: '600' }}>$50.81</Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </Box>


                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box className="modal_footer" sx={{ bgcolor: theme === 'light' ? 'var(--gray)' : 'var(--secondary-dark)', }}>
                    <Box className="detailsBtnWrapper" >
                        <Box className="detailsBtn" onClick={handletoggle} sx={{ display: 'flex', justifyContent: "center", alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                            <Typography sx={{ fontWeight: '600', color: 'var(--cream)' }}>Details </Typography>
                            <IoIosArrowDown style={{ color: 'var(--cream)' }} size={14} />
                        </Box>
                        <Box className="hideBtn" onClick={handletoggle}>
                            <Box sx={{ display: 'flex', justifyContent: "center", alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                <Typography sx={{ fontWeight: '600', color: 'var(--cream)' }}>Hide </Typography>
                                <IoIosArrowUp style={{ color: 'var(--cream)' }} size={14} />
                            </Box>
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: '5px' }}>
                                    <Box>
                                        <Typography sx={{ fontSize: '12px', color: 'var(--cream)' }}>Yield</Typography>
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: '12px', }}>$0.00</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: '5px' }}>
                                    <Box sx={{ pl: '15px' }}>
                                        <Typography sx={{ fontSize: '12px', color: 'var(--cream)' }}>LP Fee Yield</Typography>
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: '12px', color: 'var(--cream)' }}>$0.00</Typography>
                                    </Box>
                                </Box>


                                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: '5px' }}>
                                    <Box>
                                        <Typography sx={{ fontSize: '12px', color: 'var(--cream)' }}>APR</Typography>
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: '12px', }}>0%</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: '5px' }}>
                                    <Box sx={{ pl: '15px' }}>
                                        <Typography sx={{ fontSize: '12px', color: 'var(--cream)' }}>LP Fee APR</Typography>
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: '12px', color: 'var(--cream)' }}>0%</Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: '5px' }}>
                                    <Box>
                                        <Typography sx={{ fontSize: '12px', color: 'var(--cream)' }}>APY (1x monthly compound)
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: '12px', }}>0%</Typography>
                                    </Box>
                                </Box>


                                <Box className="roiList" sx={{ textAlign: 'start', mt: '15px' }}>
                                    <List sx={{ padding: 0, }}>
                                        <ListItem sx={{ padding: 0 }}>
                                            <Typography sx={{ fontSize: '11px', fontWeight: '600', color: 'var(--cream)' }}>
                                                Yields and rewards are calculated at the current rates and subject to change based on various external variables.
                                            </Typography>
                                        </ListItem>
                                        <ListItem sx={{ padding: 0 }}>
                                            <Typography sx={{ fontSize: '11px', fontWeight: '600', color: 'var(--cream)' }}>
                                                LP Fee Rewards: 0.01% ~ 1% per trade according to the specific fee tier of the trading pair, claimed and compounded manually.
                                            </Typography>
                                        </ListItem>
                                        <ListItem sx={{ padding: 0 }}>
                                            <Typography sx={{ fontSize: '11px', fontWeight: '600', color: 'var(--cream)' }}>
                                                LP Fee APR figures are calculated using Subgraph and may be subject to indexing delays. For more accurate LP Fee APR, please visit the Info Page.
                                            </Typography>
                                        </ListItem>
                                        <ListItem sx={{ padding: 0 }}>
                                            <Typography sx={{ fontSize: '11px', fontWeight: '600', color: 'var(--cream)' }}>
                                                All figures are estimates provided for your convenience only, and by no means represent guaranteed returns.
                                            </Typography>
                                        </ListItem>
                                    </List>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>


            </Box>
        </Modal>
    );
};

export default RoiCalculator;
