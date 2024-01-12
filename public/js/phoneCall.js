$(document).ready(function() {
    madHatterPhone();
    resetPhoneAnim();
});

const ws = new WebSocket('ws://172.20.10.2:3000/admin');
var aiAudioUrl = ''; // Global variable to store AI-generated audio URL
let phoneRingingAudio = new Audio('audio/phoneRinging.mp3');

ws.onopen = function() {
    console.log('Connected to WebSocket server as admin.');
};

ws.onerror = function(error) {
    console.error('WebSocket Error:', error);
};

async function aiVoice(character, textToSpeak) {
    console.log(`Generating AI voice for ${character}`);
    try {
        const response = await fetch('/speak', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                character: character,
                textInput: textToSpeak
            }),
        });

        if (!response.ok) {
            throw new Error(`AI voice generation failed for ${character}`);
        }

        const blob = await response.blob();
        const uniqueAudioURL = URL.createObjectURL(blob);
        console.log(`${character}'s AI voice generated successfully at ${uniqueAudioURL}`);
        return uniqueAudioURL;
    } catch (error) {
        console.error(`Error in generating voice for ${character}:`, error);
    }
}

const characterPhoneNumbers = {
    Alice: '012-123-8312',
    WhiteRabbit: '012-123-7214',
    MadHatter: '012-125-3212',
    QueenOfHearts: '012-111-7212',
    Caterpillar: '012-166-0212',
    CheshireCat: '012-123-9212',
    DoorKnob: '012-123-4512',
    SingingFlowers: '012-123-1112',
    TweedledeeAndTweedledum: '012-123-9989',
    Rose: '012-123-2231',
    KingOfHearts: '012-111-2111',
    MarchHare: '101-212-5321'
};

function handleReceivedData(messageData) {
    if (messageData.text && messageData.character) {
        aiVoice(messageData.character, messageData.text).then(audioUrl => {
            if (audioUrl) {
                aiAudioUrl = audioUrl;
                updateModalMessageAndImage(messageData.character);
                $('#phoneCallModal').modal('show');
                restartPhoneAnimation();
                phoneRingingAudio.play();
                playPhoneAnim();
            }
        });
    }
}

function playAiAudio() {
    if (aiAudioUrl) {
        let aiAudio = new Audio(aiAudioUrl);
        aiAudio.play().then(() => {
            console.log("AI voice playback started.");
        }).catch(error => {
            console.error("Error during AI voice playback:", error);
        });
    }
}

function restartPhoneAnimation() {
    const phoneAnim = document.getElementById('phoneAnim');
    phoneAnim.stop();
    phoneAnim.play();
    phoneAnim.stop(); // Pauses indefinitely from frame 1
}

function updateModalMessageAndImage(character) {
    // Normalize character name to match the keys in characterPhoneNumbers
    const characterKey = Object.keys(characterPhoneNumbers).find(key => 
        key.toLowerCase() === character.toLowerCase().replace(/\s+/g, '')
    );

    const phoneNumber = characterPhoneNumbers[characterKey] || 'Unknown number';
    const modalBodyText = document.querySelector('#phoneCallModal .modal-body p');
    modalBodyText.textContent = `You have a phone call from ${character} (${phoneNumber})`;

    const modalImage = document.getElementById('characterImage');
    modalImage.src = `./img/${characterKey}ProfilePicture.png`;
    modalImage.alt = `${character}'s profile picture`;
}

ws.onmessage = function(event) {
    if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = function() {
            const result = reader.result;

            if (result === 'playSound') {
                phoneRingingAudio.play();
            } else {
                try {
                    const messageData = JSON.parse(result);
                    handleReceivedData(messageData);
                } catch (e) {
                    console.error("Error parsing message data from Blob:", e);
                }
            }
        };
        reader.readAsText(event.data);
    } else if (typeof event.data === 'string') {
        if (event.data === 'playSound') {
            phoneRingingAudio.play();
        }
    }
};

$(document).ready(function() {
    $('#modalAnswerButton').click(function() {
        if (aiAudioUrl) {
            let aiAudio = new Audio(aiAudioUrl);
            aiAudio.play().then(() => {
                console.log("AI voice playback started.");
            }).catch(error => {
                console.error("Error during AI voice playback:", error);
            });
        } else {
            console.error("No AI audio URL available.");
        }
        $('#phoneCallModal').modal('hide');
        phoneRingingAudio.pause();
        phoneRingingAudio.currentTime = 0;
        resetPhoneAnim();
    });      

    $('#modalDeclineButton').click(function() {
        $('#phoneCallModal').modal('hide');
        aiAudioUrl = '';
        restartPhoneAnimation();
        phoneRingingAudio.pause();
        phoneRingingAudio.currentTime = 0;
        resetPhoneAnim();
    });
});

function madHatterPhone() {
    if (!sessionStorage.getItem('madHatterCalled')) {
        const character = 'Mad Hatter';
        aiAudioUrl = './audio/directoryAudio/madHatter.mp3';
        updateModalMessageAndImage(character);
        $('#phoneCallModal').modal('show');

        // Set a flag in session storage
        sessionStorage.setItem('madHatterCalled', 'true');
    }
}

function playPhoneAnim() {
    // Play phone animation
    phoneAnim.play();
}

function resetPhoneAnim() {
    // Stop and restart the phone animation
    phoneAnim.stop();
    phoneAnim.play();
    // Pauses indefinitely from frame 1
    phoneAnim.stop();
}