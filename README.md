# EscapeRoom
**CyberWonderland** is an *Alice in Wonderland* themed escape room developed for the DAT552 Realtime module.

Before running the server, make sure the following are installed:
- Node.js (Download from [Node.js website](https://nodejs.org/))
- Arduino IDE (Download from [Arduino website](https://www.arduino.cc/en/software))

## Installation 
To setup the project, follow these steps, on the terminal.  

1. Clone the repository:
   ```bash
   git clone https://github.com/kkrazy12/EscapeRoom
   ```
2. Install the required Node.js dependencies:
   ```bash
   npm install
   ```

## Set up Arduino
**IMPORTANT:** In 'App.js', please set the correct serial port for the Arduino.

```javascript
const port = new SerialPort({
    path: 'COM7', // IMPORTANT: Change to correct serial port
    baudRate: 9600,
});

```
Replace `'COM7'` with the port your Arduino is connected to.

## Send messages to Arduino

To communicate with the Arduino, use the function in 'Arduino.js' called `serialPrint()`. 

For example, to trigger the phone: 
```javascript
serialPrint('ring 3');
```

To trigger the LEDs on the plant:
```javascript
serialPrint('turn on LEDs');
```

## Running the server
To run the server, use one of the following commands, on the terminal:
- For production:
  ```bash
  npm start
  ```
- For development (with auto-restart on changes):
  ```bash
  npm run dev
  ```
- Alternatively
    ```bash
  node src/app.js
  ```  

The server will start on `http://localhost:3000`. 
To navigate to AI voices, go to 'http://localhost:3000/aiVoices.html'
