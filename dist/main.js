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
const connectionInfo = document.getElementById("connection-info");
const gameControlButtons = document.getElementById("game-control-buttons");
const turnDisplay = document.getElementById("turn-display");

let playerHits = [];
let computerHits = [];

const playerSunkShips = [];
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

  connectionInfo.classList.remove("hidden");
  infoDisplay.innerHTML = "Çok oyunculu mod başladı!";

  const socket = io();

  // get player number

  socket.on("player-number", (num) => {
    if (num === -1) {
      infoDisplay.innerHTML = "Sunucu dolu. Lütfen daha sonra tekrar dene.";
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
    else infoDisplay.innerHTML = "Lütfen önce gemilerini yerleştir!";
    // const boardBlocks = document.querySelectorAll("#computer div");
  });

  // event listener for firing

  const boardBlocks = document.querySelectorAll("#computer div");
  socket.on("turn-change", (turn) => {
    turnNum = turn;
    if (turnNum === playerNum) turnDisplay.innerHTML = "Senin sıran";
    else turnDisplay.innerHTML = "Rakibin sırası";
  });
  socket.on("gameover", (status) => {
    gameOver = status;
    if (gameOver) {
      turnDisplay.textContent = "Oyun bitti!";
      if (playerSunkShips.length !== 5)
        infoDisplay.innerHTML = "Rakibin bütün gemilerini yok etti. Kaybettin!";
    }
  });

  boardBlocks.forEach((block) => {
    block.addEventListener("click", (e) => {
      if (turnNum === playerNum) {
        if (gameOver) return;
        if (!allShipsPlaced) {
          infoDisplay.innerHTML = "Lütfen önce gemilerini yerleştir!";
          return;
        }
        if (!enemyReady) {
          infoDisplay.innerHTML = "Lütfen rakibini bekle!";
          return;
        }
        shotFired = handleClick(e);
        console.log(enemyReady);

        turnNum = (turnNum + 1) % 2;

        socket.emit("turn-change", turnNum);
        socket.emit("fire", shotFired, turnNum);
        socket.emit("gameover", gameOver);
      } else turnDisplay.innerHTML = "Rakibin sırası";
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
      turnDisplay.innerHTML = "Senin sıran";
    }
    if (currentPlayer === "enemy") {
      turnDisplay.innerHTML = "Rakibin sırası";
    }

    const playerBoardData = Array.from(
      document.querySelectorAll("#player div")
    ).map((block) => block.className);
    socket.emit("board-data", playerBoardData);
  }
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
  infoDisplay.innerHTML = "Tek oyunculu oyun başladı!";
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

  const startIndex = startId || randomStartIndex;

  const { shipBlocks, isValid, notTaken } = checkValidity(
    boardBlocks,
    isHorizontal,
    startIndex,
    ship
  );

  if (!isValid || !notTaken)
    infoDisplay.innerHTML = "Gemini buraya yerleştiremezsin!";

  infoDisplay.innerHTML = "";
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

  highlightShipArea(e.target.id, ship);
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
      infoDisplay.textContent = "Lütfen önce gemilerini yerleştir!";
    } else {
      const boardBlocks = document.querySelectorAll("#computer div");
      boardBlocks.forEach((block) =>
        block.addEventListener("click", handleClick)
      );
      playerTurn = true;
      turnDisplay.textContent = "Senin sıran";
      infoDisplay.textContent = "Oyun başladı!";
      gameControlButtons.classList.add("hidden");
    }
  }
}

function handleClick(e) {
  // current turn is not getting updated after player 0 takes it shot
  if (gameMode === "singleplayer" && !playerTurn) return;
  if (!gameOver && allShipsPlaced) {
    if (e.target.classList.contains("hit")) return; // do this better
    if (e.target.classList.contains("filled")) {
      e.target.classList.add("hit");
      infoDisplay.textContent = "Bir gemiyi vurdun!";
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
    }
    if (!e.target.classList.contains("filled")) {
      infoDisplay.textContent = "Iskaladın!";
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

      setTimeout(computersTurn, 750);
    }
  }
  return e.target.id; // use this to communicate with server?
}

