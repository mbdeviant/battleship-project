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

  if (!isValid || !notTaken)
    infoDisplay.innerHTML = "Gemini buraya yerleştiremezsin!";

  if (isValid && notTaken) {
    infoDisplay.innerHTML = "";
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
      infoDisplay.textContent = "Lütfen önce gemilerini yerleştir!";
    } else {
      const boardBlocks = document.querySelectorAll("#computer div");
      boardBlocks.forEach((block) =>
        block.addEventListener("click", handleClick)
      );
      playerTurn = true;
      turnDisplay.textContent = "Senin sıran";
      infoDisplay.textContent = "Oyun başladı!";
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
