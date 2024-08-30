import React from 'react'
import { Box } from '@mui/material'
import RewardCard from '../../components/RewardCard/RewardCard'



const index = () => {
  return (
    <Box className="sunRewards">
      <Box className="customContainer">
        <Box className="customRow">
          <Box className="customCol">
            <Box className="rewardBox">
              <RewardCard />
            </Box>
          </Box>
          <Box className="customCol">
          <Box className="rewardBox yellow-box">
             
            </Box>
          </Box>
          <Box className="customCol">
            3
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default index