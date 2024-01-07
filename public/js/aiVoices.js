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