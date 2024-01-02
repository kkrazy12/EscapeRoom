/* This script simulates a rotary phone interface. It encapsulates all functionalities
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

    //test audio files
    mp3Sequences: {
        '1234567890': '/directoryAudio/0001.mp3', 
        '2222222222': '/directoryAudio/0002.wav',  
        '3333333333': '/directoryAudio/0003.wav',  
        '4444444444': '/directoryAudio/0004.wav',  
        '5555555555': '/directoryAudio/0005.wav',  
        '6666666666': '/directoryAudio/0006.wav',  
        '7777777777': '/directoryAudio/0007.wav',  
        '8888888888': '/directoryAudio/0008.mp3', 
        '9999999999': '/directoryAudio/1009.mp3',  
        '1111111111': '/directoryAudio/0010.mp3'  

        // Add more sequences as needed
    },
  
    // Method to handle call actions

    /* call method, only makes a call if there are enough digits to */
    call: function() {
        // ... method implementation ...
        if (this.numCount == 10) {
            var dialedNumber = this.numArr.join('');
            // Check if the dialed number matches a sequence with an MP3 file
        if (dialedNumber in this.mp3Sequences) {
            var audio = new Audio(this.mp3Sequences[dialedNumber]);
            audio.play();
        } else {
            // Existing code to make a call
            var tel = 'tel:' + dialedNumber;
            this.link.setAttribute('href', tel);
            this.link.click();
        }
      } else {
        /* otherwise h1 element is used for instructions */
        this.title.innerHTML = "";
        this.title.innerHTML = "Please<br>enter 1 #s";
        setTimeout(function(){
          vObj.title.innerHTML = "";
          vObj.title.innerHTML = "Click<br>Calls";
        },3000);
      }
  
    },
  // Method to clear the dialed numbers and reset the interface
    clearFun: function() {
      this.numArr = [];
      this.link.setAttribute('href','#');
      this.numCount = 0;
      this.title.innerHTML = "";
      this.title.innerHTML = "Click<br>Calls";
      for(i=0;i<this.nums.length;i++) {
        this.nums[i];
        this.nums[i].classList.add('disNon');
        this.nums[i].classList.remove('rAFade');
        this.nums[i].innerHTML = "";
      }
    },
   // Utility method to remove specific classes from elements
    prune: function(list, tExp) {
      for(p=0;p<list.length;p++) {
          if (tExp.test(list[p])) {
            list.remove(list[p]);
            p--;
          }
      }
    },

   // Method to handle number button clicks
    numClick: function(num,deg) {
      /* this.ani keeps next animation from firing, while first is still going*/
      if (!this.ani && this.numCount<10) {
        /* array is used to change 'href' value of phone link later*/
        this.numArr.push(num);
        console.log(this.numArr);
        this.ani = 1;
        /* used to calculate milliseconds of Timeout functions below */
        var whole = num * 200 + 500;
        var half = whole/2;
        /* adds correct rotate class to #con1 */
        this.conCl.add('r' + deg);
        /* Timeout to add 'rotBar' animation halfway through */
        setTimeout(function(){
          vObj.bar.add('rotBar');
        },half);
        /* Timeout to remove animations classes, so they can be added again, and resets this.ani to 0 */
        setTimeout(function(){
          vObj.bar.remove('rotBar');
          vObj.prune(vObj.conCl,/^r/);
          vObj.ani = 0;
        },whole);
        this.numCount++;
        /* makes blue bars show up */
        if (this.numCount==1) {
          for(i=0;i<this.lines.length;i++) {
            this.lines[i].classList.remove('disNon');
          }
        }
        /* code for when you reach 10 numbers total */
        if (this.numCount==10) {
          this.nums[9].classList.remove('rAFade');
          this.title.innerHTML = "";
          this.title.innerHTML = "Click<br> to Call";
          if (num==10) {
            this.nums[9].innerHTML = "0";
          } else  {
            this.nums[9].innerHTML = num;
          }
        /* code for when you are at less than 10 numbers */
        } else {
          this.nums[this.numCount-1].classList.remove('disNon', 'rAFade');
          if (num==10) {
            this.nums[this.numCount-1].innerHTML = "0";
          } else  {
            this.nums[this.numCount-1].innerHTML = num;
          }
          this.nums[this.numCount].classList.remove('disNon');
          this.nums[this.numCount].classList.add('rAFade');
        }
  
  
      }
  
  
  
    }
  }
  
  
  function init() {
    // Function to initialise the application after page load
    // It sets up references to various DOM elements and prepares the interface
    // ... function implementation ...
   vObj.title = document.getElementById('title');
   vObj.conCl = document.getElementById('con1').classList;
   vObj.bar = document.getElementById('bar').classList;
   vObj.nums = document.getElementsByClassName('btnNum2');
   vObj.lines = document.getElementsByClassName('btLine');
   vObj.link = document.getElementById('phoneLink');
  }
  
  window.onload = init; // Bind the init function to window load event
  