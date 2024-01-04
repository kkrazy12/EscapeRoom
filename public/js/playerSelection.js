document.addEventListener('DOMContentLoaded', () => {

    const submitButton = document.getElementById('submitPlayers');
    const playerCountButtons = document.querySelectorAll('.player-count-btn');

    // Variable to store selected player count
    let selectedPlayerCount = 0;

    // Add event listeners to each player count button
    playerCountButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            selectedPlayerCount = event.target.getAttribute('data-count');
        });
    });

    // Add event listener to the submit button
    submitButton.addEventListener('click', (event) => {
        event.preventDefault();

        // Check if a player count has been selected
        if (selectedPlayerCount > 0) {
            localStorage.setItem('playerCount', selectedPlayerCount);
            window.location.href = './video.html';
        } else {
            alert('Please select the number of players.');
        }
    });
});