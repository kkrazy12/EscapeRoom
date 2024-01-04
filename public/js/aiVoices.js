/* VIDEO SCRIPT
This function is used to dynamically create player input boxes based on the number of players selected
It is also used to generate AI voices, based on user input, using the ElevenLabs API 

TODO:
Add subtitles
Create backup audio files for if the AI generation fails
Change the CSS styling for the player selection input
*/

document.addEventListener('DOMContentLoaded', (event) => {
    console.log("DOMContentLoaded event triggered");
    
    // Create an overlay div and append it to the body
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    // Display the overlay when the page loads
    overlay.style.display = 'block';

    // Retrieve the number of players from localStorage
    const playerCount = localStorage.getItem('playerCount');
    console.log("Number of players retrieved:", playerCount);

    // Find the parent container where the inputs will be added
    const container = document.getElementById('startButton').parentNode;

    // Loop to create input fields for the number of players
    for (let i = 1; i <= playerCount; i++) {
        console.log("Creating input for player", i);
        // Create the input fields
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `playerName${i}`;
        input.className = 'playerName';
        input.placeholder = `Player ${i}`;
        // Insert the input fields before start button
        container.insertBefore(input, document.getElementById('startButton'));
    }

    // Get video elements from the document
    const video = document.getElementById('cutsceneVideo');
    const startButton = document.getElementById('startButton');
    const playerNameInputs = document.querySelectorAll('.playerName');

    // Time markers for when to play the AI voices in the video
    const QUEEN_SCENE_TIME = 54;
    const ALICE_SCENE_TIME = 69;

    // Variables to store audio elements for the queen and Alice voice lines
    let queenAudio;
    let aliceAudio;

    // Function to play the video after submission and hide UI elements
    const playVideo = () => {
        console.log("Play video function triggered");
        // Object to store player names
        let playerNames = {};
        // Populate playerNames with the values from the input fields
        for (let i = 1; i <= playerCount; i++) {
            playerNames[`player${i}`] = document.getElementById(`playerName${i}`).value;
            console.log(`Player ${i} name:`, playerNames[`player${i}`]);
        }

        // Preload the dialogue text based on player names
        const queenText = generateQueenDialogue(playerNames);
        const aliceText = generateAliceDialogue(playerNames);

        // Generate AI voice for the Queen
        aiVoice("Queen of Hearts", queenText)
            .then(audio => { 
                queenAudio = audio; 
                console.log("Queen's AI voice loaded successfully");
            })
            .catch(error => {
                // Log error
                console.error('Error preloading queen voice:', error);
                // Use backup audio if AI voice fails
                queenAudio = new Audio('./audio/queenBackup.mp3');
                console.log("Falling back to queen's backup audio");
            });

        // Generate AI voice for Alice
        aiVoice("Alice", aliceText)
            .then(audio => { 
                aliceAudio = audio; 
                console.log("Alice's AI voice loaded successfully");
            })
            .catch(error => {
                // Log error
                console.error('Error preloading Alice voice:', error);
                // Use backup audio if AI voice fails
                aliceAudio = new Audio('./audio/aliceBackup.mp3');
                console.log("Falling back to Alice's backup audio");
            });
        
        // Play video
        video.play();
        console.log("Video started playing");
        // Hide start button, player inputs, and the heading, and divider
        startButton.style.display = 'none';
        playerNameInputs.forEach(input => input.style.display = 'none');
        document.getElementById('heading').style.display = 'none';
        document.querySelector('.divider').style.display = 'none';
        overlay.style.display = 'none';
    };

    // Event listener for start button
    startButton.addEventListener('click', playVideo);

    // Flags to ensure each AI voice is only played once
    let queenVoicePlayed = false;
    let aliceVoicePlayed = false;

    // Event listener to play AI voices at specific times in the video
    video.ontimeupdate = () => {
        // Play Queen's audio during video
        if (video.currentTime >= QUEEN_SCENE_TIME && !queenVoicePlayed) {
            queenAudio.play();
            queenVoicePlayed = true;
            console.log("Queen's audio played");
        }
        // Play Alice's audio during video
        if (video.currentTime >= ALICE_SCENE_TIME && !aliceVoicePlayed) {
            aliceAudio.play();
            aliceVoicePlayed = true;
            console.log("Alice's audio played");
        }
    };
});

// Function to preload and generate audio for the Queen
function generateQueenDialogue(playerNames) {
    console.log("Generating Queen's dialogue");
    // Base dialogue
    let dialogue = "Somebody stole my jewels! Who was it? I bet it was that wretched Alice girl...";
    // Add player names to dialogue if available
    if (playerNames.player1) {
        dialogue += ` or maybe it was you, ${playerNames.player1}`;
    }
    if (playerNames.player2) {
        dialogue += `, or you, ${playerNames.player2}`;
    }
    dialogue += "? Whoever it was. Return them at once, or else!";
    console.log("Queen's dialogue generated:", dialogue);
    return dialogue;
}

// Function to preload and generate audio for Alice
function generateAliceDialogue(playerNames) {
    console.log("Generating Alice's dialogue");
    // Filter out empty names and create a list
    let playerNamesList = Object.values(playerNames).filter(name => name);
    // Base dialogue
    let dialogue = "And now she's trapped us all in Wonderland. But here's the problem. The jewels are not here, they are lost in your world. Please can you find them for me? I wish you the best of luck";

    // Format dialogue based on the number of player names
    if (playerNamesList.length > 1) {
        // Pop the last name and join others with commas
        const lastPlayerName = playerNamesList.pop();
        dialogue += ` ${playerNamesList.join(", ")}, and ${lastPlayerName}`;
    } else if (playerNamesList.length === 1) {
        // If only one name, add it directly
        dialogue += ` ${playerNamesList[0]}`;
    }

    dialogue += ".";
    console.log("Alice's dialogue generated:", dialogue);
    return dialogue;
}

// Function to generate AI Voice
async function aiVoice(character, textToSpeak) {
    console.log(`Generating AI voice for ${character}`);
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

    // Error handling
    if (!response.ok) {
        console.error('AI voice generation failed for', character);
        throw new Error('AI voice request failed');
    }

    // Convert response into audio
    const blob = await response.blob();
    const audio = new Audio(URL.createObjectURL(blob));
    console.log(`${character}'s AI voice generated successfully`);
    return audio;
}