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

        const adjacentIndexes = getAdjacentIndexes(
            boardBlocks,
            isHorizontal,
            shipBlocks
        );
        // adjacentIndexes.forEach((adjacentIndex) => {
        //     console.log(adjacentIndex, "ADJACeNT INDEXES");
        // });
        console.log(adjacentIndexes);
    } else {
        if (user === "computer") addShip(user, ship, startId);
        if (user === "player") notDropped = true;
    }
}

// helper function to get adjacent indexes
function getAdjacentIndexes(boardBlocks, isHorizontal, shipBlocks) {
    const adjacentIndexes = [];

    shipBlocks.forEach((block, index) => {
        // find row and column of the current block
        const row = Math.floor(index / 10);
        const col = index % 10;

        // add adjacent block indexes based on orientation and position of the current block
        if (isHorizontal) {
            if (col > 0) adjacentIndexes.push(index - 1); // left block
            if (col < 9) adjacentIndexes.push(index + 1); // right block
            if (row > 0) adjacentIndexes.push(index - 10); // top block
            if (row < 9) adjacentIndexes.push(index + 10); // bottom block
        } else {
            if (row > 0) adjacentIndexes.push(index - 10); // top block
            if (row < 9) adjacentIndexes.push(index + 10); // bottom block
            if (col > 0) adjacentIndexes.push(index - 1); // left block
            if (col < 9) adjacentIndexes.push(index + 1); // right block
        }
    });

    // remove duplicates from adjacent indexes
    const uniqueAdjacentIndexes = Array.from(new Set(adjacentIndexes));

    return uniqueAdjacentIndexes;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsTUFBTTtBQUMvQyxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixTQUFTO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLFdBQVc7QUFDL0M7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLGlCQUFpQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxRQUFRO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0QsTUFBTTtBQUM1RCxzQ0FBc0M7QUFDdEM7QUFDQSxrRUFBa0U7QUFDbEUsbUNBQW1DLGFBQWE7QUFDaEQscUNBQXFDLGlCQUFpQjtBQUN0RDtBQUNBO0FBQ0Esb0NBQW9DLFdBQVc7QUFDL0M7QUFDQSxZQUFZLGdDQUFnQztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsU0FBUztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMERBQTBEO0FBQzFELDBEQUEwRDtBQUMxRCwyREFBMkQ7QUFDM0QsMkRBQTJEO0FBQzNELFVBQVU7QUFDViwyREFBMkQ7QUFDM0QsMkRBQTJEO0FBQzNELDBEQUEwRDtBQUMxRCwwREFBMEQ7QUFDMUQ7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksZ0NBQWdDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2YsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0VBQWdFLFNBQVM7QUFDekU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBaUUsU0FBUztBQUMxRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1wcm9qZWN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIE1BUksgRk9SIFVJIEVMRU1FTlRTLCBNQUtFIFRIRU0gU0VQRVJBVEUgTU9EVUxFXHJcblxyXG4vLyBCVVRUT04gTE9HSUNcclxuY29uc3QgZmxpcEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmxpcC1idXR0b25cIik7XHJcbmNvbnN0IHNoaXBDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNoaXAtc2VsZWN0LWNvbnRhaW5lclwiKTtcclxuXHJcbmZsaXBCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZsaXBTaGlwcyk7XHJcblxyXG5sZXQgYW5nbGUgPSAwO1xyXG5mdW5jdGlvbiBmbGlwU2hpcHMoKSB7XHJcbiAgICBjb25zdCBzaGlwcyA9IEFycmF5LmZyb20oc2hpcENvbnRhaW5lci5jaGlsZHJlbik7XHJcbiAgICBhbmdsZSA9IGFuZ2xlID09PSAwID8gOTAgOiAwO1xyXG4gICAgc2hpcHMuZm9yRWFjaCgoc2hpcCkgPT4ge1xyXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxyXG4gICAgICAgIHNoaXAuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZSgke2FuZ2xlfWRlZylgO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8vIENSRUFUSU5HIEdBTUVCT0FSRFxyXG5mdW5jdGlvbiBjcmVhdGVCb2FyZChjb2xvciwgdXNlcikge1xyXG4gICAgY29uc3QgZ2FtZUJvYXJkQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lYm9hcmQtY29udGFpbmVyXCIpO1xyXG5cclxuICAgIGNvbnN0IGdhbWVCb2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBnYW1lQm9hcmQuc2V0QXR0cmlidXRlKFwiaWRcIiwgdXNlcik7XHJcbiAgICBnYW1lQm9hcmQuY2xhc3NMaXN0LmFkZChcImdhbWVib2FyZFwiKTtcclxuICAgIGdhbWVCb2FyZC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvcjtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwMDsgaSArPSAxKSB7XHJcbiAgICAgICAgY29uc3QgYmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoXCJibG9ja1wiKTtcclxuICAgICAgICBibG9jay5pZCA9IGk7XHJcbiAgICAgICAgZ2FtZUJvYXJkLmFwcGVuZChibG9jayk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2FtZUJvYXJkQ29udGFpbmVyLmFwcGVuZENoaWxkKGdhbWVCb2FyZCk7XHJcbn1cclxuXHJcbmNyZWF0ZUJvYXJkKFwid2hpdGVcIiwgXCJwbGF5ZXJcIik7XHJcbmNyZWF0ZUJvYXJkKFwiZ2FpbnNib3JvXCIsIFwiY29tcHV0ZXJcIik7XHJcblxyXG4vLyBDUkVBVElORyBTSElQU1xyXG5jbGFzcyBTaGlwIHtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGxlbmd0aCkge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGRlc3Ryb3llciA9IG5ldyBTaGlwKFwiZGVzdHJveWVyXCIsIDIpO1xyXG5jb25zdCBzdWJtYXJpbmUgPSBuZXcgU2hpcChcInN1Ym1hcmluZVwiLCAzKTtcclxuY29uc3QgY3J1aXNlciA9IG5ldyBTaGlwKFwiY3J1aXNlclwiLCAzKTtcclxuY29uc3QgYmF0dGxlc2hpcCA9IG5ldyBTaGlwKFwiYmF0dGxlc2hpcFwiLCA0KTtcclxuY29uc3QgY2FycmllciA9IG5ldyBTaGlwKFwiY2FycmllclwiLCA1KTtcclxuXHJcbmNvbnN0IHNoaXBzID0gW2Rlc3Ryb3llciwgc3VibWFyaW5lLCBjcnVpc2VyLCBiYXR0bGVzaGlwLCBjYXJyaWVyXTtcclxubGV0IG5vdERyb3BwZWQ7XHJcbi8vIGNvbnNvbGUubG9nKHNoaXBzKTtcclxuXHJcbmZ1bmN0aW9uIGNoZWNrVmFsaWRpdHkoYm9hcmRCbG9ja3MsIGlzSG9yaXpvbnRhbCwgc3RhcnRJbmRleCwgc2hpcCkge1xyXG4gICAgLy8gdG8gcHJldmVudCBwbGFjaW5nIHNoaXBzIG9mZiBib2FyZFxyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5lc3RlZC10ZXJuYXJ5XHJcbiAgICBjb25zdCB2YWxpZFN0YXJ0ID0gaXNIb3Jpem9udGFsXHJcbiAgICAgICAgPyBzdGFydEluZGV4IDw9IDEwICogMTAgLSBzaGlwLmxlbmd0aFxyXG4gICAgICAgICAgICA/IHN0YXJ0SW5kZXhcclxuICAgICAgICAgICAgOiAxMCAqIDEwIC0gc2hpcC5sZW5ndGhcclxuICAgICAgICA6IHN0YXJ0SW5kZXggPD0gMTAgKiAxMCAtIDEwICogc2hpcC5sZW5ndGhcclxuICAgICAgICA/IHN0YXJ0SW5kZXhcclxuICAgICAgICA6IHN0YXJ0SW5kZXggLSBzaGlwLmxlbmd0aCAqIDEwICsgMTA7XHJcbiAgICAvLyAgIGNvbnNvbGUubG9nKGB2YWxpZGF0ZWQgaSAke3ZhbGlkU3RhcnR9YCk7XHJcblxyXG4gICAgY29uc3Qgc2hpcEJsb2NrcyA9IFtdO1xyXG4gICAgLy8gc2F2ZSB0aGUgaW5kZXhlcyBvZiBzaGlwcyB0byBhbiBhcnJheVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgaWYgKGlzSG9yaXpvbnRhbCkgc2hpcEJsb2Nrcy5wdXNoKGJvYXJkQmxvY2tzW051bWJlcih2YWxpZFN0YXJ0KSArIGldKTtcclxuICAgICAgICBlbHNlIHNoaXBCbG9ja3MucHVzaChib2FyZEJsb2Nrc1tOdW1iZXIodmFsaWRTdGFydCkgKyBpICogMTBdKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB2YWxpZGF0ZSBwbGFjZSB0byBwcmV2ZW50IHNoaXBzIGZyb20gc3BsaXR0aW5nXHJcbiAgICBsZXQgaXNWYWxpZDtcclxuICAgIGlmIChpc0hvcml6b250YWwpIHtcclxuICAgICAgICBzaGlwQmxvY2tzLmV2ZXJ5KFxyXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmV0dXJuLWFzc2lnblxyXG4gICAgICAgICAgICAoX2Jsb2NrLCBpbmRleCkgPT5cclxuICAgICAgICAgICAgICAgIChpc1ZhbGlkID1cclxuICAgICAgICAgICAgICAgICAgICBzaGlwQmxvY2tzWzBdLmlkICUgMTAgIT09XHJcbiAgICAgICAgICAgICAgICAgICAgMTAgLSAoc2hpcEJsb2Nrcy5sZW5ndGggLSAoaW5kZXggKyAxKSkpXHJcbiAgICAgICAgKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2hpcEJsb2Nrcy5ldmVyeShcclxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJldHVybi1hc3NpZ25cclxuICAgICAgICAgICAgKF9ibG9jaywgaW5kZXgpID0+XHJcbiAgICAgICAgICAgICAgICAoaXNWYWxpZCA9IHNoaXBCbG9ja3NbMF0uaWQgPCA5MCArICgxMCAqIGluZGV4ICsgMSkpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIC8vIGNvbnNvbGUubG9nKGBpcyB2YWxpZD8gJHtpc1ZhbGlkfWApO1xyXG4gICAgY29uc3Qgbm90VGFrZW4gPSBzaGlwQmxvY2tzLmV2ZXJ5KFxyXG4gICAgICAgIChibG9jaykgPT4gIWJsb2NrLmNsYXNzTGlzdC5jb250YWlucyhcImZpbGxlZFwiKVxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4geyBzaGlwQmxvY2tzLCBpc1ZhbGlkLCBub3RUYWtlbiB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRTaGlwKHVzZXIsIHNoaXAsIHN0YXJ0SWQpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiYWRkc2hpcFwiKTtcclxuICAgIC8vICAgY29uc29sZS5sb2codXNlcik7XHJcbiAgICBjb25zdCBib2FyZEJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYCMke3VzZXJ9IGRpdmApO1xyXG4gICAgY29uc3QgYm9vbCA9IE1hdGgucmFuZG9tKCkgPCAwLjU7IC8vIHJldHVybmVkIG51bWJlciBlaXRoZXIgd2lsbCBiZSBiaWdnZXIgdGhhbiAwLjUgb3Igbm90IGhlbmNlIHRoZSByYW5kb20gYm9vbFxyXG4gICAgY29uc3QgaXNIb3Jpem9udGFsID0gdXNlciA9PT0gXCJwbGF5ZXJcIiA/IGFuZ2xlID09PSAwIDogYm9vbDtcclxuICAgIGNvbnN0IHJhbmRvbVN0YXJ0SW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCAqIDEwKTsgLy8gdGVuIHRpbWVzIHRlbiBpcyB0aGUgd2lkdGggb2YgdGhlIGJvYXJkXHJcbiAgICAvLyAgIGNvbnNvbGUubG9nKGBob3Jpem9udGFsICR7aXNIb3Jpem9udGFsfWApO1xyXG4gICAgLy8gICBjb25zb2xlLmxvZyhgcmFuZG9tIGluZGV4ICR7cmFuZG9tU3RhcnRJbmRleH1gKTtcclxuXHJcbiAgICBjb25zdCBzdGFydEluZGV4ID0gc3RhcnRJZCB8fCByYW5kb21TdGFydEluZGV4O1xyXG4gICAgLy8gICBjb25zb2xlLmxvZyhgc3RhcnQgaW5kZXggJHtzdGFydEluZGV4fWApO1xyXG5cclxuICAgIGNvbnN0IHsgc2hpcEJsb2NrcywgaXNWYWxpZCwgbm90VGFrZW4gfSA9IGNoZWNrVmFsaWRpdHkoXHJcbiAgICAgICAgYm9hcmRCbG9ja3MsXHJcbiAgICAgICAgaXNIb3Jpem9udGFsLFxyXG4gICAgICAgIHN0YXJ0SW5kZXgsXHJcbiAgICAgICAgc2hpcFxyXG4gICAgKTtcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZyhgbm90IHRha2VuPyAke25vdFRha2VufWApO1xyXG4gICAgaWYgKGlzVmFsaWQgJiYgbm90VGFrZW4pIHtcclxuICAgICAgICBzaGlwQmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PiB7XHJcbiAgICAgICAgICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoc2hpcC5uYW1lKTtcclxuICAgICAgICAgICAgYmxvY2suY2xhc3NMaXN0LmFkZChcImZpbGxlZFwiKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgYWRqYWNlbnRJbmRleGVzID0gZ2V0QWRqYWNlbnRJbmRleGVzKFxyXG4gICAgICAgICAgICBib2FyZEJsb2NrcyxcclxuICAgICAgICAgICAgaXNIb3Jpem9udGFsLFxyXG4gICAgICAgICAgICBzaGlwQmxvY2tzXHJcbiAgICAgICAgKTtcclxuICAgICAgICAvLyBhZGphY2VudEluZGV4ZXMuZm9yRWFjaCgoYWRqYWNlbnRJbmRleCkgPT4ge1xyXG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhhZGphY2VudEluZGV4LCBcIkFESkFDZU5UIElOREVYRVNcIik7XHJcbiAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coYWRqYWNlbnRJbmRleGVzKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHVzZXIgPT09IFwiY29tcHV0ZXJcIikgYWRkU2hpcCh1c2VyLCBzaGlwLCBzdGFydElkKTtcclxuICAgICAgICBpZiAodXNlciA9PT0gXCJwbGF5ZXJcIikgbm90RHJvcHBlZCA9IHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIGhlbHBlciBmdW5jdGlvbiB0byBnZXQgYWRqYWNlbnQgaW5kZXhlc1xyXG5mdW5jdGlvbiBnZXRBZGphY2VudEluZGV4ZXMoYm9hcmRCbG9ja3MsIGlzSG9yaXpvbnRhbCwgc2hpcEJsb2Nrcykge1xyXG4gICAgY29uc3QgYWRqYWNlbnRJbmRleGVzID0gW107XHJcblxyXG4gICAgc2hpcEJsb2Nrcy5mb3JFYWNoKChibG9jaywgaW5kZXgpID0+IHtcclxuICAgICAgICAvLyBmaW5kIHJvdyBhbmQgY29sdW1uIG9mIHRoZSBjdXJyZW50IGJsb2NrXHJcbiAgICAgICAgY29uc3Qgcm93ID0gTWF0aC5mbG9vcihpbmRleCAvIDEwKTtcclxuICAgICAgICBjb25zdCBjb2wgPSBpbmRleCAlIDEwO1xyXG5cclxuICAgICAgICAvLyBhZGQgYWRqYWNlbnQgYmxvY2sgaW5kZXhlcyBiYXNlZCBvbiBvcmllbnRhdGlvbiBhbmQgcG9zaXRpb24gb2YgdGhlIGN1cnJlbnQgYmxvY2tcclxuICAgICAgICBpZiAoaXNIb3Jpem9udGFsKSB7XHJcbiAgICAgICAgICAgIGlmIChjb2wgPiAwKSBhZGphY2VudEluZGV4ZXMucHVzaChpbmRleCAtIDEpOyAvLyBsZWZ0IGJsb2NrXHJcbiAgICAgICAgICAgIGlmIChjb2wgPCA5KSBhZGphY2VudEluZGV4ZXMucHVzaChpbmRleCArIDEpOyAvLyByaWdodCBibG9ja1xyXG4gICAgICAgICAgICBpZiAocm93ID4gMCkgYWRqYWNlbnRJbmRleGVzLnB1c2goaW5kZXggLSAxMCk7IC8vIHRvcCBibG9ja1xyXG4gICAgICAgICAgICBpZiAocm93IDwgOSkgYWRqYWNlbnRJbmRleGVzLnB1c2goaW5kZXggKyAxMCk7IC8vIGJvdHRvbSBibG9ja1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChyb3cgPiAwKSBhZGphY2VudEluZGV4ZXMucHVzaChpbmRleCAtIDEwKTsgLy8gdG9wIGJsb2NrXHJcbiAgICAgICAgICAgIGlmIChyb3cgPCA5KSBhZGphY2VudEluZGV4ZXMucHVzaChpbmRleCArIDEwKTsgLy8gYm90dG9tIGJsb2NrXHJcbiAgICAgICAgICAgIGlmIChjb2wgPiAwKSBhZGphY2VudEluZGV4ZXMucHVzaChpbmRleCAtIDEpOyAvLyBsZWZ0IGJsb2NrXHJcbiAgICAgICAgICAgIGlmIChjb2wgPCA5KSBhZGphY2VudEluZGV4ZXMucHVzaChpbmRleCArIDEpOyAvLyByaWdodCBibG9ja1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIHJlbW92ZSBkdXBsaWNhdGVzIGZyb20gYWRqYWNlbnQgaW5kZXhlc1xyXG4gICAgY29uc3QgdW5pcXVlQWRqYWNlbnRJbmRleGVzID0gQXJyYXkuZnJvbShuZXcgU2V0KGFkamFjZW50SW5kZXhlcykpO1xyXG5cclxuICAgIHJldHVybiB1bmlxdWVBZGphY2VudEluZGV4ZXM7XHJcbn1cclxuXHJcbi8vIGFkZFNoaXAoZGVzdHJveWVyKTtcclxuLy8gYWRkU2hpcChzdWJtYXJpbmUpO1xyXG4vLyBhZGRTaGlwKGNydWlzZXIpO1xyXG4vLyBhZGRTaGlwKGJhdHRsZXNoaXApO1xyXG4vLyBhZGRTaGlwKFwiY29tcHV0ZXJcIiwgY2Fycmllcik7XHJcbnNoaXBzLmZvckVhY2goKHNoaXApID0+IGFkZFNoaXAoXCJjb21wdXRlclwiLCBzaGlwKSk7XHJcblxyXG4vLyBEUkFHJkRST1AgUExBWUVSIFNISVBTXHJcbmxldCBkcmFnZ2VkU2hpcDtcclxuY29uc3Qgc2hpcE9wdGlvbnMgPSBBcnJheS5mcm9tKHNoaXBDb250YWluZXIuY2hpbGRyZW4pO1xyXG5zaGlwT3B0aW9ucy5mb3JFYWNoKChzaGlwKSA9PiBzaGlwLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnc3RhcnRcIiwgZHJhZ1N0YXJ0KSk7XHJcblxyXG5jb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjcGxheWVyIGRpdlwiKTtcclxucGxheWVyQm9hcmQuZm9yRWFjaCgoYmxvY2spID0+IHtcclxuICAgIGJsb2NrLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBkcmFnT3Zlcik7XHJcbiAgICBibG9jay5hZGRFdmVudExpc3RlbmVyKFwiZHJvcFwiLCBkcm9wU2hpcCk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gZHJhZ1N0YXJ0KGUpIHtcclxuICAgIG5vdERyb3BwZWQgPSBmYWxzZTtcclxuICAgIGRyYWdnZWRTaGlwID0gZS50YXJnZXQ7XHJcbiAgICBjb25zb2xlLmxvZyhcImRyYWcgc3RhcnRlZFwiKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhZ092ZXIoZSkge1xyXG4gICAgLy8gY29uc29sZS5sb2coXCJkcmFnb3ZlclwiKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKGUudGFyZ2V0LnBhcmVudE5vZGUpO1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGlmICghZHJhZ2dlZFNoaXApIHJldHVybjtcclxuICAgIGNvbnN0IHNoaXAgPSBzaGlwc1tkcmFnZ2VkU2hpcC5pZF07XHJcblxyXG4gICAgaGlnaGxpZ2h0U2hpcEFyZWEoZS50YXJnZXQuaWQsIHNoaXApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcm9wU2hpcChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcImRyb3BzaGlwXCIpO1xyXG4gICAgY29uc3Qgc3RhcnRJZCA9IGUudGFyZ2V0LmlkO1xyXG4gICAgaWYgKGRyYWdnZWRTaGlwID09PSB1bmRlZmluZWQgfHwgZHJhZ2dlZFNoaXAgPT09IG51bGwpIHJldHVybjtcclxuICAgIGNvbnN0IHNoaXAgPSBzaGlwc1tkcmFnZ2VkU2hpcC5pZF07XHJcbiAgICBjb25zb2xlLmxvZyhzaGlwLCBcInRoaXMgaXMgc2hpcFwiKTtcclxuXHJcbiAgICBhZGRTaGlwKFwicGxheWVyXCIsIHNoaXAsIHN0YXJ0SWQpO1xyXG4gICAgaWYgKCFub3REcm9wcGVkKSBkcmFnZ2VkU2hpcC5yZW1vdmUoKTtcclxuXHJcbiAgICBkcmFnZ2VkU2hpcCA9IG51bGw7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhpZ2hsaWdodFNoaXBBcmVhKHN0YXJ0SW5kZXgsIHNoaXApIHtcclxuICAgIGNvbnN0IGlzSG9yaXpvbnRhbCA9IGFuZ2xlID09PSAwO1xyXG5cclxuICAgIGNvbnN0IHsgc2hpcEJsb2NrcywgaXNWYWxpZCwgbm90VGFrZW4gfSA9IGNoZWNrVmFsaWRpdHkoXHJcbiAgICAgICAgcGxheWVyQm9hcmQsXHJcbiAgICAgICAgaXNIb3Jpem9udGFsLFxyXG4gICAgICAgIHN0YXJ0SW5kZXgsXHJcbiAgICAgICAgc2hpcFxyXG4gICAgKTtcclxuXHJcbiAgICBpZiAoaXNWYWxpZCAmJiBub3RUYWtlbikge1xyXG4gICAgICAgIHNoaXBCbG9ja3MuZm9yRWFjaCgoYmxvY2spID0+IHtcclxuICAgICAgICAgICAgYmxvY2suY2xhc3NMaXN0LmFkZChcImhvdmVyXCIpO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGJsb2NrLmNsYXNzTGlzdC5yZW1vdmUoXCJob3ZlclwiKSwgNTAwKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gR0FNRSBMT0dJQ1xyXG5cclxubGV0IGdhbWVPdmVyID0gZmFsc2U7XHJcbmxldCBwbGF5ZXJUdXJuO1xyXG5cclxuLy8gc3RhcnQgdGhlIGdhbWVcclxuY29uc3Qgc3RhcnRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0YXJ0LWJ1dHRvblwiKTtcclxuY29uc3QgaW5mb0Rpc3BsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluZm8tZGlzcGxheVwiKTtcclxuY29uc3QgdHVybkRpc3BsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR1cm4tZGlzcGxheVwiKTtcclxuXHJcbmZ1bmN0aW9uIHN0YXJ0R2FtZSgpIHtcclxuICAgIGlmIChwbGF5ZXJUdXJuID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBpZiAoc2hpcENvbnRhaW5lci5jaGlsZHJlbi5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBcIlBsZWFzZSBwbGFjZSBhbGwgeW91ciBzaGlwcyBmaXJzdCFcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBib2FyZEJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjY29tcHV0ZXIgZGl2XCIpO1xyXG4gICAgICAgICAgICBib2FyZEJsb2Nrcy5mb3JFYWNoKChibG9jaykgPT5cclxuICAgICAgICAgICAgICAgIGJsb2NrLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVDbGljaylcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgcGxheWVyVHVybiA9IHRydWU7XHJcbiAgICAgICAgICAgIHR1cm5EaXNwbGF5LnRleHRDb250ZW50ID0gXCJZb3VyIHR1cm4hXCI7XHJcbiAgICAgICAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJUaGUgYmF0dGxlIGhhcyBiZWd1biFcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuc3RhcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN0YXJ0R2FtZSk7XHJcblxyXG5sZXQgcGxheWVySGl0cyA9IFtdO1xyXG5sZXQgY29tcHV0ZXJIaXRzID0gW107XHJcbmNvbnN0IHBsYXllclN1bmtTaGlwcyA9IFtdO1xyXG5jb25zdCBjb21wdXRlclN1bmtTaGlwcyA9IFtdO1xyXG5cclxuZnVuY3Rpb24gaGFuZGxlQ2xpY2soZSkge1xyXG4gICAgaWYgKCFnYW1lT3Zlcikge1xyXG4gICAgICAgIGlmIChlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJmaWxsZWRcIikpIHtcclxuICAgICAgICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmFkZChcImhpdFwiKTtcclxuICAgICAgICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBcIllvdSBoaXQgdGhlIGVuZW15IHNoaXAhXCI7XHJcbiAgICAgICAgICAgIGNvbnN0IGNsYXNzZXMgPSBBcnJheS5mcm9tKGUudGFyZ2V0LmNsYXNzTGlzdCkuZmlsdGVyKFxyXG4gICAgICAgICAgICAgICAgKG5hbWUpID0+ICFbXCJibG9ja1wiLCBcImhpdFwiLCBcImZpbGxlZFwiXS5pbmNsdWRlcyhuYW1lKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBwbGF5ZXJIaXRzLnB1c2goLi4uY2xhc3Nlcyk7XHJcbiAgICAgICAgICAgIGNoZWNrU2NvcmUoXCJwbGF5ZXJcIiwgcGxheWVySGl0cywgcGxheWVyU3Vua1NoaXBzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJmaWxsZWRcIikpIHtcclxuICAgICAgICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBcIk1pc3MhXCI7XHJcbiAgICAgICAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwbGF5ZXJUdXJuID0gZmFsc2U7XHJcbiAgICAgICAgY29uc3QgYm9hcmRCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI2NvbXB1dGVyIGRpdlwiKTtcclxuICAgICAgICBib2FyZEJsb2Nrcy5mb3JFYWNoKFxyXG4gICAgICAgICAgICAoYmxvY2spID0+IGJsb2NrLnJlcGxhY2VXaXRoKGJsb2NrLmNsb25lTm9kZSh0cnVlKSkgLy8gdG8gcmVtb3ZlIGV2ZW50IGxpc3RlbmVyc1xyXG4gICAgICAgICk7XHJcbiAgICAgICAgc2V0VGltZW91dChjb21wdXRlcnNUdXJuLCA1MDApO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBjb21wdXRlcnMgdHVyblxyXG5mdW5jdGlvbiBjb21wdXRlcnNUdXJuKCkge1xyXG4gICAgaWYgKCFnYW1lT3Zlcikge1xyXG4gICAgICAgIHR1cm5EaXNwbGF5LnRleHRDb250ZW50ID0gXCJDb21wdXRlcnMgVHVyblwiO1xyXG4gICAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gXCJNYWtpbmcgY2FsY3VsYXRpb25zLi5cIjtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJhbmRvbVNob3QgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCAqIDEwKTtcclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiZmlsbGVkXCIpICYmXHJcbiAgICAgICAgICAgICAgICBwbGF5ZXJCb2FyZFtyYW5kb21TaG90XS5jbGFzc0xpc3QuY29udGFpbnMoXCJoaXRcIilcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICBjb21wdXRlcnNUdXJuKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgICAgICAgICAgICBwbGF5ZXJCb2FyZFtyYW5kb21TaG90XS5jbGFzc0xpc3QuY29udGFpbnMoXCJmaWxsZWRcIikgJiZcclxuICAgICAgICAgICAgICAgICFwbGF5ZXJCb2FyZFtyYW5kb21TaG90XS5jbGFzc0xpc3QuY29udGFpbnMoXCJoaXRcIilcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXJCb2FyZFtyYW5kb21TaG90XS5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xyXG4gICAgICAgICAgICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBcIkhpdCB0aGUgdGFyZ2V0IVwiO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2xhc3NlcyA9IEFycmF5LmZyb20oXHJcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyQm9hcmRbcmFuZG9tU2hvdF0uY2xhc3NMaXN0XHJcbiAgICAgICAgICAgICAgICApLmZpbHRlcigobmFtZSkgPT4gIVtcImJsb2NrXCIsIFwiaGl0XCIsIFwiZmlsbGVkXCJdLmluY2x1ZGVzKG5hbWUpKTtcclxuICAgICAgICAgICAgICAgIGNvbXB1dGVySGl0cy5wdXNoKC4uLmNsYXNzZXMpO1xyXG4gICAgICAgICAgICAgICAgY2hlY2tTY29yZShcImNvbXB1dGVyXCIsIGNvbXB1dGVySGl0cywgY29tcHV0ZXJTdW5rU2hpcHMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBcIk1pc3MhXCI7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXJCb2FyZFtyYW5kb21TaG90XS5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIDUwMCk7XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBwbGF5ZXJUdXJuID0gdHJ1ZTtcclxuICAgICAgICAgICAgdHVybkRpc3BsYXkudGV4dENvbnRlbnQgPSBcIlBsYXllcidzIHR1cm5cIjtcclxuICAgICAgICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBcIlRha2UgeW91ciBzaG90IVwiO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYm9hcmRCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI2NvbXB1dGVyIGRpdlwiKTtcclxuICAgICAgICAgICAgYm9hcmRCbG9ja3MuZm9yRWFjaCgoYmxvY2spID0+XHJcbiAgICAgICAgICAgICAgICBibG9jay5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlQ2xpY2spXHJcbiAgICAgICAgICAgICk7IC8vIHJlLWFkZGluZyBldmVudCBsaXN0ZW5lcnNcclxuICAgICAgICB9LCA1MDApO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjaGVja1Njb3JlKHVzZXIsIHVzZXJIaXRzLCB1c2VyU3Vua1NoaXBzKSB7XHJcbiAgICBmdW5jdGlvbiBjaGVja1NoaXAoc2hpcE5hbWUsIHNoaXBMZW5ndGgpIHtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIHVzZXJIaXRzLmZpbHRlcigoaGl0U2hpcCkgPT4gaGl0U2hpcCA9PT0gc2hpcE5hbWUpLmxlbmd0aCA9PT1cclxuICAgICAgICAgICAgc2hpcExlbmd0aFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBpZiAodXNlciA9PT0gXCJwbGF5ZXJcIikge1xyXG4gICAgICAgICAgICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPSBgWW91IHN1bmsgdGhlIGVuZW15ICR7c2hpcE5hbWV9IWA7XHJcblxyXG4gICAgICAgICAgICAgICAgcGxheWVySGl0cyA9IHVzZXJIaXRzLmZpbHRlcigoaGl0U2hpcCkgPT4gaGl0U2hpcCAhPT0gc2hpcE5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh1c2VyID09PSBcImNvbXB1dGVyXCIpIHtcclxuICAgICAgICAgICAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID0gYFRoZSBlbmVteSBzdW5rIHlvdXIgJHtzaGlwTmFtZX0hYDtcclxuICAgICAgICAgICAgICAgIGNvbXB1dGVySGl0cyA9IHVzZXJIaXRzLmZpbHRlcihcclxuICAgICAgICAgICAgICAgICAgICAoaGl0U2hpcCkgPT4gaGl0U2hpcCAhPT0gc2hpcE5hbWVcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdXNlclN1bmtTaGlwcy5wdXNoKHNoaXBOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjaGVja1NoaXAoXCJkZXN0cm95ZXJcIiwgMik7XHJcbiAgICBjaGVja1NoaXAoXCJzdWJtYXJpbmVcIiwgMyk7XHJcbiAgICBjaGVja1NoaXAoXCJjcnVpc2VyXCIsIDMpO1xyXG4gICAgY2hlY2tTaGlwKFwiYmF0dGxlc2hpcFwiLCA0KTtcclxuICAgIGNoZWNrU2hpcChcImNhcnJpZXJcIiwgNSk7XHJcbiAgICBjb25zb2xlLmxvZyhcInBsYXllckhpdHNcIiwgcGxheWVySGl0cyk7XHJcbiAgICBjb25zb2xlLmxvZyhcInBsYXllclN1bmtTaGlwc1wiLCBwbGF5ZXJTdW5rU2hpcHMpO1xyXG5cclxuICAgIGlmIChwbGF5ZXJTdW5rU2hpcHMubGVuZ3RoID09PSA1KSB7XHJcbiAgICAgICAgaW5mb0Rpc3BsYXkudGV4dENvbnRlbnQgPVxyXG4gICAgICAgICAgICBcIllvdSBzdW5rIGFsbCB0aGUgZW5lbXkgc2hpcHMhIFdlbGwgZm91Z2h0IGFkbWlyYWwhXCI7XHJcbiAgICAgICAgZ2FtZU92ZXIgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgaWYgKGNvbXB1dGVyU3Vua1NoaXBzLmxlbmd0aCA9PT0gNSkge1xyXG4gICAgICAgIGluZm9EaXNwbGF5LnRleHRDb250ZW50ID1cclxuICAgICAgICAgICAgXCJZb3VyIGZsZWV0IGhhcyBiZWVuIGRlc3Ryb3llZCEgV2VsbCBmb3VnaHQgYWRtaXJhbCwgd2UnbGwgZ2V0IHRoZW0gbmV4dCB0aW1lLlwiO1xyXG4gICAgICAgIGdhbWVPdmVyID0gdHJ1ZTtcclxuICAgIH1cclxufVxyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=