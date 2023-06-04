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
  gameMode = "multiplayer";
  multiPlayerStarted = true;

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
  boardBlocks.forEach((block) => {
    block.addEventListener("click", (e) => {
      // if (playerNum !== turnNum) return;
      // if (turnNum === 1 || (turnNum === 0 && ready && enemyReady)) {
      // }
      // playerNum === turnNum &&
      // if (turnNum === 1 || (turnNum === 0 && ready && enemyReady)) {
      // }
      shotFired = handleClick(e);
      console.log(shotFired);

      socket.emit("turn-change", turnNum);
      socket.emit("fire", shotFired);

      // socket.on("turn-change", (turn) => {
      //   console.log(`${turn} turn changed bro:()`);
      // });

      // handleTurn();
    });
  });

  socket.on("fire", (id, turn) => {
    turnNum = turn;
    shotFired = id;
    console.log(`${turnNum} turn num`);
  });
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

    // const playerBoardData = Array.from(
    //   document.querySelectorAll("#player div")
    // ).map((block) => (block.classList.contains("filled") ? "filled" : "block"));
    const playerBoardData = Array.from(
      document.querySelectorAll("#player div")
    ).map((block) => block.className);
    socket.emit("board-data", playerBoardData);
  }
}

function handleTurn() {
  if (turnNum === 0) currentPlayer = "player";
  if (turnNum === 1) currentPlayer = "enemy";
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
// addShip(destroyer);
// addShip(submarine);
// addShip(cruiser);
// addShip(battleship);
// addShip("computer", carrier);

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

let playerHits = [];
// let enemyHits = [];
let computerHits = [];
const playerSunkShips = [];
const enemySunkShips = [];
const computerSunkShips = [];

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLDBCQUEwQixLQUFLO0FBQy9CO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixNQUFNO0FBQ2hDLFVBQVU7QUFDVjtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixTQUFTO0FBQzVCLEdBQUc7QUFDSDtBQUNBLHNCQUFzQixTQUFTO0FBQy9CO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLGdDQUFnQztBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0Isa0JBQWtCO0FBQzFDO0FBQ0Esd0JBQXdCLFFBQVE7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixrQkFBa0I7QUFDeEMsNEJBQTRCLFFBQVE7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxNQUFNO0FBQzNDLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsU0FBUztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsV0FBVztBQUM3QztBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsaUJBQWlCO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsUUFBUTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRCxNQUFNO0FBQzFELG9DQUFvQztBQUNwQztBQUNBLGdFQUFnRTtBQUNoRSxpQ0FBaUMsYUFBYTtBQUM5QyxtQ0FBbUMsaUJBQWlCO0FBQ3BEO0FBQ0E7QUFDQSxrQ0FBa0MsV0FBVztBQUM3QztBQUNBLFVBQVUsZ0NBQWdDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixTQUFTO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RDtBQUN6RCx5REFBeUQ7QUFDekQsMERBQTBEO0FBQzFELDBEQUEwRDtBQUMxRCxxRUFBcUU7QUFDckUsb0VBQW9FO0FBQ3BFLG9FQUFvRTtBQUNwRSxxRUFBcUU7QUFDckUsTUFBTTtBQUNOLDBEQUEwRDtBQUMxRCwwREFBMEQ7QUFDMUQseURBQXlEO0FBQ3pELHlEQUF5RDtBQUN6RCxxRUFBcUU7QUFDckUsb0VBQW9FO0FBQ3BFLG9FQUFvRTtBQUNwRSxxRUFBcUU7QUFDckU7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsZ0NBQWdDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLGNBQWM7QUFDL0MsK0JBQStCLFFBQVE7QUFDdkM7QUFDQTtBQUNBO0FBQ0Esb0RBQW9EO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdGQUFnRjtBQUNoRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3REFBd0QsU0FBUztBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RCxTQUFTO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDREQUE0RDtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBNEQ7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1wcm9qZWN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIG11bHRpLXNpbmdsZSBwbGF5ZXIgY29udHJvbHNcclxuY29uc3Qgc2luZ2xlUGxheWVyQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaW5nbGUtcGxheWVyLWJ1dHRvblwiKTtcclxuY29uc3QgbXVsdGlwbGF5ZXJCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm11bHRpcGxheWVyLWJ1dHRvblwiKTtcclxuLy8gc3RhcnQgdGhlIGdhbWVcclxuY29uc3Qgc3RhcnRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0YXJ0LWJ1dHRvblwiKTtcclxuY29uc3QgaW5mb0Rpc3BsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluZm8tZGlzcGxheVwiKTtcclxuY29uc3QgdHVybkRpc3BsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR1cm4tZGlzcGxheVwiKTtcclxuXHJcbi8vIENSRUFUSU5HIFNISVBTXHJcbmNsYXNzIFNoaXAge1xyXG4gIGNvbnN0cnVjdG9yKG5hbWUsIGxlbmd0aCkge1xyXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgZGVzdHJveWVyID0gbmV3IFNoaXAoXCJkZXN0cm95ZXJcIiwgMik7XHJcbmNvbnN0IHN1Ym1hcmluZSA9IG5ldyBTaGlwKFwic3VibWFyaW5lXCIsIDMpO1xyXG5jb25zdCBjcnVpc2VyID0gbmV3IFNoaXAoXCJjcnVpc2VyXCIsIDMpO1xyXG5jb25zdCBiYXR0bGVzaGlwID0gbmV3IFNoaXAoXCJiYXR0bGVzaGlwXCIsIDQpO1xyXG5jb25zdCBjYXJyaWVyID0gbmV3IFNoaXAoXCJjYXJyaWVyXCIsIDUpO1xyXG5cclxuY29uc3Qgc2hpcHMgPSBbZGVzdHJveWVyLCBzdWJtYXJpbmUsIGNydWlzZXIsIGJhdHRsZXNoaXAsIGNhcnJpZXJdO1xyXG5cclxuY29uc3QgZmxpcEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmxpcC1idXR0b25cIik7XHJcbmNvbnN0IHNoaXBDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNoaXAtc2VsZWN0LWNvbnRhaW5lclwiKTtcclxubGV0IHVzZXIgPSBcInBsYXllclwiO1xyXG5sZXQgY3VycmVudFBsYXllciA9IHVzZXI7XHJcbmxldCBnYW1lTW9kZSA9IFwiXCI7XHJcbmxldCBwbGF5ZXJOdW0gPSAwO1xyXG5sZXQgdHVybk51bSA9IDA7XHJcbmxldCByZWFkeSA9IGZhbHNlO1xyXG5sZXQgZ2FtZU92ZXIgPSBmYWxzZTtcclxubGV0IGVuZW15UmVhZHkgPSBmYWxzZTtcclxubGV0IGFsbFNoaXBzUGxhY2VkID0gZmFsc2U7XHJcbmxldCBzaG90RmlyZWQgPSAtMTtcclxubGV0IG5vdERyb3BwZWQ7XHJcbmxldCBzaW5nbGVQbGF5ZXJTdGFydGVkO1xyXG5sZXQgbXVsdGlQbGF5ZXJTdGFydGVkO1xyXG5cclxuZnVuY3Rpb24gc3RhcnRNdWx0aXBsYXllcigpIHtcclxuICBnYW1lTW9kZSA9IFwibXVsdGlwbGF5ZXJcIjtcclxuICBtdWx0aVBsYXllclN0YXJ0ZWQgPSB0cnVlO1xyXG5cclxuICBjb25zdCBzb2NrZXQgPSBpbygpO1xyXG5cclxuICAvLyBnZXQgcGxheWVyIG51bWJlclxyXG5cclxuICBzb2NrZXQub24oXCJwbGF5ZXItbnVtYmVyXCIsIChudW0pID0+IHtcclxuICAgIGlmIChudW0gPT09IC0xKSB7XHJcbiAgICAgIGluZm9EaXNwbGF5LmlubmVySFRNTCA9IFwic2VydmVyIGlzIGZ1bGxcIjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHBsYXllck51bSA9IHBhcnNlSW50KG51bSk7XHJcbiAgICAgIGlmIChwbGF5ZXJOdW0gPT09IDEpIGN1cnJlbnRQbGF5ZXIgPSBcImVuZW15XCI7XHJcbiAgICAgIGNvbnNvbGUubG9nKHBsYXllck51bSk7XHJcblxyXG4gICAgICBzb2NrZXQuZW1pdChcImNoZWNrLXBsYXllcnNcIik7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgLy8gcGxheWVyIGNvbm5lY3Rpb24gY29udHJvbFxyXG4gIHNvY2tldC5vbihcInBsYXllci1jb25uZWN0aW9uXCIsIChudW0pID0+IHtcclxuICAgIGNvbnNvbGUubG9nKGBwbGF5ZXIgJHtudW19IGhhcyBjb25uZWN0ZWRgKTtcclxuICAgIGNvbnRyb2xQbGF5ZXJDb25uZWN0aW9uKG51bSk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIGVuZW15IHJlYWR5XHJcbiAgc29ja2V0Lm9uKFwiZW5lbXktcmVhZHlcIiwgKG51bSkgPT4ge1xyXG4gICAgZW5lbXlSZWFkeSA9IHRydWU7XHJcbiAgICBwbGF5ZXJSZWFkeShudW0pO1xyXG4gICAgaWYgKHJlYWR5KSBzdGFydEdhbWVNdWx0aShzb2NrZXQpO1xyXG4gIH0pO1xyXG5cclxuICAvLyBjaGVjayBwbGF5ZXIgc3RhdHVzXHJcbiAgc29ja2V0Lm9uKFwiY2hlY2stcGxheWVyc1wiLCAocGxheWVycykgPT4ge1xyXG4gICAgcGxheWVycy5mb3JFYWNoKChwbGF5ZXIsIGluZGV4KSA9PiB7XHJcbiAgICAgIGlmIChwbGF5ZXIuY29ubmVjdGVkKSBjb250cm9sUGxheWVyQ29ubmVjdGlvbihpbmRleCk7XHJcbiAgICAgIGlmIChwbGF5ZXIucmVhZHkpIHtcclxuICAgICAgICBwbGF5ZXJSZWFkeShpbmRleCk7XHJcbiAgICAgICAgaWYgKGluZGV4ICE9PSBwbGF5ZXJOdW0pIGVuZW15UmVhZHkgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgc3RhcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgIGlmICghYWxsU2hpcHNQbGFjZWQpIHJldHVybjtcclxuICAgIGlmIChhbGxTaGlwc1BsYWNlZCkgc3RhcnRHYW1lTXVsdGkoc29ja2V0KTtcclxuICAgIGVsc2UgaW5mb0Rpc3BsYXkuaW5uZXJIVE1MID0gXCJwbGFjZSBhbGwgb2YgeW91ciBzaGlwcyBmaXJzdCFcIjtcclxuICAgIC8vIGNvbnN0IGJvYXJkQmxvY2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNjb21wdXRlciBkaXZcIik7XHJcbiAgfSk7XHJcblxyXG4gIC8vIGV2ZW50IGxpc3RlbmVyIGZvciBmaXJpbmdcclxuXHJcbiAgY29uc3QgYm9hcmRCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI2NvbXB1dGVyIGRpdlwiKTtcclxuICBib2FyZEJsb2Nrcy5mb3JFYWNoKChibG9jaykgPT4ge1xyXG4gICAgYmxvY2suYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XHJcbiAgICAgIC8vIGlmIChwbGF5ZXJOdW0gIT09IHR1cm5OdW0pIHJldHVybjtcclxuICAgICAgLy8gaWYgKHR1cm5OdW0gPT09IDEgfHwgKHR1cm5OdW0gPT09IDAgJiYgcmVhZHkgJiYgZW5lbXlSZWFkeSkpIHtcclxuICAgICAgLy8gfVxyXG4gICAgICAvLyBwbGF5ZXJOdW0gPT09IHR1cm5OdW0gJiZcclxuICAgICAgLy8gaWYgKHR1cm5OdW0gPT09IDEgfHwgKHR1cm5OdW0gPT09IDAgJiYgcmVhZHkgJiYgZW5lbXlSZWFkeSkpIHtcclxuICAgICAgLy8gfVxyXG4gICAgICBzaG90RmlyZWQgPSBoYW5kbGVDbGljayhlKTtcclxuICAgICAgY29uc29sZS5sb2coc2hvdEZpcmVkKTtcclxuXHJcbiAgICAgIHNvY2tldC5lbWl0KFwidHVybi1jaGFuZ2VcIiwgdHVybk51bSk7XHJcbiAgICAgIHNvY2tldC5lbWl0KFwiZmlyZVwiLCBzaG90RmlyZWQpO1xyXG5cclxuICAgICAgLy8gc29ja2V0Lm9uKFwidHVybi1jaGFuZ2VcIiwgKHR1cm4pID0+IHtcclxuICAgICAgLy8gICBjb25zb2xlLmxvZyhgJHt0dXJufSB0dXJuIGNoYW5nZWQgYnJvOigpYCk7XHJcbiAgICAgIC8vIH0pO1xyXG5cclxuICAgICAgLy8gaGFuZGxlVHVybigpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIHNvY2tldC5vbihcImZpcmVcIiwgKGlkLCB0dXJuKSA9PiB7XHJcbiAgICB0dXJuTnVtID0gdHVybjtcclxuICAgIHNob3RGaXJlZCA9IGlkO1xyXG4gICAgY29uc29sZS5sb2coYCR7dHVybk51bX0gdHVybiBudW1gKTtcclxuICB9KTtcclxuICAvLyBzb2NrZXQub24oXCJ0dXJuQ2hhbmdlXCIsICh0dXJuKSA9PiB7XHJcbiAgLy8gICBjb25zb2xlLmxvZyhgJHt0dXJuTnVtfSB0dXJuIG51bWApO1xyXG4gIC8vICAgdHVybk51bSA9IHR1cm47XHJcbiAgLy8gfSk7XHJcblxyXG4gIHNvY2tldC5vbihcInN0YXJ0LWdhbWVcIiwgKHBsYXllcjFCb2FyZERhdGEsIHBsYXllcjJCb2FyZERhdGEpID0+IHtcclxuICAgIGNvbnN0IG9wcG9uZW50Qm9hcmRCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI2NvbXB1dGVyIGRpdlwiKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wcG9uZW50Qm9hcmRCbG9ja3MubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgY29uc3QgZGF0YUluZGV4ID0gaTtcclxuICAgICAgb3Bwb25lbnRCb2FyZEJsb2Nrc1tpXS5jbGFzc05hbWUgPVxyXG4gICAgICAgIHBsYXllck51bSA9PT0gMFxyXG4gICAgICAgICAgPyBwbGF5ZXIyQm9hcmREYXRhW2RhdGFJbmRleF1cclxuICAgICAgICAgIDogcGxheWVyMUJvYXJkRGF0YVtkYXRhSW5kZXhdO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAvLyByZWNlaXZpbmcgZmlyZVxyXG5cclxuICBmdW5jdGlvbiBjb250cm9sUGxheWVyQ29ubmVjdGlvbihudW0pIHtcclxuICAgIGNvbnN0IHBsYXllciA9IGAucCR7cGFyc2VJbnQobnVtKSArIDF9YDtcclxuICAgIGRvY3VtZW50XHJcbiAgICAgIC5xdWVyeVNlbGVjdG9yKGAke3BsYXllcn0gLmNvbm5lY3RlZCBzcGFuYClcclxuICAgICAgLmNsYXNzTGlzdC50b2dnbGUoXCJncmVlblwiKTtcclxuICAgIGlmIChwYXJzZUludChudW0pID09PSBwbGF5ZXJOdW0pXHJcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocGxheWVyKS5zdHlsZS5mb250V2VpZ2h0ID0gXCJib2xkXCI7XHJcbiAgfVxyXG59XHJcbm11bHRpcGxheWVyQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzdGFydE11bHRpcGxheWVyKTtcclxuXHJcbi8vIHN0YXJ0IG11bHRpcGxheWVyIGdhbWVcclxuZnVuY3Rpb24gc3RhcnRHYW1lTXVsdGkoc29ja2V0KSB7XHJcbiAgaWYgKGdhbWVPdmVyKSByZXR1cm47XHJcbiAgY29uc29sZS5sb2coY3VycmVudFBsYXllcik7XHJcbiAgaWYgKCFyZWFkeSkge1xyXG4gICAgc29ja2V0LmVtaXQoXCJwbGF5ZXItcmVhZHlcIik7XHJcbiAgICByZWFkeSA9IHRydWU7XHJcbiAgICBwbGF5ZXJSZWFkeShwbGF5ZXJOdW0pO1xyXG4gIH1cclxuXHJcbiAgaWYgKGVuZW15UmVhZHkpIHtcclxuICAgIGlmIChjdXJyZW50UGxheWVyID09PSBcInBsYXllclwiKSB7XHJcbiAgICAgIHR1cm5EaXNwbGF5LmlubmVySFRNTCA9IFwieW91ciB0dXJuXCI7XHJcbiAgICB9XHJcbiAgICBpZiAoY3VycmVudFBsYXllciA9PT0gXCJlbmVteVwiKSB7XHJcbiAgICAgIHR1cm5EaXNwbGF5LmlubmVySFRNTCA9IFwiZW5lbXkncyB0dXJuXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY29uc3QgcGxheWVyQm9hcmREYXRhID0gQXJyYXkuZnJvbShcclxuICAgIC8vICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNwbGF5ZXIgZGl2XCIpXHJcbiAgICAvLyApLm1hcCgoYmxvY2spID0+IChibG9jay5jbGFzc0xpc3QuY29udGFpbnMoXCJmaWxsZWRcIikgPyBcImZpbGxlZFwiIDogXCJibG9ja1wiKSk7XHJcbiAgICBjb25zdCBwbGF5ZXJCb2FyZERhdGEgPSBBcnJheS5mcm9tKFxyXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI3BsYXllciBkaXZcIilcclxuICAgICkubWFwKChibG9jaykgPT4gYmxvY2suY2xhc3NOYW1lKTtcclxuICAgIHNvY2tldC5lbWl0KFwiYm9hcmQtZGF0YVwiLCBwbGF5ZXJCb2FyZERhdGEpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlVHVybigpIHtcclxuICBpZiAodHVybk51bSA9PT0gMCkgY3VycmVudFBsYXllciA9IFwicGxheWVyXCI7XHJcbiAgaWYgKHR1cm5OdW0gPT09IDEpIGN1cnJlbnRQbGF5ZXIgPSBcImVuZW15XCI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBsYXllclJlYWR5KG51bSkge1xyXG4gIGNvbnN0IHBsYXllciA9IGAucCR7cGFyc2VJbnQobnVtKSArIDF9YDtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAke3BsYXllcn0gLnJlYWR5IHNwYW5gKS5jbGFzc0xpc3QudG9nZ2xlKFwiZ3JlZW5cIik7XHJcbn1cclxuXHJcbi8vIHN0YXJ0IHNpbmdsZSBwbGF5ZXIgZ2FtZVxyXG5mdW5jdGlvbiBzdGFydFNpbmdsZVBsYXllcigpIHtcclxuICBpZiAoZ2FtZU92ZXIpIHJldHVybjtcclxuICBpZiAoc2luZ2xlUGxheWVyU3RhcnRlZCA9PT0gdHJ1ZSkgcmV0dXJuO1xyXG4gIHNpbmdsZVBsYXllclN0YXJ0ZWQgPSB0cnVlO1xyXG4gIGdhbWVNb2RlID0gXCJzaW5nbGVwbGF5ZXJcIjtcclxuICB1c2VyID0gXCJjb21wdXRlclwiO1xyXG4gIHNoaXBzLmZvckVhY2goKHNoaXApID0+IGFkZFNoaXAoXCJjb21wdXRlclwiLCBzaGlwKSk7XHJcbiAgc3RhcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN0YXJ0R2FtZVNpbmdsZSk7XHJcbn1cclxuc2luZ2xlUGxheWVyQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzdGFydFNpbmdsZVBsYXllcik7XHJcblxyXG5sZXQgYW5nbGUgPSAwO1xyXG5mdW5jdGlvbiBmbGlwU2hpcHMoKSB7XHJcbiAgY29uc3Qgc2hpcHMgPSBBcnJheS5mcm9tKHNoaXBDb250YWluZXIuY2hpbGRyZW4pO1xyXG4gIGFuZ2xlID0gYW5nbGUgPT09IDAgPyA5MCA6IDA7XHJcbiAgc2hpcHMuZm9yRWFjaCgoc2hpcCkgPT4ge1xyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXHJcbiAgICBzaGlwLnN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGUoJHthbmdsZX1kZWcpYDtcclxuICB9KTtcclxufVxyXG5mbGlwQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmbGlwU2hpcHMpO1xyXG5cclxuLy8gQ1JFQVRJTkcgR0FNRUJPQVJEXHJcbmZ1bmN0aW9uIGNyZWF0ZUJvYXJkKGNvbG9yLCB1c2VyKSB7XHJcbiAgY29uc3QgZ2FtZUJvYXJkQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lYm9hcmQtY29udGFpbmVyXCIpO1xyXG5cclxuICBjb25zdCBnYW1lQm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gIGdhbWVCb2FyZC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB1c2VyKTtcclxuICBnYW1lQm9hcmQuY2xhc3NMaXN0LmFkZChcImdhbWVib2FyZFwiKTtcclxuICBnYW1lQm9hcmQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3I7XHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwOyBpICs9IDEpIHtcclxuICAgIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoXCJibG9ja1wiKTtcclxuICAgIGJsb2NrLmlkID0gaTtcclxuICAgIGdhbWVCb2FyZC5hcHBlbmQoYmxvY2spO1xyXG4gIH1cclxuXHJcbiAgZ2FtZUJvYXJkQ29udGFpbmVyLmFwcGVuZENoaWxkKGdhbWVCb2FyZCk7XHJcbn1cclxuXHJcbmNyZWF0ZUJvYXJkKFwid2hpdGVcIiwgdXNlcik7XHJcbmNyZWF0ZUJvYXJkKFwiZ2FpbnNib3JvXCIsIFwiY29tcHV0ZXJcIik7XHJcblxyXG4vLyBjb25zb2xlLmxvZyhzaGlwcyk7XHJcblxyXG5mdW5jdGlvbiBjaGVja1ZhbGlkaXR5KGJvYXJkQmxvY2tzLCBpc0hvcml6b250YWwsIHN0YXJ0SW5kZXgsIHNoaXApIHtcclxuICAvLyB0byBwcmV2ZW50IHBsYWNpbmcgc2hpcHMgb2ZmIGJvYXJkXHJcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5lc3RlZC10ZXJuYXJ5XHJcbiAgY29uc3QgdmFsaWRTdGFydCA9IGlzSG9yaXpvbnRhbFxyXG4gICAgPyBzdGFydEluZGV4IDw9IDEwICogMTAgLSBzaGlwLmxlbmd0aFxyXG4gICAgICA/IHN0YXJ0SW5kZXhcclxuICAgICAgOiAxMCAqIDEwIC0gc2hpcC5sZW5ndGhcclxuICAgIDogc3RhcnRJbmRleCA8PSAxMCAqIDEwIC0gMTAgKiBzaGlwLmxlbmd0aFxyXG4gICAgPyBzdGFydEluZGV4XHJcbiAgICA6IHN0YXJ0SW5kZXggLSBzaGlwLmxlbmd0aCAqIDEwICsgMTA7XHJcbiAgLy8gICBjb25zb2xlLmxvZyhgdmFsaWRhdGVkIGkgJHt2YWxpZFN0YXJ0fWApO1xyXG5cclxuICBjb25zdCBzaGlwQmxvY2tzID0gW107XHJcbiAgLy8gc2F2ZSB0aGUgaW5kZXhlcyBvZiBzaGlwcyB0byBhbiBhcnJheVxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgaWYgKGlzSG9yaXpvbnRhbCkgc2hpcEJsb2Nrcy5wdXNoKGJvYXJkQmxvY2tzW051bWJlcih2YWxpZFN0YXJ0KSArIGldKTtcclxuICAgIGVsc2Ugc2hpcEJsb2Nrcy5wdXNoKGJvYXJkQmxvY2tzW051bWJlcih2YWxpZFN0YXJ0KSArIGkgKiAxMF0pO1xyXG4gIH1cclxuXHJcbiAgLy8gdmFsaWRhdGUgcGxhY2UgdG8gcHJldmVudCBzaGlwcyBmcm9tIHNwbGl0dGluZ1xyXG4gIGxldCBpc1ZhbGlkO1xyXG4gIGlmIChpc0hvcml6b250YWwpIHtcclxuICAgIHNoaXBCbG9ja3MuZXZlcnkoXHJcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXR1cm4tYXNzaWduXHJcbiAgICAgIChfYmxvY2ssIGluZGV4KSA9PlxyXG4gICAgICAgIChpc1ZhbGlkID1cclxuICAgICAgICAgIHNoaXBCbG9ja3NbMF0uaWQgJSAxMCAhPT0gMTAgLSAoc2hpcEJsb2Nrcy5sZW5ndGggLSAoaW5kZXggKyAxKSkpXHJcbiAgICApO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBzaGlwQmxvY2tzLmV2ZXJ5KFxyXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmV0dXJuLWFzc2lnblxyXG4gICAgICAoX2Jsb2NrLCBpbmRleCkgPT4gKGlzVmFsaWQgPSBzaGlwQmxvY2tzWzBdLmlkIDwgOTAgKyAoMTAgKiBpbmRleCArIDEpKVxyXG4gICAgKTtcclxuICB9XHJcbiAgLy8gY29uc29sZS5sb2coYGlzIHZhbGlkPyAke2lzVmFsaWR9YCk7XHJcbiAgY29uc3Qgbm90VGFrZW4gPSBzaGlwQmxvY2tzLmV2ZXJ5KFxyXG4gICAgKGJsb2NrKSA9PlxyXG4gICAgICAhYmxvY2suY2xhc3NMaXN0LmNvbnRhaW5zKFwiZmlsbGVkXCIpICYmXHJcbiAgICAgICFibG9jay5jbGFzc0xpc3QuY29udGFpbnMoXCJ1bmF2YWlsYWJsZVwiKVxyXG4gICk7XHJcblxyXG4gIHJldHVybiB7IHNoaXBCbG9ja3MsIGlzVmFsaWQsIG5vdFRha2VuIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFNoaXAodXNlciwgc2hpcCwgc3RhcnRJZCkge1xyXG4gIGNvbnNvbGUubG9nKFwiYWRkc2hpcFwiKTtcclxuICAvLyAgIGNvbnNvbGUubG9nKHVzZXIpO1xyXG4gIGNvbnN0IGJvYXJkQmxvY2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgIyR7dXNlcn0gZGl2YCk7XHJcbiAgY29uc3QgYm9vbCA9IE1hdGgucmFuZG9tKCkgPCAwLjU7IC8vIHJldHVybmVkIG51bWJlciBlaXRoZXIgd2lsbCBiZSBiaWdnZXIgdGhhbiAwLjUgb3Igbm90IGhlbmNlIHRoZSByYW5kb20gYm9vbFxyXG4gIGNvbnN0IGlzSG9yaXpvbnRhbCA9IHVzZXIgPT09IFwicGxheWVyXCIgPyBhbmdsZSA9PT0gMCA6IGJvb2w7XHJcbiAgY29uc3QgcmFuZG9tU3RhcnRJbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwICogMTApOyAvLyB0ZW4gdGltZXMgdGVuIGlzIHRoZSB3aWR0aCBvZiB0aGUgYm9hcmRcclxuICAvLyAgIGNvbnNvbGUubG9nKGBob3Jpem9udGFsICR7aXNIb3Jpem9udGFsfWApO1xyXG4gIC8vICAgY29uc29sZS5sb2coYHJhbmRvbSBpbmRleCAke3JhbmRvbVN0YXJ0SW5kZXh9YCk7XHJcblxyXG4gIGNvbnN0IHN0YXJ0SW5kZXggPSBzdGFydElkIHx8IHJhbmRvbVN0YXJ0SW5kZXg7XHJcbiAgLy8gICBjb25zb2xlLmxvZyhgc3RhcnQgaW5kZXggJHtzdGFydEluZGV4fWApO1xyXG5cclxuICBjb25zdCB7IHNoaXBCbG9ja3MsIGlzVmFsaWQsIG5vdFRha2VuIH0gPSBjaGVja1ZhbGlkaXR5KFxyXG4gICAgYm9hcmRCbG9ja3MsXHJcbiAgICBpc0hvcml6b250YWwsXHJcbiAgICBzdGFydEluZGV4LFxyXG4gICAgc2hpcFxyXG4gICk7XHJcblxyXG4gIC8vIGNvbnNvbGUubG9nKGBub3QgdGFrZW4/ICR7bm90VGFrZW59YCk7XHJcbiAgaWYgKGlzVmFsaWQgJiYgbm90VGFrZW4pIHtcclxuICAgIHNoaXBCbG9ja3MuZm9yRWFjaCgoYmxvY2spID0+IHtcclxuICAgICAgYmxvY2suY2xhc3NMaXN0LmFkZChzaGlwLm5hbWUpO1xyXG4gICAgICBibG9jay5jbGFzc0xpc3QuYWRkKFwiZmlsbGVkXCIpO1xyXG4gICAgfSk7XHJcbiAgICAvLyBhZGQgZmlsbGVkIGNsYXNzIHRvIGFkamFjZW50IGJsb2NrcyB0byBwcmV2ZW50IHBsYWNpbmcgc2hpcHMgc2lkZSB0byBzaWRlXHJcbiAgICBjb25zdCBhZGphY2VudEluZGV4ZXMgPSBnZXRBZGphY2VudEluZGV4ZXMoXHJcbiAgICAgIGJvYXJkQmxvY2tzLFxyXG4gICAgICBpc0hvcml6b250YWwsXHJcbiAgICAgIHNoaXBCbG9ja3NcclxuICAgICk7XHJcbiAgICBhZGphY2VudEluZGV4ZXMuZm9yRWFjaCgoYWRqYWNlbnRJbmRleCkgPT4ge1xyXG4gICAgICBjb25zdCBhZGphY2VudEJsb2NrID0gYm9hcmRCbG9ja3NbYWRqYWNlbnRJbmRleF07XHJcbiAgICAgIGFkamFjZW50QmxvY2suY2xhc3NMaXN0LmFkZChcInVuYXZhaWxhYmxlXCIpO1xyXG4gICAgfSk7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhhZGphY2VudEluZGV4ZXMpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBpZiAodXNlciA9PT0gXCJjb21wdXRlclwiKSBhZGRTaGlwKHVzZXIsIHNoaXAsIHN0YXJ0SWQpO1xyXG4gICAgaWYgKHVzZXIgPT09IFwicGxheWVyXCIpIG5vdERyb3BwZWQgPSB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxuLy8gaGVscGVyIGZ1bmN0aW9uIHRvIGdldCBhZGphY2VudCBpbmRleGVzXHJcbmZ1bmN0aW9uIGdldEFkamFjZW50SW5kZXhlcyhib2FyZEJsb2NrcywgaXNIb3Jpem9udGFsLCBzaGlwQmxvY2tzKSB7XHJcbiAgY29uc3QgYm9hcmRCbG9ja3NBcnJheSA9IFsuLi5ib2FyZEJsb2Nrc107XHJcbiAgY29uc3QgYWRqYWNlbnRJbmRleGVzID0gW107XHJcblxyXG4gIHNoaXBCbG9ja3MuZm9yRWFjaCgoYmxvY2ssIGluZGV4KSA9PiB7XHJcbiAgICBjb25zdCBibG9ja0luZGV4ID0gYm9hcmRCbG9ja3NBcnJheS5pbmRleE9mKGJsb2NrKTtcclxuICAgIGNvbnN0IHJvdyA9IE1hdGguZmxvb3IoYmxvY2tJbmRleCAvIDEwKTtcclxuICAgIGNvbnN0IGNvbCA9IGJsb2NrSW5kZXggJSAxMDtcclxuXHJcbiAgICBpZiAoaXNIb3Jpem9udGFsKSB7XHJcbiAgICAgIGlmIChjb2wgPiAwKSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4IC0gMSk7IC8vIGxlZnQgYmxvY2tcclxuICAgICAgaWYgKGNvbCA8IDkpIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggKyAxKTsgLy8gcmlnaHQgYmxvY2tcclxuICAgICAgaWYgKHJvdyA+IDApIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggLSAxMCk7IC8vIHRvcCBibG9ja1xyXG4gICAgICBpZiAocm93IDwgOSkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCArIDEwKTsgLy8gYm90dG9tIGJsb2NrXHJcbiAgICAgIGlmIChjb2wgPiAwICYmIHJvdyA+IDApIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggLSAxMSk7IC8vIHRvcC1sZWZ0IGJsb2NrXHJcbiAgICAgIGlmIChjb2wgPiAwICYmIHJvdyA8IDkpIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggKyA5KTsgLy8gYm90dG9tLWxlZnQgYmxvY2tcclxuICAgICAgaWYgKGNvbCA8IDkgJiYgcm93ID4gMCkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCAtIDkpOyAvLyB0b3AtcmlnaHQgYmxvY2tcclxuICAgICAgaWYgKGNvbCA8IDkgJiYgcm93IDwgOSkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCArIDExKTsgLy8gYm90dG9tLXJpZ2h0IGJsb2NrXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAocm93ID4gMCkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCAtIDEwKTsgLy8gdG9wIGJsb2NrXHJcbiAgICAgIGlmIChyb3cgPCA5KSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4ICsgMTApOyAvLyBib3R0b20gYmxvY2tcclxuICAgICAgaWYgKGNvbCA+IDApIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggLSAxKTsgLy8gbGVmdCBibG9ja1xyXG4gICAgICBpZiAoY29sIDwgOSkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCArIDEpOyAvLyByaWdodCBibG9ja1xyXG4gICAgICBpZiAocm93ID4gMCAmJiBjb2wgPiAwKSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4IC0gMTEpOyAvLyB0b3AtbGVmdCBibG9ja1xyXG4gICAgICBpZiAocm93ID4gMCAmJiBjb2wgPCA5KSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4IC0gOSk7IC8vIHRvcC1yaWdodCBibG9ja1xyXG4gICAgICBpZiAocm93IDwgOSAmJiBjb2wgPiAwKSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4ICsgOSk7IC8vIGJvdHRvbS1sZWZ0IGJsb2NrXHJcbiAgICAgIGlmIChyb3cgPCA5ICYmIGNvbCA8IDkpIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggKyAxMSk7IC8vIGJvdHRvbS1yaWdodCBibG9ja1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBjb25zdCB1bmlxdWVBZGphY2VudEluZGV4ZXMgPSBBcnJheS5mcm9tKG5ldyBTZXQoYWRqYWNlbnRJbmRleGVzKSk7XHJcblxyXG4gIHJldHVybiB1bmlxdWVBZGphY2VudEluZGV4ZXM7XHJcbn1cclxuLy8gYWRkU2hpcChkZXN0cm95ZXIpO1xyXG4vLyBhZGRTaGlwKHN1Ym1hcmluZSk7XHJcbi8vIGFkZFNoaXAoY3J1aXNlcik7XHJcbi8vIGFkZFNoaXAoYmF0dGxlc2hpcCk7XHJcbi8vIGFkZFNoaXAoXCJjb21wdXRlclwiLCBjYXJyaWVyKTtcclxuXHJcbi8vIERSQUcmRFJPUCBQTEFZRVIgU0hJUFNcclxubGV0IGRyYWdnZWRTaGlwO1xyXG5jb25zdCBzaGlwT3B0aW9ucyA9IEFycmF5LmZyb20oc2hpcENvbnRhaW5lci5jaGlsZHJlbik7XHJcbnNoaXBPcHRpb25zLmZvckVhY2goKHNoaXApID0+IHNoaXAuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdzdGFydFwiLCBkcmFnU3RhcnQpKTtcclxuXHJcbmNvbnN0IHBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNwbGF5ZXIgZGl2XCIpO1xyXG5wbGF5ZXJCb2FyZC5mb3JFYWNoKChibG9jaykgPT4ge1xyXG4gIGJsb2NrLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBkcmFnT3Zlcik7XHJcbiAgYmxvY2suYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgZHJvcFNoaXApO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGRyYWdTdGFydChlKSB7XHJcbiAgbm90RHJvcHBlZCA9IGZhbHNlO1xyXG4gIGRyYWdnZWRTaGlwID0gZS50YXJnZXQ7XHJcbiAgY29uc29sZS5sb2coXCJkcmFnIHN0YXJ0ZWRcIik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYWdPdmVyKGUpIHtcclxuICAvLyBjb25zb2xlLmxvZyhcImRyYWdvdmVyXCIpO1xyXG4gIC8vIGNvbnNvbGUubG9nKGUudGFyZ2V0LnBhcmVudE5vZGUpO1xyXG4gIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgaWYgKCFkcmFnZ2VkU2hpcCkgcmV0dXJuO1xyXG4gIGNvbnN0IHNoaXAgPSBzaGlwc1tkcmFnZ2VkU2hpcC5pZF07XHJcblxyXG4gIGhpZ2hsaWdodFNoaXBBcmVhKGUudGFyZ2V0LmlkLCBzaGlwKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJvcFNoaXAoZSkge1xyXG4gIGNvbnNvbGUubG9nKFwiZHJvcHNoaXBcIik7XHJcbiAgY29uc3Qgc3RhcnRJZCA9IGUudGFyZ2V0LmlkO1xyXG4gIGlmIChkcmFnZ2VkU2hpcCA9PT0gdW5kZWZpbmVkIHx8IGRyYWdnZWRTaGlwID09PSBudWxsKSByZXR1cm47XHJcbiAgY29uc3Qgc2hpcCA9IHNoaXBzW2RyYWdnZWRTaGlwLmlkXTtcclxuICAvLyBjb25zb2xlLmxvZyhzaGlwLCBcInRoaXMgaXMgc2hpcFwiKTtcclxuXHJcbiAgYWRkU2hpcChcInBsYXllclwiLCBzaGlwLCBzdGFydElkKTtcclxuICBpZiAoIW5vdERyb3BwZWQpIGRyYWdnZWRTaGlwLnJlbW92ZSgpO1xyXG4gIGlmICghc2hpcENvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiLnNoaXBcIikpIGFsbFNoaXBzUGxhY2VkID0gdHJ1ZTtcclxuICBkcmFnZ2VkU2hpcCA9IG51bGw7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhpZ2hsaWdodFNoaXBBcmVhKHN0YXJ0SW5kZXgsIHNoaXApIHtcclxuICBjb25zdCBpc0hvcml6b250YWwgPSBhbmdsZSA9PT0gMDtcclxuXHJcbiAgY29uc3QgeyBzaGlwQmxvY2tzLCBpc1ZhbGlkLCBub3RUYWtlbiB9ID0gY2hlY2tWYWxpZGl0eShcclxuICAgIHBsYXllckJvYXJkLFxyXG4gICAgaXNIb3Jpem9udGFsLFxyXG4gICAgc3RhcnRJbmRleCxcclxuICAgIHNoaXBcclxuICApO1xyXG5cclxuICBpZiAoaXNWYWxpZCAmJiBub3RUYWtlbikge1xyXG4gICAgc2hpcEJsb2Nrcy5mb3JFYWNoKChibG9jaykgPT4ge1xyXG4gICAgICBibG9jay5jbGFzc0xpc3QuYWRkKFwiaG92ZXJcIik7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gYmxvY2suY2xhc3NMaXN0LnJlbW92ZShcImhvdmVyXCIpLCA1MDApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBHQU1FIExPR0lDXHJcblxyXG5sZXQgcGxheWVyVHVybjtcclxuXHJcbi8vIHN0YXJ0IHRoZSBnYW1lXHJcblxyXG5mdW5jdGlvbiBzdGFydEdhbWVTaW5nbGUoKSB7XHJcbiAgaWYgKHBsYXllclR1cm4gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgaWYgKHNoaXBDb250YWluZXIuY2hpbGRyZW4ubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJQbGVhc2UgcGxhY2UgYWxsIHlvdXIgc2hpcHMgZmlyc3QhXCI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCBib2FyZEJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjY29tcHV0ZXIgZGl2XCIpO1xyXG4gICAgICBib2FyZEJsb2Nrcy5mb3JFYWNoKChibG9jaykgPT5cclxuICAgICAgICBibG9jay5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlQ2xpY2spXHJcbiAgICAgICk7XHJcbiAgICAgIHBsYXllclR1cm4gPSB0cnVlO1xyXG4gICAgICB0dXJuRGlzcGxheS50ZXh0Q29udGVudCA9IFwiWW91ciB0dXJuIVwiO1xyXG4gICAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9IFwiVGhlIGJhdHRsZSBoYXMgYmVndW4hXCI7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5sZXQgcGxheWVySGl0cyA9IFtdO1xyXG4vLyBsZXQgZW5lbXlIaXRzID0gW107XHJcbmxldCBjb21wdXRlckhpdHMgPSBbXTtcclxuY29uc3QgcGxheWVyU3Vua1NoaXBzID0gW107XHJcbmNvbnN0IGVuZW15U3Vua1NoaXBzID0gW107XHJcbmNvbnN0IGNvbXB1dGVyU3Vua1NoaXBzID0gW107XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVDbGljayhlKSB7XHJcbiAgY29uc29sZS5sb2coYGN1cnJlbnQgcGxheWVyOiAke2N1cnJlbnRQbGF5ZXJ9YCk7XHJcbiAgY29uc29sZS5sb2coYGN1cnJlbnQgdHVybjogJHt0dXJuTnVtfWApO1xyXG4gIC8vIGN1cnJlbnQgdHVybiBpcyBub3QgZ2V0dGluZyB1cGRhdGVkIGFmdGVyIHBsYXllciAwIHRha2VzIGl0IHNob3RcclxuXHJcbiAgaWYgKCFnYW1lT3Zlcikge1xyXG4gICAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImhpdFwiKSkgcmV0dXJuOyAvLyBkbyB0aGlzIGJldHRlclxyXG4gICAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImZpbGxlZFwiKSkge1xyXG4gICAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xyXG4gICAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9IFwiWW91IGhpdCB0aGUgZW5lbXkgc2hpcCFcIjtcclxuICAgICAgY29uc3QgY2xhc3NlcyA9IEFycmF5LmZyb20oZS50YXJnZXQuY2xhc3NMaXN0KS5maWx0ZXIoXHJcbiAgICAgICAgKG5hbWUpID0+ICFbXCJibG9ja1wiLCBcImhpdFwiLCBcImZpbGxlZFwiLCBcInVuYXZhaWxhYmxlXCJdLmluY2x1ZGVzKG5hbWUpXHJcbiAgICAgICk7XHJcbiAgICAgIC8vIG1heSBuZWVkIHRvIHVzZSBjdXJyZW50UGxheWVyIGZvciBldmVudHNcclxuICAgICAgaWYgKFxyXG4gICAgICAgIGN1cnJlbnRQbGF5ZXIgPT09IFwicGxheWVyXCIgfHxcclxuICAgICAgICBjdXJyZW50UGxheWVyID09PSBcImVuZW15XCIgfHxcclxuICAgICAgICBnYW1lTW9kZSA9PT0gXCJzaW5nbGVwbGF5ZXJcIlxyXG4gICAgICApIHtcclxuICAgICAgICBwbGF5ZXJIaXRzLnB1c2goLi4uY2xhc3Nlcyk7XHJcbiAgICAgICAgY2hlY2tTY29yZShjdXJyZW50UGxheWVyLCBwbGF5ZXJIaXRzLCBwbGF5ZXJTdW5rU2hpcHMpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBpZiAoY3VycmVudFBsYXllciA9PT0gXCJlbmVteVwiKSB7XHJcbiAgICAgIC8vICAgZW5lbXlIaXRzLnB1c2goLi4uY2xhc3Nlcyk7XHJcbiAgICAgIC8vICAgY2hlY2tTY29yZShjdXJyZW50UGxheWVyLCBlbmVteUhpdHMsIGVuZW15U3Vua1NoaXBzKTtcclxuICAgICAgLy8gfVxyXG4gICAgfVxyXG4gICAgaWYgKCFlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJmaWxsZWRcIikpIHtcclxuICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBcIk1pc3MhXCI7XHJcbiAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNvbnN0IGJvYXJkQmxvY2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNjb21wdXRlciBkaXZcIik7XHJcbiAgICAvLyBib2FyZEJsb2Nrcy5mb3JFYWNoKFxyXG4gICAgLy8gICAoYmxvY2spID0+IGJsb2NrLnJlcGxhY2VXaXRoKGJsb2NrLmNsb25lTm9kZSh0cnVlKSkgLy8gdG8gcmVtb3ZlIGV2ZW50IGxpc3RlbmVyc1xyXG4gICAgLy8gKTtcclxuXHJcbiAgICAvLyBoYW5kbGVFdmVudExpc3RlbmVycygpO1xyXG4gICAgLy8gaWYgZ2FtZW1vZGUgaXMgc2luZ2xlLCBkbyB0aGVzZT9cclxuICAgIGlmIChnYW1lTW9kZSA9PT0gXCJzaW5nbGVwbGF5ZXJcIiAmJiAhZ2FtZU92ZXIpIHtcclxuICAgICAgcGxheWVyVHVybiA9IGZhbHNlO1xyXG5cclxuICAgICAgc2V0VGltZW91dChjb21wdXRlcnNUdXJuLCAxMDApO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gZS50YXJnZXQuaWQ7IC8vIHVzZSB0aGlzIHRvIGNvbW11bmljYXRlIHdpdGggc2VydmVyP1xyXG59XHJcblxyXG4vLyBjb21wdXRlcnMgdHVyblxyXG5mdW5jdGlvbiBjb21wdXRlcnNUdXJuKCkge1xyXG4gIGlmICghZ2FtZU92ZXIpIHtcclxuICAgIHR1cm5EaXNwbGF5LnRleHRDb250ZW50ID0gXCJDb21wdXRlcnMgVHVyblwiO1xyXG4gICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBcIk1ha2luZyBjYWxjdWxhdGlvbnMuLlwiO1xyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBjb25zdCByYW5kb21TaG90ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAgKiAxMCk7XHJcbiAgICAgIGlmIChcclxuICAgICAgICBwbGF5ZXJCb2FyZFtyYW5kb21TaG90XS5jbGFzc0xpc3QuY29udGFpbnMoXCJmaWxsZWRcIikgJiZcclxuICAgICAgICBwbGF5ZXJCb2FyZFtyYW5kb21TaG90XS5jbGFzc0xpc3QuY29udGFpbnMoXCJoaXRcIikgJiZcclxuICAgICAgICBwbGF5ZXJCb2FyZFtyYW5kb21TaG90XS5jbGFzc0xpc3QuY29udGFpbnMoXCJtaXNzXCIpXHJcbiAgICAgICkge1xyXG4gICAgICAgIGNvbXB1dGVyc1R1cm4oKTtcclxuICAgICAgfSBlbHNlIGlmIChcclxuICAgICAgICBwbGF5ZXJCb2FyZFtyYW5kb21TaG90XS5jbGFzc0xpc3QuY29udGFpbnMoXCJmaWxsZWRcIikgJiZcclxuICAgICAgICAhcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGl0XCIpXHJcbiAgICAgICkge1xyXG4gICAgICAgIHBsYXllckJvYXJkW3JhbmRvbVNob3RdLmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XHJcbiAgICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBcIkhpdCB0aGUgdGFyZ2V0IVwiO1xyXG4gICAgICAgIGNvbnN0IGNsYXNzZXMgPSBBcnJheS5mcm9tKHBsYXllckJvYXJkW3JhbmRvbVNob3RdLmNsYXNzTGlzdCkuZmlsdGVyKFxyXG4gICAgICAgICAgKG5hbWUpID0+ICFbXCJibG9ja1wiLCBcImhpdFwiLCBcImZpbGxlZFwiXS5pbmNsdWRlcyhuYW1lKVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY29tcHV0ZXJIaXRzLnB1c2goLi4uY2xhc3Nlcyk7XHJcbiAgICAgICAgY2hlY2tTY29yZShcImNvbXB1dGVyXCIsIGNvbXB1dGVySGl0cywgY29tcHV0ZXJTdW5rU2hpcHMpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJNaXNzIVwiO1xyXG4gICAgICAgIHBsYXllckJvYXJkW3JhbmRvbVNob3RdLmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xyXG4gICAgICB9XHJcbiAgICB9LCA1MDApO1xyXG4gICAgY29uc3QgYm9hcmRCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI2NvbXB1dGVyIGRpdlwiKTtcclxuICAgIGJvYXJkQmxvY2tzLmZvckVhY2goXHJcbiAgICAgIChibG9jaykgPT4gYmxvY2sucmVwbGFjZVdpdGgoYmxvY2suY2xvbmVOb2RlKHRydWUpKSAvLyB0byByZW1vdmUgZXZlbnQgbGlzdGVuZXJzXHJcbiAgICApO1xyXG4gICAgaGFuZGxlRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBwbGF5ZXJUdXJuID0gdHJ1ZTtcclxuICAgICAgdHVybkRpc3BsYXkudGV4dENvbnRlbnQgPSBcIlBsYXllcidzIHR1cm5cIjtcclxuICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBcIlRha2UgeW91ciBzaG90IVwiO1xyXG5cclxuICAgICAgLy8gcmUtYWRkaW5nIGV2ZW50IGxpc3RlbmVyc1xyXG4gICAgfSwgNTAwKTtcclxuICB9XHJcbn1cclxuZnVuY3Rpb24gaGFuZGxlRXZlbnRMaXN0ZW5lcnMoKSB7XHJcbiAgY29uc3QgYm9hcmRCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI2NvbXB1dGVyIGRpdlwiKTtcclxuICBib2FyZEJsb2Nrcy5mb3JFYWNoKChibG9jaykgPT4gYmxvY2suYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUNsaWNrKSk7IC8vIHJlLWFkZGluZyBldmVudCBsaXN0ZW5lcnNcclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tTY29yZSh1c2VyLCB1c2VySGl0cywgdXNlclN1bmtTaGlwcykge1xyXG4gIGZ1bmN0aW9uIGNoZWNrU2hpcChzaGlwTmFtZSwgc2hpcExlbmd0aCkge1xyXG4gICAgaWYgKFxyXG4gICAgICB1c2VySGl0cy5maWx0ZXIoKGhpdFNoaXApID0+IGhpdFNoaXAgPT09IHNoaXBOYW1lKS5sZW5ndGggPT09IHNoaXBMZW5ndGhcclxuICAgICkge1xyXG4gICAgICBpZiAoXHJcbiAgICAgICAgdXNlciA9PT0gXCJwbGF5ZXJcIiB8fFxyXG4gICAgICAgIHVzZXIgPT09IFwiZW5lbXlcIiB8fFxyXG4gICAgICAgIGdhbWVNb2RlID09PSBcInNpbmdsZXBsYXllclwiXHJcbiAgICAgICkge1xyXG4gICAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gYFlvdSBzdW5rIHRoZSBlbmVteSAke3NoaXBOYW1lfSFgO1xyXG5cclxuICAgICAgICBwbGF5ZXJIaXRzID0gdXNlckhpdHMuZmlsdGVyKChoaXRTaGlwKSA9PiBoaXRTaGlwICE9PSBzaGlwTmFtZSk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gaWYgKHVzZXIgPT09IFwiZW5lbXlcIikge1xyXG4gICAgICAvLyAgIGVuZW15SGl0cyA9IHVzZXJIaXRzLmZpbHRlcigoaGl0U2hpcCkgPT4gaGl0U2hpcCAhPT0gc2hpcE5hbWUpO1xyXG4gICAgICAvLyB9XHJcbiAgICAgIGlmICh1c2VyID09PSBcImNvbXB1dGVyXCIpIHtcclxuICAgICAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9IGBUaGUgZW5lbXkgc3VuayB5b3VyICR7c2hpcE5hbWV9IWA7XHJcbiAgICAgICAgY29tcHV0ZXJIaXRzID0gdXNlckhpdHMuZmlsdGVyKChoaXRTaGlwKSA9PiBoaXRTaGlwICE9PSBzaGlwTmFtZSk7XHJcbiAgICAgIH1cclxuICAgICAgdXNlclN1bmtTaGlwcy5wdXNoKHNoaXBOYW1lKTtcclxuICAgIH1cclxuICB9XHJcbiAgY2hlY2tTaGlwKFwiZGVzdHJveWVyXCIsIDIpO1xyXG4gIGNoZWNrU2hpcChcInN1Ym1hcmluZVwiLCAzKTtcclxuICBjaGVja1NoaXAoXCJjcnVpc2VyXCIsIDMpO1xyXG4gIGNoZWNrU2hpcChcImJhdHRsZXNoaXBcIiwgNCk7XHJcbiAgY2hlY2tTaGlwKFwiY2FycmllclwiLCA1KTtcclxuICBjb25zb2xlLmxvZyhcInBsYXllckhpdHNcIiwgcGxheWVySGl0cyk7XHJcbiAgY29uc29sZS5sb2coXCJwbGF5ZXJTdW5rU2hpcHNcIiwgcGxheWVyU3Vua1NoaXBzKTtcclxuXHJcbiAgaWYgKHBsYXllclN1bmtTaGlwcy5sZW5ndGggPT09IDUpIHtcclxuICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID1cclxuICAgICAgXCJZb3Ugc3VuayBhbGwgdGhlIGVuZW15IHNoaXBzISBXZWxsIGZvdWdodCBhZG1pcmFsIVwiOyAvLyBnYW1lIG92ZXIgcGxheWVyIDEgd29uXHJcbiAgICBnYW1lT3ZlciA9IHRydWU7XHJcbiAgICBpZiAoZ2FtZU1vZGUgPT09IFwic2luZ2xlcGxheWVyXCIpXHJcbiAgICAgIHN0YXJ0QnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzdGFydEdhbWVTaW5nbGUpO1xyXG4gIH1cclxuICBpZiAoZW5lbXlTdW5rU2hpcHMubGVuZ2h0ID09PSA1KSB7XHJcbiAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9XHJcbiAgICAgIFwiWW91IHN1bmsgYWxsIHRoZSBlbmVteSBzaGlwcyEgV2VsbCBmb3VnaHQgYWRtaXJhbCFcIjsgLy8gZ2FtZSBvdmVyIHBsYXllciAxIHdvblxyXG4gICAgZ2FtZU92ZXIgPSB0cnVlO1xyXG4gIH1cclxuICBpZiAoY29tcHV0ZXJTdW5rU2hpcHMubGVuZ3RoID09PSA1KSB7XHJcbiAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9XHJcbiAgICAgIFwiWW91ciBmbGVldCBoYXMgYmVlbiBkZXN0cm95ZWQhIFdlbGwgZm91Z2h0IGFkbWlyYWwsIHdlJ2xsIGdldCB0aGVtIG5leHQgdGltZS5cIjtcclxuICAgIGdhbWVPdmVyID0gdHJ1ZTtcclxuICAgIHN0YXJ0QnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzdGFydEdhbWVTaW5nbGUpO1xyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=