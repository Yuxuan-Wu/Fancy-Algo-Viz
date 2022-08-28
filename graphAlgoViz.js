import { navBar, graphAlgoControlPanel, startIcon, destinationIcon } from "./main.js";

//TODO
//tutorial

/**
 * Variable declaration and initialization
 * =======================================
 */
const bodyElement = document.querySelector("body");
const homeBtn = document.querySelector("#graph-algo-home");
const findPathBtn = document.querySelector("#graph-algo-find-path");
const createWallBtn = document.querySelector("#graph-algo-create-wall");
const resetGridBtn = document.querySelector("#graph-algo-reset");
const algoSelectMenu = document.querySelector("#graph-algo-menu");
const pathfindingSpeedMenu = document.querySelector("#pathfinding-speed-menu");
const pathfindintInProgressBanner = document.querySelector("#pathfinding-in-progress-banner");

var gridBoard;
var boardWidth = undefined;
var boardHeight = undefined;
var rows = undefined;
var cols = undefined;
var boxes = undefined;
var dragged = undefined;
var creatingWall = undefined;

export function initializeGridBoard() {
    boardWidth = window.innerWidth;
    boardHeight = window.innerHeight - navBar.offsetHeight;
    rows = Math.floor(boardHeight / 30);
    cols = Math.floor(boardWidth / 30);
    boxes = [];
    dragged = null;
    creatingWall = false;

    //set the size of gridBoard According to the user's screen size
    gridBoard.style.width = boardWidth;
    gridBoard.style.height = `${boardHeight}px`;
}

/**
 * Bind event listeners
 * ====================
 */
document.addEventListener("dragstart", (event) => {
    //store a reference on the dragged element
    dragged = event.target;
    //prevent the user from creating wall while dragging
    creatingWall = false;
});

document.addEventListener("dragover", (event) => {
    //prevent default to allow drop
    event.preventDefault();
});

document.addEventListener("drop", (event) => {
    //prevent default action (open as link for some elements)
    event.preventDefault();

    let target = event.target;
    //can only be dropped upon when the target element is a box
    if (target.tagName == "LI") {
        dragged.parentNode.setAttribute("value", "blank");
        dragged.parentNode.style.backgroundColor = "#cccccc";
        dragged.parentNode.removeChild(dragged);

        target.appendChild(dragged);
        getNeighbors(target);
        target.setAttribute("value", dragged.dataset.value);
        target.style.backgroundColor = dragged.dataset.color;
    }
});

document.addEventListener("mousedown", function () {
    creatingWall = true;
});

document.addEventListener("mouseup", function () {
    creatingWall = false;
});

homeBtn.addEventListener("click", homeBtnListener, true);
function homeBtnListener() {
    gridBoard.remove();
    graphAlgoControlPanel.style.display = "none";
    navBar.style.display = "block";
}

resetGridBtn.addEventListener("click", resetGridBtnListener, true);
function resetGridBtnListener() {
    //reset settings
    createWallBtn.value = 0;
    createWallBtn.style.backgroundColor = "rgb(41, 42, 47)";

    //reset grid
    gridBoard.innerHTML = "";
    initializeGridBoard();
    populateGrid();
}

createWallBtn.addEventListener("click", createWallBtnListener, true);
function createWallBtnListener() {
    createWallBtn.value ^= true;
    if (createWallBtn.value == true) {
        createWallBtn.style.backgroundColor = "#f44336";
    }
    else {
        createWallBtn.style.backgroundColor = "rgb(41, 42, 47)";
    }
};

findPathBtn.addEventListener("click", findPathBtnListener, true);
async function findPathBtnListener(event) {
    //before a solution was found
    graphAlgoControlPanel.style.display = "none";
    createWallBtn.value = 0;
    createWallBtn.style.backgroundColor = "rgb(41, 42, 47)";
    pathfindintInProgressBanner.style.display = "block";
    gridBoard.scrollIntoView({behavior: "smooth"});

    //path-finding in progress
    switch (algoSelectMenu.value) {
        case "bfs":
            await bfsFindPath();
            break;
        case "dfs":
            await dfsFindPath();
            break;
    }

    await showPath();

    //after a solution is found
    pathfindintInProgressBanner.style.display = "none";
    graphAlgoControlPanel.style.display = "block";
    graphAlgoControlPanel.scrollIntoView({behavior: "smooth"});
}

/**
 * Grid operations
 * ===============
 */
export function createGrid() {
    gridBoard = document.createElement("ul");
    gridBoard.setAttribute("id", "grid-board");
    bodyElement.appendChild(gridBoard);
}

export function populateGrid() {
    //set the grid's size adaptively to the user's screen
    gridBoard.style.setProperty("--rows", rows);
    gridBoard.style.setProperty("--cols", cols);

    let boxGroup = [];

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let gridBox;
            //attach the gridbox to gridboard
            gridBox = document.createElement("li");
            gridBox.classList.add("grid-box");
            gridBox.setAttribute("value", "blank");
            gridBox.setAttribute("id", i * cols + j);
            gridBox.setAttribute("previous", "");

            //attach event handlers to each gridbox
            gridBox.addEventListener("mouseover", function () {
                //if create wall button is active and user's mouse is down
                if (createWallBtn.value == true && creatingWall) {
                    setAsWall(gridBox);
                }
            });

            gridBox.addEventListener("click", function () {
                destructWall(gridBox);
            });

            gridBoard.appendChild(gridBox);

            boxGroup.push(gridBox);
        }
        boxes.push(boxGroup);
        boxGroup = [];
    }

    let startBox = boxes[Math.floor(rows / 2)][Math.floor(cols / 3)];
    let finishBox = boxes[Math.floor(rows / 2)][Math.floor((cols * 2) / 3)];
    initializeStartFinish(startBox, finishBox);
}

