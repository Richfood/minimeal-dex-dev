## Contract Deployment
Copy node_modules to all three folders (V2, V3 and stable swap)
Update the .dev.env. Add values as
MAINNET=https://rpc.pulsechain.com
TESTNET=https://rpc.v4.testnet.pulsechain.com
PRIVATE_KEY=<YOUR_PRIVATE_KEY>

## Deploy V2 Contracts - 
### For Testnet - 
    npm run deploy:testnet
    Deploy custom ERC20 tokens for testing - npx hardhat run scripts/deploy.allTokens.testnet.js --network localhost
### For Mainnet - 
    npm run deploy:mainnet

## Deploy StableSwap Contracts - 
### For Testnet - 
    npm run deploy:testnet
### For Mainnet - 
    npm run deploy:mainnet

## Deploy V3 Contracts - 
### For Testnet - 
    npm run deploy:testnet
    npm run addFee:testnet
    npm run setFactory:testnet
    npm run deploy-extra:testnet
### For Mainnet - 
    npm run deploy:mainnet
    npm run addFee:mainnet
    npm run setFactory:mainnet
    npm run deploy-extra:mainnet

##  Graph Node
### Prerequisites

To build and run this project you need to have the following installed on your system:

- Rust (latest stable) – [How to install Rust](https://www.rust-lang.org/en-US/install.html)
  - Note that `rustfmt`, which is part of the default Rust installation, is a build-time requirement.
- PostgreSQL – [PostgreSQL Downloads](https://www.postgresql.org/download/)
- IPFS – [Installing IPFS](https://docs.ipfs.io/install/)
- Profobuf Compiler - [Installing Protobuf](https://grpc.io/docs/protoc-installation/)

### Docker
Inside the graph-node/docker folder
#### Change docker-compose.yml - 
    - Change environment for graph-node 
        - postgres_host
        - postgres_user
        - postgres_pass
        - postgres_db
        - ethereum (chain_name:chain_rpc)
    - Change environment for postgres
        - POSTGRES_USER
        - POSTGRES_PASSWORD
        - POSTGRES_DB
#####Make sure you have docker-compose installed. 
#####To start the docker setup run `docker-compose up`

## Subgraph V2
run `yarn install`
    - Change subgraph.yaml
        - Factory
            - address
            - startBlock
    - Change /src/mappings/helpers.ts
        - FACTORY_ADDRESS
    - Deploy on graph-node- 
        - yarn codegen
        - yarn build
        - yarn create-local
        - yarn deploy-local

## Subgraph V3
run `yarn-install`
    - Change subgraph.yml
        - Factory
            - address
            - startBlock
        - NonfungiblePositionManager
            - address
            - startBlock
        - Constants.ts (addresses in lower case)
        - utils/tick.ts
            - in the feeTierToTickSpacing function, add if condition for 20,000 fee with tick spacing as 4000
    - Deploy on graph-node -  
        - yarn codegen
        - yarn build
        - yarn create-local
        - yarn deploy-local
    - To add additional stable tokens and WPLS-stable pool addresses
        - Add Stable Token addresses and WPLS-{stable token} addresses in Constants.ts
        - Add the tokens from the Constants.ts to the WHITELIST_TOKENS array
        - Add the stable token addresses to the STABLE_COINS array

## sdk-core
    - Copy testnet/mainnet addresses in src/contractAddresses.ts
    - Change src/chains
        - For Testnet - change chainId enum. PULSE = 943
        - For Testnet - change chainId enum. PULSE = 369
        - change NativeCurrencyName enum (tPLS/PLS)
## v3-sdk
    Copy Testnet/Mainnet addresses in src/contractAddresses.json
## v2-sdk
    Copy Testnet/Mainnet addresses in src/addresses.json
## Router-API
run `npm install`

### Make Build for v3-sdk, v2-sdk, sdk-core and move to to node_modules of smart-order-router and router-api
## Smart-Order-Router
    IMPORTANT : For smart order router to work, there must be atleast WPLS/USDC pool for each V3 and V2.
    Copy testnet/mainnet addresses in src/contractAddresses.json
    Change subgraph address in src/providers/v3/subgraph-provider
    Change src/util/chains.ts
        Change case: 943(testnet) / 369(mainnet) in the ID_TO_CHAIN_ID for pulse
        Change NativeCurrencyName. (tPLS/PLS)
        Change case: 943(testnet) / 369(mainnet) in the ID_TO_NETWORK_NAME for pulse
        Change ID_TO_PROVIDER (RPC)
    For Mainnet 
        Change the MOCK_USDC address to actual USDC Address
        Add USDT Address in contractAddresses.ts, Change src/providers/token-provider.ts USDT_PULSE Token address

## Router-API
    - For testnet : npm run start:testnet
    - For mainnet : npm run start:mainnet

## Front-End
Copy contract addresses in addresses.json inside /src/utils
For testnet, Copy custom token addresses in famousTokenTestnet.json
- pnpm install
- For local development - pnpm run dev
- For production pnpm run build & pnpm run start
