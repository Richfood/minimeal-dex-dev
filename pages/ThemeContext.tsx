import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, Theme } from '@mui/material/styles';
import { Switch } from '@mui/material';
import Button from '@mui/material/Button';

import { lightTheme, darkTheme } from './theme'; // Import light and dark themes

// Define types for theme and context
type ThemeContextType = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

// Create context with initial values
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light', // Default theme
  toggleTheme: () => {},
});

// Custom Provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setCurrentTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Create theme based on current theme mode
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
            color: 'var(--primary)'
          },
          containedPrimary: {
            backgroundColor: '#F6B41B',

            '&:hover': {
              backgroundColor: '#F6B41B',
            },
          },
          containedSecondary: {
            backgroundColor: '#F6B41B',
            padding: '17px 30px',

            '&:hover': {
              backgroundColor: '#F6B41B',
            },
          },
        },
      },

      MuiContainer: {
        styleOverrides: {
          root: {
            maxWidth: '1230px',
            padding: '0 15px'
          }
        }
      }
    },
  });

  useEffect(() => {
    // Add class to body based on theme
    document.body.classList.toggle('dark-mode', currentTheme === 'dark');
    document.body.classList.toggle('light-mode', currentTheme === 'light');
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
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
    </div>
  );
};
