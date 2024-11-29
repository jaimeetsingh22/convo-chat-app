import { backGround } from '@/constants/color'
import { getLast7Days } from '@/utils/feature'
import { ArcElement, CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js'
import React from 'react'
import { Doughnut, Line } from 'react-chartjs-2'

ChartJS.register(
    LineElement,
    Tooltip,
    Filler,
    LinearScale,
    PointElement,
    ArcElement,
    Legend,
    CategoryScale,
)

const labels = getLast7Days();

const LineChatOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: false
        },
        title: {
            display: false
        }
    },
    scales: {
        x: {
            grid: {
                display: false
            }
        },
        y: {
            beginAtZero: true,
            grid: {
                display: false
            }
        }
    }
}

const LineChart = ({ value = [] }) => {
    const data = {
        labels,
        datasets: [
            {
                label: 'Messages',
                data: value,
                borderColor: 'rgb(150 0 255)',
                backgroundColor: 'rgba(150, 0, 255, 0.3)',
                fill: true,

            }
        ]

    }
    return (<Line data={data} options={LineChatOptions} />)
}

const DougnutChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: false
        },
    },
    cutout: 130,

}

const DoughnutChart = ({ value = [], labels = [] }) => {

    const data = {
        labels,
        datasets: [
            {
                data: value,
                borderColor: ['rgb(150 0 255)', 'rgb(0 0 255)'],
                backgroundColor: ['rgba(150, 0, 255, 0.5)', 'rgb(0, 0, 255,0.5)'],
                hoverBackgroundColor: ['rgb(150 0 255)', 'rgb(0 0 255)'],
                offset: 20
            }
        ]
    }
    return <Doughnut style={{
        zIndex: 10
    }} data={data} options={DougnutChartOptions} />

}

export { LineChart, DoughnutChart }