import React, { useEffect, useState } from "react";
import logo from './logo.svg';
import './App.css';
import { DetailPage } from './pages/detailPage/DetailPage'
import { DashboardPage } from './pages/dashboardPage/DashboardPage';
import { LoginPage } from './pages/loginPage/LoginPage';
import { HistoryPage } from "./pages/historyPage/HistoryPage";
import {TempSchedulePage} from './pages/schedulePage/tempSchedulePage/TempSchedulePage';
import { MidSchedulePage } from "./pages/schedulePage/midSchedulePage/MidSchedulePage";

import {DashboardPageManager } from "./pages/dashboardPageManager/DashboardPageManager";
import { DetailPageManager } from "./pages/detailPageManager/DetailPageManager";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
  Routes
} from "react-router-dom";

function App() {

    // The constants are maintained in a session
    const [loggedIn, setLoggedIn] = useState(true);
    const [username, setUsername] = useState('');
    const [userrole, setUserRole] = useState('');
    const [userid, setUserId] = useState('65f0529c5933e074166715a5');

    const [tempData, setTempData] = useState(null);
    const [lightData, setLightData] = useState(null);
    const [midData, setMidData] = useState(null);

    const handleLogin = (username, user_role, user_id) => {
        setUsername(username);
        setUserRole(user_role);
        setUserId(user_id);
        setLoggedIn(true);
    }
    const hendleLogout = () => {
        setUsername('');
        setUserRole('');
        setUserId('');
        setLoggedIn(false);
    }

    // Start to hear from be user when Usẻ has aldready logged in
    // Handle SSE messages from be-server
    useEffect(() => {
        const fetchData = async (userid) => {
            try {
                const eventSource = new EventSource(`http://127.0.0.1:3000/envsense/user/${userid}/streamevent`); // Create a connection to be-server then maintain it in time

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
                    /*
                    } else if (eventData['feed_type'] === 'ma_feed_nutnhan_den') {
                        setLightRelayState(eventData['curent_value']);
                    } else if (eventData['feed_type'] === 'ma_feed_nutnhan_maybom') {
                        setFanPumpRelayState(eventData['curent_value']);
                        console.log("Fan + Pump Relay State: ", eventData['curent_value'])
                    }
                    */
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
        // If logged in then start to listen SSE mesages
        if (loggedIn) {
            fetchData(userid);
            console.log("Temp Data: ", tempData);
        } 
    }, [/*loggedIn*/]);

    return (
        <Router>


            <Routes>
                
                {/*User Routes*/}
                <Route path='/user/:userid/area/list' element={<DashboardPage/>}/>
                <Route path='/login' element={<LoginPage/>}/>
                <Route path='/user/:userid/area/:areaid' element={<DetailPage/>}/>
                <Route path='/user/:userid/area/:areaid/history' element={<HistoryPage/>}/>
                <Route path='/user/:userid/area/:areaid/tempschedule' element={<TempSchedulePage/>}/>
                <Route path='/user/:userid/area/:areaid/midschedule' element={<MidSchedulePage/>}/>

                {/*Manager Routes*/}
                <Route path='/manager/:managerid/area/list' element={<DashboardPageManager/>}/>
                <Route path='/manager/:managerid/area/:areaid' element={<DetailPageManager/>}/>
            </Routes>
        </Router>
    );
}

export default App;