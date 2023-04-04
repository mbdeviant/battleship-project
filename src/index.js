// MARK FOR UI ELEMENTS, MAKE THEM SEPERATE MODULE
const flipButton = document.getElementById("flip-button");
const shipContainer = document.querySelector(".ship-option-container");

flipButton.addEventListener("click", flipShips);

function flipShips() {
    const ships = Array.from(shipContainer.children);
    ships.forEach((ship) => {
        // eslint-disable-next-line no-param-reassign
        ship.style.transform = `rotate(90deg)`;
    });
}
