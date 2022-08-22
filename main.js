/**
 * Local imports
 * =============
 */
import * as Firework from "./firework.js";
//import * as NodeViz from "./nodeViz.js";

/**
 * Variable declaration and initialization
 * =======================================
 */
var currApp;

/**
 * HTML element
 * ============
 */
const homeBtn = document.querySelector("#home");
const backgroundMusic = document.querySelector("#background-music");
const physicsSim = document.querySelector("#physicsSim");
const navBar = document.querySelector("#navbar");

/**
 * Canvas settings
 * =============
 */
const canvas = document.querySelector("#canvas");
export const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - navBar.offsetHeight;

const frameRate = 144.0;
const frameDelay = 1000.0 / frameRate;

/**
 * Bind event listeners
 * ====================
 */
homeBtn.addEventListener("click", function () {
    backgroundMusic.play();

    ceaseCurrentProcess();
});

physicsSim.addEventListener("click", function () {
    ceaseCurrentProcess();

    canvas.style.display = "block";
    Firework.bindEventlisteners();

    //start the rendering process for firework
    currApp = setInterval(function () {
        Firework.update(frameDelay);
    }, frameDelay);
});

/**
 * Controller functions
 * ==================== 
 */
function ceaseCurrentProcess() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    canvas.style.display = "none";
    //remove eventlisteners for all applications
    Firework.removeEventlisteners();

    clearInterval(currApp);
    window.cancelAnimationFrame(currApp);
}

//TODO
//Separate pull down menu
//tutorial

//First data structure: linked list
//functions: prepend, append, delete(curr), get curr, pointer indication (highlight the node), change value for a curr, next 

//NodeViz.createNode(200, 400, 1);
//NodeViz.createNode(300, 400, 2);

//NodeViz.bindEventlisteners();

//NodeViz.animate();


/**
 * Variable declaration and initialization
 * =======================================
 */
const gridBoard = document.querySelector("#grid-board");
const findPathBtn = document.querySelector("#find-path-button");
const startIcon = document.querySelector("#start-icon");
const destinationIcon = document.querySelector("#destination-icon");
var boardWidth = window.innerWidth;
var boardHeight = window.innerHeight - navBar.offsetHeight - 10;
var rows = Math.floor(boardHeight / 30);
var cols = Math.floor(boardWidth / 30);
var boxes = [];
var dragged = null;

//set the size of gridBoard According to the user's screen size
gridBoard.style.width = boardWidth;
gridBoard.style.height = `${boardHeight}px`;

/**
 * Bind event listeners
 * ====================
 */
document.addEventListener("dragstart", (event) => {
    //store a ref. on the dragged elem
    dragged = event.target;
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
        getNeighbors(target)
        target.setAttribute("value", dragged.dataset.value);
        target.style.backgroundColor = dragged.dataset.color;
    }
});

findPathBtn.addEventListener("click", findPathBtnListener, true);

async function findPathBtnListener(event) {
    await dfsFindPath();
    showPath();
}

/**
 * Grid operations
 * ===============
 */
function populateGrid() {
    //set the grid's size  adaptively to the user's screen
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
            /*
            gridBox.addEventListener("mouseover", function() {
                gridBox.style.backgroundColor = "#00ACBA";
                gridBox.style.margin = "0%";
                gridBox.style.borderRadius = "0%";
            });
            */

            gridBoard.appendChild(gridBox);

            boxGroup.push(gridBox);
        }
        boxes.push(boxGroup);
        boxGroup = [];
    }

    let startBox = boxes[Math.floor(rows / 2)][Math.floor(cols / 3)];
    let finishBox = boxes[Math.floor(rows / 2)][Math.floor( (cols * 2) / 3)];
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
                    await sleep(20);
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
                    await sleep(20);
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
            await sleep(20);
            markAsPath(path[i]);
        }
    }

    //recover the color coding for start and finish 
    finish.style.backgroundColor = startIcon.dataset.color;
    start.style.backgroundColor = destinationIcon.dataset.color;
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

populateGrid();

//start #4CAF50;
//finish #FFD700
//path 008CBA
//place visited 4f4f4f
//wall f44336