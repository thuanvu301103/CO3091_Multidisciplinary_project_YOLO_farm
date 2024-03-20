import { Injectable } from '@nestjs/common';
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
            console.log(`Received message on topic ${topic}: ${message.toString()}`);
            // Handle the message as needed
            this.sendFeedChangeToFe(this.fe_url, message.toString());
        });

        // Handle errors
        this.client.on('error', (err) => {
            console.error('Adafruit IO MQTT error:', err);
        });
    }

    // Send updated data to fe server
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

}
