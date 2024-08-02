import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Box, Typography, Button } from '@mui/material';
import { VscArrowSwap } from 'react-icons/vsc';
import { TbArrowsDiagonal, TbArrowsDiagonalMinimize2 } from 'react-icons/tb';
import { ApexOptions } from 'apexcharts';
import { useTheme } from '../../components/ThemeContext';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface SeriesData {
    name: string;
    data: { x: number; y: number }[];
}

interface SwapGraphsProps {
    zoomed: boolean;
    onClick: () => void;
}

const generateInitialData = (interval: '24Hours' | '1Week' | '1Month' | '1Year') => {
    const now = Date.now();
    const dataPoints: { x: number; y: number }[] = [];
    const intervalInMs = {
        '24Hours': 24 * 60 * 60 * 1000,
        '1Week': 7 * 24 * 60 * 60 * 1000,
        '1Month': 30 * 24 * 60 * 60 * 1000,
        '1Year': 365 * 24 * 60 * 60 * 1000,
    }[interval];

    for (let i = 0; i < 10; i++) {
        const timestamp = now - (i * intervalInMs) / 10;
        dataPoints.push({ x: timestamp, y: Math.floor(Math.random() * 100) });
    }

    return dataPoints;
};

const SwapGraph = ({ zoomed, onClick }: SwapGraphsProps) => {
    const { theme } = useTheme();
    const [timeInterval, setTimeInterval] = useState<'24Hours' | '1Week' | '1Month' | '1Year'>('24Hours');
    const [selectedGraph, setSelectedGraph] = useState<'graph1' | 'graph2'>('graph1');
    const [activeCurrency, setActiveCurrency] = useState('PLS/9MM');
    const [circleImages, setCircleImages] = useState({
        circle1: '/images/circle1.svg',
        circle2: '/images/circle2.svg',
    });
    const [currentValue, setCurrentValue] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<string>('');

    const [series, setSeries] = useState<SeriesData[]>([
        { name: 'Graph 1', data: generateInitialData('24Hours') },
        { name: 'Graph 2', data: generateInitialData('24Hours') },
    ]);

    useEffect(() => {
        setSeries([{ name: selectedGraph === 'graph1' ? 'Graph 1' : 'Graph 2', data: generateInitialData(timeInterval) }]);
    }, [timeInterval, selectedGraph]);

    useEffect(() => {
        const timerId = setInterval(() => setCurrentTime(new Date().toISOString()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const options: ApexOptions = {
        chart: {
            height: zoomed ? 500 : 350,  // Adjust height based on zoom state
            type: 'area',
            events: {
                dataPointMouseEnter: (event, chartContext, { w, seriesIndex, dataPointIndex }) => {
                    setCurrentValue(w.globals.series[seriesIndex][dataPointIndex]);
                },
            },
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth' },
        yaxis: { labels: { style: { colors: theme === 'light' ? 'var(--primary)' : 'var(--light)' } } },
        xaxis: {
            type: 'datetime',
            categories: series[0]?.data.map(point => new Date(point.x).toISOString()),
            labels: { style: { colors: theme === 'light' ? 'var(--primary)' : 'var(--light)' } },
        },
        tooltip: {
            x: { format: 'dd/MM/yy HH:mm' },
            y: { formatter: val => val.toFixed(2) },
        },
        colors: selectedGraph === 'graph1' ? ['#D1AC70'] : ['#FF5733'],
    };

    const handleIntervalChange = useCallback((newInterval: '24Hours' | '1Week' | '1Month' | '1Year') => {
        setTimeInterval(newInterval);
    }, []);

    const toggleGraph = useCallback(() => {
        setSelectedGraph(prev => prev === 'graph1' ? 'graph2' : 'graph1');
        setCircleImages(prev => ({
            circle1: prev.circle1 === '/images/circle1.svg' ? '/images/circle2.svg' : '/images/circle1.svg',
            circle2: prev.circle2 === '/images/circle2.svg' ? '/images/circle1.svg' : '/images/circle2.svg',
        }));
        setActiveCurrency(prev => prev === 'PLS/9MM' ? '9MM/PLS' : 'PLS/9MM');
    }, []);

    return (
        <Box>
            <Box className="chart_info">
                <Box className="chart_top" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '15px' }}>
                    <Box className="chart_swap" sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <img src={circleImages.circle1} alt="Circle 1" />
                            <img src={circleImages.circle2} alt="Circle 2" />
                        </Box>
                        <Box className="chart_title" sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Typography variant="h6">{activeCurrency}</Typography>
                            <VscArrowSwap onClick={toggleGraph} />
                        </Box>
                    </Box>
                    <Box>
                        <Box className="chart_resize" onClick={onClick} sx={{ display: zoomed ? 'block' : 'none' }}>
                            <TbArrowsDiagonalMinimize2 />
                        </Box>
                        <Box className="chart_resize" onClick={onClick} sx={{ display: !zoomed ? 'block' : 'none' }}>
                            <TbArrowsDiagonal />
                        </Box>
                    </Box>
                </Box>

                <Box className="chart_bottom" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '50px'}}>
                    <Box className="chart_data">
                        <Box sx={{ display: 'flex', gap: '5px', alignItems: 'flex-end' }}>
                            <Typography variant="h1" className='currentValue'>{currentValue.toFixed(2)}</Typography>
                            <Typography variant="h4" className='sec_title'>{activeCurrency}</Typography>
                            <Typography sx={{ color: '#00A413' }} variant="h4">+0.001(9.53%)</Typography>
                        </Box>
                        <Typography className='currentTime' sx={{ fontSize: '12px', color: 'var(--cream)', fontWeight: '600' }}>
                            {currentTime}
                        </Typography>
                    </Box>
                    <Box className="toolbar-button">
                        <Button className={timeInterval === '24Hours' ? 'active' : ''} onClick={() => handleIntervalChange('24Hours')}>24h</Button>
                        <Button className={timeInterval === '1Week' ? 'active' : ''} onClick={() => handleIntervalChange('1Week')}>1w</Button>
                        <Button className={timeInterval === '1Month' ? 'active' : ''} onClick={() => handleIntervalChange('1Month')}>1m</Button>
                        <Button className={timeInterval === '1Year' ? 'active' : ''} onClick={() => handleIntervalChange('1Year')}>1y</Button>
                    </Box>
                </Box>
            </Box>

            <ReactApexChart options={options} series={series} type="area" height={zoomed ? 500 : 350} />
        </Box>
    );
};

export default SwapGraph;
