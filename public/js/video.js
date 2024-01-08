// video.js

// This controls the functionality of the video
// Includes loading, playing and restarting the video
// Also plays AI voices at specified times of the video

window.queenVoicePlayed = false;
window.aliceVoicePlayed = false;
window.videoFirstPause = false;
window.audioPlaying = false;

const QUEEN_SCENE_TIME = 54;

// Function to play audio
function playAudio(src) {
    const audio = new Audio(src);
    audio.play();
}

// MODULE FOR VIDEO CONTROLS
const videoControl = (function() {
    const video = document.getElementById('cutsceneVideo');
    let aliceVoiceTimer;

    // Function for loading video
    function loadVideo() {
        const startButton = document.getElementById('startButton');
        startButton.addEventListener('click', () => playVideo());
        video.ontimeupdate = () => onVideoTime();
    }

    function playVideo(source) {
        if (source) {
            video.src = source;
            video.load();
        }

        uiControl.hideStartUI();

        window.queenVoicePlayed = false;
        window.aliceVoicePlayed = false;
        window.audioPlaying = false;

        // Retrieve player count and names
        const playerCount = localStorage.getItem('playerCount') || 0;
        const playerNames = playerInputControl.getPlayerNames(playerCount);

        // Generate Queen and Alice's dialogues
        let queenDialogue = aiDialogue.queen(playerNames);
        let aliceDialogue = aiDialogue.alice(playerNames);

        uiControl.createLoadingOverlay();

        // Preload voices asynchronously
        Promise.all([
                aiDialogue.preloadVoice('Queen of Hearts', queenDialogue, './audio/queenBackup.mp3'),
                aiDialogue.preloadVoice('Alice', aliceDialogue, './audio/aliceBackup.mp3')
            ])
            .then(() => {
                video.play();
                uiControl.hideLoadingOverlay();
            })
            .catch(error => {
                console.error('Error preloading voices:', error);
            });
    }

    function playQueenVoice() {
        console.log("Attempting to play Queen's voice");
        if (!window.audioPlaying) {
            console.log("Playing Queen's voice");
            window.audioPlaying = true; // Set flag before playing
            let queenAudio = window['Queen of HeartsAudioURL'] ? new Audio(window['Queen of HeartsAudioURL']) : new Audio('./audio/queenBackup.mp3');

            queenAudio.play();
            queenAudio.onended = () => {
                console.log("Queen's voice ended");
                window.audioPlaying = false; // Reset flag after playing
                playAliceVoice();
            };
        } else {
            console.log("Audio already playing, cannot play Queen's voice now");
        }
    }

    // Function to play Alice's voice
    function playAliceVoice() {
        // Check if no other audio is currently playing and Alice's voice has not been played yet
        if (!window.audioPlaying && !window.aliceVoicePlayed) {
            console.log("Preparing to play Alice's voice");

            // Set flags to indicate that an audio is about to play and that Alice's voice is being played
            window.audioPlaying = true;
            window.aliceVoicePlayed = true;

            // Set a delay before playing Alice's voice
            let aliceAudioTimer = setTimeout(() => {
                console.log("Playing Alice's voice");

                // Choose the Alice audio source: either the generated voice or a backup file
                let aliceAudio = window['AliceAudioURL'] ? new Audio(window['AliceAudioURL']) : new Audio('./audio/aliceBackup.mp3');

                // Play the Alice audio
                aliceAudio.play();

                // When the Alice audio ends, initiate a timer to pause the video
                aliceAudio.onended = () => {
                    console.log("Alice's voice playback ended");
                    window.audioPlaying = false;

                    // Pause the video 5 seconds after Alice's audio ends
                    setTimeout(() => {
                        if (!video.paused && !window.videoFirstPause) {
                            const video = document.getElementById('cutsceneVideo');
                            video.pause();
                            uiControl.showBlackOverlay();
                            uiControl.showDecisionUI();
                            window.videoFirstPause = true;
                        }
                    }, 5000); // 5-second delay
                };
            }, 4000); // 4-second delay to ensure separation from previous audio

            // Log the setup of the timer for Alice's voice
            console.log("Timer set for Alice's voice with a 4-second delay");
        } else {
            // Log if Alice's voice cannot be played due to either an audio already playing or it has already been played
            console.log("Cannot play Alice's voice: Either an audio is already playing or Alice's voice has already been played");
        }
    }



    function onVideoTime() {
        console.log("Video currentTime:", video.currentTime);
        if (video.currentTime >= QUEEN_SCENE_TIME && !window.queenVoicePlayed) {
            console.log("Triggering Queen's voice");
            window.queenVoicePlayed = true;
            playQueenVoice();
        }
    }

    // Reset voice flags to allow for replaying voices
    function resetVoiceFlags() {
        window.queenVoicePlayed = false;
        window.aliceVoicePlayed = false;
    }

    return {
        load: loadVideo,
        play: playVideo,
        onVideoTime: onVideoTime,
    };
})();

