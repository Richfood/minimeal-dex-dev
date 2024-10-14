import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import { Box, Typography } from '@mui/material'
import React from 'react'

export function Account() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! })

  return (
    // <Box>
      <Typography>{address && `${ensName ? `${ensName} (${address})` : address}`}</Typography>
      // {/* <div>
      //   {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
        
      // </div> */}
    // </Box>
  )
}