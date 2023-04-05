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

    const notTaken = shipBlocks.every(
        (block) => !block.classList.contains("filled")
    );
    if (isValid && notTaken) {
        shipBlocks.forEach((block) => {
            block.classList.add(ship.name);
            block.classList.add("filled");
        });
    }
}

// addShip(destroyer);
ships.forEach((ship) => addShip(ship));

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsTUFBTTtBQUMvQyxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixTQUFTO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0EsNERBQTREO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixpQkFBaUI7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1wcm9qZWN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIE1BUksgRk9SIFVJIEVMRU1FTlRTLCBNQUtFIFRIRU0gU0VQRVJBVEUgTU9EVUxFXHJcblxyXG4vLyBCVVRUT04gTE9HSUNcclxuY29uc3QgZmxpcEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmxpcC1idXR0b25cIik7XHJcbmNvbnN0IHNoaXBDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNoaXAtc2VsZWN0LWNvbnRhaW5lclwiKTtcclxuXHJcbmZsaXBCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZsaXBTaGlwcyk7XHJcblxyXG5sZXQgYW5nbGUgPSAwO1xyXG5mdW5jdGlvbiBmbGlwU2hpcHMoKSB7XHJcbiAgICBjb25zdCBzaGlwcyA9IEFycmF5LmZyb20oc2hpcENvbnRhaW5lci5jaGlsZHJlbik7XHJcbiAgICBhbmdsZSA9IGFuZ2xlID09PSAwID8gOTAgOiAwO1xyXG4gICAgc2hpcHMuZm9yRWFjaCgoc2hpcCkgPT4ge1xyXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxyXG4gICAgICAgIHNoaXAuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZSgke2FuZ2xlfWRlZylgO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8vIENSRUFUSU5HIEdBTUVCT0FSRFxyXG5mdW5jdGlvbiBjcmVhdGVCb2FyZChjb2xvciwgdXNlcikge1xyXG4gICAgY29uc3QgZ2FtZUJvYXJkQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lYm9hcmQtY29udGFpbmVyXCIpO1xyXG5cclxuICAgIGNvbnN0IGdhbWVCb2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBnYW1lQm9hcmQuc2V0QXR0cmlidXRlKFwiaWRcIiwgdXNlcik7XHJcbiAgICBnYW1lQm9hcmQuY2xhc3NMaXN0LmFkZChcImdhbWVib2FyZFwiKTtcclxuICAgIGdhbWVCb2FyZC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvcjtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwMDsgaSArPSAxKSB7XHJcbiAgICAgICAgY29uc3QgYmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoXCJibG9ja1wiKTtcclxuICAgICAgICBibG9jay5pZCA9IGk7XHJcbiAgICAgICAgZ2FtZUJvYXJkLmFwcGVuZChibG9jayk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2FtZUJvYXJkQ29udGFpbmVyLmFwcGVuZENoaWxkKGdhbWVCb2FyZCk7XHJcbn1cclxuXHJcbmNyZWF0ZUJvYXJkKFwid2hpdGVcIiwgXCJwbGF5ZXIxXCIpO1xyXG5jcmVhdGVCb2FyZChcImdhaW5zYm9yb1wiLCBcInBsYXllcjJcIik7XHJcblxyXG4vLyBDUkVBVElORyBTSElQU1xyXG5jbGFzcyBTaGlwIHtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGxlbmd0aCkge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGRlc3Ryb3llciA9IG5ldyBTaGlwKFwiZGVzdHJveWVyXCIsIDIpO1xyXG5jb25zdCBzdWJtYXJpbmUgPSBuZXcgU2hpcChcInN1Ym1hcmluZVwiLCAzKTtcclxuY29uc3QgY3J1aXNlciA9IG5ldyBTaGlwKFwiY3J1aXNlclwiLCAzKTtcclxuY29uc3QgYmF0dGxlc2hpcCA9IG5ldyBTaGlwKFwiYmF0dGxlc2hpcFwiLCA0KTtcclxuY29uc3QgY2FycmllciA9IG5ldyBTaGlwKFwiY2FycmllclwiLCA1KTtcclxuXHJcbmNvbnN0IHNoaXBzID0gW2Rlc3Ryb3llciwgc3VibWFyaW5lLCBjcnVpc2VyLCBiYXR0bGVzaGlwLCBjYXJyaWVyXTtcclxuY29uc29sZS5sb2coc2hpcHMpO1xyXG5cclxuZnVuY3Rpb24gYWRkU2hpcChzaGlwKSB7XHJcbiAgICBjb25zdCBib2FyZEJsb2NrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjcGxheWVyMiBkaXZcIik7XHJcbiAgICBjb25zdCBib29sID0gTWF0aC5yYW5kb20oKSA8IDAuNTsgLy8gcmV0dXJuZWQgbnVtYmVyIGVpdGhlciB3aWxsIGJlIGJpZ2dlciB0aGFuIDAuNSBvciBub3QgaGVuY2UgdGhlIHJhbmRvbSBib29sXHJcbiAgICBjb25zdCBpc0hvcml6b250YWwgPSBib29sO1xyXG4gICAgY29uc3Qgc3RhcnRJbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwICogMTApOyAvLyB0ZW4gdGltZXMgdGVuIGlzIHRoZSB3aWR0aCBvZiB0aGUgYm9hcmRcclxuXHJcbiAgICAvLyB0byBwcmV2ZW50IHBsYWNpbmcgc2hpcHMgb2ZmIGJvYXJkXHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmVzdGVkLXRlcm5hcnlcclxuICAgIGNvbnN0IHZhbGlkU3RhcnQgPSBpc0hvcml6b250YWxcclxuICAgICAgICA/IHN0YXJ0SW5kZXggPD0gMTAgKiAxMCAtIHNoaXAubGVuZ3RoXHJcbiAgICAgICAgICAgID8gc3RhcnRJbmRleFxyXG4gICAgICAgICAgICA6IDEwICogMTAgLSBzaGlwLmxlbmd0aFxyXG4gICAgICAgIDogc3RhcnRJbmRleCA8PSAxMCAqIDEwIC0gMTAgKiBzaGlwLmxlbmd0aFxyXG4gICAgICAgID8gc3RhcnRJbmRleFxyXG4gICAgICAgIDogc3RhcnRJbmRleCAtIHNoaXAubGVuZ3RoICogMTAgKyAxMDtcclxuXHJcbiAgICBjb25zdCBzaGlwQmxvY2tzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICBpZiAoaXNIb3Jpem9udGFsKSBzaGlwQmxvY2tzLnB1c2goYm9hcmRCbG9ja3NbTnVtYmVyKHZhbGlkU3RhcnQpICsgaV0pO1xyXG4gICAgICAgIGVsc2Ugc2hpcEJsb2Nrcy5wdXNoKGJvYXJkQmxvY2tzW051bWJlcih2YWxpZFN0YXJ0KSArIGkgKiAxMF0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBpc1ZhbGlkO1xyXG4gICAgaWYgKGlzSG9yaXpvbnRhbCkge1xyXG4gICAgICAgIHNoaXBCbG9ja3MuZXZlcnkoXHJcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXR1cm4tYXNzaWduXHJcbiAgICAgICAgICAgIChfYmxvY2ssIGluZGV4KSA9PlxyXG4gICAgICAgICAgICAgICAgKGlzVmFsaWQgPVxyXG4gICAgICAgICAgICAgICAgICAgIHNoaXBCbG9ja3NbMF0uaWQgJSAxMCAhPT1cclxuICAgICAgICAgICAgICAgICAgICAxMCAtIChzaGlwQmxvY2tzLmxlbmd0aCAtIChpbmRleCArIDEpKSlcclxuICAgICAgICApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBzaGlwQmxvY2tzLmV2ZXJ5KFxyXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmV0dXJuLWFzc2lnblxyXG4gICAgICAgICAgICAoX2Jsb2NrLCBpbmRleCkgPT5cclxuICAgICAgICAgICAgICAgIChpc1ZhbGlkID0gc2hpcEJsb2Nrc1swXS5pZCA8IDkwICsgKDEwICogaW5kZXggKyAxKSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG5vdFRha2VuID0gc2hpcEJsb2Nrcy5ldmVyeShcclxuICAgICAgICAoYmxvY2spID0+ICFibG9jay5jbGFzc0xpc3QuY29udGFpbnMoXCJmaWxsZWRcIilcclxuICAgICk7XHJcbiAgICBpZiAoaXNWYWxpZCAmJiBub3RUYWtlbikge1xyXG4gICAgICAgIHNoaXBCbG9ja3MuZm9yRWFjaCgoYmxvY2spID0+IHtcclxuICAgICAgICAgICAgYmxvY2suY2xhc3NMaXN0LmFkZChzaGlwLm5hbWUpO1xyXG4gICAgICAgICAgICBibG9jay5jbGFzc0xpc3QuYWRkKFwiZmlsbGVkXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBhZGRTaGlwKGRlc3Ryb3llcik7XHJcbnNoaXBzLmZvckVhY2goKHNoaXApID0+IGFkZFNoaXAoc2hpcCkpO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=