// computers turn
function computersTurn() {
  if (!gameOver) {
    turnDisplay.textContent = "Bilgisayarın sırası";
    infoDisplay.textContent = "Hesaplamalar yapılıyor..";

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
        infoDisplay.textContent = "Hedef vuruldu!";
        const classes = Array.from(playerBoard[randomShot].classList).filter(
          (name) => !["block", "hit", "filled"].includes(name)
        );
        computerHits.push(...classes);
        checkScore("computer", computerHits, computerSunkShips);
      } else {
        infoDisplay.textContent = "Iska!";
        playerBoard[randomShot].classList.add("miss");
      }
    }, 750);
    const boardBlocks = document.querySelectorAll("#computer div");
    boardBlocks.forEach(
      (block) => block.replaceWith(block.cloneNode(true)) // to remove event listeners
    );
    handleEventListeners();
    setTimeout(() => {
      playerTurn = true;
      turnDisplay.textContent = "Senin sıran";
      infoDisplay.textContent = "Atışını yap!";
    }, 750);
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
        infoDisplay.textContent = `Rakibin ${shipName} gemisini batırdın!`;

        playerHits = userHits.filter((hitShip) => hitShip !== shipName);
      }
      // if (user === "enemy") {
      //   enemyHits = userHits.filter((hitShip) => hitShip !== shipName);
      // }
      if (user === "computer") {
        infoDisplay.textContent = `Rakip ${shipName} gemini batırdı!`;
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
    infoDisplay.textContent = "Rakibin bütün gemilerini yok ettin. Kazandın!"; // game over player 1 won
    gameOver = true;
    if (gameMode === "singleplayer")
      startButton.removeEventListener("click", startGameSingle);
  }
  if (computerSunkShips.length === 5) {
    infoDisplay.textContent = "Bütün gemilerin yok edildi. İyi savaştı amiral.";
    gameOver = true;
    startButton.removeEventListener("click", startGameSingle);
  }
}

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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YnBhY2s6Ly9iYXR0bGVzaGlwLXByb2plY3QvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gbXVsdGktc2luZ2xlIHBsYXllciBjb250cm9sc1xyXG5jb25zdCBzaW5nbGVQbGF5ZXJCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNpbmdsZS1wbGF5ZXItYnV0dG9uXCIpO1xyXG5jb25zdCBtdWx0aXBsYXllckJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXVsdGlwbGF5ZXItYnV0dG9uXCIpO1xyXG4vLyBzdGFydCB0aGUgZ2FtZVxyXG5jb25zdCBzdGFydEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RhcnQtYnV0dG9uXCIpO1xyXG5jb25zdCBpbmZvRGlzcGxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5mby1kaXNwbGF5XCIpO1xyXG5jb25zdCBjb25uZWN0aW9uSW5mbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29ubmVjdGlvbi1pbmZvXCIpO1xyXG5jb25zdCBnYW1lQ29udHJvbEJ1dHRvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtY29udHJvbC1idXR0b25zXCIpO1xyXG5jb25zdCB0dXJuRGlzcGxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHVybi1kaXNwbGF5XCIpO1xyXG5cclxubGV0IHBsYXllckhpdHMgPSBbXTtcclxubGV0IGNvbXB1dGVySGl0cyA9IFtdO1xyXG5cclxuY29uc3QgcGxheWVyU3Vua1NoaXBzID0gW107XHJcbmNvbnN0IGNvbXB1dGVyU3Vua1NoaXBzID0gW107XHJcblxyXG4vLyBDUkVBVElORyBTSElQU1xyXG5jbGFzcyBTaGlwIHtcclxuICBjb25zdHJ1Y3RvcihuYW1lLCBsZW5ndGgpIHtcclxuICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IGRlc3Ryb3llciA9IG5ldyBTaGlwKFwiZGVzdHJveWVyXCIsIDIpO1xyXG5jb25zdCBzdWJtYXJpbmUgPSBuZXcgU2hpcChcInN1Ym1hcmluZVwiLCAzKTtcclxuY29uc3QgY3J1aXNlciA9IG5ldyBTaGlwKFwiY3J1aXNlclwiLCAzKTtcclxuY29uc3QgYmF0dGxlc2hpcCA9IG5ldyBTaGlwKFwiYmF0dGxlc2hpcFwiLCA0KTtcclxuY29uc3QgY2FycmllciA9IG5ldyBTaGlwKFwiY2FycmllclwiLCA1KTtcclxuXHJcbmNvbnN0IHNoaXBzID0gW2Rlc3Ryb3llciwgc3VibWFyaW5lLCBjcnVpc2VyLCBiYXR0bGVzaGlwLCBjYXJyaWVyXTtcclxuXHJcbmNvbnN0IGZsaXBCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZsaXAtYnV0dG9uXCIpO1xyXG5jb25zdCBzaGlwQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zaGlwLXNlbGVjdC1jb250YWluZXJcIik7XHJcbmxldCB1c2VyID0gXCJwbGF5ZXJcIjtcclxubGV0IGN1cnJlbnRQbGF5ZXIgPSB1c2VyO1xyXG5sZXQgZ2FtZU1vZGUgPSBcIlwiO1xyXG5sZXQgcGxheWVyTnVtID0gMDtcclxubGV0IHR1cm5OdW0gPSAwO1xyXG5sZXQgcmVhZHkgPSBmYWxzZTtcclxubGV0IGdhbWVPdmVyID0gZmFsc2U7XHJcbmxldCBlbmVteVJlYWR5ID0gZmFsc2U7XHJcbmxldCBhbGxTaGlwc1BsYWNlZCA9IGZhbHNlO1xyXG5sZXQgc2hvdEZpcmVkID0gLTE7XHJcbmxldCBub3REcm9wcGVkO1xyXG5sZXQgc2luZ2xlUGxheWVyU3RhcnRlZDtcclxubGV0IG11bHRpUGxheWVyU3RhcnRlZDtcclxuXHJcbmZ1bmN0aW9uIHN0YXJ0TXVsdGlwbGF5ZXIoKSB7XHJcbiAgaWYgKG11bHRpUGxheWVyU3RhcnRlZCkgcmV0dXJuO1xyXG4gIGlmIChzaW5nbGVQbGF5ZXJTdGFydGVkKSByZXR1cm47XHJcbiAgbXVsdGlQbGF5ZXJTdGFydGVkID0gdHJ1ZTtcclxuICBnYW1lTW9kZSA9IFwibXVsdGlwbGF5ZXJcIjtcclxuXHJcbiAgY29ubmVjdGlvbkluZm8uY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcclxuICBpbmZvRGlzcGxheS5pbm5lckhUTUwgPSBcIsOHb2sgb3l1bmN1bHUgbW9kIGJhxZ9sYWTEsSFcIjtcclxuXHJcbiAgY29uc3Qgc29ja2V0ID0gaW8oKTtcclxuXHJcbiAgLy8gZ2V0IHBsYXllciBudW1iZXJcclxuXHJcbiAgc29ja2V0Lm9uKFwicGxheWVyLW51bWJlclwiLCAobnVtKSA9PiB7XHJcbiAgICBpZiAobnVtID09PSAtMSkge1xyXG4gICAgICBpbmZvRGlzcGxheS5pbm5lckhUTUwgPSBcIlN1bnVjdSBkb2x1LiBMw7x0ZmVuIGRhaGEgc29ucmEgdGVrcmFyIGRlbmUuXCI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwbGF5ZXJOdW0gPSBwYXJzZUludChudW0pO1xyXG4gICAgICBpZiAocGxheWVyTnVtID09PSAxKSBjdXJyZW50UGxheWVyID0gXCJlbmVteVwiO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhwbGF5ZXJOdW0pO1xyXG5cclxuICAgICAgc29ja2V0LmVtaXQoXCJjaGVjay1wbGF5ZXJzXCIpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIC8vIHBsYXllciBjb25uZWN0aW9uIGNvbnRyb2xcclxuICBzb2NrZXQub24oXCJwbGF5ZXItY29ubmVjdGlvblwiLCAobnVtKSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhgcGxheWVyICR7bnVtfSBoYXMgY29ubmVjdGVkYCk7XHJcbiAgICBjb250cm9sUGxheWVyQ29ubmVjdGlvbihudW0pO1xyXG4gIH0pO1xyXG5cclxuICAvLyBlbmVteSByZWFkeVxyXG4gIHNvY2tldC5vbihcImVuZW15LXJlYWR5XCIsIChudW0pID0+IHtcclxuICAgIGVuZW15UmVhZHkgPSB0cnVlO1xyXG4gICAgcGxheWVyUmVhZHkobnVtKTtcclxuICAgIGlmIChyZWFkeSkgc3RhcnRHYW1lTXVsdGkoc29ja2V0KTtcclxuICB9KTtcclxuXHJcbiAgLy8gY2hlY2sgcGxheWVyIHN0YXR1c1xyXG4gIHNvY2tldC5vbihcImNoZWNrLXBsYXllcnNcIiwgKHBsYXllcnMpID0+IHtcclxuICAgIHBsYXllcnMuZm9yRWFjaCgocGxheWVyLCBpbmRleCkgPT4ge1xyXG4gICAgICBpZiAocGxheWVyLmNvbm5lY3RlZCkgY29udHJvbFBsYXllckNvbm5lY3Rpb24oaW5kZXgpO1xyXG4gICAgICBpZiAocGxheWVyLnJlYWR5KSB7XHJcbiAgICAgICAgcGxheWVyUmVhZHkoaW5kZXgpO1xyXG4gICAgICAgIGlmIChpbmRleCAhPT0gcGxheWVyTnVtKSBlbmVteVJlYWR5ID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIHN0YXJ0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICBpZiAoIWFsbFNoaXBzUGxhY2VkKSByZXR1cm47XHJcbiAgICBpZiAoYWxsU2hpcHNQbGFjZWQpIHN0YXJ0R2FtZU11bHRpKHNvY2tldCk7XHJcbiAgICBlbHNlIGluZm9EaXNwbGF5LmlubmVySFRNTCA9IFwiTMO8dGZlbiDDtm5jZSBnZW1pbGVyaW5pIHllcmxlxZ90aXIhXCI7XHJcbiAgICAvLyBjb25zdCBib2FyZEJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjY29tcHV0ZXIgZGl2XCIpO1xyXG4gIH0pO1xyXG5cclxuICAvLyBldmVudCBsaXN0ZW5lciBmb3IgZmlyaW5nXHJcblxyXG4gIGNvbnN0IGJvYXJkQmxvY2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNjb21wdXRlciBkaXZcIik7XHJcbiAgc29ja2V0Lm9uKFwidHVybi1jaGFuZ2VcIiwgKHR1cm4pID0+IHtcclxuICAgIHR1cm5OdW0gPSB0dXJuO1xyXG4gICAgaWYgKHR1cm5OdW0gPT09IHBsYXllck51bSkgdHVybkRpc3BsYXkuaW5uZXJIVE1MID0gXCJTZW5pbiBzxLFyYW5cIjtcclxuICAgIGVsc2UgdHVybkRpc3BsYXkuaW5uZXJIVE1MID0gXCJSYWtpYmluIHPEsXJhc8SxXCI7XHJcbiAgfSk7XHJcbiAgc29ja2V0Lm9uKFwiZ2FtZW92ZXJcIiwgKHN0YXR1cykgPT4ge1xyXG4gICAgZ2FtZU92ZXIgPSBzdGF0dXM7XHJcbiAgICBpZiAoZ2FtZU92ZXIpIHtcclxuICAgICAgdHVybkRpc3BsYXkudGV4dENvbnRlbnQgPSBcIk95dW4gYml0dGkhXCI7XHJcbiAgICAgIGlmIChwbGF5ZXJTdW5rU2hpcHMubGVuZ3RoICE9PSA1KVxyXG4gICAgICAgIGluZm9EaXNwbGF5LmlubmVySFRNTCA9IFwiUmFraWJpbiBiw7x0w7xuIGdlbWlsZXJpbmkgeW9rIGV0dGkuIEtheWJldHRpbiFcIjtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgYm9hcmRCbG9ja3MuZm9yRWFjaCgoYmxvY2spID0+IHtcclxuICAgIGJsb2NrLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gICAgICBpZiAodHVybk51bSA9PT0gcGxheWVyTnVtKSB7XHJcbiAgICAgICAgaWYgKGdhbWVPdmVyKSByZXR1cm47XHJcbiAgICAgICAgaWYgKCFhbGxTaGlwc1BsYWNlZCkge1xyXG4gICAgICAgICAgaW5mb0Rpc3BsYXkuaW5uZXJIVE1MID0gXCJMw7x0ZmVuIMO2bmNlIGdlbWlsZXJpbmkgeWVybGXFn3RpciFcIjtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFlbmVteVJlYWR5KSB7XHJcbiAgICAgICAgICBpbmZvRGlzcGxheS5pbm5lckhUTUwgPSBcIkzDvHRmZW4gcmFraWJpbmkgYmVrbGUhXCI7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNob3RGaXJlZCA9IGhhbmRsZUNsaWNrKGUpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVuZW15UmVhZHkpO1xyXG5cclxuICAgICAgICB0dXJuTnVtID0gKHR1cm5OdW0gKyAxKSAlIDI7XHJcblxyXG4gICAgICAgIHNvY2tldC5lbWl0KFwidHVybi1jaGFuZ2VcIiwgdHVybk51bSk7XHJcbiAgICAgICAgc29ja2V0LmVtaXQoXCJmaXJlXCIsIHNob3RGaXJlZCwgdHVybk51bSk7XHJcbiAgICAgICAgc29ja2V0LmVtaXQoXCJnYW1lb3ZlclwiLCBnYW1lT3Zlcik7XHJcbiAgICAgIH0gZWxzZSB0dXJuRGlzcGxheS5pbm5lckhUTUwgPSBcIlJha2liaW4gc8SxcmFzxLFcIjtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBsZXQgcGxheWVyQm9hcmREYXRhO1xyXG4gIHNvY2tldC5vbihcImZpcmVcIiwgKGlkKSA9PiB7XHJcbiAgICBjb25zdCBibG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGF5ZXIgZGl2W2lkPScke2lkfSddYCk7XHJcbiAgICBjb25zdCBpc0hpdCA9IEFycmF5LmZyb20ocGxheWVyQm9hcmREYXRhKS5zb21lKChub2RlKSA9PiBub2RlLmlkID09PSBpZCk7XHJcbiAgICAvLyBkbyBzb21ldGhpbmcgZWxzZSBpZiBpdCdzIGFscmVhZHkgaGl0LlxyXG4gICAgaWYgKGlzSGl0KSBibG9jay5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xyXG4gICAgZWxzZSBibG9jay5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhgdGhlIGVuZW15IHNob3QgeW91ciAke2lkfSBibG9jayFgKTtcclxuICB9KTtcclxuXHJcbiAgc29ja2V0Lm9uKFwic3RhcnQtZ2FtZVwiLCAocGxheWVyMUJvYXJkRGF0YSwgcGxheWVyMkJvYXJkRGF0YSkgPT4ge1xyXG4gICAgY29uc3Qgb3Bwb25lbnRCb2FyZEJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjY29tcHV0ZXIgZGl2XCIpO1xyXG4gICAgcGxheWVyQm9hcmREYXRhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNwbGF5ZXIgZGl2LmZpbGxlZFwiKTtcclxuICAgIGNvbnNvbGUubG9nKHBsYXllckJvYXJkRGF0YSk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHBvbmVudEJvYXJkQmxvY2tzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIGNvbnN0IGRhdGFJbmRleCA9IGk7XHJcbiAgICAgIG9wcG9uZW50Qm9hcmRCbG9ja3NbaV0uY2xhc3NOYW1lID1cclxuICAgICAgICBwbGF5ZXJOdW0gPT09IDBcclxuICAgICAgICAgID8gcGxheWVyMkJvYXJkRGF0YVtkYXRhSW5kZXhdXHJcbiAgICAgICAgICA6IHBsYXllcjFCb2FyZERhdGFbZGF0YUluZGV4XTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgZnVuY3Rpb24gY29udHJvbFBsYXllckNvbm5lY3Rpb24obnVtKSB7XHJcbiAgICBjb25zdCBwbGF5ZXIgPSBgLnAke3BhcnNlSW50KG51bSkgKyAxfWA7XHJcbiAgICBkb2N1bWVudFxyXG4gICAgICAucXVlcnlTZWxlY3RvcihgJHtwbGF5ZXJ9IC5jb25uZWN0ZWQgc3BhbmApXHJcbiAgICAgIC5jbGFzc0xpc3QudG9nZ2xlKFwiZ3JlZW5cIik7XHJcbiAgICBpZiAocGFyc2VJbnQobnVtKSA9PT0gcGxheWVyTnVtKVxyXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHBsYXllcikuc3R5bGUuZm9udFdlaWdodCA9IFwiYm9sZFwiO1xyXG4gIH1cclxufVxyXG5cclxubXVsdGlwbGF5ZXJCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN0YXJ0TXVsdGlwbGF5ZXIpO1xyXG5cclxuLy8gc3RhcnQgbXVsdGlwbGF5ZXIgZ2FtZVxyXG5mdW5jdGlvbiBzdGFydEdhbWVNdWx0aShzb2NrZXQpIHtcclxuICBpZiAoZ2FtZU92ZXIpIHJldHVybjtcclxuICBjb25zb2xlLmxvZyhjdXJyZW50UGxheWVyKTtcclxuICBpZiAoIXJlYWR5KSB7XHJcbiAgICBzb2NrZXQuZW1pdChcInBsYXllci1yZWFkeVwiKTtcclxuICAgIHJlYWR5ID0gdHJ1ZTtcclxuICAgIHBsYXllclJlYWR5KHBsYXllck51bSk7XHJcbiAgfVxyXG5cclxuICBpZiAoZW5lbXlSZWFkeSkge1xyXG4gICAgaWYgKGN1cnJlbnRQbGF5ZXIgPT09IFwicGxheWVyXCIpIHtcclxuICAgICAgdHVybkRpc3BsYXkuaW5uZXJIVE1MID0gXCJTZW5pbiBzxLFyYW5cIjtcclxuICAgIH1cclxuICAgIGlmIChjdXJyZW50UGxheWVyID09PSBcImVuZW15XCIpIHtcclxuICAgICAgdHVybkRpc3BsYXkuaW5uZXJIVE1MID0gXCJSYWtpYmluIHPEsXJhc8SxXCI7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcGxheWVyQm9hcmREYXRhID0gQXJyYXkuZnJvbShcclxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNwbGF5ZXIgZGl2XCIpXHJcbiAgICApLm1hcCgoYmxvY2spID0+IGJsb2NrLmNsYXNzTmFtZSk7XHJcbiAgICBzb2NrZXQuZW1pdChcImJvYXJkLWRhdGFcIiwgcGxheWVyQm9hcmREYXRhKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBsYXllclJlYWR5KG51bSkge1xyXG4gIGNvbnN0IHBsYXllciA9IGAucCR7cGFyc2VJbnQobnVtKSArIDF9YDtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAke3BsYXllcn0gLnJlYWR5IHNwYW5gKS5jbGFzc0xpc3QudG9nZ2xlKFwiZ3JlZW5cIik7XHJcbn1cclxuXHJcbi8vIHN0YXJ0IHNpbmdsZSBwbGF5ZXIgZ2FtZVxyXG5mdW5jdGlvbiBzdGFydFNpbmdsZVBsYXllcigpIHtcclxuICBpZiAoZ2FtZU92ZXIpIHJldHVybjtcclxuICBpZiAoc2luZ2xlUGxheWVyU3RhcnRlZCkgcmV0dXJuO1xyXG4gIGlmIChtdWx0aVBsYXllclN0YXJ0ZWQpIHJldHVybjtcclxuICBzaW5nbGVQbGF5ZXJTdGFydGVkID0gdHJ1ZTtcclxuICBnYW1lTW9kZSA9IFwic2luZ2xlcGxheWVyXCI7XHJcbiAgdXNlciA9IFwiY29tcHV0ZXJcIjtcclxuICBzaGlwcy5mb3JFYWNoKChzaGlwKSA9PiBhZGRTaGlwKFwiY29tcHV0ZXJcIiwgc2hpcCkpO1xyXG4gIGluZm9EaXNwbGF5LmlubmVySFRNTCA9IFwiVGVrIG95dW5jdWx1IG95dW4gYmHFn2xhZMSxIVwiO1xyXG4gIHN0YXJ0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzdGFydEdhbWVTaW5nbGUpO1xyXG59XHJcbnNpbmdsZVBsYXllckJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RhcnRTaW5nbGVQbGF5ZXIpO1xyXG5cclxubGV0IGFuZ2xlID0gMDtcclxuZnVuY3Rpb24gZmxpcFNoaXBzKCkge1xyXG4gIGNvbnN0IHNoaXBzID0gQXJyYXkuZnJvbShzaGlwQ29udGFpbmVyLmNoaWxkcmVuKTtcclxuICBhbmdsZSA9IGFuZ2xlID09PSAwID8gOTAgOiAwO1xyXG4gIHNoaXBzLmZvckVhY2goKHNoaXApID0+IHtcclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxyXG4gICAgc2hpcC5zdHlsZS50cmFuc2Zvcm0gPSBgcm90YXRlKCR7YW5nbGV9ZGVnKWA7XHJcbiAgfSk7XHJcbn1cclxuZmxpcEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZmxpcFNoaXBzKTtcclxuXHJcbi8vIENSRUFUSU5HIEdBTUVCT0FSRFxyXG5mdW5jdGlvbiBjcmVhdGVCb2FyZChjb2xvciwgdXNlcikge1xyXG4gIGNvbnN0IGdhbWVCb2FyZENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZWJvYXJkLWNvbnRhaW5lclwiKTtcclxuXHJcbiAgY29uc3QgZ2FtZUJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICBnYW1lQm9hcmQuc2V0QXR0cmlidXRlKFwiaWRcIiwgdXNlcik7XHJcbiAgZ2FtZUJvYXJkLmNsYXNzTGlzdC5hZGQoXCJnYW1lYm9hcmRcIik7XHJcbiAgZ2FtZUJvYXJkLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xyXG5cclxuICBmb3IgKGxldCBpID0gMDsgaSA8IDEwMDsgaSArPSAxKSB7XHJcbiAgICBjb25zdCBibG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBibG9jay5jbGFzc0xpc3QuYWRkKFwiYmxvY2tcIik7XHJcbiAgICBibG9jay5pZCA9IGk7XHJcbiAgICBnYW1lQm9hcmQuYXBwZW5kKGJsb2NrKTtcclxuICB9XHJcblxyXG4gIGdhbWVCb2FyZENvbnRhaW5lci5hcHBlbmRDaGlsZChnYW1lQm9hcmQpO1xyXG59XHJcblxyXG5jcmVhdGVCb2FyZChcIndoaXRlXCIsIHVzZXIpO1xyXG5jcmVhdGVCb2FyZChcImdhaW5zYm9yb1wiLCBcImNvbXB1dGVyXCIpO1xyXG5cclxuLy8gY29uc29sZS5sb2coc2hpcHMpO1xyXG5cclxuZnVuY3Rpb24gY2hlY2tWYWxpZGl0eShib2FyZEJsb2NrcywgaXNIb3Jpem9udGFsLCBzdGFydEluZGV4LCBzaGlwKSB7XHJcbiAgLy8gdG8gcHJldmVudCBwbGFjaW5nIHNoaXBzIG9mZiBib2FyZFxyXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXN0ZWQtdGVybmFyeVxyXG4gIGNvbnN0IHZhbGlkU3RhcnQgPSBpc0hvcml6b250YWxcclxuICAgID8gc3RhcnRJbmRleCA8PSAxMCAqIDEwIC0gc2hpcC5sZW5ndGhcclxuICAgICAgPyBzdGFydEluZGV4XHJcbiAgICAgIDogMTAgKiAxMCAtIHNoaXAubGVuZ3RoXHJcbiAgICA6IHN0YXJ0SW5kZXggPD0gMTAgKiAxMCAtIDEwICogc2hpcC5sZW5ndGhcclxuICAgID8gc3RhcnRJbmRleFxyXG4gICAgOiBzdGFydEluZGV4IC0gc2hpcC5sZW5ndGggKiAxMCArIDEwO1xyXG4gIC8vICAgY29uc29sZS5sb2coYHZhbGlkYXRlZCBpICR7dmFsaWRTdGFydH1gKTtcclxuXHJcbiAgY29uc3Qgc2hpcEJsb2NrcyA9IFtdO1xyXG4gIC8vIHNhdmUgdGhlIGluZGV4ZXMgb2Ygc2hpcHMgdG8gYW4gYXJyYXlcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgIGlmIChpc0hvcml6b250YWwpIHNoaXBCbG9ja3MucHVzaChib2FyZEJsb2Nrc1tOdW1iZXIodmFsaWRTdGFydCkgKyBpXSk7XHJcbiAgICBlbHNlIHNoaXBCbG9ja3MucHVzaChib2FyZEJsb2Nrc1tOdW1iZXIodmFsaWRTdGFydCkgKyBpICogMTBdKTtcclxuICB9XHJcblxyXG4gIC8vIHZhbGlkYXRlIHBsYWNlIHRvIHByZXZlbnQgc2hpcHMgZnJvbSBzcGxpdHRpbmdcclxuICBsZXQgaXNWYWxpZDtcclxuICBpZiAoaXNIb3Jpem9udGFsKSB7XHJcbiAgICBzaGlwQmxvY2tzLmV2ZXJ5KFxyXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmV0dXJuLWFzc2lnblxyXG4gICAgICAoX2Jsb2NrLCBpbmRleCkgPT5cclxuICAgICAgICAoaXNWYWxpZCA9XHJcbiAgICAgICAgICBzaGlwQmxvY2tzWzBdLmlkICUgMTAgIT09IDEwIC0gKHNoaXBCbG9ja3MubGVuZ3RoIC0gKGluZGV4ICsgMSkpKVxyXG4gICAgKTtcclxuICB9IGVsc2Uge1xyXG4gICAgc2hpcEJsb2Nrcy5ldmVyeShcclxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJldHVybi1hc3NpZ25cclxuICAgICAgKF9ibG9jaywgaW5kZXgpID0+IChpc1ZhbGlkID0gc2hpcEJsb2Nrc1swXS5pZCA8IDkwICsgKDEwICogaW5kZXggKyAxKSlcclxuICAgICk7XHJcbiAgfVxyXG4gIC8vIGNvbnNvbGUubG9nKGBpcyB2YWxpZD8gJHtpc1ZhbGlkfWApO1xyXG4gIGNvbnN0IG5vdFRha2VuID0gc2hpcEJsb2Nrcy5ldmVyeShcclxuICAgIChibG9jaykgPT5cclxuICAgICAgIWJsb2NrLmNsYXNzTGlzdC5jb250YWlucyhcImZpbGxlZFwiKSAmJlxyXG4gICAgICAhYmxvY2suY2xhc3NMaXN0LmNvbnRhaW5zKFwidW5hdmFpbGFibGVcIilcclxuICApO1xyXG5cclxuICByZXR1cm4geyBzaGlwQmxvY2tzLCBpc1ZhbGlkLCBub3RUYWtlbiB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRTaGlwKHVzZXIsIHNoaXAsIHN0YXJ0SWQpIHtcclxuICAvLyAgIGNvbnNvbGUubG9nKHVzZXIpO1xyXG4gIGNvbnN0IGJvYXJkQmxvY2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgIyR7dXNlcn0gZGl2YCk7XHJcbiAgY29uc3QgYm9vbCA9IE1hdGgucmFuZG9tKCkgPCAwLjU7IC8vIHJldHVybmVkIG51bWJlciBlaXRoZXIgd2lsbCBiZSBiaWdnZXIgdGhhbiAwLjUgb3Igbm90IGhlbmNlIHRoZSByYW5kb20gYm9vbFxyXG4gIGNvbnN0IGlzSG9yaXpvbnRhbCA9IHVzZXIgPT09IFwicGxheWVyXCIgPyBhbmdsZSA9PT0gMCA6IGJvb2w7XHJcbiAgY29uc3QgcmFuZG9tU3RhcnRJbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwICogMTApOyAvLyB0ZW4gdGltZXMgdGVuIGlzIHRoZSB3aWR0aCBvZiB0aGUgYm9hcmRcclxuXHJcbiAgY29uc3Qgc3RhcnRJbmRleCA9IHN0YXJ0SWQgfHwgcmFuZG9tU3RhcnRJbmRleDtcclxuXHJcbiAgY29uc3QgeyBzaGlwQmxvY2tzLCBpc1ZhbGlkLCBub3RUYWtlbiB9ID0gY2hlY2tWYWxpZGl0eShcclxuICAgIGJvYXJkQmxvY2tzLFxyXG4gICAgaXNIb3Jpem9udGFsLFxyXG4gICAgc3RhcnRJbmRleCxcclxuICAgIHNoaXBcclxuICApO1xyXG5cclxuICBpZiAoIWlzVmFsaWQgfHwgIW5vdFRha2VuKVxyXG4gICAgaW5mb0Rpc3BsYXkuaW5uZXJIVE1MID0gXCJHZW1pbmkgYnVyYXlhIHllcmxlxZ90aXJlbWV6c2luIVwiO1xyXG5cclxuICBpbmZvRGlzcGxheS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gIGlmIChpc1ZhbGlkICYmIG5vdFRha2VuKSB7XHJcbiAgICBzaGlwQmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PiB7XHJcbiAgICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoc2hpcC5uYW1lKTtcclxuICAgICAgYmxvY2suY2xhc3NMaXN0LmFkZChcImZpbGxlZFwiKTtcclxuICAgIH0pO1xyXG4gICAgLy8gYWRkIGZpbGxlZCBjbGFzcyB0byBhZGphY2VudCBibG9ja3MgdG8gcHJldmVudCBwbGFjaW5nIHNoaXBzIHNpZGUgdG8gc2lkZVxyXG4gICAgY29uc3QgYWRqYWNlbnRJbmRleGVzID0gZ2V0QWRqYWNlbnRJbmRleGVzKFxyXG4gICAgICBib2FyZEJsb2NrcyxcclxuICAgICAgaXNIb3Jpem9udGFsLFxyXG4gICAgICBzaGlwQmxvY2tzXHJcbiAgICApO1xyXG4gICAgYWRqYWNlbnRJbmRleGVzLmZvckVhY2goKGFkamFjZW50SW5kZXgpID0+IHtcclxuICAgICAgY29uc3QgYWRqYWNlbnRCbG9jayA9IGJvYXJkQmxvY2tzW2FkamFjZW50SW5kZXhdO1xyXG4gICAgICBhZGphY2VudEJsb2NrLmNsYXNzTGlzdC5hZGQoXCJ1bmF2YWlsYWJsZVwiKTtcclxuICAgIH0pO1xyXG4gICAgLy8gY29uc29sZS5sb2coYWRqYWNlbnRJbmRleGVzKTtcclxuICB9IGVsc2Uge1xyXG4gICAgaWYgKHVzZXIgPT09IFwiY29tcHV0ZXJcIikgYWRkU2hpcCh1c2VyLCBzaGlwLCBzdGFydElkKTtcclxuICAgIGlmICh1c2VyID09PSBcInBsYXllclwiKSBub3REcm9wcGVkID0gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcbi8vIGhlbHBlciBmdW5jdGlvbiB0byBnZXQgYWRqYWNlbnQgaW5kZXhlc1xyXG5mdW5jdGlvbiBnZXRBZGphY2VudEluZGV4ZXMoYm9hcmRCbG9ja3MsIGlzSG9yaXpvbnRhbCwgc2hpcEJsb2Nrcykge1xyXG4gIGNvbnN0IGJvYXJkQmxvY2tzQXJyYXkgPSBbLi4uYm9hcmRCbG9ja3NdO1xyXG4gIGNvbnN0IGFkamFjZW50SW5kZXhlcyA9IFtdO1xyXG5cclxuICBzaGlwQmxvY2tzLmZvckVhY2goKGJsb2NrLCBpbmRleCkgPT4ge1xyXG4gICAgY29uc3QgYmxvY2tJbmRleCA9IGJvYXJkQmxvY2tzQXJyYXkuaW5kZXhPZihibG9jayk7XHJcbiAgICBjb25zdCByb3cgPSBNYXRoLmZsb29yKGJsb2NrSW5kZXggLyAxMCk7XHJcbiAgICBjb25zdCBjb2wgPSBibG9ja0luZGV4ICUgMTA7XHJcblxyXG4gICAgaWYgKGlzSG9yaXpvbnRhbCkge1xyXG4gICAgICBpZiAoY29sID4gMCkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCAtIDEpOyAvLyBsZWZ0IGJsb2NrXHJcbiAgICAgIGlmIChjb2wgPCA5KSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4ICsgMSk7IC8vIHJpZ2h0IGJsb2NrXHJcbiAgICAgIGlmIChyb3cgPiAwKSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4IC0gMTApOyAvLyB0b3AgYmxvY2tcclxuICAgICAgaWYgKHJvdyA8IDkpIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggKyAxMCk7IC8vIGJvdHRvbSBibG9ja1xyXG4gICAgICBpZiAoY29sID4gMCAmJiByb3cgPiAwKSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4IC0gMTEpOyAvLyB0b3AtbGVmdCBibG9ja1xyXG4gICAgICBpZiAoY29sID4gMCAmJiByb3cgPCA5KSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4ICsgOSk7IC8vIGJvdHRvbS1sZWZ0IGJsb2NrXHJcbiAgICAgIGlmIChjb2wgPCA5ICYmIHJvdyA+IDApIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggLSA5KTsgLy8gdG9wLXJpZ2h0IGJsb2NrXHJcbiAgICAgIGlmIChjb2wgPCA5ICYmIHJvdyA8IDkpIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggKyAxMSk7IC8vIGJvdHRvbS1yaWdodCBibG9ja1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHJvdyA+IDApIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggLSAxMCk7IC8vIHRvcCBibG9ja1xyXG4gICAgICBpZiAocm93IDwgOSkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCArIDEwKTsgLy8gYm90dG9tIGJsb2NrXHJcbiAgICAgIGlmIChjb2wgPiAwKSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4IC0gMSk7IC8vIGxlZnQgYmxvY2tcclxuICAgICAgaWYgKGNvbCA8IDkpIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggKyAxKTsgLy8gcmlnaHQgYmxvY2tcclxuICAgICAgaWYgKHJvdyA+IDAgJiYgY29sID4gMCkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCAtIDExKTsgLy8gdG9wLWxlZnQgYmxvY2tcclxuICAgICAgaWYgKHJvdyA+IDAgJiYgY29sIDwgOSkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCAtIDkpOyAvLyB0b3AtcmlnaHQgYmxvY2tcclxuICAgICAgaWYgKHJvdyA8IDkgJiYgY29sID4gMCkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCArIDkpOyAvLyBib3R0b20tbGVmdCBibG9ja1xyXG4gICAgICBpZiAocm93IDwgOSAmJiBjb2wgPCA5KSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4ICsgMTEpOyAvLyBib3R0b20tcmlnaHQgYmxvY2tcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgY29uc3QgdW5pcXVlQWRqYWNlbnRJbmRleGVzID0gQXJyYXkuZnJvbShuZXcgU2V0KGFkamFjZW50SW5kZXhlcykpO1xyXG5cclxuICByZXR1cm4gdW5pcXVlQWRqYWNlbnRJbmRleGVzO1xyXG59XHJcblxyXG4vLyBEUkFHJkRST1AgUExBWUVSIFNISVBTXHJcbmxldCBkcmFnZ2VkU2hpcDtcclxuY29uc3Qgc2hpcE9wdGlvbnMgPSBBcnJheS5mcm9tKHNoaXBDb250YWluZXIuY2hpbGRyZW4pO1xyXG5zaGlwT3B0aW9ucy5mb3JFYWNoKChzaGlwKSA9PiBzaGlwLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnc3RhcnRcIiwgZHJhZ1N0YXJ0KSk7XHJcblxyXG5jb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjcGxheWVyIGRpdlwiKTtcclxucGxheWVyQm9hcmQuZm9yRWFjaCgoYmxvY2spID0+IHtcclxuICBibG9jay5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgZHJhZ092ZXIpO1xyXG4gIGJsb2NrLmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIGRyb3BTaGlwKTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBkcmFnU3RhcnQoZSkge1xyXG4gIG5vdERyb3BwZWQgPSBmYWxzZTtcclxuICBkcmFnZ2VkU2hpcCA9IGUudGFyZ2V0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmFnT3ZlcihlKSB7XHJcbiAgLy8gY29uc29sZS5sb2coXCJkcmFnb3ZlclwiKTtcclxuICAvLyBjb25zb2xlLmxvZyhlLnRhcmdldC5wYXJlbnROb2RlKTtcclxuICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gIGlmICghZHJhZ2dlZFNoaXApIHJldHVybjtcclxuICBjb25zdCBzaGlwID0gc2hpcHNbZHJhZ2dlZFNoaXAuaWRdO1xyXG5cclxuICBoaWdobGlnaHRTaGlwQXJlYShlLnRhcmdldC5pZCwgc2hpcCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyb3BTaGlwKGUpIHtcclxuICBjb25zdCBzdGFydElkID0gZS50YXJnZXQuaWQ7XHJcbiAgaWYgKGRyYWdnZWRTaGlwID09PSB1bmRlZmluZWQgfHwgZHJhZ2dlZFNoaXAgPT09IG51bGwpIHJldHVybjtcclxuICBjb25zdCBzaGlwID0gc2hpcHNbZHJhZ2dlZFNoaXAuaWRdO1xyXG4gIC8vIGNvbnNvbGUubG9nKHNoaXAsIFwidGhpcyBpcyBzaGlwXCIpO1xyXG5cclxuICBhZGRTaGlwKFwicGxheWVyXCIsIHNoaXAsIHN0YXJ0SWQpO1xyXG4gIGlmICghbm90RHJvcHBlZCkgZHJhZ2dlZFNoaXAucmVtb3ZlKCk7XHJcbiAgaWYgKCFzaGlwQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIuc2hpcFwiKSkgYWxsU2hpcHNQbGFjZWQgPSB0cnVlO1xyXG4gIGRyYWdnZWRTaGlwID0gbnVsbDtcclxufVxyXG5cclxuZnVuY3Rpb24gaGlnaGxpZ2h0U2hpcEFyZWEoc3RhcnRJbmRleCwgc2hpcCkge1xyXG4gIGNvbnN0IGlzSG9yaXpvbnRhbCA9IGFuZ2xlID09PSAwO1xyXG5cclxuICBjb25zdCB7IHNoaXBCbG9ja3MsIGlzVmFsaWQsIG5vdFRha2VuIH0gPSBjaGVja1ZhbGlkaXR5KFxyXG4gICAgcGxheWVyQm9hcmQsXHJcbiAgICBpc0hvcml6b250YWwsXHJcbiAgICBzdGFydEluZGV4LFxyXG4gICAgc2hpcFxyXG4gICk7XHJcblxyXG4gIGlmIChpc1ZhbGlkICYmIG5vdFRha2VuKSB7XHJcbiAgICBzaGlwQmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PiB7XHJcbiAgICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoXCJob3ZlclwiKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiBibG9jay5jbGFzc0xpc3QucmVtb3ZlKFwiaG92ZXJcIiksIDUwMCk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbi8vIEdBTUUgTE9HSUNcclxuXHJcbmxldCBwbGF5ZXJUdXJuO1xyXG5cclxuLy8gc3RhcnQgdGhlIGdhbWVcclxuXHJcbmZ1bmN0aW9uIHN0YXJ0R2FtZVNpbmdsZSgpIHtcclxuICBpZiAocGxheWVyVHVybiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICBpZiAoc2hpcENvbnRhaW5lci5jaGlsZHJlbi5sZW5ndGggIT09IDApIHtcclxuICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBcIkzDvHRmZW4gw7ZuY2UgZ2VtaWxlcmluaSB5ZXJsZcWfdGlyIVwiO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgYm9hcmRCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI2NvbXB1dGVyIGRpdlwiKTtcclxuICAgICAgYm9hcmRCbG9ja3MuZm9yRWFjaCgoYmxvY2spID0+XHJcbiAgICAgICAgYmxvY2suYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUNsaWNrKVxyXG4gICAgICApO1xyXG4gICAgICBwbGF5ZXJUdXJuID0gdHJ1ZTtcclxuICAgICAgdHVybkRpc3BsYXkudGV4dENvbnRlbnQgPSBcIlNlbmluIHPEsXJhblwiO1xyXG4gICAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9IFwiT3l1biBiYcWfbGFkxLEhXCI7XHJcbiAgICAgIGdhbWVDb250cm9sQnV0dG9ucy5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlQ2xpY2soZSkge1xyXG4gIC8vIGN1cnJlbnQgdHVybiBpcyBub3QgZ2V0dGluZyB1cGRhdGVkIGFmdGVyIHBsYXllciAwIHRha2VzIGl0IHNob3RcclxuICBpZiAoZ2FtZU1vZGUgPT09IFwic2luZ2xlcGxheWVyXCIgJiYgIXBsYXllclR1cm4pIHJldHVybjtcclxuICBpZiAoIWdhbWVPdmVyICYmIGFsbFNoaXBzUGxhY2VkKSB7XHJcbiAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGl0XCIpKSByZXR1cm47IC8vIGRvIHRoaXMgYmV0dGVyXHJcbiAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZmlsbGVkXCIpKSB7XHJcbiAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XHJcbiAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJCaXIgZ2VtaXlpIHZ1cmR1biFcIjtcclxuICAgICAgY29uc3QgY2xhc3NlcyA9IEFycmF5LmZyb20oZS50YXJnZXQuY2xhc3NMaXN0KS5maWx0ZXIoXHJcbiAgICAgICAgKG5hbWUpID0+ICFbXCJibG9ja1wiLCBcImhpdFwiLCBcImZpbGxlZFwiLCBcInVuYXZhaWxhYmxlXCJdLmluY2x1ZGVzKG5hbWUpXHJcbiAgICAgICk7XHJcbiAgICAgIC8vIG1heSBuZWVkIHRvIHVzZSBjdXJyZW50UGxheWVyIGZvciBldmVudHNcclxuICAgICAgaWYgKFxyXG4gICAgICAgIGN1cnJlbnRQbGF5ZXIgPT09IFwicGxheWVyXCIgfHxcclxuICAgICAgICBjdXJyZW50UGxheWVyID09PSBcImVuZW15XCIgfHxcclxuICAgICAgICBnYW1lTW9kZSA9PT0gXCJzaW5nbGVwbGF5ZXJcIlxyXG4gICAgICApIHtcclxuICAgICAgICBwbGF5ZXJIaXRzLnB1c2goLi4uY2xhc3Nlcyk7XHJcbiAgICAgICAgY2hlY2tTY29yZShjdXJyZW50UGxheWVyLCBwbGF5ZXJIaXRzLCBwbGF5ZXJTdW5rU2hpcHMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImZpbGxlZFwiKSkge1xyXG4gICAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9IFwiSXNrYWxhZMSxbiFcIjtcclxuICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmFkZChcIm1pc3NcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY29uc3QgYm9hcmRCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI2NvbXB1dGVyIGRpdlwiKTtcclxuICAgIC8vIGJvYXJkQmxvY2tzLmZvckVhY2goXHJcbiAgICAvLyAgIChibG9jaykgPT4gYmxvY2sucmVwbGFjZVdpdGgoYmxvY2suY2xvbmVOb2RlKHRydWUpKSAvLyB0byByZW1vdmUgZXZlbnQgbGlzdGVuZXJzXHJcbiAgICAvLyApO1xyXG5cclxuICAgIC8vIGhhbmRsZUV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICAvLyBpZiBnYW1lbW9kZSBpcyBzaW5nbGUsIGRvIHRoZXNlP1xyXG4gICAgaWYgKGdhbWVNb2RlID09PSBcInNpbmdsZXBsYXllclwiICYmICFnYW1lT3Zlcikge1xyXG4gICAgICBwbGF5ZXJUdXJuID0gZmFsc2U7XHJcblxyXG4gICAgICBzZXRUaW1lb3V0KGNvbXB1dGVyc1R1cm4sIDc1MCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBlLnRhcmdldC5pZDsgLy8gdXNlIHRoaXMgdG8gY29tbXVuaWNhdGUgd2l0aCBzZXJ2ZXI/XHJcbn1cclxuXHJcbi8vIGNvbXB1dGVycyB0dXJuXHJcbmZ1bmN0aW9uIGNvbXB1dGVyc1R1cm4oKSB7XHJcbiAgaWYgKCFnYW1lT3Zlcikge1xyXG4gICAgdHVybkRpc3BsYXkudGV4dENvbnRlbnQgPSBcIkJpbGdpc2F5YXLEsW4gc8SxcmFzxLFcIjtcclxuICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJIZXNhcGxhbWFsYXIgeWFwxLFsxLF5b3IuLlwiO1xyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBjb25zdCByYW5kb21TaG90ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAgKiAxMCk7XHJcbiAgICAgIGlmIChcclxuICAgICAgICBwbGF5ZXJCb2FyZFtyYW5kb21TaG90XS5jbGFzc0xpc3QuY29udGFpbnMoXCJmaWxsZWRcIikgJiZcclxuICAgICAgICBwbGF5ZXJCb2FyZFtyYW5kb21TaG90XS5jbGFzc0xpc3QuY29udGFpbnMoXCJoaXRcIikgJiZcclxuICAgICAgICBwbGF5ZXJCb2FyZFtyYW5kb21TaG90XS5jbGFzc0xpc3QuY29udGFpbnMoXCJtaXNzXCIpXHJcbiAgICAgICkge1xyXG4gICAgICAgIGNvbXB1dGVyc1R1cm4oKTtcclxuICAgICAgfSBlbHNlIGlmIChcclxuICAgICAgICBwbGF5ZXJCb2FyZFtyYW5kb21TaG90XS5jbGFzc0xpc3QuY29udGFpbnMoXCJmaWxsZWRcIikgJiZcclxuICAgICAgICAhcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGl0XCIpXHJcbiAgICAgICkge1xyXG4gICAgICAgIHBsYXllckJvYXJkW3JhbmRvbVNob3RdLmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XHJcbiAgICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBcIkhlZGVmIHZ1cnVsZHUhXCI7XHJcbiAgICAgICAgY29uc3QgY2xhc3NlcyA9IEFycmF5LmZyb20ocGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0KS5maWx0ZXIoXHJcbiAgICAgICAgICAobmFtZSkgPT4gIVtcImJsb2NrXCIsIFwiaGl0XCIsIFwiZmlsbGVkXCJdLmluY2x1ZGVzKG5hbWUpXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjb21wdXRlckhpdHMucHVzaCguLi5jbGFzc2VzKTtcclxuICAgICAgICBjaGVja1Njb3JlKFwiY29tcHV0ZXJcIiwgY29tcHV0ZXJIaXRzLCBjb21wdXRlclN1bmtTaGlwcyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBcIklza2EhXCI7XHJcbiAgICAgICAgcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmFkZChcIm1pc3NcIik7XHJcbiAgICAgIH1cclxuICAgIH0sIDc1MCk7XHJcbiAgICBjb25zdCBib2FyZEJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjY29tcHV0ZXIgZGl2XCIpO1xyXG4gICAgYm9hcmRCbG9ja3MuZm9yRWFjaChcclxuICAgICAgKGJsb2NrKSA9PiBibG9jay5yZXBsYWNlV2l0aChibG9jay5jbG9uZU5vZGUodHJ1ZSkpIC8vIHRvIHJlbW92ZSBldmVudCBsaXN0ZW5lcnNcclxuICAgICk7XHJcbiAgICBoYW5kbGVFdmVudExpc3RlbmVycygpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHBsYXllclR1cm4gPSB0cnVlO1xyXG4gICAgICB0dXJuRGlzcGxheS50ZXh0Q29udGVudCA9IFwiU2VuaW4gc8SxcmFuXCI7XHJcbiAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJBdMSxxZ/EsW7EsSB5YXAhXCI7XHJcbiAgICB9LCA3NTApO1xyXG4gIH1cclxufVxyXG5mdW5jdGlvbiBoYW5kbGVFdmVudExpc3RlbmVycygpIHtcclxuICBjb25zdCBib2FyZEJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjY29tcHV0ZXIgZGl2XCIpO1xyXG4gIGJvYXJkQmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PiBibG9jay5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlQ2xpY2spKTsgLy8gcmUtYWRkaW5nIGV2ZW50IGxpc3RlbmVyc1xyXG59XHJcblxyXG5mdW5jdGlvbiBjaGVja1Njb3JlKHVzZXIsIHVzZXJIaXRzLCB1c2VyU3Vua1NoaXBzKSB7XHJcbiAgZnVuY3Rpb24gY2hlY2tTaGlwKHNoaXBOYW1lLCBzaGlwTGVuZ3RoKSB7XHJcbiAgICBpZiAoXHJcbiAgICAgIHVzZXJIaXRzLmZpbHRlcigoaGl0U2hpcCkgPT4gaGl0U2hpcCA9PT0gc2hpcE5hbWUpLmxlbmd0aCA9PT0gc2hpcExlbmd0aFxyXG4gICAgKSB7XHJcbiAgICAgIGlmIChcclxuICAgICAgICB1c2VyID09PSBcInBsYXllclwiIHx8XHJcbiAgICAgICAgdXNlciA9PT0gXCJlbmVteVwiIHx8XHJcbiAgICAgICAgZ2FtZU1vZGUgPT09IFwic2luZ2xlcGxheWVyXCJcclxuICAgICAgKSB7XHJcbiAgICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBgUmFraWJpbiAke3NoaXBOYW1lfSBnZW1pc2luaSBiYXTEsXJkxLFuIWA7XHJcblxyXG4gICAgICAgIHBsYXllckhpdHMgPSB1c2VySGl0cy5maWx0ZXIoKGhpdFNoaXApID0+IGhpdFNoaXAgIT09IHNoaXBOYW1lKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBpZiAodXNlciA9PT0gXCJlbmVteVwiKSB7XHJcbiAgICAgIC8vICAgZW5lbXlIaXRzID0gdXNlckhpdHMuZmlsdGVyKChoaXRTaGlwKSA9PiBoaXRTaGlwICE9PSBzaGlwTmFtZSk7XHJcbiAgICAgIC8vIH1cclxuICAgICAgaWYgKHVzZXIgPT09IFwiY29tcHV0ZXJcIikge1xyXG4gICAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gYFJha2lwICR7c2hpcE5hbWV9IGdlbWluaSBiYXTEsXJkxLEhYDtcclxuICAgICAgICBjb21wdXRlckhpdHMgPSB1c2VySGl0cy5maWx0ZXIoKGhpdFNoaXApID0+IGhpdFNoaXAgIT09IHNoaXBOYW1lKTtcclxuICAgICAgfVxyXG4gICAgICB1c2VyU3Vua1NoaXBzLnB1c2goc2hpcE5hbWUpO1xyXG4gICAgfVxyXG4gIH1cclxuICBjaGVja1NoaXAoXCJkZXN0cm95ZXJcIiwgMik7XHJcbiAgY2hlY2tTaGlwKFwic3VibWFyaW5lXCIsIDMpO1xyXG4gIGNoZWNrU2hpcChcImNydWlzZXJcIiwgMyk7XHJcbiAgY2hlY2tTaGlwKFwiYmF0dGxlc2hpcFwiLCA0KTtcclxuICBjaGVja1NoaXAoXCJjYXJyaWVyXCIsIDUpO1xyXG5cclxuICBjb25zb2xlLmxvZyhcInBsYXllclN1bmtTaGlwc1wiLCBwbGF5ZXJTdW5rU2hpcHMpO1xyXG5cclxuICBpZiAocGxheWVyU3Vua1NoaXBzLmxlbmd0aCA9PT0gNSkge1xyXG4gICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBcIlJha2liaW4gYsO8dMO8biBnZW1pbGVyaW5pIHlvayBldHRpbi4gS2F6YW5kxLFuIVwiOyAvLyBnYW1lIG92ZXIgcGxheWVyIDEgd29uXHJcbiAgICBnYW1lT3ZlciA9IHRydWU7XHJcbiAgICBpZiAoZ2FtZU1vZGUgPT09IFwic2luZ2xlcGxheWVyXCIpXHJcbiAgICAgIHN0YXJ0QnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzdGFydEdhbWVTaW5nbGUpO1xyXG4gIH1cclxuICBpZiAoY29tcHV0ZXJTdW5rU2hpcHMubGVuZ3RoID09PSA1KSB7XHJcbiAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9IFwiQsO8dMO8biBnZW1pbGVyaW4geW9rIGVkaWxkaS4gxLB5aSBzYXZhxZ90xLEgYW1pcmFsLlwiO1xyXG4gICAgZ2FtZU92ZXIgPSB0cnVlO1xyXG4gICAgc3RhcnRCdXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN0YXJ0R2FtZVNpbmdsZSk7XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==