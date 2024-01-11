// Get an element using a query selector
const get = query => document.querySelector(query);

// Get references to the display and progress elements
var interval;
const sessionTargetTime = "target_time";
const display = get(".timer .display");
const progress = get(".timer .progress");
const WARN_THRESHOLD = 0.4;
const DANGER_THRESHOLD = 0.2;
const TARGET_TIME = new Date().getTime() + .1 * 60 * 1000; // Current time + 15 minutes in milliseconds

// Function to update the timer display, progress bar, and color
function updateTimerDisplay() {
  // Convert milliseconds to seconds and calculate minutes and seconds
  var storedTargetTime = sessionStorage.getItem(sessionTargetTime);
  var currentTime = new Date().getTime();
  console.log(storedTargetTime);
  const remainingSeconds = Math.floor((storedTargetTime - currentTime) / 1000);
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  console.log(currentTime >= storedTargetTime)
  if (seconds < 1) {
    sessionStorage.setItem("stop", true);
    clearInterval(interval);
    sessionStorage.setItem("target_time", new Date().getTime() + .1 * 60 * 1000)

  }
  // Update the display with the formatted time (MM:SS)
  display.innerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  progress.style.setProperty("--progress", remainingSeconds);


  if (remainingSeconds > WARN_THRESHOLD) {
    progress.style.setProperty("--color", "var(--safe)");
  } else if (remainingSeconds > DANGER_THRESHOLD) {
    progress.style.setProperty("--color", "var(--warn)");
  } else {
    progress.style.setProperty("--color", "var(--danger)");
  }
}

// Function to handle the countdown
function startCountdown() {
  // store in session target time if not exists
  var storedtime = sessionStorage.getItem(sessionTargetTime)
  if (!storedtime) {
    sessionStorage.setItem(sessionTargetTime, TARGET_TIME)
  }
  //if (sessionStorage.getItem(stop) === true) return;
  interval = setInterval(() => {
    //const newProgress = (TARGET_TIME - new Date().getTime()) / (15 * 60 * 1000);
    updateTimerDisplay();
  }, 1000);


}

startCountdown();

// Function to reset the game and navigate back to index.html
function resetGame() {
  // Remove the timer state from sessionStorage
  sessionStorage.removeItem("timeRemaining");

  window.location.href = 'index.html';
}

// Visibility change event listener
document.addEventListener('visibilitychange', () => {
  // Update the visibility state when the page visibility changes
  isPageVisible = document.visibilityState === 'visible';
});

// Enter four-digit code into the input field
function checkPin() {
  const userPin1 = document.getElementById('userPin1').value;
  const userPin2 = document.getElementById('userPin2').value;
  const userPin3 = document.getElementById('userPin3').value;
  const userPin4 = document.getElementById('userPin4').value;

  const resultDiv = document.getElementById("result");
  var pin = userPin1 + userPin2 + userPin3 + userPin4;
  console.log(pin);

  // Check if the entered pin is correct (1234)
  if (pin === "8421") {
    resultDiv.textContent = "You have successfully escaped CyberWonderland! 🎉";
    resultDiv.style.color = "green";
  } else {
    resultDiv.textContent = "Access Unsuccessful. Please try again.";
    resultDiv.style.color = "red";
  }
}