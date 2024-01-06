/* This script simulates a rotary phone interface. It holds all functionalities
   within an object (vObj) and an initialisation function (init) to avoid global variables.
   The script handles user interactions, animations, and simulates phone call actions. */

   var vObj = {
    ani: 0,
    bar: undefined,
    conCl: undefined,
    lines: undefined,
    numArr: [],
    numCount: 0,
    nums: undefined,
    title: undefined,
    dialSound: new Audio('./audio/directoryAudio/rotaryDialToneExtended.mp3'),
    currentAudio: null,

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

    hideEndCallButton: function() {
        var endCallButton = document.querySelector('.end-call-button');
        if (endCallButton) {
            endCallButton.style.display = 'none';
        }
    },

    showEndCallButton: function() {
        var endCallButton = document.querySelector('.end-call-button');
        if (endCallButton) {
            endCallButton.style.display = 'block';
        }
    },

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
                this.showEndCallButton();
            } else {
                this.title.innerHTML = "Please<br>dial 10 digits";
                setTimeout(() => {
                    this.title.innerHTML = "Press<br>Numbers";
                }, 3000);
            }
        }
    },

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

    prune: function(list, tExp) {
        for (let p = 0; p < list.length; p++) {
            if (tExp.test(list[p])) {
                list.remove(list[p]);
                p--;
            }
        }
    },

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
    vObj.hideEndCallButton();
}

window.onload = init;

  