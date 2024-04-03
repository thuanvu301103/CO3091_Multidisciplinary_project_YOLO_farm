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
                show: false,
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
                <div className="w-max rounded-lg bg-gray-900 p-5 text-white">
                    {/* Icon here */}
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
                    <div className="flex items-center">
                        <Typography variant="h6" color="blue-gray">
                            Từ
                        </Typography>
                        <input type="time" className="px-2"></input>
                    </div>
                    <div className="flex items-center">
                        <Typography variant="h6" color="blue-gray">
                            Đến
                        </Typography>
                        <input type="time" className="px-2"></input>
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