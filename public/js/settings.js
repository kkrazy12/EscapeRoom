/* SETTING SCRIPT */
/* THIS TOGGLES THE PLANT DEPENDING ON THE TICKBOX */

function togglePlant() {
    // Retrieve the state of the plantBackup from sessionStorage
    let plantBackup = sessionStorage.getItem('plantBackup') === 'true';

    console.log('Plant:', plantBackup); // Log initial state

    // Set the checkbox state based on plantBackup
    let plantCheckbox = document.getElementById('plantBackupToggle');
    plantCheckbox.checked = plantBackup;

    // Listen for when checkbox changes
    plantCheckbox.addEventListener('change', function() {
        // Update the plantBackup variable based on checkbox state
        sessionStorage.setItem('plantBackup', plantCheckbox.checked);

        console.log('Plant:', plantCheckbox.checked); 
    });
}

// Call togglePlant once document is loaded
document.addEventListener('DOMContentLoaded', function() {
    togglePlant();
});
