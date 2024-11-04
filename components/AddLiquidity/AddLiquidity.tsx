import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, CircularProgress, Link, Typography, useTheme } from '@mui/material';
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
import { addLiquidityV3, addLiquidityV2, addLiquidityETH } from '@/utils/addLiquidity';
import emulate from '@/utils/emulate';
import { FeeAmount, nearestUsableTick, TICK_SPACINGS } from '@uniswap/v3-sdk';
import addresses from "../../utils/address.json";
import { expandIfNeeded, truncateAddress } from '@/utils/generalFunctions';
import { priceToTick, tickToPrice } from '@/utils/utils';
import Default from '../CustomChart/Default';
import { getPoolData } from '@/utils/api/getPoolData';
import { getV2Pair } from '@/utils/api/getV2Pair';
import { AddLiquidityPoolData, TokenDetails, Protocol } from '@/interfaces';
import SettingsModal from '../SettingModal/SettingModal-addLiquidity';
import tokenList from "../../utils/tokenList.json";
import { calculateV2Amounts } from '@/utils/calculateV2TokenAmounts';
import { debounce } from '@syncfusion/ej2-base';
import { flushSync } from 'react-dom';
import { useCall } from 'wagmi';
import { getAllPoolsForTokens } from '@/utils/api/getAllPoolsForTokens';

interface AddLiquidityProps {
  theme: 'light' | 'dark';
  defaultActiveProtocol : Protocol;
}

interface AddLiquidityLoader {
  tokenApproval0 : boolean,
  tokenApproval1 : boolean,
  addLiquidity : boolean
}

const MIN_TICK = -887272;
const MAX_TICK = 887272;

const RANGES = ["10", "20", "50", "Full"]

enum PriceRangeError {
  INVALID,
  BELOW_RANGE,
  ABOVE_RANGE
}

