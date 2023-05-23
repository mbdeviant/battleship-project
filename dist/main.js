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
let currentPlayer = "user";
let user = currentPlayer;
let gameMode = "";
let playerNum = 0;
let ready = false;
let enemyReady = false;
let allShipsPlaced = false;
let shotFired = -1;
let notDropped;
let singlePlayerStarted;
let multiPlayerStarted;

function startMultiplayer() {
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
    }
  });
  // player connection control
  socket.on("player-connection", (num) => {
    console.log(`player ${num} has connected`);
  });
}
multiplayerButton.addEventListener("click", startMultiplayer);

// start single player game
function startSinglePlayer() {
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

createBoard("white", "player");
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
    (block) => !block.classList.contains("filled")
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
      adjacentBlock.classList.add("filled");
    });
    console.log(adjacentIndexes);
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
  console.log(ship, "this is ship");

  addShip("player", ship, startId);
  if (!notDropped) draggedShip.remove();

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

let gameOver = false;
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
let computerHits = [];
const playerSunkShips = [];
const computerSunkShips = [];

function handleClick(e) {
  if (!gameOver) {
    if (e.target.classList.contains("filled")) {
      e.target.classList.add("hit");
      infoDisplay.textContent = "You hit the enemy ship!";
      const classes = Array.from(e.target.classList).filter(
        (name) => !["block", "hit", "filled"].includes(name)
      );
      playerHits.push(...classes);
      checkScore("player", playerHits, playerSunkShips);
    }
    if (!e.target.classList.contains("filled")) {
      infoDisplay.textContent = "Miss!";
      e.target.classList.add("miss");
    }
    playerTurn = false;
    const boardBlocks = document.querySelectorAll("#computer div");
    boardBlocks.forEach(
      (block) => block.replaceWith(block.cloneNode(true)) // to remove event listeners
    );
    setTimeout(computersTurn, 500);
  }
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
        playerBoard[randomShot].classList.contains("hit")
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

    setTimeout(() => {
      playerTurn = true;
      turnDisplay.textContent = "Player's turn";
      infoDisplay.textContent = "Take your shot!";

      const boardBlocks = document.querySelectorAll("#computer div");
      boardBlocks.forEach((block) =>
        block.addEventListener("click", handleClick)
      ); // re-adding event listeners
    }, 500);
  }
}

