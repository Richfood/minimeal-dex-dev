import { ThemeOptions } from '@mui/material/styles';

export interface CustomThemeOptions extends ThemeOptions {
    body: {
        backgroundColor: string;
        color: string;
        lightClassName?: string;
        darkClassName?: string;
    };
}

export const lightTheme: CustomThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#6200EE',
        },
        secondary: {
            main: '#03DAC6',
        },
        background: {
            default: '#f7f0df',
        },
    },
    typography: {
        fontFamily: 'Epilogue, sans-serif',
        fontSize: 14,
    },
    body: {
        backgroundColor: '#F7F0DF',
        color: '#173D3D',
        lightClassName: 'light-theme',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    fontWeight: 'bold',
                    borderRadius: '8px',
                },
            },
        },
        
    },
    
};

export const darkTheme: CustomThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#BB86FC',
        },
        secondary: {
            main: '#03DAC6',
        },
        background: {
            default: 'radial-gradient(#173D3D,#092626)',
            paper: '#1F1F1F',
        },
    },
    typography: {
        fontFamily: 'Epilogue, sans-serif',
        fontSize: 14,
    },
    body: {
        backgroundColor: '#121212',
        color: '#FFFFFF',
        darkClassName: 'dark-theme',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    fontWeight: 'bold',
                    borderRadius: '8px',
                },
            },
        },
    },
};