const AddLiquidity: React.FC<AddLiquidityProps> = ({ theme, defaultActiveProtocol : activeProtocol }) => {
  const { palette } = useTheme();
  const [isActive, setIsActive] = useState(true);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [pickData, setPickData] = useState<string>('Not created');
  const [vTwo, setVTwo] = useState(activeProtocol === Protocol.V2 ? true : false);
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
  const v2RouterAddress = addresses.PancakeV2RouterAddress;
  const tempToken0 = tokenList.TokenD;
  const tempToken1 = tokenList.TokenA;
  const [token0,setToken0] =  useState<TokenDetails | null>(tempToken0);
  const [token1, setToken1] = useState<TokenDetails | null>(tempToken1);
  const [tokenBeingChosen, setTokenBeingChosen] = useState(0);
  const [isFullRange, setIsFullRange] = useState(false);
  const [isButton, setIsButton] = useState(false);
  const [amount0Desired, setAmount0Desired] = useState("");
  const [amount1Desired, setAmount1Desired] = useState("");
  const [priceLower, setPriceLower] = useState("");
  const [priceUpper, setPriceUpper] = useState("");
  const [priceCurrent, setPriceCurrent] = useState("");
  const [fee, setFee] = useState<FeeAmount | null>(null);
  const [approvalAmount0, setApprovalAmount0] = useState("");
  const [approvalAmount1, setApprovalAmount1] = useState("");
  const [tickLower, setTickLower] = useState("");
  const [tickUpper, setTickUpper] = useState("");
  const [amount0Min, setAmount0Min] = useState("");
  const [amount1Min, setAmount1Min] = useState("");
  const [sqrtPriceX96, setSqrtPriceX96] = useState("");
  const [emulateError, setEmulateError] = useState(false);
  const [amount0ToEmulate, setAmount0ToEmulate] = useState<number | string>("");
  const [amount1ToEmulate, setAmount1ToEmulate] = useState<number | string>("");

  const [amountAt0, setAmountAt0] = useState("");
  const [amountAt1, setAmountAt1] = useState("");

  const [priceLowerEntered, setPriceLowerEntered] = useState("");
  const [priceUpperEntered, setPriceUpperEntered] = useState("");
  const [priceCurrentEntered, setPriceCurrentEntered] = useState("");

  const [currentPoolData, setCurrentPoolData] = useState<AddLiquidityPoolData | null>(null);
  const [currentV2PoolRatio, setCurrentV2PoolRatio] = useState<number | null>(null);

  const [decimalDifference, setDecimalDifference] = useState(0);
  const [tokenToggleOccured, setTokenToggleOccured] = useState<boolean | null>(true);
  // console.log("🚀 ~ tokenToggleOccured:", tokenToggleOccured)
  const [isSorted, setIsSorted] = useState<boolean>(true);
  const [handlePricesAfterAdjust, setHandlePricesAfterAdjust] = useState<boolean>(false);
  const [addLiquidityRunning, setAddLiquidityRunning] = useState(false);
  const [slippageTolerance, setSlippageTolerance] = useState<number | null>(1);
  const [rangeButtonSelected, setRangeButtonSelected] = useState<string | null>(null);

  const [pickPercent100, setPickPercent100] = useState(0);
  const [pickPercent500, setPickPercent500] = useState(0);
  const [pickPercent2500, setPickPercent2500] = useState(0);
  const [pickPercent10000, setPickPercent10000] = useState(0);
  const [pickPercent20000, setPickPercent20000] = useState(0);

  const [priceRangeErrorIndex, setPriceRangeErrorIndex] = useState<PriceRangeError | null>(null);

  console.log("🚀 ~ rangeButtonSelected:", rangeButtonSelected)

  console.log("🚀 ~ slippageTolerance:", slippageTolerance)
  const [deadline, setDeadline] = useState("10");
  console.log("🚀 ~ deadline:", deadline)

  // const renderCount = useRef(0);

  const checkRange = ()=>{
    if(!priceUpper || !priceLower || !priceCurrent) return true;

    console.log("🚀 ~ checkRange ~ priceRangeErrorIndex:", priceRangeErrorIndex)

    if(priceLower >= priceUpper){
      setPriceRangeErrorIndex(PriceRangeError.INVALID);
    }
    else if(priceCurrent <= priceLower){
      setPriceRangeErrorIndex(PriceRangeError.BELOW_RANGE);
    }
    else if(priceCurrent >= priceUpper){
      setPriceRangeErrorIndex(PriceRangeError.ABOVE_RANGE);
    }
    else{
      setPriceRangeErrorIndex(null);
    }

    return true;
  }
    console.log("🚀 ~ priceRangeErrorIndex:", priceRangeErrorIndex)

  const calculateRange = (price: number, percentage: number)=>{
    return (price + ((percentage*price)/100)).toString();
  }

  const adjustPricesForTokenToggle = ()=>{

    // console.log("Adjust Price RUn");
    if(token0 && token1){
      
      const tempToken = token0;
      setToken0(token1);
      setToken1(tempToken);

      if(Number(priceLower)){
        const newPriceUpper = (1/Number(priceLower)).toString();
        setPriceUpperEntered(newPriceUpper);
        // setPriceUpper(newPriceUpper);
      }

      if(Number(priceUpper)){
      const newPriceLower = (1/Number(priceUpper)).toString();
        setPriceLowerEntered(newPriceLower);
        // setPriceLower(newPriceLower);
      }

      if(Number(priceCurrent)){
      const newPriceCurrent = (1/Number(priceCurrent)).toString();
        setPriceCurrentEntered(newPriceCurrent);
        // setPriceCurrent(newPriceCurrent);
      }

      if(decimalDifference){
        setDecimalDifference(-1 * decimalDifference);
      }

      setHandlePricesAfterAdjust(!handlePricesAfterAdjust);
    }
  }

  const handlePriceLower = ()=>{
    if(fee && priceLowerEntered && token0 && token1 && Number(priceLowerEntered) > 0){
      const tick = priceToTick(priceLowerEntered, decimalDifference);
      const nearestTick = nearestUsableTick(tick, TICK_SPACINGS[fee])
      const newPrice = tickToPrice(nearestTick, decimalDifference);

      setPriceLower(newPrice.toString());
      setPriceLowerEntered(newPrice.toString());

      // console.log("🚀 ~ handlePriceLower ~ newPrice:", newPrice)
    }
    else{
      setPriceLower("");
    }
  }

  const handlePriceUpper = ()=>{
    if(fee && priceUpperEntered && token0 && token1 && Number(priceUpperEntered) > 0){
      const tick = priceToTick(priceUpperEntered, decimalDifference);
      const nearestTick = nearestUsableTick(tick, TICK_SPACINGS[fee])
      const newPrice = tickToPrice(nearestTick, decimalDifference);

      setPriceUpper(newPrice.toString());
      setPriceUpperEntered(newPrice.toString());
      // console.log("🚀 ~ handlePriceUpper ~ newPrice:", newPrice) 
    }
    else{
      setPriceUpper("");
    }
  }

  const handlePriceCurrent = ()=>{
    if(fee && priceCurrentEntered && token0 && token1 && Number(priceCurrentEntered) > 0){
      // const tick = priceToTick(priceCurrentEntered, decimalDifference);
      // // // console.log("🚀 ~ handlePriceCurrent ~ tick:", tick, priceCurrentEntered);

      
      // const nearestTick = nearestUsableTick(tick, TICK_SPACINGS[fee])
      // const newPrice = tickToPrice(nearestTick, decimalDifference);

      // setPriceCurrent(newPrice.toString());
      setPriceCurrent(priceCurrentEntered);
      // setPriceCurrentEntered(newPrice.toString());
      // console.log("🚀 ~ handlePriceCurrent ~ newPrice:", newPrice); 
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
    setDeadline("10");
    setSqrtPriceX96("");
    setEmulateError(false);
    setAmount0ToEmulate("");
    setAmount1ToEmulate("");

    setPriceLower("");
    setPriceUpper("");
    setPriceCurrent("");

    setPriceLowerEntered("");
    setPriceUpperEntered("");
    setPriceCurrentEntered("");

    handleButton(false,false);

    setAmountAt0("");
    setAmountAt1("");
    // setIsFullRange(false);
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
    //console.log("🚀 ~ toggleClass ~ isActive:", isActive)
    setIsActive(!isActive);
  };

  const toggleV2Class = () => {
    setVTwo(!vTwo);
    setIsActive(!isActive);

    const currentPath = router.asPath;
    if(activeProtocol === Protocol.V3){
      router.replace(`/add/V2/${token0?.address.contract_address || "token"}/${token1?.address.contract_address || "token"}`);
      // router.push("/add/V2/token/token");
    }
    else{
      router.replace(`/add/V3/${token0?.address.contract_address || "token"}/${token1?.address.contract_address || "token"}`);
      // router.push("/add/V3/token/token");
    }

    // setActiveProtocol(activeProtocol === Protocol.V3 ? Protocol.V2 : Protocol.V3);
  }

  const handleOpenToken = useCallback((tokenNumber : number) => {
    setTokenBeingChosen(tokenNumber);
    setOpenToken(prev => !prev);
  }, []);

  const handleCloseToken = () => setOpenToken(false);

  const router = useRouter();

  const handleGoBack = () => {
    router.replace("/liquidity");
    router.back();
  };

  const handleAddLiquidity = async ()=>{
    if(!token0 || !token1 || !slippageTolerance) return;

    setAddLiquidityRunning(true);
    try{

      const addressToApprove = activeProtocol === Protocol.V3 ? NFPMAddress : v2RouterAddress;

      if(activeProtocol === Protocol.V3){
        await getTokenApproval(token0, addressToApprove, approvalAmount0);
        await getTokenApproval(token1, addressToApprove, approvalAmount1);
      }
      else{
        if(token0.symbol !== "PLS"){
          await getTokenApproval(token0, addressToApprove, approvalAmount0);
          //console.log("🚀 ~ handleAddLiquidity ~ approvalAmount0:", approvalAmount0)
          //console.log("🚀 ~ handleAddLiquidity ~ token0.symbol:", token0.symbol)
        }
        if(token1.symbol !== "PLS"){
          await getTokenApproval(token1, addressToApprove, approvalAmount1);
          //console.log("🚀 ~ handleAddLiquidity ~ approvalAmount1:", approvalAmount1)
        }
      }

      alert("Tokens Approved!");
    }
    catch(error){
      setAddLiquidityRunning(false);
      alert("Error approving tokens");
      console.log(error)
      return;
    }

    const unixDeadline = (Math.floor((Date.now() + Number(deadline) * 60 * 1000) / 1000)).toString();
    if(activeProtocol === Protocol.V2){
      try{
        if(token0 && token1 && amount0Desired && amount1Desired){

          let addLiquidityTxHash : any;

          if(token0.symbol === "PLS" || token1.symbol === "PLS"){
            let amountTokenDesired : string;
            let amountETHDesired : string;
            let PLS : TokenDetails;
            let Token : TokenDetails;

            if(token0.symbol === "PLS"){
              PLS = token0;
              Token = token1;
              amountETHDesired = amount0Desired;
              amountTokenDesired = amount1Desired;
            }
            else{
              PLS = token1;
              Token = token0;
              amountETHDesired = amount1Desired;
              amountTokenDesired = amount0Desired;
            }

            addLiquidityTxHash = await addLiquidityETH(
              Token,
              amountETHDesired,
              amountTokenDesired,
              unixDeadline,
              slippageTolerance
            )
          }
          else{
            addLiquidityTxHash = await addLiquidityV2(
              token0,
              token1,
              amount0Desired,
              amount1Desired,
              unixDeadline,
              slippageTolerance
            )
          }

          alert(`Liquidity added. tx hash : ${addLiquidityTxHash}`);
        }
      }
      catch(error){
        //console.log("Error adding liquidity", error);
        setAddLiquidityRunning(false);
        alert(`Error adding liquidity`);
      }
    }
    else {
      try{
        if(fee && token0 && token1){
          const addLiquidityTxHash = await addLiquidityV3(
            NFPMAddress,
            token0,
            token1,
            tickLower,
            tickUpper,
            amount0Desired,
            amount1Desired,
            amount0Min,
            amount1Min,
            unixDeadline,
            sqrtPriceX96,
            fee,
            isFullRange
          )

          alert(`Liquidity added. tx hash : ${addLiquidityTxHash} `)
        }
      }
      catch(error){
        //console.log("Error adding liquidity", error);
        setAddLiquidityRunning(false);
        alert(`Error adding liquidity`);
      }
    }
    setAddLiquidityRunning(false);
  }

  const handleGettingPoolData = async ()=>{
    if(activeProtocol === Protocol.V2){
      await getPoolRatio();
    }
    else{
      await fetchPoolData();
    }
  }

  const calculate = async ()=>{
    console.log("calculate run")

    if(activeProtocol === Protocol.V2 ){

      if(currentV2PoolRatio){
        await getPoolRatio();
      } 

      if(Number(amount0ToEmulate)){
        setAmount0Desired(amount0ToEmulate.toString())

        let amount1DesiredFromFunction = amount1ToEmulate;
        if(currentV2PoolRatio){
          amount1DesiredFromFunction = calculateV2Amounts(Number(amount0ToEmulate), 0, currentV2PoolRatio).toString();
          setAmount1Desired(amount1DesiredFromFunction.toString())
          setApprovalAmount1(amount1DesiredFromFunction.toString());
        }

        setApprovalAmount0(amount0ToEmulate.toString());

      }
      if(Number(amount1ToEmulate)){
        setAmount1Desired(amount1ToEmulate.toString())

        let amount0DesiredFromFunction = amount0ToEmulate;

        if(currentV2PoolRatio){
          amount0DesiredFromFunction = calculateV2Amounts(0, Number(amount1ToEmulate), currentV2PoolRatio).toString();
          setAmount0Desired(amount0DesiredFromFunction.toString())
          setApprovalAmount0(amount0DesiredFromFunction.toString());
        }

        setApprovalAmount1(amount1ToEmulate.toString());
      }

      if((!Number(amount0ToEmulate) && !Number(amount1ToEmulate))) {
        setAmount0Desired("");
        setAmount1Desired("");
      }

      return;
    }

    if(!priceLower || !priceUpper || !priceCurrent || !fee || !token1 || !token0 || ((!Number(amount0ToEmulate) && !Number(amount1ToEmulate))) || !slippageTolerance) {
      
      if((!Number(amount0ToEmulate) && !Number(amount1ToEmulate))) {
        console.log("🚀 ~ calculate ~ (!Number(amount0ToEmulate) && !Number(amount1ToEmulate)):", (!Number(amount0ToEmulate) && !Number(amount1ToEmulate)))
        setAmount0Desired("");
        setAmount1Desired("");
      }
      return;
    }

    //console.log("Running emulate");
    const result = emulate(
      priceLower, 
      priceUpper,
      priceCurrent,
      fee,
      amount0ToEmulate.toString(),
      amount1ToEmulate.toString(),
      token0,
      token1,
      isSorted,
      slippageTolerance
    );

    console.log('HEllo - ,', result);

    if(result){
      setEmulateError(false);
      if(result.amount0Desired !== "0" && result.amount1Desired !== "0"){
        let {        
          tickLower : tickLowerEmulate,
          tickUpper : tickUpperEmulate,
          amount0Desired : amount0DesiredEmulate,
          amount1Desired : amount1DesiredEmulate,
          amount0Min : amount0MinEmulate,
          amount1Min : amount1MinEmulate,
          sqrtPriceX96 : sqrtPriceX96Emulate
        } =  result

        let amountAt0ToSet = "";
        let amountAt1ToSet = "";

        console.log("🚀 ~ calculate ~ tokenToggleOccured:", tokenToggleOccured)
          console.log("🚀 ~ calculate ~ isSorted:", isSorted)
        // if((isSorted && !tokenToggleOccured) || (!isSorted && tokenToggleOccured)){
        if(isSorted){
          console.log("in if")
          amountAt0ToSet = amount0DesiredEmulate;
          amountAt1ToSet = amount1DesiredEmulate;

          setApprovalAmount0(amount0DesiredEmulate);
          setApprovalAmount1(amount1DesiredEmulate);
        }
        else{
          console.log("in else")
          amountAt0ToSet = amount1DesiredEmulate;
          amountAt1ToSet = amount0DesiredEmulate;

          setApprovalAmount0(amount1DesiredEmulate);
          setApprovalAmount1(amount0DesiredEmulate);
        }

        setAmountAt0(amountAt0ToSet);
        setAmountAt1(amountAt1ToSet);

        setAmount0Desired(expandIfNeeded(amount0DesiredEmulate));
        setAmount1Desired(expandIfNeeded(amount1DesiredEmulate));
        setTickLower(tickLowerEmulate);
        setTickUpper(tickUpperEmulate);
        setAmount0Min(expandIfNeeded(amount0MinEmulate));
        setAmount1Min(expandIfNeeded(amount1MinEmulate));
        setSqrtPriceX96(sqrtPriceX96Emulate);
        // setApprovalAmount0(approvalAmount0ToSet || "");
        // setApprovalAmount1(approvalAmount1ToSet || "");

        // console.log("🚀 ~ calculate ~ sqrtPriceX96Emulate:", sqrtPriceX96Emulate)
        // console.log("🚀 ~ calculate ~ deadlineEmulate:", deadlineEmulate)
        // console.log("🚀 ~ calculate ~ amount1MinEmulate:", amount1MinEmulate)
        // console.log("🚀 ~ calculate ~ amount0MinEmulate:", amount0MinEmulate)
        // console.log("🚀 ~ calculate ~ tickUpperEmulate:", tickUpperEmulate)
        // console.log("🚀 ~ calculate ~ tickLowerEmulate:", tickLowerEmulate)
        // console.log("🚀 ~ calculate ~ amount1DesiredEmulate:", amount1DesiredEmulate)
        // console.log("🚀 ~ calculate ~ amount0DesiredEmulate:", amount0DesiredEmulate)
        // console.log("🚀 ~ calculate ~ amountAt1ToSet:", amountAt1ToSet)
        // console.log("🚀 ~ calculate ~ amountAt0ToSet:", amountAt0ToSet)
      }
    }
    else{
      setAmount0Desired("");
      setAmount1Desired("");
      setEmulateError(true);
    }
  }

  // const updateAmount = useCallback(debounce(async (value : number | string, setFunction : React.Dispatch<React.SetStateAction<string | number>>)=>{
  //     setFunction(value);
  //   }, 300),
  //   []
  // );

  const handleTokenAmountChange = useCallback(
    debounce(async (amountAtIndex : number, value : string) => {
      if (!token0 || !token1) return;
  
      if (!value) {
        flushSync(() => {
          setAmountAt0("");
          setAmountAt1("");
          setAmount0ToEmulate("");
          setAmount1ToEmulate("");
        });
        return;
      }
  
      let amountAt0ToEmulate = "";
      let amountAt1ToEmulate = "";
  
      if (amountAtIndex === 0) {
        amountAt0ToEmulate = value;
        amountAt1ToEmulate = "0";
      } else {
        amountAt0ToEmulate = "0";
        amountAt1ToEmulate = value;
      }
  
      if (isSorted) {
        flushSync(() => {
          setAmount0ToEmulate(amountAt0ToEmulate);
          setAmount1ToEmulate(amountAt1ToEmulate);
        });
      } else {
        flushSync(() => {
          setAmount0ToEmulate(amountAt1ToEmulate);
          setAmount1ToEmulate(amountAt0ToEmulate);
        });
      }
    }, 1000),
    [token0, token1, isSorted]
  );
  

  const handleTokenToggle = ()=>{
    setTokenToggleOccured(!tokenToggleOccured);
  }

  const fetchPoolData = async () => {
    //console.log("🚀 ~ fetchPoolData ~ fetchPoolData: RUNN");
    if (token0 && token1 && fee) {
      const poolDataFromSubgraph: AddLiquidityPoolData = await getPoolData(token0, token1, fee);
      setCurrentPoolData(poolDataFromSubgraph);
      
      let priceCurrentToSet : number | undefined = undefined;
      let priceLowerToSet : number | undefined = undefined;
      let priceUpperToSet : number | undefined = undefined;

      if(poolDataFromSubgraph){
        if(isSorted){
          priceCurrentToSet = Number(poolDataFromSubgraph.token1Price);
        }        
        else{
          priceCurrentToSet = Number(poolDataFromSubgraph.token0Price);
        }
      }

      setPriceCurrent( priceCurrentToSet !== undefined? priceCurrentToSet.toString() : "")
    }
  };

  const getPoolRatio = async ()=>{
    let pairRatio : number | null = null;
      if(token0 && token1){
        pairRatio = await getV2Pair(token0, token1) || null;
      }
    
      setCurrentV2PoolRatio(pairRatio);
  }

  const fetchAllPoolsData = async()=>{
    if(!token0 || !token1) return;
    const pools = await getAllPoolsForTokens(token0, token1);

    let totalLiquidity = 0;
    let liq100=0, liq500=0, liq2500=0, liq10000=0, liq20000=0;
    pools.map((pool : any)=>{

      totalLiquidity += pool.liquidity;
      switch(Number(pool.feeTier)){
        case 100:
          liq100 = pool.liquidity;
          break;
        case 500:
          liq500 = pool.liquidity;
          break;
        case 2500:
          liq2500 = pool.liquidity;
          break;
        case 10000:
          liq10000 = pool.liquidity;
          break;
        case 20000:
          liq20000 = pool.liquidity;
          break;
      }

      setPickPercent100(100 * liq100 / totalLiquidity);
      setPickPercent500(100 * liq500 / totalLiquidity);
      setPickPercent2500(100 * liq2500 / totalLiquidity);
      setPickPercent10000(100 * liq10000 / totalLiquidity);
      setPickPercent20000(100 * liq20000 / totalLiquidity);
    })
  }
  //console.log(renderCount.current);
  useEffect(()=>{
//    renderCount.current++;
    if(token0 && token1){
      fetchAllPoolsData();
      setDecimalDifference(token1.address.decimals - token0.address.decimals);
      setIsSorted(token0.address.contract_address < token1.address.contract_address);
      handleTokenToggle()
    }
  },[])

  useEffect(() => {
      if(token0 && token1){
        handleGettingPoolData();
        calculate();
      }
      //console.log("🚀 ~ [fee]:")
  }, [fee]);

  useEffect(()=>{
      calculate();
  },[priceLower,priceUpper, priceCurrent, amount0ToEmulate, amount1ToEmulate])

  useEffect(()=>{
      if(!token0 || !token1){
        reset();
      }
      else{
        fetchAllPoolsData();
        setDecimalDifference(token1.address.decimals - token0.address.decimals);
        setIsSorted(token0.address.contract_address < token1.address.contract_address);
      }
      //console.log("🚀 ~ token0, token1:")
  },[token0, token1])

  useEffect(()=>{
      if(priceLowerEntered){
        if(isButton){
          setIsButton(false);
          handlePriceLower();
        }
      }
      //console.log("🚀 ~ priceLowerEntered:")
  },[priceLowerEntered])
  
  useEffect(()=>{
      if(priceUpperEntered){
        // setPriceUpper("");
        if(isButton){
          setIsButton(false);
          handlePriceUpper();
        }
        // //console.log("🚀 ~ useEffect ~ priceUpperEntered:", priceUpperEntered)
      }
      //console.log("🚀 ~ priceUpperEntered:")
  },[priceUpperEntered])

  useEffect(()=>{
      if(priceCurrentEntered){
        // setPriceCurrent("");
        if(isButton)
          handlePriceCurrent();
        // //console.log("🚀 ~ useEffect ~ priceCurrentEntered:", priceCurrentEntered)
      }
      //console.log("🚀 ~ priceCurrentEntered:")
  },[priceCurrentEntered])

  useEffect(()=>{
      reset();
      handleGettingPoolData();
      //console.log("🚀 ~ activeProtocol:", activeProtocol)
  },[activeProtocol])

  useEffect(()=>{
      adjustPricesForTokenToggle();
      //console.log("🚀 ~ tokenToggleOccured:", tokenToggleOccured)
  },[tokenToggleOccured])

  useEffect(()=>{
      handlePriceCurrent();
      handlePriceLower();
      handlePriceUpper();
      //console.log("🚀 ~ handlePricesAfterAdjust:", handlePricesAfterAdjust)
  },[handlePricesAfterAdjust])

  useEffect(()=>{
    checkRange()
  },[priceLower,priceUpper,priceCurrent])

  const handleButton = (buttonValue : boolean, fullRangeValue : boolean)=>{

    if(!buttonValue){
      setRangeButtonSelected(null);
    }

    setIsButton(buttonValue);
    setIsFullRange(fullRangeValue);
  }

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
              <BsArrowLeft size={20} /> Your Positions
            </Typography>
          </Box>
          <Box className="al-right">
            {/* <Typography
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
            </Typography> */}

            <Box className="al-calc" sx={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
              {/* <Box>
                <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>0%</Typography>
              </Box> */}
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
                    {/* <Typography
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
                    </Typography> */}
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
                          {pickPercent100}% Pick
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
                          {pickPercent500}% Pick
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
                          {pickPercent2500}% Pick
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
                          {pickPercent10000}% Pick
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
                          {pickPercent20000}% Pick
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

                  {priceRangeErrorIndex === null ? (
                  <>
                    <Box className="inputBox" sx={{ width: '100%', textAlign: 'end' }}>
                      <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center', mb: '10px' }}>
                        <Image src="/images/circle1.svg" alt="circle1" width={20} height={20} />
                        <Typography sx={{ fontSize: '14px', fontWeight: '700', lineHeight: 'normal', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                          {token0 ? token0.name : "Select a Currency"} <Typography component="span" sx={{ ml: '5px', cursor: 'pointer' }}><PiCopy /></Typography>
                        </Typography>
                      </Box>
                      <Box className="inputField">
                        <input autoComplete="off" onChange={(e)=>{
                          if(activeProtocol === Protocol.V3)
                          setAmountAt1("")
                          setAmountAt0(e.target.value);
                          handleTokenAmountChange(0, e.target.value)
                        }} id="token0" type="number" placeholder='0.0' style={{ textAlign: 'end' }} 
                        value={amountAt0}/>
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
                        <input autoComplete="off" onChange={(e)=>{
                          if(activeProtocol === Protocol.V3)
                            setAmountAt0("")
                          setAmountAt1(e.target.value);
                          handleTokenAmountChange(1, e.target.value)
                        }} type="number" id='token1' placeholder='0.0' style={{ textAlign: 'end' }} 
                        value={amountAt1}/>
                        {/* By default this input takes token amount of token 1. If token toggle has occured, then this also needs to be toggled */}
                      </Box>
                    </Box>
                  </>
                  ) : (
                    <Box className="warning-box" sx={{ mb: '15px' }}>
                    <Box sx={{ color: 'var(--secondary)', fontSize: 20 }}>
                      <GoAlertFill />
                    </Box>
                    <Box sx={{ width: 'calc(100% - 30px)', color: 'var(--primary)' }}>
                      {
                        priceRangeErrorIndex === PriceRangeError.BELOW_RANGE || priceRangeErrorIndex === PriceRangeError.ABOVE_RANGE ? (
                          <Typography sx={{ fontWeight: '600' }}>
                            Your position will not earn fees or be used in trades until the market price moves into your range.
                          </Typography>
                        ) : priceRangeErrorIndex === PriceRangeError.INVALID ? (
                          <Typography sx={{ fontWeight: '600' }}>
                            Invalid range selected. The min price must be lower than the max price.
                          </Typography>
                        ) : null
                      }
                    </Box>
                  </Box>
                  )}
                </Box>

            </Box>
            <Box className="al-inner-right">
              {vTwo ? (
                  <Box>
                    <Button 
                      onClick={handleAddLiquidity} 
                      variant="contained" 
                      color="secondary" 
                      sx={{ width: '100%' }}
                      disabled={!amount0Desired || !amount1Desired || !token0 || !token1 || addLiquidityRunning}
                    >
                      {addLiquidityRunning ? <CircularProgress size={25}/> : <>Create Liquidity</>}
                    </Button>
                  </Box>
              ) : (
                  <Box sx={{ display: vTwo ? 'none' : 'block' }}>
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
                        onClick={handleTokenToggle}
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
                          {token1 ? token1.symbol : ""}
                        </Typography>
                      </Box>
                    </Box>

                    {!currentPoolData ? (
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
                              <input type="number" placeholder='0.0' style={{ textAlign: 'end' }} 
                              onBlur={handlePriceCurrent}
                              onChange={(e)=>{
                                setPriceCurrentEntered(e.target.value)
                              }} value={ priceCurrentEntered }/>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    ) : (
                      <Box>
                        {token0 && token1 ? (
                          <Box sx={{ display: 'flex', gap: '5px', justifyContent: 'center', mb: '15px' }}>
                          <Typography sx={{ color: 'var(--cream)', fontSize: '12px' }}>Current Price:</Typography>
                          <Typography sx={{ color: 'var(--cream)', fontSize: '12px' }}>{priceCurrent}</Typography>
                          <Typography sx={{ color: 'var(--cream)', fontSize: '12px' }}>{token1.name} Per {token0.name}</Typography>
                        </Box>
                        ) : (
                          <Box sx={{ display: 'flex', gap: '5px', justifyContent: 'center', mb: '15px' }}>
                          <Typography sx={{ color: 'var(--cream)', fontSize: '12px' }}>Select Currency</Typography>
                        </Box>
                        )}
                                
                        <Box sx={{ textAlign: 'center', minHeight: '200px', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', }}>
                          <SlGraph size={50} />
                          {/* <Default/> */}
                          <Typography sx={{ fontSize: '18px', fontWeight: '600' }}>Your position will appear here.</Typography>
                        </Box>
                      </Box>
                      )
                    }      
    
                    {token0 && token1 ? (
                      <Box sx={{ display: 'flex', gap: '15px', justifyContent: 'space-between', mb: '30px' }}>
                        <Typography sx={{ fontWeight: '600' }}>Current {token1.name} Price Per {token0.name}:</Typography>
                        <Typography sx={{ fontWeight: '600' }}>{priceCurrent}</Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', gap: '15px', justifyContent: 'space-between', mb: '30px' }}>
                        <Typography sx={{ fontWeight: '600' }}></Typography>
                      </Box>
                    )}
    
    
                    <Box className="viewPrice" sx={{ display: 'flex', gap: '15px', justifyContent: 'space-between', mb: '15px' }}>
                      {/* free_tier */}
                      <Box className="free_tier" sx={{ bgcolor: palette.mode === 'light' ? 'var(--gray)' : 'var(--secondary-dark)', width: '50%', textAlign: 'center' }}>
                        <Typography sx={{ fontWeight: '600' }}>Min Price</Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box><FaMinus onClick={()=>{handleButton(false,false);setPriceLowerEntered((Number(priceLower ? priceLower : priceLowerEntered) - 0.0001).toString()); handlePriceLower() }}/></Box>
                          <Box className="inputBox" sx={{ width: '100%', my: '15px' }}>
                            <input type="text" placeholder="0.0" style={{ textAlign: 'center' }} onBlur={handlePriceLower} onChange={(e)=>{handleButton(false,false);setPriceLowerEntered(e.target.value)}} value={isFullRange ? "0" : priceLowerEntered}/>
                          </Box>
                          <Box><FaPlus onClick={()=>{handleButton(false,false);setPriceLowerEntered((Number(priceLower ? priceLower : priceLowerEntered) + 0.0001).toString()); handlePriceLower()}}/></Box>
                        </Box>

                        {token0 && token1 ? (
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                            <Typography sx={{ fontWeight: '600' }}>{token1.symbol}</Typography>
                            <Typography sx={{ fontWeight: '600' }}>Per</Typography>
                            <Typography sx={{ fontWeight: '600' }}>{token0.symbol}</Typography>
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
                          <Box><FaMinus onClick={()=>{handleButton(false,false);setPriceUpperEntered((Number(priceUpper ? priceUpper : priceUpperEntered) - 0.0001).toString()); handlePriceUpper()}}/></Box>
                          <Box className="inputBox" sx={{ width: '100%', my: '15px' }}>
                            <input type="text" placeholder="0.0" style={{ textAlign: 'center' , fontSize: isFullRange ? '1.5em' : '1em'}} onBlur={handlePriceUpper} onChange={(e)=>{handleButton(false,false);setPriceUpperEntered(e.target.value)}} value={isFullRange ? "∞" : priceUpperEntered}/>
                          </Box>
                          <Box><FaPlus onClick={()=>{handleButton(false,false);setPriceUpperEntered((Number(priceUpper ? priceUpper : priceUpperEntered) + 0.0001).toString()); handlePriceUpper()}}/></Box>
                        </Box>

                        {token0 && token1 ? (
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                            <Typography sx={{ fontWeight: '600' }}>{token1.symbol}</Typography>
                            <Typography sx={{ fontWeight: '600' }}>Per</Typography>
                            <Typography sx={{ fontWeight: '600' }}>{token0.symbol}</Typography>
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
                    <Box 
                        onClick={()=>{
                          if(!priceCurrent) return;

                          setRangeButtonSelected(RANGES[0]);
                          //console.log("CLicked")
                          setPriceLowerEntered(calculateRange(Number(priceCurrent), -10));
                          setPriceUpperEntered(calculateRange(Number(priceCurrent), 10));

                          handleButton(true, false);
                          // setIsFullRange(false)                 
                        }}
                        sx={{
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
                          color: palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)',
                          backgroundColor: rangeButtonSelected === RANGES[0] ? 'var(--cream)' : 'transparent', // Set a highlight color
                          borderColor: rangeButtonSelected === RANGES[0] ? 'var(--cream)' : palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)'                          
                        }}
                      >
                        10%
                      </Box>

                      <Box 
                        onClick={()=>{
                          if(!priceCurrent) return;
                          setRangeButtonSelected(RANGES[1]);
                          //console.log("CLicked")
                          setPriceLowerEntered(calculateRange(Number(priceCurrent), -20));
                          setPriceUpperEntered(calculateRange(Number(priceCurrent), 20));
                          handleButton(true, false);
                          // setIsFullRange(false)
                        }}
                        sx={{
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
                          color: palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)',
                          bgcolor: rangeButtonSelected === RANGES[1] ? 'var(--cream)' : 'transparent', // Set a highlight color
                          borderColor: rangeButtonSelected === RANGES[1] ? 'var(--cream)' : palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)'                          
                        }}
                      >
                        20%
                      </Box>
                      <Box 
                        onClick={()=>{
                          if(!priceCurrent) return;
                          setRangeButtonSelected(RANGES[2]);
                          //console.log("CLicked")
                          setPriceLowerEntered(calculateRange(Number(priceCurrent), -50));
                          setPriceUpperEntered(calculateRange(Number(priceCurrent), 50));
                          handleButton(true, false);
                          // setIsFullRange(false)                              
                        }}
                        sx={{
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
                          color: palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)',
                          bgcolor: rangeButtonSelected === RANGES[2] ? 'var(--cream)' : 'transparent', // Set a highlight color
                          borderColor: rangeButtonSelected === RANGES[2] ? 'var(--cream)' : palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)'                          
                        }}
                      >
                        50%
                      </Box>
                      <Box 
                        onClick={()=>{
                          setRangeButtonSelected(RANGES[3]);
                          const newPriceLower = tickToPrice(MIN_TICK, decimalDifference);
                          setPriceLowerEntered(newPriceLower.toString());
                          const newPriceUpper = tickToPrice(MAX_TICK, decimalDifference);
                          setPriceUpperEntered(newPriceUpper.toString());

                          handleButton(true, true);
                          // setIsFullRange(true);                          
                        }}
                        sx={{
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
                          color: palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)',
                          bgcolor: rangeButtonSelected === RANGES[3] ? 'var(--cream)' : 'transparent', // Set a highlight color
                          borderColor: rangeButtonSelected === RANGES[3] ? 'var(--cream)' : palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)'

                        }}
                      >
                        Full Range
                      </Box>

                    </Box>

                    <Box>
                      <Button onClick={handleAddLiquidity} variant="contained" color="secondary" sx={{ width: '100%' }} disabled={!amount0Desired && !amount1Desired || !token0 || !token1 || addLiquidityRunning}>
                        {addLiquidityRunning ? <CircularProgress size={25}/> : <>Create Liquidity</>}
                      </Button>
                    </Box>
                  </Box>
              )}
          </Box>
        </Box>
      </Box>
      {/* <SelectedToken
          openToken={openToken}
          handleCloseToken={handleCloseToken}
          mode={theme} // Ensure `theme` is passed correctly
          setToken0={setToken0}
          setToken1={setToken1}
          tokenNumber={tokenBeingChosen}
          description='' 
          token0={token0} 
          token1={token1}      /> */}

      {/* <RoiCalculator open={open} handleClose={handleClose} /> */}
      <SettingsModal 
        isOpen={open} 
        handleClose={handleClose} 
        theme={theme} 
        slippageTolerance={slippageTolerance} 
        setSlippageTolerance={setSlippageTolerance}
        deadline={deadline}
        setDeadline={setDeadline}
      />
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