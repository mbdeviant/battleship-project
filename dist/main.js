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
    // console.log(`not taken? ${notTaken}`);
    if (isValid && notTaken) {
        shipBlocks.forEach((block) => {
            block.classList.add(ship.name);
            block.classList.add("filled");
        });
    } else {
        if (user === "computer") addShip(ship);
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
}

function dropShip(e) {
    const startId = e.target.id;
    const ship = ships[draggedShip.id];
    addShip("player", ship, startId);
    if (!notDropped) draggedShip.remove();
}

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsTUFBTTtBQUMvQyxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixTQUFTO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0QsTUFBTTtBQUM1RCxzQ0FBc0M7QUFDdEM7QUFDQSxrRUFBa0U7QUFDbEUsOEJBQThCLGFBQWE7QUFDM0MsZ0NBQWdDLGlCQUFpQjtBQUNqRDtBQUNBO0FBQ0EsK0JBQStCLFdBQVc7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsV0FBVztBQUMxQztBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsaUJBQWlCO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLFFBQVE7QUFDeEM7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLFNBQVM7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAtcHJvamVjdC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBNQVJLIEZPUiBVSSBFTEVNRU5UUywgTUFLRSBUSEVNIFNFUEVSQVRFIE1PRFVMRVxyXG5cclxuLy8gQlVUVE9OIExPR0lDXHJcbmNvbnN0IGZsaXBCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZsaXAtYnV0dG9uXCIpO1xyXG5jb25zdCBzaGlwQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zaGlwLXNlbGVjdC1jb250YWluZXJcIik7XHJcblxyXG5mbGlwQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmbGlwU2hpcHMpO1xyXG5cclxubGV0IGFuZ2xlID0gMDtcclxuZnVuY3Rpb24gZmxpcFNoaXBzKCkge1xyXG4gICAgY29uc3Qgc2hpcHMgPSBBcnJheS5mcm9tKHNoaXBDb250YWluZXIuY2hpbGRyZW4pO1xyXG4gICAgYW5nbGUgPSBhbmdsZSA9PT0gMCA/IDkwIDogMDtcclxuICAgIHNoaXBzLmZvckVhY2goKHNoaXApID0+IHtcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cclxuICAgICAgICBzaGlwLnN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGUoJHthbmdsZX1kZWcpYDtcclxuICAgIH0pO1xyXG59XHJcblxyXG4vLyBDUkVBVElORyBHQU1FQk9BUkRcclxuZnVuY3Rpb24gY3JlYXRlQm9hcmQoY29sb3IsIHVzZXIpIHtcclxuICAgIGNvbnN0IGdhbWVCb2FyZENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZWJvYXJkLWNvbnRhaW5lclwiKTtcclxuXHJcbiAgICBjb25zdCBnYW1lQm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgZ2FtZUJvYXJkLnNldEF0dHJpYnV0ZShcImlkXCIsIHVzZXIpO1xyXG4gICAgZ2FtZUJvYXJkLmNsYXNzTGlzdC5hZGQoXCJnYW1lYm9hcmRcIik7XHJcbiAgICBnYW1lQm9hcmQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gY29sb3I7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDA7IGkgKz0gMSkge1xyXG4gICAgICAgIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBibG9jay5jbGFzc0xpc3QuYWRkKFwiYmxvY2tcIik7XHJcbiAgICAgICAgYmxvY2suaWQgPSBpO1xyXG4gICAgICAgIGdhbWVCb2FyZC5hcHBlbmQoYmxvY2spO1xyXG4gICAgfVxyXG5cclxuICAgIGdhbWVCb2FyZENvbnRhaW5lci5hcHBlbmRDaGlsZChnYW1lQm9hcmQpO1xyXG59XHJcblxyXG5jcmVhdGVCb2FyZChcIndoaXRlXCIsIFwicGxheWVyXCIpO1xyXG5jcmVhdGVCb2FyZChcImdhaW5zYm9yb1wiLCBcImNvbXB1dGVyXCIpO1xyXG5cclxuLy8gQ1JFQVRJTkcgU0hJUFNcclxuY2xhc3MgU2hpcCB7XHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBsZW5ndGgpIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBkZXN0cm95ZXIgPSBuZXcgU2hpcChcImRlc3Ryb3llclwiLCAyKTtcclxuY29uc3Qgc3VibWFyaW5lID0gbmV3IFNoaXAoXCJzdWJtYXJpbmVcIiwgMyk7XHJcbmNvbnN0IGNydWlzZXIgPSBuZXcgU2hpcChcImNydWlzZXJcIiwgMyk7XHJcbmNvbnN0IGJhdHRsZXNoaXAgPSBuZXcgU2hpcChcImJhdHRsZXNoaXBcIiwgNCk7XHJcbmNvbnN0IGNhcnJpZXIgPSBuZXcgU2hpcChcImNhcnJpZXJcIiwgNSk7XHJcblxyXG5jb25zdCBzaGlwcyA9IFtkZXN0cm95ZXIsIHN1Ym1hcmluZSwgY3J1aXNlciwgYmF0dGxlc2hpcCwgY2Fycmllcl07XHJcbmxldCBub3REcm9wcGVkO1xyXG5jb25zb2xlLmxvZyhzaGlwcyk7XHJcblxyXG5mdW5jdGlvbiBhZGRTaGlwKHVzZXIsIHNoaXAsIHN0YXJ0SWQpIHtcclxuICAgIGNvbnNvbGUubG9nKHVzZXIpO1xyXG4gICAgY29uc3QgYm9hcmRCbG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAjJHt1c2VyfSBkaXZgKTtcclxuICAgIGNvbnN0IGJvb2wgPSBNYXRoLnJhbmRvbSgpIDwgMC41OyAvLyByZXR1cm5lZCBudW1iZXIgZWl0aGVyIHdpbGwgYmUgYmlnZ2VyIHRoYW4gMC41IG9yIG5vdCBoZW5jZSB0aGUgcmFuZG9tIGJvb2xcclxuICAgIGNvbnN0IGlzSG9yaXpvbnRhbCA9IHVzZXIgPT09IFwicGxheWVyXCIgPyBhbmdsZSA9PT0gMCA6IGJvb2w7XHJcbiAgICBjb25zdCByYW5kb21TdGFydEluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAgKiAxMCk7IC8vIHRlbiB0aW1lcyB0ZW4gaXMgdGhlIHdpZHRoIG9mIHRoZSBib2FyZFxyXG4gICAgY29uc29sZS5sb2coYGhvcml6b250YWwgJHtpc0hvcml6b250YWx9YCk7XHJcbiAgICBjb25zb2xlLmxvZyhgcmFuZG9tIGluZGV4ICR7cmFuZG9tU3RhcnRJbmRleH1gKTtcclxuXHJcbiAgICBjb25zdCBzdGFydEluZGV4ID0gc3RhcnRJZCB8fCByYW5kb21TdGFydEluZGV4O1xyXG4gICAgY29uc29sZS5sb2coYHN0YXJ0IGluZGV4ICR7c3RhcnRJbmRleH1gKTtcclxuXHJcbiAgICAvLyB0byBwcmV2ZW50IHBsYWNpbmcgc2hpcHMgb2ZmIGJvYXJkXHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmVzdGVkLXRlcm5hcnlcclxuICAgIGNvbnN0IHZhbGlkU3RhcnQgPSBpc0hvcml6b250YWxcclxuICAgICAgICA/IHN0YXJ0SW5kZXggPD0gMTAgKiAxMCAtIHNoaXAubGVuZ3RoXHJcbiAgICAgICAgICAgID8gc3RhcnRJbmRleFxyXG4gICAgICAgICAgICA6IDEwICogMTAgLSBzaGlwLmxlbmd0aFxyXG4gICAgICAgIDogc3RhcnRJbmRleCA8PSAxMCAqIDEwIC0gMTAgKiBzaGlwLmxlbmd0aFxyXG4gICAgICAgID8gc3RhcnRJbmRleFxyXG4gICAgICAgIDogc3RhcnRJbmRleCAtIHNoaXAubGVuZ3RoICogMTAgKyAxMDtcclxuICAgIGNvbnNvbGUubG9nKGB2YWxpZGF0ZWQgaSAke3ZhbGlkU3RhcnR9YCk7XHJcblxyXG4gICAgY29uc3Qgc2hpcEJsb2NrcyA9IFtdO1xyXG4gICAgLy8gc2F2ZSB0aGUgaW5kZXhlcyBvZiBzaGlwcyB0byBhbiBhcnJheVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgaWYgKGlzSG9yaXpvbnRhbCkgc2hpcEJsb2Nrcy5wdXNoKGJvYXJkQmxvY2tzW051bWJlcih2YWxpZFN0YXJ0KSArIGldKTtcclxuICAgICAgICBlbHNlIHNoaXBCbG9ja3MucHVzaChib2FyZEJsb2Nrc1tOdW1iZXIodmFsaWRTdGFydCkgKyBpICogMTBdKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB2YWxpZGF0ZSBwbGFjZSB0byBwcmV2ZW50IHNoaXBzIGZyb20gc3BsaXR0aW5nXHJcbiAgICBsZXQgaXNWYWxpZDtcclxuICAgIGlmIChpc0hvcml6b250YWwpIHtcclxuICAgICAgICBzaGlwQmxvY2tzLmV2ZXJ5KFxyXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmV0dXJuLWFzc2lnblxyXG4gICAgICAgICAgICAoX2Jsb2NrLCBpbmRleCkgPT5cclxuICAgICAgICAgICAgICAgIChpc1ZhbGlkID1cclxuICAgICAgICAgICAgICAgICAgICBzaGlwQmxvY2tzWzBdLmlkICUgMTAgIT09XHJcbiAgICAgICAgICAgICAgICAgICAgMTAgLSAoc2hpcEJsb2Nrcy5sZW5ndGggLSAoaW5kZXggKyAxKSkpXHJcbiAgICAgICAgKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2hpcEJsb2Nrcy5ldmVyeShcclxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJldHVybi1hc3NpZ25cclxuICAgICAgICAgICAgKF9ibG9jaywgaW5kZXgpID0+XHJcbiAgICAgICAgICAgICAgICAoaXNWYWxpZCA9IHNoaXBCbG9ja3NbMF0uaWQgPCA5MCArICgxMCAqIGluZGV4ICsgMSkpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIC8vIGNvbnNvbGUubG9nKGBpcyB2YWxpZD8gJHtpc1ZhbGlkfWApO1xyXG4gICAgY29uc3Qgbm90VGFrZW4gPSBzaGlwQmxvY2tzLmV2ZXJ5KFxyXG4gICAgICAgIChibG9jaykgPT4gIWJsb2NrLmNsYXNzTGlzdC5jb250YWlucyhcImZpbGxlZFwiKVxyXG4gICAgKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKGBub3QgdGFrZW4/ICR7bm90VGFrZW59YCk7XHJcbiAgICBpZiAoaXNWYWxpZCAmJiBub3RUYWtlbikge1xyXG4gICAgICAgIHNoaXBCbG9ja3MuZm9yRWFjaCgoYmxvY2spID0+IHtcclxuICAgICAgICAgICAgYmxvY2suY2xhc3NMaXN0LmFkZChzaGlwLm5hbWUpO1xyXG4gICAgICAgICAgICBibG9jay5jbGFzc0xpc3QuYWRkKFwiZmlsbGVkXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAodXNlciA9PT0gXCJjb21wdXRlclwiKSBhZGRTaGlwKHNoaXApO1xyXG4gICAgICAgIGlmICh1c2VyID09PSBcInBsYXllclwiKSBub3REcm9wcGVkID0gdHJ1ZTtcclxuICAgIH1cclxufVxyXG4vLyBhZGRTaGlwKGRlc3Ryb3llcik7XHJcbi8vIGFkZFNoaXAoc3VibWFyaW5lKTtcclxuLy8gYWRkU2hpcChjcnVpc2VyKTtcclxuLy8gYWRkU2hpcChiYXR0bGVzaGlwKTtcclxuLy8gYWRkU2hpcChcImNvbXB1dGVyXCIsIGNhcnJpZXIpO1xyXG5zaGlwcy5mb3JFYWNoKChzaGlwKSA9PiBhZGRTaGlwKFwiY29tcHV0ZXJcIiwgc2hpcCkpO1xyXG5cclxuLy8gRFJBRyZEUk9QIFBMQVlFUiBTSElQU1xyXG5sZXQgZHJhZ2dlZFNoaXA7XHJcbmNvbnN0IHNoaXBPcHRpb25zID0gQXJyYXkuZnJvbShzaGlwQ29udGFpbmVyLmNoaWxkcmVuKTtcclxuc2hpcE9wdGlvbnMuZm9yRWFjaCgoc2hpcCkgPT4gc2hpcC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ3N0YXJ0XCIsIGRyYWdTdGFydCkpO1xyXG5cclxuY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI3BsYXllciBkaXZcIik7XHJcbnBsYXllckJvYXJkLmZvckVhY2goKGJsb2NrKSA9PiB7XHJcbiAgICBibG9jay5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgZHJhZ092ZXIpO1xyXG4gICAgYmxvY2suYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgZHJvcFNoaXApO1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGRyYWdTdGFydChlKSB7XHJcbiAgICBub3REcm9wcGVkID0gZmFsc2U7XHJcbiAgICBkcmFnZ2VkU2hpcCA9IGUudGFyZ2V0O1xyXG4gICAgY29uc29sZS5sb2coZHJhZ2dlZFNoaXApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmFnT3ZlcihlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyb3BTaGlwKGUpIHtcclxuICAgIGNvbnN0IHN0YXJ0SWQgPSBlLnRhcmdldC5pZDtcclxuICAgIGNvbnN0IHNoaXAgPSBzaGlwc1tkcmFnZ2VkU2hpcC5pZF07XHJcbiAgICBhZGRTaGlwKFwicGxheWVyXCIsIHNoaXAsIHN0YXJ0SWQpO1xyXG4gICAgaWYgKCFub3REcm9wcGVkKSBkcmFnZ2VkU2hpcC5yZW1vdmUoKTtcclxufVxyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=