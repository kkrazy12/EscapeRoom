// PHONE CALL FUNCTION
// Used to trigger phone calls and can be used externally, using a specific IP address (Isaac's phone hotspot)
// NOTE: The external phone call may be removed for the final project

// Jquery, execute the following when the document is ready
$(document).ready(function() {
    madHatterPhone();
    resetPhoneAnim();
});

// Create a new WebSocket connection to the specified URL
const ws = new WebSocket('ws://172.20.10.2:3000/admin');
var aiAudioUrl = ''; // Global variable to store AI-generated audio URL
let phoneRingingAudio = new Audio('audio/phoneRinging.mp3'); // Load ringing sound

// WebSocket event handler when the connection opens
ws.onopen = function() {
    console.log('Connected to WebSocket server as admin.');
};

// WebSocket even handler for errors
ws.onerror = function(error) {
    console.error('WebSocket Error:', error);
};

// Function to generate AI voice based on the character and text
async function aiVoice(character, textToSpeak) {
    console.log(`Generating AI voice for ${character}`);
    try {
        const response = await fetch('/speak', { // Send a POST request to the server
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ // Send character and text as JSON
                character: character,
                textInput: textToSpeak
            }),
        });

        if (!response.ok) {
            throw new Error(`AI voice generation failed for ${character}`);
        }

        const blob = await response.blob(); // Get the response
        const uniqueAudioURL = URL.createObjectURL(blob); // Create a URL for the Blob
        console.log(`${character}'s AI voice generated successfully at ${uniqueAudioURL}`);
        return uniqueAudioURL; // Return the URL
    } catch (error) {
        console.error(`Error in generating voice for ${character}:`, error); // Log errors
    }
}

// Object mapping characters to their phone numbers
const characterPhoneNumbers = {
    Alice: '012-123-8312',
    WhiteRabbit: '012-123-7214',
    MadHatter: '012-125-3212',
    QueenOfHearts: '012-111-7212',
    Caterpillar: '012-166-0212',
    CheshireCat: '012-123-9212',
    DoorKnob: '012-123-4512',
    SingingFlowers: '012-123-1112',
    TweedledeeAndTweedledum: '012-123-9989',
    Rose: '012-123-2231',
    KingOfHearts: '012-111-2111',
    MarchHare: '101-212-5321'
};

// Function to handle data received from WebSocket
function socketResponse(messageData) {
    if (messageData.text && messageData.character) {
        aiVoice(messageData.character, messageData.text).then(audioUrl => {
            if (audioUrl) {
                aiAudioUrl = audioUrl; // Update global AI audio URL
                updateModal(messageData.character); // Update modal with character info
                $('#phoneCallModal').modal('show'); // Show modal
                restartPhoneAnimation(); // Restart phone animation
                phoneRingingAudio.play(); // Play the phone ringing audio
                playPhoneAnim(); // Play phone animation
            }
        });
    }
}

// Function to play AI audio
function playAiAudio() {
    if (aiAudioUrl) {
        // Create a new audio element
        let aiAudio = new Audio(aiAudioUrl);
        // Log if this works
        aiAudio.play().then(() => {
            console.log("AI voice playback started.");
        }).catch(error => {
            console.error("Error during AI voice playback:", error);
        });
    }
}

// Function to restart the phone animation
function restartPhoneAnimation() {
    const phoneAnim = document.getElementById('phoneAnim');
    phoneAnim.stop();
    phoneAnim.play();
    phoneAnim.stop(); // Pauses indefinitely from frame 1
}

// Function to update the modal with character information
function updateModal(character) {
    // Find the key in the characterPhoneNumbers object that matches the character argument
    const characterKey = Object.keys(characterPhoneNumbers).find(key => 
        key.toLowerCase() === character.toLowerCase().replace(/\s+/g, '')
    );

    // Fetch the phone number for the character
    const phoneNumber = characterPhoneNumbers[characterKey] || 'Unknown number';
    // Update the modal text
    const modalBodyText = document.querySelector('#phoneCallModal .modal-body p');
    modalBodyText.textContent = `You have a phone call from ${character} (${phoneNumber})`;

    // Update the modal image
    const modalImage = document.getElementById('characterImage');
    modalImage.src = `./img/${characterKey}ProfilePicture.png`;
    modalImage.alt = `${character}'s profile picture`;
}

// WebSocket event handler for incoming messages
ws.onmessage = function(event) {
    if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = function() {
            const result = reader.result;

            if (result === 'playSound') {
                phoneRingingAudio.play();
            } else {
                try {
                    const messageData = JSON.parse(result);
                    socketResponse(messageData);
                } catch (e) {
                    console.error("Error parsing message data from Blob:", e);
                }
            }
        };
        reader.readAsText(event.data);
    } else if (typeof event.data === 'string') {
        if (event.data === 'playSound') {
            phoneRingingAudio.play();
        }
    }
};

$(document).ready(function() {
    $('#modalAnswerButton').click(function() {
        if (aiAudioUrl) {
            let aiAudio = new Audio(aiAudioUrl);
            aiAudio.play().then(() => {
                console.log("AI voice playback started.");
                // Hide the Answer and Decline buttons
                $('#modalAnswerButton, #modalDeclineButton').hide();
                // Change the modal text
                const modalBodyText = document.querySelector('#phoneCallModal .modal-body p');
                modalBodyText.textContent = "Call connected...";
    
                // Close the modal automatically after the audio finishes
                aiAudio.onended = function() {
                    $('#phoneCallModal').modal('hide');
                    resetPhoneAnim();
                    phoneRingingAudio.pause();
                    phoneRingingAudio.currentTime = 0;
                };
            }).catch(error => {
                console.error("Error during AI voice playback:", error);
            });
        } else {
            console.error("No AI audio URL available.");
        }
    });        

    $('#modalDeclineButton').click(function() {
        $('#phoneCallModal').modal('hide');
        aiAudioUrl = '';
        restartPhoneAnimation();
        phoneRingingAudio.pause();
        phoneRingingAudio.currentTime = 0;
        resetPhoneAnim();
    });
});

// Function for the Mad Hatter's phone call
function madHatterPhone() {
    // Only play if the Mad Hatter's flag is false
    if (!sessionStorage.getItem('madHatterCalled')) {
        // Ensure buttons are visible
        $('#modalAnswerButton, #modalDeclineButton').show();

        const character = 'Mad Hatter';
        aiAudioUrl = './audio/directoryAudio/madHatter.mp3';
        updateModal(character);
        $('#phoneCallModal').modal('show');

        // Set a flag in session storage
        sessionStorage.setItem('madHatterCalled', 'true');
    }
}

function playPhoneAnim() {
    // Play phone animation
    phoneAnim.play();
}

function resetPhoneAnim() {
    // Stop and restart the phone animation
    phoneAnim.stop();
    phoneAnim.play();
    // Pauses indefinitely from frame 1
    phoneAnim.stop();
    // Ensure buttons are visible
    $('#modalAnswerButton, #modalDeclineButton').show();
}