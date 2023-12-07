// AI VOICE SCRIPT (ElevenLabs API)
// This function is used to generate AI voices, based on user input.

async function aiVoice(character, textToSpeak) {

    // Array of AI voices available
    const voiceList = {
        "Alice": "MXTsuomR2xwiCMNQfqbI",
        "Mad Hatter": "iZB49K1wCuvAt8IC3y3Y",
        "White Rabbit": "93WD1zZl7ByACS47Fs6I",
        "Queen of Hearts": "RvTLvBg1CG9nZgWH7ZD6"
    };

    // Get the voice for the chosen character
    const voiceId = voiceList[character]; 

    // Sends a request create audio to the endpoint
    fetch('/speak', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voiceId: voiceId, textInput: textToSpeak }), // Send in JSON
    })
    .then(response => response.blob())
    .then(blob => { // Convert response into audio
        // Create a new audio element
        let audio = new Audio(URL.createObjectURL(blob));
        audio.play(); // Play the audio
    })
    // Log any errors to the console
    .catch(error => console.error('Error with HTTP request to endpoint:', error));
}

document.getElementById('speakButton').addEventListener('click', function() {
    const player1 = document.getElementById('PlayerName1').value;
    const player2 = document.getElementById('PlayerName2').value;
    const player3 = document.getElementById('PlayerName3').value;

    aiVoice("Alice", `Hello, nice to meet you ${player1}, ${player2} and ${player3}... Could you please help me in escaping this awfully peculiar and strange world?`);
});

/* TO USE THIS

EXAMPLE
    aiVoice("Alice", "Hello, it is nice to meet you!")
    aiVoice("Mad Hatter", "Please step forward" + player1)

EXAMPLE WITH VARIABLES
    let player1 = "John";
    let player2 = "Sarah";
    let player3 = "Daniel";

    aiVoice("Alice", `Hello, nice to meet you ${player1}, ${player2}, ${player3}`);
*/