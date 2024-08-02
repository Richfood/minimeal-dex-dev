import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  RangeNavigatorComponent, AreaSeries, ChartTheme, DateTime, Inject, RangeTooltip,
  RangenavigatorSeriesCollectionDirective, RangenavigatorSeriesDirective, IRangeLoadedEventArgs
} from '@syncfusion/ej2-react-charts';
import { bitCoinData } from './default-data'; // Ensure this file exists
import { useTheme } from '../ThemeContext';

// Define the types
interface ThemeData {
  borderColor: string[];
  regionColor: string[];
  gradientId: string;
}

interface Themes {
  light: ThemeData;
  dark: ThemeData;
}

// Define your color arrays
const themes: Themes = {
  light: {
    borderColor: ['#exampleLightColor1', '#exampleLightColor2'],
    regionColor: ['rgba(255, 255, 255, 0.3)', 'rgba(200, 200, 200, 0.3)'],
    gradientId: 'light-gradient-chart'
  },
  dark: {
    borderColor: ['#exampleDarkColor1', '#exampleDarkColor2'],
    regionColor: ['rgba(0, 0, 0, 0.3)', 'rgba(50, 50, 50, 0.3)'],
    gradientId: 'dark-gradient-chart'
  }
};

const Default = () => {
  const themeContext = useTheme(); 
  const themeMode: keyof Themes = themeContext.mode; // Ensure `themeMode` is a key of `Themes`
  const themeData = themes[themeMode]; // Access theme data based on mode

  return (
    <Box className='control-pane' sx={{ p: 2 }}>
      <Typography variant="h6" align="center" sx={{ mb: 2 }}>
        Bitcoin (USD) Price Range
      </Typography>
      <Box className='control-section' sx={{ textAlign: 'center' }}>
        <RangeNavigatorComponent
          id='rangenavigator'
          valueType='DateTime'
          load={load}
          tooltip={{ enable: true, displayMode: 'Always', format: 'MM/dd/yyyy' }}
          navigatorStyleSettings={{
            unselectedRegionColor: 'transparent'
          }}
          labelFormat='MMM-yy'
          width='100%'
          value={[new Date('2017-09-01'), new Date('2018-02-01')]}
        >
          <Inject services={[AreaSeries, DateTime, RangeTooltip]} />
          <RangenavigatorSeriesCollectionDirective>
            <RangenavigatorSeriesDirective
              dataSource={bitCoinData} 
              xName='x'
              yName='y'
              type='Area'
              width={2}
              border={{ width: 2 }} 
            />
          </RangenavigatorSeriesCollectionDirective>
        </RangeNavigatorComponent>
      </Box>
      <svg style={{ height: '0' }}>
        <defs>
          <linearGradient id={themeData.gradientId} style={{ opacity: 0.75 }} className="chart-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" />
            <stop offset="1" />
          </linearGradient>
        </defs>
      </svg>
    </Box>
  );

  function load(args: IRangeLoadedEventArgs): void {
    if (args.rangeNavigator) {
      const rangeTheme = themeContext.mode as ChartTheme;
      args.rangeNavigator.theme = rangeTheme.charAt(0).toUpperCase() + rangeTheme.slice(1) as ChartTheme;

      if (args.rangeNavigator.series && args.rangeNavigator.series.length > 0) {
        const series = args.rangeNavigator.series[0];
        if (series) {
          series.fill = `url(#${themeData.gradientId})`;
          if (series.border) {
            series.border.color = themeData.borderColor[0]; // Example for a single color
            args.rangeNavigator.navigatorStyleSettings.selectedRegionColor = themeData.regionColor[0]; // Example for a single color
          } else {
            console.warn('Series border is undefined');
          }
        }
      }
    }
  }
};

export default Default;
