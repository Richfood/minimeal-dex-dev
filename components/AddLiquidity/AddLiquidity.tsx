import React, { useCallback, useEffect, useState } from 'react';
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
import { toast, ToastContainer } from 'react-toastify';
import getTokenApproval from "../../utils/getTokenApproval";
import addLiquidity from "../../utils/addLiquidity";
import emulate from '@/utils/emulate';
import { FeeAmount, nearestUsableTick, TICK_SPACINGS } from '@uniswap/v3-sdk';
import addresses from "../../utils/address.json";
import { truncateAddress } from '@/utils/generalFunctions';
import { priceToTick, tickToPrice } from '@/utils/utils';
import Default from '../CustomChart/Default';
import { getPoolData } from '@/utils/api/getPoolData';
import { AddLiquidityPoolData, TokenDetails } from '@/interfaces';
import SettingsModal from '../SettingModal/SettingModal';

import tokenList from "../../utils/tokenList.json";

interface AddLiquidityProps {
  theme: 'light' | 'dark';
}

// interface CurrentPoolData {
//   id : String,
//   tick : String,
//   ticks : {
//     price0 : String,
//     price1 : String
//   },
//   token0Price : String,
//   token1Price : String
// }

// interface Token {
//   name : string;
//   symbol : string;
//   address : string;
//   decimals : number;
// }

