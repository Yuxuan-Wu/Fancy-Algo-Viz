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
const startIcon = document.querySelector("#start-icon");
const destinationIcon = document.querySelector("#destination-icon");
var boardWidth = window.innerWidth;
var boardHeight = window.innerHeight - navBar.offsetHeight - 10;
var boxes = [];

//set the size of gridBoard According to the user's screen size
gridBoard.style.width = boardWidth;
gridBoard.style.height = `${boardHeight}px`;

function dragoverListener(event) {
    event.preventDefault();
}

function populateGrid() {
    //set the grid's size  adaptively to the user's screen
    let rows = Math.floor(boardHeight / 30);
    let cols = Math.floor(boardWidth / 30);
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

    let midRow = Math.floor(rows / 2);
    let startCol = Math.floor(cols / 3), finishCol = Math.floor( (cols * 2) / 3);
    initializeStartFinish(boxes[midRow][startCol], boxes[midRow][finishCol]);
}

function initializeStartFinish(start, finish) {
    start.appendChild(startIcon);
    start.setAttribute("value", startIcon.dataset.value);
    start.style.backgroundColor = startIcon.dataset.color;

    finish.appendChild(destinationIcon);
    finish.setAttribute("value", destinationIcon.dataset.value);
    finish.style.backgroundColor = destinationIcon.dataset.color;
}

var dragged = null;

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
    //move dragged element to the selected drop target
    let target = event.target;
    if (target.tagName == "LI") {
        dragged.parentNode.setAttribute("value", "blank");
        dragged.parentNode.style.backgroundColor = "#cccccc";
        dragged.parentNode.removeChild(dragged);

        target.appendChild(dragged);
        target.setAttribute("value", dragged.dataset.value);
        target.style.backgroundColor = dragged.dataset.color;
    }
});

populateGrid();

//start #4CAF50;
//finish #FFD700
//path 008CBA
//place visited 3f3f3f
//wall f44336

//https://www.youtube.com/watch?v=wZZyhrJxZRU