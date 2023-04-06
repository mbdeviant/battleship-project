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

createBoard("white", "player1");
createBoard("gainsboro", "player2");

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
console.log(ships);

function addShip(ship) {
    const boardBlocks = document.querySelectorAll("#player2 div");
    const bool = Math.random() < 0.5; // returned number either will be bigger than 0.5 or not hence the random bool
    const isHorizontal = bool;
    const startIndex = Math.floor(Math.random() * 10 * 10); // ten times ten is the width of the board
    console.log(`horizontal ${isHorizontal}`);
    console.log(`random index ${startIndex}`);
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
    for (let i = 0; i < ship.length; i += 1) {
        if (isHorizontal) shipBlocks.push(boardBlocks[Number(validStart) + i]);
        else shipBlocks.push(boardBlocks[Number(validStart) + i * 10]);
    }

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
    console.log(`is valid? ${isValid}`);
    const notTaken = shipBlocks.every(
        (block) => !block.classList.contains("filled")
    );
    console.log(`not taken? ${notTaken}`);
    if (isValid && notTaken) {
        shipBlocks.forEach((block) => {
            block.classList.add(ship.name);
            block.classList.add("filled");
        });
    } else addShip(ship);
}
// addShip(destroyer);
// addShip(submarine);
// addShip(cruiser);
// addShip(battleship);
// addShip(carrier);
ships.forEach((ship) => addShip(ship));

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsTUFBTTtBQUMvQyxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixTQUFTO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0EsNERBQTREO0FBQzVELDhCQUE4QixhQUFhO0FBQzNDLGdDQUFnQyxXQUFXO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixXQUFXO0FBQzFDO0FBQ0Esb0JBQW9CLGlCQUFpQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsUUFBUTtBQUNyQztBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsU0FBUztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLXByb2plY3QvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gTUFSSyBGT1IgVUkgRUxFTUVOVFMsIE1BS0UgVEhFTSBTRVBFUkFURSBNT0RVTEVcclxuXHJcbi8vIEJVVFRPTiBMT0dJQ1xyXG5jb25zdCBmbGlwQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmbGlwLWJ1dHRvblwiKTtcclxuY29uc3Qgc2hpcENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2hpcC1zZWxlY3QtY29udGFpbmVyXCIpO1xyXG5cclxuZmxpcEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZmxpcFNoaXBzKTtcclxuXHJcbmxldCBhbmdsZSA9IDA7XHJcbmZ1bmN0aW9uIGZsaXBTaGlwcygpIHtcclxuICAgIGNvbnN0IHNoaXBzID0gQXJyYXkuZnJvbShzaGlwQ29udGFpbmVyLmNoaWxkcmVuKTtcclxuICAgIGFuZ2xlID0gYW5nbGUgPT09IDAgPyA5MCA6IDA7XHJcbiAgICBzaGlwcy5mb3JFYWNoKChzaGlwKSA9PiB7XHJcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXHJcbiAgICAgICAgc2hpcC5zdHlsZS50cmFuc2Zvcm0gPSBgcm90YXRlKCR7YW5nbGV9ZGVnKWA7XHJcbiAgICB9KTtcclxufVxyXG5cclxuLy8gQ1JFQVRJTkcgR0FNRUJPQVJEXHJcbmZ1bmN0aW9uIGNyZWF0ZUJvYXJkKGNvbG9yLCB1c2VyKSB7XHJcbiAgICBjb25zdCBnYW1lQm9hcmRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWVib2FyZC1jb250YWluZXJcIik7XHJcblxyXG4gICAgY29uc3QgZ2FtZUJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGdhbWVCb2FyZC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB1c2VyKTtcclxuICAgIGdhbWVCb2FyZC5jbGFzc0xpc3QuYWRkKFwiZ2FtZWJvYXJkXCIpO1xyXG4gICAgZ2FtZUJvYXJkLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwOyBpICs9IDEpIHtcclxuICAgICAgICBjb25zdCBibG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgYmxvY2suY2xhc3NMaXN0LmFkZChcImJsb2NrXCIpO1xyXG4gICAgICAgIGJsb2NrLmlkID0gaTtcclxuICAgICAgICBnYW1lQm9hcmQuYXBwZW5kKGJsb2NrKTtcclxuICAgIH1cclxuXHJcbiAgICBnYW1lQm9hcmRDb250YWluZXIuYXBwZW5kQ2hpbGQoZ2FtZUJvYXJkKTtcclxufVxyXG5cclxuY3JlYXRlQm9hcmQoXCJ3aGl0ZVwiLCBcInBsYXllcjFcIik7XHJcbmNyZWF0ZUJvYXJkKFwiZ2FpbnNib3JvXCIsIFwicGxheWVyMlwiKTtcclxuXHJcbi8vIENSRUFUSU5HIFNISVBTXHJcbmNsYXNzIFNoaXAge1xyXG4gICAgY29uc3RydWN0b3IobmFtZSwgbGVuZ3RoKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgZGVzdHJveWVyID0gbmV3IFNoaXAoXCJkZXN0cm95ZXJcIiwgMik7XHJcbmNvbnN0IHN1Ym1hcmluZSA9IG5ldyBTaGlwKFwic3VibWFyaW5lXCIsIDMpO1xyXG5jb25zdCBjcnVpc2VyID0gbmV3IFNoaXAoXCJjcnVpc2VyXCIsIDMpO1xyXG5jb25zdCBiYXR0bGVzaGlwID0gbmV3IFNoaXAoXCJiYXR0bGVzaGlwXCIsIDQpO1xyXG5jb25zdCBjYXJyaWVyID0gbmV3IFNoaXAoXCJjYXJyaWVyXCIsIDUpO1xyXG5cclxuY29uc3Qgc2hpcHMgPSBbZGVzdHJveWVyLCBzdWJtYXJpbmUsIGNydWlzZXIsIGJhdHRsZXNoaXAsIGNhcnJpZXJdO1xyXG5jb25zb2xlLmxvZyhzaGlwcyk7XHJcblxyXG5mdW5jdGlvbiBhZGRTaGlwKHNoaXApIHtcclxuICAgIGNvbnN0IGJvYXJkQmxvY2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNwbGF5ZXIyIGRpdlwiKTtcclxuICAgIGNvbnN0IGJvb2wgPSBNYXRoLnJhbmRvbSgpIDwgMC41OyAvLyByZXR1cm5lZCBudW1iZXIgZWl0aGVyIHdpbGwgYmUgYmlnZ2VyIHRoYW4gMC41IG9yIG5vdCBoZW5jZSB0aGUgcmFuZG9tIGJvb2xcclxuICAgIGNvbnN0IGlzSG9yaXpvbnRhbCA9IGJvb2w7XHJcbiAgICBjb25zdCBzdGFydEluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAgKiAxMCk7IC8vIHRlbiB0aW1lcyB0ZW4gaXMgdGhlIHdpZHRoIG9mIHRoZSBib2FyZFxyXG4gICAgY29uc29sZS5sb2coYGhvcml6b250YWwgJHtpc0hvcml6b250YWx9YCk7XHJcbiAgICBjb25zb2xlLmxvZyhgcmFuZG9tIGluZGV4ICR7c3RhcnRJbmRleH1gKTtcclxuICAgIC8vIHRvIHByZXZlbnQgcGxhY2luZyBzaGlwcyBvZmYgYm9hcmRcclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXN0ZWQtdGVybmFyeVxyXG4gICAgY29uc3QgdmFsaWRTdGFydCA9IGlzSG9yaXpvbnRhbFxyXG4gICAgICAgID8gc3RhcnRJbmRleCA8PSAxMCAqIDEwIC0gc2hpcC5sZW5ndGhcclxuICAgICAgICAgICAgPyBzdGFydEluZGV4XHJcbiAgICAgICAgICAgIDogMTAgKiAxMCAtIHNoaXAubGVuZ3RoXHJcbiAgICAgICAgOiBzdGFydEluZGV4IDw9IDEwICogMTAgLSAxMCAqIHNoaXAubGVuZ3RoXHJcbiAgICAgICAgPyBzdGFydEluZGV4XHJcbiAgICAgICAgOiBzdGFydEluZGV4IC0gc2hpcC5sZW5ndGggKiAxMCArIDEwO1xyXG4gICAgY29uc29sZS5sb2coYHZhbGlkYXRlZCBpICR7dmFsaWRTdGFydH1gKTtcclxuICAgIGNvbnN0IHNoaXBCbG9ja3MgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIGlmIChpc0hvcml6b250YWwpIHNoaXBCbG9ja3MucHVzaChib2FyZEJsb2Nrc1tOdW1iZXIodmFsaWRTdGFydCkgKyBpXSk7XHJcbiAgICAgICAgZWxzZSBzaGlwQmxvY2tzLnB1c2goYm9hcmRCbG9ja3NbTnVtYmVyKHZhbGlkU3RhcnQpICsgaSAqIDEwXSk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGlzVmFsaWQ7XHJcbiAgICBpZiAoaXNIb3Jpem9udGFsKSB7XHJcbiAgICAgICAgc2hpcEJsb2Nrcy5ldmVyeShcclxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJldHVybi1hc3NpZ25cclxuICAgICAgICAgICAgKF9ibG9jaywgaW5kZXgpID0+XHJcbiAgICAgICAgICAgICAgICAoaXNWYWxpZCA9XHJcbiAgICAgICAgICAgICAgICAgICAgc2hpcEJsb2Nrc1swXS5pZCAlIDEwICE9PVxyXG4gICAgICAgICAgICAgICAgICAgIDEwIC0gKHNoaXBCbG9ja3MubGVuZ3RoIC0gKGluZGV4ICsgMSkpKVxyXG4gICAgICAgICk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNoaXBCbG9ja3MuZXZlcnkoXHJcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXR1cm4tYXNzaWduXHJcbiAgICAgICAgICAgIChfYmxvY2ssIGluZGV4KSA9PlxyXG4gICAgICAgICAgICAgICAgKGlzVmFsaWQgPSBzaGlwQmxvY2tzWzBdLmlkIDwgOTAgKyAoMTAgKiBpbmRleCArIDEpKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmxvZyhgaXMgdmFsaWQ/ICR7aXNWYWxpZH1gKTtcclxuICAgIGNvbnN0IG5vdFRha2VuID0gc2hpcEJsb2Nrcy5ldmVyeShcclxuICAgICAgICAoYmxvY2spID0+ICFibG9jay5jbGFzc0xpc3QuY29udGFpbnMoXCJmaWxsZWRcIilcclxuICAgICk7XHJcbiAgICBjb25zb2xlLmxvZyhgbm90IHRha2VuPyAke25vdFRha2VufWApO1xyXG4gICAgaWYgKGlzVmFsaWQgJiYgbm90VGFrZW4pIHtcclxuICAgICAgICBzaGlwQmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PiB7XHJcbiAgICAgICAgICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoc2hpcC5uYW1lKTtcclxuICAgICAgICAgICAgYmxvY2suY2xhc3NMaXN0LmFkZChcImZpbGxlZFwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSBhZGRTaGlwKHNoaXApO1xyXG59XHJcbi8vIGFkZFNoaXAoZGVzdHJveWVyKTtcclxuLy8gYWRkU2hpcChzdWJtYXJpbmUpO1xyXG4vLyBhZGRTaGlwKGNydWlzZXIpO1xyXG4vLyBhZGRTaGlwKGJhdHRsZXNoaXApO1xyXG4vLyBhZGRTaGlwKGNhcnJpZXIpO1xyXG5zaGlwcy5mb3JFYWNoKChzaGlwKSA9PiBhZGRTaGlwKHNoaXApKTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9