function initializeStartFinish(start, finish) {
    start.appendChild(startIcon);
    start.setAttribute("value", startIcon.dataset.value);
    start.style.backgroundColor = startIcon.dataset.color;

    finish.appendChild(destinationIcon);
    finish.setAttribute("value", destinationIcon.dataset.value);
    finish.style.backgroundColor = destinationIcon.dataset.color;
}

function findIconPosition(icon) {
    let boxId = icon.parentNode.id;
    return document.getElementById(boxId);
}

/**
 * Graph algorithms for path finding
 * =================================
 */
async function bfsFindPath() {
    let queue = [];
    let start = findIconPosition(startIcon), finish = findIconPosition(destinationIcon);

    queue.push(start);
    visit(start);
    let curr, neighbors, tempElement;

    while (queue.length !== 0) {
        curr = queue.shift();

        //if the curr is finish
        if (curr.id == finish.id) {
            return curr;
        }
        else {
            //for each neighbors to curr, get their id
            neighbors = getNeighbors(curr);
            for (var i = 0; i < neighbors.length; i++) {
                //a neighbor is valid if its id is >= 0
                if (neighbors[i] >= 0) {
                    tempElement = document.getElementById(neighbors[i]);
                    visit(tempElement);
                    tempElement.setAttribute("previous", curr.id);
                    if (neighbors[i] == finish.id) {
                        return curr;
                    }
                    queue.push(tempElement);
                    await sleep(pathfindingSpeedMenu.value);
                }
            }
        }
    }

    return null;
}

async function dfsFindPath() {
    let stack = [];
    let start = findIconPosition(startIcon), finish = findIconPosition(destinationIcon);

    stack.push(start);
    visit(start);
    let curr, neighbors, tempElement;

    while (stack.length !== 0) {
        curr = stack.pop();

        //if the curr is finish
        if (curr.id == finish.id) {
            return curr;
        }
        else {
            //for each neighbors to curr, get their id
            neighbors = getNeighbors(curr);
            for (var i = 0; i < neighbors.length; i++) {
                //a neighbor is valid if its id is >= 0
                if (neighbors[i] >= 0) {
                    tempElement = document.getElementById(neighbors[i]);
                    visit(tempElement);
                    tempElement.setAttribute("previous", curr.id);
                    if (neighbors[i] == finish.id) {
                        return curr;
                    }
                    stack.push(tempElement);
                    await sleep(pathfindingSpeedMenu.value);
                }
            }
        }
    }

    return null;
}

async function showPath() {
    let path = [];
    let start = findIconPosition(startIcon), finish = findIconPosition(destinationIcon);
    let curr = finish;
    let previousID = undefined;

    path.push(curr);
    previousID = parseInt(curr.getAttribute("previous"));

    while (curr.getAttribute("previous") !== "") {
        previousID = parseInt(curr.getAttribute("previous"));
        curr = document.getElementById(previousID);
        path.push(curr);
    }

    //if a path exists
    if (path.includes(start)) {
        for (var i = path.length - 1; i >= 0; i--) {
            await sleep(pathfindingSpeedMenu.value);
            markAsPath(path[i]);
        }
    }

    //recover the color coding for start and finish 
    await sleep(10 * pathfindingSpeedMenu.value);
    start.style.backgroundColor = startIcon.dataset.color;
    finish.style.backgroundColor = destinationIcon.dataset.color;
}

/**
 * GridBox operations
 * ==================
 */
function visit(element) {
    element.setAttribute("value", "visited");
    element.style.backgroundColor = "#4f4f4f";
}

function markAsPath(element) {
    element.style.backgroundColor = "#008CBA";
}

function setAsWall(element) {
    let start = findIconPosition(startIcon), finish = findIconPosition(destinationIcon);
    if (element == start || element == finish) {
        return;
    }
    element.setAttribute("value", "wall");
    element.style.backgroundColor = "#f44336";
}

function destructWall(element) {
    if (element.getAttribute("value") === "wall") {
        element.setAttribute("value", "blank");
        element.style.backgroundColor = "#cccccc";
    }
}

function getNeighbors(element) {
    let id = parseInt(element.id);
    let row = Math.floor(id / cols);
    let col = id % cols;
    let result = [];

    //top right bottom left
    result.push(isValidPath(id - cols, row - 1, col));
    result.push(isValidPath(id + 1, row, col + 1));
    result.push(isValidPath(id + cols, row + 1, col));
    result.push(isValidPath(id - 1, row, col - 1));

    return result;
}

function isValidPath(id, row, col) {
    if (row >= rows
        || col >= cols
        || row < 0
        || col < 0) {
        return -1;
    }

    let element = document.getElementById(id);
    let value = element.getAttribute("value");
    if (value === "wall" || value === "visited") {
        return -1;
    }

    return id;
}

/**
 * Auxiliary Functions
 * ===================
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
