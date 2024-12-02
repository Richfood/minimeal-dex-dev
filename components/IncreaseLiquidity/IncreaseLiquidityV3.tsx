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
import getTokenApproval from "../../utils/contract-methods/getTokenApproval";
import { addLiquidityV3, addLiquidityV2, addLiquidityETH } from '@/utils/contract-methods/addLiquidity';
import emulate from '@/utils/emulate-addLiquidity';
import { FeeAmount, nearestUsableTick, TICK_SPACINGS } from '@uniswap/v3-sdk';
import addresses from "../../utils/address.json";
import { expandIfNeeded, isNative, makeTokenFromInfo, truncateAddress } from '@/utils/generalFunctions';
import { priceToTick, tickToPrice } from '@/utils/utils';
import Default from '../CustomChart/Default';
import { getPoolData } from '@/utils/api/getPoolData';
import { getV2Pair } from '@/utils/api/getV2Pair';
import { AddLiquidityPoolData, TokenDetails, Protocol, V3PositionData } from '@/interfaces';
import SettingsModal from '../SettingModal/SettingModal-addLiquidity';
import tokenList from "../../utils/tokenList.json";
import { calculateV2Amounts } from '@/utils/calculateV2TokenAmounts';
import { debounce } from '@syncfusion/ej2-base';
import { flushSync } from 'react-dom';
import { useCall } from 'wagmi';
import { getAllPoolsForTokens } from '@/utils/api/getAllPoolsForTokens';
import famousTokenTestnet from "../../utils/famousTokenTestnet.json";
import famousToken from "../../utils/famousToken.json";
const { useChainId } = hooks;
import { hooks } from '../ConnectWallet/connector';
import {getUserBalance, getUserNativeBalance} from '@/utils/api/getUserBalance';
import { increaseLiquidityV3 } from '@/utils/contract-methods/increaseLiquidity';
import { getPositionByTokenId } from '@/utils/api/getPositionByTokenId';
import { ethers } from 'ethers';

interface IncreaseLiquidityProps {
  theme: 'light' | 'dark';
  tokenId: string;
}

interface AddLiquidityLoader {
  tokenApproval0: boolean,
  tokenApproval1: boolean,
  addLiquidity: boolean
}

enum PriceRangeError {
  INVALID,
  BELOW_RANGE,
  ABOVE_RANGE
}

/*
  token0,
  token1,
  priceUpper,
  tickUpper,
  priceLower,
  tickLower,
  priceCurrent,
  tickCurrent,
  fee,
  tokenId
*/

interface IncreaseLiquidityParams {
  token0: TokenDetails;
  token1: TokenDetails;
  priceUpper: string;
  priceLower: string;
  priceCurrent: string;
  fee: FeeAmount;
  tokenId: BigInt;
}

