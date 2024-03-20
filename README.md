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
    const feeds = [
		  'feed_MQTT_by_key_1',
		  'feed_MQTT_by_key_1'
	  ];

    export {username, activekey, feeds};
    ```