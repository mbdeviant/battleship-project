/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
// multi-single player controls
const singlePlayerButton = document.getElementById("single-player-button");
const multiplayerButton = document.getElementById("multiplayer-button");
// start the game
const startButton = document.getElementById("start-button");
const infoDisplay = document.getElementById("info-display");
const turnDisplay = document.getElementById("turn-display");

let tmpBoardData = [];

let playerHits = [];
// let enemyHits = [];
let computerHits = [];
const playerSunkShips = [];
const enemySunkShips = [];
const computerSunkShips = [];

// CREATING SHIPS
class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
  }
}

const destroyer = new Ship("destroyer", 2);
const submarine = new Ship("submarine", 3);
const cruiser = new Ship("cruiser", 3);
const battleship = new Ship("battleship", 4);
const carrier = new Ship("carrier", 5);

const ships = [destroyer, submarine, cruiser, battleship, carrier];

const flipButton = document.getElementById("flip-button");
const shipContainer = document.querySelector(".ship-select-container");
let user = "player";
let currentPlayer = user;
let gameMode = "";
let playerNum = 0;
let turnNum = 0;
let ready = false;
let gameOver = false;
let enemyReady = false;
let allShipsPlaced = false;
let shotFired = -1;
let notDropped;
let singlePlayerStarted;
let multiPlayerStarted;

function startMultiplayer() {
  if (multiPlayerStarted) {
    console.log("dont");
    return;
  }
  multiPlayerStarted = true;
  gameMode = "multiplayer";

  const socket = io();

  // get player number

  socket.on("player-number", (num) => {
    if (num === -1) {
      infoDisplay.innerHTML = "server is full";
    } else {
      playerNum = parseInt(num);
      if (playerNum === 1) currentPlayer = "enemy";
      console.log(playerNum);

      socket.emit("check-players");
    }
  });
  // player connection control
  socket.on("player-connection", (num) => {
    console.log(`player ${num} has connected`);
    controlPlayerConnection(num);
  });

  // enemy ready
  socket.on("enemy-ready", (num) => {
    enemyReady = true;
    playerReady(num);
    if (ready) startGameMulti(socket);
  });

  // check player status
  socket.on("check-players", (players) => {
    players.forEach((player, index) => {
      if (player.connected) controlPlayerConnection(index);
      if (player.ready) {
        playerReady(index);
        if (index !== playerNum) enemyReady = true;
      }
    });
  });

  startButton.addEventListener("click", () => {
    if (!allShipsPlaced) return;
    if (allShipsPlaced) startGameMulti(socket);
    else infoDisplay.innerHTML = "place all of your ships first!";
    // const boardBlocks = document.querySelectorAll("#computer div");
  });

  // event listener for firing

  const boardBlocks = document.querySelectorAll("#computer div");
  socket.on("turn-change", (turn) => {
    turnNum = turn;
    if (turnNum === playerNum) turnDisplay.innerHTML = "your turn";
    else turnDisplay.innerHTML = "enemy's turn";
  });
  socket.on("gameover", (status) => {
    gameOver = status;
    if (gameOver) {
      turnDisplay.textContent = "la oyun bitti";
      if (playerSunkShips.length !== 5) infoDisplay.innerHTML = "you lost";
    }
  });
  console.log(`${turnNum} ${playerNum} outside`);
  boardBlocks.forEach((block) => {
    block.addEventListener("click", (e) => {
      if (turnNum === playerNum) {
        if (gameOver) return;
        shotFired = handleClick(e);
        // if hit return causes shotFired to be null and inclues doesn't work
        // but at least you can get the block class, or ish
        // no you can't, something wrong with block indexes
        // if (tmpBoardData[shotFired].includes("filled")) {
        //   console.log("that's a hit!");
        // }
        console.log(tmpBoardData[shotFired]);
        turnNum = (turnNum + 1) % 2;

        console.log(turnNum, playerNum);
        socket.emit("turn-change", turnNum);
        socket.emit("fire", shotFired, turnNum);
        socket.emit("gameover", gameOver);
      } else turnDisplay.innerHTML = "not your turn";

      // handleTurn();
    });
  });

  // socket.on("fire", (id, turn) => {
  //   turnNum = turn;
  //   // shotFired = id;
  //   console.log(`${turnNum} turn num`);
  // });
  // socket.on("turnChange", (turn) => {
  //   console.log(`${turnNum} turn num`);
  //   turnNum = turn;
  // });

  socket.on("start-game", (player1BoardData, player2BoardData) => {
    const opponentBoardBlocks = document.querySelectorAll("#computer div");

    for (let i = 0; i < opponentBoardBlocks.length; i += 1) {
      const dataIndex = i;
      opponentBoardBlocks[i].className =
        playerNum === 0
          ? player2BoardData[dataIndex]
          : player1BoardData[dataIndex];
    }
  });

  // receiving fire

  function controlPlayerConnection(num) {
    const player = `.p${parseInt(num) + 1}`;
    document
      .querySelector(`${player} .connected span`)
      .classList.toggle("green");
    if (parseInt(num) === playerNum)
      document.querySelector(player).style.fontWeight = "bold";
  }
}

multiplayerButton.addEventListener("click", startMultiplayer);

// start multiplayer game
function startGameMulti(socket) {
  if (gameOver) return;
  console.log(currentPlayer);
  if (!ready) {
    socket.emit("player-ready");
    ready = true;
    playerReady(playerNum);
  }

  if (enemyReady) {
    if (currentPlayer === "player") {
      turnDisplay.innerHTML = "your turn";
    }
    if (currentPlayer === "enemy") {
      turnDisplay.innerHTML = "enemy's turn";
    }

    const playerBoardData = Array.from(
      document.querySelectorAll("#player div")
    ).map((block) => block.className);
    socket.emit("board-data", playerBoardData);
    tmpBoardData = playerBoardData;
  }
}
function handleGameover() {
  // check for current player sunk ship list and
  // if it's 5, then current player won
  // if not, enemy won
  if (playerSunkShips.length === 5) infoDisplay.innerHTML = "you won";
  else infoDisplay.innerHTML = "you lost";
}

function playerReady(num) {
  const player = `.p${parseInt(num) + 1}`;
  document.querySelector(`${player} .ready span`).classList.toggle("green");
}

// start single player game
function startSinglePlayer() {
  if (gameOver) return;
  if (singlePlayerStarted === true) return;
  singlePlayerStarted = true;
  gameMode = "singleplayer";
  user = "computer";
  ships.forEach((ship) => addShip("computer", ship));
  startButton.addEventListener("click", startGameSingle);
}
singlePlayerButton.addEventListener("click", startSinglePlayer);

let angle = 0;
function flipShips() {
  const ships = Array.from(shipContainer.children);
  angle = angle === 0 ? 90 : 0;
  ships.forEach((ship) => {
    // eslint-disable-next-line no-param-reassign
    ship.style.transform = `rotate(${angle}deg)`;
  });
}
flipButton.addEventListener("click", flipShips);

// CREATING GAMEBOARD
function createBoard(color, user) {
  const gameBoardContainer = document.getElementById("gameboard-container");

  const gameBoard = document.createElement("div");
  gameBoard.setAttribute("id", user);
  gameBoard.classList.add("gameboard");
  gameBoard.style.backgroundColor = color;

  for (let i = 0; i < 100; i += 1) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.id = i;
    gameBoard.append(block);
  }

  gameBoardContainer.appendChild(gameBoard);
}

createBoard("white", user);
createBoard("gainsboro", "computer");

// console.log(ships);

function checkValidity(boardBlocks, isHorizontal, startIndex, ship) {
  // to prevent placing ships off board
  // eslint-disable-next-line no-nested-ternary
  const validStart = isHorizontal
    ? startIndex <= 10 * 10 - ship.length
      ? startIndex
      : 10 * 10 - ship.length
    : startIndex <= 10 * 10 - 10 * ship.length
    ? startIndex
    : startIndex - ship.length * 10 + 10;
  //   console.log(`validated i ${validStart}`);

  const shipBlocks = [];
  // save the indexes of ships to an array
  for (let i = 0; i < ship.length; i += 1) {
    if (isHorizontal) shipBlocks.push(boardBlocks[Number(validStart) + i]);
    else shipBlocks.push(boardBlocks[Number(validStart) + i * 10]);
  }

  // validate place to prevent ships from splitting
  let isValid;
  if (isHorizontal) {
    shipBlocks.every(
      // eslint-disable-next-line no-return-assign
      (_block, index) =>
        (isValid =
          shipBlocks[0].id % 10 !== 10 - (shipBlocks.length - (index + 1)))
    );
  } else {
    shipBlocks.every(
      // eslint-disable-next-line no-return-assign
      (_block, index) => (isValid = shipBlocks[0].id < 90 + (10 * index + 1))
    );
  }
  // console.log(`is valid? ${isValid}`);
  const notTaken = shipBlocks.every(
    (block) =>
      !block.classList.contains("filled") &&
      !block.classList.contains("unavailable")
  );

  return { shipBlocks, isValid, notTaken };
}

