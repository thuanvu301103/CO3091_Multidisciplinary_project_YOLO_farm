# CO3091_Multidisciplinary_project_YOLO_farm

## Install necessary packages using npm
-  Integrate Adafruit IO's MQTT service: ```npm install mqtt```

## Config YOLO-Farm backend server ```yolo-farmbe```
### Integrate Adafruit IO's MQTT service
- Purpose: listen for feed changes from IoT Server ```Adafruit```
- Precondition:
  + You need to have Adafruit account. In Adafruit dashboard, click "Key" symbol then copy ```Username``` and ```ActiveKey```;
  + You need to have a feed to access (in case yu use shared feed from other source, you have to make sure that you are able to read and write to that feed - ask feed's owner to grand you accesses), then copy ```MQTT by key```;
- Instruction:
  + Create a config file for adafruit variables:
    ```
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
    ```
    \\ file: envsense.service.ts
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
    				this.mqtt_client.subscribe(i);
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
    ```
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
