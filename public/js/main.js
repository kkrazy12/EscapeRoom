// Create a WebSocket connection to the server that hosts the website
const ws = new WebSocket('ws://' + window.location.host);

// Log when the WebSocket connection is opened
ws.onopen = function(event) {
    console.log('WebSocket connection opened.');
};

// Log any errors with the WebSocket
ws.onerror = function(error) {
    console.error('WebSocket Error:', error);
};

// Function to handle messages from Arduino
ws.onmessage = function(event) {
    console.log('Arduino:', event.data);
};

// Function to send a message to the Arduino
// This operates the same way as the Arduino's serialPrint()
function serialPrint(message) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
        console.log('Sending message to Arduino:', message);
    } else {
        console.log('WebSocket is not open. Message to Arduino was not sent.');
    }
}

// Event listener for the 'Start Game' button
const startGame = document.getElementById('startGame');
startGame.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the default link behaviour

    // this should ring the phone 3 times but needs testing!
    serialPrint('ring 3');
});