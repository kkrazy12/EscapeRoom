// ARDUINO COMMUNICATION SCRIPT
// This is used for sending and receiving data to the Arduino's serial

// Websocket connection to the server
const ws = new WebSocket('ws://' + window.location.host);
ws.onopen = function(event) { // Log when the WebSocket connection is opened
    console.log('WebSocket connection opened.');
};
ws.onerror = function(error) { // Log any errors with the WebSocket
    console.error('WebSocket Error:', error);
};

// Function to receive messages from Arduino
ws.onmessage = function(event) {
    // Logs any Arduino serial messages to the console
    console.log('Arduino:', event.data);
};

// Function to send a message to the Arduino
// This operates the same way as the Arduino's Serial.print()
function serialPrint(message) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
        console.log('Sending message to Arduino:', message);
    } else {
        console.log('WebSocket is not open. Message to Arduino was not sent.');
    }
}

/* TO USE THIS

EXAMPLE
    To ring the phone:
    serialPrint("ring 3");

    To trigger the LEDs on the plant:
    serialPrint("turn on LEDs");

EXAMPLE ON BUTTON CLICK
    const startGame = document.getElementById('startGame');
        startGame.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the default link behaviour
        serialPrint('ring 3'); 
    });


*/