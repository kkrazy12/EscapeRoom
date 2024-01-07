// Function to generate AI Voice
async function aiVoice(character, textToSpeak) {
    console.log(`Generating AI voice for ${character}`);

    // Sends a request to create audio to the endpoint
    try {
        const response = await fetch('/speak', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                character: character,
                textInput: textToSpeak
            }), // Send as JSON
        });

        // Error handling for audio creation
        if (!response.ok) {
            throw new Error(`AI voice generation failed for ${character}`);
        }

        // Convert response into audio
        const blob = await response.blob();

        // Generate a unique URL for each character's audio
        const uniqueAudioURL = URL.createObjectURL(blob);
        console.log(`${character}'s AI voice generated successfully at ${uniqueAudioURL}`);
        return uniqueAudioURL;
    } catch (error) {
        console.error(`Error in generating voice for ${character}:`, error);
    }
}

// Function for generating an AI voice
function generateVoice() {
    const character = document.getElementById('voiceSelect').value;
    const textToSpeak = document.getElementById('textInput').value;
    loadingText(true); // Show loading indicator

    aiVoice(character, textToSpeak).then((uniqueAudioURL) => {
        // Hide loading indicator
        loadingText(false);

        // Check if a uniqueAudioURL is received
        if (uniqueAudioURL) {
            // Get the audio player element
            const audioPlayer = document.getElementById('audioPlayer');
            // Set the source of the audio player to the unique URL
            audioPlayer.src = uniqueAudioURL;
            // Show the audio player
            audioPlayer.style.display = 'block';
            // Play the audio
            audioPlayer.play();
        }
    }).catch((error) => {
        console.error(error);
        // Hide loading indicator in case of error
        loadingText(false);
    });
}

// Function to set loading state
function loadingText(isLoading) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = isLoading ? 'block' : 'none';
}

// Add event listener to the generate button
document.getElementById('generateButton').addEventListener('click', generateVoice);