import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Header } from "../../components/Navbar";
import {Sidebar} from "../../components/Sidebar";
import {Footer} from "../../components/Footer"
import { Typography, Button } from "@material-tailwind/react";
import { TempHistory } from "./TempHistory";
import { LightHistory } from "./LightHistory";
import { MoistureHistory } from "./MoistureHistory";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";


export function HistoryPage() {

    // Get params from URL
    const paramURL = useParams();
    let userid = paramURL['userid'];
    let areaid = paramURL['areaid'];
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
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

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
                        <Link to={`/user/${userid}/area/${areaid}`}>
                            <Button className="rounded-3xl" style={{height:'40px',backgroundColor:'#DEE2E6', color:'#000000'}}>
                                Trở về
                            </Button>
                        </Link>
                    </div>
                    <div className="col-span-12">
                        <TempHistory></TempHistory>
                        <LightHistory></LightHistory>
                        <MoistureHistory></MoistureHistory>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>
    )
}