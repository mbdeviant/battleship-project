/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
const singlePlayerButton = document.getElementById("single-player-button");
const multiplayerButton = document.getElementById("multiplayer-button");
const startButton = document.getElementById("start-button");
const infoDisplay = document.getElementById("info-display");
const shipSelectContainer = document.getElementById("ships");
const connectionInfo = document.getElementById("connection-info");
const gameControlButtons = document.getElementById("game-control-buttons");
const turnDisplay = document.getElementById("turn-display");
const gameInfo = document.getElementById("game-info");
const flipButton = document.getElementById("flip-button");
const shipContainer = document.querySelector(".ship-select-container");
const reloadButton = document.createElement("button");
reloadButton.innerHTML = "Tekrar oyna";

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

function startMultiplayer() {
  if (multiPlayerStarted) return;
  if (singlePlayerStarted) return;
  multiPlayerStarted = true;
  gameMode = "multiplayer";

  connectionInfo.classList.remove("hidden");
  infoDisplay.innerHTML =
    "Çok oyunculu mod başladı! Lütfen gemilerini yerleştir.";

  const socket = io();

  // get player number
  socket.on("player-number", (num) => {
    if (num === -1) {
      infoDisplay.innerHTML = "Sunucu dolu. Lütfen daha sonra tekrar dene.";
      socket.disconnect();
      setTimeout(() => location.reload(), 2500);
    } else {
      playerNum = parseInt(num);
      if (playerNum === 1) currentPlayer = "enemy";

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
      gameInfo.append(reloadButton);
      reloadButton.onclick = () => location.reload();
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
    const player = `.p${parseInt(num) + 1}`; // +1 because indexes starts from zero
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

  gameControlButtons.classList.add("hidden");
}

function playerReady(num) {
  const player = `.p${parseInt(num) + 1}`;
  document.querySelector(`${player} .ready span`).classList.toggle("green");
}

// start single player game mode
function startSinglePlayer() {
  if (gameOver) return;
  if (singlePlayerStarted) return;
  if (multiPlayerStarted) return;
  singlePlayerStarted = true;
  gameMode = "singleplayer";
  user = "computer";
  ships.forEach((ship) => addShip("computer", ship));
  infoDisplay.innerHTML =
    "Tek oyunculu oyun başladı! Lütfen gemilerini yerleştir.";
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

// creating gameboards
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
  const notTaken = shipBlocks.every(
    (block) =>
      !block.classList.contains("filled") &&
      !block.classList.contains("unavailable")
  );

  return { shipBlocks, isValid, notTaken };
}

function addShip(user, ship, startId) {
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

  if (isValid && notTaken) {
    infoDisplay.innerHTML = "";
    shipBlocks.forEach((block) => {
      block.classList.add(ship.name);
      block.classList.add("filled");
    });
    // add unavailable class to adjacent blocks to prevent placing ships side to side
    const adjacentIndexes = getAdjacentIndexes(
      boardBlocks,
      isHorizontal,
      shipBlocks
    );
    adjacentIndexes.forEach((adjacentIndex) => {
      const adjacentBlock = boardBlocks[adjacentIndex];
      adjacentBlock.classList.add("unavailable");
    });
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

// drag&drop ships
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
  e.preventDefault();
  if (!draggedShip) return;
  const ship = ships[draggedShip.id];

  highlightShipArea(e.target.id, ship);
}

function dropShip(e) {
  if (!multiPlayerStarted && !singlePlayerStarted) {
    infoDisplay.innerHTML = "Lütfen oyun modu seçiniz!";
    return;
  }
  const startId = e.target.id;
  if (draggedShip === undefined || draggedShip === null) return;
  const ship = ships[draggedShip.id];

  addShip("player", ship, startId);
  if (!notDropped) draggedShip.remove();
  if (!shipContainer.querySelector(".ship")) {
    allShipsPlaced = true;
    shipSelectContainer.style.display = "none";
  }
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

let playerTurn;
// starting singe player game
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
  if (gameMode === "singleplayer" && !playerTurn) return;
  if (!gameOver && allShipsPlaced) {
    if (e.target.classList.contains("hit")) return;
    if (e.target.classList.contains("filled")) {
      e.target.classList.add("hit");
      infoDisplay.textContent = "Bir gemiyi vurdun!";
      const classes = Array.from(e.target.classList).filter(
        (name) => !["block", "hit", "filled", "unavailable"].includes(name)
      );

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

    if (gameMode === "singleplayer" && !gameOver) {
      playerTurn = false;

      setTimeout(computersTurn, 750);
    }
  }
  return e.target.id;
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
    if (gameMode === "singleplayer") {
      startButton.removeEventListener("click", startGameSingle);
      gameInfo.append(reloadButton);
      reloadButton.onclick = () => location.reload();
    }
  }
  if (computerSunkShips.length === 5) {
    infoDisplay.textContent = "Bütün gemilerin yok edildi. İyi savaştı amiral.";
    gameOver = true;
    startButton.removeEventListener("click", startGameSingle);
  }
}

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLDZCQUE2QixLQUFLO0FBQ2xDO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUixLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLDREQUE0RCxHQUFHO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLElBQUk7QUFDM0MsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixnQ0FBZ0M7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSx3QkFBd0Isa0JBQWtCLEdBQUc7QUFDN0M7QUFDQSx3QkFBd0IsUUFBUTtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0Isa0JBQWtCO0FBQ3hDLDRCQUE0QixRQUFRO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsTUFBTTtBQUMzQyxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLFNBQVM7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsaUJBQWlCO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELE1BQU07QUFDMUQsb0NBQW9DO0FBQ3BDO0FBQ0EsZ0VBQWdFO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBLFVBQVUsZ0NBQWdDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RDtBQUN6RCx5REFBeUQ7QUFDekQsMERBQTBEO0FBQzFELDBEQUEwRDtBQUMxRCxxRUFBcUU7QUFDckUsb0VBQW9FO0FBQ3BFLG9FQUFvRTtBQUNwRSxxRUFBcUU7QUFDckUsTUFBTTtBQUNOLDBEQUEwRDtBQUMxRCwwREFBMEQ7QUFDMUQseURBQXlEO0FBQ3pELHlEQUF5RDtBQUN6RCxxRUFBcUU7QUFDckUsb0VBQW9FO0FBQ3BFLG9FQUFvRTtBQUNwRSxxRUFBcUU7QUFDckU7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsZ0NBQWdDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdGQUFnRjtBQUNoRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkMsVUFBVTtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyxVQUFVO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0VBQStFO0FBQy9FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1wcm9qZWN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHNpbmdsZVBsYXllckJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2luZ2xlLXBsYXllci1idXR0b25cIik7XHJcbmNvbnN0IG11bHRpcGxheWVyQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtdWx0aXBsYXllci1idXR0b25cIik7XHJcbmNvbnN0IHN0YXJ0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdGFydC1idXR0b25cIik7XHJcbmNvbnN0IGluZm9EaXNwbGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbmZvLWRpc3BsYXlcIik7XHJcbmNvbnN0IHNoaXBTZWxlY3RDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNoaXBzXCIpO1xyXG5jb25zdCBjb25uZWN0aW9uSW5mbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29ubmVjdGlvbi1pbmZvXCIpO1xyXG5jb25zdCBnYW1lQ29udHJvbEJ1dHRvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtY29udHJvbC1idXR0b25zXCIpO1xyXG5jb25zdCB0dXJuRGlzcGxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHVybi1kaXNwbGF5XCIpO1xyXG5jb25zdCBnYW1lSW5mbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1pbmZvXCIpO1xyXG5jb25zdCBmbGlwQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmbGlwLWJ1dHRvblwiKTtcclxuY29uc3Qgc2hpcENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2hpcC1zZWxlY3QtY29udGFpbmVyXCIpO1xyXG5jb25zdCByZWxvYWRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG5yZWxvYWRCdXR0b24uaW5uZXJIVE1MID0gXCJUZWtyYXIgb3luYVwiO1xyXG5cclxubGV0IHVzZXIgPSBcInBsYXllclwiO1xyXG5sZXQgY3VycmVudFBsYXllciA9IHVzZXI7XHJcbmxldCBnYW1lTW9kZSA9IFwiXCI7XHJcbmxldCBwbGF5ZXJOdW0gPSAwO1xyXG5sZXQgdHVybk51bSA9IDA7XHJcbmxldCByZWFkeSA9IGZhbHNlO1xyXG5sZXQgZ2FtZU92ZXIgPSBmYWxzZTtcclxubGV0IGVuZW15UmVhZHkgPSBmYWxzZTtcclxubGV0IGFsbFNoaXBzUGxhY2VkID0gZmFsc2U7XHJcbmxldCBzaG90RmlyZWQgPSAtMTtcclxubGV0IG5vdERyb3BwZWQ7XHJcbmxldCBzaW5nbGVQbGF5ZXJTdGFydGVkO1xyXG5sZXQgbXVsdGlQbGF5ZXJTdGFydGVkO1xyXG5sZXQgcGxheWVySGl0cyA9IFtdO1xyXG5sZXQgY29tcHV0ZXJIaXRzID0gW107XHJcblxyXG5jb25zdCBwbGF5ZXJTdW5rU2hpcHMgPSBbXTtcclxuY29uc3QgY29tcHV0ZXJTdW5rU2hpcHMgPSBbXTtcclxuXHJcbi8vIENSRUFUSU5HIFNISVBTXHJcbmNsYXNzIFNoaXAge1xyXG4gIGNvbnN0cnVjdG9yKG5hbWUsIGxlbmd0aCkge1xyXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgZGVzdHJveWVyID0gbmV3IFNoaXAoXCJkZXN0cm95ZXJcIiwgMik7XHJcbmNvbnN0IHN1Ym1hcmluZSA9IG5ldyBTaGlwKFwic3VibWFyaW5lXCIsIDMpO1xyXG5jb25zdCBjcnVpc2VyID0gbmV3IFNoaXAoXCJjcnVpc2VyXCIsIDMpO1xyXG5jb25zdCBiYXR0bGVzaGlwID0gbmV3IFNoaXAoXCJiYXR0bGVzaGlwXCIsIDQpO1xyXG5jb25zdCBjYXJyaWVyID0gbmV3IFNoaXAoXCJjYXJyaWVyXCIsIDUpO1xyXG5cclxuY29uc3Qgc2hpcHMgPSBbZGVzdHJveWVyLCBzdWJtYXJpbmUsIGNydWlzZXIsIGJhdHRsZXNoaXAsIGNhcnJpZXJdO1xyXG5cclxuZnVuY3Rpb24gc3RhcnRNdWx0aXBsYXllcigpIHtcclxuICBpZiAobXVsdGlQbGF5ZXJTdGFydGVkKSByZXR1cm47XHJcbiAgaWYgKHNpbmdsZVBsYXllclN0YXJ0ZWQpIHJldHVybjtcclxuICBtdWx0aVBsYXllclN0YXJ0ZWQgPSB0cnVlO1xyXG4gIGdhbWVNb2RlID0gXCJtdWx0aXBsYXllclwiO1xyXG5cclxuICBjb25uZWN0aW9uSW5mby5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xyXG4gIGluZm9EaXNwbGF5LmlubmVySFRNTCA9XHJcbiAgICBcIsOHb2sgb3l1bmN1bHUgbW9kIGJhxZ9sYWTEsSEgTMO8dGZlbiBnZW1pbGVyaW5pIHllcmxlxZ90aXIuXCI7XHJcblxyXG4gIGNvbnN0IHNvY2tldCA9IGlvKCk7XHJcblxyXG4gIC8vIGdldCBwbGF5ZXIgbnVtYmVyXHJcbiAgc29ja2V0Lm9uKFwicGxheWVyLW51bWJlclwiLCAobnVtKSA9PiB7XHJcbiAgICBpZiAobnVtID09PSAtMSkge1xyXG4gICAgICBpbmZvRGlzcGxheS5pbm5lckhUTUwgPSBcIlN1bnVjdSBkb2x1LiBMw7x0ZmVuIGRhaGEgc29ucmEgdGVrcmFyIGRlbmUuXCI7XHJcbiAgICAgIHNvY2tldC5kaXNjb25uZWN0KCk7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gbG9jYXRpb24ucmVsb2FkKCksIDI1MDApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcGxheWVyTnVtID0gcGFyc2VJbnQobnVtKTtcclxuICAgICAgaWYgKHBsYXllck51bSA9PT0gMSkgY3VycmVudFBsYXllciA9IFwiZW5lbXlcIjtcclxuXHJcbiAgICAgIHNvY2tldC5lbWl0KFwiY2hlY2stcGxheWVyc1wiKTtcclxuICAgIH1cclxuICB9KTtcclxuICAvLyBwbGF5ZXIgY29ubmVjdGlvbiBjb250cm9sXHJcbiAgc29ja2V0Lm9uKFwicGxheWVyLWNvbm5lY3Rpb25cIiwgKG51bSkgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coYHBsYXllciAke251bX0gaGFzIGNvbm5lY3RlZGApO1xyXG4gICAgY29udHJvbFBsYXllckNvbm5lY3Rpb24obnVtKTtcclxuICB9KTtcclxuXHJcbiAgLy8gZW5lbXkgcmVhZHlcclxuICBzb2NrZXQub24oXCJlbmVteS1yZWFkeVwiLCAobnVtKSA9PiB7XHJcbiAgICBlbmVteVJlYWR5ID0gdHJ1ZTtcclxuICAgIHBsYXllclJlYWR5KG51bSk7XHJcbiAgICBpZiAocmVhZHkpIHN0YXJ0R2FtZU11bHRpKHNvY2tldCk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIGNoZWNrIHBsYXllciBzdGF0dXNcclxuICBzb2NrZXQub24oXCJjaGVjay1wbGF5ZXJzXCIsIChwbGF5ZXJzKSA9PiB7XHJcbiAgICBwbGF5ZXJzLmZvckVhY2goKHBsYXllciwgaW5kZXgpID0+IHtcclxuICAgICAgaWYgKHBsYXllci5jb25uZWN0ZWQpIGNvbnRyb2xQbGF5ZXJDb25uZWN0aW9uKGluZGV4KTtcclxuICAgICAgaWYgKHBsYXllci5yZWFkeSkge1xyXG4gICAgICAgIHBsYXllclJlYWR5KGluZGV4KTtcclxuICAgICAgICBpZiAoaW5kZXggIT09IHBsYXllck51bSkgZW5lbXlSZWFkeSA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBzdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgaWYgKCFhbGxTaGlwc1BsYWNlZCkgcmV0dXJuO1xyXG4gICAgaWYgKGFsbFNoaXBzUGxhY2VkKSBzdGFydEdhbWVNdWx0aShzb2NrZXQpO1xyXG4gICAgZWxzZSBpbmZvRGlzcGxheS5pbm5lckhUTUwgPSBcIkzDvHRmZW4gw7ZuY2UgZ2VtaWxlcmluaSB5ZXJsZcWfdGlyIVwiO1xyXG4gIH0pO1xyXG5cclxuICAvLyBldmVudCBsaXN0ZW5lciBmb3IgZmlyaW5nXHJcbiAgY29uc3QgYm9hcmRCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI2NvbXB1dGVyIGRpdlwiKTtcclxuICBzb2NrZXQub24oXCJ0dXJuLWNoYW5nZVwiLCAodHVybikgPT4ge1xyXG4gICAgdHVybk51bSA9IHR1cm47XHJcbiAgICBpZiAodHVybk51bSA9PT0gcGxheWVyTnVtKSB0dXJuRGlzcGxheS5pbm5lckhUTUwgPSBcIlNlbmluIHPEsXJhblwiO1xyXG4gICAgZWxzZSB0dXJuRGlzcGxheS5pbm5lckhUTUwgPSBcIlJha2liaW4gc8SxcmFzxLFcIjtcclxuICB9KTtcclxuICBzb2NrZXQub24oXCJnYW1lb3ZlclwiLCAoc3RhdHVzKSA9PiB7XHJcbiAgICBnYW1lT3ZlciA9IHN0YXR1cztcclxuICAgIGlmIChnYW1lT3Zlcikge1xyXG4gICAgICB0dXJuRGlzcGxheS50ZXh0Q29udGVudCA9IFwiT3l1biBiaXR0aSFcIjtcclxuICAgICAgZ2FtZUluZm8uYXBwZW5kKHJlbG9hZEJ1dHRvbik7XHJcbiAgICAgIHJlbG9hZEJ1dHRvbi5vbmNsaWNrID0gKCkgPT4gbG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICAgIGlmIChwbGF5ZXJTdW5rU2hpcHMubGVuZ3RoICE9PSA1KVxyXG4gICAgICAgIGluZm9EaXNwbGF5LmlubmVySFRNTCA9IFwiUmFraWJpbiBiw7x0w7xuIGdlbWlsZXJpbmkgeW9rIGV0dGkuIEtheWJldHRpbiFcIjtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgYm9hcmRCbG9ja3MuZm9yRWFjaCgoYmxvY2spID0+IHtcclxuICAgIGJsb2NrLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gICAgICBpZiAodHVybk51bSA9PT0gcGxheWVyTnVtKSB7XHJcbiAgICAgICAgaWYgKGdhbWVPdmVyKSByZXR1cm47XHJcbiAgICAgICAgaWYgKCFhbGxTaGlwc1BsYWNlZCkge1xyXG4gICAgICAgICAgaW5mb0Rpc3BsYXkuaW5uZXJIVE1MID0gXCJMw7x0ZmVuIMO2bmNlIGdlbWlsZXJpbmkgeWVybGXFn3RpciFcIjtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFlbmVteVJlYWR5KSB7XHJcbiAgICAgICAgICBpbmZvRGlzcGxheS5pbm5lckhUTUwgPSBcIkzDvHRmZW4gcmFraWJpbmkgYmVrbGUhXCI7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNob3RGaXJlZCA9IGhhbmRsZUNsaWNrKGUpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVuZW15UmVhZHkpO1xyXG5cclxuICAgICAgICB0dXJuTnVtID0gKHR1cm5OdW0gKyAxKSAlIDI7XHJcblxyXG4gICAgICAgIHNvY2tldC5lbWl0KFwidHVybi1jaGFuZ2VcIiwgdHVybk51bSk7XHJcbiAgICAgICAgc29ja2V0LmVtaXQoXCJmaXJlXCIsIHNob3RGaXJlZCwgdHVybk51bSk7XHJcbiAgICAgICAgc29ja2V0LmVtaXQoXCJnYW1lb3ZlclwiLCBnYW1lT3Zlcik7XHJcbiAgICAgIH0gZWxzZSB0dXJuRGlzcGxheS5pbm5lckhUTUwgPSBcIlJha2liaW4gc8SxcmFzxLFcIjtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBsZXQgcGxheWVyQm9hcmREYXRhO1xyXG4gIHNvY2tldC5vbihcImZpcmVcIiwgKGlkKSA9PiB7XHJcbiAgICBjb25zdCBibG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGF5ZXIgZGl2W2lkPScke2lkfSddYCk7XHJcbiAgICBjb25zdCBpc0hpdCA9IEFycmF5LmZyb20ocGxheWVyQm9hcmREYXRhKS5zb21lKChub2RlKSA9PiBub2RlLmlkID09PSBpZCk7XHJcbiAgICBpZiAoaXNIaXQpIGJsb2NrLmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XHJcbiAgICBlbHNlIGJsb2NrLmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKGB0aGUgZW5lbXkgc2hvdCB5b3VyICR7aWR9IGJsb2NrIWApO1xyXG4gIH0pO1xyXG5cclxuICBzb2NrZXQub24oXCJzdGFydC1nYW1lXCIsIChwbGF5ZXIxQm9hcmREYXRhLCBwbGF5ZXIyQm9hcmREYXRhKSA9PiB7XHJcbiAgICBjb25zdCBvcHBvbmVudEJvYXJkQmxvY2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNjb21wdXRlciBkaXZcIik7XHJcbiAgICBwbGF5ZXJCb2FyZERhdGEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI3BsYXllciBkaXYuZmlsbGVkXCIpO1xyXG4gICAgY29uc29sZS5sb2cocGxheWVyQm9hcmREYXRhKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wcG9uZW50Qm9hcmRCbG9ja3MubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgY29uc3QgZGF0YUluZGV4ID0gaTtcclxuICAgICAgb3Bwb25lbnRCb2FyZEJsb2Nrc1tpXS5jbGFzc05hbWUgPVxyXG4gICAgICAgIHBsYXllck51bSA9PT0gMFxyXG4gICAgICAgICAgPyBwbGF5ZXIyQm9hcmREYXRhW2RhdGFJbmRleF1cclxuICAgICAgICAgIDogcGxheWVyMUJvYXJkRGF0YVtkYXRhSW5kZXhdO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBmdW5jdGlvbiBjb250cm9sUGxheWVyQ29ubmVjdGlvbihudW0pIHtcclxuICAgIGNvbnN0IHBsYXllciA9IGAucCR7cGFyc2VJbnQobnVtKSArIDF9YDsgLy8gKzEgYmVjYXVzZSBpbmRleGVzIHN0YXJ0cyBmcm9tIHplcm9cclxuICAgIGRvY3VtZW50XHJcbiAgICAgIC5xdWVyeVNlbGVjdG9yKGAke3BsYXllcn0gLmNvbm5lY3RlZCBzcGFuYClcclxuICAgICAgLmNsYXNzTGlzdC50b2dnbGUoXCJncmVlblwiKTtcclxuICAgIGlmIChwYXJzZUludChudW0pID09PSBwbGF5ZXJOdW0pXHJcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocGxheWVyKS5zdHlsZS5mb250V2VpZ2h0ID0gXCJib2xkXCI7XHJcbiAgfVxyXG59XHJcblxyXG5tdWx0aXBsYXllckJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RhcnRNdWx0aXBsYXllcik7XHJcblxyXG4vLyBzdGFydCBtdWx0aXBsYXllciBnYW1lXHJcbmZ1bmN0aW9uIHN0YXJ0R2FtZU11bHRpKHNvY2tldCkge1xyXG4gIGlmIChnYW1lT3ZlcikgcmV0dXJuO1xyXG4gIGNvbnNvbGUubG9nKGN1cnJlbnRQbGF5ZXIpO1xyXG4gIGlmICghcmVhZHkpIHtcclxuICAgIHNvY2tldC5lbWl0KFwicGxheWVyLXJlYWR5XCIpO1xyXG4gICAgcmVhZHkgPSB0cnVlO1xyXG4gICAgcGxheWVyUmVhZHkocGxheWVyTnVtKTtcclxuICB9XHJcblxyXG4gIGlmIChlbmVteVJlYWR5KSB7XHJcbiAgICBpZiAoY3VycmVudFBsYXllciA9PT0gXCJwbGF5ZXJcIikge1xyXG4gICAgICB0dXJuRGlzcGxheS5pbm5lckhUTUwgPSBcIlNlbmluIHPEsXJhblwiO1xyXG4gICAgfVxyXG4gICAgaWYgKGN1cnJlbnRQbGF5ZXIgPT09IFwiZW5lbXlcIikge1xyXG4gICAgICB0dXJuRGlzcGxheS5pbm5lckhUTUwgPSBcIlJha2liaW4gc8SxcmFzxLFcIjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBwbGF5ZXJCb2FyZERhdGEgPSBBcnJheS5mcm9tKFxyXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI3BsYXllciBkaXZcIilcclxuICAgICkubWFwKChibG9jaykgPT4gYmxvY2suY2xhc3NOYW1lKTtcclxuICAgIHNvY2tldC5lbWl0KFwiYm9hcmQtZGF0YVwiLCBwbGF5ZXJCb2FyZERhdGEpO1xyXG4gIH1cclxuXHJcbiAgZ2FtZUNvbnRyb2xCdXR0b25zLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBsYXllclJlYWR5KG51bSkge1xyXG4gIGNvbnN0IHBsYXllciA9IGAucCR7cGFyc2VJbnQobnVtKSArIDF9YDtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAke3BsYXllcn0gLnJlYWR5IHNwYW5gKS5jbGFzc0xpc3QudG9nZ2xlKFwiZ3JlZW5cIik7XHJcbn1cclxuXHJcbi8vIHN0YXJ0IHNpbmdsZSBwbGF5ZXIgZ2FtZSBtb2RlXHJcbmZ1bmN0aW9uIHN0YXJ0U2luZ2xlUGxheWVyKCkge1xyXG4gIGlmIChnYW1lT3ZlcikgcmV0dXJuO1xyXG4gIGlmIChzaW5nbGVQbGF5ZXJTdGFydGVkKSByZXR1cm47XHJcbiAgaWYgKG11bHRpUGxheWVyU3RhcnRlZCkgcmV0dXJuO1xyXG4gIHNpbmdsZVBsYXllclN0YXJ0ZWQgPSB0cnVlO1xyXG4gIGdhbWVNb2RlID0gXCJzaW5nbGVwbGF5ZXJcIjtcclxuICB1c2VyID0gXCJjb21wdXRlclwiO1xyXG4gIHNoaXBzLmZvckVhY2goKHNoaXApID0+IGFkZFNoaXAoXCJjb21wdXRlclwiLCBzaGlwKSk7XHJcbiAgaW5mb0Rpc3BsYXkuaW5uZXJIVE1MID1cclxuICAgIFwiVGVrIG95dW5jdWx1IG95dW4gYmHFn2xhZMSxISBMw7x0ZmVuIGdlbWlsZXJpbmkgeWVybGXFn3Rpci5cIjtcclxuICBzdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RhcnRHYW1lU2luZ2xlKTtcclxufVxyXG5zaW5nbGVQbGF5ZXJCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN0YXJ0U2luZ2xlUGxheWVyKTtcclxuXHJcbmxldCBhbmdsZSA9IDA7XHJcbmZ1bmN0aW9uIGZsaXBTaGlwcygpIHtcclxuICBjb25zdCBzaGlwcyA9IEFycmF5LmZyb20oc2hpcENvbnRhaW5lci5jaGlsZHJlbik7XHJcbiAgYW5nbGUgPSBhbmdsZSA9PT0gMCA/IDkwIDogMDtcclxuICBzaGlwcy5mb3JFYWNoKChzaGlwKSA9PiB7XHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cclxuICAgIHNoaXAuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZSgke2FuZ2xlfWRlZylgO1xyXG4gIH0pO1xyXG59XHJcbmZsaXBCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZsaXBTaGlwcyk7XHJcblxyXG4vLyBjcmVhdGluZyBnYW1lYm9hcmRzXHJcbmZ1bmN0aW9uIGNyZWF0ZUJvYXJkKGNvbG9yLCB1c2VyKSB7XHJcbiAgY29uc3QgZ2FtZUJvYXJkQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lYm9hcmQtY29udGFpbmVyXCIpO1xyXG5cclxuICBjb25zdCBnYW1lQm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gIGdhbWVCb2FyZC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB1c2VyKTtcclxuICBnYW1lQm9hcmQuY2xhc3NMaXN0LmFkZChcImdhbWVib2FyZFwiKTtcclxuICBnYW1lQm9hcmQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3I7XHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwOyBpICs9IDEpIHtcclxuICAgIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoXCJibG9ja1wiKTtcclxuICAgIGJsb2NrLmlkID0gaTtcclxuICAgIGdhbWVCb2FyZC5hcHBlbmQoYmxvY2spO1xyXG4gIH1cclxuXHJcbiAgZ2FtZUJvYXJkQ29udGFpbmVyLmFwcGVuZENoaWxkKGdhbWVCb2FyZCk7XHJcbn1cclxuXHJcbmNyZWF0ZUJvYXJkKFwid2hpdGVcIiwgdXNlcik7XHJcbmNyZWF0ZUJvYXJkKFwiZ2FpbnNib3JvXCIsIFwiY29tcHV0ZXJcIik7XHJcblxyXG5mdW5jdGlvbiBjaGVja1ZhbGlkaXR5KGJvYXJkQmxvY2tzLCBpc0hvcml6b250YWwsIHN0YXJ0SW5kZXgsIHNoaXApIHtcclxuICAvLyB0byBwcmV2ZW50IHBsYWNpbmcgc2hpcHMgb2ZmIGJvYXJkXHJcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5lc3RlZC10ZXJuYXJ5XHJcbiAgY29uc3QgdmFsaWRTdGFydCA9IGlzSG9yaXpvbnRhbFxyXG4gICAgPyBzdGFydEluZGV4IDw9IDEwICogMTAgLSBzaGlwLmxlbmd0aFxyXG4gICAgICA/IHN0YXJ0SW5kZXhcclxuICAgICAgOiAxMCAqIDEwIC0gc2hpcC5sZW5ndGhcclxuICAgIDogc3RhcnRJbmRleCA8PSAxMCAqIDEwIC0gMTAgKiBzaGlwLmxlbmd0aFxyXG4gICAgPyBzdGFydEluZGV4XHJcbiAgICA6IHN0YXJ0SW5kZXggLSBzaGlwLmxlbmd0aCAqIDEwICsgMTA7XHJcblxyXG4gIGNvbnN0IHNoaXBCbG9ja3MgPSBbXTtcclxuICAvLyBzYXZlIHRoZSBpbmRleGVzIG9mIHNoaXBzIHRvIGFuIGFycmF5XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICBpZiAoaXNIb3Jpem9udGFsKSBzaGlwQmxvY2tzLnB1c2goYm9hcmRCbG9ja3NbTnVtYmVyKHZhbGlkU3RhcnQpICsgaV0pO1xyXG4gICAgZWxzZSBzaGlwQmxvY2tzLnB1c2goYm9hcmRCbG9ja3NbTnVtYmVyKHZhbGlkU3RhcnQpICsgaSAqIDEwXSk7XHJcbiAgfVxyXG5cclxuICAvLyB2YWxpZGF0ZSBwbGFjZSB0byBwcmV2ZW50IHNoaXBzIGZyb20gc3BsaXR0aW5nXHJcbiAgbGV0IGlzVmFsaWQ7XHJcbiAgaWYgKGlzSG9yaXpvbnRhbCkge1xyXG4gICAgc2hpcEJsb2Nrcy5ldmVyeShcclxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJldHVybi1hc3NpZ25cclxuICAgICAgKF9ibG9jaywgaW5kZXgpID0+XHJcbiAgICAgICAgKGlzVmFsaWQgPVxyXG4gICAgICAgICAgc2hpcEJsb2Nrc1swXS5pZCAlIDEwICE9PSAxMCAtIChzaGlwQmxvY2tzLmxlbmd0aCAtIChpbmRleCArIDEpKSlcclxuICAgICk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHNoaXBCbG9ja3MuZXZlcnkoXHJcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXR1cm4tYXNzaWduXHJcbiAgICAgIChfYmxvY2ssIGluZGV4KSA9PiAoaXNWYWxpZCA9IHNoaXBCbG9ja3NbMF0uaWQgPCA5MCArICgxMCAqIGluZGV4ICsgMSkpXHJcbiAgICApO1xyXG4gIH1cclxuICBjb25zdCBub3RUYWtlbiA9IHNoaXBCbG9ja3MuZXZlcnkoXHJcbiAgICAoYmxvY2spID0+XHJcbiAgICAgICFibG9jay5jbGFzc0xpc3QuY29udGFpbnMoXCJmaWxsZWRcIikgJiZcclxuICAgICAgIWJsb2NrLmNsYXNzTGlzdC5jb250YWlucyhcInVuYXZhaWxhYmxlXCIpXHJcbiAgKTtcclxuXHJcbiAgcmV0dXJuIHsgc2hpcEJsb2NrcywgaXNWYWxpZCwgbm90VGFrZW4gfTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkU2hpcCh1c2VyLCBzaGlwLCBzdGFydElkKSB7XHJcbiAgY29uc3QgYm9hcmRCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAjJHt1c2VyfSBkaXZgKTtcclxuICBjb25zdCBib29sID0gTWF0aC5yYW5kb20oKSA8IDAuNTsgLy8gcmV0dXJuZWQgbnVtYmVyIGVpdGhlciB3aWxsIGJlIGJpZ2dlciB0aGFuIDAuNSBvciBub3QgaGVuY2UgdGhlIHJhbmRvbSBib29sXHJcbiAgY29uc3QgaXNIb3Jpem9udGFsID0gdXNlciA9PT0gXCJwbGF5ZXJcIiA/IGFuZ2xlID09PSAwIDogYm9vbDtcclxuICBjb25zdCByYW5kb21TdGFydEluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAgKiAxMCk7IC8vIHRlbiB0aW1lcyB0ZW4gaXMgdGhlIHdpZHRoIG9mIHRoZSBib2FyZFxyXG5cclxuICBjb25zdCBzdGFydEluZGV4ID0gc3RhcnRJZCB8fCByYW5kb21TdGFydEluZGV4O1xyXG5cclxuICBjb25zdCB7IHNoaXBCbG9ja3MsIGlzVmFsaWQsIG5vdFRha2VuIH0gPSBjaGVja1ZhbGlkaXR5KFxyXG4gICAgYm9hcmRCbG9ja3MsXHJcbiAgICBpc0hvcml6b250YWwsXHJcbiAgICBzdGFydEluZGV4LFxyXG4gICAgc2hpcFxyXG4gICk7XHJcblxyXG4gIGlmICghaXNWYWxpZCB8fCAhbm90VGFrZW4pXHJcbiAgICBpbmZvRGlzcGxheS5pbm5lckhUTUwgPSBcIkdlbWluaSBidXJheWEgeWVybGXFn3RpcmVtZXpzaW4hXCI7XHJcblxyXG4gIGlmIChpc1ZhbGlkICYmIG5vdFRha2VuKSB7XHJcbiAgICBpbmZvRGlzcGxheS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgc2hpcEJsb2Nrcy5mb3JFYWNoKChibG9jaykgPT4ge1xyXG4gICAgICBibG9jay5jbGFzc0xpc3QuYWRkKHNoaXAubmFtZSk7XHJcbiAgICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoXCJmaWxsZWRcIik7XHJcbiAgICB9KTtcclxuICAgIC8vIGFkZCB1bmF2YWlsYWJsZSBjbGFzcyB0byBhZGphY2VudCBibG9ja3MgdG8gcHJldmVudCBwbGFjaW5nIHNoaXBzIHNpZGUgdG8gc2lkZVxyXG4gICAgY29uc3QgYWRqYWNlbnRJbmRleGVzID0gZ2V0QWRqYWNlbnRJbmRleGVzKFxyXG4gICAgICBib2FyZEJsb2NrcyxcclxuICAgICAgaXNIb3Jpem9udGFsLFxyXG4gICAgICBzaGlwQmxvY2tzXHJcbiAgICApO1xyXG4gICAgYWRqYWNlbnRJbmRleGVzLmZvckVhY2goKGFkamFjZW50SW5kZXgpID0+IHtcclxuICAgICAgY29uc3QgYWRqYWNlbnRCbG9jayA9IGJvYXJkQmxvY2tzW2FkamFjZW50SW5kZXhdO1xyXG4gICAgICBhZGphY2VudEJsb2NrLmNsYXNzTGlzdC5hZGQoXCJ1bmF2YWlsYWJsZVwiKTtcclxuICAgIH0pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBpZiAodXNlciA9PT0gXCJjb21wdXRlclwiKSBhZGRTaGlwKHVzZXIsIHNoaXAsIHN0YXJ0SWQpO1xyXG4gICAgaWYgKHVzZXIgPT09IFwicGxheWVyXCIpIG5vdERyb3BwZWQgPSB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxuLy8gaGVscGVyIGZ1bmN0aW9uIHRvIGdldCBhZGphY2VudCBpbmRleGVzXHJcbmZ1bmN0aW9uIGdldEFkamFjZW50SW5kZXhlcyhib2FyZEJsb2NrcywgaXNIb3Jpem9udGFsLCBzaGlwQmxvY2tzKSB7XHJcbiAgY29uc3QgYm9hcmRCbG9ja3NBcnJheSA9IFsuLi5ib2FyZEJsb2Nrc107XHJcbiAgY29uc3QgYWRqYWNlbnRJbmRleGVzID0gW107XHJcblxyXG4gIHNoaXBCbG9ja3MuZm9yRWFjaCgoYmxvY2ssIGluZGV4KSA9PiB7XHJcbiAgICBjb25zdCBibG9ja0luZGV4ID0gYm9hcmRCbG9ja3NBcnJheS5pbmRleE9mKGJsb2NrKTtcclxuICAgIGNvbnN0IHJvdyA9IE1hdGguZmxvb3IoYmxvY2tJbmRleCAvIDEwKTtcclxuICAgIGNvbnN0IGNvbCA9IGJsb2NrSW5kZXggJSAxMDtcclxuXHJcbiAgICBpZiAoaXNIb3Jpem9udGFsKSB7XHJcbiAgICAgIGlmIChjb2wgPiAwKSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4IC0gMSk7IC8vIGxlZnQgYmxvY2tcclxuICAgICAgaWYgKGNvbCA8IDkpIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggKyAxKTsgLy8gcmlnaHQgYmxvY2tcclxuICAgICAgaWYgKHJvdyA+IDApIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggLSAxMCk7IC8vIHRvcCBibG9ja1xyXG4gICAgICBpZiAocm93IDwgOSkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCArIDEwKTsgLy8gYm90dG9tIGJsb2NrXHJcbiAgICAgIGlmIChjb2wgPiAwICYmIHJvdyA+IDApIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggLSAxMSk7IC8vIHRvcC1sZWZ0IGJsb2NrXHJcbiAgICAgIGlmIChjb2wgPiAwICYmIHJvdyA8IDkpIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggKyA5KTsgLy8gYm90dG9tLWxlZnQgYmxvY2tcclxuICAgICAgaWYgKGNvbCA8IDkgJiYgcm93ID4gMCkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCAtIDkpOyAvLyB0b3AtcmlnaHQgYmxvY2tcclxuICAgICAgaWYgKGNvbCA8IDkgJiYgcm93IDwgOSkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCArIDExKTsgLy8gYm90dG9tLXJpZ2h0IGJsb2NrXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAocm93ID4gMCkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCAtIDEwKTsgLy8gdG9wIGJsb2NrXHJcbiAgICAgIGlmIChyb3cgPCA5KSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4ICsgMTApOyAvLyBib3R0b20gYmxvY2tcclxuICAgICAgaWYgKGNvbCA+IDApIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggLSAxKTsgLy8gbGVmdCBibG9ja1xyXG4gICAgICBpZiAoY29sIDwgOSkgYWRqYWNlbnRJbmRleGVzLnB1c2goYmxvY2tJbmRleCArIDEpOyAvLyByaWdodCBibG9ja1xyXG4gICAgICBpZiAocm93ID4gMCAmJiBjb2wgPiAwKSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4IC0gMTEpOyAvLyB0b3AtbGVmdCBibG9ja1xyXG4gICAgICBpZiAocm93ID4gMCAmJiBjb2wgPCA5KSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4IC0gOSk7IC8vIHRvcC1yaWdodCBibG9ja1xyXG4gICAgICBpZiAocm93IDwgOSAmJiBjb2wgPiAwKSBhZGphY2VudEluZGV4ZXMucHVzaChibG9ja0luZGV4ICsgOSk7IC8vIGJvdHRvbS1sZWZ0IGJsb2NrXHJcbiAgICAgIGlmIChyb3cgPCA5ICYmIGNvbCA8IDkpIGFkamFjZW50SW5kZXhlcy5wdXNoKGJsb2NrSW5kZXggKyAxMSk7IC8vIGJvdHRvbS1yaWdodCBibG9ja1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIGNvbnN0IHVuaXF1ZUFkamFjZW50SW5kZXhlcyA9IEFycmF5LmZyb20obmV3IFNldChhZGphY2VudEluZGV4ZXMpKTtcclxuICByZXR1cm4gdW5pcXVlQWRqYWNlbnRJbmRleGVzO1xyXG59XHJcblxyXG4vLyBkcmFnJmRyb3Agc2hpcHNcclxubGV0IGRyYWdnZWRTaGlwO1xyXG5jb25zdCBzaGlwT3B0aW9ucyA9IEFycmF5LmZyb20oc2hpcENvbnRhaW5lci5jaGlsZHJlbik7XHJcbnNoaXBPcHRpb25zLmZvckVhY2goKHNoaXApID0+IHNoaXAuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdzdGFydFwiLCBkcmFnU3RhcnQpKTtcclxuXHJcbmNvbnN0IHBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNwbGF5ZXIgZGl2XCIpO1xyXG5wbGF5ZXJCb2FyZC5mb3JFYWNoKChibG9jaykgPT4ge1xyXG4gIGJsb2NrLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBkcmFnT3Zlcik7XHJcbiAgYmxvY2suYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgZHJvcFNoaXApO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGRyYWdTdGFydChlKSB7XHJcbiAgbm90RHJvcHBlZCA9IGZhbHNlO1xyXG4gIGRyYWdnZWRTaGlwID0gZS50YXJnZXQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYWdPdmVyKGUpIHtcclxuICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgaWYgKCFkcmFnZ2VkU2hpcCkgcmV0dXJuO1xyXG4gIGNvbnN0IHNoaXAgPSBzaGlwc1tkcmFnZ2VkU2hpcC5pZF07XHJcblxyXG4gIGhpZ2hsaWdodFNoaXBBcmVhKGUudGFyZ2V0LmlkLCBzaGlwKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJvcFNoaXAoZSkge1xyXG4gIGlmICghbXVsdGlQbGF5ZXJTdGFydGVkICYmICFzaW5nbGVQbGF5ZXJTdGFydGVkKSB7XHJcbiAgICBpbmZvRGlzcGxheS5pbm5lckhUTUwgPSBcIkzDvHRmZW4gb3l1biBtb2R1IHNlw6dpbml6IVwiO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBjb25zdCBzdGFydElkID0gZS50YXJnZXQuaWQ7XHJcbiAgaWYgKGRyYWdnZWRTaGlwID09PSB1bmRlZmluZWQgfHwgZHJhZ2dlZFNoaXAgPT09IG51bGwpIHJldHVybjtcclxuICBjb25zdCBzaGlwID0gc2hpcHNbZHJhZ2dlZFNoaXAuaWRdO1xyXG5cclxuICBhZGRTaGlwKFwicGxheWVyXCIsIHNoaXAsIHN0YXJ0SWQpO1xyXG4gIGlmICghbm90RHJvcHBlZCkgZHJhZ2dlZFNoaXAucmVtb3ZlKCk7XHJcbiAgaWYgKCFzaGlwQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIuc2hpcFwiKSkge1xyXG4gICAgYWxsU2hpcHNQbGFjZWQgPSB0cnVlO1xyXG4gICAgc2hpcFNlbGVjdENvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgfVxyXG4gIGRyYWdnZWRTaGlwID0gbnVsbDtcclxufVxyXG5cclxuZnVuY3Rpb24gaGlnaGxpZ2h0U2hpcEFyZWEoc3RhcnRJbmRleCwgc2hpcCkge1xyXG4gIGNvbnN0IGlzSG9yaXpvbnRhbCA9IGFuZ2xlID09PSAwO1xyXG5cclxuICBjb25zdCB7IHNoaXBCbG9ja3MsIGlzVmFsaWQsIG5vdFRha2VuIH0gPSBjaGVja1ZhbGlkaXR5KFxyXG4gICAgcGxheWVyQm9hcmQsXHJcbiAgICBpc0hvcml6b250YWwsXHJcbiAgICBzdGFydEluZGV4LFxyXG4gICAgc2hpcFxyXG4gICk7XHJcblxyXG4gIGlmIChpc1ZhbGlkICYmIG5vdFRha2VuKSB7XHJcbiAgICBzaGlwQmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PiB7XHJcbiAgICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoXCJob3ZlclwiKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiBibG9jay5jbGFzc0xpc3QucmVtb3ZlKFwiaG92ZXJcIiksIDUwMCk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmxldCBwbGF5ZXJUdXJuO1xyXG4vLyBzdGFydGluZyBzaW5nZSBwbGF5ZXIgZ2FtZVxyXG5mdW5jdGlvbiBzdGFydEdhbWVTaW5nbGUoKSB7XHJcbiAgaWYgKHBsYXllclR1cm4gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgaWYgKHNoaXBDb250YWluZXIuY2hpbGRyZW4ubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJMw7x0ZmVuIMO2bmNlIGdlbWlsZXJpbmkgeWVybGXFn3RpciFcIjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IGJvYXJkQmxvY2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNjb21wdXRlciBkaXZcIik7XHJcbiAgICAgIGJvYXJkQmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PlxyXG4gICAgICAgIGJsb2NrLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVDbGljaylcclxuICAgICAgKTtcclxuICAgICAgcGxheWVyVHVybiA9IHRydWU7XHJcbiAgICAgIHR1cm5EaXNwbGF5LnRleHRDb250ZW50ID0gXCJTZW5pbiBzxLFyYW5cIjtcclxuICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBcIk95dW4gYmHFn2xhZMSxIVwiO1xyXG4gICAgICBnYW1lQ29udHJvbEJ1dHRvbnMuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUNsaWNrKGUpIHtcclxuICBpZiAoZ2FtZU1vZGUgPT09IFwic2luZ2xlcGxheWVyXCIgJiYgIXBsYXllclR1cm4pIHJldHVybjtcclxuICBpZiAoIWdhbWVPdmVyICYmIGFsbFNoaXBzUGxhY2VkKSB7XHJcbiAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGl0XCIpKSByZXR1cm47XHJcbiAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZmlsbGVkXCIpKSB7XHJcbiAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XHJcbiAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJCaXIgZ2VtaXlpIHZ1cmR1biFcIjtcclxuICAgICAgY29uc3QgY2xhc3NlcyA9IEFycmF5LmZyb20oZS50YXJnZXQuY2xhc3NMaXN0KS5maWx0ZXIoXHJcbiAgICAgICAgKG5hbWUpID0+ICFbXCJibG9ja1wiLCBcImhpdFwiLCBcImZpbGxlZFwiLCBcInVuYXZhaWxhYmxlXCJdLmluY2x1ZGVzKG5hbWUpXHJcbiAgICAgICk7XHJcblxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgY3VycmVudFBsYXllciA9PT0gXCJwbGF5ZXJcIiB8fFxyXG4gICAgICAgIGN1cnJlbnRQbGF5ZXIgPT09IFwiZW5lbXlcIiB8fFxyXG4gICAgICAgIGdhbWVNb2RlID09PSBcInNpbmdsZXBsYXllclwiXHJcbiAgICAgICkge1xyXG4gICAgICAgIHBsYXllckhpdHMucHVzaCguLi5jbGFzc2VzKTtcclxuICAgICAgICBjaGVja1Njb3JlKGN1cnJlbnRQbGF5ZXIsIHBsYXllckhpdHMsIHBsYXllclN1bmtTaGlwcyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZmlsbGVkXCIpKSB7XHJcbiAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJJc2thbGFkxLFuIVwiO1xyXG4gICAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZ2FtZU1vZGUgPT09IFwic2luZ2xlcGxheWVyXCIgJiYgIWdhbWVPdmVyKSB7XHJcbiAgICAgIHBsYXllclR1cm4gPSBmYWxzZTtcclxuXHJcbiAgICAgIHNldFRpbWVvdXQoY29tcHV0ZXJzVHVybiwgNzUwKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGUudGFyZ2V0LmlkO1xyXG59XHJcblxyXG4vLyBjb21wdXRlcnMgdHVyblxyXG5mdW5jdGlvbiBjb21wdXRlcnNUdXJuKCkge1xyXG4gIGlmICghZ2FtZU92ZXIpIHtcclxuICAgIHR1cm5EaXNwbGF5LnRleHRDb250ZW50ID0gXCJCaWxnaXNheWFyxLFuIHPEsXJhc8SxXCI7XHJcbiAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9IFwiSGVzYXBsYW1hbGFyIHlhcMSxbMSxeW9yLi5cIjtcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgY29uc3QgcmFuZG9tU2hvdCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwICogMTApO1xyXG4gICAgICBpZiAoXHJcbiAgICAgICAgcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiZmlsbGVkXCIpICYmXHJcbiAgICAgICAgcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGl0XCIpICYmXHJcbiAgICAgICAgcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmNvbnRhaW5zKFwibWlzc1wiKVxyXG4gICAgICApIHtcclxuICAgICAgICBjb21wdXRlcnNUdXJuKCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgICAgcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiZmlsbGVkXCIpICYmXHJcbiAgICAgICAgIXBsYXllckJvYXJkW3JhbmRvbVNob3RdLmNsYXNzTGlzdC5jb250YWlucyhcImhpdFwiKVxyXG4gICAgICApIHtcclxuICAgICAgICBwbGF5ZXJCb2FyZFtyYW5kb21TaG90XS5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xyXG4gICAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJIZWRlZiB2dXJ1bGR1IVwiO1xyXG4gICAgICAgIGNvbnN0IGNsYXNzZXMgPSBBcnJheS5mcm9tKHBsYXllckJvYXJkW3JhbmRvbVNob3RdLmNsYXNzTGlzdCkuZmlsdGVyKFxyXG4gICAgICAgICAgKG5hbWUpID0+ICFbXCJibG9ja1wiLCBcImhpdFwiLCBcImZpbGxlZFwiXS5pbmNsdWRlcyhuYW1lKVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY29tcHV0ZXJIaXRzLnB1c2goLi4uY2xhc3Nlcyk7XHJcbiAgICAgICAgY2hlY2tTY29yZShcImNvbXB1dGVyXCIsIGNvbXB1dGVySGl0cywgY29tcHV0ZXJTdW5rU2hpcHMpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJJc2thIVwiO1xyXG4gICAgICAgIHBsYXllckJvYXJkW3JhbmRvbVNob3RdLmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xyXG4gICAgICB9XHJcbiAgICB9LCA3NTApO1xyXG4gICAgY29uc3QgYm9hcmRCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI2NvbXB1dGVyIGRpdlwiKTtcclxuICAgIGJvYXJkQmxvY2tzLmZvckVhY2goXHJcbiAgICAgIChibG9jaykgPT4gYmxvY2sucmVwbGFjZVdpdGgoYmxvY2suY2xvbmVOb2RlKHRydWUpKSAvLyB0byByZW1vdmUgZXZlbnQgbGlzdGVuZXJzXHJcbiAgICApO1xyXG4gICAgaGFuZGxlRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBwbGF5ZXJUdXJuID0gdHJ1ZTtcclxuICAgICAgdHVybkRpc3BsYXkudGV4dENvbnRlbnQgPSBcIlNlbmluIHPEsXJhblwiO1xyXG4gICAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9IFwiQXTEscWfxLFuxLEgeWFwIVwiO1xyXG4gICAgfSwgNzUwKTtcclxuICB9XHJcbn1cclxuZnVuY3Rpb24gaGFuZGxlRXZlbnRMaXN0ZW5lcnMoKSB7XHJcbiAgY29uc3QgYm9hcmRCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI2NvbXB1dGVyIGRpdlwiKTtcclxuICBib2FyZEJsb2Nrcy5mb3JFYWNoKChibG9jaykgPT4gYmxvY2suYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUNsaWNrKSk7IC8vIHJlLWFkZGluZyBldmVudCBsaXN0ZW5lcnNcclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tTY29yZSh1c2VyLCB1c2VySGl0cywgdXNlclN1bmtTaGlwcykge1xyXG4gIGZ1bmN0aW9uIGNoZWNrU2hpcChzaGlwTmFtZSwgc2hpcExlbmd0aCkge1xyXG4gICAgaWYgKFxyXG4gICAgICB1c2VySGl0cy5maWx0ZXIoKGhpdFNoaXApID0+IGhpdFNoaXAgPT09IHNoaXBOYW1lKS5sZW5ndGggPT09IHNoaXBMZW5ndGhcclxuICAgICkge1xyXG4gICAgICBpZiAoXHJcbiAgICAgICAgdXNlciA9PT0gXCJwbGF5ZXJcIiB8fFxyXG4gICAgICAgIHVzZXIgPT09IFwiZW5lbXlcIiB8fFxyXG4gICAgICAgIGdhbWVNb2RlID09PSBcInNpbmdsZXBsYXllclwiXHJcbiAgICAgICkge1xyXG4gICAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gYFJha2liaW4gJHtzaGlwTmFtZX0gZ2VtaXNpbmkgYmF0xLFyZMSxbiFgO1xyXG5cclxuICAgICAgICBwbGF5ZXJIaXRzID0gdXNlckhpdHMuZmlsdGVyKChoaXRTaGlwKSA9PiBoaXRTaGlwICE9PSBzaGlwTmFtZSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHVzZXIgPT09IFwiY29tcHV0ZXJcIikge1xyXG4gICAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gYFJha2lwICR7c2hpcE5hbWV9IGdlbWluaSBiYXTEsXJkxLEhYDtcclxuICAgICAgICBjb21wdXRlckhpdHMgPSB1c2VySGl0cy5maWx0ZXIoKGhpdFNoaXApID0+IGhpdFNoaXAgIT09IHNoaXBOYW1lKTtcclxuICAgICAgfVxyXG4gICAgICB1c2VyU3Vua1NoaXBzLnB1c2goc2hpcE5hbWUpO1xyXG4gICAgfVxyXG4gIH1cclxuICBjaGVja1NoaXAoXCJkZXN0cm95ZXJcIiwgMik7XHJcbiAgY2hlY2tTaGlwKFwic3VibWFyaW5lXCIsIDMpO1xyXG4gIGNoZWNrU2hpcChcImNydWlzZXJcIiwgMyk7XHJcbiAgY2hlY2tTaGlwKFwiYmF0dGxlc2hpcFwiLCA0KTtcclxuICBjaGVja1NoaXAoXCJjYXJyaWVyXCIsIDUpO1xyXG4gIGNvbnNvbGUubG9nKFwicGxheWVyU3Vua1NoaXBzXCIsIHBsYXllclN1bmtTaGlwcyk7XHJcblxyXG4gIGlmIChwbGF5ZXJTdW5rU2hpcHMubGVuZ3RoID09PSA1KSB7XHJcbiAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9IFwiUmFraWJpbiBiw7x0w7xuIGdlbWlsZXJpbmkgeW9rIGV0dGluLiBLYXphbmTEsW4hXCI7IC8vIGdhbWUgb3ZlciBwbGF5ZXIgMSB3b25cclxuICAgIGdhbWVPdmVyID0gdHJ1ZTtcclxuICAgIGlmIChnYW1lTW9kZSA9PT0gXCJzaW5nbGVwbGF5ZXJcIikge1xyXG4gICAgICBzdGFydEJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RhcnRHYW1lU2luZ2xlKTtcclxuICAgICAgZ2FtZUluZm8uYXBwZW5kKHJlbG9hZEJ1dHRvbik7XHJcbiAgICAgIHJlbG9hZEJ1dHRvbi5vbmNsaWNrID0gKCkgPT4gbG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChjb21wdXRlclN1bmtTaGlwcy5sZW5ndGggPT09IDUpIHtcclxuICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJCw7x0w7xuIGdlbWlsZXJpbiB5b2sgZWRpbGRpLiDEsHlpIHNhdmHFn3TEsSBhbWlyYWwuXCI7XHJcbiAgICBnYW1lT3ZlciA9IHRydWU7XHJcbiAgICBzdGFydEJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RhcnRHYW1lU2luZ2xlKTtcclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9