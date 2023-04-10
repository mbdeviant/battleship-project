/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
// MARK FOR UI ELEMENTS, MAKE THEM SEPERATE MODULE

// BUTTON LOGIC
const flipButton = document.getElementById("flip-button");
const shipContainer = document.querySelector(".ship-select-container");

flipButton.addEventListener("click", flipShips);

let angle = 0;
function flipShips() {
    const ships = Array.from(shipContainer.children);
    angle = angle === 0 ? 90 : 0;
    ships.forEach((ship) => {
        // eslint-disable-next-line no-param-reassign
        ship.style.transform = `rotate(${angle}deg)`;
    });
}

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
let notDropped;
console.log(ships);

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
    console.log(`validated i ${validStart}`);

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
                    shipBlocks[0].id % 10 !==
                    10 - (shipBlocks.length - (index + 1)))
        );
    } else {
        shipBlocks.every(
            // eslint-disable-next-line no-return-assign
            (_block, index) =>
                (isValid = shipBlocks[0].id < 90 + (10 * index + 1))
        );
    }
    // console.log(`is valid? ${isValid}`);
    const notTaken = shipBlocks.every(
        (block) => !block.classList.contains("filled")
    );

    return { shipBlocks, isValid, notTaken };
}

function addShip(user, ship, startId) {
    console.log(user);
    const boardBlocks = document.querySelectorAll(`#${user} div`);
    const bool = Math.random() < 0.5; // returned number either will be bigger than 0.5 or not hence the random bool
    const isHorizontal = user === "player" ? angle === 0 : bool;
    const randomStartIndex = Math.floor(Math.random() * 10 * 10); // ten times ten is the width of the board
    console.log(`horizontal ${isHorizontal}`);
    console.log(`random index ${randomStartIndex}`);

    const startIndex = startId || randomStartIndex;
    console.log(`start index ${startIndex}`);

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
    } else {
        if (user === "computer") addShip(user, ship, startId);
        if (user === "player") notDropped = true;
    }
}
// addShip(destroyer);
// addShip(submarine);
// addShip(cruiser);
// addShip(battleship);
// addShip("computer", carrier);
ships.forEach((ship) => addShip("computer", ship));

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
    console.log(draggedShip);
}

function dragOver(e) {
    e.preventDefault();
    const ship = ships[draggedShip.id];
    console.log(ship);

    highlightShipArea(e.target.id, ship);
}

