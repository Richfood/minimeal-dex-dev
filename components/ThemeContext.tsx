import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, Theme } from '@mui/material/styles';
import { Switch } from '@mui/material';
import Button from '@mui/material/Button';
import { lightTheme, darkTheme } from './theme'; // Import light and dark themes

type ThemeContextType = {
  mode: 'light' | 'dark'; // Adjusted type to match possible values
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  mode: 'light', // Provide default mode
  toggleTheme: () => { },
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setCurrentTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const theme: Theme = createTheme({
    ...(currentTheme === 'light' ? lightTheme : darkTheme),
    palette: {
      mode: currentTheme,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: currentTheme === 'light' ? lightTheme.body.backgroundColor : darkTheme.body.backgroundColor,
            color: currentTheme === 'light' ? lightTheme.body.color : darkTheme.body.color,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '30px',
            padding: '10px 20px',
            lineHeight: '14px',
            fontSize: '14px',
            fontWeight: '700',
            color: 'var(--primary)',
          },
          containedPrimary: {
            backgroundColor: 'var(--secondary)',
            borderColor: 'var(--secondary)',
            '&:hover': {
              backgroundColor: 'var(--secondary)',
              borderColor: 'var(--secondary)',
            },
          },
          containedSecondary: {
            backgroundColor: 'var(--secondary)',
            borderColor: 'var(--secondary)',
            padding: '17px 30px',
            '&:hover': {
              backgroundColor: 'var(--secondary)',
              borderColor: 'var(--secondary)',
            },
          },
          outlined: {
            borderColor: 'var(--secondary)',
            color: 'var(--secondary)',
            '&:hover': {
              borderColor: 'var(--secondary)',
              backgroundColor: 'rgba(246, 180, 27, 0.1)',
            },
          },
          outlinedPrimary: {
            borderColor: 'var(--secondary)',
            color: 'var(--secondary)',
            '&:hover': {
              borderColor: 'var(--secondary)',
              backgroundColor: 'rgba(246, 180, 27, 0.1)',
            },
          },
          outlinedSecondary: {
            borderColor: 'var(--secondary)',
            color: 'var(--secondary)',
            '&:hover': {
              borderColor: 'var(--secondary)',
              backgroundColor: 'rgba(246, 180, 27, 0.1)',
            },
          },
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            maxWidth: '1270px !important',
            padding: '0 15px !important',
          },
        },
      },
      MuiBackdrop: {
        styleOverrides: {
          root: {
           
            backgroundColor: currentTheme === 'light' ? 'rgba(0,0,0,0.5)': 'rgba(255,255,255,0.5)',
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            fontSize: '14px',
          },
        },
      },
      MuiBadge: {
        styleOverrides: {
          dot: {
            backgroundColor: '#FF5630',
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: 'unset',
            border: 'unset',
            minHeight: 'unset',
            padding: '5px',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              color: 'var(--primary)',
              fontWeight: 600,
              background: 'var(--white)',
              borderRadius: '5px',
            },
            minHeight: 'unset',
            textTransform: 'unset',
            padding: '8px 5px',
          },
        },
      },
    },
  });

  useEffect(() => {
    document.body.classList.toggle('dark-mode', currentTheme === 'dark');
    document.body.classList.toggle('light-mode', currentTheme === 'light');
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, mode: currentTheme, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Example usage of the switch in a component
export const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Switch
      checked={theme === 'dark'}
      onChange={toggleTheme}
      inputProps={{ 'aria-label': 'toggle dark/light theme' }}
    />
  );
};

// Example usage of a custom button in a component
export const MyComponent: React.FC = () => {
  return (
    <div>
      <h1>My Themed Button</h1>
      <Button variant="contained" color="primary">
        This button has disabled ripples.
      </Button>
      <Button variant="contained" color="secondary">
        Secondary Button
      </Button>
      <Button variant="outlined" color="secondary">
        Secondary Outline Button
      </Button>
    </div>
  );
};
