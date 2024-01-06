// playerSelection.js

// Function for adding event listeners
function playerButtons() {
    const playerButtons = document.querySelectorAll('.playerButton');

    // Add event listeners to each player button.
    playerButtons.forEach(button => {
        button.addEventListener('click', (event) => playerSelection(event, playerButtons));
    });
}

// Function for selecting player
function playerSelection(event, playerButtons) {
    // Remove the 'selected' class from all buttons.
    playerButtons.forEach(btn => btn.classList.remove('selected'));

    // Add the 'selected' class to the clicked button.
    event.target.classList.add('selected');

    // Update the selected player count and save it in local storage.
    const selectedPlayerCount = event.target.getAttribute('data-count');
    localStorage.setItem('playerCount', selectedPlayerCount);
}

// Function for submission of player number
function playerSubmission() {
    const nextButton = document.getElementById('nextButton');

    nextButton.addEventListener('click', () => {
        // Retrieve the selected player count from local storage.
        const selectedPlayerCount = localStorage.getItem('playerCount');

        // If a player count is selected, proceed to the next page.
        if (selectedPlayerCount > 0) {
            window.location.href = './video.html';
        } else {
            // Alert the user to select the number of players if none is selected.
            alert('Please select the number of players.');
        }
    });
}

// Executes functions when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    playerButtons();
    playerSubmission();
});
