import React, { useCallback, useState } from 'react';
import { Box, Button, Link, Typography, useTheme } from '@mui/material';
import { BsArrowLeft } from 'react-icons/bs';
import { CiCalculator2 } from 'react-icons/ci';
import { BsQuestionCircle } from 'react-icons/bs';
import { IoSettingsOutline } from 'react-icons/io5';
import { IoIosArrowDown } from 'react-icons/io';
import { HiPlus } from 'react-icons/hi2';
import SelectedToken from '../SelectToken/SelectedToken';
import { FaArrowRight } from 'react-icons/fa6';
import { PiCopy } from "react-icons/pi";
import { LiaExchangeAltSolid } from "react-icons/lia";
import { GoAlertFill } from "react-icons/go";
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import Image from 'next/image';
import { SlGraph } from "react-icons/sl";
import { useRouter } from 'next/router';
import RoiCalculator from '../RoiCalculator/RoiCalculator'

interface AddLiquidityProps {
  theme: 'light' | 'dark';
}

const AddLiquidity: React.FC<AddLiquidityProps> = ({ theme }) => {
  const { palette } = useTheme();
  const [isActive, setIsActive] = useState(true);
  const [activeCard, setActiveCard] = useState<number | null>(0);
  const [pickData, setPickData] = useState<string>('Not created');
  const [vTwo, setVTwo] = useState(false);
  const [circleImages, setCircleImages] = useState<{ circle1: string; circle2: string }>({
    circle1: '/images/circle1.svg',
    circle2: '/images/circle2.svg',
  });
  const [activeCurrency, setActiveCurrency] = useState<'PLS/9MM' | '9MM/PLS'>('PLS/9MM');
  const [activeNewCurrency, setActiveNewCurrency] = useState<'PLS/9MM' | '9MM/PLS'>('PLS/9MM');
  const [openToken, setOpenToken] = useState(false);
  const [tier, setTier] = useState<string>('0.01%');


  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);



  const handleClick = (index: number) => {
    setActiveCard(index);
    const cardData = ['Not created', 'Not created', '0% Pick', '98% Pick', '2% Pick'];
    setPickData(cardData[index]);
    const tierDate = ["0.01%", '0.05%', "0.25%", "1%", "2%"];
    setTier(tierDate[index]);
  };

  const toggleClass = () => {
    setIsActive(!isActive);
  };

  const toggleV2Class = () => {
    setVTwo(!vTwo);
    setIsActive(!isActive);
  }

  const handleOpenToken = useCallback(() => setOpenToken(prev => !prev), []);
  const handleCloseToken = () => setOpenToken(false);


  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <Box className="AddLiquiditySec">
      <Box className="white_box">
        <Box className="al-head" sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box className="al-left">
            <Typography
              onClick={handleGoBack}
              variant='h6'
              sx={{
                fontSize: '16px',
                fontWeight: '600',
                display: 'flex',
                gap: '10px',
                cursor: 'pointer'
              }}
            >
              <BsArrowLeft size={20} /> Add V3 Liquidity
            </Typography>
          </Box>
          <Box className="al-right">
            <Typography
              sx={{
                fontSize: '12px',
                textTransform: 'uppercase',
                fontWeight: '400',
                mb: 2,
                color: palette.text.secondary,
                letterSpacing: '1px',
              }}
            >
              APR
            </Typography>

            <Box className="al-calc" sx={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
              <Box>
                <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>0%</Typography>
              </Box>
              <Box onClick={handleOpen} sx={{ cursor: "pointer" }}>
                <Typography><CiCalculator2 size={20} style={{ color: palette.text.secondary }} /></Typography>
              </Box>
              <Box sx={{ cursor: "pointer" }}>
                <Typography><BsQuestionCircle size={20} style={{ color: palette.text.secondary }} /></Typography>
              </Box>
              <Box sx={{ cursor: "pointer" }}>
                <Typography><IoSettingsOutline size={20} style={{ color: palette.text.secondary }} /></Typography>
              </Box>
            </Box>

          </Box>
        </Box>

        <Box className="al-body" sx={{ p: '30px 0 0 0' }}>

          <Box className="al-inner" sx={{ display: 'flex' }}>

            <Box className="al-inner-left" sx={{ flex: 1 }}>
              <Box sx={{ mb: "15px" }}>
                <Typography className='mainTitle' sx={{ color: 'var(--cream)' }}>CHOOSE TOKEN PAIR</Typography>
                <Box className="token-sec">
                  <Box className="token-pair" onClick={handleOpenToken} sx={{ cursor: 'pointer', color: palette.mode === 'light' ? 'var(--black)' : 'var(--white)', bgcolor: palette.mode === 'light' ? 'var(--light_clr)' : 'var(--secondary-dark)' }}>
                    <Box >
                      <Typography sx={{ fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>PLS</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IoIosArrowDown size={17} />
                    </Box>
                  </Box>
                  <Box sx={{display: 'flex',alignItems: 'center',justifyContent: 'center'}}>
                    <HiPlus size={20} />
                  </Box>
                  <Box onClick={handleOpenToken} className="token-pair" sx={{ color: palette.mode === 'light' ? 'var(--black)' : 'var(--white)', bgcolor: palette.mode === 'light' ? 'var(--light_clr)' : 'var(--secondary-dark)' }}>
                    <Box >
                      <Typography sx={{ fontSize: '14px', fontWeight: '700' }}>PLS</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IoIosArrowDown size={17} />
                    </Box>
                  </Box>
                </Box>

              </Box>
              <Box className={`${isActive ? 'active' : ''} free_tier`} sx={{ mb: "30px", bgcolor: palette.mode === 'light' ? 'var(--gray)' : 'var(--secondary-dark)' }}>

                <Box className="ft_head">
                  <Box sx={{ textAlign: 'start' }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: '500', mb: '15px' }}>
                      V3 LP - {tier} fee tier
                    </Typography>
                    <Typography
                      className='pickData'
                      component="span"
                      sx={{
                        border: `1px solid ${palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)'}`,
                        fontSize: '10px',
                        fontWeight: '600',
                        p: '5px 7px',
                        borderRadius: '30px',
                        display: vTwo ? "none" : "inline-block",
                        color: palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)',
                      }}
                    >
                      {pickData}
                    </Typography>
                  </Box>
                  <Box>
                    <Link onClick={toggleClass} sx={{ textDecoration: 'none', fontSize: '12px', fontWeight: '700', color: palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)', cursor: 'pointer', display: isActive ? 'none' : 'flex', gap: '5px' }}> More <IoIosArrowDown size={15} /></Link>
                    <Link onClick={toggleClass} sx={{ textDecoration: 'none', fontSize: '12px', fontWeight: '700', color: palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)', cursor: 'pointer', display: isActive ? 'flex' : 'none', gap: '5px' }}> Hide</Link>
                  </Box>
                </Box>

                <Box className="ftcardBoxOuter" sx={{ display: isActive ? "block" : "none" }}>
                  <Box className="ftcardBox" sx={{ display: vTwo ? "none" : "block" }}>
                    <Box className="ftCards_list">
                      <Box className={`${activeCard === 0 ? 'active active1 ftCards' : 'ftCards'}`} onClick={() => handleClick(0)} sx={{ bgcolor: palette.mode === 'light' ? 'var(--white)' : 'var(--primary)' }}>
                        <Typography sx={{ mb: '10px' }}>0.01%</Typography>
                        <Typography
                          className='pickData'
                          sx={{
                            border: `1px solid ${palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)'}`,
                            fontSize: '10px',
                            fontWeight: '600',
                            p: '5px 7px',
                            borderRadius: '30px',
                            color: palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)',
                          }}
                        >
                          Not created
                        </Typography>
                      </Box>
                      <Box className={`${activeCard === 1 ? 'active active2 ftCards' : 'ftCards'}`} onClick={() => handleClick(1)} sx={{ bgcolor: palette.mode === 'light' ? 'var(--white)' : 'var(--primary)' }}>
                        <Typography sx={{ mb: '10px' }}>0.05%</Typography>
                        <Typography
                          className='pickData'
                          sx={{
                            border: `1px solid ${palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)'}`,
                            fontSize: '10px',
                            fontWeight: '600',
                            p: '5px 7px',
                            borderRadius: '30px',
                            color: palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)',
                          }}
                        >
                          Not created
                        </Typography>
                      </Box>
                      <Box className={`${activeCard === 2 ? 'active active3 ftCards' : 'ftCards'}`} onClick={() => handleClick(2)} sx={{ bgcolor: palette.mode === 'light' ? 'var(--white)' : 'var(--primary)' }}>
                        <Typography sx={{ mb: '10px' }}>0.25%</Typography>
                        <Typography
                          className='pickData'
                          sx={{
                            border: `1px solid ${palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)'}`,
                            fontSize: '10px',
                            fontWeight: '600',
                            p: '5px 7px',
                            borderRadius: '30px',
                            color: palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)',
                          }}
                        >
                          0% Pick
                        </Typography>
                      </Box>
                      <Box className={`${activeCard === 3 ? 'active active4 ftCards' : 'ftCards'}`} onClick={() => handleClick(3)} sx={{ bgcolor: palette.mode === 'light' ? 'var(--white)' : 'var(--primary)' }}>
                        <Typography sx={{ mb: '10px' }}>1% </Typography>
                        <Typography
                          className='pickData'
                          sx={{
                            border: `1px solid ${palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)'}`,
                            fontSize: '10px',
                            fontWeight: '600',
                            p: '5px 7px',
                            borderRadius: '30px',
                            color: palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)',
                          }}
                        >
                          98% Pick
                        </Typography>
                      </Box>
                      <Box className={`${activeCard === 4 ? 'active active5 ftCards' : 'ftCards'}`} onClick={() => handleClick(4)} sx={{ bgcolor: palette.mode === 'light' ? 'var(--white)' : 'var(--primary)' }}>
                        <Typography sx={{ mb: '10px' }}>2%</Typography>
                        <Typography
                          className='pickData'
                          sx={{
                            border: `1px solid ${palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)'}`,
                            fontSize: '10px',
                            fontWeight: '600',
                            p: '5px 7px',
                            borderRadius: '30px',
                            color: palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)',
                          }}
                        >
                          2% Pick
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box className="ftV2sec" sx={{ display: vTwo ? "flex" : "none", alignItems: 'center', justifyContent: 'space-between', mt: '15px' }}>
                    <Button onClick={toggleV2Class} variant="outlined" sx={{ width: 'calc(50% - 10px)' }} color="secondary">V3 LP</Button>
                    <Button variant="outlined" sx={{ width: 'calc(50% - 10px)', bgcolor: 'rgba(246, 180, 27, 0.1)' }} color="secondary">V2 LP</Button>
                  </Box>

                  <Box className="fiFooter" sx={{ display: vTwo ? 'none' : 'block', mt: '30px' }}>
                    <Typography onClick={toggleV2Class} sx={{ fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>Add V2 Liquidity</Typography>
                  </Box>
                </Box>
              </Box>

              <Box className="SwapWidgetInner" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column', gap: '15px' }}>

                <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                  <Typography className="mainTitle" sx={{ color: 'var(--cream)', textAlign: 'start', }}>DEPOSIT AMOUNT</Typography>
                </Box>

                <Box className="inputBox" sx={{ width: '100%', textAlign: 'end' }}>
                  <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center', mb: '10px' }}>
                    <Image src="/images/circle1.svg" alt="circle1" width={20} height={20} />
                    <Typography sx={{ fontSize: '14px', fontWeight: '700', lineHeight: 'normal', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      PLS
                    </Typography>
                  </Box>
                  <Box className="inputField">
                    <input type="number" placeholder='0.0' style={{ textAlign: 'end' }} />
                    <Typography sx={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '500' }}>~195,194.61 USD</Typography>
                  </Box>
                </Box>


                <Box className="inputBox" sx={{ width: '100%', textAlign: 'end' }}>
                  <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center', mb: '10px' }}>
                    <Image src="/images/circle2.svg" alt="circle2" width={20} height={20} />
                    <Typography sx={{ fontSize: '14px', fontWeight: '700', lineHeight: 'normal', display: 'flex', alignItems: 'center' }}>
                      9MM <Typography component="span" sx={{ ml: '5px', cursor: 'pointer' }}><PiCopy /></Typography>
                    </Typography>
                  </Box>
                  <Box className="inputField">
                    <input type="number" placeholder='0.0' style={{ textAlign: 'end' }} />
                    <Typography sx={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '500' }}>~195,194.61 USD</Typography>
                  </Box>
                </Box>
              </Box>

            </Box>

            <Box className="al-inner-right">
              <Box sx={{ display: vTwo ? 'none' : 'block' }}>
                {activeCard === 0 && (
                  <Box>

                    <Box className="warning-box" sx={{ mb: '15px' }}>
                      <Box sx={{ color: 'var(--secondary)', fontSize: 20 }}>
                        <GoAlertFill />
                      </Box>
                      <Box sx={{ width: 'calc(100% - 30px)', color: 'var(--primary)' }}>
                        <Typography>This pool must be initialized before you can add liquidity. To initialize, select a starting price for the pool. Then, enter your liquidity price range and deposit amount. Gas fees will be higher than usual due to the initialization transaction.</Typography>
                        <Typography sx={{ fontWeight: '600' }}>Fee-on transfer tokens and rebasing tokens are NOT compatible with V3.</Typography>
                      </Box>
                    </Box>

                    <Box className="SwapWidgetInner" sx={{ mb: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column', gap: '15px' }}>
                      <Box className="inputBox" sx={{ width: '100%' }}>
                        <Box className="inputField">
                          <input type="number" placeholder='0.0' style={{ textAlign: 'end' }} />

                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: '15px', justifyContent: 'space-between', mb: '30px' }}>
                      <Typography sx={{ fontWeight: '600' }}>Current PLS Price:</Typography>
                      <Typography sx={{ fontWeight: '600' }}>-9MM</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: '15px', justifyContent: 'space-between', mb: "15px" }}>
                      <Box sx={{ width: '50%' }}>
                        <Typography className='mainTitle' sx={{ color: 'var(--cream)',}}>SET PRICE RANGE</Typography>
                      </Box>
                      <Box sx={{ width: '50%', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: "end" }}>

                        <Typography sx={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'var(--cream)'
                        }}>View prices in</Typography>
                        <Typography
                          className='pickData'
                          component="span"
                          sx={{
                            border: `1px solid ${palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)'}`,
                            fontSize: '14px',
                            fontWeight: '600',
                            p: '5px 7px',
                            display: 'flex',
                            gap: '10px',
                            borderRadius: '30px',
                            cursor: 'pointer',
                            color: palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)'
                          }}>
                          <LiaExchangeAltSolid size={20} />
                          PLS
                        </Typography>

                      </Box>
                    </Box>


                    <Box className="viewPrice" sx={{ display: 'flex', gap: '15px', justifyContent: 'space-between', mb: '15px' }}>
                      {/* free_tier */}
                      <Box className="free_tier" sx={{ bgcolor: palette.mode === 'light' ? 'var(--gray)' : 'var(--secondary-dark)', width: '50%', textAlign: 'center' }}>
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

                      <Box className="free_tier" sx={{ bgcolor: palette.mode === 'light' ? 'var(--gray)' : 'var(--secondary-dark)', width: '50%', textAlign: 'center' }}>
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


                    <Box className="fullRangeSec" sx={{ display: 'flex', flexWrap: 'wrap', gap: '15px', textAlign: 'center', mb: '15px' }}>
                      <Box sx={{
                        width: 'calc(25% - 15px)',
                        border: `1px solid ${palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)'}`,
                        fontSize: '14px',
                        fontWeight: '600',
                        p: '5px 7px',
                        display: 'flex',
                        gap: '10px',
                        borderRadius: '30px',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)'
                      }}>
                        10%
                      </Box>

                      <Box sx={{
                        width: 'calc(25% - 15px)',
                        border: `1px solid ${palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)'}`,
                        fontSize: '14px',
                        fontWeight: '600',
                        p: '5px 7px',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '10px',
                        borderRadius: '30px',
                        cursor: 'pointer',
                        color: palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)'
                      }}>
                        20%
                      </Box>
                      <Box sx={{
                        width: 'calc(25% - 15px)',
                        border: `1px solid ${palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)'}`,
                        fontSize: '14px',
                        fontWeight: '600',
                        p: '5px 7px',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '10px',
                        borderRadius: '30px',
                        cursor: 'pointer',
                        color: palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)'
                      }}>
                        50%
                      </Box>
                      <Box sx={{
                        width: 'calc(25% - 15px)',
                        border: `1px solid ${palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)'}`,
                        fontSize: '14px',
                        fontWeight: '600',
                        p: '5px 7px',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '10px',
                        borderRadius: '30px',
                        cursor: 'pointer',
                        color: palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)'
                      }}>
                        Full Range
                      </Box>

                    </Box>

                    <Box>
                      <Button variant="contained" color="secondary" sx={{ width: '100%' }}>
                        Enter an amount
                      </Button>
                    </Box>
                  </Box>
                )}


                {activeCard === 1 && (
                  <Box>

                    <Box sx={{ display: 'flex', gap: '15px', justifyContent: 'space-between', mb: "15px" }}>
                      <Box sx={{ width: '50%' }}>
                        <Typography sx={{ color: 'var(--cream)', fontWeight: '600' }}>SET PRICE RANGE</Typography>
                      </Box>
                      <Box sx={{ width: '50%', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: "end" }}>

                        <Typography sx={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'var(--cream)'
                        }}>View prices in</Typography>
                        <Typography
                          className='pickData'
                          component="span"
                          sx={{
                            border: `1px solid ${palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)'}`,
                            fontSize: '14px',
                            fontWeight: '600',
                            p: '5px 7px',
                            display: 'flex',
                            gap: '10px',
                            borderRadius: '30px',
                            cursor: 'pointer',
                            color: palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)'
                          }}>
                          <LiaExchangeAltSolid size={20} />
                          PLS
                        </Typography>

                      </Box>
                    </Box>


                    <Box sx={{ display: 'flex', gap: '5px', justifyContent: 'center', mb: '15px' }}>
                      <Typography sx={{ color: 'var(--cream)', fontSize: '12px' }}>Current Price:</Typography>
                      <Typography sx={{ color: 'var(--cream)', fontSize: '12px' }}>0.000312441</Typography>
                      <Typography sx={{ color: 'var(--cream)', fontSize: '12px' }}>9MM per PLS</Typography>
                    </Box>

                    <Box sx={{ textAlign: 'center', minHeight: '200px', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', }}>
                      <SlGraph size={50} />
                      <Typography sx={{ fontSize: '18px', fontWeight: '600' }}>There is no liquidity data.</Typography>
                    </Box>


                    <Box sx={{ display: 'flex', gap: '15px', justifyContent: 'space-between', mb: '15px' }}>
                      {/* free_tier */}
                      <Box className="free_tier" sx={{ bgcolor: palette.mode === 'light' ? 'var(--gray)' : 'var(--secondary-dark)', width: '50%', textAlign: 'center' }}>
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

                      <Box className="free_tier" sx={{ bgcolor: palette.mode === 'light' ? 'var(--gray)' : 'var(--secondary-dark)', width: '50%', textAlign: 'center' }}>
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




                    <Box className="fullRangeSec" sx={{ display: 'flex', flexWrap: 'wrap', gap: '15px', textAlign: 'center', mb: '15px' }}>
                      <Box sx={{
                        width: 'calc(25% - 15px)',
                        border: `1px solid ${palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)'}`,
                        fontSize: '14px',
                        fontWeight: '600',
                        p: '5px 7px',
                        display: 'flex',
                        gap: '10px',
                        borderRadius: '30px',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)'
                      }}>
                        10%
                      </Box>

                      <Box sx={{
                        width: 'calc(25% - 15px)',
                        border: `1px solid ${palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)'}`,
                        fontSize: '14px',
                        fontWeight: '600',
                        p: '5px 7px',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '10px',
                        borderRadius: '30px',
                        cursor: 'pointer',
                        color: palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)'
                      }}>
                        20%
                      </Box>
                      <Box sx={{
                        width: 'calc(25% - 15px)',
                        border: `1px solid ${palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)'}`,
                        fontSize: '14px',
                        fontWeight: '600',
                        p: '5px 7px',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '10px',
                        borderRadius: '30px',
                        cursor: 'pointer',
                        color: palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)'
                      }}>
                        50%
                      </Box>
                      <Box sx={{
                        width: 'calc(25% - 15px)',
                        border: `1px solid ${palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)'}`,
                        fontSize: '14px',
                        fontWeight: '600',
                        p: '5px 7px',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '10px',
                        borderRadius: '30px',
                        cursor: 'pointer',
                        color: palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)'
                      }}>
                        Full Range
                      </Box>

                    </Box>


                    <Box className="warning-box" sx={{ mb: '15px' }}>
                      <Box sx={{ color: 'var(--secondary)', fontSize: 20 }}>
                        <GoAlertFill />
                      </Box>
                      <Box sx={{ width: 'calc(100% - 30px)', color: 'var(--primary)' }}>
                        <Typography>Your position will not earn fees or be used in trades until the market price moves into your range.</Typography>

                      </Box>
                    </Box>

                    <Box>
                      <Button variant="contained" color="secondary" sx={{ width: '100%' }}>
                        Enter an amount
                      </Button>
                    </Box>
                  </Box>
                )}

                {activeCard === 2 && (
                  <>
                  </>
                )}
              </Box>

              <Box sx={{ display: vTwo ? 'block' : 'none' }}>
                <Box>

                  <Box sx={{ textAlign: 'center', minHeight: '200px', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', }}>
                    <SlGraph size={50} />
                    <Typography sx={{ fontSize: '18px', fontWeight: '600' }}>Your position will appear here.
                    </Typography>
                  </Box>


                  <Box sx={{ display: 'flex', gap: '15px', justifyContent: 'space-between', mb: '15px' }}>
                    {/* free_tier */}
                    <Box className="free_tier" sx={{ bgcolor: palette.mode === 'light' ? 'var(--gray)' : 'var(--secondary-dark)', width: '50%', textAlign: 'center' }}>
                      <Typography sx={{ fontWeight: '600' }}>Min Price</Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box><FaMinus /></Box>
                        <Box className="inputBox" sx={{ width: '100%', my: '15px' }}>
                          <input type="number" placeholder="0.0" style={{ textAlign: 'center' }} />
                        </Box>
                        <Box><FaPlus /></Box>
                      </Box>

                      <Box className="" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                        <Typography sx={{ fontWeight: '600' }}>9MM</Typography>
                        <Typography sx={{ fontWeight: '600' }}>Per</Typography>
                        <Typography sx={{ fontWeight: '600' }}>PLS</Typography>
                      </Box>

                    </Box>
                    {/* free_tier */}

                    <Box className="free_tier" sx={{ bgcolor: palette.mode === 'light' ? 'var(--gray)' : 'var(--secondary-dark)', width: '50%', textAlign: 'center' }}>
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
                    <Button variant="contained" color="secondary" sx={{ width: '100%' }}>
                      Enter an amount
                    </Button>
                  </Box>
                </Box>
              </Box>

            </Box>

          </Box>
        </Box>
      </Box>
      <SelectedToken
        openToken={openToken}
        handleCloseToken={handleCloseToken}
        mode={theme} // Ensure `theme` is passed correctly
      />

      <RoiCalculator open={open} handleClose={handleClose} />



    </Box>
  );
};

export default AddLiquidity;
