document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");
  const restartBtn = document.querySelector("#restart-button");
  const width = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;
  const colors = ["orange", "red", "purple", "green", "blue"];

  //The Tetraminoes
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width * 1, width * 2, width * 2, width * 2 + 1],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];
  //   console.log(theTetrominoes);

  let currentPosition = 4;
  let currentRotation = 0;

  //randomly select a tetromino and its first rotation
  let random = Math.floor(Math.random() * theTetrominoes.length); //a random number from 0 to 4
  //   let current = theTetrominoes[0][0];
  let current = theTetrominoes[random][currentRotation]; //by putting currentRotation here, we always start at the the first rotation of any tetronino

  //draw the first rotation in the first tetromino
  //   function draw() {
  //     current.forEach((index) => {
  //       squares[currentPosition + index].classList.add("tetromino");
  //     });
  //   }
  //   draw();

  //draw the  tetromino
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("tetromino");
      squares[currentPosition + index].style.backgroundColor = colors[random];
    });
  }

  //Undraw the tetromino
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino");
      squares[currentPosition + index].style.backgroundColor = "";
    });
  }

  //Make the tetromino move down every second
  //   timerId = setInterval(movedown, 1000); //no longer needed cus it is now in our start button

  //assign function to keyCodes
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      movedown();
    }
  }
  document.addEventListener("keyup", control);

  function movedown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  //freeze function
  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );

      //Start a new Tetromino falling
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  //move the tetromino left, unless is at the edge or there is a blockage ||| writing a rule that will stop our squres if they are on the edge of the border, because our grid has a width of 10 squares/indexes and height of 20
  function moveLeft() {
    undraw();
    //check if any tetronimo box is ath the left edge
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );
    //if its not at the left edge, then we can move left
    if (!isAtLeftEdge) currentPosition -= 1; //only allow our tetronimo to move left, if its not at the left edge. We also want our tetromino to stop if there's one there already

    //if some of the squares in our tetronimo shape, suddenly go into a sapce that contains our class of taken, while moving left, we want to take it back one space
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }

  //Move the tetromino right, unles is at the edge or there is a blockage
  function moveRight() {
    undraw();
    //Basically this is checking if an index(a box in the tetronimo shape) is divisible by the width and its remainder deeply equals the width -1 (in this case 9, 19,29) that means the staement is true and we are at the right edge
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );

    if (!isAtRightEdge) currentPosition += 1;

    //if an index(a box in the tetronimo shape) go into a space that contains a class of taken, while moving right, they are taken back a sapce, basically making them appear like they havent moved
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }

  //Rotate the tetromino | Basically skipping to the next tetromino rotation in the current Tetromino array
  function rotate() {
    undraw();
    currentRotation++; //here we are using the increment operator to move down in our current rotation array
    if (currentRotation === current.length) {
      //if current rotation is equals to the length of the array, so basically 4, we want to go back to the start of the array
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    draw();
  }

  // function restart() {
  //   squares.forEach((square) => {
  //     square.classList.remove("tetromino");
  //   });
  //   undraw();

  // random = nextRandom;
  // nextRandom = Math.floor(Math.random() * theTetrominoes.length);
  // current = theTetrominoes[random][currentRotation];
  // currentPosition = 4;
  // draw();
  // clearInterval(timerId);

  // timerId = setInterval(movedown, 1000);
  // }
  //Show up-next tetromino in mini-grid
  const displaySquares = document.querySelectorAll(".mini-grid div");
  const displayWidth = 4;
  const displayIndex = 0;

  //the Tetrominoes without rotations
  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //ztetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
    [0, 1, displayWidth, displayWidth + 1], //oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
  ];

  //Display the shape in the mini-grid display
  function displayShape() {
    //remove any trace of a tetromino from the entire grid
    displaySquares.forEach((square) => {
      square.classList.remove("tetromino");
      squares.style.backgroundColor = "";
    });
    //for each square that makes up our now randomly selected up next tetromino, we want to add a class of tetromino to it
    upNextTetrominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("tetromino");
      squares[displayIndex + index].style.backgroundColor = colors[nextRandom];
    });
  }

  //add functionality to the button
  startBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(movedown, 1000);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  });

  //Have to figure out how to restart the code
  // restartBtn.addEventListener("click", () => {
  //   restart();
  //   //use a for loop, to loop over all the grids
  // });

  //add score
  function addScore() {
    //the fro loop will loop over our entire grid and will create squares every 10 squares????
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];

      //if every square in our defined row contains a div with a class of taken | if it does, we add 10 to the score| we display it to our user using the score display, and for each item in the row we remove the class of taken.
      if (row.every((index) => squares[index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
          squares[index].style.backgroundColor = "";
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }

  //GAME OVER USING SOME() AND INNERHTML
  //Tell our javascript that if there is a taken shape present in the original default position or index 4 we call it a game over
  //game over
  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      scoreDisplay.innerHTML = "end";
      clearInterval(timerId);
    }
  }

  /////////////////////////////
  /////////////////////////////
  /////////////////////////////
  /////////////////////////////
  /////////////////////////////
  /////////////////////////////
  /////////////////////////////
});