const AddLiquidity: React.FC<AddLiquidityProps> = ({ theme }) => {
  const { palette } = useTheme();
  const [isActive, setIsActive] = useState(true);
  const [activeCard, setActiveCard] = useState<number | null>(null);
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

  const NFPMAddress = addresses.PancakePositionManagerAddress;

  const [token0,setToken0] =  useState<TokenDetails | null>(null);
  const [token1, setToken1] = useState<TokenDetails | null>(null);
  const [tokenBeingChosen, setTokenBeingChosen] = useState(0);

  /* This is irrelevant of token0 and token1 addresses. Meaning token0 (token0 < token1) can be at position 1*/
  // const [tokenAtPosition0, setTokenAtPosition0] = useState(token0Address);
  // const [tokenAtPosition1, setTokenAtPosition1] = useState(token1Address);
  const [tokenToggleOccured , setTokenToggleOccured] = useState(false);

  const [amount0Desired, setAmount0Desired] = useState("");
  const [amount1Desired, setAmount1Desired] = useState("");
  const [priceLower, setPriceLower] = useState("");
  const [priceUpper, setPriceUpper] = useState("");
  const [priceCurrent, setPriceCurrent] = useState("2995");
  const [fee, setFee] = useState<FeeAmount | null>(null);
  const [approvalAmount0, setApprovalAmount0] = useState("");
  const [approvalAmount1, setApprovalAmount1] = useState("");
  const [tickLower, setTickLower] = useState("");
  const [tickUpper, setTickUpper] = useState("");
  const [amount0Min, setAmount0Min] = useState("");
  const [amount1Min, setAmount1Min] = useState("");
  const [deadline, setDeadline] = useState("");
  const [sqrtPriceX96, setSqrtPriceX96] = useState("");
  const [emulateError, setEmulateError] = useState(false);
  const [amount0ToEmulate, setAmount0ToEmulate] = useState(0);
  const [amount1ToEmulate, setAmount1ToEmulate] = useState(0);

  const [priceLowerEntered, setPriceLowerEntered] = useState("");
  const [priceUpperEntered, setPriceUpperEntered] = useState("");
  const [priceCurrentEntered, setPriceCurrentEntered] = useState("");

  const [currentPoolData, setCurrentPoolData] = useState<AddLiquidityPoolData | null>(null);

  const [decimalDifference, setDecimalDifference] = useState(0);

  const handlePriceLower = ()=>{
    if(fee && priceLowerEntered && token0 && token1){
      const tick = priceToTick(priceLowerEntered, decimalDifference);
      const nearestTick = nearestUsableTick(tick, TICK_SPACINGS[fee])
      const newPrice = tickToPrice(nearestTick, decimalDifference);

      setPriceLower(newPrice.toString());
    }
    else{
      setPriceLower("");
    }
  }

  const handlePriceUpper = ()=>{
    if(fee && priceUpperEntered && token0 && token1){
      const tick = priceToTick(priceUpperEntered, decimalDifference);
      const nearestTick = nearestUsableTick(tick, TICK_SPACINGS[fee])
      const newPrice = tickToPrice(nearestTick, decimalDifference);

      setPriceUpper(newPrice.toString());
    }
    else{
      setPriceUpper("");
    }
  }

  const handlePriceCurrent = ()=>{
    if(fee && priceCurrentEntered && token0 && token1){
      const tick = priceToTick(priceCurrentEntered, decimalDifference);
      const nearestTick = nearestUsableTick(tick, TICK_SPACINGS[fee])
      const newPrice = tickToPrice(nearestTick, decimalDifference);

      setPriceCurrent(newPrice.toString());
    }
    else{
      setPriceCurrent("");
    }
  }

  const reset = ()=>{
    setApprovalAmount0("");
    setApprovalAmount1("");
    setTickLower("");
    setTickUpper("");
    setAmount0Min("");
    setAmount1Min("");
    setDeadline("");
    setSqrtPriceX96("");
    setEmulateError(false);
    setAmount0ToEmulate(0);
    setAmount1ToEmulate(0);

    setPriceLower("");
    setPriceUpper("");
    setPriceCurrent("");

    setPriceLowerEntered("");
    setPriceUpperEntered("");
    setPriceCurrentEntered("");
  }

  const sortTokens = ()=>{
    if(token0 && token1){
      if(token0.address.contract_address > token1.address.contract_address){
        const temp = token0;
        setToken0(token1);
        setToken1(temp);
      }
    }
  }

  const handleFeeChange = (index: number) => {
    setActiveCard(index);
    const cardData = ['Not created', 'Not created', '0% Pick', '98% Pick', '2% Pick'];
    setPickData(cardData[index]);
    const tierDate = ["0.01%", '0.05%', "0.25%", "1%", "2%"];
    setTier(tierDate[index]);

    switch(index){
      case (0):
        setFee(FeeAmount.LOWEST);
        break;
      
      case(1):
        setFee(FeeAmount.LOW);
        break;

      case(2):
        setFee(FeeAmount.MEDIUM);
        break;

      case(3):
        setFee(FeeAmount.HIGH);
        break;

      case(4):
        setFee(FeeAmount.HIGHEST);
        break;

      default :
        setFee(FeeAmount.LOWEST);
    }

    reset();
  };

  // const handleTokenToggle = () => {
  //   const temp = tokenAtPosition0;
  //   setTokenAtPosition0(tokenAtPosition1);
  //   setTokenAtPosition1(temp);
  //   setTokenToggleOccured(!tokenToggleOccured);

  //   setAmount0ToEmulate(0);
  //   setAmount1ToEmulate(0);
  //   setAmount0Desired("");
  //   setAmount1Desired("");

  //   setPriceLower((1/Number(priceUpper)).toString());
  //   setPriceUpper((1/Number(priceLower)).toString());
  // }

  const toggleClass = () => {
    setIsActive(!isActive);
  };

  const toggleV2Class = () => {
    setVTwo(!vTwo);
    setIsActive(!isActive);
  }

  const handleOpenToken = useCallback((tokenNumber : number) => {
    setTokenBeingChosen(tokenNumber);
    setOpenToken(prev => !prev);
  }, []);

  const handleCloseToken = () => setOpenToken(false);

  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleAddLiquidity = async ()=>{
    if(!token0 || !token1) return;
    try{
      await getTokenApproval(token0, NFPMAddress, approvalAmount0);
      await getTokenApproval(token1, NFPMAddress, approvalAmount1);

      alert("Tokens Approved!");
    }
    catch(error){
      alert("Error approving tokens");
      return;
    }

    try{
      if(fee && token0 && token1){
        // console.log("All params - ");
        // console.log(
        //   NFPMAddress,
        //   token0Address,
        //   token1Address,
        //   tickLower,
        //   tickUpper,
        //   amount0Desired,
        //   amount1Desired,
        //   amount0Desired,
        //   amount1Desired,
        //   deadline,
        //   sqrtPriceX96.toString(),
        //   fee,
        // )

        const addLiquidityTxHash = await addLiquidity(
          NFPMAddress,
          token0,
          token1,
          tickLower,
          tickUpper,
          amount0Desired,
          amount1Desired,
          amount0Min,
          amount1Min,
          deadline,
          sqrtPriceX96,
          fee
        )

        alert(`Liquidity added. tx hash :${addLiquidityTxHash} `)
      }
      // const txHash = await (NFPMAddress, token0Address, token1Address);
      // alert(`Pool created if necessary and Liquidity added. Tx HashaddLiquidity : ${txHash}`);
    }
    catch(error){
      console.log("Error adding liquidity", error);
      alert(`Error adding liquidity`);
    }
  }

  const calculate = ()=>{
    console.log("calculate run")
    if(!priceLower || !priceUpper || !priceCurrent || !fee || (!amount0ToEmulate && !amount1ToEmulate) || !token1 || !token0) {
      // console.log("lower = ", priceLower, "upper = ",priceUpper, "current = ",priceCurrent, "fee = ",fee, "-- ",amount0ToEmulate, amount1ToEmulate)
      if((!amount0ToEmulate && !amount1ToEmulate)) {
        setAmount0Desired("");
        setAmount1Desired("");
      }
      return;
    }

    console.log("Running emulate");
    const result = emulate(
      priceLower, 
      priceUpper,
      priceCurrent,
      fee,
      amount0ToEmulate.toString(),
      amount1ToEmulate.toString(),
      token0,
      token1
    );

    console.log('HEllo - ,', result);

    if(result){
      setEmulateError(false);
      const {        
        tickLower : tickLowerEmulate,
        tickUpper : tickUpperEmulate,
        amount0Desired : amount0DesiredEmulate,
        amount1Desired : amount1DesiredEmulate,
        amount0Min : amount0MinEmulate,
        amount1Min : amount1MinEmulate,
        deadline : deadlineEmulate,
        sqrtPriceX96 : sqrtPriceX96Emulate
      } =  result

      setAmount0Desired(amount0DesiredEmulate || "");
      setAmount1Desired(amount1DesiredEmulate || "");
      setTickLower(tickLowerEmulate);
      setTickUpper(tickUpperEmulate);
      setAmount0Min(amount0MinEmulate || "");
      setAmount1Min(amount1MinEmulate || "");
      setDeadline(deadlineEmulate);
      setSqrtPriceX96(sqrtPriceX96Emulate);
      setApprovalAmount0(amount0DesiredEmulate || "");
      setApprovalAmount1(amount1DesiredEmulate || "");
    }
    else{
      setAmount0Desired("");
      setAmount1Desired("");
      setEmulateError(true);
    }
  }


  const handleTokenAmountChange = async (inputElementId : number)=>{

    let amount0ToEmulateFromInput = 0;
    let amount1ToEmulateFromInput = 0;
  
    const tokenInput = document.getElementById(`token${inputElementId}`) as HTMLInputElement;

    if((!tokenToggleOccured && inputElementId === 0) || (tokenToggleOccured && inputElementId === 1)){
      amount0ToEmulateFromInput = (Number(tokenInput.value) || 0);
      amount1ToEmulateFromInput = 0;

      console.log("Adding for 0", tokenToggleOccured, inputElementId);

    }
    else{
      amount1ToEmulateFromInput = (Number(tokenInput.value) || 0);
      amount0ToEmulateFromInput = 0;

      console.log("Adding for 1", tokenToggleOccured, inputElementId);
    }

    setAmount0ToEmulate(amount0ToEmulateFromInput);
    setAmount1ToEmulate(amount1ToEmulateFromInput);
    
  }

  const fetchPoolData = async () => {
    if (token0 && token1 && fee) {
      const poolDataFromSubgraph: AddLiquidityPoolData = await getPoolData(token0, token1, fee);
      setCurrentPoolData(poolDataFromSubgraph);
      
      let priceCurrentToSet : number;

      if(poolDataFromSubgraph){
        priceCurrentToSet = tickToPrice(Number(poolDataFromSubgraph.tick), decimalDifference);
      }
      else{
        priceCurrentToSet = 0;
      }
      setPriceCurrent(priceCurrentToSet.toString())
    }
  };

  useEffect(() => {
    fetchPoolData(); // Call the async function inside useEffect
    calculate();
  }, [token0, token1, fee]);
  

  useEffect(()=>{
    calculate();
  },[priceLower,priceUpper, priceCurrent, amount0ToEmulate, amount1ToEmulate])

  useEffect(()=>{
    reset();
    sortTokens();
    if(token0 && token1) setDecimalDifference(token1.address.decimals - token0.address.decimals);
  },[token0, token1])

  useEffect(()=>{
    if(priceLowerEntered)
      setPriceLower("");

  },[priceLowerEntered])
  
  useEffect(()=>{
    if(priceUpperEntered)
      setPriceUpper("");

  },[priceUpperEntered])

  useEffect(()=>{
    if(priceCurrentEntered)
      setPriceCurrent("");
  },[priceCurrentEntered])

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
              {/* <Box onClick={handleOpen} sx={{ cursor: "pointer" }}>
                <Typography><CiCalculator2 size={20} style={{ color: palette.text.secondary }} /></Typography>
              </Box>
              <Box sx={{ cursor: "pointer" }}>
                <Typography><BsQuestionCircle size={20} style={{ color: palette.text.secondary }} /></Typography>
              </Box> */}
              <Box onClick={handleOpen} sx={{ cursor: "pointer" }}>
                <IoSettingsOutline size={20} style={{ color: palette.text.secondary }} />
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
                  <Box className="token-pair" onClick={()=>{handleOpenToken(0)}} sx={{ cursor: 'pointer', color: palette.mode === 'light' ? 'var(--black)' : 'var(--white)', bgcolor: palette.mode === 'light' ? 'var(--light_clr)' : 'var(--secondary-dark)' }}>
                    <Box >
                      {token0 ? (
                        <Typography sx={{ fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>{token0.name} {`(${truncateAddress(token0.address.contract_address)})`}</Typography>
                      ):(
                        <Typography sx={{ fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Select Token</Typography>
                      )
                      }
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IoIosArrowDown size={17} />
                    </Box>
                  </Box>
                  <Box sx={{display: 'flex',alignItems: 'center',justifyContent: 'center'}}>
                    <HiPlus size={20} />
                  </Box>
                  <Box onClick={()=>{handleOpenToken(1)}} className="token-pair" sx={{ color: palette.mode === 'light' ? 'var(--black)' : 'var(--white)', bgcolor: palette.mode === 'light' ? 'var(--light_clr)' : 'var(--secondary-dark)' }}>
                    <Box >
                      {token1 ? (
                        <Typography sx={{ fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>{token1.name} {`(${truncateAddress(token1.address.contract_address)})`}</Typography>
                      ):(
                        <Typography sx={{ fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Select Token</Typography>
                      )
                      }
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
                      <Box className={`${activeCard === 0 ? 'active active1 ftCards' : 'ftCards'}`} onClick={() => handleFeeChange(0)} sx={{ bgcolor: palette.mode === 'light' ? 'var(--white)' : 'var(--primary)' }}>
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
                      <Box className={`${activeCard === 1 ? 'active active2 ftCards' : 'ftCards'}`} onClick={() => handleFeeChange(1)} sx={{ bgcolor: palette.mode === 'light' ? 'var(--white)' : 'var(--primary)' }}>
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
                      <Box className={`${activeCard === 2 ? 'active active3 ftCards' : 'ftCards'}`} onClick={() => handleFeeChange(2)} sx={{ bgcolor: palette.mode === 'light' ? 'var(--white)' : 'var(--primary)' }}>
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
                      <Box className={`${activeCard === 3 ? 'active active4 ftCards' : 'ftCards'}`} onClick={() => handleFeeChange(3)} sx={{ bgcolor: palette.mode === 'light' ? 'var(--white)' : 'var(--primary)' }}>
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
                      <Box className={`${activeCard === 4 ? 'active active5 ftCards' : 'ftCards'}`} onClick={() => handleFeeChange(4)} sx={{ bgcolor: palette.mode === 'light' ? 'var(--white)' : 'var(--primary)' }}>
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

              {!false ?

                <Box className="SwapWidgetInner" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column', gap: '15px' }}>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                    <Typography className="mainTitle" sx={{ color: 'var(--cream)', textAlign: 'start', }}>DEPOSIT AMOUNT</Typography>
                  </Box>

                  <Box className="inputBox" sx={{ width: '100%', textAlign: 'end' }}>
                    <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center', mb: '10px' }}>
                      <Image src="/images/circle1.svg" alt="circle1" width={20} height={20} />
                      <Typography sx={{ fontSize: '14px', fontWeight: '700', lineHeight: 'normal', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        {token0 ? token0.name : "Select a Currency"} <Typography component="span" sx={{ ml: '5px', cursor: 'pointer' }}><PiCopy /></Typography>
                      </Typography>
                    </Box>
                    <Box className="inputField">
                      <input onChange={()=>handleTokenAmountChange(0)} id="token0" type="number" placeholder='0.0' style={{ textAlign: 'end' }} value={!tokenToggleOccured ? amount0Desired : amount1Desired}/>
                      {/* By default this input takes token amount of token 0. If token toggle has occured, then this also needs to be toggled */}
                    </Box>
                  </Box>


                  <Box className="inputBox" sx={{ width: '100%', textAlign: 'end' }}>
                    <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center', mb: '10px' }}>
                      <Image src="/images/circle2.svg" alt="circle2" width={20} height={20} />
                      <Typography sx={{ fontSize: '14px', fontWeight: '700', lineHeight: 'normal', display: 'flex', alignItems: 'center' }}>
                      {token1 ? (token1.name ): "Select a Currency"} <Typography component="span" sx={{ ml: '5px', cursor: 'pointer' }}><PiCopy /></Typography>
                      </Typography>
                    </Box>
                    <Box className="inputField">
                      <input onChange={()=>handleTokenAmountChange(1)} type="number" id='token1' placeholder='0.0' style={{ textAlign: 'end' }} value={!tokenToggleOccured ? amount1Desired : amount0Desired}/>
                      {/* By default this input takes token amount of token 1. If token toggle has occured, then this also needs to be toggled */}
                    </Box>
                  </Box>
                </Box>
               : 
                <Box className="SwapWidgetInner" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column', gap: '15px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                    <Typography className="mainTitle" sx={{ color: 'var(--cream)', textAlign: 'start', }}>Invalid range selected. The min price must be lower than the max price.</Typography>
                  </Box>
                </Box>
              }

            </Box>

            <Box className="al-inner-right">
              <Box sx={{ display: vTwo ? 'none' : 'block' }}>
                {currentPoolData ? (
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
                          {token0 ? token0.symbol : ""}
                        </Typography>

                      </Box>
                    </Box>

                    {token0 && token1 ? (
                      <Box sx={{ display: 'flex', gap: '5px', justifyContent: 'center', mb: '15px' }}>
                      <Typography sx={{ color: 'var(--cream)', fontSize: '12px' }}>Current Price:</Typography>
                      <Typography sx={{ color: 'var(--cream)', fontSize: '12px' }}>{Number(currentPoolData.token1Price) || 0}</Typography>
                      <Typography sx={{ color: 'var(--cream)', fontSize: '12px' }}>{token0.name} Per {token1.name}</Typography>
                    </Box>
                    ) : (
                      <Box sx={{ display: 'flex', gap: '5px', justifyContent: 'center', mb: '15px' }}>
                      <Typography sx={{ color: 'var(--cream)', fontSize: '12px' }}>Select Currency</Typography>
                    </Box>
                    )}
                        
                    <Box sx={{ textAlign: 'center', minHeight: '200px', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', }}>
                      <SlGraph size={50} />
                      {/* <Default/> */}
                      <Typography sx={{ fontSize: '18px', fontWeight: '600' }}>There is no liquidity data.</Typography>
                    </Box>


                    <Box sx={{ display: 'flex', gap: '15px', justifyContent: 'space-between', mb: '15px' }}>
                      <Box className="free_tier" sx={{ bgcolor: palette.mode === 'light' ? 'var(--gray)' : 'var(--secondary-dark)', width: '50%', textAlign: 'center' }}>
                        <Typography sx={{ fontWeight: '600' }}>Min Price</Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box><FaMinus onClick={()=>{setPriceLowerEntered((Number(priceLower ? priceLower : priceLowerEntered) - 0.0001).toString()); handlePriceLower()}}/></Box>
                          <Box className="inputBox" sx={{ width: '100%', my: '15px' }}>
                            <input onBlur={handlePriceLower} onChange={(e)=>setPriceLowerEntered(e.target.value)} type="number" placeholder="0.0" style={{ textAlign: 'center' }} value={!priceLower ? priceLowerEntered : priceLower}/>
                          </Box>
                          <Box><FaPlus onClick={()=>{setPriceLowerEntered((Number(priceLower ? priceLower : priceLowerEntered) + 0.0001).toString()); handlePriceLower()}}/></Box>
                        </Box>

                        {token0 && token1 ? (
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                            <Typography sx={{ fontWeight: '600' }}>{token0.symbol}</Typography>
                            <Typography sx={{ fontWeight: '600' }}>Per</Typography>
                            <Typography sx={{ fontWeight: '600' }}>{token1.symbol}</Typography>
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                            <Typography sx={{ fontWeight: '600' }}></Typography>
                          </Box>
                        )}



                      </Box>
                      {/* free_tier */}

                      <Box className="free_tier" sx={{ bgcolor: palette.mode === 'light' ? 'var(--gray)' : 'var(--secondary-dark)', width: '50%', textAlign: 'center' }}>
                        <Typography sx={{ fontWeight: '600' }}>Max Price</Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box><FaMinus onClick={()=>{setPriceUpperEntered((Number(priceUpper ? priceUpper : priceUpperEntered) - 0.0001).toString()); handlePriceUpper()}}/></Box>
                          <Box className="inputBox" sx={{ width: '100%', my: '15px' }}>
                            <input type="number" placeholder="0.0" style={{ textAlign: 'center' }} onBlur={handlePriceUpper} onChange={(e)=>setPriceUpperEntered(e.target.value)} value={!priceUpper ? priceUpperEntered : priceUpper}/>
                          </Box>
                          <Box><FaPlus onClick={()=>{setPriceUpperEntered((Number(priceUpper ? priceUpper : priceUpperEntered) + 0.0001).toString()); handlePriceUpper()}}/></Box>
                        </Box>

                        {token0 && token1 ? (
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                            <Typography sx={{ fontWeight: '600' }}>{token0.symbol}</Typography>
                            <Typography sx={{ fontWeight: '600' }}>Per</Typography>
                            <Typography sx={{ fontWeight: '600' }}>{token1.symbol}</Typography>
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                            <Typography sx={{ fontWeight: '600' }}></Typography>
                          </Box>
                        )}

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
                      <Button onClick={()=>{}} variant="contained" color="secondary" sx={{ width: '100%' }}>
                        Enter an amount
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box>
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
                            <input type="number" placeholder='0.0' style={{ textAlign: 'end' }} onBlur={handlePriceCurrent} onChange={(e)=>setPriceCurrentEntered(e.target.value)} value={!priceCurrent ? priceCurrentEntered : priceCurrent}/>
                          </Box>
                        </Box>
                      </Box>

                      {token0 && token1 ? (
                        <Box sx={{ display: 'flex', gap: '15px', justifyContent: 'space-between', mb: '30px' }}>
                          <Typography sx={{ fontWeight: '600' }}>Current {token0.name} Price:</Typography>
                          <Typography sx={{ fontWeight: '600' }}>{priceCurrent || 0} {token1.name}</Typography>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', gap: '15px', justifyContent: 'space-between', mb: '30px' }}>
                          <Typography sx={{ fontWeight: '600' }}></Typography>
                        </Box>
                      )}



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
                            // onClick={handleTokenToggle}
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
                            {truncateAddress(token0?.address.contract_address || "0")}
                          </Typography>
                          </Box>
                      </Box>
                    </Box>


                    <Box className="viewPrice" sx={{ display: 'flex', gap: '15px', justifyContent: 'space-between', mb: '15px' }}>
                      {/* free_tier */}
                      <Box className="free_tier" sx={{ bgcolor: palette.mode === 'light' ? 'var(--gray)' : 'var(--secondary-dark)', width: '50%', textAlign: 'center' }}>
                        <Typography sx={{ fontWeight: '600' }}>Min Price</Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box><FaMinus onClick={()=>{setPriceLowerEntered((Number(priceLower ? priceLower : priceLowerEntered) - 0.0001).toString()); handlePriceLower() }}/></Box>
                          <Box className="inputBox" sx={{ width: '100%', my: '15px' }}>
                            <input type="number" placeholder="0.0" style={{ textAlign: 'center' }} onBlur={handlePriceLower} onChange={(e)=>setPriceLowerEntered(e.target.value)} value={!priceLower ? priceLowerEntered : priceLower}/>
                          </Box>
                          <Box><FaPlus onClick={()=>{setPriceLowerEntered((Number(priceLower ? priceLower : priceLowerEntered) + 0.0001).toString()); handlePriceLower()}}/></Box>
                        </Box>

                        {token0 && token1 ? (
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                            <Typography sx={{ fontWeight: '600' }}>{token0.symbol}</Typography>
                            <Typography sx={{ fontWeight: '600' }}>Per</Typography>
                            <Typography sx={{ fontWeight: '600' }}>{token1.symbol}</Typography>
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                            <Typography sx={{ fontWeight: '600' }}></Typography>
                          </Box>
                        )}

                      </Box>
                      {/* free_tier */}

                      <Box className="free_tier" sx={{ bgcolor: palette.mode === 'light' ? 'var(--gray)' : 'var(--secondary-dark)', width: '50%', textAlign: 'center' }}>
                        <Typography sx={{ fontWeight: '600' }}>Max Price</Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box><FaMinus onClick={()=>{setPriceUpperEntered((Number(priceUpper ? priceUpper : priceUpperEntered) - 0.0001).toString()); handlePriceUpper()}}/></Box>
                          <Box className="inputBox" sx={{ width: '100%', my: '15px' }}>
                            <input type="number" placeholder="0.0" style={{ textAlign: 'center' }} onBlur={handlePriceUpper} onChange={(e)=>setPriceUpperEntered(e.target.value)} value={!priceUpper ? priceUpperEntered : priceUpper}/>
                          </Box>
                          <Box><FaPlus onClick={()=>{setPriceUpperEntered((Number(priceUpper ? priceUpper : priceUpperEntered) + 0.0001).toString()); handlePriceUpper()}}/></Box>
                        </Box>

                        {token0 && token1 ? (
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                            <Typography sx={{ fontWeight: '600' }}>{token0.symbol}</Typography>
                            <Typography sx={{ fontWeight: '600' }}>Per</Typography>
                            <Typography sx={{ fontWeight: '600' }}>{token1.symbol}</Typography>
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                            <Typography sx={{ fontWeight: '600' }}></Typography>
                          </Box>
                        )}

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
                      <Button onClick={handleAddLiquidity} variant="contained" color="secondary" sx={{ width: '100%' }}>
                        Create Liquidity{/* {Enter an amount} */}
                      </Button>
                    </Box>
                  </Box>
                )
                }
              </Box>
          </Box>
        </Box>
      </Box>
      <SelectedToken
        openToken={openToken}
        handleCloseToken={handleCloseToken}
        mode={theme} // Ensure `theme` is passed correctly
        setToken0={setToken0}
        setToken1={setToken1}
        tokenNumber={tokenBeingChosen}
        description=''
      />

      {/* <RoiCalculator open={open} handleClose={handleClose} /> */}
      <SettingsModal isOpen={open} handleClose={handleClose} theme={theme} />
      <style jsx>{`
        .greyed-out {
          opacity: 0.5;           /* Greyed out effect */
          pointer-events: none;   /* Disable interaction */
        }
      `}</style>
    </Box>
    </Box>
  );
};

export default AddLiquidity;