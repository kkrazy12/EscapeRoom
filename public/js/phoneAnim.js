function answerPhone() {
    // Get the Lottie phone player
    const phoneAnim = document.getElementById('phoneAnim');
    
    // Stop and restart the phone animation
    phoneAnim.stop();
    phoneAnim.play();
    phoneAnim.stop(); // Pauses indefinitely from frame 1

    // Create an audio object and set its source
    let madHatterAudio = new Audio('./audio/directoryAudio/madHatter.mp3');

    // Play the audio
    madHatterAudio.play();

    // Hide the button that was clicked
    this.style.display = 'none';

    // Stop the phone ringing sound
    phoneRingingAudio.pause();
    phoneRingingAudio.currentTime = 0; // Reset the audio to the start
}

// Create an audio object for the phone ringing
let phoneRingingAudio = new Audio('./audio/phoneRinging.mp3');

// Play the phone ringing audio when the page loads
window.onload = function() {
    phoneRingingAudio.play();
};

// Add event listener to the button
document.getElementById('answerButton').addEventListener('click', answerPhone);