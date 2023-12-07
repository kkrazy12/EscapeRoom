// MORSE PLANT
// This is the Arduino code for the morse plant
// Needs to be uploaded to the Arduino for it to work
// Still in progress, some parts don't work correctly yet

// Import necessary libraries
#include <CapacitiveSensor.h>
#include "SoftwareSerial.h"
#include "DFRobotDFPlayerMini.h"

// Defining the LED pins
#define BLUE 13
#define GREEN 12
#define YELLOW 11
#define RED 10

// Count for the number of touches
int touchCounter = 0;

// Define the buzzer pin
const int buzzerPin = 9;

// Define the time for the dot, dash, and the pauses
const int dot = 300;
const int dash = dot * 3;
const int pause = dot * 3;
const int longPause = dot * 7;

// Morse code for the numbers 0-9
const char* morseNumbers[] = {
  "-----", // 0
  ".----", // 1
  "..---", // 2
  "...--", // 3
  "....-", // 4
  ".....", // 5
  "-....", // 6
  "--...", // 7
  "---..", // 8
  "----."  // 9
};

// Initialize the capacitive sensor
CapacitiveSensor cs_2_4 = CapacitiveSensor(2,4);

// Define the DFPlayer pins for audio
static const uint8_t PIN_MP3_TX = 7; // Connects to module's RX 
static const uint8_t PIN_MP3_RX = 6; // Connects to module's TX 
SoftwareSerial softwareSerial(PIN_MP3_RX, PIN_MP3_TX);

// Create the DFPlayer object
DFRobotDFPlayerMini player;

// Boolean to keep track of LED sequence state
bool isLEDBusy = false;

void setup() {
  // Start communication with the serial
  Serial.begin(9600);
  // Start communication with DFPlayer Mini
  softwareSerial.begin(9600);
  
  // Attempt to start communication with DFPlayer Mini
  if (player.begin(softwareSerial)) {
    Serial.println("DFPlayer Mini connected successfully");
    player.volume(30); // Set the volume (0 to 30).
  } else {
    // Log any errors to the serial
    Serial.println("Failed to connect to DFPlayer Mini!");
  }

  // Initialize capacitive touch sensor
  cs_2_4.set_CS_AutocaL_Millis(0xFFFFFFFF);
  
  // Setup LED pins as outputs
  pinMode(BLUE, OUTPUT);
  pinMode(GREEN, OUTPUT);
  pinMode(YELLOW, OUTPUT);
  pinMode(RED, OUTPUT);
  pinMode(buzzerPin, OUTPUT);
}

// Function used to blink morse code on the LEDs

void blink(int ledPin, int number) {
  // Retrieve Morse Code string and array
  const char* morseCode = morseNumbers[number];

  // Loop through each character in the Morse code
  for (int i = 0; morseCode[i]; i++) {
    digitalWrite(ledPin, HIGH); // Turn LED on
    
    // Check if the Morse code is a dot or a dash, and delay accordingly
    delay(morseCode[i] == '.' ? dot : dash);
    
    digitalWrite(ledPin, LOW); // Turn LED off
    delay(pause);
  }
}

// Blinks the sequence "1524" in morse code 
void morseLED() {
  // Check if the LED is currently in use or not
  if (!isLEDBusy) {
    isLEDBusy = true;
    blink(RED, 1);
    blink(YELLOW, 5);
    blink(GREEN, 2);
    blink(BLUE, 3);
    isLEDBusy = false; // Reset the LED flag
  }
}

void loop() {
  // Read the value from the capacitive sensor
  long sensorValue = cs_2_4.capacitiveSensor(30);
  Serial.println(sensorValue); // Print to serial

  // IMPORTANT: The sensorValue needs to be adjusted based on the environment
  // It can be affected by electrical interference, tempeature, and humidity.
  // Will need to be tested and calibrated on the day.

  // Check if the sensor value exceeds a threshold
  if (sensorValue > 200) { //
    touchCounter++; // Increment the counter for each touch

    // Play different MP3s based on touch count
    if (touchCounter == 1) {
      player.play(2); // Play the second MP3 file
      
      // Opening LED flashes for the first touch
      for (int i = 0; i < 2; i++) {
        
        // Turn on all LEDs
        digitalWrite(RED, HIGH);
        delay(500);
        digitalWrite(YELLOW, HIGH);
        delay(500);
        digitalWrite(GREEN, HIGH);
        delay(500);
        digitalWrite(BLUE, HIGH);

        // Wait 5 seconds
        delay(5000);

        // Turn off all LEDs
        digitalWrite(RED, LOW);
        delay(500);
        digitalWrite(YELLOW, LOW);
        delay(500);
        digitalWrite(GREEN, LOW);
        delay(500);
        digitalWrite(BLUE, LOW);
      }
    } 
    else if (touchCounter == 2) {
      // On the second touch, play different MP3 file
      player.play(6);
      morseLED();
    }
    else {
      // For all subsequent touches, play the Morse code only
      player.play(6); 
      morseLED();
    }

  }
  
  // Listen to commands sent from the website
  // This may not be used, but if the phone doesn't work, the website can control the plant's LEDs instead
  // To trigger this in JavaScript use serialPrint("message here"), e.g. serialPrint ('turn on LEDs')
  
  if (Serial.available() > 0) {
        // Read the incoming string
        String incomingString = Serial.readStringUntil('\n');
        incomingString.trim(); // Remove any whitespace

        // Play sound if the command is "play sound"
        if (incomingString == "play sound") {
            player.play(3);
        }

        // Turn on LEDs if command is "turn on LEDs"
        if (incomingString == "turn on LEDs") {
          digitalWrite(RED, HIGH);
          delay(100);
          digitalWrite(YELLOW, HIGH);
          delay(100);
          digitalWrite(GREEN, HIGH);
          delay(100);
          digitalWrite(BLUE, HIGH);
          delay(1000);
        }
          
    }


  delay(100); // Delay a bit to avoid reading the sensor too quickly
}
