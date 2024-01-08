// Function to get an element using a query selector
const get = query => document.querySelector(query);

// Function to create a Promise that resolves after a specified time (in seconds)
const wait = s => new Promise(r => setTimeout(r, s * 1000));

// Get references to the display and progress elements using the get function
const display = get(".timer .display");
const progress = get(".timer .progress");

// Constants defining thresholds for progress colour changes
const WARN_THRESHOLD = 0.4;
const DANGER_THRESHOLD = 0.2;

// Initial time in seconds (15 minutes * 60 seconds)
const INIT_TIME = 900;
// Variable to track the remaining time, initialised to the initial time
let timeRemaining = INIT_TIME;

// Immediately invoked async function (IIFE) to start the countdown
(async () => {
  // Continue the loop while there is time remaining
  while (timeRemaining > 0) {
    // Decrement the remaining time
    timeRemaining--;

    // Update the display with the formatted time (MM:SS)
    display.innerText = `${Math.floor(timeRemaining / 60)}:${(timeRemaining % 60).toString().padStart(2, '0')}`;

    // Calculate the new progress value based on the remaining time
    const newProgress = timeRemaining / INIT_TIME;

    // Set the CSS variable --progress to update the progress bar width
    progress.style.setProperty("--progress", newProgress);

    // Set the colour of the progress bar based on the new progress value
    if (newProgress > WARN_THRESHOLD) {
      progress.style.setProperty("--color", "var(--safe)");
    } else if (newProgress > DANGER_THRESHOLD) {
      progress.style.setProperty("--color", "var(--warn)");
    } else {
      progress.style.setProperty("--color", "var(--danger)");
    }

    // Wait for 1 second before the next iteration
    await wait(1);
  }
})();

// Function to reset the game and navigate back to index.html
function resetGame() {
  // Navigate back to index.html
  window.location.href = 'index.html';
}
(async () => {
  // Continue the loop while there is time remaining
  while (timeRemaining > 0) {
    // ... (Your existing timer code)
    await wait(1);
  }

  // Time is up, show the game over modal
  $('#gameOverModal').modal('show');
})();


// Enter four digit code into input field
function checkPin() {
  const userPin1 = document.getElementById('userPin1').value;
  const userPin2 = document.getElementById('userPin2').value;
  const userPin3 = document.getElementById('userPin3').value;
  const userPin4 = document.getElementById('userPin4').value;

  const resultDiv = document.getElementById("result");
  var pin = userPin1 + userPin2 + userPin3 + userPin4;
console.log(pin)
  // Check if the entered pin is correct (1234)
  if (pin === "1234") {
      resultDiv.textContent = "Access Granted! 🎉";
      resultDiv.style.color = "green";
  } else {
      resultDiv.textContent = "Access Unsuccessful. Please try again.";
      resultDiv.style.color = "red";
  }

  // Clear the input field
  //document.getElementById("pinInput").value = "";
}
