import React from 'react';
import { ThemeProvider } from '../components/ThemeContext'; 
import { CssBaseline } from '@mui/material'; 
import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <QueryClientProvider client={queryClient}> 
            <ThemeProvider>
                <CssBaseline />
                        <Component {...pageProps} />
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default MyApp;
