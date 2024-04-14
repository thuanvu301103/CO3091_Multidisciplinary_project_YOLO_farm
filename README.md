# CO3091_Multidisciplinary_project_YOLO_farm

## Install necessary packages 
### Install necessary packages for back-end server using npm
- Integrate Adafruit IO's MQTT service: ```npm install mqtt```
- Run web apps concurrently: ```npm install -g concurrently```
- Scheduled tasks: ```npm install @nestjs/schedule```
### Install necessary packages for front-end server using npm
- Handle routing in React applications: ```npm install react-router-dom```


## Run the Servers
Open Terminal
- Navigate to folder ```yolo-farmbe```, run ```nest start```
- Wait until the program runs successfully, then open a neww Terminal tab
- Navigate to folder ```yolo-farmfe```, run ```npm start```. It will ask you to run the fe server on port 3001, please enter ```yes```. 
- Import all JSON file inside folder (this step is only needed when there is no data in MongoDB server or you want to update the structure)

## Config YOLO-Farm backend server ```yolo-farmbe```
### CORS (Cross-Origin Resource Sharing) policy 
- CORS is a security feature implemented by browsers that restricts web applications from making requests to domains other than the one from which the application was served.
- In our case, we're making a request from ```http://localhost:3001``` to ```http://localhost:3000```, which are different origins according to the browser. As a security measure, the server at ```http://localhost:3000``` must include the appropriate CORS headers to allow requests from ```http://localhost:3001```.
```typescript
// file: main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Enable CORS with specific origin
  	app.enableCors({
    		origin: 'http://localhost:3001', // Allow requests from this origin
    		// Other CORS options can be configured here
  	});

	await app.listen(3000);
}
bootstrap();
```

