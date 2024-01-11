// Configure environment variables
require('dotenv').config();

// Import JSON for AI voices
const voiceList = require('./voices.json');

// Import modules
const express = require('express');
const ElevenLabs = require('elevenlabs-node');
const fs = require('fs');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

// Initialize Express app
console.log("Current working directory:", process.cwd());
const app = express();
app.use(express.json()); // For parsing JSON in POST requests

// Create a HTTP server using the Express app
const server = http.createServer(app);

// Set up a WebSocket server using the HTTP server
const wss = new WebSocket.Server({ server });

// Setup ElevenLabs text-to-speech
const voice = new ElevenLabs({
    apiKey: process.env.ELEVENLABS_API_KEY
});

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

// WebSocket connection handler
wss.on('connection', (ws, req) => {
    console.log('WebSocket client connected');

    ws.on('message', function(message) {
        console.log(`Received message: ${message}`);
        const isAdmin = req.url.includes('/admin'); // Check if the connection is from the admin

        if (isAdmin) {
            // If the message is from the admin, broadcast it to all other clients
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        } else {
            serialPrint(message); // Forward the message to the Arduino
        }
    });

    if (!req.url.includes('/admin')) {
        // When data is received from the serial port, send it to the WebSocket client
        parser.on('data', (data) => {
            console.log('Arduino:', data); // Log the received data
            ws.send(data);
        });
    }
});

// Define the port for the server to listen on
const PORT = 3000;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});