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
import LightImg from '../../assets/image/Light.jpg';
import TempImg from '../../assets/image/Temp.jpg';
import MoistureImg from '../../assets/image/Moisture.jpg';
import {useParams} from "react-router-dom";
import { TempHistory } from "../../components/TempHistory";
import { LightHistory } from "../../components/LightHistory";
import { MoistureHistory } from "../../components/MoistureHistory";
import { Notification } from '../../components/Notification';
import { Dialog } from '../../components/Dialog';
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
    const [initial, setInitial] = useState(true);

    // fetch automatic state data
    useEffect(() => {
        const fetchData = async () => {
            try {

                let apiUrl = `http://localhost:3000/envsense/user/${userid}/plantarea/${areaid}/automatic`;
                const response = await axios.get(apiUrl);
                let res_data = response.data;
                console.log(res_data);
                if (res_data == '1') setAutomaticState(true);
                else setAutomaticState(false);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    
    useEffect(() => {
        
        const fetchData = async () => {
            // This function will be called whenever automaticState changes
            let turnon = 0;
            if (automatic_state == true) turnon = 1;
            let apiUrl = `http://localhost:3000/envsense/user/${userid}/plantarea/${areaid}/automatic/turnon/${turnon}`;
            const response = await axios.get(apiUrl);
        };
        // If the change is due to initial of automaic button then do nothing
        if (initial == true) return;
        fetchData();
        // You can perform any other actions based on the updated state here
    }, [automatic_state]); // Specify automaticState as a dependency
    

	// Fetch data for the first time enter detail page
    useEffect(() => {
        const fetchData = async () => {
            try {
                let apiUrl = `http://localhost:3000/envsense/user/${userid}/plantarea/${areaid}`;
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
    console.log('Automatic mode: ', automatic_state);

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
                            variant="h6"
                            color="blue-gray"
                            className="mb-3 font-medium leading-[1.5] w-fit"
                            >
                            <span style={{fontWeight:'700'}}>Khu</span>: {area_name}
                            <br/>
                            <span style={{fontWeight:'700'}}>Kế hoạch</span>: {plan_name}
                        </Typography>
                        <div>
                            <Link to = {`/user/${userid}/area/list`}>
                                <Button className="rounded-3xl" style={{height:'40px',backgroundColor:'#DEE2E6', color:'#000000'}}>
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
                    <div className='col-span-12 gap-6 grid grid-cols-12'>
                        <div className='col-span-6'>
                            <Notification></Notification>
                        </div>
                        <div className='col-span-6'>
                            <Dialog></Dialog>
                        </div>
                    </div>
                    <div className='col-span-12 gap-6 grid grid-cols-12'>
                        <div className="col-span-4 flex items-stretch">
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
                                style={{color: '#FCF671', fontWeight:'bold'}}
                                variant='h1'
                                className="mb-3 font-medium leading-[1.5]"
                                >
                                        {tempData && tempData.curent_value && `${tempData.curent_value}°C`}
                                </Typography>

                                <Typography
                                variant="h5"
                                color="white"
                                className="mb-3 font-medium leading-[1.5] w-full"
                                >
                                Nhiệt độ
                                </Typography>
                                <Typography variant="h6" className="mb-4 text-gray-400 w-full">
                                        {tempData && tempData.low_warning && tempData.high_warning &&
                                            `Khuyến nghị: từ ${tempData.low_warning}°C đến ${tempData.high_warning}°C`}
                                </Typography>
                                    <Button className="rounded-3xl" style={{backgroundColor: 'rgb(255,255,255)' }}>
                                        {tempData && tempData.evaluate && tempData.evaluate > 0 ? <span style={{color:'#dc3545'}}>Cao hơn giới hạn trên {tempData.evaluate.toFixed(1)} °C</span>:null}
                                        {tempData && tempData.evaluate && tempData.evaluate < 0 ? <span style={{color:'#dc3545'}}>Thấp hơn giới hạn dưới ${(0 - tempData.evaluate).toFixed(1)} °C</span>:null}
                                        {tempData && (tempData.evaluate ==  0) ? <span style={{color:'#28a745'}}>Tình trạng tốt</span>: null}
                                    </Button>
                            </CardBody>
                            </Card>    
                        </div>
                        <div className='col-span-8'>
                            <TempHistory></TempHistory>
                        </div>
                    </div>
                    <div className='col-span-12 gap-6 grid grid-cols-12'>
                        <div className="col-span-4 flex items-stretch">
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
                                style={{color: '#C0D82B', fontWeight:'bold'}}
                                variant='h1'
                                className="mb-3 font-medium leading-[1.5]"
                                >
                                        {lightData && lightData.curent_value && `${lightData.curent_value}%`}
                                </Typography>
                                <Typography
                                variant="h5"
                                color="white"
                                className="mb-3 font-medium leading-[1.5]"
                                >
                                Ánh sáng
                                </Typography>
                                <Typography variant="h6" className="mb-4 text-gray-400">
                                        {lightData && lightData.low_warning && lightData.high_warning &&
                                            `Khuyến nghị: từ ${lightData.low_warning}% đến ${lightData.high_warning}%`}
                                </Typography>
                                <Button className="rounded-3xl" style={{backgroundColor:'rgb(255,255,255)'}}>
                                        {lightData && lightData.evaluate && lightData.evaluate > 0 ? <span style={{color:'#dc3545'}}>Cao hơn giới hạn trên {lightData.evaluate.toFixed(1)}%</span>: null}
                                        {lightData && lightData.evaluate && lightData.evaluate < 0 ? <span style={{color:'#dc3545'}}>Thấp hơn giới hạn dưới {(0 - lightData.evaluate).toFixed(1)}%</span>:null}
                                        {lightData && lightData.evaluate == 0 ? <span style={{color:'#28a745'}}>Tình trạng tốt</span> : null}
                                </Button>
                            </CardBody>
                            </Card>
                        </div>
                        <div className='col-span-8'>
                            <LightHistory></LightHistory>
                        </div>
                    </div>
                    <div className='col-span-12 gap-6 grid grid-cols-12'>
                        <div className="col-span-4 flex items-stretch">
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
                                style={{ color: '#1152FA', fontWeight:'bold'}}
                                variant = "h1"
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
                                <Button className="rounded-3xl" style={{backgroundColor:'rgb(255,255,255)'}}>
                                        {midData && midData.evaluate && midData.evaluate > 0 ? <span style={{color:'#dc3545'}}>Cao hơn giới hạn trên {midData.evaluate.toFixed(1)}</span> :null}
                                        {midData && midData.evaluate && midData.evaluate < 0 ? <span style={{color:'#dc3545'}}>Thấp hơn giới hạn dưới ${(0 - midData.evaluate).toFixed(1)}</span>:null}
                                        {midData && midData.evaluate == 0 ? <span style={{color:'#28a745'}}>Tình trạng tốt</span>:null}
                                </Button>
                            </CardBody>
                            </Card>
                        </div>
                        <div className='col-span-8'>
                            <MoistureHistory></MoistureHistory>
                        </div>
                    </div>
                    <div className='col-span-12 gap-6 grid grid-cols-12'>
                        <div className='col-span-4 flex gap-3 items-center py-5' style={{backgroundColor:'#637381', flexDirection: 'column', borderRadius:'15px'}}>
                            <Typography
                                variant="h5"
                                color="white"
                                align="center"
                                className="font-medium leading-[1.5] w-full"
                                >
                                Trạng thái đèn
                            </Typography>
                            <div>
                                <svg width="200" height="200" viewBox="0 0 141 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M51.7857 195H89.2143M33.0714 128.5H107.929M5.00001 71.5C5.00001 53.8631 11.9009 36.9486 24.1845 24.4774C36.4681 12.0062 53.1283 5 70.5 5C87.8717 5 104.532 12.0062 116.815 24.4774C129.099 36.9486 136 53.8631 136 71.5C136.006 82.2072 133.455 92.7563 128.566 102.243C123.677 111.731 116.596 119.873 107.929 125.973L102.857 150.35C102.186 154.843 99.95 158.943 96.556 161.906C93.1619 164.869 88.8342 166.499 84.3579 166.5H56.6421C52.1658 166.499 47.8381 164.869 44.444 161.906C41.05 158.943 38.8144 154.843 38.143 150.35L33.0714 126.077C24.4012 119.956 17.3194 111.794 12.431 102.29C7.54265 92.7862 4.99304 82.2219 5.00001 71.5Z" stroke="white" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            <div>
                                <Switch
                                color="green"
                                />                        
                            </div>
                        </div>
                        <div className='col-span-4 flex gap-3 items-center py-5' style={{backgroundColor:'#637381', flexDirection: 'column', borderRadius:'15px'}}>
                            <Typography
                                variant="h5"
                                color="white"
                                align="center"
                                className="font-medium leading-[1.5] w-full"
                                >
                                Trạng thái quạt gió
                            </Typography>
                            <div className=''>
                                <svg width="200" height="200" viewBox="0 0 230 230" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M98.2226 230C89.7534 230 83.3167 227.489 78.9124 222.467C74.508 217.444 72.3102 211.73 72.3189 205.324C72.3189 201.05 73.2329 196.833 75.0607 192.672C76.8886 188.511 79.8306 185.108 83.8868 182.462C88.8482 179.085 92.9653 174.541 96.2381 168.831C99.5022 163.121 101.931 156.793 103.523 149.847C101.382 149.029 99.2802 148.085 97.2173 147.014C95.1544 145.943 93.1655 144.551 91.2506 142.836L60.7118 153.869C57.5174 155 54.4883 155.918 51.6247 156.624C48.761 157.329 45.8146 157.681 42.7855 157.681C31.5223 157.681 21.5777 152.633 12.9519 142.536C4.32599 132.439 0.00870421 117.668 0 98.2226C0 89.7534 2.49376 83.3167 7.48127 78.9124C12.4688 74.5167 18.0699 72.3189 24.2847 72.3189C28.7674 72.3189 33.1021 73.2329 37.2888 75.0607C41.4756 76.8886 44.892 79.8307 47.538 83.8868C50.9153 88.8482 55.4589 92.9653 61.1688 96.2381C66.8788 99.5022 73.2067 101.931 80.1527 103.524C80.9709 101.382 81.9153 99.2802 82.9859 97.2173C84.0565 95.1544 85.4492 93.1655 87.1639 91.2506L76.1313 60.7119C74.9998 57.6828 74.0815 54.6799 73.3765 51.703C72.6714 48.7262 72.3189 45.832 72.3189 43.0206C72.3189 29.7554 78.0941 19.2668 89.6446 11.5549C101.195 3.84293 115.239 -0.00868949 131.777 1.47196e-05C140.247 1.47196e-05 146.683 2.48072 151.088 7.44211C155.483 12.4035 157.681 17.9742 157.681 24.1542C157.681 28.3931 156.767 32.6451 154.939 36.9102C153.111 41.1753 150.169 44.6308 146.113 47.2769C141.152 50.6629 137.039 55.25 133.775 61.0383C130.502 66.8353 128.065 73.2068 126.463 80.1527C128.779 81.1363 130.972 82.1808 133.044 83.2862C135.115 84.3917 137.017 85.6799 138.749 87.1509L169.288 75.805C172.483 74.6734 175.464 73.8073 178.232 73.2067C181 72.6062 183.903 72.3102 186.94 72.3189C201.415 72.3189 212.209 78.438 219.32 90.6761C226.44 102.906 230 116.606 230 131.777C230 140.247 227.354 146.683 222.062 151.088C216.77 155.483 210.903 157.681 204.462 157.681C200.327 157.681 196.289 156.767 192.346 154.939C188.403 153.111 185.108 150.169 182.462 146.113C179.085 141.152 174.541 137.039 168.831 133.775C163.121 130.502 156.793 128.065 149.847 126.463C149.029 128.613 148.085 130.676 147.014 132.652C145.943 134.628 144.551 136.66 142.836 138.749L153.869 169.288C154.957 172.291 155.866 175.155 156.597 177.879C157.329 180.604 157.69 183.289 157.681 185.935C157.568 197.233 152.502 207.4 142.484 216.434C132.474 225.478 117.72 230 98.2226 230ZM115.065 138.606C121.637 138.606 127.203 136.304 131.764 131.699C136.325 127.103 138.606 121.515 138.606 114.935C138.606 108.354 136.304 102.788 131.699 98.2357C127.094 93.6834 121.506 91.4029 114.935 91.3942C108.363 91.3855 102.797 93.6878 98.2357 98.301C93.6747 102.914 91.3942 108.502 91.3942 115.065C91.3942 121.628 93.6964 127.195 98.301 131.764C102.905 136.334 108.494 138.615 115.065 138.606ZM97.9746 82.7117C100.455 81.2756 102.988 80.2267 105.573 79.5652C108.158 78.9037 110.77 78.5468 113.407 78.4946C115.148 69.5292 118.133 61.3777 122.364 54.0401C126.594 46.7024 132.065 40.8445 138.776 36.4663C140.699 35.091 142.157 33.4155 143.149 31.4396C144.142 29.4638 144.633 27.0788 144.625 24.2848C144.625 21.1338 143.598 18.479 141.543 16.3204C139.489 14.1618 136.234 13.0737 131.777 13.0563C123.134 13.0563 113.351 15.1018 102.427 19.1928C91.5117 23.2664 85.8278 31.2394 85.3752 43.112C85.3752 45.3402 85.6886 47.4075 86.3153 49.3137C86.942 51.2199 87.4729 52.9347 87.9081 54.4579L97.9746 82.7117ZM42.6941 144.625C45.5665 144.625 49.4878 143.78 54.4579 142.092L82.9598 132.025C81.5236 129.884 80.4356 127.521 79.6957 124.936C78.9472 122.342 78.5468 119.557 78.4946 116.58C69.5292 114.839 61.3777 111.858 54.0401 107.636C46.7024 103.415 40.8445 97.9441 36.4663 91.2245C35.091 89.3008 33.2762 87.8429 31.0218 86.8506C28.7761 85.867 26.5304 85.3752 24.2847 85.3752C20.6551 85.3752 17.8741 86.4023 15.9418 88.4565C14.0268 90.5194 13.0694 93.7748 13.0694 98.2226C13.0694 110.504 15.5936 121.311 20.642 130.641C25.7079 139.964 33.0586 144.625 42.6941 144.625ZM98.2226 216.944C108.798 216.944 119.2 214.58 129.427 209.854C139.663 205.136 144.729 197.163 144.625 185.935C144.625 183.889 144.311 181.975 143.685 180.19C143.058 178.406 142.527 176.856 142.092 175.542L132.025 147.04C129.545 148.642 126.89 149.773 124.061 150.435C121.215 151.096 118.721 151.453 116.58 151.505C114.839 160.471 111.858 168.622 107.636 175.96C103.415 183.298 97.9441 189.156 91.2244 193.534C89.4662 194.744 88.0387 196.471 86.942 198.717C85.8452 200.963 85.323 203.187 85.3752 205.389C85.4274 208.47 86.4545 211.168 88.4565 213.484C90.4672 215.79 93.7226 216.944 98.2226 216.944ZM204.749 144.625C207.987 144.625 210.829 143.706 213.275 141.87C215.721 140.033 216.939 136.669 216.931 131.777C216.931 123.134 214.955 113.298 211.003 102.27C207.051 91.2419 199.013 85.6059 186.888 85.3622C184.66 85.3622 182.632 85.5798 180.804 86.015C178.976 86.4502 177.222 86.9681 175.542 87.5687L147.288 97.9615C148.559 100.277 149.569 102.766 150.317 105.43C151.066 108.093 151.462 110.748 151.505 113.394C160.471 115.135 168.622 118.12 175.96 122.351C183.298 126.581 189.156 132.052 193.534 138.762C194.526 140.355 196.101 141.731 198.26 142.888C200.419 144.037 202.582 144.612 204.749 144.612" fill="white"/>
                                </svg>
                            </div>
                            <div>
                                <Switch
                                color="green"
                                />                        
                            </div>
                        </div>
                        <div className='col-span-4 flex gap-3 items-center py-5' style={{backgroundColor:'#637381', flexDirection: 'column', borderRadius:'15px'}}>
                            <Typography
                                variant="h5"
                                color="white"
                                align="center"
                                className="font-medium leading-[1.5] w-full"
                                >
                                Trạng thái máy bơm
                            </Typography>
                            <div>
                                <svg width="200" height="200" viewBox="0 0 238 170" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.75 147.5H78.425C72.475 143.8 67.1083 139.304 62.325 134.012C57.5417 128.729 53.6833 122.808 50.75 116.25H12.75V147.5ZM119 147.5C136.292 147.5 151.033 141.404 163.225 129.212C175.417 117.021 181.508 102.283 181.5 85C181.492 67.7167 175.396 52.9792 163.213 40.7875C151.029 28.5958 136.292 22.5 119 22.5C101.708 22.5 86.9708 28.5958 74.7875 40.7875C62.6042 52.9792 56.5083 67.7167 56.5 85C56.4917 102.283 62.5875 117.025 74.7875 129.225C86.9875 141.425 101.725 147.517 119 147.5ZM187.25 53.75H225.25V22.5H159.575C165.525 26.2 170.892 30.6958 175.675 35.9875C180.458 41.2708 184.317 47.1917 187.25 53.75ZM0.25 169.625V94.125H12.75V103.75H46.625C45.725 100.708 45.0625 97.6375 44.6375 94.5375C44.2125 91.4375 44 88.2583 44 85C44 64.1083 51.275 46.3833 65.825 31.825C80.375 17.2667 98.1 9.99167 119 10H225.25V0.375H237.75V75.875H225.25V66.25H191.375C192.275 69.2917 192.942 72.3667 193.375 75.475C193.808 78.5833 194.017 81.7583 194 85C194 105.892 186.725 123.617 172.175 138.175C157.625 152.733 139.9 160.008 119 160H12.75V169.625H0.25ZM119 112.65C113.725 112.65 109.283 110.842 105.675 107.225C102.067 103.608 100.258 99.1667 100.25 93.9C100.25 90.55 101 87.1333 102.5 83.65C104 80.1667 106.679 75.4875 110.538 69.6125L118.763 57.3625L127.225 69.6125C131.342 75.7958 134.125 80.5458 135.575 83.8625C137.025 87.1625 137.75 90.5083 137.75 93.9C137.75 99.1667 135.942 103.608 132.325 107.225C128.717 110.842 124.275 112.65 119 112.65Z" fill="white"/>
                                </svg>
                            </div>
                            <div>
                                <Switch
                                color="green"
                                />                        
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>
    )
}