#!/bin/bash

#give permission for everything in the express-app directory
sudo chmod -R 777 /home/ubuntu/minimeal-dex-dev

#navigate into our working directory where we have all our github files
cd /home/ubuntu/minimeal-dex-dev

#add npm and node to path
export NVM_DIR="$HOME/.nvm" 
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # loads nvm 
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # loads nvm bash_completion (node is in path now)

rm -rf node_modules

#install node modules
npm install --force

cp -r v3-sdk node_modules/@uniswap/

npm run build

#start our node app in the background
export PORT=5000
export APP_NAME="dev-dex-frontend"
export APP_CWD=$TARGET_FOLDER

if pm2 describe "$APP_NAME" &> /dev/null; then
  echo "Restarting existing PM2 process: $APP_NAME"
  pm2 restart "$APP_NAME"
else
  echo "Starting new PM2 process: $APP_NAME"
  APP_NAME=dev-dex-frontend APP_CWD=/home/ubuntu/minimeal-dex-dev PORT=5000 pm2 start pm2.config.js --watch
fi