function dropShip(e) {
    const startId = e.target.id;
    const ship = ships[draggedShip.id];
    addShip("player", ship, startId);
    if (!notDropped) draggedShip.remove();
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
const startButton = document.getElementById("start-button");
const infoDisplay = document.getElementById("info-display");
const turnDisplay = document.getElementById("turn-display");

function startGame() {
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
startButton.addEventListener("click", startGame);

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
                const classes = Array.from(
                    playerBoard[randomShot].classList
                ).filter((name) => !["block", "hit", "filled"].includes(name));
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
            userHits.filter((hitShip) => hitShip === shipName).length ===
            shipLength
        ) {
            if (user === "player") {
                infoDisplay.textContent = `You sunk the enemy ${shipName}!`;

                playerHits = userHits.filter((hitShip) => hitShip !== shipName);
            }
            if (user === "computer") {
                infoDisplay.textContent = `The enemy sunk your ${shipName}!`;
                computerHits = userHits.filter(
                    (hitShip) => hitShip !== shipName
                );
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
    }
    if (computerSunkShips.length === 5) {
        infoDisplay.textContent =
            "Your fleet has been destroyed! Well fought admiral, we'll get them next time.";
        gameOver = true;
    }
}

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsTUFBTTtBQUMvQyxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixTQUFTO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLFdBQVc7QUFDMUM7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLGlCQUFpQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxRQUFRO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNELE1BQU07QUFDNUQsc0NBQXNDO0FBQ3RDO0FBQ0Esa0VBQWtFO0FBQ2xFLDhCQUE4QixhQUFhO0FBQzNDLGdDQUFnQyxpQkFBaUI7QUFDakQ7QUFDQTtBQUNBLCtCQUErQixXQUFXO0FBQzFDO0FBQ0EsWUFBWSxnQ0FBZ0M7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLFNBQVM7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLGdDQUFnQztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdFQUFnRSxTQUFTO0FBQ3pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUVBQWlFLFNBQVM7QUFDMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAtcHJvamVjdC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBNQVJLIEZPUiBVSSBFTEVNRU5UUywgTUFLRSBUSEVNIFNFUEVSQVRFIE1PRFVMRVxyXG5cclxuLy8gQlVUVE9OIExPR0lDXHJcbmNvbnN0IGZsaXBCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZsaXAtYnV0dG9uXCIpO1xyXG5jb25zdCBzaGlwQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zaGlwLXNlbGVjdC1jb250YWluZXJcIik7XHJcblxyXG5mbGlwQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmbGlwU2hpcHMpO1xyXG5cclxubGV0IGFuZ2xlID0gMDtcclxuZnVuY3Rpb24gZmxpcFNoaXBzKCkge1xyXG4gICAgY29uc3Qgc2hpcHMgPSBBcnJheS5mcm9tKHNoaXBDb250YWluZXIuY2hpbGRyZW4pO1xyXG4gICAgYW5nbGUgPSBhbmdsZSA9PT0gMCA/IDkwIDogMDtcclxuICAgIHNoaXBzLmZvckVhY2goKHNoaXApID0+IHtcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cclxuICAgICAgICBzaGlwLnN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGUoJHthbmdsZX1kZWcpYDtcclxuICAgIH0pO1xyXG59XHJcblxyXG4vLyBDUkVBVElORyBHQU1FQk9BUkRcclxuZnVuY3Rpb24gY3JlYXRlQm9hcmQoY29sb3IsIHVzZXIpIHtcclxuICAgIGNvbnN0IGdhbWVCb2FyZENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZWJvYXJkLWNvbnRhaW5lclwiKTtcclxuXHJcbiAgICBjb25zdCBnYW1lQm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgZ2FtZUJvYXJkLnNldEF0dHJpYnV0ZShcImlkXCIsIHVzZXIpO1xyXG4gICAgZ2FtZUJvYXJkLmNsYXNzTGlzdC5hZGQoXCJnYW1lYm9hcmRcIik7XHJcbiAgICBnYW1lQm9hcmQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3I7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDA7IGkgKz0gMSkge1xyXG4gICAgICAgIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBibG9jay5jbGFzc0xpc3QuYWRkKFwiYmxvY2tcIik7XHJcbiAgICAgICAgYmxvY2suaWQgPSBpO1xyXG4gICAgICAgIGdhbWVCb2FyZC5hcHBlbmQoYmxvY2spO1xyXG4gICAgfVxyXG5cclxuICAgIGdhbWVCb2FyZENvbnRhaW5lci5hcHBlbmRDaGlsZChnYW1lQm9hcmQpO1xyXG59XHJcblxyXG5jcmVhdGVCb2FyZChcIndoaXRlXCIsIFwicGxheWVyXCIpO1xyXG5jcmVhdGVCb2FyZChcImdhaW5zYm9yb1wiLCBcImNvbXB1dGVyXCIpO1xyXG5cclxuLy8gQ1JFQVRJTkcgU0hJUFNcclxuY2xhc3MgU2hpcCB7XHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBsZW5ndGgpIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBkZXN0cm95ZXIgPSBuZXcgU2hpcChcImRlc3Ryb3llclwiLCAyKTtcclxuY29uc3Qgc3VibWFyaW5lID0gbmV3IFNoaXAoXCJzdWJtYXJpbmVcIiwgMyk7XHJcbmNvbnN0IGNydWlzZXIgPSBuZXcgU2hpcChcImNydWlzZXJcIiwgMyk7XHJcbmNvbnN0IGJhdHRsZXNoaXAgPSBuZXcgU2hpcChcImJhdHRsZXNoaXBcIiwgNCk7XHJcbmNvbnN0IGNhcnJpZXIgPSBuZXcgU2hpcChcImNhcnJpZXJcIiwgNSk7XHJcblxyXG5jb25zdCBzaGlwcyA9IFtkZXN0cm95ZXIsIHN1Ym1hcmluZSwgY3J1aXNlciwgYmF0dGxlc2hpcCwgY2Fycmllcl07XHJcbmxldCBub3REcm9wcGVkO1xyXG5jb25zb2xlLmxvZyhzaGlwcyk7XHJcblxyXG5mdW5jdGlvbiBjaGVja1ZhbGlkaXR5KGJvYXJkQmxvY2tzLCBpc0hvcml6b250YWwsIHN0YXJ0SW5kZXgsIHNoaXApIHtcclxuICAgIC8vIHRvIHByZXZlbnQgcGxhY2luZyBzaGlwcyBvZmYgYm9hcmRcclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXN0ZWQtdGVybmFyeVxyXG4gICAgY29uc3QgdmFsaWRTdGFydCA9IGlzSG9yaXpvbnRhbFxyXG4gICAgICAgID8gc3RhcnRJbmRleCA8PSAxMCAqIDEwIC0gc2hpcC5sZW5ndGhcclxuICAgICAgICAgICAgPyBzdGFydEluZGV4XHJcbiAgICAgICAgICAgIDogMTAgKiAxMCAtIHNoaXAubGVuZ3RoXHJcbiAgICAgICAgOiBzdGFydEluZGV4IDw9IDEwICogMTAgLSAxMCAqIHNoaXAubGVuZ3RoXHJcbiAgICAgICAgPyBzdGFydEluZGV4XHJcbiAgICAgICAgOiBzdGFydEluZGV4IC0gc2hpcC5sZW5ndGggKiAxMCArIDEwO1xyXG4gICAgY29uc29sZS5sb2coYHZhbGlkYXRlZCBpICR7dmFsaWRTdGFydH1gKTtcclxuXHJcbiAgICBjb25zdCBzaGlwQmxvY2tzID0gW107XHJcbiAgICAvLyBzYXZlIHRoZSBpbmRleGVzIG9mIHNoaXBzIHRvIGFuIGFycmF5XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICBpZiAoaXNIb3Jpem9udGFsKSBzaGlwQmxvY2tzLnB1c2goYm9hcmRCbG9ja3NbTnVtYmVyKHZhbGlkU3RhcnQpICsgaV0pO1xyXG4gICAgICAgIGVsc2Ugc2hpcEJsb2Nrcy5wdXNoKGJvYXJkQmxvY2tzW051bWJlcih2YWxpZFN0YXJ0KSArIGkgKiAxMF0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHZhbGlkYXRlIHBsYWNlIHRvIHByZXZlbnQgc2hpcHMgZnJvbSBzcGxpdHRpbmdcclxuICAgIGxldCBpc1ZhbGlkO1xyXG4gICAgaWYgKGlzSG9yaXpvbnRhbCkge1xyXG4gICAgICAgIHNoaXBCbG9ja3MuZXZlcnkoXHJcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXR1cm4tYXNzaWduXHJcbiAgICAgICAgICAgIChfYmxvY2ssIGluZGV4KSA9PlxyXG4gICAgICAgICAgICAgICAgKGlzVmFsaWQgPVxyXG4gICAgICAgICAgICAgICAgICAgIHNoaXBCbG9ja3NbMF0uaWQgJSAxMCAhPT1cclxuICAgICAgICAgICAgICAgICAgICAxMCAtIChzaGlwQmxvY2tzLmxlbmd0aCAtIChpbmRleCArIDEpKSlcclxuICAgICAgICApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBzaGlwQmxvY2tzLmV2ZXJ5KFxyXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmV0dXJuLWFzc2lnblxyXG4gICAgICAgICAgICAoX2Jsb2NrLCBpbmRleCkgPT5cclxuICAgICAgICAgICAgICAgIChpc1ZhbGlkID0gc2hpcEJsb2Nrc1swXS5pZCA8IDkwICsgKDEwICogaW5kZXggKyAxKSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgLy8gY29uc29sZS5sb2coYGlzIHZhbGlkPyAke2lzVmFsaWR9YCk7XHJcbiAgICBjb25zdCBub3RUYWtlbiA9IHNoaXBCbG9ja3MuZXZlcnkoXHJcbiAgICAgICAgKGJsb2NrKSA9PiAhYmxvY2suY2xhc3NMaXN0LmNvbnRhaW5zKFwiZmlsbGVkXCIpXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiB7IHNoaXBCbG9ja3MsIGlzVmFsaWQsIG5vdFRha2VuIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFNoaXAodXNlciwgc2hpcCwgc3RhcnRJZCkge1xyXG4gICAgY29uc29sZS5sb2codXNlcik7XHJcbiAgICBjb25zdCBib2FyZEJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYCMke3VzZXJ9IGRpdmApO1xyXG4gICAgY29uc3QgYm9vbCA9IE1hdGgucmFuZG9tKCkgPCAwLjU7IC8vIHJldHVybmVkIG51bWJlciBlaXRoZXIgd2lsbCBiZSBiaWdnZXIgdGhhbiAwLjUgb3Igbm90IGhlbmNlIHRoZSByYW5kb20gYm9vbFxyXG4gICAgY29uc3QgaXNIb3Jpem9udGFsID0gdXNlciA9PT0gXCJwbGF5ZXJcIiA/IGFuZ2xlID09PSAwIDogYm9vbDtcclxuICAgIGNvbnN0IHJhbmRvbVN0YXJ0SW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCAqIDEwKTsgLy8gdGVuIHRpbWVzIHRlbiBpcyB0aGUgd2lkdGggb2YgdGhlIGJvYXJkXHJcbiAgICBjb25zb2xlLmxvZyhgaG9yaXpvbnRhbCAke2lzSG9yaXpvbnRhbH1gKTtcclxuICAgIGNvbnNvbGUubG9nKGByYW5kb20gaW5kZXggJHtyYW5kb21TdGFydEluZGV4fWApO1xyXG5cclxuICAgIGNvbnN0IHN0YXJ0SW5kZXggPSBzdGFydElkIHx8IHJhbmRvbVN0YXJ0SW5kZXg7XHJcbiAgICBjb25zb2xlLmxvZyhgc3RhcnQgaW5kZXggJHtzdGFydEluZGV4fWApO1xyXG5cclxuICAgIGNvbnN0IHsgc2hpcEJsb2NrcywgaXNWYWxpZCwgbm90VGFrZW4gfSA9IGNoZWNrVmFsaWRpdHkoXHJcbiAgICAgICAgYm9hcmRCbG9ja3MsXHJcbiAgICAgICAgaXNIb3Jpem9udGFsLFxyXG4gICAgICAgIHN0YXJ0SW5kZXgsXHJcbiAgICAgICAgc2hpcFxyXG4gICAgKTtcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZyhgbm90IHRha2VuPyAke25vdFRha2VufWApO1xyXG4gICAgaWYgKGlzVmFsaWQgJiYgbm90VGFrZW4pIHtcclxuICAgICAgICBzaGlwQmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PiB7XHJcbiAgICAgICAgICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoc2hpcC5uYW1lKTtcclxuICAgICAgICAgICAgYmxvY2suY2xhc3NMaXN0LmFkZChcImZpbGxlZFwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHVzZXIgPT09IFwiY29tcHV0ZXJcIikgYWRkU2hpcCh1c2VyLCBzaGlwLCBzdGFydElkKTtcclxuICAgICAgICBpZiAodXNlciA9PT0gXCJwbGF5ZXJcIikgbm90RHJvcHBlZCA9IHRydWU7XHJcbiAgICB9XHJcbn1cclxuLy8gYWRkU2hpcChkZXN0cm95ZXIpO1xyXG4vLyBhZGRTaGlwKHN1Ym1hcmluZSk7XHJcbi8vIGFkZFNoaXAoY3J1aXNlcik7XHJcbi8vIGFkZFNoaXAoYmF0dGxlc2hpcCk7XHJcbi8vIGFkZFNoaXAoXCJjb21wdXRlclwiLCBjYXJyaWVyKTtcclxuc2hpcHMuZm9yRWFjaCgoc2hpcCkgPT4gYWRkU2hpcChcImNvbXB1dGVyXCIsIHNoaXApKTtcclxuXHJcbi8vIERSQUcmRFJPUCBQTEFZRVIgU0hJUFNcclxubGV0IGRyYWdnZWRTaGlwO1xyXG5jb25zdCBzaGlwT3B0aW9ucyA9IEFycmF5LmZyb20oc2hpcENvbnRhaW5lci5jaGlsZHJlbik7XHJcbnNoaXBPcHRpb25zLmZvckVhY2goKHNoaXApID0+IHNoaXAuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdzdGFydFwiLCBkcmFnU3RhcnQpKTtcclxuXHJcbmNvbnN0IHBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNwbGF5ZXIgZGl2XCIpO1xyXG5wbGF5ZXJCb2FyZC5mb3JFYWNoKChibG9jaykgPT4ge1xyXG4gICAgYmxvY2suYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIGRyYWdPdmVyKTtcclxuICAgIGJsb2NrLmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIGRyb3BTaGlwKTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBkcmFnU3RhcnQoZSkge1xyXG4gICAgbm90RHJvcHBlZCA9IGZhbHNlO1xyXG4gICAgZHJhZ2dlZFNoaXAgPSBlLnRhcmdldDtcclxuICAgIGNvbnNvbGUubG9nKGRyYWdnZWRTaGlwKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhZ092ZXIoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgY29uc3Qgc2hpcCA9IHNoaXBzW2RyYWdnZWRTaGlwLmlkXTtcclxuICAgIGNvbnNvbGUubG9nKHNoaXApO1xyXG5cclxuICAgIGhpZ2hsaWdodFNoaXBBcmVhKGUudGFyZ2V0LmlkLCBzaGlwKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJvcFNoaXAoZSkge1xyXG4gICAgY29uc3Qgc3RhcnRJZCA9IGUudGFyZ2V0LmlkO1xyXG4gICAgY29uc3Qgc2hpcCA9IHNoaXBzW2RyYWdnZWRTaGlwLmlkXTtcclxuICAgIGFkZFNoaXAoXCJwbGF5ZXJcIiwgc2hpcCwgc3RhcnRJZCk7XHJcbiAgICBpZiAoIW5vdERyb3BwZWQpIGRyYWdnZWRTaGlwLnJlbW92ZSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoaWdobGlnaHRTaGlwQXJlYShzdGFydEluZGV4LCBzaGlwKSB7XHJcbiAgICBjb25zdCBpc0hvcml6b250YWwgPSBhbmdsZSA9PT0gMDtcclxuXHJcbiAgICBjb25zdCB7IHNoaXBCbG9ja3MsIGlzVmFsaWQsIG5vdFRha2VuIH0gPSBjaGVja1ZhbGlkaXR5KFxyXG4gICAgICAgIHBsYXllckJvYXJkLFxyXG4gICAgICAgIGlzSG9yaXpvbnRhbCxcclxuICAgICAgICBzdGFydEluZGV4LFxyXG4gICAgICAgIHNoaXBcclxuICAgICk7XHJcblxyXG4gICAgaWYgKGlzVmFsaWQgJiYgbm90VGFrZW4pIHtcclxuICAgICAgICBzaGlwQmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PiB7XHJcbiAgICAgICAgICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoXCJob3ZlclwiKTtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBibG9jay5jbGFzc0xpc3QucmVtb3ZlKFwiaG92ZXJcIiksIDUwMCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIEdBTUUgTE9HSUNcclxuXHJcbmxldCBnYW1lT3ZlciA9IGZhbHNlO1xyXG5sZXQgcGxheWVyVHVybjtcclxuXHJcbi8vIHN0YXJ0IHRoZSBnYW1lXHJcbmNvbnN0IHN0YXJ0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdGFydC1idXR0b25cIik7XHJcbmNvbnN0IGluZm9EaXNwbGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbmZvLWRpc3BsYXlcIik7XHJcbmNvbnN0IHR1cm5EaXNwbGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0dXJuLWRpc3BsYXlcIik7XHJcblxyXG5mdW5jdGlvbiBzdGFydEdhbWUoKSB7XHJcbiAgICBpZiAocGxheWVyVHVybiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgaWYgKHNoaXBDb250YWluZXIuY2hpbGRyZW4ubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJQbGVhc2UgcGxhY2UgYWxsIHlvdXIgc2hpcHMgZmlyc3QhXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgYm9hcmRCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI2NvbXB1dGVyIGRpdlwiKTtcclxuICAgICAgICAgICAgYm9hcmRCbG9ja3MuZm9yRWFjaCgoYmxvY2spID0+XHJcbiAgICAgICAgICAgICAgICBibG9jay5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlQ2xpY2spXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHBsYXllclR1cm4gPSB0cnVlO1xyXG4gICAgICAgICAgICB0dXJuRGlzcGxheS50ZXh0Q29udGVudCA9IFwiWW91ciB0dXJuIVwiO1xyXG4gICAgICAgICAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9IFwiVGhlIGJhdHRsZSBoYXMgYmVndW4hXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbnN0YXJ0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzdGFydEdhbWUpO1xyXG5cclxubGV0IHBsYXllckhpdHMgPSBbXTtcclxubGV0IGNvbXB1dGVySGl0cyA9IFtdO1xyXG5jb25zdCBwbGF5ZXJTdW5rU2hpcHMgPSBbXTtcclxuY29uc3QgY29tcHV0ZXJTdW5rU2hpcHMgPSBbXTtcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUNsaWNrKGUpIHtcclxuICAgIGlmICghZ2FtZU92ZXIpIHtcclxuICAgICAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZmlsbGVkXCIpKSB7XHJcbiAgICAgICAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XHJcbiAgICAgICAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJZb3UgaGl0IHRoZSBlbmVteSBzaGlwIVwiO1xyXG4gICAgICAgICAgICBjb25zdCBjbGFzc2VzID0gQXJyYXkuZnJvbShlLnRhcmdldC5jbGFzc0xpc3QpLmZpbHRlcihcclxuICAgICAgICAgICAgICAgIChuYW1lKSA9PiAhW1wiYmxvY2tcIiwgXCJoaXRcIiwgXCJmaWxsZWRcIl0uaW5jbHVkZXMobmFtZSlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgcGxheWVySGl0cy5wdXNoKC4uLmNsYXNzZXMpO1xyXG4gICAgICAgICAgICBjaGVja1Njb3JlKFwicGxheWVyXCIsIHBsYXllckhpdHMsIHBsYXllclN1bmtTaGlwcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZmlsbGVkXCIpKSB7XHJcbiAgICAgICAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJNaXNzIVwiO1xyXG4gICAgICAgICAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcGxheWVyVHVybiA9IGZhbHNlO1xyXG4gICAgICAgIGNvbnN0IGJvYXJkQmxvY2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNjb21wdXRlciBkaXZcIik7XHJcbiAgICAgICAgYm9hcmRCbG9ja3MuZm9yRWFjaChcclxuICAgICAgICAgICAgKGJsb2NrKSA9PiBibG9jay5yZXBsYWNlV2l0aChibG9jay5jbG9uZU5vZGUodHJ1ZSkpIC8vIHRvIHJlbW92ZSBldmVudCBsaXN0ZW5lcnNcclxuICAgICAgICApO1xyXG4gICAgICAgIHNldFRpbWVvdXQoY29tcHV0ZXJzVHVybiwgNTAwKTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gY29tcHV0ZXJzIHR1cm5cclxuZnVuY3Rpb24gY29tcHV0ZXJzVHVybigpIHtcclxuICAgIGlmICghZ2FtZU92ZXIpIHtcclxuICAgICAgICB0dXJuRGlzcGxheS50ZXh0Q29udGVudCA9IFwiQ29tcHV0ZXJzIFR1cm5cIjtcclxuICAgICAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9IFwiTWFraW5nIGNhbGN1bGF0aW9ucy4uXCI7XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCByYW5kb21TaG90ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAgKiAxMCk7XHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgIHBsYXllckJvYXJkW3JhbmRvbVNob3RdLmNsYXNzTGlzdC5jb250YWlucyhcImZpbGxlZFwiKSAmJlxyXG4gICAgICAgICAgICAgICAgcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGl0XCIpXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgY29tcHV0ZXJzVHVybigpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxyXG4gICAgICAgICAgICAgICAgcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiZmlsbGVkXCIpICYmXHJcbiAgICAgICAgICAgICAgICAhcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGl0XCIpXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmFkZChcImhpdFwiKTtcclxuICAgICAgICAgICAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJIaXQgdGhlIHRhcmdldCFcIjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNsYXNzZXMgPSBBcnJheS5mcm9tKFxyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllckJvYXJkW3JhbmRvbVNob3RdLmNsYXNzTGlzdFxyXG4gICAgICAgICAgICAgICAgKS5maWx0ZXIoKG5hbWUpID0+ICFbXCJibG9ja1wiLCBcImhpdFwiLCBcImZpbGxlZFwiXS5pbmNsdWRlcyhuYW1lKSk7XHJcbiAgICAgICAgICAgICAgICBjb21wdXRlckhpdHMucHVzaCguLi5jbGFzc2VzKTtcclxuICAgICAgICAgICAgICAgIGNoZWNrU2NvcmUoXCJjb21wdXRlclwiLCBjb21wdXRlckhpdHMsIGNvbXB1dGVyU3Vua1NoaXBzKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJNaXNzIVwiO1xyXG4gICAgICAgICAgICAgICAgcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmFkZChcIm1pc3NcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCA1MDApO1xyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgcGxheWVyVHVybiA9IHRydWU7XHJcbiAgICAgICAgICAgIHR1cm5EaXNwbGF5LnRleHRDb250ZW50ID0gXCJQbGF5ZXIncyB0dXJuXCI7XHJcbiAgICAgICAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJUYWtlIHlvdXIgc2hvdCFcIjtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGJvYXJkQmxvY2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNjb21wdXRlciBkaXZcIik7XHJcbiAgICAgICAgICAgIGJvYXJkQmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PlxyXG4gICAgICAgICAgICAgICAgYmxvY2suYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUNsaWNrKVxyXG4gICAgICAgICAgICApOyAvLyByZS1hZGRpbmcgZXZlbnQgbGlzdGVuZXJzXHJcbiAgICAgICAgfSwgNTAwKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tTY29yZSh1c2VyLCB1c2VySGl0cywgdXNlclN1bmtTaGlwcykge1xyXG4gICAgZnVuY3Rpb24gY2hlY2tTaGlwKHNoaXBOYW1lLCBzaGlwTGVuZ3RoKSB7XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICB1c2VySGl0cy5maWx0ZXIoKGhpdFNoaXApID0+IGhpdFNoaXAgPT09IHNoaXBOYW1lKS5sZW5ndGggPT09XHJcbiAgICAgICAgICAgIHNoaXBMZW5ndGhcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgaWYgKHVzZXIgPT09IFwicGxheWVyXCIpIHtcclxuICAgICAgICAgICAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gYFlvdSBzdW5rIHRoZSBlbmVteSAke3NoaXBOYW1lfSFgO1xyXG5cclxuICAgICAgICAgICAgICAgIHBsYXllckhpdHMgPSB1c2VySGl0cy5maWx0ZXIoKGhpdFNoaXApID0+IGhpdFNoaXAgIT09IHNoaXBOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodXNlciA9PT0gXCJjb21wdXRlclwiKSB7XHJcbiAgICAgICAgICAgICAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9IGBUaGUgZW5lbXkgc3VuayB5b3VyICR7c2hpcE5hbWV9IWA7XHJcbiAgICAgICAgICAgICAgICBjb21wdXRlckhpdHMgPSB1c2VySGl0cy5maWx0ZXIoXHJcbiAgICAgICAgICAgICAgICAgICAgKGhpdFNoaXApID0+IGhpdFNoaXAgIT09IHNoaXBOYW1lXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHVzZXJTdW5rU2hpcHMucHVzaChzaGlwTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2hlY2tTaGlwKFwiZGVzdHJveWVyXCIsIDIpO1xyXG4gICAgY2hlY2tTaGlwKFwic3VibWFyaW5lXCIsIDMpO1xyXG4gICAgY2hlY2tTaGlwKFwiY3J1aXNlclwiLCAzKTtcclxuICAgIGNoZWNrU2hpcChcImJhdHRsZXNoaXBcIiwgNCk7XHJcbiAgICBjaGVja1NoaXAoXCJjYXJyaWVyXCIsIDUpO1xyXG4gICAgY29uc29sZS5sb2coXCJwbGF5ZXJIaXRzXCIsIHBsYXllckhpdHMpO1xyXG4gICAgY29uc29sZS5sb2coXCJwbGF5ZXJTdW5rU2hpcHNcIiwgcGxheWVyU3Vua1NoaXBzKTtcclxuXHJcbiAgICBpZiAocGxheWVyU3Vua1NoaXBzLmxlbmd0aCA9PT0gNSkge1xyXG4gICAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID1cclxuICAgICAgICAgICAgXCJZb3Ugc3VuayBhbGwgdGhlIGVuZW15IHNoaXBzISBXZWxsIGZvdWdodCBhZG1pcmFsIVwiO1xyXG4gICAgICAgIGdhbWVPdmVyID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGlmIChjb21wdXRlclN1bmtTaGlwcy5sZW5ndGggPT09IDUpIHtcclxuICAgICAgICBpbmZvRGlzcGxheS50ZXh0Q29udGVudCA9XHJcbiAgICAgICAgICAgIFwiWW91ciBmbGVldCBoYXMgYmVlbiBkZXN0cm95ZWQhIFdlbGwgZm91Z2h0IGFkbWlyYWwsIHdlJ2xsIGdldCB0aGVtIG5leHQgdGltZS5cIjtcclxuICAgICAgICBnYW1lT3ZlciA9IHRydWU7XHJcbiAgICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9