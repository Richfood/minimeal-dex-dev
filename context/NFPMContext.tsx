import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ethers, Signer, Contract } from 'ethers';
const NFPMAbi = require("../abis/NonfungiblePositionManager.sol/NonfungiblePositionManager.json").abi;


// Define the types for the context
interface ContractContextProps {
  provider: ethers.providers.Web3Provider | null;
  signer: Signer | null;
  contract: Contract | null;
  account: string | null;
  contractAddress : string | null;
}

// Create the context with default values
const ContractContext = createContext<ContractContextProps>({
  provider: null,
  signer: null,
  contract: null,
  account: null,
  contractAddress : null

});

// Contract ABI and address (replace with your contract's details)
const CONTRACT_ABI = NFPMAbi
const CONTRACT_ADDRESS = '0x78D691DBF010421d206FC67cb16E75F8797Aca52';

interface ContractProviderProps {
  children: ReactNode;
}

// Provider Component
export const NFPMContractProvider = ({ children }: ContractProviderProps) => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  // Initialize ethers and the contract
  useEffect(() => {
    const initializeProvider = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(newProvider);

        const newSigner = newProvider.getSigner();
        setSigner(newSigner);

        const newContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, newSigner);
        setContract(newContract);

        const accounts = await newProvider.send('eth_requestAccounts', []);
        setAccount(accounts[0]);
      }
    };

    initializeProvider();
  }, []);

  return (
    <ContractContext.Provider value={{ provider, signer, contract, account, contractAddress : CONTRACT_ADDRESS }}>
      {children}
    </ContractContext.Provider>
  );
};

// Custom hook to use the ContractContext
export const useContract = () => useContext(ContractContext);