function addShip(user, ship, startId) {
  console.log("addship");
  //   console.log(user);
  const boardBlocks = document.querySelectorAll(`#${user} div`);
  const bool = Math.random() < 0.5; // returned number either will be bigger than 0.5 or not hence the random bool
  const isHorizontal = user === "player" ? angle === 0 : bool;
  const randomStartIndex = Math.floor(Math.random() * 10 * 10); // ten times ten is the width of the board
  //   console.log(`horizontal ${isHorizontal}`);
  //   console.log(`random index ${randomStartIndex}`);

  const startIndex = startId || randomStartIndex;
  //   console.log(`start index ${startIndex}`);

  const { shipBlocks, isValid, notTaken } = checkValidity(
    boardBlocks,
    isHorizontal,
    startIndex,
    ship
  );

  // console.log(`not taken? ${notTaken}`);
  if (isValid && notTaken) {
    shipBlocks.forEach((block) => {
      block.classList.add(ship.name);
      block.classList.add("filled");
    });
    // add filled class to adjacent blocks to prevent placing ships side to side
    const adjacentIndexes = getAdjacentIndexes(
      boardBlocks,
      isHorizontal,
      shipBlocks
    );
    adjacentIndexes.forEach((adjacentIndex) => {
      const adjacentBlock = boardBlocks[adjacentIndex];
      adjacentBlock.classList.add("unavailable");
    });
    // console.log(adjacentIndexes);
  } else {
    if (user === "computer") addShip(user, ship, startId);
    if (user === "player") notDropped = true;
  }
}

// helper function to get adjacent indexes
function getAdjacentIndexes(boardBlocks, isHorizontal, shipBlocks) {
  const boardBlocksArray = [...boardBlocks];
  const adjacentIndexes = [];

  shipBlocks.forEach((block, index) => {
    const blockIndex = boardBlocksArray.indexOf(block);
    const row = Math.floor(blockIndex / 10);
    const col = blockIndex % 10;

    if (isHorizontal) {
      if (col > 0) adjacentIndexes.push(blockIndex - 1); // left block
      if (col < 9) adjacentIndexes.push(blockIndex + 1); // right block
      if (row > 0) adjacentIndexes.push(blockIndex - 10); // top block
      if (row < 9) adjacentIndexes.push(blockIndex + 10); // bottom block
      if (col > 0 && row > 0) adjacentIndexes.push(blockIndex - 11); // top-left block
      if (col > 0 && row < 9) adjacentIndexes.push(blockIndex + 9); // bottom-left block
      if (col < 9 && row > 0) adjacentIndexes.push(blockIndex - 9); // top-right block
      if (col < 9 && row < 9) adjacentIndexes.push(blockIndex + 11); // bottom-right block
    } else {
      if (row > 0) adjacentIndexes.push(blockIndex - 10); // top block
      if (row < 9) adjacentIndexes.push(blockIndex + 10); // bottom block
      if (col > 0) adjacentIndexes.push(blockIndex - 1); // left block
      if (col < 9) adjacentIndexes.push(blockIndex + 1); // right block
      if (row > 0 && col > 0) adjacentIndexes.push(blockIndex - 11); // top-left block
      if (row > 0 && col < 9) adjacentIndexes.push(blockIndex - 9); // top-right block
      if (row < 9 && col > 0) adjacentIndexes.push(blockIndex + 9); // bottom-left block
      if (row < 9 && col < 9) adjacentIndexes.push(blockIndex + 11); // bottom-right block
    }
  });

  const uniqueAdjacentIndexes = Array.from(new Set(adjacentIndexes));

  return uniqueAdjacentIndexes;
}

// DRAG&DROP PLAYER SHIPS
let draggedShip;
const shipOptions = Array.from(shipContainer.children);
shipOptions.forEach((ship) => ship.addEventListener("dragstart", dragStart));

const playerBoard = document.querySelectorAll("#player div");
playerBoard.forEach((block) => {
  block.addEventListener("dragover", dragOver);
  block.addEventListener("drop", dropShip);
});

function dragStart(e) {
  notDropped = false;
  draggedShip = e.target;
  console.log("drag started");
}

function dragOver(e) {
  // console.log("dragover");
  // console.log(e.target.parentNode);
  e.preventDefault();

  if (!draggedShip) return;
  const ship = ships[draggedShip.id];

  highlightShipArea(e.target.id, ship);
}

function dropShip(e) {
  console.log("dropship");
  const startId = e.target.id;
  if (draggedShip === undefined || draggedShip === null) return;
  const ship = ships[draggedShip.id];
  // console.log(ship, "this is ship");

  addShip("player", ship, startId);
  if (!notDropped) draggedShip.remove();
  if (!shipContainer.querySelector(".ship")) allShipsPlaced = true;
  draggedShip = null;
}

function highlightShipArea(startIndex, ship) {
  const isHorizontal = angle === 0;

  const { shipBlocks, isValid, notTaken } = checkValidity(
    playerBoard,
    isHorizontal,
    startIndex,
    ship
  );

  if (isValid && notTaken) {
    shipBlocks.forEach((block) => {
      block.classList.add("hover");
      setTimeout(() => block.classList.remove("hover"), 500);
    });
  }
}

// GAME LOGIC

let playerTurn;

// start the game

function startGameSingle() {
  if (playerTurn === undefined) {
    if (shipContainer.children.length !== 0) {
      infoDisplay.textContent = "Please place all your ships first!";
    } else {
      const boardBlocks = document.querySelectorAll("#computer div");
      boardBlocks.forEach((block) =>
        block.addEventListener("click", handleClick)
      );
      playerTurn = true;
      turnDisplay.textContent = "Your turn!";
      infoDisplay.textContent = "The battle has begun!";
    }
  }
}

function handleClick(e) {
  console.log(`current player: ${currentPlayer}`);
  console.log(`current turn: ${turnNum}`);
  // current turn is not getting updated after player 0 takes it shot

  if (!gameOver) {
    if (e.target.classList.contains("hit")) return; // do this better
    if (e.target.classList.contains("filled")) {
      e.target.classList.add("hit");
      infoDisplay.textContent = "You hit the enemy ship!";
      const classes = Array.from(e.target.classList).filter(
        (name) => !["block", "hit", "filled", "unavailable"].includes(name)
      );
      // may need to use currentPlayer for events
      if (
        currentPlayer === "player" ||
        currentPlayer === "enemy" ||
        gameMode === "singleplayer"
      ) {
        playerHits.push(...classes);
        checkScore(currentPlayer, playerHits, playerSunkShips);
      }

      // if (currentPlayer === "enemy") {
      //   enemyHits.push(...classes);
      //   checkScore(currentPlayer, enemyHits, enemySunkShips);
      // }
    }
    if (!e.target.classList.contains("filled")) {
      infoDisplay.textContent = "Miss!";
      e.target.classList.add("miss");
    }

    // const boardBlocks = document.querySelectorAll("#computer div");
    // boardBlocks.forEach(
    //   (block) => block.replaceWith(block.cloneNode(true)) // to remove event listeners
    // );

    // handleEventListeners();
    // if gamemode is single, do these?
    if (gameMode === "singleplayer" && !gameOver) {
      playerTurn = false;

      setTimeout(computersTurn, 100);
    }
  }
  return e.target.id; // use this to communicate with server?
}

// computers turn
function computersTurn() {
  if (!gameOver) {
    turnDisplay.textContent = "Computers Turn";
    infoDisplay.textContent = "Making calculations..";

    setTimeout(() => {
      const randomShot = Math.floor(Math.random() * 10 * 10);
      if (
        playerBoard[randomShot].classList.contains("filled") &&
        playerBoard[randomShot].classList.contains("hit") &&
        playerBoard[randomShot].classList.contains("miss")
      ) {
        computersTurn();
      } else if (
        playerBoard[randomShot].classList.contains("filled") &&
        !playerBoard[randomShot].classList.contains("hit")
      ) {
        playerBoard[randomShot].classList.add("hit");
        infoDisplay.textContent = "Hit the target!";
        const classes = Array.from(playerBoard[randomShot].classList).filter(
          (name) => !["block", "hit", "filled"].includes(name)
        );
        computerHits.push(...classes);
        checkScore("computer", computerHits, computerSunkShips);
      } else {
        infoDisplay.textContent = "Miss!";
        playerBoard[randomShot].classList.add("miss");
      }
    }, 500);
    const boardBlocks = document.querySelectorAll("#computer div");
    boardBlocks.forEach(
      (block) => block.replaceWith(block.cloneNode(true)) // to remove event listeners
    );
    handleEventListeners();
    setTimeout(() => {
      playerTurn = true;
      turnDisplay.textContent = "Player's turn";
      infoDisplay.textContent = "Take your shot!";

      // re-adding event listeners
    }, 500);
  }
}
function handleEventListeners() {
  const boardBlocks = document.querySelectorAll("#computer div");
  boardBlocks.forEach((block) => block.addEventListener("click", handleClick)); // re-adding event listeners
}

