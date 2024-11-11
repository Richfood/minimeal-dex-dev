import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, CircularProgress, Link, Typography, useTheme } from '@mui/material';
import { BsArrowLeft } from 'react-icons/bs';
import { IoSettingsOutline } from 'react-icons/io5';
import { IoIosArrowDown } from 'react-icons/io';
import { HiPlus } from 'react-icons/hi2';
import SelectedToken from '../SelectToken/SelectedToken';
import { PiCopy } from "react-icons/pi";
import Image from 'next/image';
import { useRouter } from 'next/router';
import RoiCalculator from '../RoiCalculator/RoiCalculator'
import { toast, ToastContainer } from 'react-toastify';
import getTokenApproval from "../../utils/contract-methods/getTokenApproval";
import { addLiquidityV3, addLiquidityV2, addLiquidityETH } from '@/utils/contract-methods/addLiquidity';
import emulate from '@/utils/emulate-addLiquidity';
import { FeeAmount, nearestUsableTick, TICK_SPACINGS } from '@uniswap/v3-sdk';
import addresses from "../../utils/address.json";
import { expandIfNeeded, isNative, truncateAddress } from '@/utils/generalFunctions';
import { priceToTick, tickToPrice } from '@/utils/utils';
import Default from '../CustomChart/Default';
import { getV2Pair } from '@/utils/api/getV2Pair';
import { AddLiquidityPoolData, TokenDetails, Protocol } from '@/interfaces';
import SettingsModal from '../SettingModal/SettingModal-addLiquidity';
import { calculateV2Amounts } from '@/utils/calculateV2TokenAmounts';
import famousTokenTestnet from "../../utils/famousTokenTestnet.json";
import famousToken from "../../utils/famousToken.json";
const { useChainId } = hooks;
import { hooks } from '../ConnectWallet/connector';

interface AddLiquidityProps {
  theme: 'light' | 'dark';
  defaultActiveProtocol: Protocol;
}

// interface AddLiquidityLoader {
//   tokenApproval0: boolean,
//   tokenApproval1: boolean,
//   addLiquidity: boolean
// }

// enum PriceRangeError {
//   INVALID,
//   BELOW_RANGE,
//   ABOVE_RANGE
// }

