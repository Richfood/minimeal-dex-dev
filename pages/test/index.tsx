import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { Button, Box } from '@mui/material';

// Dynamically import the ApexCharts component
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface SeriesData {
    name: string;
    data: { x: number; y: number }[];
}

// Function to generate data based on interval
const generateInitialData = (interval: '24Hours' | '1Week' | '1Month' | '1Year') => {
    const now = new Date().getTime();
    const dataPoints: { x: number; y: number }[] = [];
    const intervalInMs = {
        '24Hours': 24 * 60 * 60 * 1000,
        '1Week': 7 * 24 * 60 * 60 * 1000,
        '1Month': 30 * 24 * 60 * 60 * 1000,
        '1Year': 365 * 24 * 60 * 60 * 1000,
    };

    const intervalMs = intervalInMs[interval];
    const numberOfPoints = 10;

    for (let i = 0; i < numberOfPoints; i++) {
        const timestamp = now - (i * intervalMs) / numberOfPoints;
        const value = Math.floor(Math.random() * 100);
        dataPoints.push({ x: timestamp, y: value });
    }

    return dataPoints;
};

const ChartComponent = () => {
    const [interval, setInterval] = useState<'24Hours' | '1Week' | '1Month' | '1Year'>('24Hours');
    const [selectedGraph, setSelectedGraph] = useState<'graph1' | 'graph2'>('graph1');

    // Data for the charts
    const [series, setSeries] = useState<SeriesData[]>([
        {
            name: 'Graph 1',
            data: generateInitialData('24Hours'),
        },
        {
            name: 'Graph 2',
            data: generateInitialData('24Hours'),
        },
    ]);

    useEffect(() => {
        // Update series data based on selected interval and graph
        setSeries([
            {
                name: selectedGraph === 'graph1' ? 'Graph 1' : 'Graph 2',
                data: generateInitialData(interval),
            },
        ]);
    }, [interval, selectedGraph]);

    const options: ApexOptions = {
        series: series,
        chart: {
            height: 350,
            type: 'area',
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
        },
        xaxis: {
            type: 'datetime',
            categories: series[0]?.data.map(point => new Date(point.x).toISOString()),
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy HH:mm',
            },
        },
        colors: selectedGraph === 'graph1'
            ? ['#FF5733']  // Color for Graph 1
            : ['#33FF57'], // Color for Graph 2
    };

    const handleIntervalChange = (newInterval: '24Hours' | '1Week' | '1Month' | '1Year') => {
        setInterval(newInterval);
    };

    const toggleGraph = () => {
        setSelectedGraph(prevGraph => (prevGraph === 'graph1' ? 'graph2' : 'graph1'));
    };

    
   


    return (
        <Box>
            <Box sx={{ mb: 2 }}>
                <Button onClick={() => handleIntervalChange('24Hours')}>24H</Button>
                <Button onClick={() => handleIntervalChange('1Week')}>1W</Button>
                <Button onClick={() => handleIntervalChange('1Month')}>1M</Button>
                <Button onClick={() => handleIntervalChange('1Year')}>1Y</Button>
            </Box>
            <Box sx={{ mb: 2 }}>
                <Button onClick={toggleGraph}>
                    {selectedGraph === 'graph1' ? 'Show Graph 2' : 'Show Graph 1'}
                </Button>
            </Box>
            <Box id="chart" sx={{ width: '100%', height: '350px' }}>
                <ReactApexChart options={options} series={series} type="area" height={350} />
            </Box>
        </Box>
    );
};

export default ChartComponent;
function setActiveCurrency(arg0: (prevCurrency: string) => "PLS/9MM" | "9MM/PLS") {
    throw new Error('Function not implemented.');
}

