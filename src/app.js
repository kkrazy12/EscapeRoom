// Configure environment variables
require('dotenv').config();

// Import JSON for AI voices
const voiceList = require('./voices.json');

// Import modules
const express = require('express');
const { SerialPort } = require('serialport'); 
const { ReadlineParser } = require('@serialport/parser-readline');
const WebSocket = require('ws');
const ElevenLabs = require('elevenlabs-node');
const fs = require('fs');
const path = require('path');

// Initialize Express app
console.log("Current working directory:", process.cwd());
const app = express();
app.use(express.json()); // For parsing JSON in POST requests

// Setup ElevenLabs text-to-speech
const voice = new ElevenLabs({
    apiKey: process.env.ELEVENLABS_API_KEY
});

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

const filePath = path.join(__dirname, '../public/audio/generatedAudio.mp3');

app.get('/voiceList', (req, res) => {
    res.json(voiceList);
});

// Function for text-to-speech generation 
app.post('/speak', function(req, res) {
    const textInput = req.body.textInput;
    const character = req.body.character;

    const voiceSettings = voiceList.voices[character];
    if (!voiceSettings) {
        res.status(400).send('Character not found');
        return;
    }

    voice.textToSpeech({
        voiceId: voiceSettings.voiceId,
        textInput: textInput,
        fileName: filePath,
        stability: voiceSettings.stability,
        similarityBoost: voiceSettings.similarityBoost, 
        style: voiceSettings.style,
        "use_speaker_boost": true,
    }).then(() => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error reading audio file');
                return;
            }
            res.setHeader('Content-Type', 'audio/mpeg');
            res.send(data);
        });
    }).catch(error => {
        console.error(error);
        res.status(500).send('Error generating speech');
    });
});

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