// Function to generate AI Voice
async function aiVoice(character, textToSpeak) {
    console.log(`Generating AI voice for ${character}`);

    // Fetch the voice list from the server
    let voiceList;
    try {
        const response = await fetch('/voiceList');
        if (!response.ok) {
            throw new Error('Failed to fetch voice list');
        }
        voiceList = await response.json();
    } catch (error) {
        console.error('Error fetching voice list:', error);
        return;
    }

    // Get the voice ID for the chosen character
    const voiceId = voiceList.voices[character];
    if (!voiceId) {
        console.error(`Voice ID not found for character: ${character}`);
        return;
    }

    // Sends a request to create audio to the endpoint
    try {
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