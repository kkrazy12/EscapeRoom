// PLANT SCRIPT
// This is a backup for the physical Morse code plant
// When the plant is clicked, it plays Morse code aloud alongside some dialogue.

$(document).ready(function() {
    // Retrieve the plantBackup value from session storage
    // This variable can be controlled from settings
    let plantBackup = sessionStorage.getItem('plantBackup') === 'true' || false;

    console.log('PlantBackup', plantBackup); // Log current state

    // If the physical plant is not being used, this backup will be implemented instead as a failsafe
    if (plantBackup) {

        // Retrieve elements from the document
        let audio1 = document.getElementById('plantAudio1');
        let audio2 = document.getElementById('plantAudio2');

        // Flag to track if any audio is currently playing
        let isAudioPlaying = false;

        // Function for playing audio
        function playAudio(audioElement) {
            // Check if audio is playing
            if (!isAudioPlaying) {
                audioElement.play();
                // Set the flag to true if audio is playing
                isAudioPlaying = true;

                // When the audio finishes playing
                audioElement.onended = function() {
                    // Reset the flag
                    isAudioPlaying = false;
                };
            }
        }

        // Function for when the plant is clicked
        $('#plantAnim').click(function() {
            // Decide which audio to play
            if (!audio1.ended) {
                playAudio(audio1);
            } else {
                playAudio(audio2);
            }
        });
    }
});
