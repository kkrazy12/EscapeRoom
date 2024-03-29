let source; // image source
let tiles = []; // Initializes an empty array to store individual puzzle piece tiles
let cols = 3; // Defines the number of columns in the puzzle grid
let rows = 3; // Defines the number of rows in the puzzle grid
let w, h; // Declares variables to represent the width and height of each puzzle piece
let board = [];
let modalShown = false;


function countInversions(arr) {
  let invCount = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] !== -1 && arr[j] !== -1 && arr[i] > arr[j]) {
        invCount++;
      }
    }
  }
  return invCount;
}

function preload() {
  source = loadImage("./img/alice5.png"); // Preloading the image before the canvas so that the user never has only a blank canvas with no image. If it takes its time to load, they will end up loading in together rather than one at a time
}


function setup() {
  createCanvas(400, 400); // Creating my canvas 400px x 400px
  w = width / cols; // The width and height of each puzzle piece (w and h) are calculated based on the canvas dimensions and the number of columns and rows
  h = height / rows;
  initialiseTiles(); 
  shuffleBoard();
  console.log("Is solvable:", isSolvable());
}

function initialiseTiles() {
  tiles = [];
  board = [];
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const x = c * w;
      const y = r * h;
      const img = createGraphics(w, h); // For each grid position, a tile image is created using createGraphics(w, h) to make an off-screen graphics buffer of the same size as a puzzle piece
      img.image(source, 0, 0, w, h, x, y, w, h); // Copies a portion of the source image onto the tile image.
      const index = c + r * cols;
      board.push(index);
      tiles.push(new Tile(index, img)); // A tile object is created and added to the tiles array. The index variable is pushed onto the board array to represent the initial order of the tiles.
    }
  }
  tiles.pop();
  board.pop();
  board.push(-1); //the last tile and index are removed, and an empty spot is represented by 1 in the board.
}

function shuffleBoard() {
  // Reset to the solved state
  initialiseTiles();

  // Perform a series of valid moves to shuffle the puzzle
  do {
    for (let i = 0; i < 1000; i++) {
      // Choose a random valid move
      let validMoves = getValidMoves();
      let randomMove = random(validMoves);
      move(randomMove[0], randomMove[1], board);
    }
  } while (!isSolvable());
}

function isSolvable() {
  let invCount = countInversions(board);
  let puzzleSize = cols * rows;
  if (puzzleSize % 2 === 0) {
    // Puzzle size is even
    return invCount % 2 === 0;
  } else {
    // Puzzle size is odd
    let blankRowFromBottom = rows - Math.floor(board.indexOf(-1) / cols);
    return (invCount + blankRowFromBottom) % 2 === 0;
  }
}

function resetPuzzle() {
  $('#puzzleComplete').modal('hide');
  modalShown = false;
//Hide the modal and reset the puzzle once closed
  shuffleBoard();
}



function getValidMoves() {
  let blank = findBlank();
  let blankCol = blank % cols;
  let blankRow = floor(blank / rows);
  let validMoves = [];

  // Check neighbouring positions
  if (blankCol > 0) validMoves.push([blankCol - 1, blankRow]); //left
  if (blankCol < cols - 1) validMoves.push([blankCol + 1, blankRow]); //right
  if (blankRow > 0) validMoves.push([blankCol, blankRow - 1]); //up
  if (blankRow < rows - 1) validMoves.push([blankCol, blankRow + 1]); //down

  return validMoves;
}


function swap(c, r, arr) {
    [arr[c], arr[r]] = [arr[r], arr[c]];
  }
  
  // Pick a random spot to attempt a move
  // This should be improved to select from only valid moves
  function randomMove(arr) {
    let r1 = floor(random(cols));
    let r2 = floor(random(rows));
    move(r1, r2, arr);
  }
  
  
  // Move based on click
  function mousePressed() {
    let i = floor(mouseX / w);
    let j = floor(mouseY / h);
    move(i,j,board);
  }

function draw() {
  background(0); //In the draw() function, the canvas is cleared (background(0)) to prepare for redrawing the puzzle.
  drawBoard(); //The current state of the puzzle is drawn based on the board array. The tiles are arranged according to the current order in the board array.
  drawGrid(); //The puzzle pieces are drawn as images, and a grid overlay is added to tell the pieces apart.
  if (isSolved() && !modalShown) {
    //show the modal
    $('#puzzleComplete').modal('show');
    modalShown = true;
  }
}

function drawBoard() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const index = i + j * cols;
      const x = i * w;
      const y = j * h;
      const tileIndex = board[index];
      if (tileIndex > -1) {
        const img = tiles[tileIndex].img;
        image(img, x, y, w, h);
      }
    }
  }
}

function drawGrid() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = i * w;
      const y = j * h;
      strokeWeight(2);
      noFill();
      rect(x, y, w, h);
    }
  }
}

function isSolved() {
  for (let i = 0; i < board.length - 1; i++) {
    if (board[i] !== tiles[i].index) {
      return false;
    }
  }
  return true;
}

function move(i, j, arr) {
    let blank = findBlank();
    let blankCol = blank % cols;
    let blankRow = floor(blank / rows);
    

    if (isNeighbor(i, j, blankCol, blankRow)) {
      swap(blank, i + j * cols, arr);
    }
  }
  
  function isNeighbor(i, j, x, y) {
    if (i !== x && j !== y) {
      return false;
    }
  
    if (abs(i - x) == 1 || abs(j - y) == 1) {
      return true;
    }
    return false;
  }
  
  function findBlank() {
    for (let i = 0; i < board.length; i++) {
      if (board[i] == -1) return i;
    }
  }




  