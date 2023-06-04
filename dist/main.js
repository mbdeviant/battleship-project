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

      socket.emit("fire", shotFired, turnNum);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBLDREQUE0RDtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLXByb2plY3QvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gbXVsdGktc2luZ2xlIHBsYXllciBjb250cm9sc1xyXG5jb25zdCBzaW5nbGVQbGF5ZXJCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNpbmdsZS1wbGF5ZXItYnV0dG9uXCIpO1xyXG5jb25zdCBtdWx0aXBsYXllckJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXVsdGlwbGF5ZXItYnV0dG9uXCIpO1xyXG4vLyBzdGFydCB0aGUgZ2FtZVxyXG5jb25zdCBzdGFydEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RhcnQtYnV0dG9uXCIpO1xyXG5jb25zdCBpbmZvRGlzcGxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5mby1kaXNwbGF5XCIpO1xyXG5jb25zdCB0dXJuRGlzcGxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHVybi1kaXNwbGF5XCIpO1xyXG5cclxuLy8gQ1JFQVRJTkcgU0hJUFNcclxuY2xhc3MgU2hpcCB7XHJcbiAgY29uc3RydWN0b3IobmFtZSwgbGVuZ3RoKSB7XHJcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBkZXN0cm95ZXIgPSBuZXcgU2hpcChcImRlc3Ryb3llclwiLCAyKTtcclxuY29uc3Qgc3VibWFyaW5lID0gbmV3IFNoaXAoXCJzdWJtYXJpbmVcIiwgMyk7XHJcbmNvbnN0IGNydWlzZXIgPSBuZXcgU2hpcChcImNydWlzZXJcIiwgMyk7XHJcbmNvbnN0IGJhdHRsZXNoaXAgPSBuZXcgU2hpcChcImJhdHRsZXNoaXBcIiwgNCk7XHJcbmNvbnN0IGNhcnJpZXIgPSBuZXcgU2hpcChcImNhcnJpZXJcIiwgNSk7XHJcblxyXG5jb25zdCBzaGlwcyA9IFtkZXN0cm95ZXIsIHN1Ym1hcmluZSwgY3J1aXNlciwgYmF0dGxlc2hpcCwgY2Fycmllcl07XHJcblxyXG5jb25zdCBmbGlwQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmbGlwLWJ1dHRvblwiKTtcclxuY29uc3Qgc2hpcENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2hpcC1zZWxlY3QtY29udGFpbmVyXCIpO1xyXG5sZXQgdXNlciA9IFwicGxheWVyXCI7XHJcbmxldCBjdXJyZW50UGxheWVyID0gdXNlcjtcclxubGV0IGdhbWVNb2RlID0gXCJcIjtcclxubGV0IHBsYXllck51bSA9IDA7XHJcbmxldCB0dXJuTnVtID0gMDtcclxubGV0IHJlYWR5ID0gZmFsc2U7XHJcbmxldCBnYW1lT3ZlciA9IGZhbHNlO1xyXG5sZXQgZW5lbXlSZWFkeSA9IGZhbHNlO1xyXG5sZXQgYWxsU2hpcHNQbGFjZWQgPSBmYWxzZTtcclxubGV0IHNob3RGaXJlZCA9IC0xO1xyXG5sZXQgbm90RHJvcHBlZDtcclxubGV0IHNpbmdsZVBsYXllclN0YXJ0ZWQ7XHJcbmxldCBtdWx0aVBsYXllclN0YXJ0ZWQ7XHJcblxyXG5mdW5jdGlvbiBzdGFydE11bHRpcGxheWVyKCkge1xyXG4gIGdhbWVNb2RlID0gXCJtdWx0aXBsYXllclwiO1xyXG4gIG11bHRpUGxheWVyU3RhcnRlZCA9IHRydWU7XHJcblxyXG4gIGNvbnN0IHNvY2tldCA9IGlvKCk7XHJcblxyXG4gIC8vIGdldCBwbGF5ZXIgbnVtYmVyXHJcblxyXG4gIHNvY2tldC5vbihcInBsYXllci1udW1iZXJcIiwgKG51bSkgPT4ge1xyXG4gICAgaWYgKG51bSA9PT0gLTEpIHtcclxuICAgICAgaW5mb0Rpc3BsYXkuaW5uZXJIVE1MID0gXCJzZXJ2ZXIgaXMgZnVsbFwiO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcGxheWVyTnVtID0gcGFyc2VJbnQobnVtKTtcclxuICAgICAgaWYgKHBsYXllck51bSA9PT0gMSkgY3VycmVudFBsYXllciA9IFwiZW5lbXlcIjtcclxuICAgICAgY29uc29sZS5sb2cocGxheWVyTnVtKTtcclxuXHJcbiAgICAgIHNvY2tldC5lbWl0KFwiY2hlY2stcGxheWVyc1wiKTtcclxuICAgIH1cclxuICB9KTtcclxuICAvLyBwbGF5ZXIgY29ubmVjdGlvbiBjb250cm9sXHJcbiAgc29ja2V0Lm9uKFwicGxheWVyLWNvbm5lY3Rpb25cIiwgKG51bSkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coYHBsYXllciAke251bX0gaGFzIGNvbm5lY3RlZGApO1xyXG4gICAgY29udHJvbFBsYXllckNvbm5lY3Rpb24obnVtKTtcclxuICB9KTtcclxuXHJcbiAgLy8gZW5lbXkgcmVhZHlcclxuICBzb2NrZXQub24oXCJlbmVteS1yZWFkeVwiLCAobnVtKSA9PiB7XHJcbiAgICBlbmVteVJlYWR5ID0gdHJ1ZTtcclxuICAgIHBsYXllclJlYWR5KG51bSk7XHJcbiAgICBpZiAocmVhZHkpIHN0YXJ0R2FtZU11bHRpKHNvY2tldCk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIGNoZWNrIHBsYXllciBzdGF0dXNcclxuICBzb2NrZXQub24oXCJjaGVjay1wbGF5ZXJzXCIsIChwbGF5ZXJzKSA9PiB7XHJcbiAgICBwbGF5ZXJzLmZvckVhY2goKHBsYXllciwgaW5kZXgpID0+IHtcclxuICAgICAgaWYgKHBsYXllci5jb25uZWN0ZWQpIGNvbnRyb2xQbGF5ZXJDb25uZWN0aW9uKGluZGV4KTtcclxuICAgICAgaWYgKHBsYXllci5yZWFkeSkge1xyXG4gICAgICAgIHBsYXllclJlYWR5KGluZGV4KTtcclxuICAgICAgICBpZiAoaW5kZXggIT09IHBsYXllck51bSkgZW5lbXlSZWFkeSA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBzdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgaWYgKCFhbGxTaGlwc1BsYWNlZCkgcmV0dXJuO1xyXG4gICAgaWYgKGFsbFNoaXBzUGxhY2VkKSBzdGFydEdhbWVNdWx0aShzb2NrZXQpO1xyXG4gICAgZWxzZSBpbmZvRGlzcGxheS5pbm5lckhUTUwgPSBcInBsYWNlIGFsbCBvZiB5b3VyIHNoaXBzIGZpcnN0IVwiO1xyXG4gICAgLy8gY29uc3QgYm9hcmRCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI2NvbXB1dGVyIGRpdlwiKTtcclxuICB9KTtcclxuXHJcbiAgLy8gZXZlbnQgbGlzdGVuZXIgZm9yIGZpcmluZ1xyXG5cclxuICBjb25zdCBib2FyZEJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjY29tcHV0ZXIgZGl2XCIpO1xyXG4gIGJvYXJkQmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PiB7XHJcbiAgICBibG9jay5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgICAgLy8gaWYgKHBsYXllck51bSAhPT0gdHVybk51bSkgcmV0dXJuO1xyXG4gICAgICAvLyBpZiAodHVybk51bSA9PT0gMSB8fCAodHVybk51bSA9PT0gMCAmJiByZWFkeSAmJiBlbmVteVJlYWR5KSkge1xyXG4gICAgICAvLyB9XHJcbiAgICAgIC8vIHBsYXllck51bSA9PT0gdHVybk51bSAmJlxyXG4gICAgICAvLyBpZiAodHVybk51bSA9PT0gMSB8fCAodHVybk51bSA9PT0gMCAmJiByZWFkeSAmJiBlbmVteVJlYWR5KSkge1xyXG4gICAgICAvLyB9XHJcbiAgICAgIHNob3RGaXJlZCA9IGhhbmRsZUNsaWNrKGUpO1xyXG4gICAgICBjb25zb2xlLmxvZyhzaG90RmlyZWQpO1xyXG5cclxuICAgICAgc29ja2V0LmVtaXQoXCJmaXJlXCIsIHNob3RGaXJlZCwgdHVybk51bSk7XHJcblxyXG4gICAgICAvLyBoYW5kbGVUdXJuKCk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgc29ja2V0Lm9uKFwiZmlyZVwiLCAoaWQsIHR1cm4pID0+IHtcclxuICAgIHR1cm5OdW0gPSB0dXJuO1xyXG4gICAgc2hvdEZpcmVkID0gaWQ7XHJcbiAgICBjb25zb2xlLmxvZyhgJHt0dXJuTnVtfSB0dXJuIG51bWApO1xyXG4gIH0pO1xyXG4gIC8vIHNvY2tldC5vbihcInR1cm5DaGFuZ2VcIiwgKHR1cm4pID0+IHtcclxuICAvLyAgIGNvbnNvbGUubG9nKGAke3R1cm5OdW19IHR1cm4gbnVtYCk7XHJcbiAgLy8gICB0dXJuTnVtID0gdHVybjtcclxuICAvLyB9KTtcclxuXHJcbiAgc29ja2V0Lm9uKFwic3RhcnQtZ2FtZVwiLCAocGxheWVyMUJvYXJkRGF0YSwgcGxheWVyMkJvYXJkRGF0YSkgPT4ge1xyXG4gICAgY29uc3Qgb3Bwb25lbnRCb2FyZEJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjY29tcHV0ZXIgZGl2XCIpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3Bwb25lbnRCb2FyZEJsb2Nrcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICBjb25zdCBkYXRhSW5kZXggPSBpO1xyXG4gICAgICBvcHBvbmVudEJvYXJkQmxvY2tzW2ldLmNsYXNzTmFtZSA9XHJcbiAgICAgICAgcGxheWVyTnVtID09PSAwXHJcbiAgICAgICAgICA/IHBsYXllcjJCb2FyZERhdGFbZGF0YUluZGV4XVxyXG4gICAgICAgICAgOiBwbGF5ZXIxQm9hcmREYXRhW2RhdGFJbmRleF07XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIC8vIHJlY2VpdmluZyBmaXJlXHJcblxyXG4gIGZ1bmN0aW9uIGNvbnRyb2xQbGF5ZXJDb25uZWN0aW9uKG51bSkge1xyXG4gICAgY29uc3QgcGxheWVyID0gYC5wJHtwYXJzZUludChudW0pICsgMX1gO1xyXG4gICAgZG9jdW1lbnRcclxuICAgICAgLnF1ZXJ5U2VsZWN0b3IoYCR7cGxheWVyfSAuY29ubmVjdGVkIHNwYW5gKVxyXG4gICAgICAuY2xhc3NMaXN0LnRvZ2dsZShcImdyZWVuXCIpO1xyXG4gICAgaWYgKHBhcnNlSW50KG51bSkgPT09IHBsYXllck51bSlcclxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihwbGF5ZXIpLnN0eWxlLmZvbnRXZWlnaHQgPSBcImJvbGRcIjtcclxuICB9XHJcbn1cclxubXVsdGlwbGF5ZXJCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN0YXJ0TXVsdGlwbGF5ZXIpO1xyXG5cclxuLy8gc3RhcnQgbXVsdGlwbGF5ZXIgZ2FtZVxyXG5mdW5jdGlvbiBzdGFydEdhbWVNdWx0aShzb2NrZXQpIHtcclxuICBpZiAoZ2FtZU92ZXIpIHJldHVybjtcclxuICBjb25zb2xlLmxvZyhjdXJyZW50UGxheWVyKTtcclxuICBpZiAoIXJlYWR5KSB7XHJcbiAgICBzb2NrZXQuZW1pdChcInBsYXllci1yZWFkeVwiKTtcclxuICAgIHJlYWR5ID0gdHJ1ZTtcclxuICAgIHBsYXllclJlYWR5KHBsYXllck51bSk7XHJcbiAgfVxyXG5cclxuICBpZiAoZW5lbXlSZWFkeSkge1xyXG4gICAgaWYgKGN1cnJlbnRQbGF5ZXIgPT09IFwicGxheWVyXCIpIHtcclxuICAgICAgdHVybkRpc3BsYXkuaW5uZXJIVE1MID0gXCJ5b3VyIHR1cm5cIjtcclxuICAgIH1cclxuICAgIGlmIChjdXJyZW50UGxheWVyID09PSBcImVuZW15XCIpIHtcclxuICAgICAgdHVybkRpc3BsYXkuaW5uZXJIVE1MID0gXCJlbmVteSdzIHR1cm5cIjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjb25zdCBwbGF5ZXJCb2FyZERhdGEgPSBBcnJheS5mcm9tKFxyXG4gICAgLy8gICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI3BsYXllciBkaXZcIilcclxuICAgIC8vICkubWFwKChibG9jaykgPT4gKGJsb2NrLmNsYXNzTGlzdC5jb250YWlucyhcImZpbGxlZFwiKSA/IFwiZmlsbGVkXCIgOiBcImJsb2NrXCIpKTtcclxuICAgIGNvbnN0IHBsYXllckJvYXJkRGF0YSA9IEFycmF5LmZyb20oXHJcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjcGxheWVyIGRpdlwiKVxyXG4gICAgKS5tYXAoKGJsb2NrKSA9PiBibG9jay5jbGFzc05hbWUpO1xyXG4gICAgc29ja2V0LmVtaXQoXCJib2FyZC1kYXRhXCIsIHBsYXllckJvYXJkRGF0YSk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVUdXJuKCkge1xyXG4gIGlmICh0dXJuTnVtID09PSAwKSBjdXJyZW50UGxheWVyID0gXCJwbGF5ZXJcIjtcclxuICBpZiAodHVybk51bSA9PT0gMSkgY3VycmVudFBsYXllciA9IFwiZW5lbXlcIjtcclxufVxyXG5cclxuZnVuY3Rpb24gcGxheWVyUmVhZHkobnVtKSB7XHJcbiAgY29uc3QgcGxheWVyID0gYC5wJHtwYXJzZUludChudW0pICsgMX1gO1xyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7cGxheWVyfSAucmVhZHkgc3BhbmApLmNsYXNzTGlzdC50b2dnbGUoXCJncmVlblwiKTtcclxufVxyXG5cclxuLy8gc3RhcnQgc2luZ2xlIHBsYXllciBnYW1lXHJcbmZ1bmN0aW9uIHN0YXJ0U2luZ2xlUGxheWVyKCkge1xyXG4gIGlmIChnYW1lT3ZlcikgcmV0dXJuO1xyXG4gIGlmIChzaW5nbGVQbGF5ZXJTdGFydGVkID09PSB0cnVlKSByZXR1cm47XHJcbiAgc2luZ2xlUGxheWVyU3RhcnRlZCA9IHRydWU7XHJcbiAgZ2FtZU1vZGUgPSBcInNpbmdsZXBsYXllclwiO1xyXG4gIHVzZXIgPSBcImNvbXB1dGVyXCI7XHJcbiAgc2hpcHMuZm9yRWFjaCgoc2hpcCkgPT4gYWRkU2hpcChcImNvbXB1dGVyXCIsIHNoaXApKTtcclxuICBzdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RhcnRHYW1lU2luZ2xlKTtcclxufVxyXG5zaW5nbGVQbGF5ZXJCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN0YXJ0U2luZ2xlUGxheWVyKTtcclxuXHJcbmxldCBhbmdsZSA9IDA7XHJcbmZ1bmN0aW9uIGZsaXBTaGlwcygpIHtcclxuICBjb25zdCBzaGlwcyA9IEFycmF5LmZyb20oc2hpcENvbnRhaW5lci5jaGlsZHJlbik7XHJcbiAgYW5nbGUgPSBhbmdsZSA9PT0gMCA/IDkwIDogMDtcclxuICBzaGlwcy5mb3JFYWNoKChzaGlwKSA9PiB7XHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cclxuICAgIHNoaXAuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZSgke2FuZ2xlfWRlZylgO1xyXG4gIH0pO1xyXG59XHJcbmZsaXBCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZsaXBTaGlwcyk7XHJcblxyXG4vLyBDUkVBVElORyBHQU1FQk9BUkRcclxuZnVuY3Rpb24gY3JlYXRlQm9hcmQoY29sb3IsIHVzZXIpIHtcclxuICBjb25zdCBnYW1lQm9hcmRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWVib2FyZC1jb250YWluZXJcIik7XHJcblxyXG4gIGNvbnN0IGdhbWVCb2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgZ2FtZUJvYXJkLnNldEF0dHJpYnV0ZShcImlkXCIsIHVzZXIpO1xyXG4gIGdhbWVCb2FyZC5jbGFzc0xpc3QuYWRkKFwiZ2FtZWJvYXJkXCIpO1xyXG4gIGdhbWVCb2FyZC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvcjtcclxuXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDA7IGkgKz0gMSkge1xyXG4gICAgY29uc3QgYmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgYmxvY2suY2xhc3NMaXN0LmFkZChcImJsb2NrXCIpO1xyXG4gICAgYmxvY2suaWQgPSBpO1xyXG4gICAgZ2FtZUJvYXJkLmFwcGVuZChibG9jayk7XHJcbiAgfVxyXG5cclxuICBnYW1lQm9hcmRDb250YWluZXIuYXBwZW5kQ2hpbGQoZ2FtZUJvYXJkKTtcclxufVxyXG5cclxuY3JlYXRlQm9hcmQoXCJ3aGl0ZVwiLCB1c2VyKTtcclxuY3JlYXRlQm9hcmQoXCJnYWluc2Jvcm9cIiwgXCJjb21wdXRlclwiKTtcclxuXHJcbi8vIGNvbnNvbGUubG9nKHNoaXBzKTtcclxuXHJcbmZ1bmN0aW9uIGNoZWNrVmFsaWRpdHkoYm9hcmRCbG9ja3MsIGlzSG9yaXpvbnRhbCwgc3RhcnRJbmRleCwgc2hpcCkge1xyXG4gIC8vIHRvIHByZXZlbnQgcGxhY2luZyBzaGlwcyBvZmYgYm9hcmRcclxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmVzdGVkLXRlcm5hcnlcclxuICBjb25zdCB2YWxpZFN0YXJ0ID0gaXNIb3Jpem9udGFsXHJcbiAgICA/IHN0YXJ0SW5kZXggPD0gMTAgKiAxMCAtIHNoaXAubGVuZ3RoXHJcbiAgICAgID8gc3RhcnRJbmRleFxyXG4gICAgICA6IDEwICogMTAgLSBzaGlwLmxlbmd0aFxyXG4gICAgOiBzdGFydEluZGV4IDw9IDEwICogMTAgLSAxMCAqIHNoaXAubGVuZ3RoXHJcbiAgICA/IHN0YXJ0SW5kZXhcclxuICAgIDogc3RhcnRJbmRleCAtIHNoaXAubGVuZ3RoICogMTAgKyAxMDtcclxuICAvLyAgIGNvbnNvbGUubG9nKGB2YWxpZGF0ZWQgaSAke3ZhbGlkU3RhcnR9YCk7XHJcblxyXG4gIGNvbnN0IHNoaXBCbG9ja3MgPSBbXTtcclxuICAvLyBzYXZlIHRoZSBpbmRleGVzIG9mIHNoaXBzIHRvIGFuIGFycmF5XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICBpZiAoaXNIb3Jpem9udGFsKSBzaGlwQmxvY2tzLnB1c2goYm9hcmRCbG9ja3NbTnVtYmVyKHZhbGlkU3RhcnQpICsgaV0pO1xyXG4gICAgZWxzZSBzaGlwQmxvY2tzLnB1c2goYm9hcmRCbG9ja3NbTnVtYmVyKHZhbGlkU3RhcnQpICsgaSAqIDEwXSk7XHJcbiAgfVxyXG5cclxuICAvLyB2YWxpZGF0ZSBwbGFjZSB0byBwcmV2ZW50IHNoaXBzIGZyb20gc3BsaXR0aW5nXHJcbiAgbGV0IGlzVmFsaWQ7XHJcbiAgaWYgKGlzSG9yaXpvbnRhbCkge1xyXG4gICAgc2hpcEJsb2Nrcy5ldmVyeShcclxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJldHVybi1hc3NpZ25cclxuICAgICAgKF9ibG9jaywgaW5kZXgpID0+XHJcbiAgICAgICAgKGlzVmFsaWQgPVxyXG4gICAgICAgICAgc2hpcEJsb2Nrc1swXS5pZCAlIDEwICE9PSAxMCAtIChzaGlwQmxvY2tzLmxlbmd0aCAtIChpbmRleCArIDEpKSlcclxuICAgICk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHNoaXBCbG9ja3MuZXZlcnkoXHJcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXR1cm4tYXNzaWduXHJcbiAgICAgIChfYmxvY2ssIGluZGV4KSA9PiAoaXNWYWxpZCA9IHNoaXBCbG9ja3NbMF0uaWQgPCA5MCArICgxMCAqIGluZGV4ICsgMSkpXHJcbiAgICApO1xyXG4gIH1cclxuICAvLyBjb25zb2xlLmxvZyhgaXMgdmFsaWQ/ICR7aXNWYWxpZH1gKTtcclxuICBjb25zdCBub3RUYWtlbiA9IHNoaXBCbG9ja3MuZXZlcnkoXHJcbiAgICAoYmxvY2spID0+XHJcbiAgICAgICFibG9jay5jbGFzc0xpc3QuY29udGFpbnMoXCJmaWxsZWRcIikgJiZcclxuICAgICAgIWJsb2NrLmNsYXNzTGlzdC5jb250YWlucyhcInVuYXZhaWxhYmxlXCIpXHJcbiAgKTtcclxuXHJcbiAgcmV0dXJuIHsgc2hpcEJsb2NrcywgaXNWYWxpZCwgbm90VGFrZW4gfTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkU2hpcCh1c2VyLCBzaGlwLCBzdGFydElkKSB7XHJcbiAgY29uc29sZS5sb2coXCJhZGRzaGlwXCIpO1xyXG4gIC8vICAgY29uc29sZS5sb2codXNlcik7XHJcbiAgY29uc3QgYm9hcmRCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAjJHt1c2VyfSBkaXZgKTtcclxuICBjb25zdCBib29sID0gTWF0aC5yYW5kb20oKSA8IDAuNTsgLy8gcmV0dXJuZWQgbnVtYmVyIGVpdGhlciB3aWxsIGJlIGJpZ2dlciB0aGFuIDAuNSBvciBub3QgaGVuY2UgdGhlIHJhbmRvbSBib29sXHJcbiAgY29uc3QgaXNIb3Jpem9udGFsID0gdXNlciA9PT0gXCJwbGF5ZXJcIiA/IGFuZ2xlID09PSAwIDogYm9vbDtcclxuICBjb25zdCByYW5kb21TdGFydEluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAgKiAxMCk7IC8vIHRlbiB0aW1lcyB0ZW4gaXMgdGhlIHdpZHRoIG9mIHRoZSBib2FyZFxyXG4gIC8vICAgY29uc29sZS5sb2coYGhvcml6b250YWwgJHtpc0hvcml6b250YWx9YCk7XHJcbiAgLy8gICBjb25zb2xlLmxvZyhgcmFuZG9tIGluZGV4ICR7cmFuZG9tU3RhcnRJbmRleH1gKTtcclxuXHJcbiAgY29uc3Qgc3RhcnRJbmRleCA9IHN0YXJ0SWQgfHwgcmFuZG9tU3RhcnRJbmRleDtcclxuICAvLyAgIGNvbnNvbGUubG9nKGBzdGFydCBpbmRleCAke3N0YXJ0SW5kZXh9YCk7XHJcblxyXG4gIGNvbnN0IHsgc2hpcEJsb2NrcywgaXNWYWxpZCwgbm90VGFrZW4gfSA9IGNoZWNrVmFsaWRpdHkoXHJcbiAgICBib2FyZEJsb2NrcyxcclxuICAgIGlzSG9yaXpvbnRhbCxcclxuICAgIHN0YXJ0SW5kZXgsXHJcbiAgICBzaGlwXHJcbiAgKTtcclxuXHJcbiAgLy8gY29uc29sZS5sb2coYG5vdCB0YWtlbj8gJHtub3RUYWtlbn1gKTtcclxuICBpZiAoaXNWYWxpZCAmJiBub3RUYWtlbikge1xyXG4gICAgc2hpcEJsb2Nrcy5mb3JFYWNoKChibG9jaykgPT4ge1xyXG4gICAgICBibG9jay5jbGFzc0xpc3QuYWRkKHNoaXAubmFtZSk7XHJcbiAgICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoXCJmaWxsZWRcIik7XHJcbiAgICB9KTtcclxuICAgIC8vIGFkZCBmaWxsZWQgY2xhc3MgdG8gYWRqYWNlbnQgYmxvY2tzIHRvIHByZXZlbnQgcGxhY2luZyBzaGlwcyBzaWRlIHRvIHNpZGVcclxuICAgIGNvbnN0IGFkamFjZW50SW5kZXhlcyA9IGdldEFkamFjZW50SW5kZXhlcyhcclxuICAgICAgYm9hcmRCbG9ja3MsXHJcbiAgICAgIGlzSG9yaXpvbnRhbCxcclxuICAgICAgc2hpcEJsb2Nrc1xyXG4gICAgKTtcclxuICAgIGFkamFjZW50SW5kZXhlcy5mb3JFYWNoKChhZGphY2VudEluZGV4KSA9PiB7XHJcbiAgICAgIGNvbnN0IGFkamFjZW50QmxvY2sgPSBib2FyZEJsb2Nrc1thZGphY2VudEluZGV4XTtcclxuICAgICAgYWRqYWNlbnRCbG9jay5jbGFzc0xpc3QuYWRkKFwidW5hdmFpbGFibGVcIik7XHJcbiAgICB9KTtcclxuICAgIC8vIGNvbnNvbGUubG9nKGFkamFjZW50SW5kZXhlcyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmICh1c2VyID09PSBcImNvbXB1dGVyXCIpIGFkZFNoaXAodXNlciwgc2hpcCwgc3RhcnRJZCk7XHJcbiAgICBpZiAodXNlciA9PT0gXCJwbGF5ZXJcIikgbm90RHJvcHBlZCA9IHRydWU7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBoZWxwZXIgZnVuY3Rpb24gdG8gZ2V0IGFkamFjZW50IGluZGV4ZXNcclxuZnVuY3Rpb24gZ2V0QWRqYWNlbnRJbmRleGVzKGJvYXJkQmxvY2tzLCBpc0hvcml6b250YWwsIHNoaXBCbG9ja3MpIHtcclxuICBjb25zdCBib2FyZEJsb2Nrc0FycmF5ID0gWy4uLmJvYXJkQmxvY2tzXTtcclxuICBjb25zdCBhZGphY2VudEluZGV4ZXMgPSBbXTtcclxuXHJcbiAgc2hpcEJsb2Nrcy5mb3JFYWNoKChibG9jaywgaW5kZXgpID0+IHtcclxuICAgIGNvbnN0IGJsb2NrSW5kZXggPSBib2FyZEJsb2Nrc0FycmF5LmluZGV4T2YoYmxvY2spO1xyXG4gICAgY29uc3Qgcm93ID0gTWF0aC5mbG9vcihibG9ja0luZGV4IC8gMTApO1xyXG4gICAgY29uc3QgY29sID0gYmxvY2tJbmRleCAlIDEwO1xyXG5cclxuICAgIGlmIChpc0hvcml6b250YWwpIHtcclxuICAgICAgaWYgKGNvbCA+IDApIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggLSAxKTsgLy8gbGVmdCBibG9ja1xyXG4gICAgICBpZiAoY29sIDwgOSkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCArIDEpOyAvLyByaWdodCBibG9ja1xyXG4gICAgICBpZiAocm93ID4gMCkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCAtIDEwKTsgLy8gdG9wIGJsb2NrXHJcbiAgICAgIGlmIChyb3cgPCA5KSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4ICsgMTApOyAvLyBib3R0b20gYmxvY2tcclxuICAgICAgaWYgKGNvbCA+IDAgJiYgcm93ID4gMCkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCAtIDExKTsgLy8gdG9wLWxlZnQgYmxvY2tcclxuICAgICAgaWYgKGNvbCA+IDAgJiYgcm93IDwgOSkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCArIDkpOyAvLyBib3R0b20tbGVmdCBibG9ja1xyXG4gICAgICBpZiAoY29sIDwgOSAmJiByb3cgPiAwKSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4IC0gOSk7IC8vIHRvcC1yaWdodCBibG9ja1xyXG4gICAgICBpZiAoY29sIDwgOSAmJiByb3cgPCA5KSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4ICsgMTEpOyAvLyBib3R0b20tcmlnaHQgYmxvY2tcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChyb3cgPiAwKSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4IC0gMTApOyAvLyB0b3AgYmxvY2tcclxuICAgICAgaWYgKHJvdyA8IDkpIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggKyAxMCk7IC8vIGJvdHRvbSBibG9ja1xyXG4gICAgICBpZiAoY29sID4gMCkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCAtIDEpOyAvLyBsZWZ0IGJsb2NrXHJcbiAgICAgIGlmIChjb2wgPCA5KSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4ICsgMSk7IC8vIHJpZ2h0IGJsb2NrXHJcbiAgICAgIGlmIChyb3cgPiAwICYmIGNvbCA+IDApIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggLSAxMSk7IC8vIHRvcC1sZWZ0IGJsb2NrXHJcbiAgICAgIGlmIChyb3cgPiAwICYmIGNvbCA8IDkpIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggLSA5KTsgLy8gdG9wLXJpZ2h0IGJsb2NrXHJcbiAgICAgIGlmIChyb3cgPCA5ICYmIGNvbCA+IDApIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggKyA5KTsgLy8gYm90dG9tLWxlZnQgYmxvY2tcclxuICAgICAgaWYgKHJvdyA8IDkgJiYgY29sIDwgOSkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCArIDExKTsgLy8gYm90dG9tLXJpZ2h0IGJsb2NrXHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHVuaXF1ZUFkamFjZW50SW5kZXhlcyA9IEFycmF5LmZyb20obmV3IFNldChhZGphY2VudEluZGV4ZXMpKTtcclxuXHJcbiAgcmV0dXJuIHVuaXF1ZUFkamFjZW50SW5kZXhlcztcclxufVxyXG4vLyBhZGRTaGlwKGRlc3Ryb3llcik7XHJcbi8vIGFkZFNoaXAoc3VibWFyaW5lKTtcclxuLy8gYWRkU2hpcChjcnVpc2VyKTtcclxuLy8gYWRkU2hpcChiYXR0bGVzaGlwKTtcclxuLy8gYWRkU2hpcChcImNvbXB1dGVyXCIsIGNhcnJpZXIpO1xyXG5cclxuLy8gRFJBRyZEUk9QIFBMQVlFUiBTSElQU1xyXG5sZXQgZHJhZ2dlZFNoaXA7XHJcbmNvbnN0IHNoaXBPcHRpb25zID0gQXJyYXkuZnJvbShzaGlwQ29udGFpbmVyLmNoaWxkcmVuKTtcclxuc2hpcE9wdGlvbnMuZm9yRWFjaCgoc2hpcCkgPT4gc2hpcC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ3N0YXJ0XCIsIGRyYWdTdGFydCkpO1xyXG5cclxuY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI3BsYXllciBkaXZcIik7XHJcbnBsYXllckJvYXJkLmZvckVhY2goKGJsb2NrKSA9PiB7XHJcbiAgYmxvY2suYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIGRyYWdPdmVyKTtcclxuICBibG9jay5hZGRFdmVudExpc3RlbmVyKFwiZHJvcFwiLCBkcm9wU2hpcCk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gZHJhZ1N0YXJ0KGUpIHtcclxuICBub3REcm9wcGVkID0gZmFsc2U7XHJcbiAgZHJhZ2dlZFNoaXAgPSBlLnRhcmdldDtcclxuICBjb25zb2xlLmxvZyhcImRyYWcgc3RhcnRlZFwiKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhZ092ZXIoZSkge1xyXG4gIC8vIGNvbnNvbGUubG9nKFwiZHJhZ292ZXJcIik7XHJcbiAgLy8gY29uc29sZS5sb2coZS50YXJnZXQucGFyZW50Tm9kZSk7XHJcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICBpZiAoIWRyYWdnZWRTaGlwKSByZXR1cm47XHJcbiAgY29uc3Qgc2hpcCA9IHNoaXBzW2RyYWdnZWRTaGlwLmlkXTtcclxuXHJcbiAgaGlnaGxpZ2h0U2hpcEFyZWEoZS50YXJnZXQuaWQsIHNoaXApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcm9wU2hpcChlKSB7XHJcbiAgY29uc29sZS5sb2coXCJkcm9wc2hpcFwiKTtcclxuICBjb25zdCBzdGFydElkID0gZS50YXJnZXQuaWQ7XHJcbiAgaWYgKGRyYWdnZWRTaGlwID09PSB1bmRlZmluZWQgfHwgZHJhZ2dlZFNoaXAgPT09IG51bGwpIHJldHVybjtcclxuICBjb25zdCBzaGlwID0gc2hpcHNbZHJhZ2dlZFNoaXAuaWRdO1xyXG4gIC8vIGNvbnNvbGUubG9nKHNoaXAsIFwidGhpcyBpcyBzaGlwXCIpO1xyXG5cclxuICBhZGRTaGlwKFwicGxheWVyXCIsIHNoaXAsIHN0YXJ0SWQpO1xyXG4gIGlmICghbm90RHJvcHBlZCkgZHJhZ2dlZFNoaXAucmVtb3ZlKCk7XHJcbiAgaWYgKCFzaGlwQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIuc2hpcFwiKSkgYWxsU2hpcHNQbGFjZWQgPSB0cnVlO1xyXG4gIGRyYWdnZWRTaGlwID0gbnVsbDtcclxufVxyXG5cclxuZnVuY3Rpb24gaGlnaGxpZ2h0U2hpcEFyZWEoc3RhcnRJbmRleCwgc2hpcCkge1xyXG4gIGNvbnN0IGlzSG9yaXpvbnRhbCA9IGFuZ2xlID09PSAwO1xyXG5cclxuICBjb25zdCB7IHNoaXBCbG9ja3MsIGlzVmFsaWQsIG5vdFRha2VuIH0gPSBjaGVja1ZhbGlkaXR5KFxyXG4gICAgcGxheWVyQm9hcmQsXHJcbiAgICBpc0hvcml6b250YWwsXHJcbiAgICBzdGFydEluZGV4LFxyXG4gICAgc2hpcFxyXG4gICk7XHJcblxyXG4gIGlmIChpc1ZhbGlkICYmIG5vdFRha2VuKSB7XHJcbiAgICBzaGlwQmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PiB7XHJcbiAgICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoXCJob3ZlclwiKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiBibG9jay5jbGFzc0xpc3QucmVtb3ZlKFwiaG92ZXJcIiksIDUwMCk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbi8vIEdBTUUgTE9HSUNcclxuXHJcbmxldCBwbGF5ZXJUdXJuO1xyXG5cclxuLy8gc3RhcnQgdGhlIGdhbWVcclxuXHJcbmZ1bmN0aW9uIHN0YXJ0R2FtZVNpbmdsZSgpIHtcclxuICBpZiAocGxheWVyVHVybiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICBpZiAoc2hpcENvbnRhaW5lci5jaGlsZHJlbi5sZW5ndGggIT09IDApIHtcclxuICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBcIlBsZWFzZSBwbGFjZSBhbGwgeW91ciBzaGlwcyBmaXJzdCFcIjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IGJvYXJkQmxvY2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNjb21wdXRlciBkaXZcIik7XHJcbiAgICAgIGJvYXJkQmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PlxyXG4gICAgICAgIGJsb2NrLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVDbGljaylcclxuICAgICAgKTtcclxuICAgICAgcGxheWVyVHVybiA9IHRydWU7XHJcbiAgICAgIHR1cm5EaXNwbGF5LnRleHRDb250ZW50ID0gXCJZb3VyIHR1cm4hXCI7XHJcbiAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJUaGUgYmF0dGxlIGhhcyBiZWd1biFcIjtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmxldCBwbGF5ZXJIaXRzID0gW107XHJcbi8vIGxldCBlbmVteUhpdHMgPSBbXTtcclxubGV0IGNvbXB1dGVySGl0cyA9IFtdO1xyXG5jb25zdCBwbGF5ZXJTdW5rU2hpcHMgPSBbXTtcclxuY29uc3QgZW5lbXlTdW5rU2hpcHMgPSBbXTtcclxuY29uc3QgY29tcHV0ZXJTdW5rU2hpcHMgPSBbXTtcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUNsaWNrKGUpIHtcclxuICBjb25zb2xlLmxvZyhgY3VycmVudCBwbGF5ZXI6ICR7Y3VycmVudFBsYXllcn1gKTtcclxuICBjb25zb2xlLmxvZyhgY3VycmVudCB0dXJuOiAke3R1cm5OdW19YCk7XHJcbiAgLy8gY3VycmVudCB0dXJuIGlzIG5vdCBnZXR0aW5nIHVwZGF0ZWQgYWZ0ZXIgcGxheWVyIDAgdGFrZXMgaXQgc2hvdFxyXG5cclxuICBpZiAoIWdhbWVPdmVyKSB7XHJcbiAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGl0XCIpKSByZXR1cm47IC8vIGRvIHRoaXMgYmV0dGVyXHJcbiAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZmlsbGVkXCIpKSB7XHJcbiAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XHJcbiAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJZb3UgaGl0IHRoZSBlbmVteSBzaGlwIVwiO1xyXG4gICAgICBjb25zdCBjbGFzc2VzID0gQXJyYXkuZnJvbShlLnRhcmdldC5jbGFzc0xpc3QpLmZpbHRlcihcclxuICAgICAgICAobmFtZSkgPT4gIVtcImJsb2NrXCIsIFwiaGl0XCIsIFwiZmlsbGVkXCIsIFwidW5hdmFpbGFibGVcIl0uaW5jbHVkZXMobmFtZSlcclxuICAgICAgKTtcclxuICAgICAgLy8gbWF5IG5lZWQgdG8gdXNlIGN1cnJlbnRQbGF5ZXIgZm9yIGV2ZW50c1xyXG4gICAgICBpZiAoXHJcbiAgICAgICAgY3VycmVudFBsYXllciA9PT0gXCJwbGF5ZXJcIiB8fFxyXG4gICAgICAgIGN1cnJlbnRQbGF5ZXIgPT09IFwiZW5lbXlcIiB8fFxyXG4gICAgICAgIGdhbWVNb2RlID09PSBcInNpbmdsZXBsYXllclwiXHJcbiAgICAgICkge1xyXG4gICAgICAgIHBsYXllckhpdHMucHVzaCguLi5jbGFzc2VzKTtcclxuICAgICAgICBjaGVja1Njb3JlKGN1cnJlbnRQbGF5ZXIsIHBsYXllckhpdHMsIHBsYXllclN1bmtTaGlwcyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGlmIChjdXJyZW50UGxheWVyID09PSBcImVuZW15XCIpIHtcclxuICAgICAgLy8gICBlbmVteUhpdHMucHVzaCguLi5jbGFzc2VzKTtcclxuICAgICAgLy8gICBjaGVja1Njb3JlKGN1cnJlbnRQbGF5ZXIsIGVuZW15SGl0cywgZW5lbXlTdW5rU2hpcHMpO1xyXG4gICAgICAvLyB9XHJcbiAgICB9XHJcbiAgICBpZiAoIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImZpbGxlZFwiKSkge1xyXG4gICAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9IFwiTWlzcyFcIjtcclxuICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmFkZChcIm1pc3NcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY29uc3QgYm9hcmRCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI2NvbXB1dGVyIGRpdlwiKTtcclxuICAgIC8vIGJvYXJkQmxvY2tzLmZvckVhY2goXHJcbiAgICAvLyAgIChibG9jaykgPT4gYmxvY2sucmVwbGFjZVdpdGgoYmxvY2suY2xvbmVOb2RlKHRydWUpKSAvLyB0byByZW1vdmUgZXZlbnQgbGlzdGVuZXJzXHJcbiAgICAvLyApO1xyXG5cclxuICAgIC8vIGhhbmRsZUV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICAvLyBpZiBnYW1lbW9kZSBpcyBzaW5nbGUsIGRvIHRoZXNlP1xyXG4gICAgaWYgKGdhbWVNb2RlID09PSBcInNpbmdsZXBsYXllclwiICYmICFnYW1lT3Zlcikge1xyXG4gICAgICBwbGF5ZXJUdXJuID0gZmFsc2U7XHJcblxyXG4gICAgICBzZXRUaW1lb3V0KGNvbXB1dGVyc1R1cm4sIDEwMCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBlLnRhcmdldC5pZDsgLy8gdXNlIHRoaXMgdG8gY29tbXVuaWNhdGUgd2l0aCBzZXJ2ZXI/XHJcbn1cclxuXHJcbi8vIGNvbXB1dGVycyB0dXJuXHJcbmZ1bmN0aW9uIGNvbXB1dGVyc1R1cm4oKSB7XHJcbiAgaWYgKCFnYW1lT3Zlcikge1xyXG4gICAgdHVybkRpc3BsYXkudGV4dENvbnRlbnQgPSBcIkNvbXB1dGVycyBUdXJuXCI7XHJcbiAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9IFwiTWFraW5nIGNhbGN1bGF0aW9ucy4uXCI7XHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGNvbnN0IHJhbmRvbVNob3QgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCAqIDEwKTtcclxuICAgICAgaWYgKFxyXG4gICAgICAgIHBsYXllckJvYXJkW3JhbmRvbVNob3RdLmNsYXNzTGlzdC5jb250YWlucyhcImZpbGxlZFwiKSAmJlxyXG4gICAgICAgIHBsYXllckJvYXJkW3JhbmRvbVNob3RdLmNsYXNzTGlzdC5jb250YWlucyhcImhpdFwiKSAmJlxyXG4gICAgICAgIHBsYXllckJvYXJkW3JhbmRvbVNob3RdLmNsYXNzTGlzdC5jb250YWlucyhcIm1pc3NcIilcclxuICAgICAgKSB7XHJcbiAgICAgICAgY29tcHV0ZXJzVHVybigpO1xyXG4gICAgICB9IGVsc2UgaWYgKFxyXG4gICAgICAgIHBsYXllckJvYXJkW3JhbmRvbVNob3RdLmNsYXNzTGlzdC5jb250YWlucyhcImZpbGxlZFwiKSAmJlxyXG4gICAgICAgICFwbGF5ZXJCb2FyZFtyYW5kb21TaG90XS5jbGFzc0xpc3QuY29udGFpbnMoXCJoaXRcIilcclxuICAgICAgKSB7XHJcbiAgICAgICAgcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmFkZChcImhpdFwiKTtcclxuICAgICAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9IFwiSGl0IHRoZSB0YXJnZXQhXCI7XHJcbiAgICAgICAgY29uc3QgY2xhc3NlcyA9IEFycmF5LmZyb20ocGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0KS5maWx0ZXIoXHJcbiAgICAgICAgICAobmFtZSkgPT4gIVtcImJsb2NrXCIsIFwiaGl0XCIsIFwiZmlsbGVkXCJdLmluY2x1ZGVzKG5hbWUpXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjb21wdXRlckhpdHMucHVzaCguLi5jbGFzc2VzKTtcclxuICAgICAgICBjaGVja1Njb3JlKFwiY29tcHV0ZXJcIiwgY29tcHV0ZXJIaXRzLCBjb21wdXRlclN1bmtTaGlwcyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBcIk1pc3MhXCI7XHJcbiAgICAgICAgcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmFkZChcIm1pc3NcIik7XHJcbiAgICAgIH1cclxuICAgIH0sIDUwMCk7XHJcbiAgICBjb25zdCBib2FyZEJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjY29tcHV0ZXIgZGl2XCIpO1xyXG4gICAgYm9hcmRCbG9ja3MuZm9yRWFjaChcclxuICAgICAgKGJsb2NrKSA9PiBibG9jay5yZXBsYWNlV2l0aChibG9jay5jbG9uZU5vZGUodHJ1ZSkpIC8vIHRvIHJlbW92ZSBldmVudCBsaXN0ZW5lcnNcclxuICAgICk7XHJcbiAgICBoYW5kbGVFdmVudExpc3RlbmVycygpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHBsYXllclR1cm4gPSB0cnVlO1xyXG4gICAgICB0dXJuRGlzcGxheS50ZXh0Q29udGVudCA9IFwiUGxheWVyJ3MgdHVyblwiO1xyXG4gICAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9IFwiVGFrZSB5b3VyIHNob3QhXCI7XHJcblxyXG4gICAgICAvLyByZS1hZGRpbmcgZXZlbnQgbGlzdGVuZXJzXHJcbiAgICB9LCA1MDApO1xyXG4gIH1cclxufVxyXG5mdW5jdGlvbiBoYW5kbGVFdmVudExpc3RlbmVycygpIHtcclxuICBjb25zdCBib2FyZEJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjY29tcHV0ZXIgZGl2XCIpO1xyXG4gIGJvYXJkQmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PiBibG9jay5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlQ2xpY2spKTsgLy8gcmUtYWRkaW5nIGV2ZW50IGxpc3RlbmVyc1xyXG59XHJcblxyXG5mdW5jdGlvbiBjaGVja1Njb3JlKHVzZXIsIHVzZXJIaXRzLCB1c2VyU3Vua1NoaXBzKSB7XHJcbiAgZnVuY3Rpb24gY2hlY2tTaGlwKHNoaXBOYW1lLCBzaGlwTGVuZ3RoKSB7XHJcbiAgICBpZiAoXHJcbiAgICAgIHVzZXJIaXRzLmZpbHRlcigoaGl0U2hpcCkgPT4gaGl0U2hpcCA9PT0gc2hpcE5hbWUpLmxlbmd0aCA9PT0gc2hpcExlbmd0aFxyXG4gICAgKSB7XHJcbiAgICAgIGlmIChcclxuICAgICAgICB1c2VyID09PSBcInBsYXllclwiIHx8XHJcbiAgICAgICAgdXNlciA9PT0gXCJlbmVteVwiIHx8XHJcbiAgICAgICAgZ2FtZU1vZGUgPT09IFwic2luZ2xlcGxheWVyXCJcclxuICAgICAgKSB7XHJcbiAgICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBgWW91IHN1bmsgdGhlIGVuZW15ICR7c2hpcE5hbWV9IWA7XHJcblxyXG4gICAgICAgIHBsYXllckhpdHMgPSB1c2VySGl0cy5maWx0ZXIoKGhpdFNoaXApID0+IGhpdFNoaXAgIT09IHNoaXBOYW1lKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBpZiAodXNlciA9PT0gXCJlbmVteVwiKSB7XHJcbiAgICAgIC8vICAgZW5lbXlIaXRzID0gdXNlckhpdHMuZmlsdGVyKChoaXRTaGlwKSA9PiBoaXRTaGlwICE9PSBzaGlwTmFtZSk7XHJcbiAgICAgIC8vIH1cclxuICAgICAgaWYgKHVzZXIgPT09IFwiY29tcHV0ZXJcIikge1xyXG4gICAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gYFRoZSBlbmVteSBzdW5rIHlvdXIgJHtzaGlwTmFtZX0hYDtcclxuICAgICAgICBjb21wdXRlckhpdHMgPSB1c2VySGl0cy5maWx0ZXIoKGhpdFNoaXApID0+IGhpdFNoaXAgIT09IHNoaXBOYW1lKTtcclxuICAgICAgfVxyXG4gICAgICB1c2VyU3Vua1NoaXBzLnB1c2goc2hpcE5hbWUpO1xyXG4gICAgfVxyXG4gIH1cclxuICBjaGVja1NoaXAoXCJkZXN0cm95ZXJcIiwgMik7XHJcbiAgY2hlY2tTaGlwKFwic3VibWFyaW5lXCIsIDMpO1xyXG4gIGNoZWNrU2hpcChcImNydWlzZXJcIiwgMyk7XHJcbiAgY2hlY2tTaGlwKFwiYmF0dGxlc2hpcFwiLCA0KTtcclxuICBjaGVja1NoaXAoXCJjYXJyaWVyXCIsIDUpO1xyXG4gIGNvbnNvbGUubG9nKFwicGxheWVySGl0c1wiLCBwbGF5ZXJIaXRzKTtcclxuICBjb25zb2xlLmxvZyhcInBsYXllclN1bmtTaGlwc1wiLCBwbGF5ZXJTdW5rU2hpcHMpO1xyXG5cclxuICBpZiAocGxheWVyU3Vua1NoaXBzLmxlbmd0aCA9PT0gNSkge1xyXG4gICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPVxyXG4gICAgICBcIllvdSBzdW5rIGFsbCB0aGUgZW5lbXkgc2hpcHMhIFdlbGwgZm91Z2h0IGFkbWlyYWwhXCI7IC8vIGdhbWUgb3ZlciBwbGF5ZXIgMSB3b25cclxuICAgIGdhbWVPdmVyID0gdHJ1ZTtcclxuICAgIGlmIChnYW1lTW9kZSA9PT0gXCJzaW5nbGVwbGF5ZXJcIilcclxuICAgICAgc3RhcnRCdXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN0YXJ0R2FtZVNpbmdsZSk7XHJcbiAgfVxyXG4gIGlmIChlbmVteVN1bmtTaGlwcy5sZW5naHQgPT09IDUpIHtcclxuICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID1cclxuICAgICAgXCJZb3Ugc3VuayBhbGwgdGhlIGVuZW15IHNoaXBzISBXZWxsIGZvdWdodCBhZG1pcmFsIVwiOyAvLyBnYW1lIG92ZXIgcGxheWVyIDEgd29uXHJcbiAgICBnYW1lT3ZlciA9IHRydWU7XHJcbiAgfVxyXG4gIGlmIChjb21wdXRlclN1bmtTaGlwcy5sZW5ndGggPT09IDUpIHtcclxuICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID1cclxuICAgICAgXCJZb3VyIGZsZWV0IGhhcyBiZWVuIGRlc3Ryb3llZCEgV2VsbCBmb3VnaHQgYWRtaXJhbCwgd2UnbGwgZ2V0IHRoZW0gbmV4dCB0aW1lLlwiO1xyXG4gICAgZ2FtZU92ZXIgPSB0cnVlO1xyXG4gICAgc3RhcnRCdXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN0YXJ0R2FtZVNpbmdsZSk7XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==