// video.js

// This controls the functionality of the video
// Includes loading, playing and restarting the video
// Also plays AI voices at specified times of the video

window.queenVoicePlayed = false;
window.aliceVoicePlayed = false;

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
        video.onended = onVideoEnd;
        video.ontimeupdate = () => onVideoTime();
    }

    // Function to play video
    function playVideo(source) {
        if (source) {
            video.src = source;
            video.load();
        }
        video.play();
        uiControl.hideStartUI();

        // Retrieve player count from localStorage
        const playerCount = localStorage.getItem('playerCount') || 0;
        // Get player names
        const playerNames = playerInputControl.getPlayerNames(playerCount);

        // Generate Queen and Alice's voices
        let queenDialogue = aiDialogue.queen(playerNames);
        let aliceDialogue = aiDialogue.alice(playerNames);

        aiDialogue.preloadVoice('Queen of Hearts', queenDialogue, './audio/queenBackup.mp3').catch(error => {
            console.error('Error preloading Queen of Hearts voice:', error);
        });
        aiDialogue.preloadVoice('Alice', aliceDialogue, './audio/aliceBackup.mp3').catch(error => {
            console.error('Error preloading Alice voice:', error);
        });
    }

    function onVideoTime() {
        if (video.currentTime >= QUEEN_SCENE_TIME && !window.queenVoicePlayed && window['Queen of HeartsAudioURL']) {
            new Audio(window['Queen of HeartsAudioURL']).play();
            window.queenVoicePlayed = true;

            // Set a timer to play Alice's voice 15 seconds after Queen's voice
            aliceVoiceTimer = setTimeout(() => {
                if (!window.aliceVoicePlayed && window['AliceAudioURL']) {
                    new Audio(window['AliceAudioURL']).play();
                    window.aliceVoicePlayed = true;
                }
            }, 15000);
        }
    }

    // Display new UI at the end of the video and reset voice flags
    function onVideoEnd() {
        // Change the video source to the second video file
        video.src = 'videos/cutscene02.mp4';

        // Add the fade-in effect
        video.classList.add('fade-in');
        video.load();

        // Remove the fade-in effect once the video starts playing
        video.onplay = () => {
            video.classList.remove('fade-in');
        };

        // Load and play the new video
        video.load();
        video.play();
        // Pause the video initially
        video.pause();

        // Show black overlay
        uiControl.showBlackOverlay();

        // Show Decision UI
        uiControl.showDecisionUI();

        // Reset voice flags
        resetVoiceFlags();
    }

    // Reset voice flags to allow for replaying voices
    function resetVoiceFlags() {
        window.queenVoicePlayed = false;
        window.aliceVoicePlayed = false;
    }

    return {
        load: loadVideo,
        play: playVideo
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

    // Start a countdown from 0 to 5
    function startCountdown() {
        setTimeout(() => {
            // Start countdown from 5
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

                    // Redirect to timer page or next step
                    window.location.href = 'timer.html';
                }

                countdown -= 1; // Decrease countdown
            }, 1000);
        }, 3000); // Delays for 3 seconds before beginning
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
        hideBlackOverlay: hideBlackOverlay
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
        // Play the 'yes' response audio
        playAudio('audio/videoAudio/aliceYes20.mp3');

        // Hide the decision UI and black overlay
        uiControl.hideDecisionUI();
        uiControl.hideBlackOverlay();

        // Play the new video
        document.getElementById('cutsceneVideo').play();

        // Start the countdown
        uiControl.startCountdown();
    }

    // Function for clicking no
    function noButton() {
        // Play the video first
        document.getElementById('cutsceneVideo').play();
        uiControl.hideBlackOverlay();

        const noAudio = new Audio('audio/videoAudio/aliceNo.mp3');
        noAudio.play();
        document.getElementById('noButton').style.display = 'none';

        uiControl.hideDecisionUI();

        // Pause video when audio ends
        noAudio.onended = () => {
            document.getElementById('cutsceneVideo').pause();
            uiControl.showBlackOverlay();
            uiControl.showDecisionUI();
        };
    }

    // Function to replay video 
    function replayButton() {
        // Play the original video when 'replay' is clicked
        videoControl.play('videos/cutscene01.mp4');
        uiControl.hideDecisionUI();
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
        let dialogue = "And now she's trapped us all in Wonderland. But here's the problem. The jewels are not here, they are lost in your world. Please can you find them for me? I wish you the best of luck";
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
});