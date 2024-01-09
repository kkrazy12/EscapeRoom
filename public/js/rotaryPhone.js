/* Rotary Phone Interface Simulation Script
   This script creates a functional rotary phone interface on the web page.
   It handles user interactions, animations, and simulates phone call actions. */

// Main object to hold all functionalities and avoid global variables
var vObj = {
    ani: 0,  // Animation state flag
    bar: undefined,  // Reference to the bar element for animations
    conCl: undefined,  // Class list of the container element
    lines: undefined,  // Collection of line elements for display
    numArr: [],  // Array to store dialed numbers
    numCount: 0,  // Count of numbers dialed
    nums: undefined,  // Collection of number elements
    title: undefined,  // Reference to the title element for display
    dialSound: new Audio('./audio/directoryAudio/rotaryDialToneExtended.mp3'),  // Dial sound file
    currentAudio: null,  // Current audio being played

      // Predefined audio files for specific number sequences
    mp3Sequences: {
        // Mapping of number sequences to audio file paths
        // Each sequence is associated with a specific audio file
        '0121239212': './audio/directoryAudio/cheshireCatChess.mp3', //Cheshire Cat
        '0121238312': './audio/directoryAudio/0002.wav',  //Alice
        '0121237214': './audio/directoryAudio/whiteRabbit.mp3',  //White Rabbit
        '0121253212': './audio/directoryAudio/0004.wav',  //Mad Hatter
        '0121117212': './audio/directoryAudio/0005.wav',  //Queen of Hearts
        '0121660212': './audio/directoryAudio/0006.wav',  //Caterpillar
        '0121234512': './audio/directoryAudio/0007.wav',  //Door Knob
        '0121231112': './audio/directoryAudio/0008.mp3',  //Singing Flowers
        '0121239989': './audio/directoryAudio/1009.mp3',  //Tweedledee & Tweedledum
        '0121232231': './audio/directoryAudio/0010.mp3',  //Rose
        '0121112111': './audio/directoryAudio/kingofHearts.mp3',  //King of Hearts
        '10121253215': './audio/directoryAudio/marchHare.mp3',  //March Hare
    },

     // Method to hide the 'End Call' button
    hideEndCallButton: function() {
        var endCallButton = document.querySelector('.end-call-button');
        if (endCallButton) {
            endCallButton.style.display = 'none';
        }
    },

    // Method to show the 'End Call' button
    showEndCallButton: function() {
        var endCallButton = document.querySelector('.end-call-button');
        if (endCallButton) {
            endCallButton.style.display = 'block';
        }
    },

// Function to play incorrect number audio
playIncorrectNumberAudio: function() {
    if (this.currentAudio && !this.currentAudio.paused) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
    }
    this.currentAudio = new Audio('./audio/directoryAudio/incorrectNum.wav');
    this.currentAudio.play();
    this.title.innerHTML = "Incorrect Number";
    this.currentAudio.onended = () => {
        this.title.innerHTML = "Ready to Dial";
        this.clearFun();
    };
},

// Method to handle call actions when a number sequence is dialed
call: function() {
    if (this.numCount == 10) {
        var dialedNumber = this.numArr.join('');
        if (dialedNumber in this.mp3Sequences) {
            if (this.currentAudio && !this.currentAudio.paused) {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
            }
            this.currentAudio = new Audio(this.mp3Sequences[dialedNumber]);
            this.currentAudio.play();
            this.title.innerHTML = "End Call";
            this.currentAudio.onended = () => {
                this.title.innerHTML = "Ready to Dial";
            };
        } else {
            this.playIncorrectNumberAudio();
        }
    }
},
  // Method to handle the hang-up action and stop the audio
    hangUp: function() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }
        this.clearFun();
        this.title.innerHTML = "Ready to Dial";
        this.hideEndCallButton();
    },
// Method to clear dialed numbers, reset the interface, and stop any playing audio
clearFun: function() {
    // Stop and reset the current audio if it's playing
    if (this.currentAudio && !this.currentAudio.paused) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio = null;
    }

    // Clear dialed numbers and reset number count
    this.numArr = [];
    this.numCount = 0;

    // Reset the display
    this.title.innerHTML = "Press<br>Numbers";
    for (let i = 0; i < this.nums.length; i++) {
        this.nums[i].classList.add('disNon');
        this.nums[i].classList.remove('rAFade');
        this.nums[i].innerHTML = "";
    }
},

// Utility method to remove specific classes from elements
    prune: function(list, tExp) {
        for (let p = 0; p < list.length; p++) {
            if (tExp.test(list[p])) {
                list.remove(list[p]);
                p--;
            }
        }
    },
// Method to handle number button clicks
    numClick: function(num, deg) {
        if (!this.ani && this.numCount < 10) {
            this.dialSound.play();
            this.numArr.push(num);
            this.ani = 1;
            var whole = num * 200 + 500;
            var half = whole / 2;
            this.conCl.add('r' + deg);
            setTimeout(() => {
                this.bar.add('rotBar');
            }, half);
            setTimeout(() => {
                this.bar.remove('rotBar');
                this.prune(this.conCl, /^r/);
                this.ani = 0;
                this.dialSound.pause();
                this.dialSound.currentTime = 0;
            }, whole);
            this.numCount++;
            if (this.numCount == 10) {
                this.updateDisplayForFinalNumber(num);
            } else {
                this.updateDisplayForNextNumber(num);
            }
        }
    },
// Helper methods for updating the display after dialing a number
    updateDisplayForFinalNumber: function(num) {
        this.nums[9].classList.remove('rAFade');
        this.title.innerHTML = "Click<br> to Call";
        this.nums[9].innerHTML = num == 10 ? "0" : num.toString();
    },

    updateDisplayForNextNumber: function(num) {
        this.nums[this.numCount - 1].classList.remove('disNon', 'rAFade');
        this.nums[this.numCount - 1].innerHTML = num == 10 ? "0" : num.toString();
        this.nums[this.numCount].classList.remove('disNon');
        this.nums[this.numCount].classList.add('rAFade');
    }
};
// Initialisation function to set up the rotary phone interface after page load
function init() {
    vObj.title = document.getElementById('title');
    vObj.conCl = document.getElementById('con1').classList;
    vObj.bar = document.getElementById('bar').classList;
    vObj.nums = document.getElementsByClassName('btnNum2');
    vObj.lines = document.getElementsByClassName('btLine');
    vObj.link = document.getElementById('phoneLink');
    var dialCenter = document.getElementById('dialCenter');
    if (dialCenter) {
        dialCenter.addEventListener('click', function() {
            vObj.hangUp();
        });
    }
    vObj.hideEndCallButton(); // Hide the 'End Call' button initially
}

// Run the initialisation function when the window loads
window.onload = init;

  