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
        colors: ["#FCF671"],
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
 
export function LightHistory() {

    // Get params from URL
    const paramURL = useParams();
    let userid = paramURL['userid'];
    let areaid = paramURL['areaid'];
    const [lightData, setLightData] = useState(null);
    const [chartData, setChartData] = useState(null);


    // Fetch data for the first time enter detail page
    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = `http://localhost:3000/envsense/user/${userid}/plantarea/${areaid}`;
                // Make the HTTP GET request using Axios
                const response = await axios.get(apiUrl);
                let res_data = response.data;
                setLightData(res_data['anh_sang']);
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
                let res_data = response.data['anh_sang_chart_data'];
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
    <Card className='my-5'>
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
      >
        <div className="w-max rounded-lg p-5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
            </svg>
        </div>
        <div className="flex col-span-12 justify-between w-full">
            <div className="w-fit">
                <Typography variant="h6" color="blue-gray">
                    Ánh sáng
                </Typography>
                <Typography
                    variant="small"
                    color="gray"
                    className="max-w-sm font-normal"
                >
                          {lightData && lightData.low_warning && lightData.high_warning &&
                              `Ánh sáng khuyến nghị: từ ${lightData.low_warning} đến ${lightData.high_warning}`}
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
                <input type="time"  className="px-2"></input>
            </div>
            <div className="flex items-center">
                <Typography variant="h6" color="blue-gray">
                    Đến
                </Typography>
                <input type="time"  className="px-2"></input>
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