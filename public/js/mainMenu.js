/* MAIN MENU SCRIPT
This is the script for the main menu interactivity */

document.addEventListener('DOMContentLoaded', () => {
    // Retrieve elements from the HTML
    const bgMusic = document.getElementById('bgMusic');
    const startGameSound = document.getElementById('startGameSound');
    const buttonSound = document.getElementById('buttonSound');
    const musicToggle = document.getElementById('musicToggle');
    const startGameLink = document.getElementById('startGameLink');
    const contentContainer = document.querySelector('.contentContainer');

    // Function to toggle the music icon
    const toggleMusicIcon = (isPlaying) => {
        // Retrieve icon from HTML
        const icon = musicToggle.querySelector('i');
        // Change icon (mute or volume up) depending on audio
        icon.classList.remove(isPlaying ? 'fa-volume-mute' : 'fa-volume-up');
        icon.classList.add(isPlaying ? 'fa-volume-up' : 'fa-volume-mute');
    };

    // Function to play an audio element
    const playAudio = (audioElement) => {
        // For handling any errors
        audioElement.play().catch(error => console.error('Error playing the sound:', error));
    };

    // For the music toggle button
    musicToggle.addEventListener('click', () => {
        // Check if background music is paused and play or pause accordingly
        if (bgMusic.paused) {
            playAudio(bgMusic);
            toggleMusicIcon(true); // Change icon to indicate music is playing
        } else {
            bgMusic.pause();
            toggleMusicIcon(false); // Change icon to indicate music is muted
        }
    });

    // For the start game button
    startGameLink.addEventListener('click', (e) => {
        // Check if background music is not paused
        if (!bgMusic.paused) {
            playAudio(startGameSound);

            // Delay the navigation to allow the sound to play
            setTimeout(() => {
                window.location.href = startGameLink.getAttribute('href');
            }, 700);

            e.preventDefault(); // Prevent default link behavior
        }
    });

    // Select all links within the contentContainer
    const navLinks = contentContainer.querySelectorAll('nav a');

    // Function to play the button hover sound
    const playHoverSound = () => {
        // Play the button hover sound if music is enabled
        if (!bgMusic.paused) {
            playAudio(buttonSound);
        }
    };

    // Attach the mouseover event listener to each link
    navLinks.forEach(link => {
        link.addEventListener('mouseover', playHoverSound);
    });
});

// IMPORTANT: Resetting Mad Hatter's audio flag 
localStorage.removeItem('madHatterCalled');