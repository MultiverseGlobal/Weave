import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const EnergyCurve = ({ data, labels }) => {
    const chartData = {
        labels: labels || data.map((_, i) => i + 1),
        datasets: [
            {
                label: 'Energy Profile',
                data: data,
                borderColor: '#7C3AED',
                borderWidth: 3,
                pointBackgroundColor: '#7C3AED',
                pointBorderColor: '#0A0A0F',
                pointBorderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 6,
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                    gradient.addColorStop(0, 'rgba(124, 58, 237, 0.2)');
                    gradient.addColorStop(1, 'rgba(124, 58, 237, 0.0)');
                    return gradient;
                },
                fill: true,
                tension: 0.4,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: '#12121A',
                titleFont: { size: 12, weight: 'bold' },
                bodyFont: { size: 12 },
                padding: 12,
                cornerRadius: 12,
                borderColor: '#1E1E2E',
                borderWidth: 1,
                displayColors: false,
            }
        },
        hover: {
            mode: 'index',
            intersect: false
        },
        scales: {
            x: {
                display: false,
            },
            y: {
                min: 0,
                max: 1.1,
                display: false,
            }
        }
    };

    return <Line data={chartData} options={options} />;
};

export default EnergyCurve;