### Integrate Adafruit IO's MQTT service
- Purpose: listen for feed changes from IoT Server ```Adafruit```
- Precondition:
  + You need to have Adafruit account. In Adafruit dashboard, click "Key" symbol then copy ```Username``` and ```ActiveKey```;
  + You need to have a feed to access (in case yu use shared feed from other source, you have to make sure that you are able to read and write to that feed - ask feed's owner to grand you accesses), then copy ```MQTT by key```;
- Instruction:
  + Create a config file for adafruit variables:
    ```javascript
    // file: config.adafruitenv.ts
    // Adafruit account's Username
    const username = 'your_adafruit_username';
	
    // Adafruit account's Active key
    const activekey = 'your_adafruit_active_key';

    // Feeds' names
    const feeds = ['feed_MQTT_by_key_1', 'feed_MQTT_by_key_2'];

    export {username, activekey, feeds};
    ```
  + Setup mqtt connect: Since mqtt broker use concurrency model and we want our be-server to handle other task while still listening to adafruit-server, we consider defien mqtt broker in constructor:
    ```javascript
    // file: envsense.service.ts
    import * as mqtt from 'mqtt';
    import axios from 'axios';
    import * as adafenv from '../config/config.adafruitenv'

    @Injectable()
    export class EnvsenseService {
    	private fe_url = "https://127.0.0.1:3001";
    	private mqtt_client;

    	constructor() {
  
    		// Connect to Adafruit IO MQTT broker
        	this.mqtt_client = mqtt.connect('mqtt://io.adafruit.com', {
            		username: adafenv.username,
            		password: adafenv.activekey
        	});

        	// Subscribe to your feed(s)
        	this.mqtt_client.on('connect', () => {
            		for (let i in adafenv.feeds) {
    				this.mqtt_client.subscribe(adafenv.feeds[i]);
            		}
            		console.log('Connected to Adafruit IO MQTT');
    		});
    
    		// Handle incoming messages
        	this.client.on('message', (topic, message) => {
            		console.log(`Received message on feed ${topic}: ${message.toString()}`);
            		// Handle the message as needed
            		//...//
        	});

        	// Handle errors
        	this.client.on('error', (err) => {
            		console.error('Adafruit IO MQTT error:', err);
        	});
    	}

    }
    ```
   + After receiving feed's change, we want user see this change on browser so be-server must send this data imediately to fe-server:
    ```javascript
    private async sendFeedChangeToFe(url: string, message: string): Promise<void> {
        try {
            const response = await axios.post(url, message);
            console.log('Data sent successfully:');
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                console.error('Connection refused. The server is not reachable.');
                // Handle the error gracefully, e.g., log it or emit an event
            } else {
                console.error('Error sending data:', error);
                // Handle other types of errors as needed
            }
        }
    }
    ```
  Caution:
  	* Add this method to class ```EnvsenseService``` and call it at comment ```// Handle the message as needed```
	* Whener using post, I suggest using ```async``` and ```await```. The reasons are quite simple: First, ```async``` makes sending message task executed concurrently without blocking the execution of other tasks; second, ```await``` pauses the execution of the sending message method until a post method is complete, if we do not use ```await```, the method return success and skip "catch (error)" since the message is successfully sent, but if the destination server do not return message, post method will raises error (since we skiped catch pharse) and our be server will be forced to stop. In the other hand, if we use ```await```, the method is paused until post method receives "success" message from destination server; since we still inside try block, if post method raises error, our server wont be stopped since we have catch block to handle this situation.

### Realtime data streaming using server-sent events(SSE) - Sending messages from be-server
- The purpuse of SSE iss to maintain a connection between be-server and fe-server (client)
- To implement this, we have to reserve a route to maintain the connecion (let's say ```http://127.0.0.1:3000/envsense``` for our project), when ever a client call this route, it will establish a connection and listen to messages from be-server
- The headers and content of HTTP messages must be in specific format. The content musst be in format ```"data:" + JSON data string + "\n\n"``` 
```typescript
// file: envense.controller.ts
	@Get('user/:userid/streamevent')
	async streamEvent(@Res() res) {
		// Set up HTTP header for stream Event
		res.setHeader('Content-Type', 'text/event-stream');
    	res.setHeader('Cache-Control', 'no-cache');
    	res.flushHeaders();

		// Sent first message when connection iss esstablished
		//res.write();
	
		// Sent message when changes occurred	
		this.envsenseService.mqtt_client.on('message', async (topic, message) => {

            let detail = await this.envsenseService.evaluateVal(topic, message);
            console.log(detail);

            console.log(`Received message on topic ${topic} - feed ${detail.feed_name} - evaluation ${detail.evaluate}: ${message.toString()}`);
            // Handle the message as needed
            let res_data = JSON.stringify(await this.envsenseService.updatePlantAreaChage(topic, detail.feed_name, message - 0, detail.evaluate));
			console.log('Sent data: ', res_data);
            res.write("data:" + res_data + "\n\n");
        });
	}
```

### Schedule tasks
- We use ```Cron``` to schedule tasks. In our senario, we want to schedule the task of turning on orr off light relay  
- 

### API Doc
#### About the SSE message that be-server sends to fe-server whenerver there is change in adafruit server:
- Url: ```/envsense/user/{user_id}/streamevent```
- Message format:
```
{
	data:{
		"id":"65f0529c5933e074166715a8",
		"nguoi_dung_id":"65f0529c5933e074166715a5",
		"feed_type":"ma_feed_anh_sang",
		"curent_value":15,
		"evaluate":0,
		"high_warning":50,
		"low_warning":15
	}
}
```
- Caution: We assume that 
  + (evaluate < 0) show that the curent value is below the low level;
  + (evaluate > 0) show that the curent value is above the high level;
  + (evaluate = 0) show that the curent value is in normal condition.
#### About parameter in URL
In the context of RESTful APIs, the two most common ways to handle dynamic data in routes are through dynamic route parameters and query parameters. These are widely supported and align well with the principles of REST. Let's explore each in more detail:
- Dynamic Route Parameters:
  + Dynamic route parameters are an essential part of RESTful routing. They allow for specifying variable parts of the URL path that identify specific resources.
  + Dynamic route parameters are directly tied to the resource being requested and are often used to represent resource identifiers (e.g., user IDs, post IDs).
  + They provide a clean and intuitive way to structure URLs, making them easy to read and understand.
  + Example: /users/:userId - Represents a specific user resource identified by the userId parameter.
- Query Parameters:
  + Query parameters are another common way to pass dynamic data in RESTful APIs. They are appended to the URL and provide additional information or filtering criteria for a request.
  + Query parameters are versatile and can be used for various purposes, such as filtering, sorting, pagination, or providing optional parameters.
  + They allow for more flexible and complex requests by providing a way to pass multiple parameters in a single request.
  + Example: /users?sortBy=name - Specifies sorting criteria for the list of users.
Both dynamic route parameters and query parameters are fully compatible with the principles of REST, and their usage depends on factors such as the nature of the data being passed, the desired URL structure, and the conventions of the API design. REST does not prescribe one over the other, and both are widely used in RESTful API implementations.
#### About parameter in nestJS
- Dynamic Route Parameters: use ```@Param``
  ```javascript
  @Get('user/:id/plantarea/list')
    async getListPlantArea(@Param('id') id: string): Promise<any[]> {
        return this.envsenseService.getListPlantArea(id);
  }
  ```
- Query Parameters: use ```@Query```
  ```javascript
  @Get('user/:userid/plantarea/:areaid/history')
    async getHistoryData(
        @Query('filter') filter: string,
        @Query('start_time') start_time: string,
        @Query('end_time') end_time: string,
        @Param('userid') userid: string,
        @Param('areaid') areaid: string
    ) {/*..*/.}
  ```
#### API for getting automatic mode/ light relay/ pump/ fan state
- Get sutomatic mode button state:
   + url ```user/{user_id}/plantarea/{area_id}/automatic```
   + Successful response: 1 for turning on and 0 for turning off
- Get light relay state:
   + url ```user/{user_id}/plantarea/{area_id}/light/state```
   + Successful response: 1 for turning on and 0 for turning off
- Get fan and pump state:
   + url ```user/{user_id}/plantarea/{area_id}/fanpump/state```
   + Successful response: 1 for turning on and 0 for turning off


#### API for usecase 1: Supervise the plant area
* Caution: because, be server is run on localhost, sô the url must start with: ```http://127.0.0.1:3000```
- Get list of plant areas of specific user
  + Url: ```/envsense/user/{user_id}/plantarea/list```
  + Successful response format:
    ```
    [
 		{
        		"_id": {plant_area_id: string},
        		"ma_feed_anh_sang": {mqtt_feed_key_1: string},
        		"ma_feed_nhiet_do": {mqtt_feed_key_2: string},
        		"ma_feed_do_am": {mqtt_feed_key_2: string}
    		},
    		...
    ]
    ```
  + Caution:
    * Since we have limited hardwware, so we only use feeds from the first plant area in database (find this plant area's information in folder ```yolo-farrmdb```);
    * ```ma_feed_anh_sang, ma_feed_nhiet_do, ma_feed_do_am``` are corepond to the feed change messages that are send from be to fe server.
- Get detail of a plant area of specific user
  + Url: ```/envsense/user/{user_id}/plantarea/{area_id}```
	ex: http://127.0.0.1:3000/envsense/user/65f0529c5933e074166715a5/plantarea/65f0529c5933e074166715a8
  + Successful response format:
    ```
    [
	{
	    id: area._id,
            ten_khu_cay_trong: area.ten,
            nguoi_dung_id: user_id,
            ten_ke_hoach: plan_name,
            anh_sang: {
                curent_value: curr_anh_sang,
                evaluate: eval_anh_sang,
                high_warning: plan.gioi_han_tren_anh_sang,
                low_warning: plan.gioi_han_duoi_anh_sang
            },
            nhiet_do: {
                curent_value: curr_nhiet_do,
                evaluate: eval_nhiet_do,
                high_warning: plan.gioi_han_tren_nhiet_do,
                low_warning: plan.gioi_han_duoi_nhiet_do
            },
            do_am: {
                curent_value: curr_do_am,
                evaluate: eval_do_am,
                high_warning: plan.gioi_han_tren_do_am,
                low_warning: plan.gioi_han_duoi_do_am
            }
	}
    ]
    ```
- Get history of a plant area of specific user to create chart:
  + Url: 
    * Getting chart data of current date: ```/envsense/user/{user_id}/plantarea/{area_id}/history?filter=day```
    * Getting chart data of current month: ```/envsense/user/{user_id}/plantarea/{area_id}/history?filter=month```
    * Getting chart data of current year: ```/envsense/user/{user_id}/plantarea/{area_id}/history?filter=year```
    * Getting chart data between specific dates: ```/envsense/user/{user_id}/plantarea/{area_id}/history?start_time={yyyy-mm-dd}&end_time={yyyy-mm-dd}```
  + Successful response format:
    ```
      {
         "anh_sang_chart_data": [
              ["2024-03-16T14:23:48Z","15.0"],
              ["2024-03-16T14:23:52Z","30.0"],
	      ...
          ],
         "nhiet_do_chart_data": [
              ["2024-03-16T14:23:48Z","15.0"],
              ["2024-03-16T14:23:52Z","30.0"],
	      ...
          ],
          "do_am_chart_data": [
              ["2024-03-16T14:23:48Z","15.0"],
              ["2024-03-16T14:23:52Z","30.0"],
	      ...
          ]
      }
    ```

#### API for usecase 2: Supervise Light Relay for plant area
- Get current Light relay state (on or off)
  + Url: ```/envense/user/{userid}/plantarea/{areaid}/light/state```  
  + Response: 1 for on; 0 for off
- Send signal to turn off or on light relay
  + Url: ```/envense/user/{userid}/plantarea/{areaid}/light/turnon/{turnon}```. With ```turnon === 1``` means turn on the light relay; ```turnon === 0``` means turn off the light.
  + Response: 
	> Successed: {200: "OK"}
	> Failed: {403: "Forbidden: manual mode is off"}
- Get current Light mode
  + Url: ```/envense/user/{userid}/plantarea/{areaid}/light/getmode```  
  + Response: "thu cong" or "theo lich"
- Change light mode
  + Url: ```/envense/user/{userid}/plantarea/{areaid}/light/mode/{mode}```. With ```mode``` equals ```tu dong``` or ```thu cong``` or ```theo lich```.
  + Response: 
	> Successed: {200: "OK"}
	> Failed: 
		{500: "Internal Server Error"}
		{400: "Bad Request"}

#### API for usecase 3: Supervise Fan+Pump for plant area
- Get current Fan + Pump relay state (on or off)
  + Url: ```/envense/user/{userid}/plantarea/{areaid}/fanpump/state```  
  + Response: 1 for on; 0 for off
- Send signal to turn off or on fan + pump relay
  + Url: ```/envense/user/{userid}/plantarea/{areaid}/fanpump/turnon/{turnon}```. With ```turnon === 1``` means turn on the relay; ```turnon === 0``` means turn off the relay.
  + Response: 
	> Successed: {200: "OK"}
	> Failed: {403: "Forbidden: manual mode is off"}
- Get current Fan + Pump mode
  + Url: ```/envense/user/{userid}/plantarea/{areaid}/fabpump/getmode```  
  + Response: "thu cong" or "theo lich"
- Change light mode
  + Url: ```/envense/user/{userid}/plantarea/{areaid}/light/mode/{mode}```. With ```mode``` equals ```tu dong``` or ```thu cong``` or ```theo lich```.
  + Response: 
	> Successed: {200: "OK"}
	> Failed: 
		{500: "Internal Server Error"}
		{400: "Bad Request"}

## Config YOLO-Farm frontend server ```yolo-farmfe```
### Define routs
```javascript
// file: src/App.js 
import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from './logo.svg';
import './App.css';
import { DetailPage } from './pages/detailPage/DetailPage'
import { HistoryPage } from "./pages/chartPage/HistoryPage";
import { DashboardPage } from './pages/dashboardPage/DashboardPage';
import { LoginPage } from './pages/loginPage/LoginPage';
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
  return (
    <Router>
      <Routes>
        <Route path='/user/:userid/arealist' element={<DashboardPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/detail' element={<DetailPage/>}/>
        <Route path='/history' element={<HistoryPage/>}/>
      </Routes>
      {/* <DetailPage></DetailPage> */}
      {/* <HistoryPage></HistoryPage> */}
    </Router>
  );
}

export default App;
```

### Realtime data streaming using server-sent events(SSE) - Receiving messages in fe-server 
```javascript
// file: DetailPage.js
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
```


### Using ```useEffecct()``` to perform side effects in your components.
- The useEffect Hook allows you to perform side effects in your components.
- Some examples of side effects are: fetching data, directly updating the DOM, and timers.
- useEffect accepts two arguments. The second argument is optional: ```useEffect(<function>, <dependency>)```
- Caution: since the page sent to browser (html) is rendered continuosly, so when ```return```, you need to make sure that the changing element is other than ```null```
```typescript
// file: Detailpage.js
	// Get params from URL
	const paramURL = useParams();
	let userid = paramURL['userid'];
	let areaid = paramURL['areaid'];
    	
    	const [area_name, setAreaName] = useState(null);

	// Fetch data for the first time enter detail page
    	useEffect(() => {
        	const fetchData = async () => {
            		try {
                		const apiUrl = `http://localhost:3000/envsense/user/${userid}/plantarea/${areaid}`;
                		// Make the HTTP GET request using Axios
                		const response = await axios.get(apiUrl);
                		let res_data = response.data;
                		setAreaName(res_data['ten_khu_cay_trong']);
            		} catch (error) {
                		console.error('Error fetching data:', error);
            		}
        	};
        	fetchData();
    	}, []);

    	console.log ('Area\'s name: ', area_name);
	
	// Return rendered page
	return (
        	<>          
                  	{tempData && tempData.curent_value &&`${tempData.curent_value}`}
                </>
    		);
```

###

### Sitemap:
- ```http://localhost:3001/user/{userid}/area/list```: list of plant area of a user with specific userid
- ```http://localhost:3001/user/{userid}/area/{areaid}```: detail of plant area of a user with specific userid and areaid
- ```http://localhost:3001/user/{userid}/area/{areaid}/history```: history of plant area of a user with specific userid and areaid

Example: 
- userid = 65f0529c5933e074166715a5
- areaid = 65f0529c5933e074166715a8
