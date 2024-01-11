const ws = new WebSocket('ws://172.20.10.2:3000/admin');

        document.getElementById('playSound').addEventListener('click', function() {
            ws.send('playSound');
            console.log('Sent "playSound" command');
        });

        document.getElementById('sendMessage').addEventListener('click', function() {
            const message = document.getElementById('messageInput').value;
            const selectedCharacter = document.getElementById('voiceSelect').value;
            const messageObject = { text: message, character: selectedCharacter };

            ws.send(JSON.stringify(messageObject));
            console.log('Sent message:', messageObject);
        });

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

        function handleReceivedData(messageData) {
            if (messageData.text && messageData.character) {
                aiVoice(messageData.character, messageData.text).then(audioUrl => {
                    if (audioUrl) {
                        let audio = new Audio(audioUrl);
                        audio.play().then(() => {
                            console.log("AI voice playback started for " + messageData.character + ".");
                        }).catch(error => {
                            console.error("Error during AI voice playback:", error);
                        });
                    }
                });
            }
        }

        function playSound() {
            const isPhoneChecked = document.getElementById('phoneCheckbox').checked;
            const isPlayOutloudChecked = document.getElementById('playOutloudCheckbox').checked;

            if (isPhoneChecked) {
                console.log("Phone option is enabled.");
            }

            if (isPlayOutloudChecked) {
                console.log("Play Outloud option is enabled.");
                let audio = new Audio('audio/phoneRinging.mp3');
                audio.play().then(() => {
                    console.log("Phone ringing audio playback started.");
                }).catch(error => {
                    console.error("Error during audio playback:", error);
                });
            }
        }

        ws.onmessage = function(event) {
            if (event.data instanceof Blob) {
                const reader = new FileReader();
                reader.onload = function() {
                    const result = reader.result;

                    if (result === 'playSound') {
                        playSound();
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
                    playSound();
                }
            }
        };