/* This script simulates a rotary phone interface. It holds all functionalities
   within an object (vObj) and an initialisation function (init) to avoid global variables.
   The script handles user interactions, animations, and simulates phone call actions. */

   var vObj = {
    // Properties for maintaining the state of the application
    ani: 0,              // Animation state flag
    bar: undefined,      // Reference to the bar element for animations
    conCl: undefined,    // Class list of the container element
    lines: undefined,    // Collection of line elements for display
    numArr: [],          // Array to store dialed numbers
    numCount: 0,         // Count of numbers dialed
    nums: undefined,     // Collection of number elements
    title: undefined,    // Reference to the title element for display
    dialSound: new Audio('./audio/directoryAudio/rotaryDialToneExtended.mp3'),  // Dial sound file

    // Test audio files for specific number sequences
    mp3Sequences: {
        '1234567890': './audio/directoryAudio/0001.mp3', 
        '2222222222': './audio/directoryAudio/0002.wav',  
        '3333333333': './audio/directoryAudio/0003.wav',  
        '4444444444': './audio/directoryAudio/0004.wav',  
        '5555555555': './audio/directoryAudio/0005.wav',  
        '6666666666': './audio/directoryAudio/0006.wav',  
        '7777777777': './audio/directoryAudio/0007.wav',  
        '8888888888': './audio/directoryAudio/0008.mp3', 
        '9999999999': './audio/directoryAudio/1009.mp3',  
        '1111111111': './audio/directoryAudio/0010.mp3'
    },

    // Method to handle call actions
    call: function() {
        if (this.numCount == 10) {
            var dialedNumber = this.numArr.join('');
            if (dialedNumber in this.mp3Sequences) {
                new Audio(this.mp3Sequences[dialedNumber]).play();
            } else {
                this.title.innerHTML = "Please<br>dial 10 digits";
                setTimeout(function() {
                    vObj.title.innerHTML = "Press<br>Numbers";
                }, 3000);
            }
        }
    },

    // Method to clear the dialed numbers and reset the interface
    clearFun: function() {
        this.numArr = [];
        this.link.setAttribute('href', '#');
        this.numCount = 0;
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
            setTimeout(function() {
                vObj.bar.add('rotBar');
            }, half);
            setTimeout(function() {
                vObj.bar.remove('rotBar');
                vObj.prune(vObj.conCl, /^r/);
                vObj.ani = 0;
                vObj.dialSound.pause();
                vObj.dialSound.currentTime = 0;
            }, whole);
            this.numCount++;
            if (this.numCount == 10) {
                this.updateDisplayForFinalNumber(num);
            } else {
                this.updateDisplayForNextNumber(num);
            }
        }
    },

    // Helper methods for updating the display
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

function init() {
    // Function to initialise the application after page load
    vObj.title = document.getElementById('title');
    vObj.conCl = document.getElementById('con1').classList;
    vObj.bar = document.getElementById('bar').classList;
    vObj.nums = document.getElementsByClassName('btnNum2');
    vObj.lines = document.getElementsByClassName('btLine');
    vObj.link = document.getElementById('phoneLink');
}

window.onload = init;
