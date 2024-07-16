// pages/_app.tsx
import React from 'react';
import { ThemeProvider } from '../components/ThemeContext'; 
import { CssBaseline } from '@mui/material'; 
import '../styles/globals.css'

import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider>
            <CssBaseline /> {/* Apply baseline CSS reset */}
            <Component {...pageProps} />
        </ThemeProvider>
    );
}

export default MyApp;
