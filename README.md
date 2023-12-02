# EscapeRoom
**CyberWonderland** is an *Alice in Wonderland* themed escape room developed for the DAT552 Realtime module.

## Prerequisites
Before running the server, make sure the following are installed:
- Node.js (Download from [Node.js website](https://nodejs.org/))
- Arduino IDE (Download from [Arduino website](https://www.arduino.cc/en/software))

## Installation 
To setup the project, follow these steps. 
1. Clone the repository:
   ```bash
   git clone https://github.com/kkrazy12/EscapeRoom
   ```
2. Install the required Node.js dependencies:
   ```bash
   npm install
   ```

## Set up Arduino
In 'App.js', please set the correct serial port for the Arduino, this should the same serial port on the Arduino IDE.
```javascript
const port = new SerialPort({
    path: 'COM7', // IMPORTANT: Change to correct serial port
    baudRate: 9600,
});
```
Replace `'COM7'` with the port your Arduino is connected to.

```javascript
const port = new SerialPort({
    path: 'COM7', // IMPORTANT: Change to correct serial port
    baudRate: 9600,
});
```

## Send messages to Arduino

To communicate with the Arduino, I have a created a function, accessible from the front-end, called `serialPrint()`. This operates the same as [Serial.print()](https://www.arduino.cc/reference/en/language/functions/communication/serial/print/) from Ardiuno. 

For example, to trigger the phone: 
```javascript
serialPrint('ring 3');
```

## Running the server
To run the server, use one of the following commands:
- For production:
  ```bash
  npm start
  ```
- For development (with auto-restart on changes):
  ```bash
  npm run dev
  ```

The server will start on `http://localhost:3000`.