// MODULE FOR UI CONTROLS
const uiControl = (function() {
    // Utility function for creating DOM elements
    function createElement(tag, className, properties = {}) {
        const element = document.createElement(tag);
        element.className = className;
        Object.assign(element, properties);
        return element;
    }

    // Create and display an overlay UI element
    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = "url('img/background2.png') no-repeat center center fixed";
        overlay.style.backgroundSize = 'cover';
        overlay.style.zIndex = '1';
        overlay.style.display = 'block';
        document.body.appendChild(overlay);
    }

    // Function to create black overlay
    function createBlackOverlay() {
        const blackOverlay = document.createElement('div');
        blackOverlay.id = 'blackOverlay';
        blackOverlay.style.position = 'fixed';
        blackOverlay.style.top = '0';
        blackOverlay.style.left = '0';
        blackOverlay.style.width = '100%';
        blackOverlay.style.height = '100%';
        blackOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        blackOverlay.style.zIndex = '2';
        blackOverlay.style.opacity = '0';
        blackOverlay.style.transition = 'opacity 1s ease';
        document.body.appendChild(blackOverlay);
    }

    function createLoadingOverlay() {
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loadingOverlay';
        loadingOverlay.style.position = 'fixed';
        loadingOverlay.style.top = '0';
        loadingOverlay.style.left = '0';
        loadingOverlay.style.width = '100%';
        loadingOverlay.style.height = '100%';
        loadingOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        loadingOverlay.style.zIndex = '10';
        loadingOverlay.style.display = 'flex';
        loadingOverlay.style.flexDirection = 'column';
        loadingOverlay.style.justifyContent = 'center';
        loadingOverlay.style.alignItems = 'center';
        loadingOverlay.style.fontFamily = 'Alagard';

        const loadingText = document.createElement('div');
        loadingText.innerText = 'TECHSCAPE PRODUCTIONS';
        loadingText.style.color = '#00CC99';
        loadingText.style.fontSize = '3em'; // 
        loadingOverlay.appendChild(loadingText);

        const infoText = document.createElement('p');
        infoText.style.color = 'white';
        infoText.style.fontSize = '2em';
        infoText.innerText = 'Presents';
        loadingOverlay.appendChild(infoText);

        document.body.appendChild(loadingOverlay);
    }

    // Function to hide the loading overlay
    function hideLoadingOverlay() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }

    // Function to show the black overlay
    function showBlackOverlay() {
        const blackOverlay = document.getElementById('blackOverlay');
        blackOverlay.style.display = 'block';
        setTimeout(() => blackOverlay.style.opacity = '1', 10);
    }

    // Function to hide the black overlay
    function hideBlackOverlay() {
        const blackOverlay = document.getElementById('blackOverlay');
        blackOverlay.style.opacity = '0';
        setTimeout(() => blackOverlay.style.display = 'none', 1000);
    }

    // Hide the start Ui elements
    function hideStartUI() {
        toggleUIElements(['#startButton', '.playerName', '#enterNameHeading', '.divider', '.overlay'], 'none');
    }

    // Show the decision UI elements
    function showDecisionUI() {
        document.getElementById('decisionUI').style.display = 'flex';
    }

    // Hide decision UI elements
    function hideDecisionUI() {
        document.getElementById('decisionUI').style.display = 'none';
    }

    // Toggle display style of selected UI elements
    function toggleUIElements(selectors, displayStyle) {
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.style.display = displayStyle;
            });
        });
    }

    // Start countdown from 5
    function startCountdown() {
        // Delay for 3 seconds before starting the countdown
        setTimeout(() => {
            let countdown = 5;
            const countdownTimerElement = document.getElementById('countdownTimer');
            countdownTimerElement.style.display = 'block';

            const countdownInterval = setInterval(() => {
                // Update countdown timer display
                countdownTimerElement.textContent = countdown;

                if (countdown <= 0) {
                    // Stop countdown at 0
                    clearInterval(countdownInterval);
                    countdownTimerElement.style.display = 'none'; // Hide countdown timer

                    // Redirect to main page
                    window.location.href = 'mainPage.html';
                }

                countdown -= 1; // Decrease countdown
            }, 1000);
        }, 3000); // 3-second delay before countdown starts
    }



    return {
        createElement: createElement,
        createOverlay: createOverlay,
        hideStartUI: hideStartUI,
        showDecisionUI: showDecisionUI,
        hideDecisionUI: hideDecisionUI,
        startCountdown: startCountdown,
        createBlackOverlay: createBlackOverlay,
        showBlackOverlay: showBlackOverlay,
        hideBlackOverlay: hideBlackOverlay,
        createLoadingOverlay: createLoadingOverlay,
        hideLoadingOverlay: hideLoadingOverlay
    };
})();

