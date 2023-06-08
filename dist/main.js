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
  if (multiPlayerStarted) return;
  if (singlePlayerStarted) return;
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
      // console.log(playerNum);

      socket.emit("check-players");
    }
  });
  // player connection control
  socket.on("player-connection", (num) => {
    // console.log(`player ${num} has connected`);
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

  boardBlocks.forEach((block) => {
    block.addEventListener("click", (e) => {
      if (turnNum === playerNum) {
        if (gameOver) return;
        if (!allShipsPlaced) {
          infoDisplay.innerHTML = "lütfen önce gemilerinizi yerleştirin!";
          return;
        }
        if (!enemyReady) {
          infoDisplay.innerHTML = "lütfen rakibinizi bekleyin";
          return;
        }
        shotFired = handleClick(e);
        console.log(enemyReady);

        turnNum = (turnNum + 1) % 2;

        socket.emit("turn-change", turnNum);
        socket.emit("fire", shotFired, turnNum);
        socket.emit("gameover", gameOver);
      } else turnDisplay.innerHTML = "not your turn";
    });
  });

  let playerBoardData;
  socket.on("fire", (id) => {
    const block = document.querySelector(`#player div[id='${id}']`);
    const isHit = Array.from(playerBoardData).some((node) => node.id === id);
    // do something else if it's already hit.
    if (isHit) block.classList.add("hit");
    else block.classList.add("miss");

    console.log(`the enemy shot your ${id} block!`);
  });

  socket.on("start-game", (player1BoardData, player2BoardData) => {
    const opponentBoardBlocks = document.querySelectorAll("#computer div");
    playerBoardData = document.querySelectorAll("#player div.filled");
    console.log(playerBoardData);

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
  if (singlePlayerStarted) return;
  if (multiPlayerStarted) return;
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
}

function dragOver(e) {
  // console.log("dragover");
  // console.log(e.target.parentNode);
  e.preventDefault();

  if (!draggedShip) return;
  const ship = ships[draggedShip.id];

  // highlightShipArea(e.target.id, ship);
}

function dropShip(e) {
  const startId = e.target.id;
  if (draggedShip === undefined || draggedShip === null) return;
  const ship = ships[draggedShip.id];
  // console.log(ship, "this is ship");

  addShip("player", ship, startId);
  if (!notDropped) draggedShip.remove();
  if (!shipContainer.querySelector(".ship")) allShipsPlaced = true;
  draggedShip = null;
}

// function highlightShipArea(startIndex, ship) {
//   const isHorizontal = angle === 0;

//   const { shipBlocks, isValid, notTaken } = checkValidity(
//     playerBoard,
//     isHorizontal,
//     startIndex,
//     ship
//   );

//   if (isValid && notTaken) {
//     shipBlocks.forEach((block) => {
//       block.classList.add("hover");
//       setTimeout(() => block.classList.remove("hover"), 500);
//     });
//   }
// }

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
  // current turn is not getting updated after player 0 takes it shot

  if (!gameOver && allShipsPlaced) {
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

      setTimeout(computersTurn, 250);
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
    }, 250);
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
    }, 250);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDREQUE0RDtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBNEQ7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1wcm9qZWN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIG11bHRpLXNpbmdsZSBwbGF5ZXIgY29udHJvbHNcclxuY29uc3Qgc2luZ2xlUGxheWVyQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaW5nbGUtcGxheWVyLWJ1dHRvblwiKTtcclxuY29uc3QgbXVsdGlwbGF5ZXJCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm11bHRpcGxheWVyLWJ1dHRvblwiKTtcclxuLy8gc3RhcnQgdGhlIGdhbWVcclxuY29uc3Qgc3RhcnRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0YXJ0LWJ1dHRvblwiKTtcclxuY29uc3QgaW5mb0Rpc3BsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluZm8tZGlzcGxheVwiKTtcclxuY29uc3QgdHVybkRpc3BsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR1cm4tZGlzcGxheVwiKTtcclxuXHJcbmxldCBwbGF5ZXJIaXRzID0gW107XHJcbi8vIGxldCBlbmVteUhpdHMgPSBbXTtcclxubGV0IGNvbXB1dGVySGl0cyA9IFtdO1xyXG5jb25zdCBwbGF5ZXJTdW5rU2hpcHMgPSBbXTtcclxuY29uc3QgZW5lbXlTdW5rU2hpcHMgPSBbXTtcclxuY29uc3QgY29tcHV0ZXJTdW5rU2hpcHMgPSBbXTtcclxuXHJcbi8vIENSRUFUSU5HIFNISVBTXHJcbmNsYXNzIFNoaXAge1xyXG4gIGNvbnN0cnVjdG9yKG5hbWUsIGxlbmd0aCkge1xyXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgZGVzdHJveWVyID0gbmV3IFNoaXAoXCJkZXN0cm95ZXJcIiwgMik7XHJcbmNvbnN0IHN1Ym1hcmluZSA9IG5ldyBTaGlwKFwic3VibWFyaW5lXCIsIDMpO1xyXG5jb25zdCBjcnVpc2VyID0gbmV3IFNoaXAoXCJjcnVpc2VyXCIsIDMpO1xyXG5jb25zdCBiYXR0bGVzaGlwID0gbmV3IFNoaXAoXCJiYXR0bGVzaGlwXCIsIDQpO1xyXG5jb25zdCBjYXJyaWVyID0gbmV3IFNoaXAoXCJjYXJyaWVyXCIsIDUpO1xyXG5cclxuY29uc3Qgc2hpcHMgPSBbZGVzdHJveWVyLCBzdWJtYXJpbmUsIGNydWlzZXIsIGJhdHRsZXNoaXAsIGNhcnJpZXJdO1xyXG5cclxuY29uc3QgZmxpcEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmxpcC1idXR0b25cIik7XHJcbmNvbnN0IHNoaXBDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNoaXAtc2VsZWN0LWNvbnRhaW5lclwiKTtcclxubGV0IHVzZXIgPSBcInBsYXllclwiO1xyXG5sZXQgY3VycmVudFBsYXllciA9IHVzZXI7XHJcbmxldCBnYW1lTW9kZSA9IFwiXCI7XHJcbmxldCBwbGF5ZXJOdW0gPSAwO1xyXG5sZXQgdHVybk51bSA9IDA7XHJcbmxldCByZWFkeSA9IGZhbHNlO1xyXG5sZXQgZ2FtZU92ZXIgPSBmYWxzZTtcclxubGV0IGVuZW15UmVhZHkgPSBmYWxzZTtcclxubGV0IGFsbFNoaXBzUGxhY2VkID0gZmFsc2U7XHJcbmxldCBzaG90RmlyZWQgPSAtMTtcclxubGV0IG5vdERyb3BwZWQ7XHJcbmxldCBzaW5nbGVQbGF5ZXJTdGFydGVkO1xyXG5sZXQgbXVsdGlQbGF5ZXJTdGFydGVkO1xyXG5cclxuZnVuY3Rpb24gc3RhcnRNdWx0aXBsYXllcigpIHtcclxuICBpZiAobXVsdGlQbGF5ZXJTdGFydGVkKSByZXR1cm47XHJcbiAgaWYgKHNpbmdsZVBsYXllclN0YXJ0ZWQpIHJldHVybjtcclxuICBtdWx0aVBsYXllclN0YXJ0ZWQgPSB0cnVlO1xyXG4gIGdhbWVNb2RlID0gXCJtdWx0aXBsYXllclwiO1xyXG5cclxuICBjb25zdCBzb2NrZXQgPSBpbygpO1xyXG5cclxuICAvLyBnZXQgcGxheWVyIG51bWJlclxyXG5cclxuICBzb2NrZXQub24oXCJwbGF5ZXItbnVtYmVyXCIsIChudW0pID0+IHtcclxuICAgIGlmIChudW0gPT09IC0xKSB7XHJcbiAgICAgIGluZm9EaXNwbGF5LmlubmVySFRNTCA9IFwic2VydmVyIGlzIGZ1bGxcIjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHBsYXllck51bSA9IHBhcnNlSW50KG51bSk7XHJcbiAgICAgIGlmIChwbGF5ZXJOdW0gPT09IDEpIGN1cnJlbnRQbGF5ZXIgPSBcImVuZW15XCI7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHBsYXllck51bSk7XHJcblxyXG4gICAgICBzb2NrZXQuZW1pdChcImNoZWNrLXBsYXllcnNcIik7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgLy8gcGxheWVyIGNvbm5lY3Rpb24gY29udHJvbFxyXG4gIHNvY2tldC5vbihcInBsYXllci1jb25uZWN0aW9uXCIsIChudW0pID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKGBwbGF5ZXIgJHtudW19IGhhcyBjb25uZWN0ZWRgKTtcclxuICAgIGNvbnRyb2xQbGF5ZXJDb25uZWN0aW9uKG51bSk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIGVuZW15IHJlYWR5XHJcbiAgc29ja2V0Lm9uKFwiZW5lbXktcmVhZHlcIiwgKG51bSkgPT4ge1xyXG4gICAgZW5lbXlSZWFkeSA9IHRydWU7XHJcbiAgICBwbGF5ZXJSZWFkeShudW0pO1xyXG4gICAgaWYgKHJlYWR5KSBzdGFydEdhbWVNdWx0aShzb2NrZXQpO1xyXG4gIH0pO1xyXG5cclxuICAvLyBjaGVjayBwbGF5ZXIgc3RhdHVzXHJcbiAgc29ja2V0Lm9uKFwiY2hlY2stcGxheWVyc1wiLCAocGxheWVycykgPT4ge1xyXG4gICAgcGxheWVycy5mb3JFYWNoKChwbGF5ZXIsIGluZGV4KSA9PiB7XHJcbiAgICAgIGlmIChwbGF5ZXIuY29ubmVjdGVkKSBjb250cm9sUGxheWVyQ29ubmVjdGlvbihpbmRleCk7XHJcbiAgICAgIGlmIChwbGF5ZXIucmVhZHkpIHtcclxuICAgICAgICBwbGF5ZXJSZWFkeShpbmRleCk7XHJcbiAgICAgICAgaWYgKGluZGV4ICE9PSBwbGF5ZXJOdW0pIGVuZW15UmVhZHkgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgc3RhcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgIGlmICghYWxsU2hpcHNQbGFjZWQpIHJldHVybjtcclxuICAgIGlmIChhbGxTaGlwc1BsYWNlZCkgc3RhcnRHYW1lTXVsdGkoc29ja2V0KTtcclxuICAgIGVsc2UgaW5mb0Rpc3BsYXkuaW5uZXJIVE1MID0gXCJwbGFjZSBhbGwgb2YgeW91ciBzaGlwcyBmaXJzdCFcIjtcclxuICAgIC8vIGNvbnN0IGJvYXJkQmxvY2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNjb21wdXRlciBkaXZcIik7XHJcbiAgfSk7XHJcblxyXG4gIC8vIGV2ZW50IGxpc3RlbmVyIGZvciBmaXJpbmdcclxuXHJcbiAgY29uc3QgYm9hcmRCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI2NvbXB1dGVyIGRpdlwiKTtcclxuICBzb2NrZXQub24oXCJ0dXJuLWNoYW5nZVwiLCAodHVybikgPT4ge1xyXG4gICAgdHVybk51bSA9IHR1cm47XHJcbiAgICBpZiAodHVybk51bSA9PT0gcGxheWVyTnVtKSB0dXJuRGlzcGxheS5pbm5lckhUTUwgPSBcInlvdXIgdHVyblwiO1xyXG4gICAgZWxzZSB0dXJuRGlzcGxheS5pbm5lckhUTUwgPSBcImVuZW15J3MgdHVyblwiO1xyXG4gIH0pO1xyXG4gIHNvY2tldC5vbihcImdhbWVvdmVyXCIsIChzdGF0dXMpID0+IHtcclxuICAgIGdhbWVPdmVyID0gc3RhdHVzO1xyXG4gICAgaWYgKGdhbWVPdmVyKSB7XHJcbiAgICAgIHR1cm5EaXNwbGF5LnRleHRDb250ZW50ID0gXCJsYSBveXVuIGJpdHRpXCI7XHJcbiAgICAgIGlmIChwbGF5ZXJTdW5rU2hpcHMubGVuZ3RoICE9PSA1KSBpbmZvRGlzcGxheS5pbm5lckhUTUwgPSBcInlvdSBsb3N0XCI7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIGJvYXJkQmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PiB7XHJcbiAgICBibG9jay5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgICAgaWYgKHR1cm5OdW0gPT09IHBsYXllck51bSkge1xyXG4gICAgICAgIGlmIChnYW1lT3ZlcikgcmV0dXJuO1xyXG4gICAgICAgIGlmICghYWxsU2hpcHNQbGFjZWQpIHtcclxuICAgICAgICAgIGluZm9EaXNwbGF5LmlubmVySFRNTCA9IFwibMO8dGZlbiDDtm5jZSBnZW1pbGVyaW5pemkgeWVybGXFn3RpcmluIVwiO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWVuZW15UmVhZHkpIHtcclxuICAgICAgICAgIGluZm9EaXNwbGF5LmlubmVySFRNTCA9IFwibMO8dGZlbiByYWtpYmluaXppIGJla2xleWluXCI7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNob3RGaXJlZCA9IGhhbmRsZUNsaWNrKGUpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVuZW15UmVhZHkpO1xyXG5cclxuICAgICAgICB0dXJuTnVtID0gKHR1cm5OdW0gKyAxKSAlIDI7XHJcblxyXG4gICAgICAgIHNvY2tldC5lbWl0KFwidHVybi1jaGFuZ2VcIiwgdHVybk51bSk7XHJcbiAgICAgICAgc29ja2V0LmVtaXQoXCJmaXJlXCIsIHNob3RGaXJlZCwgdHVybk51bSk7XHJcbiAgICAgICAgc29ja2V0LmVtaXQoXCJnYW1lb3ZlclwiLCBnYW1lT3Zlcik7XHJcbiAgICAgIH0gZWxzZSB0dXJuRGlzcGxheS5pbm5lckhUTUwgPSBcIm5vdCB5b3VyIHR1cm5cIjtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBsZXQgcGxheWVyQm9hcmREYXRhO1xyXG4gIHNvY2tldC5vbihcImZpcmVcIiwgKGlkKSA9PiB7XHJcbiAgICBjb25zdCBibG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGF5ZXIgZGl2W2lkPScke2lkfSddYCk7XHJcbiAgICBjb25zdCBpc0hpdCA9IEFycmF5LmZyb20ocGxheWVyQm9hcmREYXRhKS5zb21lKChub2RlKSA9PiBub2RlLmlkID09PSBpZCk7XHJcbiAgICAvLyBkbyBzb21ldGhpbmcgZWxzZSBpZiBpdCdzIGFscmVhZHkgaGl0LlxyXG4gICAgaWYgKGlzSGl0KSBibG9jay5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xyXG4gICAgZWxzZSBibG9jay5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhgdGhlIGVuZW15IHNob3QgeW91ciAke2lkfSBibG9jayFgKTtcclxuICB9KTtcclxuXHJcbiAgc29ja2V0Lm9uKFwic3RhcnQtZ2FtZVwiLCAocGxheWVyMUJvYXJkRGF0YSwgcGxheWVyMkJvYXJkRGF0YSkgPT4ge1xyXG4gICAgY29uc3Qgb3Bwb25lbnRCb2FyZEJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjY29tcHV0ZXIgZGl2XCIpO1xyXG4gICAgcGxheWVyQm9hcmREYXRhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNwbGF5ZXIgZGl2LmZpbGxlZFwiKTtcclxuICAgIGNvbnNvbGUubG9nKHBsYXllckJvYXJkRGF0YSk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHBvbmVudEJvYXJkQmxvY2tzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIGNvbnN0IGRhdGFJbmRleCA9IGk7XHJcbiAgICAgIG9wcG9uZW50Qm9hcmRCbG9ja3NbaV0uY2xhc3NOYW1lID1cclxuICAgICAgICBwbGF5ZXJOdW0gPT09IDBcclxuICAgICAgICAgID8gcGxheWVyMkJvYXJkRGF0YVtkYXRhSW5kZXhdXHJcbiAgICAgICAgICA6IHBsYXllcjFCb2FyZERhdGFbZGF0YUluZGV4XTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgLy8gcmVjZWl2aW5nIGZpcmVcclxuXHJcbiAgZnVuY3Rpb24gY29udHJvbFBsYXllckNvbm5lY3Rpb24obnVtKSB7XHJcbiAgICBjb25zdCBwbGF5ZXIgPSBgLnAke3BhcnNlSW50KG51bSkgKyAxfWA7XHJcbiAgICBkb2N1bWVudFxyXG4gICAgICAucXVlcnlTZWxlY3RvcihgJHtwbGF5ZXJ9IC5jb25uZWN0ZWQgc3BhbmApXHJcbiAgICAgIC5jbGFzc0xpc3QudG9nZ2xlKFwiZ3JlZW5cIik7XHJcbiAgICBpZiAocGFyc2VJbnQobnVtKSA9PT0gcGxheWVyTnVtKVxyXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHBsYXllcikuc3R5bGUuZm9udFdlaWdodCA9IFwiYm9sZFwiO1xyXG4gIH1cclxufVxyXG5cclxubXVsdGlwbGF5ZXJCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN0YXJ0TXVsdGlwbGF5ZXIpO1xyXG5cclxuLy8gc3RhcnQgbXVsdGlwbGF5ZXIgZ2FtZVxyXG5mdW5jdGlvbiBzdGFydEdhbWVNdWx0aShzb2NrZXQpIHtcclxuICBpZiAoZ2FtZU92ZXIpIHJldHVybjtcclxuICBjb25zb2xlLmxvZyhjdXJyZW50UGxheWVyKTtcclxuICBpZiAoIXJlYWR5KSB7XHJcbiAgICBzb2NrZXQuZW1pdChcInBsYXllci1yZWFkeVwiKTtcclxuICAgIHJlYWR5ID0gdHJ1ZTtcclxuICAgIHBsYXllclJlYWR5KHBsYXllck51bSk7XHJcbiAgfVxyXG5cclxuICBpZiAoZW5lbXlSZWFkeSkge1xyXG4gICAgaWYgKGN1cnJlbnRQbGF5ZXIgPT09IFwicGxheWVyXCIpIHtcclxuICAgICAgdHVybkRpc3BsYXkuaW5uZXJIVE1MID0gXCJ5b3VyIHR1cm5cIjtcclxuICAgIH1cclxuICAgIGlmIChjdXJyZW50UGxheWVyID09PSBcImVuZW15XCIpIHtcclxuICAgICAgdHVybkRpc3BsYXkuaW5uZXJIVE1MID0gXCJlbmVteSdzIHR1cm5cIjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBwbGF5ZXJCb2FyZERhdGEgPSBBcnJheS5mcm9tKFxyXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI3BsYXllciBkaXZcIilcclxuICAgICkubWFwKChibG9jaykgPT4gYmxvY2suY2xhc3NOYW1lKTtcclxuICAgIHNvY2tldC5lbWl0KFwiYm9hcmQtZGF0YVwiLCBwbGF5ZXJCb2FyZERhdGEpO1xyXG4gIH1cclxufVxyXG5mdW5jdGlvbiBoYW5kbGVHYW1lb3ZlcigpIHtcclxuICAvLyBjaGVjayBmb3IgY3VycmVudCBwbGF5ZXIgc3VuayBzaGlwIGxpc3QgYW5kXHJcbiAgLy8gaWYgaXQncyA1LCB0aGVuIGN1cnJlbnQgcGxheWVyIHdvblxyXG4gIC8vIGlmIG5vdCwgZW5lbXkgd29uXHJcbiAgaWYgKHBsYXllclN1bmtTaGlwcy5sZW5ndGggPT09IDUpIGluZm9EaXNwbGF5LmlubmVySFRNTCA9IFwieW91IHdvblwiO1xyXG4gIGVsc2UgaW5mb0Rpc3BsYXkuaW5uZXJIVE1MID0gXCJ5b3UgbG9zdFwiO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwbGF5ZXJSZWFkeShudW0pIHtcclxuICBjb25zdCBwbGF5ZXIgPSBgLnAke3BhcnNlSW50KG51bSkgKyAxfWA7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgJHtwbGF5ZXJ9IC5yZWFkeSBzcGFuYCkuY2xhc3NMaXN0LnRvZ2dsZShcImdyZWVuXCIpO1xyXG59XHJcblxyXG4vLyBzdGFydCBzaW5nbGUgcGxheWVyIGdhbWVcclxuZnVuY3Rpb24gc3RhcnRTaW5nbGVQbGF5ZXIoKSB7XHJcbiAgaWYgKGdhbWVPdmVyKSByZXR1cm47XHJcbiAgaWYgKHNpbmdsZVBsYXllclN0YXJ0ZWQpIHJldHVybjtcclxuICBpZiAobXVsdGlQbGF5ZXJTdGFydGVkKSByZXR1cm47XHJcbiAgc2luZ2xlUGxheWVyU3RhcnRlZCA9IHRydWU7XHJcbiAgZ2FtZU1vZGUgPSBcInNpbmdsZXBsYXllclwiO1xyXG4gIHVzZXIgPSBcImNvbXB1dGVyXCI7XHJcbiAgc2hpcHMuZm9yRWFjaCgoc2hpcCkgPT4gYWRkU2hpcChcImNvbXB1dGVyXCIsIHNoaXApKTtcclxuICBzdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RhcnRHYW1lU2luZ2xlKTtcclxufVxyXG5zaW5nbGVQbGF5ZXJCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN0YXJ0U2luZ2xlUGxheWVyKTtcclxuXHJcbmxldCBhbmdsZSA9IDA7XHJcbmZ1bmN0aW9uIGZsaXBTaGlwcygpIHtcclxuICBjb25zdCBzaGlwcyA9IEFycmF5LmZyb20oc2hpcENvbnRhaW5lci5jaGlsZHJlbik7XHJcbiAgYW5nbGUgPSBhbmdsZSA9PT0gMCA/IDkwIDogMDtcclxuICBzaGlwcy5mb3JFYWNoKChzaGlwKSA9PiB7XHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cclxuICAgIHNoaXAuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZSgke2FuZ2xlfWRlZylgO1xyXG4gIH0pO1xyXG59XHJcbmZsaXBCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZsaXBTaGlwcyk7XHJcblxyXG4vLyBDUkVBVElORyBHQU1FQk9BUkRcclxuZnVuY3Rpb24gY3JlYXRlQm9hcmQoY29sb3IsIHVzZXIpIHtcclxuICBjb25zdCBnYW1lQm9hcmRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWVib2FyZC1jb250YWluZXJcIik7XHJcblxyXG4gIGNvbnN0IGdhbWVCb2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgZ2FtZUJvYXJkLnNldEF0dHJpYnV0ZShcImlkXCIsIHVzZXIpO1xyXG4gIGdhbWVCb2FyZC5jbGFzc0xpc3QuYWRkKFwiZ2FtZWJvYXJkXCIpO1xyXG4gIGdhbWVCb2FyZC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvcjtcclxuXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDA7IGkgKz0gMSkge1xyXG4gICAgY29uc3QgYmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgYmxvY2suY2xhc3NMaXN0LmFkZChcImJsb2NrXCIpO1xyXG4gICAgYmxvY2suaWQgPSBpO1xyXG4gICAgZ2FtZUJvYXJkLmFwcGVuZChibG9jayk7XHJcbiAgfVxyXG5cclxuICBnYW1lQm9hcmRDb250YWluZXIuYXBwZW5kQ2hpbGQoZ2FtZUJvYXJkKTtcclxufVxyXG5cclxuY3JlYXRlQm9hcmQoXCJ3aGl0ZVwiLCB1c2VyKTtcclxuY3JlYXRlQm9hcmQoXCJnYWluc2Jvcm9cIiwgXCJjb21wdXRlclwiKTtcclxuXHJcbi8vIGNvbnNvbGUubG9nKHNoaXBzKTtcclxuXHJcbmZ1bmN0aW9uIGNoZWNrVmFsaWRpdHkoYm9hcmRCbG9ja3MsIGlzSG9yaXpvbnRhbCwgc3RhcnRJbmRleCwgc2hpcCkge1xyXG4gIC8vIHRvIHByZXZlbnQgcGxhY2luZyBzaGlwcyBvZmYgYm9hcmRcclxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmVzdGVkLXRlcm5hcnlcclxuICBjb25zdCB2YWxpZFN0YXJ0ID0gaXNIb3Jpem9udGFsXHJcbiAgICA/IHN0YXJ0SW5kZXggPD0gMTAgKiAxMCAtIHNoaXAubGVuZ3RoXHJcbiAgICAgID8gc3RhcnRJbmRleFxyXG4gICAgICA6IDEwICogMTAgLSBzaGlwLmxlbmd0aFxyXG4gICAgOiBzdGFydEluZGV4IDw9IDEwICogMTAgLSAxMCAqIHNoaXAubGVuZ3RoXHJcbiAgICA/IHN0YXJ0SW5kZXhcclxuICAgIDogc3RhcnRJbmRleCAtIHNoaXAubGVuZ3RoICogMTAgKyAxMDtcclxuICAvLyAgIGNvbnNvbGUubG9nKGB2YWxpZGF0ZWQgaSAke3ZhbGlkU3RhcnR9YCk7XHJcblxyXG4gIGNvbnN0IHNoaXBCbG9ja3MgPSBbXTtcclxuICAvLyBzYXZlIHRoZSBpbmRleGVzIG9mIHNoaXBzIHRvIGFuIGFycmF5XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICBpZiAoaXNIb3Jpem9udGFsKSBzaGlwQmxvY2tzLnB1c2goYm9hcmRCbG9ja3NbTnVtYmVyKHZhbGlkU3RhcnQpICsgaV0pO1xyXG4gICAgZWxzZSBzaGlwQmxvY2tzLnB1c2goYm9hcmRCbG9ja3NbTnVtYmVyKHZhbGlkU3RhcnQpICsgaSAqIDEwXSk7XHJcbiAgfVxyXG5cclxuICAvLyB2YWxpZGF0ZSBwbGFjZSB0byBwcmV2ZW50IHNoaXBzIGZyb20gc3BsaXR0aW5nXHJcbiAgbGV0IGlzVmFsaWQ7XHJcbiAgaWYgKGlzSG9yaXpvbnRhbCkge1xyXG4gICAgc2hpcEJsb2Nrcy5ldmVyeShcclxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJldHVybi1hc3NpZ25cclxuICAgICAgKF9ibG9jaywgaW5kZXgpID0+XHJcbiAgICAgICAgKGlzVmFsaWQgPVxyXG4gICAgICAgICAgc2hpcEJsb2Nrc1swXS5pZCAlIDEwICE9PSAxMCAtIChzaGlwQmxvY2tzLmxlbmd0aCAtIChpbmRleCArIDEpKSlcclxuICAgICk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHNoaXBCbG9ja3MuZXZlcnkoXHJcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXR1cm4tYXNzaWduXHJcbiAgICAgIChfYmxvY2ssIGluZGV4KSA9PiAoaXNWYWxpZCA9IHNoaXBCbG9ja3NbMF0uaWQgPCA5MCArICgxMCAqIGluZGV4ICsgMSkpXHJcbiAgICApO1xyXG4gIH1cclxuICAvLyBjb25zb2xlLmxvZyhgaXMgdmFsaWQ/ICR7aXNWYWxpZH1gKTtcclxuICBjb25zdCBub3RUYWtlbiA9IHNoaXBCbG9ja3MuZXZlcnkoXHJcbiAgICAoYmxvY2spID0+XHJcbiAgICAgICFibG9jay5jbGFzc0xpc3QuY29udGFpbnMoXCJmaWxsZWRcIikgJiZcclxuICAgICAgIWJsb2NrLmNsYXNzTGlzdC5jb250YWlucyhcInVuYXZhaWxhYmxlXCIpXHJcbiAgKTtcclxuXHJcbiAgcmV0dXJuIHsgc2hpcEJsb2NrcywgaXNWYWxpZCwgbm90VGFrZW4gfTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkU2hpcCh1c2VyLCBzaGlwLCBzdGFydElkKSB7XHJcbiAgLy8gICBjb25zb2xlLmxvZyh1c2VyKTtcclxuICBjb25zdCBib2FyZEJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYCMke3VzZXJ9IGRpdmApO1xyXG4gIGNvbnN0IGJvb2wgPSBNYXRoLnJhbmRvbSgpIDwgMC41OyAvLyByZXR1cm5lZCBudW1iZXIgZWl0aGVyIHdpbGwgYmUgYmlnZ2VyIHRoYW4gMC41IG9yIG5vdCBoZW5jZSB0aGUgcmFuZG9tIGJvb2xcclxuICBjb25zdCBpc0hvcml6b250YWwgPSB1c2VyID09PSBcInBsYXllclwiID8gYW5nbGUgPT09IDAgOiBib29sO1xyXG4gIGNvbnN0IHJhbmRvbVN0YXJ0SW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCAqIDEwKTsgLy8gdGVuIHRpbWVzIHRlbiBpcyB0aGUgd2lkdGggb2YgdGhlIGJvYXJkXHJcbiAgLy8gICBjb25zb2xlLmxvZyhgaG9yaXpvbnRhbCAke2lzSG9yaXpvbnRhbH1gKTtcclxuICAvLyAgIGNvbnNvbGUubG9nKGByYW5kb20gaW5kZXggJHtyYW5kb21TdGFydEluZGV4fWApO1xyXG5cclxuICBjb25zdCBzdGFydEluZGV4ID0gc3RhcnRJZCB8fCByYW5kb21TdGFydEluZGV4O1xyXG4gIC8vICAgY29uc29sZS5sb2coYHN0YXJ0IGluZGV4ICR7c3RhcnRJbmRleH1gKTtcclxuXHJcbiAgY29uc3QgeyBzaGlwQmxvY2tzLCBpc1ZhbGlkLCBub3RUYWtlbiB9ID0gY2hlY2tWYWxpZGl0eShcclxuICAgIGJvYXJkQmxvY2tzLFxyXG4gICAgaXNIb3Jpem9udGFsLFxyXG4gICAgc3RhcnRJbmRleCxcclxuICAgIHNoaXBcclxuICApO1xyXG5cclxuICAvLyBjb25zb2xlLmxvZyhgbm90IHRha2VuPyAke25vdFRha2VufWApO1xyXG4gIGlmIChpc1ZhbGlkICYmIG5vdFRha2VuKSB7XHJcbiAgICBzaGlwQmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PiB7XHJcbiAgICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoc2hpcC5uYW1lKTtcclxuICAgICAgYmxvY2suY2xhc3NMaXN0LmFkZChcImZpbGxlZFwiKTtcclxuICAgIH0pO1xyXG4gICAgLy8gYWRkIGZpbGxlZCBjbGFzcyB0byBhZGphY2VudCBibG9ja3MgdG8gcHJldmVudCBwbGFjaW5nIHNoaXBzIHNpZGUgdG8gc2lkZVxyXG4gICAgY29uc3QgYWRqYWNlbnRJbmRleGVzID0gZ2V0QWRqYWNlbnRJbmRleGVzKFxyXG4gICAgICBib2FyZEJsb2NrcyxcclxuICAgICAgaXNIb3Jpem9udGFsLFxyXG4gICAgICBzaGlwQmxvY2tzXHJcbiAgICApO1xyXG4gICAgYWRqYWNlbnRJbmRleGVzLmZvckVhY2goKGFkamFjZW50SW5kZXgpID0+IHtcclxuICAgICAgY29uc3QgYWRqYWNlbnRCbG9jayA9IGJvYXJkQmxvY2tzW2FkamFjZW50SW5kZXhdO1xyXG4gICAgICBhZGphY2VudEJsb2NrLmNsYXNzTGlzdC5hZGQoXCJ1bmF2YWlsYWJsZVwiKTtcclxuICAgIH0pO1xyXG4gICAgLy8gY29uc29sZS5sb2coYWRqYWNlbnRJbmRleGVzKTtcclxuICB9IGVsc2Uge1xyXG4gICAgaWYgKHVzZXIgPT09IFwiY29tcHV0ZXJcIikgYWRkU2hpcCh1c2VyLCBzaGlwLCBzdGFydElkKTtcclxuICAgIGlmICh1c2VyID09PSBcInBsYXllclwiKSBub3REcm9wcGVkID0gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcbi8vIGhlbHBlciBmdW5jdGlvbiB0byBnZXQgYWRqYWNlbnQgaW5kZXhlc1xyXG5mdW5jdGlvbiBnZXRBZGphY2VudEluZGV4ZXMoYm9hcmRCbG9ja3MsIGlzSG9yaXpvbnRhbCwgc2hpcEJsb2Nrcykge1xyXG4gIGNvbnN0IGJvYXJkQmxvY2tzQXJyYXkgPSBbLi4uYm9hcmRCbG9ja3NdO1xyXG4gIGNvbnN0IGFkamFjZW50SW5kZXhlcyA9IFtdO1xyXG5cclxuICBzaGlwQmxvY2tzLmZvckVhY2goKGJsb2NrLCBpbmRleCkgPT4ge1xyXG4gICAgY29uc3QgYmxvY2tJbmRleCA9IGJvYXJkQmxvY2tzQXJyYXkuaW5kZXhPZihibG9jayk7XHJcbiAgICBjb25zdCByb3cgPSBNYXRoLmZsb29yKGJsb2NrSW5kZXggLyAxMCk7XHJcbiAgICBjb25zdCBjb2wgPSBibG9ja0luZGV4ICUgMTA7XHJcblxyXG4gICAgaWYgKGlzSG9yaXpvbnRhbCkge1xyXG4gICAgICBpZiAoY29sID4gMCkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCAtIDEpOyAvLyBsZWZ0IGJsb2NrXHJcbiAgICAgIGlmIChjb2wgPCA5KSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4ICsgMSk7IC8vIHJpZ2h0IGJsb2NrXHJcbiAgICAgIGlmIChyb3cgPiAwKSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4IC0gMTApOyAvLyB0b3AgYmxvY2tcclxuICAgICAgaWYgKHJvdyA8IDkpIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggKyAxMCk7IC8vIGJvdHRvbSBibG9ja1xyXG4gICAgICBpZiAoY29sID4gMCAmJiByb3cgPiAwKSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4IC0gMTEpOyAvLyB0b3AtbGVmdCBibG9ja1xyXG4gICAgICBpZiAoY29sID4gMCAmJiByb3cgPCA5KSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4ICsgOSk7IC8vIGJvdHRvbS1sZWZ0IGJsb2NrXHJcbiAgICAgIGlmIChjb2wgPCA5ICYmIHJvdyA+IDApIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggLSA5KTsgLy8gdG9wLXJpZ2h0IGJsb2NrXHJcbiAgICAgIGlmIChjb2wgPCA5ICYmIHJvdyA8IDkpIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggKyAxMSk7IC8vIGJvdHRvbS1yaWdodCBibG9ja1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHJvdyA+IDApIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggLSAxMCk7IC8vIHRvcCBibG9ja1xyXG4gICAgICBpZiAocm93IDwgOSkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCArIDEwKTsgLy8gYm90dG9tIGJsb2NrXHJcbiAgICAgIGlmIChjb2wgPiAwKSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4IC0gMSk7IC8vIGxlZnQgYmxvY2tcclxuICAgICAgaWYgKGNvbCA8IDkpIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggKyAxKTsgLy8gcmlnaHQgYmxvY2tcclxuICAgICAgaWYgKHJvdyA+IDAgJiYgY29sID4gMCkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCAtIDExKTsgLy8gdG9wLWxlZnQgYmxvY2tcclxuICAgICAgaWYgKHJvdyA+IDAgJiYgY29sIDwgOSkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCAtIDkpOyAvLyB0b3AtcmlnaHQgYmxvY2tcclxuICAgICAgaWYgKHJvdyA8IDkgJiYgY29sID4gMCkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCArIDkpOyAvLyBib3R0b20tbGVmdCBibG9ja1xyXG4gICAgICBpZiAocm93IDwgOSAmJiBjb2wgPCA5KSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4ICsgMTEpOyAvLyBib3R0b20tcmlnaHQgYmxvY2tcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgY29uc3QgdW5pcXVlQWRqYWNlbnRJbmRleGVzID0gQXJyYXkuZnJvbShuZXcgU2V0KGFkamFjZW50SW5kZXhlcykpO1xyXG5cclxuICByZXR1cm4gdW5pcXVlQWRqYWNlbnRJbmRleGVzO1xyXG59XHJcblxyXG4vLyBEUkFHJkRST1AgUExBWUVSIFNISVBTXHJcbmxldCBkcmFnZ2VkU2hpcDtcclxuY29uc3Qgc2hpcE9wdGlvbnMgPSBBcnJheS5mcm9tKHNoaXBDb250YWluZXIuY2hpbGRyZW4pO1xyXG5zaGlwT3B0aW9ucy5mb3JFYWNoKChzaGlwKSA9PiBzaGlwLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnc3RhcnRcIiwgZHJhZ1N0YXJ0KSk7XHJcblxyXG5jb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjcGxheWVyIGRpdlwiKTtcclxucGxheWVyQm9hcmQuZm9yRWFjaCgoYmxvY2spID0+IHtcclxuICBibG9jay5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgZHJhZ092ZXIpO1xyXG4gIGJsb2NrLmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIGRyb3BTaGlwKTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBkcmFnU3RhcnQoZSkge1xyXG4gIG5vdERyb3BwZWQgPSBmYWxzZTtcclxuICBkcmFnZ2VkU2hpcCA9IGUudGFyZ2V0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmFnT3ZlcihlKSB7XHJcbiAgLy8gY29uc29sZS5sb2coXCJkcmFnb3ZlclwiKTtcclxuICAvLyBjb25zb2xlLmxvZyhlLnRhcmdldC5wYXJlbnROb2RlKTtcclxuICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gIGlmICghZHJhZ2dlZFNoaXApIHJldHVybjtcclxuICBjb25zdCBzaGlwID0gc2hpcHNbZHJhZ2dlZFNoaXAuaWRdO1xyXG5cclxuICAvLyBoaWdobGlnaHRTaGlwQXJlYShlLnRhcmdldC5pZCwgc2hpcCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyb3BTaGlwKGUpIHtcclxuICBjb25zdCBzdGFydElkID0gZS50YXJnZXQuaWQ7XHJcbiAgaWYgKGRyYWdnZWRTaGlwID09PSB1bmRlZmluZWQgfHwgZHJhZ2dlZFNoaXAgPT09IG51bGwpIHJldHVybjtcclxuICBjb25zdCBzaGlwID0gc2hpcHNbZHJhZ2dlZFNoaXAuaWRdO1xyXG4gIC8vIGNvbnNvbGUubG9nKHNoaXAsIFwidGhpcyBpcyBzaGlwXCIpO1xyXG5cclxuICBhZGRTaGlwKFwicGxheWVyXCIsIHNoaXAsIHN0YXJ0SWQpO1xyXG4gIGlmICghbm90RHJvcHBlZCkgZHJhZ2dlZFNoaXAucmVtb3ZlKCk7XHJcbiAgaWYgKCFzaGlwQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIuc2hpcFwiKSkgYWxsU2hpcHNQbGFjZWQgPSB0cnVlO1xyXG4gIGRyYWdnZWRTaGlwID0gbnVsbDtcclxufVxyXG5cclxuLy8gZnVuY3Rpb24gaGlnaGxpZ2h0U2hpcEFyZWEoc3RhcnRJbmRleCwgc2hpcCkge1xyXG4vLyAgIGNvbnN0IGlzSG9yaXpvbnRhbCA9IGFuZ2xlID09PSAwO1xyXG5cclxuLy8gICBjb25zdCB7IHNoaXBCbG9ja3MsIGlzVmFsaWQsIG5vdFRha2VuIH0gPSBjaGVja1ZhbGlkaXR5KFxyXG4vLyAgICAgcGxheWVyQm9hcmQsXHJcbi8vICAgICBpc0hvcml6b250YWwsXHJcbi8vICAgICBzdGFydEluZGV4LFxyXG4vLyAgICAgc2hpcFxyXG4vLyAgICk7XHJcblxyXG4vLyAgIGlmIChpc1ZhbGlkICYmIG5vdFRha2VuKSB7XHJcbi8vICAgICBzaGlwQmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PiB7XHJcbi8vICAgICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoXCJob3ZlclwiKTtcclxuLy8gICAgICAgc2V0VGltZW91dCgoKSA9PiBibG9jay5jbGFzc0xpc3QucmVtb3ZlKFwiaG92ZXJcIiksIDUwMCk7XHJcbi8vICAgICB9KTtcclxuLy8gICB9XHJcbi8vIH1cclxuXHJcbi8vIEdBTUUgTE9HSUNcclxuXHJcbmxldCBwbGF5ZXJUdXJuO1xyXG5cclxuLy8gc3RhcnQgdGhlIGdhbWVcclxuXHJcbmZ1bmN0aW9uIHN0YXJ0R2FtZVNpbmdsZSgpIHtcclxuICBpZiAocGxheWVyVHVybiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICBpZiAoc2hpcENvbnRhaW5lci5jaGlsZHJlbi5sZW5ndGggIT09IDApIHtcclxuICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBcIlBsZWFzZSBwbGFjZSBhbGwgeW91ciBzaGlwcyBmaXJzdCFcIjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IGJvYXJkQmxvY2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNjb21wdXRlciBkaXZcIik7XHJcbiAgICAgIGJvYXJkQmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PlxyXG4gICAgICAgIGJsb2NrLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVDbGljaylcclxuICAgICAgKTtcclxuICAgICAgcGxheWVyVHVybiA9IHRydWU7XHJcbiAgICAgIHR1cm5EaXNwbGF5LnRleHRDb250ZW50ID0gXCJZb3VyIHR1cm4hXCI7XHJcbiAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJUaGUgYmF0dGxlIGhhcyBiZWd1biFcIjtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUNsaWNrKGUpIHtcclxuICAvLyBjdXJyZW50IHR1cm4gaXMgbm90IGdldHRpbmcgdXBkYXRlZCBhZnRlciBwbGF5ZXIgMCB0YWtlcyBpdCBzaG90XHJcblxyXG4gIGlmICghZ2FtZU92ZXIgJiYgYWxsU2hpcHNQbGFjZWQpIHtcclxuICAgIGlmIChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJoaXRcIikpIHJldHVybjsgLy8gZG8gdGhpcyBiZXR0ZXJcclxuICAgIGlmIChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJmaWxsZWRcIikpIHtcclxuICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmFkZChcImhpdFwiKTtcclxuICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBcIllvdSBoaXQgdGhlIGVuZW15IHNoaXAhXCI7XHJcbiAgICAgIGNvbnN0IGNsYXNzZXMgPSBBcnJheS5mcm9tKGUudGFyZ2V0LmNsYXNzTGlzdCkuZmlsdGVyKFxyXG4gICAgICAgIChuYW1lKSA9PiAhW1wiYmxvY2tcIiwgXCJoaXRcIiwgXCJmaWxsZWRcIiwgXCJ1bmF2YWlsYWJsZVwiXS5pbmNsdWRlcyhuYW1lKVxyXG4gICAgICApO1xyXG4gICAgICAvLyBtYXkgbmVlZCB0byB1c2UgY3VycmVudFBsYXllciBmb3IgZXZlbnRzXHJcbiAgICAgIGlmIChcclxuICAgICAgICBjdXJyZW50UGxheWVyID09PSBcInBsYXllclwiIHx8XHJcbiAgICAgICAgY3VycmVudFBsYXllciA9PT0gXCJlbmVteVwiIHx8XHJcbiAgICAgICAgZ2FtZU1vZGUgPT09IFwic2luZ2xlcGxheWVyXCJcclxuICAgICAgKSB7XHJcbiAgICAgICAgcGxheWVySGl0cy5wdXNoKC4uLmNsYXNzZXMpO1xyXG4gICAgICAgIGNoZWNrU2NvcmUoY3VycmVudFBsYXllciwgcGxheWVySGl0cywgcGxheWVyU3Vua1NoaXBzKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gaWYgKGN1cnJlbnRQbGF5ZXIgPT09IFwiZW5lbXlcIikge1xyXG4gICAgICAvLyAgIGVuZW15SGl0cy5wdXNoKC4uLmNsYXNzZXMpO1xyXG4gICAgICAvLyAgIGNoZWNrU2NvcmUoY3VycmVudFBsYXllciwgZW5lbXlIaXRzLCBlbmVteVN1bmtTaGlwcyk7XHJcbiAgICAgIC8vIH1cclxuICAgIH1cclxuICAgIGlmICghZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZmlsbGVkXCIpKSB7XHJcbiAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJNaXNzIVwiO1xyXG4gICAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjb25zdCBib2FyZEJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjY29tcHV0ZXIgZGl2XCIpO1xyXG4gICAgLy8gYm9hcmRCbG9ja3MuZm9yRWFjaChcclxuICAgIC8vICAgKGJsb2NrKSA9PiBibG9jay5yZXBsYWNlV2l0aChibG9jay5jbG9uZU5vZGUodHJ1ZSkpIC8vIHRvIHJlbW92ZSBldmVudCBsaXN0ZW5lcnNcclxuICAgIC8vICk7XHJcblxyXG4gICAgLy8gaGFuZGxlRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIC8vIGlmIGdhbWVtb2RlIGlzIHNpbmdsZSwgZG8gdGhlc2U/XHJcbiAgICBpZiAoZ2FtZU1vZGUgPT09IFwic2luZ2xlcGxheWVyXCIgJiYgIWdhbWVPdmVyKSB7XHJcbiAgICAgIHBsYXllclR1cm4gPSBmYWxzZTtcclxuXHJcbiAgICAgIHNldFRpbWVvdXQoY29tcHV0ZXJzVHVybiwgMjUwKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGUudGFyZ2V0LmlkOyAvLyB1c2UgdGhpcyB0byBjb21tdW5pY2F0ZSB3aXRoIHNlcnZlcj9cclxufVxyXG5cclxuLy8gY29tcHV0ZXJzIHR1cm5cclxuZnVuY3Rpb24gY29tcHV0ZXJzVHVybigpIHtcclxuICBpZiAoIWdhbWVPdmVyKSB7XHJcbiAgICB0dXJuRGlzcGxheS50ZXh0Q29udGVudCA9IFwiQ29tcHV0ZXJzIFR1cm5cIjtcclxuICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJNYWtpbmcgY2FsY3VsYXRpb25zLi5cIjtcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgY29uc3QgcmFuZG9tU2hvdCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwICogMTApO1xyXG4gICAgICBpZiAoXHJcbiAgICAgICAgcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiZmlsbGVkXCIpICYmXHJcbiAgICAgICAgcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGl0XCIpICYmXHJcbiAgICAgICAgcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmNvbnRhaW5zKFwibWlzc1wiKVxyXG4gICAgICApIHtcclxuICAgICAgICBjb21wdXRlcnNUdXJuKCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgICAgcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiZmlsbGVkXCIpICYmXHJcbiAgICAgICAgIXBsYXllckJvYXJkW3JhbmRvbVNob3RdLmNsYXNzTGlzdC5jb250YWlucyhcImhpdFwiKVxyXG4gICAgICApIHtcclxuICAgICAgICBwbGF5ZXJCb2FyZFtyYW5kb21TaG90XS5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xyXG4gICAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJIaXQgdGhlIHRhcmdldCFcIjtcclxuICAgICAgICBjb25zdCBjbGFzc2VzID0gQXJyYXkuZnJvbShwbGF5ZXJCb2FyZFtyYW5kb21TaG90XS5jbGFzc0xpc3QpLmZpbHRlcihcclxuICAgICAgICAgIChuYW1lKSA9PiAhW1wiYmxvY2tcIiwgXCJoaXRcIiwgXCJmaWxsZWRcIl0uaW5jbHVkZXMobmFtZSlcclxuICAgICAgICApO1xyXG4gICAgICAgIGNvbXB1dGVySGl0cy5wdXNoKC4uLmNsYXNzZXMpO1xyXG4gICAgICAgIGNoZWNrU2NvcmUoXCJjb21wdXRlclwiLCBjb21wdXRlckhpdHMsIGNvbXB1dGVyU3Vua1NoaXBzKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9IFwiTWlzcyFcIjtcclxuICAgICAgICBwbGF5ZXJCb2FyZFtyYW5kb21TaG90XS5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcclxuICAgICAgfVxyXG4gICAgfSwgMjUwKTtcclxuICAgIGNvbnN0IGJvYXJkQmxvY2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNjb21wdXRlciBkaXZcIik7XHJcbiAgICBib2FyZEJsb2Nrcy5mb3JFYWNoKFxyXG4gICAgICAoYmxvY2spID0+IGJsb2NrLnJlcGxhY2VXaXRoKGJsb2NrLmNsb25lTm9kZSh0cnVlKSkgLy8gdG8gcmVtb3ZlIGV2ZW50IGxpc3RlbmVyc1xyXG4gICAgKTtcclxuICAgIGhhbmRsZUV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgcGxheWVyVHVybiA9IHRydWU7XHJcbiAgICAgIHR1cm5EaXNwbGF5LnRleHRDb250ZW50ID0gXCJQbGF5ZXIncyB0dXJuXCI7XHJcbiAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJUYWtlIHlvdXIgc2hvdCFcIjtcclxuXHJcbiAgICAgIC8vIHJlLWFkZGluZyBldmVudCBsaXN0ZW5lcnNcclxuICAgIH0sIDI1MCk7XHJcbiAgfVxyXG59XHJcbmZ1bmN0aW9uIGhhbmRsZUV2ZW50TGlzdGVuZXJzKCkge1xyXG4gIGNvbnN0IGJvYXJkQmxvY2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNjb21wdXRlciBkaXZcIik7XHJcbiAgYm9hcmRCbG9ja3MuZm9yRWFjaCgoYmxvY2spID0+IGJsb2NrLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVDbGljaykpOyAvLyByZS1hZGRpbmcgZXZlbnQgbGlzdGVuZXJzXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNoZWNrU2NvcmUodXNlciwgdXNlckhpdHMsIHVzZXJTdW5rU2hpcHMpIHtcclxuICBmdW5jdGlvbiBjaGVja1NoaXAoc2hpcE5hbWUsIHNoaXBMZW5ndGgpIHtcclxuICAgIGlmIChcclxuICAgICAgdXNlckhpdHMuZmlsdGVyKChoaXRTaGlwKSA9PiBoaXRTaGlwID09PSBzaGlwTmFtZSkubGVuZ3RoID09PSBzaGlwTGVuZ3RoXHJcbiAgICApIHtcclxuICAgICAgaWYgKFxyXG4gICAgICAgIHVzZXIgPT09IFwicGxheWVyXCIgfHxcclxuICAgICAgICB1c2VyID09PSBcImVuZW15XCIgfHxcclxuICAgICAgICBnYW1lTW9kZSA9PT0gXCJzaW5nbGVwbGF5ZXJcIlxyXG4gICAgICApIHtcclxuICAgICAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9IGBZb3Ugc3VuayB0aGUgZW5lbXkgJHtzaGlwTmFtZX0hYDtcclxuXHJcbiAgICAgICAgcGxheWVySGl0cyA9IHVzZXJIaXRzLmZpbHRlcigoaGl0U2hpcCkgPT4gaGl0U2hpcCAhPT0gc2hpcE5hbWUpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIGlmICh1c2VyID09PSBcImVuZW15XCIpIHtcclxuICAgICAgLy8gICBlbmVteUhpdHMgPSB1c2VySGl0cy5maWx0ZXIoKGhpdFNoaXApID0+IGhpdFNoaXAgIT09IHNoaXBOYW1lKTtcclxuICAgICAgLy8gfVxyXG4gICAgICBpZiAodXNlciA9PT0gXCJjb21wdXRlclwiKSB7XHJcbiAgICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBgVGhlIGVuZW15IHN1bmsgeW91ciAke3NoaXBOYW1lfSFgO1xyXG4gICAgICAgIGNvbXB1dGVySGl0cyA9IHVzZXJIaXRzLmZpbHRlcigoaGl0U2hpcCkgPT4gaGl0U2hpcCAhPT0gc2hpcE5hbWUpO1xyXG4gICAgICB9XHJcbiAgICAgIHVzZXJTdW5rU2hpcHMucHVzaChzaGlwTmFtZSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGNoZWNrU2hpcChcImRlc3Ryb3llclwiLCAyKTtcclxuICBjaGVja1NoaXAoXCJzdWJtYXJpbmVcIiwgMyk7XHJcbiAgY2hlY2tTaGlwKFwiY3J1aXNlclwiLCAzKTtcclxuICBjaGVja1NoaXAoXCJiYXR0bGVzaGlwXCIsIDQpO1xyXG4gIGNoZWNrU2hpcChcImNhcnJpZXJcIiwgNSk7XHJcblxyXG4gIGNvbnNvbGUubG9nKFwicGxheWVyU3Vua1NoaXBzXCIsIHBsYXllclN1bmtTaGlwcyk7XHJcblxyXG4gIGlmIChwbGF5ZXJTdW5rU2hpcHMubGVuZ3RoID09PSA1KSB7XHJcbiAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9XHJcbiAgICAgIFwiWW91IHN1bmsgYWxsIHRoZSBlbmVteSBzaGlwcyEgV2VsbCBmb3VnaHQgYWRtaXJhbCFcIjsgLy8gZ2FtZSBvdmVyIHBsYXllciAxIHdvblxyXG4gICAgZ2FtZU92ZXIgPSB0cnVlO1xyXG4gICAgaWYgKGdhbWVNb2RlID09PSBcInNpbmdsZXBsYXllclwiKVxyXG4gICAgICBzdGFydEJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RhcnRHYW1lU2luZ2xlKTtcclxuICB9XHJcbiAgaWYgKGVuZW15U3Vua1NoaXBzLmxlbmdodCA9PT0gNSkge1xyXG4gICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPVxyXG4gICAgICBcIllvdSBzdW5rIGFsbCB0aGUgZW5lbXkgc2hpcHMhIFdlbGwgZm91Z2h0IGFkbWlyYWwhXCI7IC8vIGdhbWUgb3ZlciBwbGF5ZXIgMSB3b25cclxuICAgIGdhbWVPdmVyID0gdHJ1ZTtcclxuICB9XHJcbiAgaWYgKGNvbXB1dGVyU3Vua1NoaXBzLmxlbmd0aCA9PT0gNSkge1xyXG4gICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPVxyXG4gICAgICBcIllvdXIgZmxlZXQgaGFzIGJlZW4gZGVzdHJveWVkISBXZWxsIGZvdWdodCBhZG1pcmFsLCB3ZSdsbCBnZXQgdGhlbSBuZXh0IHRpbWUuXCI7XHJcbiAgICBnYW1lT3ZlciA9IHRydWU7XHJcbiAgICBzdGFydEJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RhcnRHYW1lU2luZ2xlKTtcclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9