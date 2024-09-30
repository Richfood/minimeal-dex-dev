import React from 'react';
import { ThemeProvider } from '../components/ThemeContext'; 
import { CssBaseline } from '@mui/material'; 
import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '../wagmi-config'
import { NFPMContractProvider } from '@/context/NFPMContext';

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}> 
                <ThemeProvider>
                    <CssBaseline />
                    <NFPMContractProvider>
                        <Component {...pageProps} />
                    </NFPMContractProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

export default MyApp;
