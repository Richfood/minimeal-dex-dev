import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Box, Typography, Button } from '@mui/material';
import { VscArrowSwap } from "react-icons/vsc";
import { TbArrowsDiagonal } from "react-icons/tb";
import { lightTheme } from '../theme';
import { ApexOptions } from 'apexcharts';

interface SwapGraphProps {
    onToggle: () => void; // Define the onToggle prop as a function that toggles visibility
}

// Dynamically import ReactApexChart with SSR disabled
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const SwapGraph: React.FC<SwapGraphProps> = ({ onToggle }) => {
    const [series, setSeries] = useState([
        {
            data: [
                [1327359600000, 30.95],
                [1327446000000, 31.34],
            ],
        }
    ]);

    const [options, setOptions] = useState<ApexOptions>({
        chart: {
            id: 'area-datetime',
            type: 'area', // Ensure this is one of the allowed types: 'area', 'line', 'bar', etc.
            height: 350,
            zoom: {
                autoScaleYaxis: true
            }
        },
        annotations: {
            yaxis: [
                {
                    y: 30,
                    borderColor: '#999',
                    label: {
                        text: 'Support',
                        style: {
                            color: "#fff",
                            background: '#00E396'
                        }
                    }
                }
            ],
            xaxis: [
                {
                    x: new Date('14 Nov 2012').getTime(),
                    borderColor: '#999',
                    label: {
                        text: 'Rally',
                        style: {
                            color: "#fff",
                            background: '#775DD0'
                        }
                    }
                }
            ]
        },
        dataLabels: {
            enabled: false
        },
        markers: {
            size: 0,
            strokeWidth: 2,
            hover: {
                size: 6,
                sizeOffset: 3
            }
        },
        xaxis: {
            type: 'datetime',
            tickAmount: 6,
            labels: {
                style: {
                    colors: lightTheme.body.color,
                    fontSize: '12px',
                    fontWeight: 400,
                    cssClass: 'apexcharts-xaxis-label',
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: lightTheme.body.color,
                    fontSize: '12px',
                    fontWeight: 400,
                    cssClass: 'apexcharts-yaxis-label',
                },
            },
        },
        tooltip: {
            x: {
                format: 'dd MMM yyyy'
            }
        },
        fill: {
            type: 'gradient',
            pattern: {
                style: 'verticalLines',
                width: 1,
                height: 1,
                strokeWidth: 1
            },
            gradient: {
                shade: 'dark',
                type: 'horizontal',
                shadeIntensity: 0.5,
                gradientToColors: ['#F7F0DF', '#D1AC70'], // Custom colors for gradient
                inverseColors: true,
                opacityFrom: 1,
                opacityTo: 1,

                stops: [0, 50, 100],
                colorStops: [
                    {
                        offset: 0,
                        color: '#F7F0DF', // Start color
                        opacity: 0.3
                    },
                    {
                        offset: 50,
                        color: '#FFE6A8', // Mid color
                        opacity: 0.5
                    },
                    {
                        offset: 100,
                        color: '#FFE6A8', // End color
                        opacity: 1
                    }
                ]
            }
        },
        stroke: {
            curve: 'straight',
            width: 2,
            colors: ['#D1AC70']
        }
    });

    const [activeInterval, setActiveInterval] = useState('24Hours');

    useEffect(() => {
        fetchNewData('24Hours');
    }, []);

    const fetchNewData = (interval: string) => {
        const now = new Date().getTime();

        switch (interval) {
            case '24Hours':
                setSeries([
                    {
                        data: [
                            [now - 24 * 60 * 60 * 1000, 30.95],
                            [now - 18 * 60 * 60 * 1000, 31.34],
                            [now - 12 * 60 * 60 * 1000, 31.18],
                            [now - 6 * 60 * 60 * 1000, 32.05],
                            [now, 33.12]
                        ]
                    }
                ]);
                setActiveInterval('24Hours');
                break;
            case '1Week':
                setSeries([
                    {
                        data: [
                            [now - 7 * 24 * 60 * 60 * 1000, 30.12],
                            [now - 6 * 24 * 60 * 60 * 1000, 30.85],
                            [now - 5 * 24 * 60 * 60 * 1000, 31.04],
                            [now - 4 * 24 * 60 * 60 * 1000, 31.24],
                            [now - 3 * 24 * 60 * 60 * 1000, 31.64],
                            [now - 2 * 24 * 60 * 60 * 1000, 31.96],
                            [now - 1 * 24 * 60 * 60 * 1000, 32.34],
                            [now, 33.12]
                        ]
                    }
                ]);
                setActiveInterval('1Week');
                break;
            case '1Month':
                setSeries([
                    {
                        data: [
                            [now - 30 * 24 * 60 * 60 * 1000, 28.12],
                            [now - 25 * 24 * 60 * 60 * 1000, 29.85],
                            [now - 20 * 24 * 60 * 60 * 1000, 30.04],
                            [now - 15 * 24 * 60 * 60 * 1000, 30.24],
                            [now - 10 * 24 * 60 * 60 * 1000, 30.64],
                            [now - 5 * 24 * 60 * 60 * 1000, 31.96],
                            [now, 33.12]
                        ]
                    }
                ]);
                setActiveInterval('1Month');
                break;
            case '1Year':
                setSeries([
                    {
                        data: [
                            [now - 365 * 24 * 60 * 60 * 1000, 25.12],
                            [now - 300 * 24 * 60 * 60 * 1000, 26.85],
                            [now - 240 * 24 * 60 * 60 * 1000, 27.04],
                            [now - 180 * 24 * 60 * 60 * 1000, 28.24],
                            [now - 120 * 24 * 60 * 60 * 1000, 29.64],
                            [now - 60 * 24 * 60 * 60 * 1000, 30.96],
                            [now, 33.12]
                        ]
                    }
                ]);
                setActiveInterval('1Year');
                break;
            default:
                break;
        }
    };

    return (
        <Box>
            <Box className="chart_info">
                <Box className="chart_top" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '15px' }}>
                    <Box className="chart_swap" sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Box>
                                <img src='/images/circle1.svg' alt="" />
                            </Box>
                            <Box>
                                <img src='/images/circle2.svg' alt="" />
                            </Box>
                        </Box>
                        <Box className="chart_title" sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <Typography sx={{ fontWeight: '700' }}>PLS/9MM</Typography>
                            <VscArrowSwap onClick={onToggle} /> {/* Call onToggle prop on click */}
                        </Box>
                    </Box>
                    <Box className="chart_resize">
                        <TbArrowsDiagonal />
                    </Box>
                </Box>

                <Box className="chart_bottom" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '50px' }}>
                    <Box className="chart_data">
                        <Box sx={{ display: 'flex', gap: '5px', alignItems: 'flex-end' }}>
                            <Typography variant="h1">&lt;0.001</Typography>
                            <Typography variant="h4">PLS/9MM</Typography>
                            <Typography sx={{ color: '#00A413' }} variant="h4">+0.001(9.53%)</Typography>
                        </Box>
                        <Typography sx={{ fontSize: '12px', color: 'var(--creame_clr)', fontWeight: '600' }}>Jul 8, 2024, 1:30 PM (UTC)</Typography>
                    </Box>
                    <Box className="toolbar-button">
                        <Button
                            className={activeInterval === '24Hours' ? 'active' : ''}
                            onClick={() => fetchNewData('24Hours')}
                        >
                            24H
                        </Button>
                        <Button
                            className={activeInterval === '1Week' ? 'active' : ''}
                            onClick={() => fetchNewData('1Week')}
                        >
                            1W
                        </Button>
                        <Button
                            className={activeInterval === '1Month' ? 'active' : ''}
                            onClick={() => fetchNewData('1Month')}
                        >
                            1M
                        </Button>
                        <Button
                            className={activeInterval === '1Year' ? 'active' : ''}
                            onClick={() => fetchNewData('1Year')}
                        >
                            1Y
                        </Button>
                    </Box>
                </Box>
            </Box>

            <Box id="chart-timeline">
                <ReactApexChart options={options} series={series} type="area" height={350} />
            </Box>
        </Box>
    );
};

export default SwapGraph;
