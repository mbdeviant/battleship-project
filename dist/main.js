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
    controlPlayerConnection(num);
  });

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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YWNrOi8vYmF0dGxlc2hpcC1wcm9qZWN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIG11bHRpLXNpbmdsZSBwbGF5ZXIgY29udHJvbHNcclxuY29uc3Qgc2luZ2xlUGxheWVyQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaW5nbGUtcGxheWVyLWJ1dHRvblwiKTtcclxuY29uc3QgbXVsdGlwbGF5ZXJCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm11bHRpcGxheWVyLWJ1dHRvblwiKTtcclxuLy8gc3RhcnQgdGhlIGdhbWVcclxuY29uc3Qgc3RhcnRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0YXJ0LWJ1dHRvblwiKTtcclxuY29uc3QgaW5mb0Rpc3BsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluZm8tZGlzcGxheVwiKTtcclxuY29uc3QgdHVybkRpc3BsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR1cm4tZGlzcGxheVwiKTtcclxuXHJcbi8vIENSRUFUSU5HIFNISVBTXHJcbmNsYXNzIFNoaXAge1xyXG4gIGNvbnN0cnVjdG9yKG5hbWUsIGxlbmd0aCkge1xyXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgZGVzdHJveWVyID0gbmV3IFNoaXAoXCJkZXN0cm95ZXJcIiwgMik7XHJcbmNvbnN0IHN1Ym1hcmluZSA9IG5ldyBTaGlwKFwic3VibWFyaW5lXCIsIDMpO1xyXG5jb25zdCBjcnVpc2VyID0gbmV3IFNoaXAoXCJjcnVpc2VyXCIsIDMpO1xyXG5jb25zdCBiYXR0bGVzaGlwID0gbmV3IFNoaXAoXCJiYXR0bGVzaGlwXCIsIDQpO1xyXG5jb25zdCBjYXJyaWVyID0gbmV3IFNoaXAoXCJjYXJyaWVyXCIsIDUpO1xyXG5cclxuY29uc3Qgc2hpcHMgPSBbZGVzdHJveWVyLCBzdWJtYXJpbmUsIGNydWlzZXIsIGJhdHRsZXNoaXAsIGNhcnJpZXJdO1xyXG5cclxuY29uc3QgZmxpcEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmxpcC1idXR0b25cIik7XHJcbmNvbnN0IHNoaXBDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNoaXAtc2VsZWN0LWNvbnRhaW5lclwiKTtcclxubGV0IGN1cnJlbnRQbGF5ZXIgPSBcInVzZXJcIjtcclxubGV0IHVzZXIgPSBjdXJyZW50UGxheWVyO1xyXG5sZXQgZ2FtZU1vZGUgPSBcIlwiO1xyXG5sZXQgcGxheWVyTnVtID0gMDtcclxubGV0IHJlYWR5ID0gZmFsc2U7XHJcbmxldCBlbmVteVJlYWR5ID0gZmFsc2U7XHJcbmxldCBhbGxTaGlwc1BsYWNlZCA9IGZhbHNlO1xyXG5sZXQgc2hvdEZpcmVkID0gLTE7XHJcbmxldCBub3REcm9wcGVkO1xyXG5sZXQgc2luZ2xlUGxheWVyU3RhcnRlZDtcclxubGV0IG11bHRpUGxheWVyU3RhcnRlZDtcclxuXHJcbmZ1bmN0aW9uIHN0YXJ0TXVsdGlwbGF5ZXIoKSB7XHJcbiAgZ2FtZU1vZGUgPSBcIm11bHRpcGxheWVyXCI7XHJcblxyXG4gIGNvbnN0IHNvY2tldCA9IGlvKCk7XHJcblxyXG4gIC8vIGdldCBwbGF5ZXIgbnVtYmVyXHJcbiAgc29ja2V0Lm9uKFwicGxheWVyLW51bWJlclwiLCAobnVtKSA9PiB7XHJcbiAgICBpZiAobnVtID09PSAtMSkge1xyXG4gICAgICBpbmZvRGlzcGxheS5pbm5lckhUTUwgPSBcInNlcnZlciBpcyBmdWxsXCI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwbGF5ZXJOdW0gPSBwYXJzZUludChudW0pO1xyXG4gICAgICBpZiAocGxheWVyTnVtID09PSAxKSBjdXJyZW50UGxheWVyID0gXCJlbmVteVwiO1xyXG4gICAgICBjb25zb2xlLmxvZyhwbGF5ZXJOdW0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIC8vIHBsYXllciBjb25uZWN0aW9uIGNvbnRyb2xcclxuICBzb2NrZXQub24oXCJwbGF5ZXItY29ubmVjdGlvblwiLCAobnVtKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhgcGxheWVyICR7bnVtfSBoYXMgY29ubmVjdGVkYCk7XHJcbiAgICBjb250cm9sUGxheWVyQ29ubmVjdGlvbihudW0pO1xyXG4gIH0pO1xyXG5cclxuICBmdW5jdGlvbiBjb250cm9sUGxheWVyQ29ubmVjdGlvbihudW0pIHtcclxuICAgIGNvbnN0IHBsYXllciA9IGAucCR7cGFyc2VJbnQobnVtKSArIDF9YDtcclxuICAgIGRvY3VtZW50XHJcbiAgICAgIC5xdWVyeVNlbGVjdG9yKGAke3BsYXllcn0gLmNvbm5lY3RlZCBzcGFuYClcclxuICAgICAgLmNsYXNzTGlzdC50b2dnbGUoXCJncmVlblwiKTtcclxuICAgIGlmIChwYXJzZUludChudW0pID09PSBwbGF5ZXJOdW0pXHJcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocGxheWVyKS5zdHlsZS5mb250V2VpZ2h0ID0gXCJib2xkXCI7XHJcbiAgfVxyXG59XHJcbm11bHRpcGxheWVyQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzdGFydE11bHRpcGxheWVyKTtcclxuXHJcbi8vIHN0YXJ0IHNpbmdsZSBwbGF5ZXIgZ2FtZVxyXG5mdW5jdGlvbiBzdGFydFNpbmdsZVBsYXllcigpIHtcclxuICBpZiAoc2luZ2xlUGxheWVyU3RhcnRlZCA9PT0gdHJ1ZSkgcmV0dXJuO1xyXG4gIHNpbmdsZVBsYXllclN0YXJ0ZWQgPSB0cnVlO1xyXG4gIGdhbWVNb2RlID0gXCJzaW5nbGVwbGF5ZXJcIjtcclxuICB1c2VyID0gXCJjb21wdXRlclwiO1xyXG4gIHNoaXBzLmZvckVhY2goKHNoaXApID0+IGFkZFNoaXAoXCJjb21wdXRlclwiLCBzaGlwKSk7XHJcbiAgc3RhcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN0YXJ0R2FtZVNpbmdsZSk7XHJcbn1cclxuc2luZ2xlUGxheWVyQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzdGFydFNpbmdsZVBsYXllcik7XHJcblxyXG5sZXQgYW5nbGUgPSAwO1xyXG5mdW5jdGlvbiBmbGlwU2hpcHMoKSB7XHJcbiAgY29uc3Qgc2hpcHMgPSBBcnJheS5mcm9tKHNoaXBDb250YWluZXIuY2hpbGRyZW4pO1xyXG4gIGFuZ2xlID0gYW5nbGUgPT09IDAgPyA5MCA6IDA7XHJcbiAgc2hpcHMuZm9yRWFjaCgoc2hpcCkgPT4ge1xyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXHJcbiAgICBzaGlwLnN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGUoJHthbmdsZX1kZWcpYDtcclxuICB9KTtcclxufVxyXG5mbGlwQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmbGlwU2hpcHMpO1xyXG5cclxuLy8gQ1JFQVRJTkcgR0FNRUJPQVJEXHJcbmZ1bmN0aW9uIGNyZWF0ZUJvYXJkKGNvbG9yLCB1c2VyKSB7XHJcbiAgY29uc3QgZ2FtZUJvYXJkQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lYm9hcmQtY29udGFpbmVyXCIpO1xyXG5cclxuICBjb25zdCBnYW1lQm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gIGdhbWVCb2FyZC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB1c2VyKTtcclxuICBnYW1lQm9hcmQuY2xhc3NMaXN0LmFkZChcImdhbWVib2FyZFwiKTtcclxuICBnYW1lQm9hcmQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3I7XHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwOyBpICs9IDEpIHtcclxuICAgIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoXCJibG9ja1wiKTtcclxuICAgIGJsb2NrLmlkID0gaTtcclxuICAgIGdhbWVCb2FyZC5hcHBlbmQoYmxvY2spO1xyXG4gIH1cclxuXHJcbiAgZ2FtZUJvYXJkQ29udGFpbmVyLmFwcGVuZENoaWxkKGdhbWVCb2FyZCk7XHJcbn1cclxuXHJcbmNyZWF0ZUJvYXJkKFwid2hpdGVcIiwgXCJwbGF5ZXJcIik7XHJcbmNyZWF0ZUJvYXJkKFwiZ2FpbnNib3JvXCIsIFwiY29tcHV0ZXJcIik7XHJcblxyXG4vLyBjb25zb2xlLmxvZyhzaGlwcyk7XHJcblxyXG5mdW5jdGlvbiBjaGVja1ZhbGlkaXR5KGJvYXJkQmxvY2tzLCBpc0hvcml6b250YWwsIHN0YXJ0SW5kZXgsIHNoaXApIHtcclxuICAvLyB0byBwcmV2ZW50IHBsYWNpbmcgc2hpcHMgb2ZmIGJvYXJkXHJcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5lc3RlZC10ZXJuYXJ5XHJcbiAgY29uc3QgdmFsaWRTdGFydCA9IGlzSG9yaXpvbnRhbFxyXG4gICAgPyBzdGFydEluZGV4IDw9IDEwICogMTAgLSBzaGlwLmxlbmd0aFxyXG4gICAgICA/IHN0YXJ0SW5kZXhcclxuICAgICAgOiAxMCAqIDEwIC0gc2hpcC5sZW5ndGhcclxuICAgIDogc3RhcnRJbmRleCA8PSAxMCAqIDEwIC0gMTAgKiBzaGlwLmxlbmd0aFxyXG4gICAgPyBzdGFydEluZGV4XHJcbiAgICA6IHN0YXJ0SW5kZXggLSBzaGlwLmxlbmd0aCAqIDEwICsgMTA7XHJcbiAgLy8gICBjb25zb2xlLmxvZyhgdmFsaWRhdGVkIGkgJHt2YWxpZFN0YXJ0fWApO1xyXG5cclxuICBjb25zdCBzaGlwQmxvY2tzID0gW107XHJcbiAgLy8gc2F2ZSB0aGUgaW5kZXhlcyBvZiBzaGlwcyB0byBhbiBhcnJheVxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgaWYgKGlzSG9yaXpvbnRhbCkgc2hpcEJsb2Nrcy5wdXNoKGJvYXJkQmxvY2tzW051bWJlcih2YWxpZFN0YXJ0KSArIGldKTtcclxuICAgIGVsc2Ugc2hpcEJsb2Nrcy5wdXNoKGJvYXJkQmxvY2tzW051bWJlcih2YWxpZFN0YXJ0KSArIGkgKiAxMF0pO1xyXG4gIH1cclxuXHJcbiAgLy8gdmFsaWRhdGUgcGxhY2UgdG8gcHJldmVudCBzaGlwcyBmcm9tIHNwbGl0dGluZ1xyXG4gIGxldCBpc1ZhbGlkO1xyXG4gIGlmIChpc0hvcml6b250YWwpIHtcclxuICAgIHNoaXBCbG9ja3MuZXZlcnkoXHJcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXR1cm4tYXNzaWduXHJcbiAgICAgIChfYmxvY2ssIGluZGV4KSA9PlxyXG4gICAgICAgIChpc1ZhbGlkID1cclxuICAgICAgICAgIHNoaXBCbG9ja3NbMF0uaWQgJSAxMCAhPT0gMTAgLSAoc2hpcEJsb2Nrcy5sZW5ndGggLSAoaW5kZXggKyAxKSkpXHJcbiAgICApO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBzaGlwQmxvY2tzLmV2ZXJ5KFxyXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmV0dXJuLWFzc2lnblxyXG4gICAgICAoX2Jsb2NrLCBpbmRleCkgPT4gKGlzVmFsaWQgPSBzaGlwQmxvY2tzWzBdLmlkIDwgOTAgKyAoMTAgKiBpbmRleCArIDEpKVxyXG4gICAgKTtcclxuICB9XHJcbiAgLy8gY29uc29sZS5sb2coYGlzIHZhbGlkPyAke2lzVmFsaWR9YCk7XHJcbiAgY29uc3Qgbm90VGFrZW4gPSBzaGlwQmxvY2tzLmV2ZXJ5KFxyXG4gICAgKGJsb2NrKSA9PiAhYmxvY2suY2xhc3NMaXN0LmNvbnRhaW5zKFwiZmlsbGVkXCIpXHJcbiAgKTtcclxuXHJcbiAgcmV0dXJuIHsgc2hpcEJsb2NrcywgaXNWYWxpZCwgbm90VGFrZW4gfTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkU2hpcCh1c2VyLCBzaGlwLCBzdGFydElkKSB7XHJcbiAgY29uc29sZS5sb2coXCJhZGRzaGlwXCIpO1xyXG4gIC8vICAgY29uc29sZS5sb2codXNlcik7XHJcbiAgY29uc3QgYm9hcmRCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAjJHt1c2VyfSBkaXZgKTtcclxuICBjb25zdCBib29sID0gTWF0aC5yYW5kb20oKSA8IDAuNTsgLy8gcmV0dXJuZWQgbnVtYmVyIGVpdGhlciB3aWxsIGJlIGJpZ2dlciB0aGFuIDAuNSBvciBub3QgaGVuY2UgdGhlIHJhbmRvbSBib29sXHJcbiAgY29uc3QgaXNIb3Jpem9udGFsID0gdXNlciA9PT0gXCJwbGF5ZXJcIiA/IGFuZ2xlID09PSAwIDogYm9vbDtcclxuICBjb25zdCByYW5kb21TdGFydEluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAgKiAxMCk7IC8vIHRlbiB0aW1lcyB0ZW4gaXMgdGhlIHdpZHRoIG9mIHRoZSBib2FyZFxyXG4gIC8vICAgY29uc29sZS5sb2coYGhvcml6b250YWwgJHtpc0hvcml6b250YWx9YCk7XHJcbiAgLy8gICBjb25zb2xlLmxvZyhgcmFuZG9tIGluZGV4ICR7cmFuZG9tU3RhcnRJbmRleH1gKTtcclxuXHJcbiAgY29uc3Qgc3RhcnRJbmRleCA9IHN0YXJ0SWQgfHwgcmFuZG9tU3RhcnRJbmRleDtcclxuICAvLyAgIGNvbnNvbGUubG9nKGBzdGFydCBpbmRleCAke3N0YXJ0SW5kZXh9YCk7XHJcblxyXG4gIGNvbnN0IHsgc2hpcEJsb2NrcywgaXNWYWxpZCwgbm90VGFrZW4gfSA9IGNoZWNrVmFsaWRpdHkoXHJcbiAgICBib2FyZEJsb2NrcyxcclxuICAgIGlzSG9yaXpvbnRhbCxcclxuICAgIHN0YXJ0SW5kZXgsXHJcbiAgICBzaGlwXHJcbiAgKTtcclxuXHJcbiAgLy8gY29uc29sZS5sb2coYG5vdCB0YWtlbj8gJHtub3RUYWtlbn1gKTtcclxuICBpZiAoaXNWYWxpZCAmJiBub3RUYWtlbikge1xyXG4gICAgc2hpcEJsb2Nrcy5mb3JFYWNoKChibG9jaykgPT4ge1xyXG4gICAgICBibG9jay5jbGFzc0xpc3QuYWRkKHNoaXAubmFtZSk7XHJcbiAgICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoXCJmaWxsZWRcIik7XHJcbiAgICB9KTtcclxuICAgIC8vIGFkZCBmaWxsZWQgY2xhc3MgdG8gYWRqYWNlbnQgYmxvY2tzIHRvIHByZXZlbnQgcGxhY2luZyBzaGlwcyBzaWRlIHRvIHNpZGVcclxuICAgIGNvbnN0IGFkamFjZW50SW5kZXhlcyA9IGdldEFkamFjZW50SW5kZXhlcyhcclxuICAgICAgYm9hcmRCbG9ja3MsXHJcbiAgICAgIGlzSG9yaXpvbnRhbCxcclxuICAgICAgc2hpcEJsb2Nrc1xyXG4gICAgKTtcclxuICAgIGFkamFjZW50SW5kZXhlcy5mb3JFYWNoKChhZGphY2VudEluZGV4KSA9PiB7XHJcbiAgICAgIGNvbnN0IGFkamFjZW50QmxvY2sgPSBib2FyZEJsb2Nrc1thZGphY2VudEluZGV4XTtcclxuICAgICAgYWRqYWNlbnRCbG9jay5jbGFzc0xpc3QuYWRkKFwiZmlsbGVkXCIpO1xyXG4gICAgfSk7XHJcbiAgICBjb25zb2xlLmxvZyhhZGphY2VudEluZGV4ZXMpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBpZiAodXNlciA9PT0gXCJjb21wdXRlclwiKSBhZGRTaGlwKHVzZXIsIHNoaXAsIHN0YXJ0SWQpO1xyXG4gICAgaWYgKHVzZXIgPT09IFwicGxheWVyXCIpIG5vdERyb3BwZWQgPSB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxuLy8gaGVscGVyIGZ1bmN0aW9uIHRvIGdldCBhZGphY2VudCBpbmRleGVzXHJcbmZ1bmN0aW9uIGdldEFkamFjZW50SW5kZXhlcyhib2FyZEJsb2NrcywgaXNIb3Jpem9udGFsLCBzaGlwQmxvY2tzKSB7XHJcbiAgY29uc3QgYm9hcmRCbG9ja3NBcnJheSA9IFsuLi5ib2FyZEJsb2Nrc107XHJcbiAgY29uc3QgYWRqYWNlbnRJbmRleGVzID0gW107XHJcblxyXG4gIHNoaXBCbG9ja3MuZm9yRWFjaCgoYmxvY2ssIGluZGV4KSA9PiB7XHJcbiAgICBjb25zdCBibG9ja0luZGV4ID0gYm9hcmRCbG9ja3NBcnJheS5pbmRleE9mKGJsb2NrKTtcclxuICAgIGNvbnN0IHJvdyA9IE1hdGguZmxvb3IoYmxvY2tJbmRleCAvIDEwKTtcclxuICAgIGNvbnN0IGNvbCA9IGJsb2NrSW5kZXggJSAxMDtcclxuXHJcbiAgICBpZiAoaXNIb3Jpem9udGFsKSB7XHJcbiAgICAgIGlmIChjb2wgPiAwKSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4IC0gMSk7IC8vIGxlZnQgYmxvY2tcclxuICAgICAgaWYgKGNvbCA8IDkpIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggKyAxKTsgLy8gcmlnaHQgYmxvY2tcclxuICAgICAgaWYgKHJvdyA+IDApIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggLSAxMCk7IC8vIHRvcCBibG9ja1xyXG4gICAgICBpZiAocm93IDwgOSkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCArIDEwKTsgLy8gYm90dG9tIGJsb2NrXHJcbiAgICAgIGlmIChjb2wgPiAwICYmIHJvdyA+IDApIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggLSAxMSk7IC8vIHRvcC1sZWZ0IGJsb2NrXHJcbiAgICAgIGlmIChjb2wgPiAwICYmIHJvdyA8IDkpIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggKyA5KTsgLy8gYm90dG9tLWxlZnQgYmxvY2tcclxuICAgICAgaWYgKGNvbCA8IDkgJiYgcm93ID4gMCkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCAtIDkpOyAvLyB0b3AtcmlnaHQgYmxvY2tcclxuICAgICAgaWYgKGNvbCA8IDkgJiYgcm93IDwgOSkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCArIDExKTsgLy8gYm90dG9tLXJpZ2h0IGJsb2NrXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAocm93ID4gMCkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCAtIDEwKTsgLy8gdG9wIGJsb2NrXHJcbiAgICAgIGlmIChyb3cgPCA5KSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4ICsgMTApOyAvLyBib3R0b20gYmxvY2tcclxuICAgICAgaWYgKGNvbCA+IDApIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggLSAxKTsgLy8gbGVmdCBibG9ja1xyXG4gICAgICBpZiAoY29sIDwgOSkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCArIDEpOyAvLyByaWdodCBibG9ja1xyXG4gICAgICBpZiAocm93ID4gMCAmJiBjb2wgPiAwKSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4IC0gMTEpOyAvLyB0b3AtbGVmdCBibG9ja1xyXG4gICAgICBpZiAocm93ID4gMCAmJiBjb2wgPCA5KSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4IC0gOSk7IC8vIHRvcC1yaWdodCBibG9ja1xyXG4gICAgICBpZiAocm93IDwgOSAmJiBjb2wgPiAwKSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4ICsgOSk7IC8vIGJvdHRvbS1sZWZ0IGJsb2NrXHJcbiAgICAgIGlmIChyb3cgPCA5ICYmIGNvbCA8IDkpIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggKyAxMSk7IC8vIGJvdHRvbS1yaWdodCBibG9ja1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBjb25zdCB1bmlxdWVBZGphY2VudEluZGV4ZXMgPSBBcnJheS5mcm9tKG5ldyBTZXQoYWRqYWNlbnRJbmRleGVzKSk7XHJcblxyXG4gIHJldHVybiB1bmlxdWVBZGphY2VudEluZGV4ZXM7XHJcbn1cclxuLy8gYWRkU2hpcChkZXN0cm95ZXIpO1xyXG4vLyBhZGRTaGlwKHN1Ym1hcmluZSk7XHJcbi8vIGFkZFNoaXAoY3J1aXNlcik7XHJcbi8vIGFkZFNoaXAoYmF0dGxlc2hpcCk7XHJcbi8vIGFkZFNoaXAoXCJjb21wdXRlclwiLCBjYXJyaWVyKTtcclxuXHJcbi8vIERSQUcmRFJPUCBQTEFZRVIgU0hJUFNcclxubGV0IGRyYWdnZWRTaGlwO1xyXG5jb25zdCBzaGlwT3B0aW9ucyA9IEFycmF5LmZyb20oc2hpcENvbnRhaW5lci5jaGlsZHJlbik7XHJcbnNoaXBPcHRpb25zLmZvckVhY2goKHNoaXApID0+IHNoaXAuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdzdGFydFwiLCBkcmFnU3RhcnQpKTtcclxuXHJcbmNvbnN0IHBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNwbGF5ZXIgZGl2XCIpO1xyXG5wbGF5ZXJCb2FyZC5mb3JFYWNoKChibG9jaykgPT4ge1xyXG4gIGJsb2NrLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBkcmFnT3Zlcik7XHJcbiAgYmxvY2suYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgZHJvcFNoaXApO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGRyYWdTdGFydChlKSB7XHJcbiAgbm90RHJvcHBlZCA9IGZhbHNlO1xyXG4gIGRyYWdnZWRTaGlwID0gZS50YXJnZXQ7XHJcbiAgY29uc29sZS5sb2coXCJkcmFnIHN0YXJ0ZWRcIik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYWdPdmVyKGUpIHtcclxuICAvLyBjb25zb2xlLmxvZyhcImRyYWdvdmVyXCIpO1xyXG4gIC8vIGNvbnNvbGUubG9nKGUudGFyZ2V0LnBhcmVudE5vZGUpO1xyXG4gIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgaWYgKCFkcmFnZ2VkU2hpcCkgcmV0dXJuO1xyXG4gIGNvbnN0IHNoaXAgPSBzaGlwc1tkcmFnZ2VkU2hpcC5pZF07XHJcblxyXG4gIGhpZ2hsaWdodFNoaXBBcmVhKGUudGFyZ2V0LmlkLCBzaGlwKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJvcFNoaXAoZSkge1xyXG4gIGNvbnNvbGUubG9nKFwiZHJvcHNoaXBcIik7XHJcbiAgY29uc3Qgc3RhcnRJZCA9IGUudGFyZ2V0LmlkO1xyXG4gIGlmIChkcmFnZ2VkU2hpcCA9PT0gdW5kZWZpbmVkIHx8IGRyYWdnZWRTaGlwID09PSBudWxsKSByZXR1cm47XHJcbiAgY29uc3Qgc2hpcCA9IHNoaXBzW2RyYWdnZWRTaGlwLmlkXTtcclxuICBjb25zb2xlLmxvZyhzaGlwLCBcInRoaXMgaXMgc2hpcFwiKTtcclxuXHJcbiAgYWRkU2hpcChcInBsYXllclwiLCBzaGlwLCBzdGFydElkKTtcclxuICBpZiAoIW5vdERyb3BwZWQpIGRyYWdnZWRTaGlwLnJlbW92ZSgpO1xyXG5cclxuICBkcmFnZ2VkU2hpcCA9IG51bGw7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhpZ2hsaWdodFNoaXBBcmVhKHN0YXJ0SW5kZXgsIHNoaXApIHtcclxuICBjb25zdCBpc0hvcml6b250YWwgPSBhbmdsZSA9PT0gMDtcclxuXHJcbiAgY29uc3QgeyBzaGlwQmxvY2tzLCBpc1ZhbGlkLCBub3RUYWtlbiB9ID0gY2hlY2tWYWxpZGl0eShcclxuICAgIHBsYXllckJvYXJkLFxyXG4gICAgaXNIb3Jpem9udGFsLFxyXG4gICAgc3RhcnRJbmRleCxcclxuICAgIHNoaXBcclxuICApO1xyXG5cclxuICBpZiAoaXNWYWxpZCAmJiBub3RUYWtlbikge1xyXG4gICAgc2hpcEJsb2Nrcy5mb3JFYWNoKChibG9jaykgPT4ge1xyXG4gICAgICBibG9jay5jbGFzc0xpc3QuYWRkKFwiaG92ZXJcIik7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gYmxvY2suY2xhc3NMaXN0LnJlbW92ZShcImhvdmVyXCIpLCA1MDApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBHQU1FIExPR0lDXHJcblxyXG5sZXQgZ2FtZU92ZXIgPSBmYWxzZTtcclxubGV0IHBsYXllclR1cm47XHJcblxyXG4vLyBzdGFydCB0aGUgZ2FtZVxyXG5cclxuZnVuY3Rpb24gc3RhcnRHYW1lU2luZ2xlKCkge1xyXG4gIGlmIChwbGF5ZXJUdXJuID09PSB1bmRlZmluZWQpIHtcclxuICAgIGlmIChzaGlwQ29udGFpbmVyLmNoaWxkcmVuLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9IFwiUGxlYXNlIHBsYWNlIGFsbCB5b3VyIHNoaXBzIGZpcnN0IVwiO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgYm9hcmRCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI2NvbXB1dGVyIGRpdlwiKTtcclxuICAgICAgYm9hcmRCbG9ja3MuZm9yRWFjaCgoYmxvY2spID0+XHJcbiAgICAgICAgYmxvY2suYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUNsaWNrKVxyXG4gICAgICApO1xyXG4gICAgICBwbGF5ZXJUdXJuID0gdHJ1ZTtcclxuICAgICAgdHVybkRpc3BsYXkudGV4dENvbnRlbnQgPSBcIllvdXIgdHVybiFcIjtcclxuICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBcIlRoZSBiYXR0bGUgaGFzIGJlZ3VuIVwiO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxubGV0IHBsYXllckhpdHMgPSBbXTtcclxubGV0IGNvbXB1dGVySGl0cyA9IFtdO1xyXG5jb25zdCBwbGF5ZXJTdW5rU2hpcHMgPSBbXTtcclxuY29uc3QgY29tcHV0ZXJTdW5rU2hpcHMgPSBbXTtcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUNsaWNrKGUpIHtcclxuICBpZiAoIWdhbWVPdmVyKSB7XHJcbiAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZmlsbGVkXCIpKSB7XHJcbiAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XHJcbiAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJZb3UgaGl0IHRoZSBlbmVteSBzaGlwIVwiO1xyXG4gICAgICBjb25zdCBjbGFzc2VzID0gQXJyYXkuZnJvbShlLnRhcmdldC5jbGFzc0xpc3QpLmZpbHRlcihcclxuICAgICAgICAobmFtZSkgPT4gIVtcImJsb2NrXCIsIFwiaGl0XCIsIFwiZmlsbGVkXCJdLmluY2x1ZGVzKG5hbWUpXHJcbiAgICAgICk7XHJcbiAgICAgIHBsYXllckhpdHMucHVzaCguLi5jbGFzc2VzKTtcclxuICAgICAgY2hlY2tTY29yZShcInBsYXllclwiLCBwbGF5ZXJIaXRzLCBwbGF5ZXJTdW5rU2hpcHMpO1xyXG4gICAgfVxyXG4gICAgaWYgKCFlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJmaWxsZWRcIikpIHtcclxuICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBcIk1pc3MhXCI7XHJcbiAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xyXG4gICAgfVxyXG4gICAgcGxheWVyVHVybiA9IGZhbHNlO1xyXG4gICAgY29uc3QgYm9hcmRCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI2NvbXB1dGVyIGRpdlwiKTtcclxuICAgIGJvYXJkQmxvY2tzLmZvckVhY2goXHJcbiAgICAgIChibG9jaykgPT4gYmxvY2sucmVwbGFjZVdpdGgoYmxvY2suY2xvbmVOb2RlKHRydWUpKSAvLyB0byByZW1vdmUgZXZlbnQgbGlzdGVuZXJzXHJcbiAgICApO1xyXG4gICAgc2V0VGltZW91dChjb21wdXRlcnNUdXJuLCA1MDApO1xyXG4gIH1cclxufVxyXG5cclxuLy8gY29tcHV0ZXJzIHR1cm5cclxuZnVuY3Rpb24gY29tcHV0ZXJzVHVybigpIHtcclxuICBpZiAoIWdhbWVPdmVyKSB7XHJcbiAgICB0dXJuRGlzcGxheS50ZXh0Q29udGVudCA9IFwiQ29tcHV0ZXJzIFR1cm5cIjtcclxuICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJNYWtpbmcgY2FsY3VsYXRpb25zLi5cIjtcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgY29uc3QgcmFuZG9tU2hvdCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwICogMTApO1xyXG4gICAgICBpZiAoXHJcbiAgICAgICAgcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiZmlsbGVkXCIpICYmXHJcbiAgICAgICAgcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGl0XCIpXHJcbiAgICAgICkge1xyXG4gICAgICAgIGNvbXB1dGVyc1R1cm4oKTtcclxuICAgICAgfSBlbHNlIGlmIChcclxuICAgICAgICBwbGF5ZXJCb2FyZFtyYW5kb21TaG90XS5jbGFzc0xpc3QuY29udGFpbnMoXCJmaWxsZWRcIikgJiZcclxuICAgICAgICAhcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGl0XCIpXHJcbiAgICAgICkge1xyXG4gICAgICAgIHBsYXllckJvYXJkW3JhbmRvbVNob3RdLmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XHJcbiAgICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBcIkhpdCB0aGUgdGFyZ2V0IVwiO1xyXG4gICAgICAgIGNvbnN0IGNsYXNzZXMgPSBBcnJheS5mcm9tKHBsYXllckJvYXJkW3JhbmRvbVNob3RdLmNsYXNzTGlzdCkuZmlsdGVyKFxyXG4gICAgICAgICAgKG5hbWUpID0+ICFbXCJibG9ja1wiLCBcImhpdFwiLCBcImZpbGxlZFwiXS5pbmNsdWRlcyhuYW1lKVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY29tcHV0ZXJIaXRzLnB1c2goLi4uY2xhc3Nlcyk7XHJcbiAgICAgICAgY2hlY2tTY29yZShcImNvbXB1dGVyXCIsIGNvbXB1dGVySGl0cywgY29tcHV0ZXJTdW5rU2hpcHMpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJNaXNzIVwiO1xyXG4gICAgICAgIHBsYXllckJvYXJkW3JhbmRvbVNob3RdLmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xyXG4gICAgICB9XHJcbiAgICB9LCA1MDApO1xyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBwbGF5ZXJUdXJuID0gdHJ1ZTtcclxuICAgICAgdHVybkRpc3BsYXkudGV4dENvbnRlbnQgPSBcIlBsYXllcidzIHR1cm5cIjtcclxuICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBcIlRha2UgeW91ciBzaG90IVwiO1xyXG5cclxuICAgICAgY29uc3QgYm9hcmRCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI2NvbXB1dGVyIGRpdlwiKTtcclxuICAgICAgYm9hcmRCbG9ja3MuZm9yRWFjaCgoYmxvY2spID0+XHJcbiAgICAgICAgYmxvY2suYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUNsaWNrKVxyXG4gICAgICApOyAvLyByZS1hZGRpbmcgZXZlbnQgbGlzdGVuZXJzXHJcbiAgICB9LCA1MDApO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tTY29yZSh1c2VyLCB1c2VySGl0cywgdXNlclN1bmtTaGlwcykge1xyXG4gIGZ1bmN0aW9uIGNoZWNrU2hpcChzaGlwTmFtZSwgc2hpcExlbmd0aCkge1xyXG4gICAgaWYgKFxyXG4gICAgICB1c2VySGl0cy5maWx0ZXIoKGhpdFNoaXApID0+IGhpdFNoaXAgPT09IHNoaXBOYW1lKS5sZW5ndGggPT09IHNoaXBMZW5ndGhcclxuICAgICkge1xyXG4gICAgICBpZiAodXNlciA9PT0gXCJwbGF5ZXJcIikge1xyXG4gICAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gYFlvdSBzdW5rIHRoZSBlbmVteSAke3NoaXBOYW1lfSFgO1xyXG5cclxuICAgICAgICBwbGF5ZXJIaXRzID0gdXNlckhpdHMuZmlsdGVyKChoaXRTaGlwKSA9PiBoaXRTaGlwICE9PSBzaGlwTmFtZSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHVzZXIgPT09IFwiY29tcHV0ZXJcIikge1xyXG4gICAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gYFRoZSBlbmVteSBzdW5rIHlvdXIgJHtzaGlwTmFtZX0hYDtcclxuICAgICAgICBjb21wdXRlckhpdHMgPSB1c2VySGl0cy5maWx0ZXIoKGhpdFNoaXApID0+IGhpdFNoaXAgIT09IHNoaXBOYW1lKTtcclxuICAgICAgfVxyXG4gICAgICB1c2VyU3Vua1NoaXBzLnB1c2goc2hpcE5hbWUpO1xyXG4gICAgfVxyXG4gIH1cclxuICBjaGVja1NoaXAoXCJkZXN0cm95ZXJcIiwgMik7XHJcbiAgY2hlY2tTaGlwKFwic3VibWFyaW5lXCIsIDMpO1xyXG4gIGNoZWNrU2hpcChcImNydWlzZXJcIiwgMyk7XHJcbiAgY2hlY2tTaGlwKFwiYmF0dGxlc2hpcFwiLCA0KTtcclxuICBjaGVja1NoaXAoXCJjYXJyaWVyXCIsIDUpO1xyXG4gIGNvbnNvbGUubG9nKFwicGxheWVySGl0c1wiLCBwbGF5ZXJIaXRzKTtcclxuICBjb25zb2xlLmxvZyhcInBsYXllclN1bmtTaGlwc1wiLCBwbGF5ZXJTdW5rU2hpcHMpO1xyXG5cclxuICBpZiAocGxheWVyU3Vua1NoaXBzLmxlbmd0aCA9PT0gNSkge1xyXG4gICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPVxyXG4gICAgICBcIllvdSBzdW5rIGFsbCB0aGUgZW5lbXkgc2hpcHMhIFdlbGwgZm91Z2h0IGFkbWlyYWwhXCI7XHJcbiAgICBnYW1lT3ZlciA9IHRydWU7XHJcbiAgICBzdGFydEJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RhcnRHYW1lU2luZ2xlKTtcclxuICB9XHJcbiAgaWYgKGNvbXB1dGVyU3Vua1NoaXBzLmxlbmd0aCA9PT0gNSkge1xyXG4gICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPVxyXG4gICAgICBcIllvdXIgZmxlZXQgaGFzIGJlZW4gZGVzdHJveWVkISBXZWxsIGZvdWdodCBhZG1pcmFsLCB3ZSdsbCBnZXQgdGhlbSBuZXh0IHRpbWUuXCI7XHJcbiAgICBnYW1lT3ZlciA9IHRydWU7XHJcbiAgICBzdGFydEJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RhcnRHYW1lU2luZ2xlKTtcclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9