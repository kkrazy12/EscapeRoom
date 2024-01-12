// Open player names modal when the "Enter Player Names" button is clicked
document.getElementById("enterNamesBtn").addEventListener("click", function() {
    document.getElementById("playerNamesModal").style.display = "block";
});

// Close the player names modal when the close button is clicked
document.querySelector(".close").addEventListener("click", function() {
    document.getElementById("playerNamesModal").style.display = "none";
});

// Start the game when the "Start Game" btn
document.getElementById("startGameBtn").addEventListener("click", function() {
    alert("Game started!");
    document.getElementById("playerNamesModal").style.display = "none";
});

// // Contrast Safe button functionality
// let isContrastSafeEnabled = false;

// document.getElementById("contrastSafeBtn").addEventListener("click", function() {
   
//     const defaultStylesheet = "main.css";
//     const contrastSafeStylesheet = "aa.css";

//     const linkElement = document.getElementById("defaultStylesheet");

//     if (isContrastSafeEnabled) {
//         linkElement.setAttribute("href", defaultStylesheet);
//     } else {
//         linkElement.setAttribute("href", contrastSafeStylesheet);
//     }

//     isContrastSafeEnabled = !isContrastSafeEnabled;
// });

// document.addEventListener("DOMContentLoaded", function() {
//     let isContrastSafeEnabled = false;

//     document.getElementById("contrastSafeBtn").addEventListener("click", function() {
//         const defaultStylesheet = "main.css";
//         const contrastSafeStylesheet = "contrastSafeStyles.css";

//         const linkElement = document.getElementById("default-styles");

//         if (linkElement) { // Check if the element is found before using it
//             if (isContrastSafeEnabled) {
//                 linkElement.setAttribute("href", defaultStylesheet);
//             } else {
//                 linkElement.setAttribute("href", contrastSafeStylesheet);
//             }

//             isContrastSafeEnabled = !isContrastSafeEnabled;
//         }
//     });
// });

document.addEventListener("DOMContentLoaded", function() {
    let isContrastSafeEnabled = false;

    document.getElementById("contrastSafeBtn").addEventListener("click", function() {
        const defaultStylesheet = "css/main.css";
        const contrastSafeStylesheet = "css/aa.css";

        const linkElement = document.getElementById("mainStyles");

        if (linkElement) { // Check if the element is found before using it
            if (isContrastSafeEnabled) {
                linkElement.setAttribute("href", defaultStylesheet);
            } else {
                linkElement.setAttribute("href", contrastSafeStylesheet);
            }

            isContrastSafeEnabled = !isContrastSafeEnabled;
            console.log(isContrastSafeEnabled);
        }
    });
});


  