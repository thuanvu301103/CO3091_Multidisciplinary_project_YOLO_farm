import React, { useState, useEffect } from 'react';
import axios from "axios";
import {Header} from "../../components/Navbar";
import {Sidebar} from "../../components/Sidebar";
import { Button, CardFooter } from "@material-tailwind/react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { SSEComponent } from "../../components/SSEComponent";
import LightImg from '../../assets/image/Light.jpg';
import TempImg from '../../assets/image/Temp.jpg';
import MoistureImg from '../../assets/image/Moisture.jpg';
import {useParams} from "react-router-dom";


export function DetailPage(){

	// Get params from URL
	const paramURL = useParams();
	let userid = paramURL['userid'];
	let areaid = paramURL['areaid'];
    const [tempData, setTempData] = useState(null);
    const [lightData, setLightData] = useState(null);
    const [midData, setMidData] = useState(null);
    const [area_name, setAreaName] = useState(null);
    const [plan_name, setPlanName] = useState(null);

 
	// Fetch data for the first time enter detail page
    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = `http://localhost:3000/envsense/user/${userid}/plantarea/${areaid}`;
                // Make the HTTP GET request using Axios
                const response = await axios.get(apiUrl);
                let res_data = response.data;
                setAreaName(res_data['ten_khu_cay_trong']);
                setPlanName(res_data['ten_ke_hoach']);
                setTempData(res_data['nhiet_do']);
                setLightData(res_data['anh_sang']);
                setMidData(res_data['do_am']);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    // Handle SSE messages from be-server
    useEffect(() => {
        const fetchData = async () => {
            try {
                const eventSource = new EventSource('http://127.0.0.1:3000/envsense'); // Create a connection to be-server then maintain it in time

                eventSource.onopen = () => {
                    console.log('SSE connection established.');
                };

                // Change value when changes occurred
                eventSource.onmessage = (event) => {
                    const eventData = JSON.parse(event.data);
                    console.log('Received event:', eventData);
                    if (eventData['feed_type'] === 'ma_feed_anh_sang') {
                        setLightData(eventData);
                    } else if (eventData['feed_type'] === 'ma_feed_nhiet_do') {
                        setTempData(eventData);
                    } else if (eventData['feed_type'] === 'ma_feed_do_am') {
                        setMidData(eventData);
                    }
                    // Handle the received event data
                };

                eventSource.onerror = (error) => {
                    console.error('SSE connection error:', error);
                    // Handle SSE connection error
                };

                return () => {
                    eventSource.close();    // Close connection
                };

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);


    /*
    console.log ('Area\'s name: ', area_name);
    console.log ('Plan\'s name: ', plan_name);
    */

    return (
        <>
            <Header></Header>
            <div className ="grid grid-cols-12">
                <div className="col-span-2">
                    <Sidebar></Sidebar>
                </div>
                <div className="col-span-10 grid grid-cols-12 gap-6 m-6">
                    <div className="flex col-span-12 justify-between items-center" style={{width:'100%'}}>
                        <Typography
                            variant="h5"
                            style={{color:'#444444'}}
                            className="mb-3 font-medium leading-[1.5] w-fit"
                            >
                            Khu: {area_name}
                            &nbsp; &nbsp; &nbsp; &nbsp;
                            Kế hoạch: {plan_name}
                        </Typography>

                        <div>
                            <Link to = "/history">
                                <Button className="rounded-3xl mx-6" style={{height:'40px',backgroundColor:'#0BB489', color:'#ffffff'}}>
                                    Xem lịch sử
                                </Button>
                            </Link>
                            <Link to = "/">
                                <Button className="rounded-3xl" style={{height:'40px',backgroundColor:'#DEE2E6', color:'#000000'}}>
                                    Trở về
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="col-span-4">
                        <Card
                        shadow={false}
                        className="relative grid w-full max-w-[28rem] items-end justify-center overflow-hidden text-center py-5"
                        >
                        <CardHeader
                            floated={false}
                            shadow={false}
                            color="transparent"
                            className="absolute inset-0 m-0 h-full w-full rounded-none bg-cover bg-center"
                            style={{background:`url(${TempImg})`, filter: 'brightness(30%)'}}
                        >
                            <div className="to-bg-black-10 absolute inset-0 h-full w-full" />
                        </CardHeader>
                        <CardBody className="relative py-14 px-6 md:px-12">
                            <Typography
                            style={{fontSize:'100px', color: '#FCF671', fontWeight:'bold'}}
                            className="mb-3 font-medium leading-[1.5]"
                            >
                                    {tempData && tempData.curent_value && `${tempData.curent_value}°C`}
                            </Typography>

                            <Typography
                            variant="h3"
                            color="white"
                            className="mb-3 font-medium leading-[1.5] w-full"
                            >
                            Nhiệt độ
                            </Typography>
                            <Typography variant="h6" className="mb-4 text-gray-400 w-full">
                                    {tempData && tempData.low_warning && tempData.high_warning &&
                                        `Khuyến nghị: từ ${tempData.low_warning}°C đến ${tempData.high_warning}°C`}
                            </Typography>
                                <Button className="rounded-3xl" style={{ backgroundColor: 'white', color: '#4CA844', backgroundColor: 'rgb(255,255,255)' }}>
                                    {tempData && tempData.evaluate && tempData.evaluate > 0 ? `Cao hơn giới hạn trên ${tempData.evaluate.toFixed(1)}%`:null}
                                    {tempData && (tempData.evaluate ==  0) ? `Tình trạng tốt`: null}
                                    {tempData && tempData.evaluate && tempData.evaluate < 0 ? `Thấp hơn giới hạn dưới ${(0 - tempData.evaluate).toFixed(1)}%`:null}
                                    
                                </Button>
                        </CardBody>
                        </Card>
                    </div>
                    <div className="col-span-4">
                        <Card
                        shadow={false}
                        className="relative grid w-full max-w-[28rem] items-end justify-center overflow-hidden text-center py-5"
                        >
                        <CardHeader
                            floated={false}
                            shadow={false}
                            color="transparent"
                            className="absolute inset-0 m-0 h-full w-full rounded-none bg-cover bg-center"
                            style={{background:`url(${LightImg})`,  filter: 'brightness(30%)'}}
                        >
                            <div className="to-bg-black-10 absolute inset-0 h-full w-full " />
                            
                        </CardHeader>
                        <CardBody className="relative py-14 px-6 md:px-12">
                            <Typography
                            style={{fontSize:'100px', color: '#C0D82B', fontWeight:'bold'}}
                            className="mb-3 font-medium leading-[1.5]"
                            >
                                    {lightData && lightData.curent_value && `${lightData.curent_value}%`}
                            </Typography>
                            <Typography
                            variant="h3"
                            color="white"
                            className="mb-3 font-medium leading-[1.5]"
                            >
                            Ánh sáng
                            </Typography>
                            <Typography variant="h6" className="mb-4 text-gray-400">
                                    {lightData && lightData.low_warning && lightData.high_warning &&
                                        `Khuyến nghị: từ ${lightData.low_warning}% đến ${lightData.high_warning}%`}
                            </Typography>
                            <Button className="rounded-3xl" style={{backgroundColor:'white', color:'#4CA844', backgroundColor:'rgb(255,255,255)'}}>
                                    {lightData && lightData.evaluate && lightData.evaluate > 0 ? `Cao hơn giới hạn trên ${lightData.evaluate.toFixed(1)}%`: null}
                                    {lightData && lightData.evaluate && lightData.evaluate < 0 ? `Thấp hơn giới hạn dưới ${(0 - lightData.evaluate).toFixed(1)}%`:null}
                                    {lightData && lightData.evaluate == 0 ? `Tình trạng tốt` : null}
                            </Button>
                        </CardBody>
                        </Card>
                    </div>
                    <div className="col-span-4">
                        <Card
                        shadow={false}
                        className="relative grid w-full max-w-[28rem] items-end justify-center overflow-hidden text-center py-5"
                        >
                        <CardHeader
                            floated={false}
                            shadow={false}
                            color="transparent"
                            className="absolute inset-0 m-0 h-full w-full rounded-none bg-cover bg-center"
                            style={{background:`url(${MoistureImg})`, filter: 'brightness(30%)'}}
                        >
                            <div className="to-bg-black-10 absolute inset-0 h-full w-full" />
                        </CardHeader>
                        <CardBody className="relative py-14 px-6 md:px-12">
                            <Typography
                            style={{fontSize:'100px', color: '#1152FA', fontWeight:'bold'}}
                            className="mb-3 font-medium leading-[1.5]"
                            >
                                    {midData && midData.curent_value && `${midData.curent_value}%`}
                            </Typography>
                            <Typography
                            variant="h3"
                            color="white"
                            className="mb-3 font-medium leading-[1.5]"
                            >
                            Độ ẩm
                            </Typography>
                            <Typography variant="h6" className="mb-4 text-gray-400">
                                    {midData && midData.low_warning && midData.high_warning &&
                                        `Khuyến nghị: từ ${midData.low_warning}% đến ${midData.high_warning}%`}
                            </Typography>
                            <Button className="rounded-3xl" style={{backgroundColor:'white', color:'#4CA844', backgroundColor:'rgb(255,255,255)'}}>
                                    {midData && midData.evaluate && midData.evaluate > 0 ? `Cao hơn giới hạn trên ${midData.evaluate.toFixed(1)}`:null}
                                    {midData && midData.evaluate && midData.evaluate < 0 ? `Thấp hơn giới hạn dưới ${(0 - midData.evaluate).toFixed(1)}`:null}
                                    {midData && midData.evaluate == 0 ? `Tình trạng tốt`:null}
                            </Button>
                        </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    )
}