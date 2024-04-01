# CO3091_Multidisciplinary_project_YOLO_farm

## Install necessary packages 
### Install necessary packages for back-end server using npm
- Integrate Adafruit IO's MQTT service: ```npm install mqtt```
- Run web apps concurrently: ```npm install -g concurrently```
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
### API Doc
#### About the post message that be-server sends to fe-server whenerver there is change in adafruit server:
- Message format:
```
{
	"feed_key": {feed_key: string - Ex: "nguyenthanhchung/feeds/cambien1"},
        "feed": {feed name: string - Ex: "ma_feed_anh_sang"},
        "curent_value": {cur_val: string},
        "evaluate": {eval_val: string},
        "chart_data": [
				[date: string, value: string],
				["2024-03-22T02:46:26Z","55.0"],
				...
                      ]

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
    		"id": {area_id: string},
    		"ten_khu_cay_trong": {area_plan: string},
    		"nguoi_dung_id": {user_id: string},
    		"ten_ke_hoach": {plan_name: string},
    		"anh_sang": {
        		"curent_value": {current_light_value: string},
        		"evaluate": {compare_curr_value_to_the_range: number},
        		"chart_data": [
				["yyyy-mm-ddThh:mm:ssZ","value"],
				...
			]
		},
    		"nhiet_do": {
        		"curent_value": "11",
        		"evaluate": -9,
        		"chart_data": []
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
          ]
      }
    ```

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
### Sitemap
- ```localhost:3001/user/{userid}/arealist```: list of plant area of a user with specific userid
