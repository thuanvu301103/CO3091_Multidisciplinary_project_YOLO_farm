// SSEComponent.js
import React, { useEffect, useState } from 'react';
import axios from "axios";

export function SSEComponent (feed, variant, userid, areaid) {
	const [data, setData] = useState(null);

	useEffect(() => {
    		const eventSource = new EventSource('http://127.0.0.1:3000/envsense');

		// Default value when no message
		const fetchData = async (userid, areaid) => {
      			try {
        			const response = await axios.get(`http://127.0.0.1:3000/envsense/user/${userid}/plantarea/${areaid}`);
     				setData(response.data);
      			} catch (error) {
        			console.error('Error fetching data:', error);
      			}
    		};
		
		
		// Change value when changes occurred
        eventSource.onmessage = (event) => {
      			const eventData = JSON.parse(event.data);
      			console.log('Received event:', eventData);
			setData(eventData);
      			// Handle the received event data
    		};

    		eventSource.onerror = (error) => {
      			console.error('SSE connection error:', error);
      			// Handle SSE connection error
    		};

    		return () => {
      			eventSource.close();
    		};
  	}, []);

  	if (feed === 'nhiet-do') {
		if (variant === 'list') {
			if (data['feed'] === 'ma_feed_nhiet_do') {
				return data['curent_value']; 
			}
		}
  	} else if (feed === 'do-am') {
    		if (variant === 'list') {
			if (data['feed'] === 'ma_feed_do_am') {
				return data['curent_value']; 
			}
		}
  	} else if (feed === 'anh-sang'){
    		if (variant === 'list') {
			if (data['feed'] === 'ma_feed_anh_sang') {
				return data['curent_value']; 
			}
		}
  	}
};