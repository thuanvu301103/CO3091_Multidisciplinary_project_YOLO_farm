import React, { useState, useEffect } from 'react';
import axios from "axios";

import {Header} from "../../components/Navbar";
import {Sidebar} from "../../components/Sidebar";
import { Footer } from '../../components/Footer';
import { Button, Switch } from "@material-tailwind/react";

import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
// Card Background images 
import LightImg from '../../assets/image/Light.jpg';
import TempImg from '../../assets/image/Temp.jpg';
import MoistureImg from '../../assets/image/Moisture.jpg';
// Light, Fan, Pump images
import light_on_img from '../../assets/image/lighton.png';
import light_off_img from '../../assets/image/lightoff.png';
import fan_on_img from '../../assets/image/fanon.png';
import fan_off_img from '../../assets/image/fanoff.png';
import pump_on_img from '../../assets/image/pumpon.png';
import pump_off_img from '../../assets/image/pumpoff.png';

import { useParams } from "react-router-dom";


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
    const [automatic_state, setAutomaticState] = useState(null);
    const [lightschedule_state, setLightScheduleState] = useState(null);
    const [lightrelay_state, setLightRelayState] = useState(null);
    const [lightrelayimg_state, setLightRelayImgState] = useState(light_off_img);
    const [fanpumpschedule_state, setFanPumpScheduleState] = useState(null);
    const [fanpumprelay_state, setFanPumpRelayState] = useState(null);
    const [fanrelayimg_state, setFanRelayImgState] = useState(fan_off_img);
    const [pumprelayimg_state, setPumpRelayImgState] = useState(pump_off_img);

    // Intial state
    const [initial, setInitial] = useState(true);   // for automatic switch
    const [lightinit, setLightInit] = useState(true);   // for light switch
    const [fanpumpinit, setFanPumpInit] = useState(true);   // for fan pump switch

    // fetch automatic/light/fan/pump state data
    useEffect(() => {
        const fetchData = async () => {
            try {

                // fetch automatic mode state
                let apiUrl = `http://localhost:3000/envsense/user/${userid}/plantarea/${areaid}/automatic`;
                let response = await axios.get(apiUrl);
                let res_data = response.data;
                //console.log(res_data);
                if (res_data == '1') setAutomaticState(true);
                else setAutomaticState(false);

                // fetch light relay state
                apiUrl = `http://localhost:3000/envsense/user/${userid}/plantarea/${areaid}/light/state`;
                response = await axios.get(apiUrl);
                res_data = response.data;
                if (res_data == '1') setLightRelayState(true);
                else setLightRelayState(false);

                // fetch fan + pump state
                apiUrl = `http://localhost:3000/envsense/user/${userid}/plantarea/${areaid}/fanpump/state`;
                response = await axios.get(apiUrl);
                res_data = response.data;
                if (res_data == '1') setFanPumpRelayState(true);
                else setFanPumpRelayState(false);


            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    // Handle Automatic Mode Switch Change
    useEffect(() => {
        
        const fetchData = async () => {
            // This function will be called whenever automaticState changes
            let turnon = 0;
            if (automatic_state == true) turnon = 1;
            let apiUrl = `http://localhost:3000/envsense/user/${userid}/plantarea/${areaid}/automatic/turnon/${turnon}`;
            const response = await axios.get(apiUrl);
        };
        // If the change is due to initial of automatic button then do nothing
        if (initial == true) return;
        fetchData();
        // You can perform any other actions based on the updated state here
    }, [automatic_state]); // Specify automaticState as a dependency

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

    // Handle Light Relay Img
    useEffect(() => {
        const fetchData = async () => {
            let turnon = 0;
            if (lightrelay_state == true) turnon = 1;
            let apiUrl = `http://localhost:3000/envsense/user/${userid}/plantarea/${areaid}/light/turnon/${turnon}`;
            const response = await axios.get(apiUrl);
        };
        if (lightrelay_state) setLightRelayImgState(light_on_img);
        else setLightRelayImgState(light_off_img);
        if (lightinit == true) return;
        fetchData();
    }, [lightrelay_state]);

    // Handle Fan Pump Relay Img
    useEffect(() => {
        const fetchData = async () => {
            let turnon = 0;
            if (fanpumprelay_state == true) turnon = 1;
            let apiUrl = `http://localhost:3000/envsense/user/${userid}/plantarea/${areaid}/fanpump/turnon/${turnon}`;
            const response = await axios.get(apiUrl);
        };
        if (fanpumprelay_state) {
            setFanRelayImgState(fan_on_img);
            setPumpRelayImgState(pump_on_img);
        }
        else {
            setFanRelayImgState(fan_off_img);
            setPumpRelayImgState(pump_off_img);
        }
        if (fanpumpinit == true) return;
        fetchData();
    }, [fanpumprelay_state]);

    // Handle SSE messages from be-server
    useEffect(() => {
        const fetchData = async () => {
            try {
                const eventSource = new EventSource('http://127.0.0.1:3000/envsense'); // Create a connection to be-server then maintain it in time

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

    console.log('Automatic mode: ', automatic_state);
 
    return (
        <>
            <Header></Header>
            <div className="grid grid-cols-12">
                <div className="col-span-2">
                    <Sidebar></Sidebar>
                </div>
                <div className="col-span-10 grid grid-cols-12 gap-6 m-6">
                    <div className="flex col-span-12 justify-between items-center" style={{ width: '100%' }}>
                        <Typography
                            variant="h6"
                            color="blue-gray"
                            className="mb-3 font-medium leading-[1.5] w-fit"
                        >
                            <span style={{ fontWeight: '700' }}>Khu</span>: {area_name}
                            <br />
                            <span style={{ fontWeight: '700' }}>Kế hoạch</span>: {plan_name}
                        </Typography>

                        <div>
                            <Link to={`/user/${userid}/area/${areaid}/history`}>
                                <Button className="rounded-3xl mx-6" style={{ height: '40px', backgroundColor: '#0BB489', color: '#ffffff' }}>
                                    Xem lịch sử
                                </Button>
                            </Link>
                            <Link to={`/user/${userid}/area/list`}>
                                <Button className="rounded-3xl" style={{ height: '40px', backgroundColor: '#DEE2E6', color: '#000000' }}>
                                    Trở về
                                </Button>
                            </Link>
                        </div>

                    </div>

                    <div className="col-span-12">
                        <Switch
                            color="green"
                            label="Chế độ tự động"
                            checked={automatic_state}
                            onChange={() => {
                                setInitial(false);
                                setAutomaticState(!automatic_state);
                            }}
                        />
                    </div>

                    {/* Card 1: Light */}
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
                                style={{ background: `url(${LightImg})`, filter: 'brightness(30%)' }}
                            >
                                <div className="to-bg-black-10 absolute inset-0 h-full w-full " />

                            </CardHeader>
                            <CardBody className="relative py-14 px-6 md:px-12">
                                <Typography
                                    style={{ fontSize: '80px', color: '#C0D82B', fontWeight: 'bold' }}
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
                                <Button className="rounded-3xl" style={{ backgroundColor: 'rgb(255,255,255)' }}>
                                    {lightData && lightData.evaluate && lightData.evaluate > 0 ? <span style={{ color: '#dc3545' }}>Cao hơn giới hạn trên {lightData.evaluate.toFixed(1)}%</span> : null}
                                    {lightData && lightData.evaluate && lightData.evaluate < 0 ? <span style={{ color: '#dc3545' }}>Thấp hơn giới hạn dưới {(0 - lightData.evaluate).toFixed(1)}%</span> : null}
                                    {lightData && lightData.evaluate == 0 ? <span style={{ color: '#28a745' }}>Tình trạng tốt</span> : null}
                                </Button>
                            </CardBody>
                        </Card>
                    </div>
                    {/* Card 2: Temperature */}
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
                                style={{ background: `url(${TempImg})`, filter: 'brightness(30%)' }}
                            >
                                <div className="to-bg-black-10 absolute inset-0 h-full w-full" />
                            </CardHeader>
                            <CardBody className="relative py-14 px-6 md:px-12">
                                <Typography
                                    style={{ fontSize: '80px', color: '#FCF671', fontWeight: 'bold' }}
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
                                <Button className="rounded-3xl" style={{ backgroundColor: 'rgb(255,255,255)' }}>
                                    {tempData && tempData.evaluate && tempData.evaluate > 0 ? <span style={{ color: '#dc3545' }}>Cao hơn giới hạn trên {tempData.evaluate.toFixed(1)}%</span> : null}
                                    {tempData && tempData.evaluate && tempData.evaluate < 0 ? <span style={{ color: '#dc3545' }}>Thấp hơn giới hạn dưới ${(0 - tempData.evaluate).toFixed(1)}%</span> : null}
                                    {tempData && (tempData.evaluate == 0) ? <span style={{ color: '#28a745' }}>Tình trạng tốt</span> : null}
                                </Button>
                            </CardBody>
                        </Card>
                    </div>
                    {/* Card 3: Humidity */}
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
                                style={{ background: `url(${MoistureImg})`, filter: 'brightness(30%)' }}
                            >
                                <div className="to-bg-black-10 absolute inset-0 h-full w-full" />
                            </CardHeader>
                            <CardBody className="relative py-14 px-6 md:px-12">
                                <Typography
                                    style={{ fontSize: '80px', color: '#1152FA', fontWeight: 'bold' }}
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
                                <Button className="rounded-3xl" style={{ backgroundColor: 'rgb(255,255,255)' }}>
                                    {midData && midData.evaluate && midData.evaluate > 0 ? <span style={{ color: '#dc3545' }}>Cao hơn giới hạn trên {midData.evaluate.toFixed(1)}</span> : null}
                                    {midData && midData.evaluate && midData.evaluate < 0 ? <span style={{ color: '#dc3545' }}>Thấp hơn giới hạn dưới ${(0 - midData.evaluate).toFixed(1)}</span> : null}
                                    {midData && midData.evaluate == 0 ? <span style={{ color: '#28a745' }}>Tình trạng tốt</span> : null}
                                </Button>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Card 4: Light relay */}
                    <div className="col-span-4">
                        <Card
                            shadow={true}
                            className="grid w-full max-w-[28rem] items-end py-1 text-black"
                        >
                            <CardHeader
                                floated={false}
                                shadow={true}
                                className="absolute inset-0 m-0 h-full w-full rounded-none bg-cover bg-center"
                            >
                                <div className="to-bg-black-10 absolute inset-0 h-full w-full" />
                            </CardHeader>
                            <CardBody className="relative py-3 px-6 md:px-12">

                                {/*Ligt relay scheduler switch*/}
                                <div>
                                    <Switch
                                        color="blue"
                                        label="Chế độ lịch biểu"
                                        disabled={automatic_state}
                                        checked={lightschedule_state}
                                        onChange={() => {
                                            setLightScheduleState(!lightschedule_state);
                                        }}
                                    />
                                    
                                </div>

                                {/* Image */}
                                <div className="py-3">
                                    <img src={lightrelayimg_state} alt="Dynamic Image" className="w-full h-full" />
                                </div>

                                {/*Ligt relay switch*/}
                                <div className="flex justify-center">
                                    <Switch
                                        color="orange"
                                        checked={lightrelay_state}
                                        disabled={automatic_state || lightschedule_state}
                                        label="Bật/tắt"
                                        onChange={() => {
                                            setLightInit(false);
                                            setLightRelayState(!lightrelay_state);
                                        }}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Card 5: Fan and Pump relay */}
                    <div className="col-span-8">
                        <Card
                            shadow={true}
                            className="grid w-full items-end py-1 text-black"
                        >
                            <CardHeader
                                floated={false}
                                shadow={true}
                                className="absolute inset-0 m-0 h-full w-full rounded-none bg-cover bg-center"
                            >
                                <div className="to-bg-black-10 absolute inset-0 h-full w-full" />
                            </CardHeader>
                            <CardBody className="relative py-3 px-6 md:px-12">

                                {/*Fan Pump relay scheduler switch*/}
                                <div>
                                    <Switch
                                        color="blue"
                                        label="Chế độ lịch biểu"
                                        disabled={automatic_state}
                                        checked={fanpumpschedule_state}
                                        onChange={() => {
                                            //setLightInit(false);
                                            setFanPumpScheduleState(!fanpumpschedule_state);
                                        }}
                                    />

                                </div>

                                {/* Image */}
                                <div className="flex justify-between items-center py-3">
                                    <img src={fanrelayimg_state} alt="Dynamic Image" className="w-full w-full max-w-[18.5rem] h-full" />
                                    <img src={pumprelayimg_state} alt="Dynamic Image" className="w-full w-full max-w-[18.5rem] h-full" />
                                </div>

                                {/*Fan Pump relay switch*/}
                                <div className="flex justify-center">
                                    <Switch
                                        color="green"
                                        checked={fanpumprelay_state}
                                        disabled={automatic_state || fanpumpschedule_state}
                                        label="Bật/tắt"
                                        onChange={() => {
                                            setFanPumpInit(false);
                                            setFanPumpRelayState(!fanpumprelay_state);
                                        }}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </div>


                </div>
            </div>
            <Footer></Footer>
        </>
    );
}