// MODULE FOR PLAYER INPUT
const playerInputControl = (function() {

    // Function to display input fields for player names
    function displayPlayerInputs() {
        // Retrieve the number of players from localStorage
        const playerCount = localStorage.getItem('playerCount') || 3;
        // Get the parent container of the start button
        const container = document.getElementById('startButton').parentNode;

        // Loop to create input fields for each player
        for (let i = 1; i <= playerCount; i++) {
            // Create an input field for each player
            const input = uiControl.createElement('input', 'playerName', {
                type: 'text',
                id: `playerName${i}`,
                placeholder: `Player ${i}`
            });
            // Insert the input field before the start button
            container.insertBefore(input, document.getElementById('startButton'));
        }
    }

    // Function to retrieve player names from the input fields
    function getPlayerNames(playerCount) {
        let playerNames = {};
        // Loop through each player input field
        for (let i = 1; i <= playerCount; i++) {
            // Store the value of each player's input field
            playerNames[`player${i}`] = document.getElementById(`playerName${i}`).value;
        }
        return playerNames;
    }

    return {
        displayPlayerInputs: displayPlayerInputs,
        getPlayerNames: getPlayerNames
    };
})();

// MODULE FOR EVENT BINDING
const eventBinding = (function() {
    // Function to attach event listeners to buttons
    function addButtonListeners() {
        // Attach click events to 'yes', 'no', and 'replay' buttons
        document.getElementById('yesButton').addEventListener('click', yesButton);
        document.getElementById('noButton').addEventListener('click', noButton);
        document.getElementById('replayButton').addEventListener('click', replayButton);
    }

    function yesButton() {
        const yesAudio = new Audio('audio/videoAudio/aliceYes20.mp3');
        uiControl.hideDecisionUI();
        uiControl.hideBlackOverlay();

        // Resume video playback
        document.getElementById('cutsceneVideo').play();

        // Start countdown
        uiControl.startCountdown();
        yesAudio.play();
    }

    function noButton() {
        const noAudio = new Audio('audio/videoAudio/aliceNo.mp3');
        uiControl.hideDecisionUI();
        uiControl.hideBlackOverlay();

        // Resume video playback
        document.getElementById('cutsceneVideo').play();

        // Hide the No button
        document.getElementById('noButton').style.display = 'none';

        noAudio.play();
        noAudio.onended = () => {
            // Show the black overlay and decision UI again
            uiControl.showBlackOverlay();
            uiControl.showDecisionUI();
            // Pause the video
            document.getElementById('cutsceneVideo').pause();
        };
    }



    // Function to replay video
    function replayButton() {
        // Reset the video to the beginning
        const video = document.getElementById('cutsceneVideo');
        video.currentTime = 0;

        // Hide decision UI and reset any necessary flags or states
        uiControl.hideDecisionUI();
        uiControl.hideBlackOverlay();

        // Reset flags
        window.queenVoicePlayed = false;
        window.aliceVoicePlayed = false;
        window.audioPlaying = false;
        window.videoFirstPause = false; // Add this line to reset the flag

        // Play the video
        video.play();
    }



    return {
        init: addButtonListeners
    };
})();

// MODULE FOR AI VOICES
const aiDialogue = (function() {
    // Function to generate dialogue for the Queen character
    function queen(playerNames) {
        // Base dialogue for the Queen character
        let dialogue = "Somebody stole my jewels! Who was it? I bet it was that wretched Alice girl...";
        // Add dialogue addressing the first player
        if (playerNames.player1) {
            dialogue += ` or maybe it was you, ${playerNames.player1}`;
        }
        // Add dialogue addressing the second player
        if (playerNames.player2) {
            dialogue += `, or you, ${playerNames.player2}`;
        }
        dialogue += "? Whoever it was. Return them at once, or else!";
        return dialogue;
    }

    // Function to generate dialogue for the Alice character
    function alice(playerNames) {
        // Extract and filter player names to a list
        let playerNamesList = Object.values(playerNames).filter(name => name);
        // Base dialogue for the Alice character
        let dialogue = "And now she's trapped us all in Wonderland. But here's the problem. The jewels are not here, they are lost in your world. Please can you find them for me? I would really appreciate it,";
        // Add dialogue addressing multiple players
        if (playerNamesList.length > 1) {
            const lastPlayerName = playerNamesList.pop();
            dialogue += ` ${playerNamesList.join(", ")}, and ${lastPlayerName}`;
        } else if (playerNamesList.length === 1) {
            dialogue += ` ${playerNamesList[0]}`;
        }
        dialogue += ".";
        return dialogue;
    }

    // Function to preload AI character voices
    function preloadVoice(character, dialogue, backupAudioPath) {
        return new Promise((resolve, reject) => {
            // Attempt to generate voice audio for the character
            aiVoice(character, dialogue).then(audioURL => {
                // Store the generated audio URL in a global variable
                window[character + 'AudioURL'] = audioURL;
                resolve();
            }).catch(error => {
                // Log an error and use backup audio if AI voice generation fails
                console.error(`Error preloading ${character} voice:`, error);
                window[character + 'AudioURL'] = backupAudioPath;
                resolve();
            });
        });
    }

    return {
        queen: queen,
        alice: alice,
        preloadVoice: preloadVoice
    };
})();

// Initialize everything when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create overlay
    uiControl.createOverlay();
    uiControl.createBlackOverlay();
    // Initalise event buttons
    eventBinding.init();
    // Load video
    videoControl.load();
    // Display player inputs
    playerInputControl.displayPlayerInputs();
    // Reset flags
    window.queenVoicePlayed = false;
    window.aliceVoicePlayed = false;
    window.audioPlaying = false;
});