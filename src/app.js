// Import modules
const express = require('express');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const WebSocket = require('ws');

// Initialize Express app
const app = express();

// Create a HTTP server using the Express app
const server = require('http').createServer(app);

// Set up a WebSocket server using the Express app
const wss = new WebSocket.Server({ server });

// Set up SerialPort to communicate with Arduino
const port = new SerialPort({
    path: 'COM7', // IMPORTANT: Change to correct serial port
    baudRate: 9600,
});

// Monitor for any errors with opening the serial port
port.on('error', function(err) {
    console.log('Error: ', err.message);
});

// Variable to read incoming data from the Arduino
const parser = port.pipe(new ReadlineParser({ 
    delimiter: '\r\n'
}));

// Function to send a message to the Arduino
function serialPrint(message) {
    // Convert the buffer to a string
    let messageString = message.toString();

    port.write(messageString + '\n', function(err) { // Add a newline character
        if (err) {
            return console.log('Error on write: ', err.message);
        }
        console.log('Message sent:', messageString);
    });
}

// Serve files from the public directory
app.use(express.static('public'));

// WebSocket connection
wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', function(message) {
        console.log('Received message from Ardiuno:', message);
        serialPrint(message); // Forward the message to the Arduino
    });

    // When data is received from the serial port, send it to the WebSocket
    parser.on('data', (data) => {
        console.log('Ardiuno:', data); // Log the received data
        ws.send(data); // Send data to the WebSocket client
    });
});

// Define the port for the server to listen on
const PORT = 3000;

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
