// PHONE CALL FUNCTION
// Used to trigger phone calls

// Jquery, execute the following when the document is ready
$(document).ready(function() {
    setTimeout(madHatterPhone, 500); // Delay the call slightly
    madHatterPhone();
    resetPhoneAnim();
});

var aiAudioUrl = ''; // Global variable to store AI-generated audio URL
let phoneRingingAudio = new Audio('audio/phoneRinging.mp3'); // Load ringing sound

// Object mapping characters to their phone numbers
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

// Function to update the modal with character information
function updateModal(character) {
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

$(document).ready(function() {
    $('#modalAnswerButton').click(function() {
        if (aiAudioUrl) {
            let aiAudio = new Audio(aiAudioUrl);
            aiAudio.play().then(() => {
                console.log("AI voice playback started.");
                $('#modalAnswerButton, #modalDeclineButton').hide();
                const modalBodyText = document.querySelector('#phoneCallModal .modal-body p');
                modalBodyText.textContent = "Call connected...";
    
                aiAudio.onended = function() {
                    $('#phoneCallModal').modal('hide');
                    resetPhoneAnim();
                    phoneRingingAudio.pause();
                    phoneRingingAudio.currentTime = 0;
                };
            }).catch(error => {
                console.error("Error during AI voice playback:", error);
            });
        } else {
            console.error("No AI audio URL available.");
        }
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

// Function for the Mad Hatter's phone call
function madHatterPhone() {
    if (!sessionStorage.getItem('madHatterCalled')) {
        $('#modalAnswerButton, #modalDeclineButton').show();
        const character = 'Mad Hatter';
        aiAudioUrl = './audio/directoryAudio/madHatter.mp3'; // Direct URL to Mad Hatter's audio
        updateModal(character);
        $('#phoneCallModal').modal('show');
        sessionStorage.setItem('madHatterCalled', 'true');
    }
}

function playPhoneAnim() {
    const phoneAnim = document.getElementById('phoneAnim');
    phoneAnim.play();
}

function resetPhoneAnim() {
    const phoneAnim = document.getElementById('phoneAnim');
    phoneAnim.stop();
    phoneAnim.play();
    phoneAnim.stop();
    $('#modalAnswerButton, #modalDeclineButton').show();
}