function checkScore(user, userHits, userSunkShips) {
  function checkShip(shipName, shipLength) {
    if (
      userHits.filter((hitShip) => hitShip === shipName).length === shipLength
    ) {
      if (user === "player") {
        infoDisplay.textContent = `You sunk the enemy ${shipName}!`;

        playerHits = userHits.filter((hitShip) => hitShip !== shipName);
      }
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
      "You sunk all the enemy ships! Well fought admiral!";
    gameOver = true;
    startButton.removeEventListener("click", startGameSingle);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LGdDQUFnQztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0RBQXdELFNBQVM7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5REFBeUQsU0FBUztBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1wcm9qZWN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIG11bHRpLXNpbmdsZSBwbGF5ZXIgY29udHJvbHNcclxuY29uc3Qgc2luZ2xlUGxheWVyQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaW5nbGUtcGxheWVyLWJ1dHRvblwiKTtcclxuY29uc3QgbXVsdGlwbGF5ZXJCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm11bHRpcGxheWVyLWJ1dHRvblwiKTtcclxuLy8gc3RhcnQgdGhlIGdhbWVcclxuY29uc3Qgc3RhcnRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0YXJ0LWJ1dHRvblwiKTtcclxuY29uc3QgaW5mb0Rpc3BsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluZm8tZGlzcGxheVwiKTtcclxuY29uc3QgdHVybkRpc3BsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR1cm4tZGlzcGxheVwiKTtcclxuXHJcbi8vIENSRUFUSU5HIFNISVBTXHJcbmNsYXNzIFNoaXAge1xyXG4gIGNvbnN0cnVjdG9yKG5hbWUsIGxlbmd0aCkge1xyXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgZGVzdHJveWVyID0gbmV3IFNoaXAoXCJkZXN0cm95ZXJcIiwgMik7XHJcbmNvbnN0IHN1Ym1hcmluZSA9IG5ldyBTaGlwKFwic3VibWFyaW5lXCIsIDMpO1xyXG5jb25zdCBjcnVpc2VyID0gbmV3IFNoaXAoXCJjcnVpc2VyXCIsIDMpO1xyXG5jb25zdCBiYXR0bGVzaGlwID0gbmV3IFNoaXAoXCJiYXR0bGVzaGlwXCIsIDQpO1xyXG5jb25zdCBjYXJyaWVyID0gbmV3IFNoaXAoXCJjYXJyaWVyXCIsIDUpO1xyXG5cclxuY29uc3Qgc2hpcHMgPSBbZGVzdHJveWVyLCBzdWJtYXJpbmUsIGNydWlzZXIsIGJhdHRsZXNoaXAsIGNhcnJpZXJdO1xyXG5cclxuY29uc3QgZmxpcEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmxpcC1idXR0b25cIik7XHJcbmNvbnN0IHNoaXBDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNoaXAtc2VsZWN0LWNvbnRhaW5lclwiKTtcclxubGV0IGN1cnJlbnRQbGF5ZXIgPSBcInVzZXJcIjtcclxubGV0IHVzZXIgPSBjdXJyZW50UGxheWVyO1xyXG5sZXQgZ2FtZU1vZGUgPSBcIlwiO1xyXG5sZXQgcGxheWVyTnVtID0gMDtcclxubGV0IHJlYWR5ID0gZmFsc2U7XHJcbmxldCBlbmVteVJlYWR5ID0gZmFsc2U7XHJcbmxldCBhbGxTaGlwc1BsYWNlZCA9IGZhbHNlO1xyXG5sZXQgc2hvdEZpcmVkID0gLTE7XHJcbmxldCBub3REcm9wcGVkO1xyXG5sZXQgc2luZ2xlUGxheWVyU3RhcnRlZDtcclxubGV0IG11bHRpUGxheWVyU3RhcnRlZDtcclxuXHJcbmZ1bmN0aW9uIHN0YXJ0TXVsdGlwbGF5ZXIoKSB7XHJcbiAgZ2FtZU1vZGUgPSBcIm11bHRpcGxheWVyXCI7XHJcblxyXG4gIGNvbnN0IHNvY2tldCA9IGlvKCk7XHJcblxyXG4gIC8vIGdldCBwbGF5ZXIgbnVtYmVyXHJcbiAgc29ja2V0Lm9uKFwicGxheWVyLW51bWJlclwiLCAobnVtKSA9PiB7XHJcbiAgICBpZiAobnVtID09PSAtMSkge1xyXG4gICAgICBpbmZvRGlzcGxheS5pbm5lckhUTUwgPSBcInNlcnZlciBpcyBmdWxsXCI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwbGF5ZXJOdW0gPSBwYXJzZUludChudW0pO1xyXG4gICAgICBpZiAocGxheWVyTnVtID09PSAxKSBjdXJyZW50UGxheWVyID0gXCJlbmVteVwiO1xyXG4gICAgICBjb25zb2xlLmxvZyhwbGF5ZXJOdW0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIC8vIHBsYXllciBjb25uZWN0aW9uIGNvbnRyb2xcclxuICBzb2NrZXQub24oXCJwbGF5ZXItY29ubmVjdGlvblwiLCAobnVtKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhgcGxheWVyICR7bnVtfSBoYXMgY29ubmVjdGVkYCk7XHJcbiAgfSk7XHJcbn1cclxubXVsdGlwbGF5ZXJCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN0YXJ0TXVsdGlwbGF5ZXIpO1xyXG5cclxuLy8gc3RhcnQgc2luZ2xlIHBsYXllciBnYW1lXHJcbmZ1bmN0aW9uIHN0YXJ0U2luZ2xlUGxheWVyKCkge1xyXG4gIGlmIChzaW5nbGVQbGF5ZXJTdGFydGVkID09PSB0cnVlKSByZXR1cm47XHJcbiAgc2luZ2xlUGxheWVyU3RhcnRlZCA9IHRydWU7XHJcbiAgZ2FtZU1vZGUgPSBcInNpbmdsZXBsYXllclwiO1xyXG4gIHVzZXIgPSBcImNvbXB1dGVyXCI7XHJcbiAgc2hpcHMuZm9yRWFjaCgoc2hpcCkgPT4gYWRkU2hpcChcImNvbXB1dGVyXCIsIHNoaXApKTtcclxuICBzdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RhcnRHYW1lU2luZ2xlKTtcclxufVxyXG5zaW5nbGVQbGF5ZXJCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN0YXJ0U2luZ2xlUGxheWVyKTtcclxuXHJcbmxldCBhbmdsZSA9IDA7XHJcbmZ1bmN0aW9uIGZsaXBTaGlwcygpIHtcclxuICBjb25zdCBzaGlwcyA9IEFycmF5LmZyb20oc2hpcENvbnRhaW5lci5jaGlsZHJlbik7XHJcbiAgYW5nbGUgPSBhbmdsZSA9PT0gMCA/IDkwIDogMDtcclxuICBzaGlwcy5mb3JFYWNoKChzaGlwKSA9PiB7XHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cclxuICAgIHNoaXAuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZSgke2FuZ2xlfWRlZylgO1xyXG4gIH0pO1xyXG59XHJcbmZsaXBCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZsaXBTaGlwcyk7XHJcblxyXG4vLyBDUkVBVElORyBHQU1FQk9BUkRcclxuZnVuY3Rpb24gY3JlYXRlQm9hcmQoY29sb3IsIHVzZXIpIHtcclxuICBjb25zdCBnYW1lQm9hcmRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWVib2FyZC1jb250YWluZXJcIik7XHJcblxyXG4gIGNvbnN0IGdhbWVCb2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgZ2FtZUJvYXJkLnNldEF0dHJpYnV0ZShcImlkXCIsIHVzZXIpO1xyXG4gIGdhbWVCb2FyZC5jbGFzc0xpc3QuYWRkKFwiZ2FtZWJvYXJkXCIpO1xyXG4gIGdhbWVCb2FyZC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvcjtcclxuXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDA7IGkgKz0gMSkge1xyXG4gICAgY29uc3QgYmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgYmxvY2suY2xhc3NMaXN0LmFkZChcImJsb2NrXCIpO1xyXG4gICAgYmxvY2suaWQgPSBpO1xyXG4gICAgZ2FtZUJvYXJkLmFwcGVuZChibG9jayk7XHJcbiAgfVxyXG5cclxuICBnYW1lQm9hcmRDb250YWluZXIuYXBwZW5kQ2hpbGQoZ2FtZUJvYXJkKTtcclxufVxyXG5cclxuY3JlYXRlQm9hcmQoXCJ3aGl0ZVwiLCBcInBsYXllclwiKTtcclxuY3JlYXRlQm9hcmQoXCJnYWluc2Jvcm9cIiwgXCJjb21wdXRlclwiKTtcclxuXHJcbi8vIGNvbnNvbGUubG9nKHNoaXBzKTtcclxuXHJcbmZ1bmN0aW9uIGNoZWNrVmFsaWRpdHkoYm9hcmRCbG9ja3MsIGlzSG9yaXpvbnRhbCwgc3RhcnRJbmRleCwgc2hpcCkge1xyXG4gIC8vIHRvIHByZXZlbnQgcGxhY2luZyBzaGlwcyBvZmYgYm9hcmRcclxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmVzdGVkLXRlcm5hcnlcclxuICBjb25zdCB2YWxpZFN0YXJ0ID0gaXNIb3Jpem9udGFsXHJcbiAgICA/IHN0YXJ0SW5kZXggPD0gMTAgKiAxMCAtIHNoaXAubGVuZ3RoXHJcbiAgICAgID8gc3RhcnRJbmRleFxyXG4gICAgICA6IDEwICogMTAgLSBzaGlwLmxlbmd0aFxyXG4gICAgOiBzdGFydEluZGV4IDw9IDEwICogMTAgLSAxMCAqIHNoaXAubGVuZ3RoXHJcbiAgICA/IHN0YXJ0SW5kZXhcclxuICAgIDogc3RhcnRJbmRleCAtIHNoaXAubGVuZ3RoICogMTAgKyAxMDtcclxuICAvLyAgIGNvbnNvbGUubG9nKGB2YWxpZGF0ZWQgaSAke3ZhbGlkU3RhcnR9YCk7XHJcblxyXG4gIGNvbnN0IHNoaXBCbG9ja3MgPSBbXTtcclxuICAvLyBzYXZlIHRoZSBpbmRleGVzIG9mIHNoaXBzIHRvIGFuIGFycmF5XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICBpZiAoaXNIb3Jpem9udGFsKSBzaGlwQmxvY2tzLnB1c2goYm9hcmRCbG9ja3NbTnVtYmVyKHZhbGlkU3RhcnQpICsgaV0pO1xyXG4gICAgZWxzZSBzaGlwQmxvY2tzLnB1c2goYm9hcmRCbG9ja3NbTnVtYmVyKHZhbGlkU3RhcnQpICsgaSAqIDEwXSk7XHJcbiAgfVxyXG5cclxuICAvLyB2YWxpZGF0ZSBwbGFjZSB0byBwcmV2ZW50IHNoaXBzIGZyb20gc3BsaXR0aW5nXHJcbiAgbGV0IGlzVmFsaWQ7XHJcbiAgaWYgKGlzSG9yaXpvbnRhbCkge1xyXG4gICAgc2hpcEJsb2Nrcy5ldmVyeShcclxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJldHVybi1hc3NpZ25cclxuICAgICAgKF9ibG9jaywgaW5kZXgpID0+XHJcbiAgICAgICAgKGlzVmFsaWQgPVxyXG4gICAgICAgICAgc2hpcEJsb2Nrc1swXS5pZCAlIDEwICE9PSAxMCAtIChzaGlwQmxvY2tzLmxlbmd0aCAtIChpbmRleCArIDEpKSlcclxuICAgICk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHNoaXBCbG9ja3MuZXZlcnkoXHJcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXR1cm4tYXNzaWduXHJcbiAgICAgIChfYmxvY2ssIGluZGV4KSA9PiAoaXNWYWxpZCA9IHNoaXBCbG9ja3NbMF0uaWQgPCA5MCArICgxMCAqIGluZGV4ICsgMSkpXHJcbiAgICApO1xyXG4gIH1cclxuICAvLyBjb25zb2xlLmxvZyhgaXMgdmFsaWQ/ICR7aXNWYWxpZH1gKTtcclxuICBjb25zdCBub3RUYWtlbiA9IHNoaXBCbG9ja3MuZXZlcnkoXHJcbiAgICAoYmxvY2spID0+ICFibG9jay5jbGFzc0xpc3QuY29udGFpbnMoXCJmaWxsZWRcIilcclxuICApO1xyXG5cclxuICByZXR1cm4geyBzaGlwQmxvY2tzLCBpc1ZhbGlkLCBub3RUYWtlbiB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRTaGlwKHVzZXIsIHNoaXAsIHN0YXJ0SWQpIHtcclxuICBjb25zb2xlLmxvZyhcImFkZHNoaXBcIik7XHJcbiAgLy8gICBjb25zb2xlLmxvZyh1c2VyKTtcclxuICBjb25zdCBib2FyZEJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYCMke3VzZXJ9IGRpdmApO1xyXG4gIGNvbnN0IGJvb2wgPSBNYXRoLnJhbmRvbSgpIDwgMC41OyAvLyByZXR1cm5lZCBudW1iZXIgZWl0aGVyIHdpbGwgYmUgYmlnZ2VyIHRoYW4gMC41IG9yIG5vdCBoZW5jZSB0aGUgcmFuZG9tIGJvb2xcclxuICBjb25zdCBpc0hvcml6b250YWwgPSB1c2VyID09PSBcInBsYXllclwiID8gYW5nbGUgPT09IDAgOiBib29sO1xyXG4gIGNvbnN0IHJhbmRvbVN0YXJ0SW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCAqIDEwKTsgLy8gdGVuIHRpbWVzIHRlbiBpcyB0aGUgd2lkdGggb2YgdGhlIGJvYXJkXHJcbiAgLy8gICBjb25zb2xlLmxvZyhgaG9yaXpvbnRhbCAke2lzSG9yaXpvbnRhbH1gKTtcclxuICAvLyAgIGNvbnNvbGUubG9nKGByYW5kb20gaW5kZXggJHtyYW5kb21TdGFydEluZGV4fWApO1xyXG5cclxuICBjb25zdCBzdGFydEluZGV4ID0gc3RhcnRJZCB8fCByYW5kb21TdGFydEluZGV4O1xyXG4gIC8vICAgY29uc29sZS5sb2coYHN0YXJ0IGluZGV4ICR7c3RhcnRJbmRleH1gKTtcclxuXHJcbiAgY29uc3QgeyBzaGlwQmxvY2tzLCBpc1ZhbGlkLCBub3RUYWtlbiB9ID0gY2hlY2tWYWxpZGl0eShcclxuICAgIGJvYXJkQmxvY2tzLFxyXG4gICAgaXNIb3Jpem9udGFsLFxyXG4gICAgc3RhcnRJbmRleCxcclxuICAgIHNoaXBcclxuICApO1xyXG5cclxuICAvLyBjb25zb2xlLmxvZyhgbm90IHRha2VuPyAke25vdFRha2VufWApO1xyXG4gIGlmIChpc1ZhbGlkICYmIG5vdFRha2VuKSB7XHJcbiAgICBzaGlwQmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PiB7XHJcbiAgICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoc2hpcC5uYW1lKTtcclxuICAgICAgYmxvY2suY2xhc3NMaXN0LmFkZChcImZpbGxlZFwiKTtcclxuICAgIH0pO1xyXG4gICAgLy8gYWRkIGZpbGxlZCBjbGFzcyB0byBhZGphY2VudCBibG9ja3MgdG8gcHJldmVudCBwbGFjaW5nIHNoaXBzIHNpZGUgdG8gc2lkZVxyXG4gICAgY29uc3QgYWRqYWNlbnRJbmRleGVzID0gZ2V0QWRqYWNlbnRJbmRleGVzKFxyXG4gICAgICBib2FyZEJsb2NrcyxcclxuICAgICAgaXNIb3Jpem9udGFsLFxyXG4gICAgICBzaGlwQmxvY2tzXHJcbiAgICApO1xyXG4gICAgYWRqYWNlbnRJbmRleGVzLmZvckVhY2goKGFkamFjZW50SW5kZXgpID0+IHtcclxuICAgICAgY29uc3QgYWRqYWNlbnRCbG9jayA9IGJvYXJkQmxvY2tzW2FkamFjZW50SW5kZXhdO1xyXG4gICAgICBhZGphY2VudEJsb2NrLmNsYXNzTGlzdC5hZGQoXCJmaWxsZWRcIik7XHJcbiAgICB9KTtcclxuICAgIGNvbnNvbGUubG9nKGFkamFjZW50SW5kZXhlcyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmICh1c2VyID09PSBcImNvbXB1dGVyXCIpIGFkZFNoaXAodXNlciwgc2hpcCwgc3RhcnRJZCk7XHJcbiAgICBpZiAodXNlciA9PT0gXCJwbGF5ZXJcIikgbm90RHJvcHBlZCA9IHRydWU7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBoZWxwZXIgZnVuY3Rpb24gdG8gZ2V0IGFkamFjZW50IGluZGV4ZXNcclxuZnVuY3Rpb24gZ2V0QWRqYWNlbnRJbmRleGVzKGJvYXJkQmxvY2tzLCBpc0hvcml6b250YWwsIHNoaXBCbG9ja3MpIHtcclxuICBjb25zdCBib2FyZEJsb2Nrc0FycmF5ID0gWy4uLmJvYXJkQmxvY2tzXTtcclxuICBjb25zdCBhZGphY2VudEluZGV4ZXMgPSBbXTtcclxuXHJcbiAgc2hpcEJsb2Nrcy5mb3JFYWNoKChibG9jaywgaW5kZXgpID0+IHtcclxuICAgIGNvbnN0IGJsb2NrSW5kZXggPSBib2FyZEJsb2Nrc0FycmF5LmluZGV4T2YoYmxvY2spO1xyXG4gICAgY29uc3Qgcm93ID0gTWF0aC5mbG9vcihibG9ja0luZGV4IC8gMTApO1xyXG4gICAgY29uc3QgY29sID0gYmxvY2tJbmRleCAlIDEwO1xyXG5cclxuICAgIGlmIChpc0hvcml6b250YWwpIHtcclxuICAgICAgaWYgKGNvbCA+IDApIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggLSAxKTsgLy8gbGVmdCBibG9ja1xyXG4gICAgICBpZiAoY29sIDwgOSkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCArIDEpOyAvLyByaWdodCBibG9ja1xyXG4gICAgICBpZiAocm93ID4gMCkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCAtIDEwKTsgLy8gdG9wIGJsb2NrXHJcbiAgICAgIGlmIChyb3cgPCA5KSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4ICsgMTApOyAvLyBib3R0b20gYmxvY2tcclxuICAgICAgaWYgKGNvbCA+IDAgJiYgcm93ID4gMCkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCAtIDExKTsgLy8gdG9wLWxlZnQgYmxvY2tcclxuICAgICAgaWYgKGNvbCA+IDAgJiYgcm93IDwgOSkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCArIDkpOyAvLyBib3R0b20tbGVmdCBibG9ja1xyXG4gICAgICBpZiAoY29sIDwgOSAmJiByb3cgPiAwKSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4IC0gOSk7IC8vIHRvcC1yaWdodCBibG9ja1xyXG4gICAgICBpZiAoY29sIDwgOSAmJiByb3cgPCA5KSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4ICsgMTEpOyAvLyBib3R0b20tcmlnaHQgYmxvY2tcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChyb3cgPiAwKSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4IC0gMTApOyAvLyB0b3AgYmxvY2tcclxuICAgICAgaWYgKHJvdyA8IDkpIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggKyAxMCk7IC8vIGJvdHRvbSBibG9ja1xyXG4gICAgICBpZiAoY29sID4gMCkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCAtIDEpOyAvLyBsZWZ0IGJsb2NrXHJcbiAgICAgIGlmIChjb2wgPCA5KSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4ICsgMSk7IC8vIHJpZ2h0IGJsb2NrXHJcbiAgICAgIGlmIChyb3cgPiAwICYmIGNvbCA+IDApIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggLSAxMSk7IC8vIHRvcC1sZWZ0IGJsb2NrXHJcbiAgICAgIGlmIChyb3cgPiAwICYmIGNvbCA8IDkpIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggLSA5KTsgLy8gdG9wLXJpZ2h0IGJsb2NrXHJcbiAgICAgIGlmIChyb3cgPCA5ICYmIGNvbCA+IDApIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggKyA5KTsgLy8gYm90dG9tLWxlZnQgYmxvY2tcclxuICAgICAgaWYgKHJvdyA8IDkgJiYgY29sIDwgOSkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCArIDExKTsgLy8gYm90dG9tLXJpZ2h0IGJsb2NrXHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHVuaXF1ZUFkamFjZW50SW5kZXhlcyA9IEFycmF5LmZyb20obmV3IFNldChhZGphY2VudEluZGV4ZXMpKTtcclxuXHJcbiAgcmV0dXJuIHVuaXF1ZUFkamFjZW50SW5kZXhlcztcclxufVxyXG4vLyBhZGRTaGlwKGRlc3Ryb3llcik7XHJcbi8vIGFkZFNoaXAoc3VibWFyaW5lKTtcclxuLy8gYWRkU2hpcChjcnVpc2VyKTtcclxuLy8gYWRkU2hpcChiYXR0bGVzaGlwKTtcclxuLy8gYWRkU2hpcChcImNvbXB1dGVyXCIsIGNhcnJpZXIpO1xyXG5cclxuLy8gRFJBRyZEUk9QIFBMQVlFUiBTSElQU1xyXG5sZXQgZHJhZ2dlZFNoaXA7XHJcbmNvbnN0IHNoaXBPcHRpb25zID0gQXJyYXkuZnJvbShzaGlwQ29udGFpbmVyLmNoaWxkcmVuKTtcclxuc2hpcE9wdGlvbnMuZm9yRWFjaCgoc2hpcCkgPT4gc2hpcC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ3N0YXJ0XCIsIGRyYWdTdGFydCkpO1xyXG5cclxuY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI3BsYXllciBkaXZcIik7XHJcbnBsYXllckJvYXJkLmZvckVhY2goKGJsb2NrKSA9PiB7XHJcbiAgYmxvY2suYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIGRyYWdPdmVyKTtcclxuICBibG9jay5hZGRFdmVudExpc3RlbmVyKFwiZHJvcFwiLCBkcm9wU2hpcCk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gZHJhZ1N0YXJ0KGUpIHtcclxuICBub3REcm9wcGVkID0gZmFsc2U7XHJcbiAgZHJhZ2dlZFNoaXAgPSBlLnRhcmdldDtcclxuICBjb25zb2xlLmxvZyhcImRyYWcgc3RhcnRlZFwiKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhZ092ZXIoZSkge1xyXG4gIC8vIGNvbnNvbGUubG9nKFwiZHJhZ292ZXJcIik7XHJcbiAgLy8gY29uc29sZS5sb2coZS50YXJnZXQucGFyZW50Tm9kZSk7XHJcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICBpZiAoIWRyYWdnZWRTaGlwKSByZXR1cm47XHJcbiAgY29uc3Qgc2hpcCA9IHNoaXBzW2RyYWdnZWRTaGlwLmlkXTtcclxuXHJcbiAgaGlnaGxpZ2h0U2hpcEFyZWEoZS50YXJnZXQuaWQsIHNoaXApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcm9wU2hpcChlKSB7XHJcbiAgY29uc29sZS5sb2coXCJkcm9wc2hpcFwiKTtcclxuICBjb25zdCBzdGFydElkID0gZS50YXJnZXQuaWQ7XHJcbiAgaWYgKGRyYWdnZWRTaGlwID09PSB1bmRlZmluZWQgfHwgZHJhZ2dlZFNoaXAgPT09IG51bGwpIHJldHVybjtcclxuICBjb25zdCBzaGlwID0gc2hpcHNbZHJhZ2dlZFNoaXAuaWRdO1xyXG4gIGNvbnNvbGUubG9nKHNoaXAsIFwidGhpcyBpcyBzaGlwXCIpO1xyXG5cclxuICBhZGRTaGlwKFwicGxheWVyXCIsIHNoaXAsIHN0YXJ0SWQpO1xyXG4gIGlmICghbm90RHJvcHBlZCkgZHJhZ2dlZFNoaXAucmVtb3ZlKCk7XHJcblxyXG4gIGRyYWdnZWRTaGlwID0gbnVsbDtcclxufVxyXG5cclxuZnVuY3Rpb24gaGlnaGxpZ2h0U2hpcEFyZWEoc3RhcnRJbmRleCwgc2hpcCkge1xyXG4gIGNvbnN0IGlzSG9yaXpvbnRhbCA9IGFuZ2xlID09PSAwO1xyXG5cclxuICBjb25zdCB7IHNoaXBCbG9ja3MsIGlzVmFsaWQsIG5vdFRha2VuIH0gPSBjaGVja1ZhbGlkaXR5KFxyXG4gICAgcGxheWVyQm9hcmQsXHJcbiAgICBpc0hvcml6b250YWwsXHJcbiAgICBzdGFydEluZGV4LFxyXG4gICAgc2hpcFxyXG4gICk7XHJcblxyXG4gIGlmIChpc1ZhbGlkICYmIG5vdFRha2VuKSB7XHJcbiAgICBzaGlwQmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PiB7XHJcbiAgICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoXCJob3ZlclwiKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiBibG9jay5jbGFzc0xpc3QucmVtb3ZlKFwiaG92ZXJcIiksIDUwMCk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbi8vIEdBTUUgTE9HSUNcclxuXHJcbmxldCBnYW1lT3ZlciA9IGZhbHNlO1xyXG5sZXQgcGxheWVyVHVybjtcclxuXHJcbi8vIHN0YXJ0IHRoZSBnYW1lXHJcblxyXG5mdW5jdGlvbiBzdGFydEdhbWVTaW5nbGUoKSB7XHJcbiAgaWYgKHBsYXllclR1cm4gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgaWYgKHNoaXBDb250YWluZXIuY2hpbGRyZW4ubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJQbGVhc2UgcGxhY2UgYWxsIHlvdXIgc2hpcHMgZmlyc3QhXCI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCBib2FyZEJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjY29tcHV0ZXIgZGl2XCIpO1xyXG4gICAgICBib2FyZEJsb2Nrcy5mb3JFYWNoKChibG9jaykgPT5cclxuICAgICAgICBibG9jay5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlQ2xpY2spXHJcbiAgICAgICk7XHJcbiAgICAgIHBsYXllclR1cm4gPSB0cnVlO1xyXG4gICAgICB0dXJuRGlzcGxheS50ZXh0Q29udGVudCA9IFwiWW91ciB0dXJuIVwiO1xyXG4gICAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9IFwiVGhlIGJhdHRsZSBoYXMgYmVndW4hXCI7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5sZXQgcGxheWVySGl0cyA9IFtdO1xyXG5sZXQgY29tcHV0ZXJIaXRzID0gW107XHJcbmNvbnN0IHBsYXllclN1bmtTaGlwcyA9IFtdO1xyXG5jb25zdCBjb21wdXRlclN1bmtTaGlwcyA9IFtdO1xyXG5cclxuZnVuY3Rpb24gaGFuZGxlQ2xpY2soZSkge1xyXG4gIGlmICghZ2FtZU92ZXIpIHtcclxuICAgIGlmIChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJmaWxsZWRcIikpIHtcclxuICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmFkZChcImhpdFwiKTtcclxuICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBcIllvdSBoaXQgdGhlIGVuZW15IHNoaXAhXCI7XHJcbiAgICAgIGNvbnN0IGNsYXNzZXMgPSBBcnJheS5mcm9tKGUudGFyZ2V0LmNsYXNzTGlzdCkuZmlsdGVyKFxyXG4gICAgICAgIChuYW1lKSA9PiAhW1wiYmxvY2tcIiwgXCJoaXRcIiwgXCJmaWxsZWRcIl0uaW5jbHVkZXMobmFtZSlcclxuICAgICAgKTtcclxuICAgICAgcGxheWVySGl0cy5wdXNoKC4uLmNsYXNzZXMpO1xyXG4gICAgICBjaGVja1Njb3JlKFwicGxheWVyXCIsIHBsYXllckhpdHMsIHBsYXllclN1bmtTaGlwcyk7XHJcbiAgICB9XHJcbiAgICBpZiAoIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImZpbGxlZFwiKSkge1xyXG4gICAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9IFwiTWlzcyFcIjtcclxuICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmFkZChcIm1pc3NcIik7XHJcbiAgICB9XHJcbiAgICBwbGF5ZXJUdXJuID0gZmFsc2U7XHJcbiAgICBjb25zdCBib2FyZEJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjY29tcHV0ZXIgZGl2XCIpO1xyXG4gICAgYm9hcmRCbG9ja3MuZm9yRWFjaChcclxuICAgICAgKGJsb2NrKSA9PiBibG9jay5yZXBsYWNlV2l0aChibG9jay5jbG9uZU5vZGUodHJ1ZSkpIC8vIHRvIHJlbW92ZSBldmVudCBsaXN0ZW5lcnNcclxuICAgICk7XHJcbiAgICBzZXRUaW1lb3V0KGNvbXB1dGVyc1R1cm4sIDUwMCk7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBjb21wdXRlcnMgdHVyblxyXG5mdW5jdGlvbiBjb21wdXRlcnNUdXJuKCkge1xyXG4gIGlmICghZ2FtZU92ZXIpIHtcclxuICAgIHR1cm5EaXNwbGF5LnRleHRDb250ZW50ID0gXCJDb21wdXRlcnMgVHVyblwiO1xyXG4gICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBcIk1ha2luZyBjYWxjdWxhdGlvbnMuLlwiO1xyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBjb25zdCByYW5kb21TaG90ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAgKiAxMCk7XHJcbiAgICAgIGlmIChcclxuICAgICAgICBwbGF5ZXJCb2FyZFtyYW5kb21TaG90XS5jbGFzc0xpc3QuY29udGFpbnMoXCJmaWxsZWRcIikgJiZcclxuICAgICAgICBwbGF5ZXJCb2FyZFtyYW5kb21TaG90XS5jbGFzc0xpc3QuY29udGFpbnMoXCJoaXRcIilcclxuICAgICAgKSB7XHJcbiAgICAgICAgY29tcHV0ZXJzVHVybigpO1xyXG4gICAgICB9IGVsc2UgaWYgKFxyXG4gICAgICAgIHBsYXllckJvYXJkW3JhbmRvbVNob3RdLmNsYXNzTGlzdC5jb250YWlucyhcImZpbGxlZFwiKSAmJlxyXG4gICAgICAgICFwbGF5ZXJCb2FyZFtyYW5kb21TaG90XS5jbGFzc0xpc3QuY29udGFpbnMoXCJoaXRcIilcclxuICAgICAgKSB7XHJcbiAgICAgICAgcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmFkZChcImhpdFwiKTtcclxuICAgICAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9IFwiSGl0IHRoZSB0YXJnZXQhXCI7XHJcbiAgICAgICAgY29uc3QgY2xhc3NlcyA9IEFycmF5LmZyb20ocGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0KS5maWx0ZXIoXHJcbiAgICAgICAgICAobmFtZSkgPT4gIVtcImJsb2NrXCIsIFwiaGl0XCIsIFwiZmlsbGVkXCJdLmluY2x1ZGVzKG5hbWUpXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjb21wdXRlckhpdHMucHVzaCguLi5jbGFzc2VzKTtcclxuICAgICAgICBjaGVja1Njb3JlKFwiY29tcHV0ZXJcIiwgY29tcHV0ZXJIaXRzLCBjb21wdXRlclN1bmtTaGlwcyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBcIk1pc3MhXCI7XHJcbiAgICAgICAgcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmFkZChcIm1pc3NcIik7XHJcbiAgICAgIH1cclxuICAgIH0sIDUwMCk7XHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHBsYXllclR1cm4gPSB0cnVlO1xyXG4gICAgICB0dXJuRGlzcGxheS50ZXh0Q29udGVudCA9IFwiUGxheWVyJ3MgdHVyblwiO1xyXG4gICAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9IFwiVGFrZSB5b3VyIHNob3QhXCI7XHJcblxyXG4gICAgICBjb25zdCBib2FyZEJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjY29tcHV0ZXIgZGl2XCIpO1xyXG4gICAgICBib2FyZEJsb2Nrcy5mb3JFYWNoKChibG9jaykgPT5cclxuICAgICAgICBibG9jay5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlQ2xpY2spXHJcbiAgICAgICk7IC8vIHJlLWFkZGluZyBldmVudCBsaXN0ZW5lcnNcclxuICAgIH0sIDUwMCk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjaGVja1Njb3JlKHVzZXIsIHVzZXJIaXRzLCB1c2VyU3Vua1NoaXBzKSB7XHJcbiAgZnVuY3Rpb24gY2hlY2tTaGlwKHNoaXBOYW1lLCBzaGlwTGVuZ3RoKSB7XHJcbiAgICBpZiAoXHJcbiAgICAgIHVzZXJIaXRzLmZpbHRlcigoaGl0U2hpcCkgPT4gaGl0U2hpcCA9PT0gc2hpcE5hbWUpLmxlbmd0aCA9PT0gc2hpcExlbmd0aFxyXG4gICAgKSB7XHJcbiAgICAgIGlmICh1c2VyID09PSBcInBsYXllclwiKSB7XHJcbiAgICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBgWW91IHN1bmsgdGhlIGVuZW15ICR7c2hpcE5hbWV9IWA7XHJcblxyXG4gICAgICAgIHBsYXllckhpdHMgPSB1c2VySGl0cy5maWx0ZXIoKGhpdFNoaXApID0+IGhpdFNoaXAgIT09IHNoaXBOYW1lKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAodXNlciA9PT0gXCJjb21wdXRlclwiKSB7XHJcbiAgICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBgVGhlIGVuZW15IHN1bmsgeW91ciAke3NoaXBOYW1lfSFgO1xyXG4gICAgICAgIGNvbXB1dGVySGl0cyA9IHVzZXJIaXRzLmZpbHRlcigoaGl0U2hpcCkgPT4gaGl0U2hpcCAhPT0gc2hpcE5hbWUpO1xyXG4gICAgICB9XHJcbiAgICAgIHVzZXJTdW5rU2hpcHMucHVzaChzaGlwTmFtZSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGNoZWNrU2hpcChcImRlc3Ryb3llclwiLCAyKTtcclxuICBjaGVja1NoaXAoXCJzdWJtYXJpbmVcIiwgMyk7XHJcbiAgY2hlY2tTaGlwKFwiY3J1aXNlclwiLCAzKTtcclxuICBjaGVja1NoaXAoXCJiYXR0bGVzaGlwXCIsIDQpO1xyXG4gIGNoZWNrU2hpcChcImNhcnJpZXJcIiwgNSk7XHJcbiAgY29uc29sZS5sb2coXCJwbGF5ZXJIaXRzXCIsIHBsYXllckhpdHMpO1xyXG4gIGNvbnNvbGUubG9nKFwicGxheWVyU3Vua1NoaXBzXCIsIHBsYXllclN1bmtTaGlwcyk7XHJcblxyXG4gIGlmIChwbGF5ZXJTdW5rU2hpcHMubGVuZ3RoID09PSA1KSB7XHJcbiAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9XHJcbiAgICAgIFwiWW91IHN1bmsgYWxsIHRoZSBlbmVteSBzaGlwcyEgV2VsbCBmb3VnaHQgYWRtaXJhbCFcIjtcclxuICAgIGdhbWVPdmVyID0gdHJ1ZTtcclxuICAgIHN0YXJ0QnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzdGFydEdhbWVTaW5nbGUpO1xyXG4gIH1cclxuICBpZiAoY29tcHV0ZXJTdW5rU2hpcHMubGVuZ3RoID09PSA1KSB7XHJcbiAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9XHJcbiAgICAgIFwiWW91ciBmbGVldCBoYXMgYmVlbiBkZXN0cm95ZWQhIFdlbGwgZm91Z2h0IGFkbWlyYWwsIHdlJ2xsIGdldCB0aGVtIG5leHQgdGltZS5cIjtcclxuICAgIGdhbWVPdmVyID0gdHJ1ZTtcclxuICAgIHN0YXJ0QnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzdGFydEdhbWVTaW5nbGUpO1xyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=