const IncreaseLiquidityV3: React.FC<IncreaseLiquidityProps> = ({
  theme, tokenId
}) => {
  const { palette } = useTheme();
  const [isActive, setIsActive] = useState(true);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [openToken, setOpenToken] = useState(false);
  const [tier, setTier] = useState<string>('0.01%');

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const NFPMAddress = addresses.PancakePositionManagerAddress;
  const [amount0Desired, setAmount0Desired] = useState("");
  const [amount1Desired, setAmount1Desired] = useState("");
  const [approvalAmount0, setApprovalAmount0] = useState("");
  const [approvalAmount1, setApprovalAmount1] = useState("");
  const [amount0Min, setAmount0Min] = useState("");
  const [amount1Min, setAmount1Min] = useState("");
  const [amount0ToEmulate, setAmount0ToEmulate] = useState<number | string>("");
  const [amount1ToEmulate, setAmount1ToEmulate] = useState<number | string>("");

  const [token0, setToken0] = useState<TokenDetails | null>(null);
  const [token1, setToken1] = useState<TokenDetails | null>(null);
  const [priceUpper, setPriceUpper] = useState<string | null>(null);
  const [priceLower, setPriceLower] = useState<string | null>(null);
  const [priceCurrent, setPriceCurrent] = useState<string | null>(null);
  const [fee, setFee] = useState<FeeAmount | null>(null);

  const [positionLoading, setPositionLoading] = useState(true);
  const [positionLoadingError, setPositionLoadingError] = useState(false);

  const [tokenBalance0, setTokenBalance0] = useState<string>("");
  const [tokenBalance1, setTokenBalance1] = useState<string>("");

  const [slippageTolerance, setSlippageTolerance] = useState<number | null>(1);
  const [deadline, setDeadline] = useState("10");

  const [increaseLiquidityRunning, setIncreaseLiquidityRunning] = useState(false);
  const [userAddress, setUserAddress] = useState("");

  const toggleClass = () => {
    setIsActive(!isActive);
  };

  const handleCloseToken = () => setOpenToken(false);

  const router = useRouter();

  const handleGoBack = () => {
    if (!tokenId) return;

    router.replace(`/position/${tokenId.toString()}`);
    router.back();
  };

  const handleIncreaseLiquidity = async () => {
    if (!token0 || !token1 || !slippageTolerance || !amount0Desired || !amount1Desired || !priceCurrent || !priceUpper || !priceLower) return;

    setIncreaseLiquidityRunning(true);
    try {

      const addressToApprove = NFPMAddress;

      if (!isNative(token0)) {
        await getTokenApproval(token0, addressToApprove, amount0Desired);
      }
      if (!isNative(token1)) {
        await getTokenApproval(token1, addressToApprove, amount1Desired);
      }

      alert("Tokens Approved!");
    }
    catch (error) {
      setIncreaseLiquidityRunning(false);
      alert("Error approving tokens");
      console.log(error)
      return;
    }

    const unixDeadline = (Math.floor((Date.now() + Number(deadline) * 60 * 1000) / 1000)).toString();

    try {
      if (fee && token0 && token1 && tokenId) {
        const addLiquidityTxHash = await increaseLiquidityV3(
          NFPMAddress,
          token0,
          token1,
          BigInt(tokenId),
          amount0Desired,
          amount1Desired,
          slippageTolerance,
          unixDeadline
        )

        alert(`Liquidity added. tx hash : ${addLiquidityTxHash} `)
      }
    }
    catch (error) {
      console.log("Error increasing liquidity", error);
      setIncreaseLiquidityRunning(false);
      alert(`Error Increasing liquidity`);
    }
    setIncreaseLiquidityRunning(false);
  }

  const getFeeAmountFromFee = (fee: string): FeeAmount => {
    switch (fee) {
      case "100":
        return FeeAmount.LOWEST;
      case "500":
        return FeeAmount.LOW;
      case "2500":
        return FeeAmount.MEDIUM;
      case "10000":
        return FeeAmount.HIGH;
      case "20000":
        return FeeAmount.HIGHEST;
      default:
        return FeeAmount.HIGH;
    }
  }

  const calculate = async () => {

    if (!token0 || !token1 || !slippageTolerance || !priceCurrent || !priceUpper || !priceLower || !fee) return;

    console.log("calculate run");

    let result: any = undefined;
    try {
      result = emulate(
        priceLower,
        priceUpper,
        priceCurrent,
        fee,
        amount0ToEmulate.toString(),
        amount1ToEmulate.toString(),
        token0,
        token1,
        true,
        slippageTolerance,
      );

      console.log('HEllo - ,', result);
    }
    catch (error) {
      console.log("Emulate Error", error);
    }
    if (result) {
      if (result.amount0Desired !== "0" && result.amount1Desired !== "0") {
        let {
          tickLower: tickLowerEmulate,
          tickUpper: tickUpperEmulate,
          amount0Desired: amount0DesiredEmulate,
          amount1Desired: amount1DesiredEmulate,
          amount0Min: amount0MinEmulate,
          amount1Min: amount1MinEmulate,
          sqrtPriceX96: sqrtPriceX96Emulate
        } = result

        setAmount0Desired(expandIfNeeded(amount0DesiredEmulate));
        setAmount1Desired(expandIfNeeded(amount1DesiredEmulate));
        setAmount0ToEmulate(expandIfNeeded(amount0DesiredEmulate));
        setAmount1ToEmulate(expandIfNeeded(amount1DesiredEmulate));
      }
    }
    else {
      setAmount0Desired("");
      setAmount1Desired("");
    }
  }

  useEffect(() => {
    const getUserAddress = async () => {
        try {
            const newProvider = new ethers.providers.Web3Provider(window.ethereum);
            const newSigner = newProvider.getSigner();
            const userAddressToSet = await newSigner.getAddress();
            setUserAddress(userAddressToSet);
        } catch (error) {
            console.error("Error fetching user address:", error);
            setUserAddress("");
        }
    };

    if (window.ethereum) {
        getUserAddress();

        // Listen for account changes
        const handleAccountsChanged = (accounts : any[]) => {
            if (accounts.length > 0) {
                setUserAddress(accounts[0]);
            } else {
                setUserAddress(""); // User disconnected wallet
            }
        };

        // Add event listener
        window.ethereum.on("accountsChanged", handleAccountsChanged);

        // Cleanup the event listener on unmount
        return () => {
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        };
    } else {
        setUserAddress("");
    }
}, []); // Dependency array empty so it runs once on mount


  useEffect(() => {
    const getPosition = async () => {
      try {
        setPositionLoading(true);
        const positionToUse = await getPositionByTokenId(tokenId, userAddress);

        if (!positionToUse) throw("Position not found");

        const token0ToUse: TokenDetails = makeTokenFromInfo({
          name : positionToUse.token0.name,
          symbol : positionToUse.token0.symbol,
          address : positionToUse.token0.id,
          decimals : positionToUse.token0.decimals
        })
    
        const token1ToUse: TokenDetails = makeTokenFromInfo({
          name : positionToUse.token1.name,
          symbol : positionToUse.token1.symbol,
          address : positionToUse.token1.id,
          decimals : positionToUse.token1.decimals
        })

        const decimalDifference = Number(positionToUse.token1.decimals) - Number(positionToUse.token0.decimals);
        const currentTick = Number(positionToUse.pool.tick);
        const lowerTick = Number(positionToUse.tickLower.tickIdx);
        const upperTick = Number(positionToUse.tickUpper.tickIdx);

        setToken0(token0ToUse);
        setToken1(token1ToUse);
        setPriceCurrent(tickToPrice(currentTick, decimalDifference).toString());
        setPriceLower(tickToPrice(lowerTick, decimalDifference).toString());
        setPriceUpper(tickToPrice(upperTick, decimalDifference).toString());
        setFee(getFeeAmountFromFee(positionToUse.pool.feeTier));
      }
      catch (error) {
        console.log(error);
        setPositionLoadingError(true);
        setPositionLoading(false);
      }

      setPositionLoading(false);
      setPositionLoadingError(false);
    }

    getPosition()

  }, [tokenId,userAddress])

  useEffect(() => {
    const getUserBalances = async () => {
      if (token0 && token1) {
        const token0Balance = isNative(token0) ? await getUserNativeBalance() : await getUserBalance(token0);
        const token1Balance = isNative(token1) ? await getUserNativeBalance() : await getUserBalance(token1);

        setTokenBalance0(token0Balance);
        setTokenBalance1(token1Balance);
      }
    }

    getUserBalances();
  }, [amount0Desired, amount1Desired]);

  useEffect(() => {
    // console.log("inside useeffec")
    const runCalculate = async () => {
      await calculate();
    }

    runCalculate();
  }, [amount0ToEmulate, amount1ToEmulate])

  const copyToClipboard = (text: string | undefined) => {
    console.log("🚀 ~ copyToClipboard ~ text:", text)
    if (!text || text.trim() === "") {
      alert("Empty address");
    }
    else {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          alert("Address copied to clipboard!");
        }).catch(err => {
          console.error("Failed to copy text to clipboard", err);
        });
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
          alert("Address copied to clipboard!");
        } catch (err) {
          console.error("Failed to copy text to clipboard", err);
        }
        document.body.removeChild(textArea);
      }
    }

  };


  console.log("=========== ", tokenBalance0, tokenBalance1);
  return (
    <>
      {positionLoading || positionLoadingError ? (
        <Box component="main" sx={{ minHeight: "calc(100vh - 150px)" }}>
          <Box
            sx={{
              maxWidth: "800px",
              margin: "0 auto",
              py: "50px",
              px: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: "16px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              {positionLoadingError
                ? "Unable to Fetch Position. Please Refresh to Try Again"
                : <>Loading Position... <CircularProgress size={20} /></>}
            </Typography>
          </Box>
        </Box>
      ) : (
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
                <Box className="al-calc" sx={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
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
                      <Box className="token-pair" sx={{ cursor: 'pointer', color: palette.mode === 'light' ? 'var(--black)' : 'var(--white)', bgcolor: palette.mode === 'light' ? 'var(--light_clr)' : 'var(--secondary-dark)' }}>
                        <Box>
                          {token0 && (
                            <Box sx={{ display: "flex", gap: "5px" }}>
                              <img src={token0?.logoURI} alt="logoURI" style={{ width: '20px', height: '20px' }} />
                              <Typography sx={{ fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginTop: "2px" }}>
                                {token0.symbol}</Typography>
                            </Box>

                          )}
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <HiPlus size={20} />
                      </Box>
                      <Box className="token-pair" sx={{ cursor: 'pointer', color: palette.mode === 'light' ? 'var(--black)' : 'var(--white)', bgcolor: palette.mode === 'light' ? 'var(--light_clr)' : 'var(--secondary-dark)' }}>
                        <Box>
                          {token1 && (
                            <Box sx={{ display: "flex", gap: "5px" }}>
                              <img src={token1?.logoURI} alt="logoURI" style={{ width: '20px', height: '20px' }} />
                              <Typography sx={{ fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginTop: "2px" }}>
                                {token1.symbol}</Typography>
                            </Box>

                          )}
                        </Box>
                      </Box>
                    </Box>

                  </Box>
                  <Box className={`${isActive ? 'active' : ''} free_tier`} sx={{ mb: "30px", bgcolor: palette.mode === 'light' ? 'var(--gray)' : 'var(--secondary-dark)' }}>

                    <Box className="ft_head">
                      <Box sx={{ textAlign: 'start' }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: '500', mb: '15px' }}>
                          {fee ? `Fee : ${fee / 10000}%` : "V3 LP"}
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
                    </Box>

                    {/* <Box className="ftcardBoxOuter" sx={{ display: isActive ? "block" : "none" }}>
                      <Box className="ftcardBox" sx={{ display: "block" }}>
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

                      <Box className="ftV2sec" sx={{ display: "none", alignItems: 'center', justifyContent: 'space-between', mt: '15px' }}>
                        <Button variant="outlined" sx={{ width: 'calc(50% - 10px)', bgcolor: 'rgba(246, 180, 27, 0.1)' }} color="secondary">V2 LP</Button>
                      </Box>

                      <Box className="fiFooter" sx={{ display: 'block', mt: '30px' }}>
                        <Typography onClick={toggleV2Class} sx={{ fontSize: '14px', fontWeight: '600', cursor: 'pointer', p: "8px 16px", borderRadius: "30px", background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', textDecoration: 'none' }}>Add V2 Liquidity</Typography>
                      </Box>
                    </Box> */}
                  </Box>

                  <Box className="SwapWidgetInner" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column', gap: '15px' }}>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                      <Typography className="mainTitle" sx={{ color: 'var(--cream)', textAlign: 'start', }}>DEPOSIT AMOUNT</Typography>
                    </Box>

                    <Box className="inputBox" sx={{ width: '100%', textAlign: 'end' }}>
                      <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center', mb: '10px' }}>
                        <img src={token0?.logoURI} alt="logoURI" style={{ width: '20px', height: '20px' }} />
                        <Typography sx={{ fontSize: '14px', fontWeight: '700', lineHeight: 'normal', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                          onClick={() => copyToClipboard(token0?.address?.contract_address)}

                        >
                          {token0 && token0.symbol} <Typography component="span" sx={{ ml: '5px', cursor: 'pointer' }}><PiCopy /></Typography>
                        </Typography>
                      </Box>
                      <Box className="inputField">
                        <input autoComplete="off" onChange={(e) => {
                          setAmount0ToEmulate(e.target.value)
                          // handleTokenAmountChange(0, e.target.value)
                        }} id="token0" type="number" placeholder='0.0' style={{ textAlign: 'end' }}
                          value={amount0ToEmulate} />
                      </Box>
                    </Box>


                    <Box className="inputBox" sx={{ width: '100%', textAlign: 'end' }}>
                      <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center', mb: '10px' }}>
                        <img src={token1?.logoURI} alt="logoURI" style={{ width: '20px', height: '20px' }} />
                        <Typography sx={{ fontSize: '14px', fontWeight: '700', lineHeight: 'normal', display: 'flex', alignItems: 'center' }}
                          onClick={() => copyToClipboard(token1?.address?.contract_address)}

                        >
                          {token1 && (token1.symbol)} <Typography component="span" sx={{ ml: '5px', cursor: 'pointer' }}><PiCopy /></Typography>
                        </Typography>
                      </Box>
                      <Box className="inputField">
                        <input autoComplete="off" onChange={(e) => {
                          setAmount1ToEmulate(e.target.value)
                          // handleTokenAmountChange(1, e.target.value)
                        }} type="number" id='token1' placeholder='0.0' style={{ textAlign: 'end' }}
                          value={amount1ToEmulate} />
                      </Box>
                    </Box>
                  </Box>

                </Box>
                <Box className="al-inner-right">
                  <Box sx={{ display: 'block' }}>
                    <Box sx={{ display: 'flex', gap: '15px', justifyContent: 'space-between', mb: "15px" }}>
                      <Box sx={{ width: '50%' }}>
                        <Typography sx={{ color: 'var(--cream)', fontWeight: '600' }}>SET PRICE RANGE</Typography>
                      </Box>
                      {/* <Box sx={{ width: '50%', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: "end" }}>
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
                      </Box> */}
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', gap: '5px', justifyContent: 'center', mb: '15px' }}>
                        <Typography sx={{ color: 'var(--cream)', fontSize: '12px' }}>Current Price:</Typography>
                        <Typography sx={{ color: 'var(--cream)', fontSize: '12px' }}>{priceCurrent}</Typography>
                        <Typography sx={{ color: 'var(--cream)', fontSize: '12px' }}>{token1?.symbol} Per {token0?.symbol}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: '15px', justifyContent: 'space-between', mb: '30px' }}>
                      <Typography sx={{ fontWeight: '600' }}>Current {token1?.symbol} Price Per {token0?.symbol}:</Typography>
                      <Typography sx={{ fontWeight: '600', color: palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)' }}>{priceCurrent}</Typography>
                    </Box>


                    <Box className="viewPrice" sx={{ display: 'flex', gap: '15px', justifyContent: 'space-between', mb: '15px' }}>
                      {/* free_tier */}
                      <Box className="free_tier" sx={{ bgcolor: palette.mode === 'light' ? 'var(--gray)' : 'var(--secondary-dark)', width: '50%', textAlign: 'center' }}>
                        <Typography sx={{ fontWeight: '600' }}>Min Price</Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box className="inputBox" sx={{ width: '100%', my: '15px' }}>
                            <input type="text" placeholder="0.0" style={{ textAlign: 'center', color: palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)' }} value={priceLower || ""} />
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                          <Typography sx={{ fontWeight: '600' }}>{token1?.symbol}</Typography>
                          <Typography sx={{ fontWeight: '600' }}>Per</Typography>
                          <Typography sx={{ fontWeight: '600' }}>{token0?.symbol}</Typography>
                        </Box>
                      </Box>

                      <Box className="free_tier" sx={{ bgcolor: palette.mode === 'light' ? 'var(--gray)' : 'var(--secondary-dark)', width: '50%', textAlign: 'center' }}>
                        <Typography sx={{ fontWeight: '600' }}>Max Price</Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box className="inputBox" sx={{ width: '100%', my: '15px' }}>
                            <input type="text" placeholder="0.0" style={{ textAlign: 'center', color: palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)', fontSize: '1em' }} value={priceUpper || ""} />
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                          <Typography sx={{ fontWeight: '600' }}>{token1?.symbol}</Typography>
                          <Typography sx={{ fontWeight: '600' }}>Per</Typography>
                          <Typography sx={{ fontWeight: '600' }}>{token0?.symbol}</Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box>
                      <Button onClick={handleIncreaseLiquidity} variant="contained" color="secondary" sx={{ width: '100%' }} disabled={!amount0Desired && !amount1Desired || !token0 || !token1 || increaseLiquidityRunning || Number(tokenBalance0) < Number(amount0Desired) || Number(tokenBalance1) < Number(amount1Desired)}>
                        {increaseLiquidityRunning ? (
                          <CircularProgress size={25} />
                        ) : (
                          Number(tokenBalance0) < Number(amount0Desired) || Number(tokenBalance1) < Number(amount1Desired) ? (
                            <>Insufficient Balance</>
                          ) : (
                            <>Increase Liquidity</>
                          )
                        )}

                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
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
      )}
    </>
  );
};

export default IncreaseLiquidityV3;