function checkScore(user, userHits, userSunkShips) {
  function checkShip(shipName, shipLength) {
    if (
      userHits.filter((hitShip) => hitShip === shipName).length === shipLength
    ) {
      if (
        user === "player" ||
        user === "enemy" ||
        gameMode === "singleplayer"
      ) {
        infoDisplay.textContent = `You sunk the enemy ${shipName}!`;

        playerHits = userHits.filter((hitShip) => hitShip !== shipName);
      }
      // if (user === "enemy") {
      //   enemyHits = userHits.filter((hitShip) => hitShip !== shipName);
      // }
      if (user === "computer") {
        infoDisplay.textContent = `The enemy sunk your ${shipName}!`;
        computerHits = userHits.filter((hitShip) => hitShip !== shipName);
      }
      userSunkShips.push(shipName);
    }
  }
  checkShip("destroyer", 2);
  checkShip("submarine", 3);
  checkShip("cruiser", 3);
  checkShip("battleship", 4);
  checkShip("carrier", 5);
  console.log("playerHits", playerHits);
  console.log("playerSunkShips", playerSunkShips);

  if (playerSunkShips.length === 5) {
    infoDisplay.textContent =
      "You sunk all the enemy ships! Well fought admiral!"; // game over player 1 won
    gameOver = true;
    if (gameMode === "singleplayer")
      startButton.removeEventListener("click", startGameSingle);
  }
  if (enemySunkShips.lenght === 5) {
    infoDisplay.textContent =
      "You sunk all the enemy ships! Well fought admiral!"; // game over player 1 won
    gameOver = true;
  }
  if (computerSunkShips.length === 5) {
    infoDisplay.textContent =
      "Your fleet has been destroyed! Well fought admiral, we'll get them next time.";
    gameOver = true;
    startButton.removeEventListener("click", startGameSingle);
  }
}

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RCxTQUFTO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDREQUE0RDtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBNEQ7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1wcm9qZWN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIG11bHRpLXNpbmdsZSBwbGF5ZXIgY29udHJvbHNcclxuY29uc3Qgc2luZ2xlUGxheWVyQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaW5nbGUtcGxheWVyLWJ1dHRvblwiKTtcclxuY29uc3QgbXVsdGlwbGF5ZXJCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm11bHRpcGxheWVyLWJ1dHRvblwiKTtcclxuLy8gc3RhcnQgdGhlIGdhbWVcclxuY29uc3Qgc3RhcnRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0YXJ0LWJ1dHRvblwiKTtcclxuY29uc3QgaW5mb0Rpc3BsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluZm8tZGlzcGxheVwiKTtcclxuY29uc3QgdHVybkRpc3BsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR1cm4tZGlzcGxheVwiKTtcclxuXHJcbmxldCB0bXBCb2FyZERhdGEgPSBbXTtcclxuXHJcbmxldCBwbGF5ZXJIaXRzID0gW107XHJcbi8vIGxldCBlbmVteUhpdHMgPSBbXTtcclxubGV0IGNvbXB1dGVySGl0cyA9IFtdO1xyXG5jb25zdCBwbGF5ZXJTdW5rU2hpcHMgPSBbXTtcclxuY29uc3QgZW5lbXlTdW5rU2hpcHMgPSBbXTtcclxuY29uc3QgY29tcHV0ZXJTdW5rU2hpcHMgPSBbXTtcclxuXHJcbi8vIENSRUFUSU5HIFNISVBTXHJcbmNsYXNzIFNoaXAge1xyXG4gIGNvbnN0cnVjdG9yKG5hbWUsIGxlbmd0aCkge1xyXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgZGVzdHJveWVyID0gbmV3IFNoaXAoXCJkZXN0cm95ZXJcIiwgMik7XHJcbmNvbnN0IHN1Ym1hcmluZSA9IG5ldyBTaGlwKFwic3VibWFyaW5lXCIsIDMpO1xyXG5jb25zdCBjcnVpc2VyID0gbmV3IFNoaXAoXCJjcnVpc2VyXCIsIDMpO1xyXG5jb25zdCBiYXR0bGVzaGlwID0gbmV3IFNoaXAoXCJiYXR0bGVzaGlwXCIsIDQpO1xyXG5jb25zdCBjYXJyaWVyID0gbmV3IFNoaXAoXCJjYXJyaWVyXCIsIDUpO1xyXG5cclxuY29uc3Qgc2hpcHMgPSBbZGVzdHJveWVyLCBzdWJtYXJpbmUsIGNydWlzZXIsIGJhdHRsZXNoaXAsIGNhcnJpZXJdO1xyXG5cclxuY29uc3QgZmxpcEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmxpcC1idXR0b25cIik7XHJcbmNvbnN0IHNoaXBDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNoaXAtc2VsZWN0LWNvbnRhaW5lclwiKTtcclxubGV0IHVzZXIgPSBcInBsYXllclwiO1xyXG5sZXQgY3VycmVudFBsYXllciA9IHVzZXI7XHJcbmxldCBnYW1lTW9kZSA9IFwiXCI7XHJcbmxldCBwbGF5ZXJOdW0gPSAwO1xyXG5sZXQgdHVybk51bSA9IDA7XHJcbmxldCByZWFkeSA9IGZhbHNlO1xyXG5sZXQgZ2FtZU92ZXIgPSBmYWxzZTtcclxubGV0IGVuZW15UmVhZHkgPSBmYWxzZTtcclxubGV0IGFsbFNoaXBzUGxhY2VkID0gZmFsc2U7XHJcbmxldCBzaG90RmlyZWQgPSAtMTtcclxubGV0IG5vdERyb3BwZWQ7XHJcbmxldCBzaW5nbGVQbGF5ZXJTdGFydGVkO1xyXG5sZXQgbXVsdGlQbGF5ZXJTdGFydGVkO1xyXG5cclxuZnVuY3Rpb24gc3RhcnRNdWx0aXBsYXllcigpIHtcclxuICBpZiAobXVsdGlQbGF5ZXJTdGFydGVkKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcImRvbnRcIik7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIG11bHRpUGxheWVyU3RhcnRlZCA9IHRydWU7XHJcbiAgZ2FtZU1vZGUgPSBcIm11bHRpcGxheWVyXCI7XHJcblxyXG4gIGNvbnN0IHNvY2tldCA9IGlvKCk7XHJcblxyXG4gIC8vIGdldCBwbGF5ZXIgbnVtYmVyXHJcblxyXG4gIHNvY2tldC5vbihcInBsYXllci1udW1iZXJcIiwgKG51bSkgPT4ge1xyXG4gICAgaWYgKG51bSA9PT0gLTEpIHtcclxuICAgICAgaW5mb0Rpc3BsYXkuaW5uZXJIVE1MID0gXCJzZXJ2ZXIgaXMgZnVsbFwiO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcGxheWVyTnVtID0gcGFyc2VJbnQobnVtKTtcclxuICAgICAgaWYgKHBsYXllck51bSA9PT0gMSkgY3VycmVudFBsYXllciA9IFwiZW5lbXlcIjtcclxuICAgICAgY29uc29sZS5sb2cocGxheWVyTnVtKTtcclxuXHJcbiAgICAgIHNvY2tldC5lbWl0KFwiY2hlY2stcGxheWVyc1wiKTtcclxuICAgIH1cclxuICB9KTtcclxuICAvLyBwbGF5ZXIgY29ubmVjdGlvbiBjb250cm9sXHJcbiAgc29ja2V0Lm9uKFwicGxheWVyLWNvbm5lY3Rpb25cIiwgKG51bSkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coYHBsYXllciAke251bX0gaGFzIGNvbm5lY3RlZGApO1xyXG4gICAgY29udHJvbFBsYXllckNvbm5lY3Rpb24obnVtKTtcclxuICB9KTtcclxuXHJcbiAgLy8gZW5lbXkgcmVhZHlcclxuICBzb2NrZXQub24oXCJlbmVteS1yZWFkeVwiLCAobnVtKSA9PiB7XHJcbiAgICBlbmVteVJlYWR5ID0gdHJ1ZTtcclxuICAgIHBsYXllclJlYWR5KG51bSk7XHJcbiAgICBpZiAocmVhZHkpIHN0YXJ0R2FtZU11bHRpKHNvY2tldCk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIGNoZWNrIHBsYXllciBzdGF0dXNcclxuICBzb2NrZXQub24oXCJjaGVjay1wbGF5ZXJzXCIsIChwbGF5ZXJzKSA9PiB7XHJcbiAgICBwbGF5ZXJzLmZvckVhY2goKHBsYXllciwgaW5kZXgpID0+IHtcclxuICAgICAgaWYgKHBsYXllci5jb25uZWN0ZWQpIGNvbnRyb2xQbGF5ZXJDb25uZWN0aW9uKGluZGV4KTtcclxuICAgICAgaWYgKHBsYXllci5yZWFkeSkge1xyXG4gICAgICAgIHBsYXllclJlYWR5KGluZGV4KTtcclxuICAgICAgICBpZiAoaW5kZXggIT09IHBsYXllck51bSkgZW5lbXlSZWFkeSA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBzdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgaWYgKCFhbGxTaGlwc1BsYWNlZCkgcmV0dXJuO1xyXG4gICAgaWYgKGFsbFNoaXBzUGxhY2VkKSBzdGFydEdhbWVNdWx0aShzb2NrZXQpO1xyXG4gICAgZWxzZSBpbmZvRGlzcGxheS5pbm5lckhUTUwgPSBcInBsYWNlIGFsbCBvZiB5b3VyIHNoaXBzIGZpcnN0IVwiO1xyXG4gICAgLy8gY29uc3QgYm9hcmRCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI2NvbXB1dGVyIGRpdlwiKTtcclxuICB9KTtcclxuXHJcbiAgLy8gZXZlbnQgbGlzdGVuZXIgZm9yIGZpcmluZ1xyXG5cclxuICBjb25zdCBib2FyZEJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjY29tcHV0ZXIgZGl2XCIpO1xyXG4gIHNvY2tldC5vbihcInR1cm4tY2hhbmdlXCIsICh0dXJuKSA9PiB7XHJcbiAgICB0dXJuTnVtID0gdHVybjtcclxuICAgIGlmICh0dXJuTnVtID09PSBwbGF5ZXJOdW0pIHR1cm5EaXNwbGF5LmlubmVySFRNTCA9IFwieW91ciB0dXJuXCI7XHJcbiAgICBlbHNlIHR1cm5EaXNwbGF5LmlubmVySFRNTCA9IFwiZW5lbXkncyB0dXJuXCI7XHJcbiAgfSk7XHJcbiAgc29ja2V0Lm9uKFwiZ2FtZW92ZXJcIiwgKHN0YXR1cykgPT4ge1xyXG4gICAgZ2FtZU92ZXIgPSBzdGF0dXM7XHJcbiAgICBpZiAoZ2FtZU92ZXIpIHtcclxuICAgICAgdHVybkRpc3BsYXkudGV4dENvbnRlbnQgPSBcImxhIG95dW4gYml0dGlcIjtcclxuICAgICAgaWYgKHBsYXllclN1bmtTaGlwcy5sZW5ndGggIT09IDUpIGluZm9EaXNwbGF5LmlubmVySFRNTCA9IFwieW91IGxvc3RcIjtcclxuICAgIH1cclxuICB9KTtcclxuICBjb25zb2xlLmxvZyhgJHt0dXJuTnVtfSAke3BsYXllck51bX0gb3V0c2lkZWApO1xyXG4gIGJvYXJkQmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PiB7XHJcbiAgICBibG9jay5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgICAgaWYgKHR1cm5OdW0gPT09IHBsYXllck51bSkge1xyXG4gICAgICAgIGlmIChnYW1lT3ZlcikgcmV0dXJuO1xyXG4gICAgICAgIHNob3RGaXJlZCA9IGhhbmRsZUNsaWNrKGUpO1xyXG4gICAgICAgIC8vIGlmIGhpdCByZXR1cm4gY2F1c2VzIHNob3RGaXJlZCB0byBiZSBudWxsIGFuZCBpbmNsdWVzIGRvZXNuJ3Qgd29ya1xyXG4gICAgICAgIC8vIGJ1dCBhdCBsZWFzdCB5b3UgY2FuIGdldCB0aGUgYmxvY2sgY2xhc3MsIG9yIGlzaFxyXG4gICAgICAgIC8vIG5vIHlvdSBjYW4ndCwgc29tZXRoaW5nIHdyb25nIHdpdGggYmxvY2sgaW5kZXhlc1xyXG4gICAgICAgIC8vIGlmICh0bXBCb2FyZERhdGFbc2hvdEZpcmVkXS5pbmNsdWRlcyhcImZpbGxlZFwiKSkge1xyXG4gICAgICAgIC8vICAgY29uc29sZS5sb2coXCJ0aGF0J3MgYSBoaXQhXCIpO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBjb25zb2xlLmxvZyh0bXBCb2FyZERhdGFbc2hvdEZpcmVkXSk7XHJcbiAgICAgICAgdHVybk51bSA9ICh0dXJuTnVtICsgMSkgJSAyO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyh0dXJuTnVtLCBwbGF5ZXJOdW0pO1xyXG4gICAgICAgIHNvY2tldC5lbWl0KFwidHVybi1jaGFuZ2VcIiwgdHVybk51bSk7XHJcbiAgICAgICAgc29ja2V0LmVtaXQoXCJmaXJlXCIsIHNob3RGaXJlZCwgdHVybk51bSk7XHJcbiAgICAgICAgc29ja2V0LmVtaXQoXCJnYW1lb3ZlclwiLCBnYW1lT3Zlcik7XHJcbiAgICAgIH0gZWxzZSB0dXJuRGlzcGxheS5pbm5lckhUTUwgPSBcIm5vdCB5b3VyIHR1cm5cIjtcclxuXHJcbiAgICAgIC8vIGhhbmRsZVR1cm4oKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICAvLyBzb2NrZXQub24oXCJmaXJlXCIsIChpZCwgdHVybikgPT4ge1xyXG4gIC8vICAgdHVybk51bSA9IHR1cm47XHJcbiAgLy8gICAvLyBzaG90RmlyZWQgPSBpZDtcclxuICAvLyAgIGNvbnNvbGUubG9nKGAke3R1cm5OdW19IHR1cm4gbnVtYCk7XHJcbiAgLy8gfSk7XHJcbiAgLy8gc29ja2V0Lm9uKFwidHVybkNoYW5nZVwiLCAodHVybikgPT4ge1xyXG4gIC8vICAgY29uc29sZS5sb2coYCR7dHVybk51bX0gdHVybiBudW1gKTtcclxuICAvLyAgIHR1cm5OdW0gPSB0dXJuO1xyXG4gIC8vIH0pO1xyXG5cclxuICBzb2NrZXQub24oXCJzdGFydC1nYW1lXCIsIChwbGF5ZXIxQm9hcmREYXRhLCBwbGF5ZXIyQm9hcmREYXRhKSA9PiB7XHJcbiAgICBjb25zdCBvcHBvbmVudEJvYXJkQmxvY2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNjb21wdXRlciBkaXZcIik7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHBvbmVudEJvYXJkQmxvY2tzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIGNvbnN0IGRhdGFJbmRleCA9IGk7XHJcbiAgICAgIG9wcG9uZW50Qm9hcmRCbG9ja3NbaV0uY2xhc3NOYW1lID1cclxuICAgICAgICBwbGF5ZXJOdW0gPT09IDBcclxuICAgICAgICAgID8gcGxheWVyMkJvYXJkRGF0YVtkYXRhSW5kZXhdXHJcbiAgICAgICAgICA6IHBsYXllcjFCb2FyZERhdGFbZGF0YUluZGV4XTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgLy8gcmVjZWl2aW5nIGZpcmVcclxuXHJcbiAgZnVuY3Rpb24gY29udHJvbFBsYXllckNvbm5lY3Rpb24obnVtKSB7XHJcbiAgICBjb25zdCBwbGF5ZXIgPSBgLnAke3BhcnNlSW50KG51bSkgKyAxfWA7XHJcbiAgICBkb2N1bWVudFxyXG4gICAgICAucXVlcnlTZWxlY3RvcihgJHtwbGF5ZXJ9IC5jb25uZWN0ZWQgc3BhbmApXHJcbiAgICAgIC5jbGFzc0xpc3QudG9nZ2xlKFwiZ3JlZW5cIik7XHJcbiAgICBpZiAocGFyc2VJbnQobnVtKSA9PT0gcGxheWVyTnVtKVxyXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHBsYXllcikuc3R5bGUuZm9udFdlaWdodCA9IFwiYm9sZFwiO1xyXG4gIH1cclxufVxyXG5cclxubXVsdGlwbGF5ZXJCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN0YXJ0TXVsdGlwbGF5ZXIpO1xyXG5cclxuLy8gc3RhcnQgbXVsdGlwbGF5ZXIgZ2FtZVxyXG5mdW5jdGlvbiBzdGFydEdhbWVNdWx0aShzb2NrZXQpIHtcclxuICBpZiAoZ2FtZU92ZXIpIHJldHVybjtcclxuICBjb25zb2xlLmxvZyhjdXJyZW50UGxheWVyKTtcclxuICBpZiAoIXJlYWR5KSB7XHJcbiAgICBzb2NrZXQuZW1pdChcInBsYXllci1yZWFkeVwiKTtcclxuICAgIHJlYWR5ID0gdHJ1ZTtcclxuICAgIHBsYXllclJlYWR5KHBsYXllck51bSk7XHJcbiAgfVxyXG5cclxuICBpZiAoZW5lbXlSZWFkeSkge1xyXG4gICAgaWYgKGN1cnJlbnRQbGF5ZXIgPT09IFwicGxheWVyXCIpIHtcclxuICAgICAgdHVybkRpc3BsYXkuaW5uZXJIVE1MID0gXCJ5b3VyIHR1cm5cIjtcclxuICAgIH1cclxuICAgIGlmIChjdXJyZW50UGxheWVyID09PSBcImVuZW15XCIpIHtcclxuICAgICAgdHVybkRpc3BsYXkuaW5uZXJIVE1MID0gXCJlbmVteSdzIHR1cm5cIjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBwbGF5ZXJCb2FyZERhdGEgPSBBcnJheS5mcm9tKFxyXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI3BsYXllciBkaXZcIilcclxuICAgICkubWFwKChibG9jaykgPT4gYmxvY2suY2xhc3NOYW1lKTtcclxuICAgIHNvY2tldC5lbWl0KFwiYm9hcmQtZGF0YVwiLCBwbGF5ZXJCb2FyZERhdGEpO1xyXG4gICAgdG1wQm9hcmREYXRhID0gcGxheWVyQm9hcmREYXRhO1xyXG4gIH1cclxufVxyXG5mdW5jdGlvbiBoYW5kbGVHYW1lb3ZlcigpIHtcclxuICAvLyBjaGVjayBmb3IgY3VycmVudCBwbGF5ZXIgc3VuayBzaGlwIGxpc3QgYW5kXHJcbiAgLy8gaWYgaXQncyA1LCB0aGVuIGN1cnJlbnQgcGxheWVyIHdvblxyXG4gIC8vIGlmIG5vdCwgZW5lbXkgd29uXHJcbiAgaWYgKHBsYXllclN1bmtTaGlwcy5sZW5ndGggPT09IDUpIGluZm9EaXNwbGF5LmlubmVySFRNTCA9IFwieW91IHdvblwiO1xyXG4gIGVsc2UgaW5mb0Rpc3BsYXkuaW5uZXJIVE1MID0gXCJ5b3UgbG9zdFwiO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwbGF5ZXJSZWFkeShudW0pIHtcclxuICBjb25zdCBwbGF5ZXIgPSBgLnAke3BhcnNlSW50KG51bSkgKyAxfWA7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgJHtwbGF5ZXJ9IC5yZWFkeSBzcGFuYCkuY2xhc3NMaXN0LnRvZ2dsZShcImdyZWVuXCIpO1xyXG59XHJcblxyXG4vLyBzdGFydCBzaW5nbGUgcGxheWVyIGdhbWVcclxuZnVuY3Rpb24gc3RhcnRTaW5nbGVQbGF5ZXIoKSB7XHJcbiAgaWYgKGdhbWVPdmVyKSByZXR1cm47XHJcbiAgaWYgKHNpbmdsZVBsYXllclN0YXJ0ZWQgPT09IHRydWUpIHJldHVybjtcclxuICBzaW5nbGVQbGF5ZXJTdGFydGVkID0gdHJ1ZTtcclxuICBnYW1lTW9kZSA9IFwic2luZ2xlcGxheWVyXCI7XHJcbiAgdXNlciA9IFwiY29tcHV0ZXJcIjtcclxuICBzaGlwcy5mb3JFYWNoKChzaGlwKSA9PiBhZGRTaGlwKFwiY29tcHV0ZXJcIiwgc2hpcCkpO1xyXG4gIHN0YXJ0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzdGFydEdhbWVTaW5nbGUpO1xyXG59XHJcbnNpbmdsZVBsYXllckJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RhcnRTaW5nbGVQbGF5ZXIpO1xyXG5cclxubGV0IGFuZ2xlID0gMDtcclxuZnVuY3Rpb24gZmxpcFNoaXBzKCkge1xyXG4gIGNvbnN0IHNoaXBzID0gQXJyYXkuZnJvbShzaGlwQ29udGFpbmVyLmNoaWxkcmVuKTtcclxuICBhbmdsZSA9IGFuZ2xlID09PSAwID8gOTAgOiAwO1xyXG4gIHNoaXBzLmZvckVhY2goKHNoaXApID0+IHtcclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxyXG4gICAgc2hpcC5zdHlsZS50cmFuc2Zvcm0gPSBgcm90YXRlKCR7YW5nbGV9ZGVnKWA7XHJcbiAgfSk7XHJcbn1cclxuZmxpcEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZmxpcFNoaXBzKTtcclxuXHJcbi8vIENSRUFUSU5HIEdBTUVCT0FSRFxyXG5mdW5jdGlvbiBjcmVhdGVCb2FyZChjb2xvciwgdXNlcikge1xyXG4gIGNvbnN0IGdhbWVCb2FyZENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZWJvYXJkLWNvbnRhaW5lclwiKTtcclxuXHJcbiAgY29uc3QgZ2FtZUJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICBnYW1lQm9hcmQuc2V0QXR0cmlidXRlKFwiaWRcIiwgdXNlcik7XHJcbiAgZ2FtZUJvYXJkLmNsYXNzTGlzdC5hZGQoXCJnYW1lYm9hcmRcIik7XHJcbiAgZ2FtZUJvYXJkLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xyXG5cclxuICBmb3IgKGxldCBpID0gMDsgaSA8IDEwMDsgaSArPSAxKSB7XHJcbiAgICBjb25zdCBibG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBibG9jay5jbGFzc0xpc3QuYWRkKFwiYmxvY2tcIik7XHJcbiAgICBibG9jay5pZCA9IGk7XHJcbiAgICBnYW1lQm9hcmQuYXBwZW5kKGJsb2NrKTtcclxuICB9XHJcblxyXG4gIGdhbWVCb2FyZENvbnRhaW5lci5hcHBlbmRDaGlsZChnYW1lQm9hcmQpO1xyXG59XHJcblxyXG5jcmVhdGVCb2FyZChcIndoaXRlXCIsIHVzZXIpO1xyXG5jcmVhdGVCb2FyZChcImdhaW5zYm9yb1wiLCBcImNvbXB1dGVyXCIpO1xyXG5cclxuLy8gY29uc29sZS5sb2coc2hpcHMpO1xyXG5cclxuZnVuY3Rpb24gY2hlY2tWYWxpZGl0eShib2FyZEJsb2NrcywgaXNIb3Jpem9udGFsLCBzdGFydEluZGV4LCBzaGlwKSB7XHJcbiAgLy8gdG8gcHJldmVudCBwbGFjaW5nIHNoaXBzIG9mZiBib2FyZFxyXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXN0ZWQtdGVybmFyeVxyXG4gIGNvbnN0IHZhbGlkU3RhcnQgPSBpc0hvcml6b250YWxcclxuICAgID8gc3RhcnRJbmRleCA8PSAxMCAqIDEwIC0gc2hpcC5sZW5ndGhcclxuICAgICAgPyBzdGFydEluZGV4XHJcbiAgICAgIDogMTAgKiAxMCAtIHNoaXAubGVuZ3RoXHJcbiAgICA6IHN0YXJ0SW5kZXggPD0gMTAgKiAxMCAtIDEwICogc2hpcC5sZW5ndGhcclxuICAgID8gc3RhcnRJbmRleFxyXG4gICAgOiBzdGFydEluZGV4IC0gc2hpcC5sZW5ndGggKiAxMCArIDEwO1xyXG4gIC8vICAgY29uc29sZS5sb2coYHZhbGlkYXRlZCBpICR7dmFsaWRTdGFydH1gKTtcclxuXHJcbiAgY29uc3Qgc2hpcEJsb2NrcyA9IFtdO1xyXG4gIC8vIHNhdmUgdGhlIGluZGV4ZXMgb2Ygc2hpcHMgdG8gYW4gYXJyYXlcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgIGlmIChpc0hvcml6b250YWwpIHNoaXBCbG9ja3MucHVzaChib2FyZEJsb2Nrc1tOdW1iZXIodmFsaWRTdGFydCkgKyBpXSk7XHJcbiAgICBlbHNlIHNoaXBCbG9ja3MucHVzaChib2FyZEJsb2Nrc1tOdW1iZXIodmFsaWRTdGFydCkgKyBpICogMTBdKTtcclxuICB9XHJcblxyXG4gIC8vIHZhbGlkYXRlIHBsYWNlIHRvIHByZXZlbnQgc2hpcHMgZnJvbSBzcGxpdHRpbmdcclxuICBsZXQgaXNWYWxpZDtcclxuICBpZiAoaXNIb3Jpem9udGFsKSB7XHJcbiAgICBzaGlwQmxvY2tzLmV2ZXJ5KFxyXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmV0dXJuLWFzc2lnblxyXG4gICAgICAoX2Jsb2NrLCBpbmRleCkgPT5cclxuICAgICAgICAoaXNWYWxpZCA9XHJcbiAgICAgICAgICBzaGlwQmxvY2tzWzBdLmlkICUgMTAgIT09IDEwIC0gKHNoaXBCbG9ja3MubGVuZ3RoIC0gKGluZGV4ICsgMSkpKVxyXG4gICAgKTtcclxuICB9IGVsc2Uge1xyXG4gICAgc2hpcEJsb2Nrcy5ldmVyeShcclxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJldHVybi1hc3NpZ25cclxuICAgICAgKF9ibG9jaywgaW5kZXgpID0+IChpc1ZhbGlkID0gc2hpcEJsb2Nrc1swXS5pZCA8IDkwICsgKDEwICogaW5kZXggKyAxKSlcclxuICAgICk7XHJcbiAgfVxyXG4gIC8vIGNvbnNvbGUubG9nKGBpcyB2YWxpZD8gJHtpc1ZhbGlkfWApO1xyXG4gIGNvbnN0IG5vdFRha2VuID0gc2hpcEJsb2Nrcy5ldmVyeShcclxuICAgIChibG9jaykgPT5cclxuICAgICAgIWJsb2NrLmNsYXNzTGlzdC5jb250YWlucyhcImZpbGxlZFwiKSAmJlxyXG4gICAgICAhYmxvY2suY2xhc3NMaXN0LmNvbnRhaW5zKFwidW5hdmFpbGFibGVcIilcclxuICApO1xyXG5cclxuICByZXR1cm4geyBzaGlwQmxvY2tzLCBpc1ZhbGlkLCBub3RUYWtlbiB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRTaGlwKHVzZXIsIHNoaXAsIHN0YXJ0SWQpIHtcclxuICBjb25zb2xlLmxvZyhcImFkZHNoaXBcIik7XHJcbiAgLy8gICBjb25zb2xlLmxvZyh1c2VyKTtcclxuICBjb25zdCBib2FyZEJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYCMke3VzZXJ9IGRpdmApO1xyXG4gIGNvbnN0IGJvb2wgPSBNYXRoLnJhbmRvbSgpIDwgMC41OyAvLyByZXR1cm5lZCBudW1iZXIgZWl0aGVyIHdpbGwgYmUgYmlnZ2VyIHRoYW4gMC41IG9yIG5vdCBoZW5jZSB0aGUgcmFuZG9tIGJvb2xcclxuICBjb25zdCBpc0hvcml6b250YWwgPSB1c2VyID09PSBcInBsYXllclwiID8gYW5nbGUgPT09IDAgOiBib29sO1xyXG4gIGNvbnN0IHJhbmRvbVN0YXJ0SW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCAqIDEwKTsgLy8gdGVuIHRpbWVzIHRlbiBpcyB0aGUgd2lkdGggb2YgdGhlIGJvYXJkXHJcbiAgLy8gICBjb25zb2xlLmxvZyhgaG9yaXpvbnRhbCAke2lzSG9yaXpvbnRhbH1gKTtcclxuICAvLyAgIGNvbnNvbGUubG9nKGByYW5kb20gaW5kZXggJHtyYW5kb21TdGFydEluZGV4fWApO1xyXG5cclxuICBjb25zdCBzdGFydEluZGV4ID0gc3RhcnRJZCB8fCByYW5kb21TdGFydEluZGV4O1xyXG4gIC8vICAgY29uc29sZS5sb2coYHN0YXJ0IGluZGV4ICR7c3RhcnRJbmRleH1gKTtcclxuXHJcbiAgY29uc3QgeyBzaGlwQmxvY2tzLCBpc1ZhbGlkLCBub3RUYWtlbiB9ID0gY2hlY2tWYWxpZGl0eShcclxuICAgIGJvYXJkQmxvY2tzLFxyXG4gICAgaXNIb3Jpem9udGFsLFxyXG4gICAgc3RhcnRJbmRleCxcclxuICAgIHNoaXBcclxuICApO1xyXG5cclxuICAvLyBjb25zb2xlLmxvZyhgbm90IHRha2VuPyAke25vdFRha2VufWApO1xyXG4gIGlmIChpc1ZhbGlkICYmIG5vdFRha2VuKSB7XHJcbiAgICBzaGlwQmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PiB7XHJcbiAgICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoc2hpcC5uYW1lKTtcclxuICAgICAgYmxvY2suY2xhc3NMaXN0LmFkZChcImZpbGxlZFwiKTtcclxuICAgIH0pO1xyXG4gICAgLy8gYWRkIGZpbGxlZCBjbGFzcyB0byBhZGphY2VudCBibG9ja3MgdG8gcHJldmVudCBwbGFjaW5nIHNoaXBzIHNpZGUgdG8gc2lkZVxyXG4gICAgY29uc3QgYWRqYWNlbnRJbmRleGVzID0gZ2V0QWRqYWNlbnRJbmRleGVzKFxyXG4gICAgICBib2FyZEJsb2NrcyxcclxuICAgICAgaXNIb3Jpem9udGFsLFxyXG4gICAgICBzaGlwQmxvY2tzXHJcbiAgICApO1xyXG4gICAgYWRqYWNlbnRJbmRleGVzLmZvckVhY2goKGFkamFjZW50SW5kZXgpID0+IHtcclxuICAgICAgY29uc3QgYWRqYWNlbnRCbG9jayA9IGJvYXJkQmxvY2tzW2FkamFjZW50SW5kZXhdO1xyXG4gICAgICBhZGphY2VudEJsb2NrLmNsYXNzTGlzdC5hZGQoXCJ1bmF2YWlsYWJsZVwiKTtcclxuICAgIH0pO1xyXG4gICAgLy8gY29uc29sZS5sb2coYWRqYWNlbnRJbmRleGVzKTtcclxuICB9IGVsc2Uge1xyXG4gICAgaWYgKHVzZXIgPT09IFwiY29tcHV0ZXJcIikgYWRkU2hpcCh1c2VyLCBzaGlwLCBzdGFydElkKTtcclxuICAgIGlmICh1c2VyID09PSBcInBsYXllclwiKSBub3REcm9wcGVkID0gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcbi8vIGhlbHBlciBmdW5jdGlvbiB0byBnZXQgYWRqYWNlbnQgaW5kZXhlc1xyXG5mdW5jdGlvbiBnZXRBZGphY2VudEluZGV4ZXMoYm9hcmRCbG9ja3MsIGlzSG9yaXpvbnRhbCwgc2hpcEJsb2Nrcykge1xyXG4gIGNvbnN0IGJvYXJkQmxvY2tzQXJyYXkgPSBbLi4uYm9hcmRCbG9ja3NdO1xyXG4gIGNvbnN0IGFkamFjZW50SW5kZXhlcyA9IFtdO1xyXG5cclxuICBzaGlwQmxvY2tzLmZvckVhY2goKGJsb2NrLCBpbmRleCkgPT4ge1xyXG4gICAgY29uc3QgYmxvY2tJbmRleCA9IGJvYXJkQmxvY2tzQXJyYXkuaW5kZXhPZihibG9jayk7XHJcbiAgICBjb25zdCByb3cgPSBNYXRoLmZsb29yKGJsb2NrSW5kZXggLyAxMCk7XHJcbiAgICBjb25zdCBjb2wgPSBibG9ja0luZGV4ICUgMTA7XHJcblxyXG4gICAgaWYgKGlzSG9yaXpvbnRhbCkge1xyXG4gICAgICBpZiAoY29sID4gMCkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCAtIDEpOyAvLyBsZWZ0IGJsb2NrXHJcbiAgICAgIGlmIChjb2wgPCA5KSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4ICsgMSk7IC8vIHJpZ2h0IGJsb2NrXHJcbiAgICAgIGlmIChyb3cgPiAwKSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4IC0gMTApOyAvLyB0b3AgYmxvY2tcclxuICAgICAgaWYgKHJvdyA8IDkpIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggKyAxMCk7IC8vIGJvdHRvbSBibG9ja1xyXG4gICAgICBpZiAoY29sID4gMCAmJiByb3cgPiAwKSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4IC0gMTEpOyAvLyB0b3AtbGVmdCBibG9ja1xyXG4gICAgICBpZiAoY29sID4gMCAmJiByb3cgPCA5KSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4ICsgOSk7IC8vIGJvdHRvbS1sZWZ0IGJsb2NrXHJcbiAgICAgIGlmIChjb2wgPCA5ICYmIHJvdyA+IDApIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggLSA5KTsgLy8gdG9wLXJpZ2h0IGJsb2NrXHJcbiAgICAgIGlmIChjb2wgPCA5ICYmIHJvdyA8IDkpIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggKyAxMSk7IC8vIGJvdHRvbS1yaWdodCBibG9ja1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHJvdyA+IDApIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggLSAxMCk7IC8vIHRvcCBibG9ja1xyXG4gICAgICBpZiAocm93IDwgOSkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCArIDEwKTsgLy8gYm90dG9tIGJsb2NrXHJcbiAgICAgIGlmIChjb2wgPiAwKSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4IC0gMSk7IC8vIGxlZnQgYmxvY2tcclxuICAgICAgaWYgKGNvbCA8IDkpIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggKyAxKTsgLy8gcmlnaHQgYmxvY2tcclxuICAgICAgaWYgKHJvdyA+IDAgJiYgY29sID4gMCkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCAtIDExKTsgLy8gdG9wLWxlZnQgYmxvY2tcclxuICAgICAgaWYgKHJvdyA+IDAgJiYgY29sIDwgOSkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCAtIDkpOyAvLyB0b3AtcmlnaHQgYmxvY2tcclxuICAgICAgaWYgKHJvdyA8IDkgJiYgY29sID4gMCkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCArIDkpOyAvLyBib3R0b20tbGVmdCBibG9ja1xyXG4gICAgICBpZiAocm93IDwgOSAmJiBjb2wgPCA5KSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4ICsgMTEpOyAvLyBib3R0b20tcmlnaHQgYmxvY2tcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgY29uc3QgdW5pcXVlQWRqYWNlbnRJbmRleGVzID0gQXJyYXkuZnJvbShuZXcgU2V0KGFkamFjZW50SW5kZXhlcykpO1xyXG5cclxuICByZXR1cm4gdW5pcXVlQWRqYWNlbnRJbmRleGVzO1xyXG59XHJcblxyXG4vLyBEUkFHJkRST1AgUExBWUVSIFNISVBTXHJcbmxldCBkcmFnZ2VkU2hpcDtcclxuY29uc3Qgc2hpcE9wdGlvbnMgPSBBcnJheS5mcm9tKHNoaXBDb250YWluZXIuY2hpbGRyZW4pO1xyXG5zaGlwT3B0aW9ucy5mb3JFYWNoKChzaGlwKSA9PiBzaGlwLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnc3RhcnRcIiwgZHJhZ1N0YXJ0KSk7XHJcblxyXG5jb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjcGxheWVyIGRpdlwiKTtcclxucGxheWVyQm9hcmQuZm9yRWFjaCgoYmxvY2spID0+IHtcclxuICBibG9jay5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgZHJhZ092ZXIpO1xyXG4gIGJsb2NrLmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIGRyb3BTaGlwKTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBkcmFnU3RhcnQoZSkge1xyXG4gIG5vdERyb3BwZWQgPSBmYWxzZTtcclxuICBkcmFnZ2VkU2hpcCA9IGUudGFyZ2V0O1xyXG4gIGNvbnNvbGUubG9nKFwiZHJhZyBzdGFydGVkXCIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmFnT3ZlcihlKSB7XHJcbiAgLy8gY29uc29sZS5sb2coXCJkcmFnb3ZlclwiKTtcclxuICAvLyBjb25zb2xlLmxvZyhlLnRhcmdldC5wYXJlbnROb2RlKTtcclxuICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gIGlmICghZHJhZ2dlZFNoaXApIHJldHVybjtcclxuICBjb25zdCBzaGlwID0gc2hpcHNbZHJhZ2dlZFNoaXAuaWRdO1xyXG5cclxuICBoaWdobGlnaHRTaGlwQXJlYShlLnRhcmdldC5pZCwgc2hpcCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyb3BTaGlwKGUpIHtcclxuICBjb25zb2xlLmxvZyhcImRyb3BzaGlwXCIpO1xyXG4gIGNvbnN0IHN0YXJ0SWQgPSBlLnRhcmdldC5pZDtcclxuICBpZiAoZHJhZ2dlZFNoaXAgPT09IHVuZGVmaW5lZCB8fCBkcmFnZ2VkU2hpcCA9PT0gbnVsbCkgcmV0dXJuO1xyXG4gIGNvbnN0IHNoaXAgPSBzaGlwc1tkcmFnZ2VkU2hpcC5pZF07XHJcbiAgLy8gY29uc29sZS5sb2coc2hpcCwgXCJ0aGlzIGlzIHNoaXBcIik7XHJcblxyXG4gIGFkZFNoaXAoXCJwbGF5ZXJcIiwgc2hpcCwgc3RhcnRJZCk7XHJcbiAgaWYgKCFub3REcm9wcGVkKSBkcmFnZ2VkU2hpcC5yZW1vdmUoKTtcclxuICBpZiAoIXNoaXBDb250YWluZXIucXVlcnlTZWxlY3RvcihcIi5zaGlwXCIpKSBhbGxTaGlwc1BsYWNlZCA9IHRydWU7XHJcbiAgZHJhZ2dlZFNoaXAgPSBudWxsO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoaWdobGlnaHRTaGlwQXJlYShzdGFydEluZGV4LCBzaGlwKSB7XHJcbiAgY29uc3QgaXNIb3Jpem9udGFsID0gYW5nbGUgPT09IDA7XHJcblxyXG4gIGNvbnN0IHsgc2hpcEJsb2NrcywgaXNWYWxpZCwgbm90VGFrZW4gfSA9IGNoZWNrVmFsaWRpdHkoXHJcbiAgICBwbGF5ZXJCb2FyZCxcclxuICAgIGlzSG9yaXpvbnRhbCxcclxuICAgIHN0YXJ0SW5kZXgsXHJcbiAgICBzaGlwXHJcbiAgKTtcclxuXHJcbiAgaWYgKGlzVmFsaWQgJiYgbm90VGFrZW4pIHtcclxuICAgIHNoaXBCbG9ja3MuZm9yRWFjaCgoYmxvY2spID0+IHtcclxuICAgICAgYmxvY2suY2xhc3NMaXN0LmFkZChcImhvdmVyXCIpO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IGJsb2NrLmNsYXNzTGlzdC5yZW1vdmUoXCJob3ZlclwiKSwgNTAwKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuLy8gR0FNRSBMT0dJQ1xyXG5cclxubGV0IHBsYXllclR1cm47XHJcblxyXG4vLyBzdGFydCB0aGUgZ2FtZVxyXG5cclxuZnVuY3Rpb24gc3RhcnRHYW1lU2luZ2xlKCkge1xyXG4gIGlmIChwbGF5ZXJUdXJuID09PSB1bmRlZmluZWQpIHtcclxuICAgIGlmIChzaGlwQ29udGFpbmVyLmNoaWxkcmVuLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9IFwiUGxlYXNlIHBsYWNlIGFsbCB5b3VyIHNoaXBzIGZpcnN0IVwiO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgYm9hcmRCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI2NvbXB1dGVyIGRpdlwiKTtcclxuICAgICAgYm9hcmRCbG9ja3MuZm9yRWFjaCgoYmxvY2spID0+XHJcbiAgICAgICAgYmxvY2suYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUNsaWNrKVxyXG4gICAgICApO1xyXG4gICAgICBwbGF5ZXJUdXJuID0gdHJ1ZTtcclxuICAgICAgdHVybkRpc3BsYXkudGV4dENvbnRlbnQgPSBcIllvdXIgdHVybiFcIjtcclxuICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBcIlRoZSBiYXR0bGUgaGFzIGJlZ3VuIVwiO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlQ2xpY2soZSkge1xyXG4gIGNvbnNvbGUubG9nKGBjdXJyZW50IHBsYXllcjogJHtjdXJyZW50UGxheWVyfWApO1xyXG4gIGNvbnNvbGUubG9nKGBjdXJyZW50IHR1cm46ICR7dHVybk51bX1gKTtcclxuICAvLyBjdXJyZW50IHR1cm4gaXMgbm90IGdldHRpbmcgdXBkYXRlZCBhZnRlciBwbGF5ZXIgMCB0YWtlcyBpdCBzaG90XHJcblxyXG4gIGlmICghZ2FtZU92ZXIpIHtcclxuICAgIGlmIChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJoaXRcIikpIHJldHVybjsgLy8gZG8gdGhpcyBiZXR0ZXJcclxuICAgIGlmIChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJmaWxsZWRcIikpIHtcclxuICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmFkZChcImhpdFwiKTtcclxuICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBcIllvdSBoaXQgdGhlIGVuZW15IHNoaXAhXCI7XHJcbiAgICAgIGNvbnN0IGNsYXNzZXMgPSBBcnJheS5mcm9tKGUudGFyZ2V0LmNsYXNzTGlzdCkuZmlsdGVyKFxyXG4gICAgICAgIChuYW1lKSA9PiAhW1wiYmxvY2tcIiwgXCJoaXRcIiwgXCJmaWxsZWRcIiwgXCJ1bmF2YWlsYWJsZVwiXS5pbmNsdWRlcyhuYW1lKVxyXG4gICAgICApO1xyXG4gICAgICAvLyBtYXkgbmVlZCB0byB1c2UgY3VycmVudFBsYXllciBmb3IgZXZlbnRzXHJcbiAgICAgIGlmIChcclxuICAgICAgICBjdXJyZW50UGxheWVyID09PSBcInBsYXllclwiIHx8XHJcbiAgICAgICAgY3VycmVudFBsYXllciA9PT0gXCJlbmVteVwiIHx8XHJcbiAgICAgICAgZ2FtZU1vZGUgPT09IFwic2luZ2xlcGxheWVyXCJcclxuICAgICAgKSB7XHJcbiAgICAgICAgcGxheWVySGl0cy5wdXNoKC4uLmNsYXNzZXMpO1xyXG4gICAgICAgIGNoZWNrU2NvcmUoY3VycmVudFBsYXllciwgcGxheWVySGl0cywgcGxheWVyU3Vua1NoaXBzKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gaWYgKGN1cnJlbnRQbGF5ZXIgPT09IFwiZW5lbXlcIikge1xyXG4gICAgICAvLyAgIGVuZW15SGl0cy5wdXNoKC4uLmNsYXNzZXMpO1xyXG4gICAgICAvLyAgIGNoZWNrU2NvcmUoY3VycmVudFBsYXllciwgZW5lbXlIaXRzLCBlbmVteVN1bmtTaGlwcyk7XHJcbiAgICAgIC8vIH1cclxuICAgIH1cclxuICAgIGlmICghZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZmlsbGVkXCIpKSB7XHJcbiAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJNaXNzIVwiO1xyXG4gICAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjb25zdCBib2FyZEJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjY29tcHV0ZXIgZGl2XCIpO1xyXG4gICAgLy8gYm9hcmRCbG9ja3MuZm9yRWFjaChcclxuICAgIC8vICAgKGJsb2NrKSA9PiBibG9jay5yZXBsYWNlV2l0aChibG9jay5jbG9uZU5vZGUodHJ1ZSkpIC8vIHRvIHJlbW92ZSBldmVudCBsaXN0ZW5lcnNcclxuICAgIC8vICk7XHJcblxyXG4gICAgLy8gaGFuZGxlRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIC8vIGlmIGdhbWVtb2RlIGlzIHNpbmdsZSwgZG8gdGhlc2U/XHJcbiAgICBpZiAoZ2FtZU1vZGUgPT09IFwic2luZ2xlcGxheWVyXCIgJiYgIWdhbWVPdmVyKSB7XHJcbiAgICAgIHBsYXllclR1cm4gPSBmYWxzZTtcclxuXHJcbiAgICAgIHNldFRpbWVvdXQoY29tcHV0ZXJzVHVybiwgMTAwKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGUudGFyZ2V0LmlkOyAvLyB1c2UgdGhpcyB0byBjb21tdW5pY2F0ZSB3aXRoIHNlcnZlcj9cclxufVxyXG5cclxuLy8gY29tcHV0ZXJzIHR1cm5cclxuZnVuY3Rpb24gY29tcHV0ZXJzVHVybigpIHtcclxuICBpZiAoIWdhbWVPdmVyKSB7XHJcbiAgICB0dXJuRGlzcGxheS50ZXh0Q29udGVudCA9IFwiQ29tcHV0ZXJzIFR1cm5cIjtcclxuICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJNYWtpbmcgY2FsY3VsYXRpb25zLi5cIjtcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgY29uc3QgcmFuZG9tU2hvdCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwICogMTApO1xyXG4gICAgICBpZiAoXHJcbiAgICAgICAgcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiZmlsbGVkXCIpICYmXHJcbiAgICAgICAgcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGl0XCIpICYmXHJcbiAgICAgICAgcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmNvbnRhaW5zKFwibWlzc1wiKVxyXG4gICAgICApIHtcclxuICAgICAgICBjb21wdXRlcnNUdXJuKCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgICAgcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiZmlsbGVkXCIpICYmXHJcbiAgICAgICAgIXBsYXllckJvYXJkW3JhbmRvbVNob3RdLmNsYXNzTGlzdC5jb250YWlucyhcImhpdFwiKVxyXG4gICAgICApIHtcclxuICAgICAgICBwbGF5ZXJCb2FyZFtyYW5kb21TaG90XS5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xyXG4gICAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJIaXQgdGhlIHRhcmdldCFcIjtcclxuICAgICAgICBjb25zdCBjbGFzc2VzID0gQXJyYXkuZnJvbShwbGF5ZXJCb2FyZFtyYW5kb21TaG90XS5jbGFzc0xpc3QpLmZpbHRlcihcclxuICAgICAgICAgIChuYW1lKSA9PiAhW1wiYmxvY2tcIiwgXCJoaXRcIiwgXCJmaWxsZWRcIl0uaW5jbHVkZXMobmFtZSlcclxuICAgICAgICApO1xyXG4gICAgICAgIGNvbXB1dGVySGl0cy5wdXNoKC4uLmNsYXNzZXMpO1xyXG4gICAgICAgIGNoZWNrU2NvcmUoXCJjb21wdXRlclwiLCBjb21wdXRlckhpdHMsIGNvbXB1dGVyU3Vua1NoaXBzKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9IFwiTWlzcyFcIjtcclxuICAgICAgICBwbGF5ZXJCb2FyZFtyYW5kb21TaG90XS5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcclxuICAgICAgfVxyXG4gICAgfSwgNTAwKTtcclxuICAgIGNvbnN0IGJvYXJkQmxvY2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNjb21wdXRlciBkaXZcIik7XHJcbiAgICBib2FyZEJsb2Nrcy5mb3JFYWNoKFxyXG4gICAgICAoYmxvY2spID0+IGJsb2NrLnJlcGxhY2VXaXRoKGJsb2NrLmNsb25lTm9kZSh0cnVlKSkgLy8gdG8gcmVtb3ZlIGV2ZW50IGxpc3RlbmVyc1xyXG4gICAgKTtcclxuICAgIGhhbmRsZUV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgcGxheWVyVHVybiA9IHRydWU7XHJcbiAgICAgIHR1cm5EaXNwbGF5LnRleHRDb250ZW50ID0gXCJQbGF5ZXIncyB0dXJuXCI7XHJcbiAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJUYWtlIHlvdXIgc2hvdCFcIjtcclxuXHJcbiAgICAgIC8vIHJlLWFkZGluZyBldmVudCBsaXN0ZW5lcnNcclxuICAgIH0sIDUwMCk7XHJcbiAgfVxyXG59XHJcbmZ1bmN0aW9uIGhhbmRsZUV2ZW50TGlzdGVuZXJzKCkge1xyXG4gIGNvbnN0IGJvYXJkQmxvY2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNjb21wdXRlciBkaXZcIik7XHJcbiAgYm9hcmRCbG9ja3MuZm9yRWFjaCgoYmxvY2spID0+IGJsb2NrLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVDbGljaykpOyAvLyByZS1hZGRpbmcgZXZlbnQgbGlzdGVuZXJzXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNoZWNrU2NvcmUodXNlciwgdXNlckhpdHMsIHVzZXJTdW5rU2hpcHMpIHtcclxuICBmdW5jdGlvbiBjaGVja1NoaXAoc2hpcE5hbWUsIHNoaXBMZW5ndGgpIHtcclxuICAgIGlmIChcclxuICAgICAgdXNlckhpdHMuZmlsdGVyKChoaXRTaGlwKSA9PiBoaXRTaGlwID09PSBzaGlwTmFtZSkubGVuZ3RoID09PSBzaGlwTGVuZ3RoXHJcbiAgICApIHtcclxuICAgICAgaWYgKFxyXG4gICAgICAgIHVzZXIgPT09IFwicGxheWVyXCIgfHxcclxuICAgICAgICB1c2VyID09PSBcImVuZW15XCIgfHxcclxuICAgICAgICBnYW1lTW9kZSA9PT0gXCJzaW5nbGVwbGF5ZXJcIlxyXG4gICAgICApIHtcclxuICAgICAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9IGBZb3Ugc3VuayB0aGUgZW5lbXkgJHtzaGlwTmFtZX0hYDtcclxuXHJcbiAgICAgICAgcGxheWVySGl0cyA9IHVzZXJIaXRzLmZpbHRlcigoaGl0U2hpcCkgPT4gaGl0U2hpcCAhPT0gc2hpcE5hbWUpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIGlmICh1c2VyID09PSBcImVuZW15XCIpIHtcclxuICAgICAgLy8gICBlbmVteUhpdHMgPSB1c2VySGl0cy5maWx0ZXIoKGhpdFNoaXApID0+IGhpdFNoaXAgIT09IHNoaXBOYW1lKTtcclxuICAgICAgLy8gfVxyXG4gICAgICBpZiAodXNlciA9PT0gXCJjb21wdXRlclwiKSB7XHJcbiAgICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBgVGhlIGVuZW15IHN1bmsgeW91ciAke3NoaXBOYW1lfSFgO1xyXG4gICAgICAgIGNvbXB1dGVySGl0cyA9IHVzZXJIaXRzLmZpbHRlcigoaGl0U2hpcCkgPT4gaGl0U2hpcCAhPT0gc2hpcE5hbWUpO1xyXG4gICAgICB9XHJcbiAgICAgIHVzZXJTdW5rU2hpcHMucHVzaChzaGlwTmFtZSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGNoZWNrU2hpcChcImRlc3Ryb3llclwiLCAyKTtcclxuICBjaGVja1NoaXAoXCJzdWJtYXJpbmVcIiwgMyk7XHJcbiAgY2hlY2tTaGlwKFwiY3J1aXNlclwiLCAzKTtcclxuICBjaGVja1NoaXAoXCJiYXR0bGVzaGlwXCIsIDQpO1xyXG4gIGNoZWNrU2hpcChcImNhcnJpZXJcIiwgNSk7XHJcbiAgY29uc29sZS5sb2coXCJwbGF5ZXJIaXRzXCIsIHBsYXllckhpdHMpO1xyXG4gIGNvbnNvbGUubG9nKFwicGxheWVyU3Vua1NoaXBzXCIsIHBsYXllclN1bmtTaGlwcyk7XHJcblxyXG4gIGlmIChwbGF5ZXJTdW5rU2hpcHMubGVuZ3RoID09PSA1KSB7XHJcbiAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9XHJcbiAgICAgIFwiWW91IHN1bmsgYWxsIHRoZSBlbmVteSBzaGlwcyEgV2VsbCBmb3VnaHQgYWRtaXJhbCFcIjsgLy8gZ2FtZSBvdmVyIHBsYXllciAxIHdvblxyXG4gICAgZ2FtZU92ZXIgPSB0cnVlO1xyXG4gICAgaWYgKGdhbWVNb2RlID09PSBcInNpbmdsZXBsYXllclwiKVxyXG4gICAgICBzdGFydEJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RhcnRHYW1lU2luZ2xlKTtcclxuICB9XHJcbiAgaWYgKGVuZW15U3Vua1NoaXBzLmxlbmdodCA9PT0gNSkge1xyXG4gICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPVxyXG4gICAgICBcIllvdSBzdW5rIGFsbCB0aGUgZW5lbXkgc2hpcHMhIFdlbGwgZm91Z2h0IGFkbWlyYWwhXCI7IC8vIGdhbWUgb3ZlciBwbGF5ZXIgMSB3b25cclxuICAgIGdhbWVPdmVyID0gdHJ1ZTtcclxuICB9XHJcbiAgaWYgKGNvbXB1dGVyU3Vua1NoaXBzLmxlbmd0aCA9PT0gNSkge1xyXG4gICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPVxyXG4gICAgICBcIllvdXIgZmxlZXQgaGFzIGJlZW4gZGVzdHJveWVkISBXZWxsIGZvdWdodCBhZG1pcmFsLCB3ZSdsbCBnZXQgdGhlbSBuZXh0IHRpbWUuXCI7XHJcbiAgICBnYW1lT3ZlciA9IHRydWU7XHJcbiAgICBzdGFydEJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RhcnRHYW1lU2luZ2xlKTtcclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9