const AddLiquidityV2: React.FC<AddLiquidityProps> = ({ theme }) => {

  const { palette } = useTheme();
  const [isActive, setIsActive] = useState(true);
  const [openToken, setOpenToken] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const v2RouterAddress = addresses.PancakeV2RouterAddress;
  const [token0, setToken0] = useState<TokenDetails | null>(null);
  const [token1, setToken1] = useState<TokenDetails | null>(null);
  const [amount0Desired, setAmount0Desired] = useState("");
  const [amount1Desired, setAmount1Desired] = useState("");
  const [tokenBeingChosen, setTokenBeingChosen] = useState(0);
  const [currentV2PoolRatio, setCurrentV2PoolRatio] = useState<number | null>(null);
  const [isSorted, setIsSorted] = useState<boolean>(true);
  const [addLiquidityRunning, setAddLiquidityRunning] = useState(false);
  const [slippageTolerance, setSlippageTolerance] = useState<number | null>(1);
  const [deadline, setDeadline] = useState("10");
  const chainId = useChainId();

  console.log("🚀 ~ slippageTolerance:", slippageTolerance)
  console.log("🚀 ~ deadline:", deadline)

  useEffect(() => {
    const isTestnet = chainId === 943;
    console.log("🚀 ~ useEffect ~ isTestnet:", isTestnet)

    const tokenData = isTestnet ? famousTokenTestnet : famousToken;

    if (tokenData.length > 0) {
      setToken0(tokenData[9]);
      setToken1(tokenData[10]);
    }
  }, [chainId]);

  const toggleClass = () => {
    //console.log("🚀 ~ toggleClass ~ isActive:", isActive)
    setIsActive(!isActive);
  };

  const toggleV2Class = () => {
    setIsActive(!isActive);
    router.replace(`/add/V3/${token0?.address.contract_address || "token"}/${token1?.address.contract_address || "token"}`);
  }

  const handleOpenToken = useCallback((tokenNumber: number) => {
    setTokenBeingChosen(tokenNumber);
    setOpenToken(prev => !prev);
  }, []);

  const handleCloseToken = () => setOpenToken(false);

  const router = useRouter();

  const handleGoBack = () => {
    router.replace("/liquidity");
    router.back();
  };

  const handleAddLiquidity = async () => {
    if (!token0 || !token1 || !slippageTolerance) return;

    setAddLiquidityRunning(true);
    try {

      const addressToApprove = v2RouterAddress;

      if (!isNative(token0)) {
        await getTokenApproval(token0, addressToApprove, amount1Desired);
      }
      if (!isNative(token1)) {
        await getTokenApproval(token1, addressToApprove, amount0Desired);
      }

      alert("Tokens Approved!");
    }
    catch (error) {
      setAddLiquidityRunning(false);
      alert("Error approving tokens");
      console.log(error)
      return;
    }

    const unixDeadline = (Math.floor((Date.now() + Number(deadline) * 60 * 1000) / 1000)).toString();
    try {
      if (token0 && token1 && amount0Desired && amount1Desired) {
        console.log("🚀 ~ handleAddLiquidity ~ amount1Desired:", amount1Desired)
        console.log("🚀 ~ handleAddLiquidity ~ amount0Desired:", amount0Desired)
        console.log("🚀 ~ handleAddLiquidity ~ token1:", token1)
        console.log("🚀 ~ handleAddLiquidity ~ token0:", token0)

        let addLiquidityTxHash: any;

        if (token0.symbol === "PLS" || token1.symbol === "PLS") {
          let amountTokenDesired: string;
          let amountETHDesired: string;
          let PLS: TokenDetails;
          let Token: TokenDetails;

          if (token0.symbol === "PLS") {
            PLS = token0;
            Token = token1;
            amountETHDesired = amount0Desired;
            amountTokenDesired = amount1Desired;
          }
          else {
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
        else {
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
    catch (error) {
      //console.log("Error adding liquidity", error);
      setAddLiquidityRunning(false);
      alert(`Error adding liquidity`);
    }
    setAddLiquidityRunning(false);
  }

  const handleGettingPoolData = async () => {
    await getPoolRatio();
  }

  const calculate = async (value: string, inputBox: number) => {
    console.log("calculate run V2")

    if (value === "") {
      setAmount0Desired('');
      setAmount1Desired('');
      return;
    }

    if (currentV2PoolRatio) {
      if (inputBox === 0) {
        const amount1DesiredToSet = calculateV2Amounts(Number(value), 0, currentV2PoolRatio, isSorted);
        setAmount0Desired(value);
        setAmount1Desired(amount1DesiredToSet.toString());
      }
      else {
        const amount0DesiredToSet = calculateV2Amounts(0, Number(value), currentV2PoolRatio, isSorted);
        setAmount0Desired(amount0DesiredToSet.toString());
        setAmount1Desired(value);
      }
    }
    else {
      if (inputBox === 0) {
        setAmount0Desired(value);
      }
      else {
        setAmount1Desired(value);
      }
    }

    return;
  }

  const getPoolRatio = async () => {
    let pairRatio: number | null = null;
    if (token0 && token1) {
      pairRatio = await getV2Pair(token0, token1) || null;
    }
    console.log("🚀 ~ getPoolRatio ~ pairRatio:", pairRatio)
    setCurrentV2PoolRatio(pairRatio);
  }

  useEffect(() => {
    if (token0 && token1) {
      getPoolRatio();
      setIsSorted(token0.address.contract_address < token1.address.contract_address);
    }
  }, [])

  useEffect(() => {
    getPoolRatio();
  }, [token0, token1])

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

  return (
    <Box className="AddLiquiditySec">
      <Box className="white_box" sx={{ maxWidth: '600px', margin: '0 auto' }}>
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

          <Box className="al-inner" sx={{ display: 'flex', justifyContent: 'center !important' }}>

            <Box className="al-inner-left" sx={{ flex: '100% !important' }}>
              <Box sx={{ mb: "15px" }}>
                <Typography className='mainTitle' sx={{ color: 'var(--cream)' }}>CHOOSE TOKEN PAIR</Typography>
                <Box className="token-sec">
                  <Box className="token-pair" onClick={() => { handleOpenToken(0) }} sx={{ cursor: 'pointer', color: palette.mode === 'light' ? 'var(--black)' : 'var(--white)', bgcolor: palette.mode === 'light' ? 'var(--light_clr)' : 'var(--secondary-dark)' }}>
                    <Box>
                      {token0 && (
                        <Box sx={{ display: "flex", gap: "5px" }}>
                          <img src={token0?.logoURI} alt="logoURI" style={{ width: '20px', height: '20px' }} />
                          <Typography sx={{ fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginTop: "2px" }}>
                            {token0.symbol}</Typography>
                        </Box>

                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IoIosArrowDown size={17} />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <HiPlus size={20} />
                  </Box>
                  <Box onClick={() => { handleOpenToken(1) }} className="token-pair" sx={{ cursor: 'pointer', color: palette.mode === 'light' ? 'var(--black)' : 'var(--white)', bgcolor: palette.mode === 'light' ? 'var(--light_clr)' : 'var(--secondary-dark)' }}>
                    <Box>
                      {token1 && (
                        <Box sx={{ display: "flex", gap: "5px" }}>
                          <img src={token1?.logoURI} alt="logoURI" style={{ width: '20px', height: '20px' }} />
                          <Typography sx={{ fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginTop: "2px" }}>
                            {token1.symbol}</Typography>
                        </Box>

                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IoIosArrowDown size={17} />
                    </Box>
                  </Box>
                </Box>

              </Box>
              <Box className={`${isActive ? '' : 'active'} free_tier`} sx={{ mb: "30px", bgcolor: palette.mode === 'light' ? 'var(--gray)' : 'var(--secondary-dark)' }}>
                <Box className="ft_head">
                  <Box sx={{ textAlign: 'start' }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: '500', mb: '15px' }}>
                      V2 LP - 0.25% Fee
                    </Typography>
                  </Box>
                  <Box>
                    <Link onClick={toggleClass} sx={{ textDecoration: 'none', fontSize: '12px', fontWeight: '700', color: palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)', cursor: 'pointer', display: isActive ? 'none' : 'flex', gap: '5px' }}> More <IoIosArrowDown size={15} /></Link>
                    <Link onClick={toggleClass} sx={{ textDecoration: 'none', fontSize: '12px', fontWeight: '700', color: palette.mode === 'light' ? 'var(--primary)' : 'var(--cream)', cursor: 'pointer', display: isActive ? 'flex' : 'none', gap: '5px' }}> Hide</Link>
                  </Box>
                </Box>
                <Box className="ftcardBoxOuter" sx={{ display: isActive ? "block" : "none" }}>
                  <Box className="fiFooter" sx={{ display: 'block', mt: '30px' }}>
                    <Link onClick={toggleV2Class} sx={{ fontSize: '14px', fontWeight: '600', cursor: 'pointer', p: "8px 16px", borderRadius: "30px", background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', textDecoration: 'none' }}>Add V3 Liquidity</Link>
                  </Box>
                </Box>
              </Box>

              <Box className="SwapWidgetInner" sx={{ maxWidth: '100% !important', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column', gap: '15px' }}>

                <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                  <Typography className="mainTitle" sx={{ color: 'var(--cream)', textAlign: 'start', }}>DEPOSIT AMOUNT</Typography>
                </Box>

                <Box className="inputBox" sx={{ width: '100%', textAlign: 'end' }}>
                  <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center', mb: '10px' }}>
                    <img src={token0?.logoURI} alt="logoURI" style={{ width: '20px', height: '20px' }} />
                    <Typography sx={{ fontSize: '14px', fontWeight: '700', lineHeight: 'normal', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                      onClick={() => copyToClipboard(token0?.address?.contract_address)}

                    >                      {token0 ? token0.symbol : "Select a Currency"} <Typography component="span" sx={{ ml: '5px', cursor: 'pointer' }}><PiCopy /></Typography>
                    </Typography>
                  </Box>
                  <Box className="inputField">
                    <input autoComplete="off" onChange={(e) => {
                      calculate(e.target.value, 0);
                    }} id="token0" type="number" placeholder='0.0' style={{ textAlign: 'end' }}
                      value={amount0Desired} />
                  </Box>
                </Box>


                <Box className="inputBox" sx={{ width: '100%', textAlign: 'end' }}>
                  <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center', mb: '10px' }}>
                    <img src={token1?.logoURI} alt="logoURI" style={{ width: '20px', height: '20px' }} />
                    <Typography sx={{ fontSize: '14px', fontWeight: '700', lineHeight: 'normal', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                      onClick={() => copyToClipboard(token1?.address?.contract_address)}>{token1 ? (token1.symbol) : "Select a Currency"} <Typography component="span" sx={{ ml: '5px', cursor: 'pointer' }}><PiCopy /></Typography>
                    </Typography>
                  </Box>
                  <Box className="inputField">
                    <input autoComplete="off" onChange={(e) => {
                      calculate(e.target.value, 1);
                    }} type="number" id='token1' placeholder='0.0' style={{ textAlign: 'end' }}
                      value={amount1Desired} />
                  </Box>
                </Box>


                <Box sx={{ display: "flex", justifyContent: 'space-between', width: '100%' }}>
                  <Typography sx={{ fontSize: '14px' }}>Price:</Typography>
                  <Typography sx={{ fontSize: '14px' }}>24534323</Typography>
                </Box>

                <Box sx={{ width: '100%' }}>
                  <Button
                    onClick={handleAddLiquidity}
                    variant="contained"
                    color="secondary"
                    sx={{ width: '100%' }}
                    disabled={!amount0Desired || !amount1Desired || !token0 || !token1 || addLiquidityRunning}
                  >
                    {addLiquidityRunning ? <CircularProgress size={25} /> : <>Create Liquidity</>}
                  </Button>
                </Box>


              </Box>
            </Box>

          </Box>
        </Box>

        <SelectedToken
          openToken={openToken}
          handleCloseToken={handleCloseToken}
          mode={theme}
          setToken0={setToken0}
          setToken1={setToken1}
          tokenNumber={tokenBeingChosen}
          description=''
          token0={token0}
          token1={token1}
        />

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

export default AddLiquidityV2;