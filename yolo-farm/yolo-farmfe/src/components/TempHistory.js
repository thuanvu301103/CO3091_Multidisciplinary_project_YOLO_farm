import React, { useState, useEffect } from 'react';
import axios from "axios";
import {
    Card,
    CardBody,
    CardHeader,
    Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { useParams } from "react-router-dom";


// If you're using Next.js please use the dynamic import for react-apexcharts and remove the import from the top for the react-apexcharts
// import dynamic from "next/dynamic";
// const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
let chartConfig = {
    type: "line",
    height: 240,
    series: [
        {
            name: "%",
            data: [],
        },
    ],
    options: {
        chart: {
            toolbar: {
                show: true,
                tools: {
                    zoom: true,
                    pan: false,
                    reset: true,
                },
            },
        },
        title: {
            show: "",
        },
        dataLabels: {
            enabled: false,
        },
        colors: ["#cc0000"],
        stroke: {
            lineCap: "round",
            curve: "smooth",
        },
        markers: {
            size: 0,
        },
        xaxis: {
            type: "datetime",
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
            labels: {
                style: {
                    colors: "#616161",
                    fontSize: "12px",
                    fontFamily: "inherit",
                    fontWeight: 400,
                },
            },
            categories: [],
        },
        yaxis: {
            labels: {
                style: {
                    colors: "#616161",
                    fontSize: "12px",
                    fontFamily: "inherit",
                    fontWeight: 400,
                },
            },
        },
        grid: {
            show: true,
            borderColor: "#dddddd",
            strokeDashArray: 5,
            xaxis: {
                lines: {
                    show: true,
                },
            },
            padding: {
                top: 5,
                right: 20,
            },
        },
        fill: {
            opacity: 0.8,
        },
        tooltip: {
            theme: "dark",
        },
    },
};

export function TempHistory() {

    // Get params from URL
    const paramURL = useParams();
    let userid = paramURL['userid'];
    let areaid = paramURL['areaid'];
    const [tempData, setTempData] = useState(null);
    const [chartData, setChartData] = useState(null);


    // Fetch data for the first time enter detail page
    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = `http://localhost:3000/envsense/user/${userid}/plantarea/${areaid}`;
                // Make the HTTP GET request using Axios
                const response = await axios.get(apiUrl);
                let res_data = response.data;
                setTempData(res_data['nhiet_do']);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = `http://localhost:3000/envsense/user/${userid}/plantarea/${areaid}/history?filter=year`;
                // Make the HTTP GET request using Axios
                const response = await axios.get(apiUrl);
                let res_data = response.data['nhiet_do_chart_data'];
                //console.log(res_data);
                chartConfig['series'][0]['data'] = [];
                chartConfig['options']['xaxis']['categories'] = [];
                for (let i in res_data) {
                    chartConfig['series'][0]['data'].push(parseInt(res_data[i][1]));
                    chartConfig['options']['xaxis']['categories'].push(res_data[i][0]);
                }
                setChartData(chartConfig);
                //console.log(chartData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    console.log(chartData);


    return (
        <Card>
            <CardHeader
                floated={false}
                shadow={false}
                color="transparent"
                className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
            >
                <div className="w-max rounded-lg p-5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                    </svg>
                </div>
                <div className="flex col-span-12 justify-between w-full">
                    <div className="w-fit">
                        <Typography variant="h6" color="blue-gray">
                            Nhiệt độ
                        </Typography>
                        <Typography
                            variant="small"
                            color="gray"
                            className="max-w-sm font-normal"
                        >
                            {tempData && tempData.low_warning && tempData.high_warning &&
                                `Nhiệt độ khuyến nghị: từ ${tempData.low_warning} đến ${tempData.high_warning}`}
                        </Typography>
                    </div>
                    <div className="flex items-center">
                        <Typography variant="h6" color="blue-gray">
                            Ngày
                        </Typography>
                        <input type="date" className="px-2"></input>
                    </div>
                </div>
            </CardHeader>
            <CardBody className="px-2 pb-0">
                {chartData && (
                    <Chart {...chartData} />
                )}
            </CardBody>
        </Card>
    );
}