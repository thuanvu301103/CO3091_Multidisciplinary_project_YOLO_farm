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

import { Header } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { Footer } from './components/Footer';
import { ScrollableTable } from './components/ScrollNotify';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

import 'react-toastify/dist/ReactToastify.css';

import {
  BrowserRouter as Router,
  Switch,
    Route,
    Navigate,
  Link,
  useRouteMatch,
  useParams,
  Routes
} from "react-router-dom";

function App() {

    // The constants are maintained in a session
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState(null);
    const [userrole, setUserRole] = useState(null);
    const [userid, setUserId] = useState(null);

    const [notifyData, setNotifyData] = useState(null);
    const [notifyExpand, setNotifyExpand] = useState(false);
    const [notifyCol, setNotifyCol] = useState("col-span-10");
    const [checkDupData, setCheckDupData] = useState(null);
    const [haveNotify, setHaveNotify] = useState(false);
    //const history = useNavigate();

    const reverseNotifyExpand = async () => {
        await setNotifyExpand(!notifyExpand);
        if (notifyExpand) setNotifyCol("col-span-7");
        else setNotifyCol("col-span-10");
    }

    const reverseHaveNotify = async () => {
        await setHaveNotify(!haveNotify);
    }

    const handleLogin = (userid, username, role) => {
        setUsername(username);
        setUserRole(role);
        setUserId(userid);
        setLoggedIn(true);
        console.log(userrole);
    }

    const handleLogout = () => {
        setUsername(null);
        setUserRole(null);
        setUserId(null);
        setLoggedIn(false);
    }
    
    const showToastMessage = (notify_data) => {

        toast.error(notify_data['data'], {
            position: "bottom-left", // Use string value for position directly
            autoClose: false
            /*
            onClick: () => {
                // Redirect to example.com when the notification is clicked
                history.push(notify_data['link']);
            },
            */
        });
    };
    

    // Start to hear from be user when User has aldready logged in
    // Handle SSE noyify messages from be-server
    useEffect(() => {
        const fetchData = async (userid) => {
            try {
                const eventSource = new EventSource(`http://127.0.0.1:3000/notifier/user/${userid}/streamevent`); // Create a connection to be-server then maintain it in time

                // Change value when changes occurred
                eventSource.onmessage = async (event) => {
                    const eventData = JSON.parse(event.data);
                    //console.log('Received event:', eventData);
                    // Handle the received event data
                    let temp_data_1 = "Cảnh báo ";

                    // feed type
                    if (eventData['feed_type'] == 'ma_feed_nhiet_do') temp_data_1 += "nhiệt độ ";
                    else if (eventData['feed_type'] == 'ma_feed_do_am') temp_data_1 += "độ ẩm ";
                    else temp_data_1 += "ánh sáng ";

                    // evaluate
                    if (eventData['evaluate'] < 0) temp_data_1 += "quá thấp ";
                    else if (eventData['evaluate'] > 0) temp_data_1 += "quá cao ";

                    temp_data_1 += "nhưng không được điều chỉnh!";


                    let temp_data_2 = "Chỉ số hện tại: ";
                    temp_data_2 += eventData['curent_value'];
                    

                    // Location
                    let temp_data_3 = "Mã khu cây trồng: " + eventData['id'];
                    

                    let notify_data = <div> {temp_data_1} <br /> {temp_data_2} <br /> {temp_data_3} </div>;
                    let check_dup = temp_data_1 + temp_data_2 + temp_data_3;
                    let user_id = eventData["nguoi_dung_id"];
                    let area_id = eventData["id"];
                    let redirect_link = `http://localhost:3001/user/${user_id}/area/${area_id}`;

                    console.log("Check Dup:", checkDupData);
                    // Avoid duplicate due to pasive listening
                    if (check_dup != checkDupData) {
                        
                        await setNotifyData({ data: notify_data, link: redirect_link});
                        await setCheckDupData(check_dup);
                    }
                    else return;
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
            //console.log("Temp Data: ", tempData);
        } 
    }, [loggedIn]);

   
    // Call showToastMessage to show notifier when notifyData change
    useEffect(() => {
        const fetchData = async () => {
            try {
                showToastMessage(notifyData);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [notifyData]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                reverseHaveNotify();

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [notifyData]);

    return (
        <Router>

            <div>
                <ToastContainer />
                <Header logined={loggedIn} role={userrole} username={username} reverseNotifyExpand={reverseNotifyExpand} haveNotify={haveNotify} reverseHaveNotify={reverseHaveNotify}></Header>
                <Routes>
                    <Route path='/login' element={<LoginPage handleLoginfunc={handleLogin}/>} />
                </Routes>

                {loggedIn ? (
                    <div className="grid grid-cols-12">
                        <div className="col-span-2">
                            <Sidebar handleLogout={handleLogout}></Sidebar>
                        </div>
                        <div className={notifyCol}>
                            
                            <Routes>
                                {/*User Routes*/}
                                <Route path='/user/:userid/area/list' element={<DashboardPage />} />
                                <Route path='/login' element={<LoginPage />} />
                                <Route path='/user/:userid/area/:areaid' element={<DetailPage />} />
                                <Route path='/user/:userid/area/:areaid/history' element={<HistoryPage />} />
                                <Route path='/user/:userid/area/:areaid/tempschedule' element={<TempSchedulePage />} />
                                <Route path='/user/:userid/area/:areaid/midschedule' element={<MidSchedulePage />} />

                                {/*Manager Routes*/}
                                <Route path='/manager/:managerid/area/list' element={<DashboardPageManager />} />
                                <Route path='/manager/:managerid/area/:areaid' element={<DetailPageManager />} />
                                </Routes>
                            
                        </div>
                        {!notifyExpand?(
                            <div className="col-span-3">
                                <ScrollableTable userid={userid} > </ScrollableTable>
                            </div>
                            ):null
                        }
                    </div>
                    ) : <Navigate to="/login" />
                }
                <Footer></Footer>
            </div>
        </Router>
    );
}

export default App;