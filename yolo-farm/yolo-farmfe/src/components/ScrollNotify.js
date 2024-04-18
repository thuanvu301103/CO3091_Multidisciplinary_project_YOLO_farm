import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export function ScrollableTable({ userid }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1); // Track current page of data
    const tableRef = useRef(null);
    //console.log("Url: ", `http://localhost:3000/notifier/users/${userid}/notifies?page=${page}&limit=10`);
    const history = useNavigate();

    const formatDate = (isoDateString) => {
        const isoDate = new Date(isoDateString);

        // Định dạng lại ngày giờ theo định dạng mong muốn (ví dụ: "dd/mm/yyyy hh:mm:ss")
        return `${isoDate.getDate()}/${isoDate.getMonth() + 1}/${isoDate.getFullYear()} ${isoDate.getHours()}:${isoDate.getMinutes()}:${isoDate.getSeconds()}`;

    }

    const formatmessage = (feed_type, evaluate, curent_value, id) => {
        let temp_data_1 = "Cảnh báo ";

        // feed type
        if (feed_type == 'ma_feed_nhiet_do') temp_data_1 += "nhiệt độ ";
        else if (feed_type == 'ma_feed_do_am') temp_data_1 += "độ ẩm ";
        else temp_data_1 += "ánh sáng ";

        // evaluate
        if (evaluate < 0) temp_data_1 += "quá thấp ";
        else if (evaluate > 0) temp_data_1 += "quá cao ";

        temp_data_1 += "nhưng không được điều chỉnh!";


        let temp_data_2 = "Chỉ số hện tại: ";
        temp_data_2 += curent_value;


        // Location
        let temp_data_3 = "Mã khu cây trồng: " + id;
        
        return <div> {temp_data_1} <br /> {temp_data_2} <br /> {temp_data_3} </div>;
        /*
        let user_id = eventData["nguoi_dung_id"];
        let area_id = eventData["id"];
        let redirect_link = `http://localhost:3001/user/${user_id}/area/${area_id}`;
        */
    }

    const redirectlink = (userid, areaid) => {
        history(`user/${userid}/area/${areaid}`);

    }

    // Fetch data from API
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/notifier/users/${userid}/notifies?page=${page}&limit=10`);
            const newData = await response.json();
            setData((prevData) => [...prevData, ...newData]);
            setPage((prevPage) => prevPage + 1);
            console.log("Notify Table data", newData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    };

    // Load more data when user scrolls to the bottom of the table
    const handleScroll = () => {
        const table = tableRef.current;
        if (table) {
            const { scrollTop, clientHeight, scrollHeight } = table;
            if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
                fetchData();
            }
        }
    };

    // Attach scroll event listener when component mounts
    useEffect(() => {
        fetchData(); // Initial data fetch
        const table = tableRef.current;
        table.addEventListener('scroll', handleScroll);
        return () => {
            table.removeEventListener('scroll', handleScroll);
        };
    }, []); // Run once on component mount

    return (
        <div className="table-container" ref={tableRef} style={{ maxHeight: '50rem',overflow: 'auto' }}>
            <table className="table-auto text-left">
                <tbody>
                    {data.map((item) => (
                        
                        <tr key={item.id} className="even:bg-blue-gray-50/50" onClick={() => redirectlink(item.nguoi_dung_id, item.khu_cay_trong_id)}>
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal leading-none opacity-70 p-4"
                                borderColor="red"
                                
                            >
                                
                                    <td>{formatDate(item.time)}</td><td>{formatmessage(item.feed_type, item.evaluate, item.current_value, item.khu_cay_trong_id)}</td>
                                
                            </Typography>
                            {/* Add more table body columns as needed */}
                            </tr>
                       
                    ))}
                    {loading && (
                        <tr>
                            <td colSpan="3" className="loading-cell">
                                Loading...
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
