// AI VOICE SCRIPT (ElevenLabs API)
// This function is used to generate AI voices, based on user input.

document.addEventListener('DOMContentLoaded', (event) => {
    // Get HTML elements
    const video = document.getElementById('cutsceneVideo');
    const startButton = document.getElementById('startButton');
    const playerNameInputs = document.querySelectorAll('.playerName');

    // Define the time for the AI voice to play
    const QUEEN_SCENE_TIME = 54;
    const ALICE_SCENE_TIME = 70;

    // Define the player names object
    let playerNames = {};

    // Define the audio elements for the queen and Alice voice lines
    let queenAudio;
    let aliceAudio;

    // Play the video and hide UI elements
    const playVideo = () => {
        // Set object of player names
        playerNames = {
            player1: document.getElementById('playerName1').value,
            player2: document.getElementById('playerName2').value,
            player3: document.getElementById('playerName3').value,
        };

        // Preload the AI voice lines for the queen and Alice
        const queenText = `Somebody stole my jewels! Who was it? I bet it was that wretched Alice girl... or maybe it was you, ${playerNames.player1}, or you, ${playerNames.player2}? Whoever it was. Return them at once, or else!`;
        const aliceText = `And now she's trapped us all in Wonderland. But here's the problem. The jewels are not here, they are lost in your world. Please can you find them for me? I wish you the best of luck ${playerNames.player1}, ${playerNames.player2}, and ${playerNames.player3}.`;

        // Load the queen's voice
        aiVoice("Queen of Hearts", queenText)
            .then(audio => {
                queenAudio = audio;
            })
            .catch(error => {
                console.error('Error preloading queen voice:', error);
            });

        // Load Alice's voice
        aiVoice("Alice", aliceText)
            .then(audio => {
                aliceAudio = audio;
            })
            .catch(error => {
                console.error('Error preloading Alice voice:', error);
            });

        // Start the video and hide the UI elements
        video.play();
        startButton.style.display = 'none';
        playerNameInputs.forEach(input => input.style.display = 'none');
    };
    startButton.addEventListener('click', playVideo);

    // Add flag variables to track if the voice has been played
    let queenVoicePlayed = false;
    let aliceVoicePlayed = false;

    // Play AI voice at specific time in video
    video.ontimeupdate = () => {
        if (video.currentTime >= QUEEN_SCENE_TIME && !queenVoicePlayed) {
            queenAudio.play();
            queenVoicePlayed = true; // Set the flag to true
        }
        if (video.currentTime >= ALICE_SCENE_TIME && !aliceVoicePlayed) {
            aliceAudio.play();
            aliceVoicePlayed = true; // Set the flag to true
        }
    };
});

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

    // Sends a request to create audio to the endpoint
    const response = await fetch('/speak', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            voiceId: voiceId,
            textInput: textToSpeak
        }), // Send as JSON
    });

    if (!response.ok) {
        throw new Error('AI voice request failed');
    }

    const blob = await response.blob(); // Convert response into audio
    const audio = new Audio(URL.createObjectURL(blob));
    return audio;
}