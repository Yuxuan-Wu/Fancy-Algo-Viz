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
var boardWidth = window.innerWidth;
var boardHeight = window.innerHeight - navBar.offsetHeight - 10;
var boxes = [];

//set the size of gridBoard According to the user's screen size
gridBoard.style.width = boardWidth;
gridBoard.style.height = `${boardHeight}px`;

function dropListener(event) {
    event.preventDefault();
    let elementID = event.dataTransfer.getData("text");
    let value = event.dataTransfer.getData("value");
    let target = event.target;
    if (target.tagName == "LI") {
        target.appendChild(document.getElementById(elementID));
    }
    target.setAttribute("value", value);
    target.removeEventListener("dragover", dragoverListener, true);
}

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

            gridBox.addEventListener("drop", dropListener, true);
            gridBox.addEventListener("dragover", dragoverListener, true);

            gridBoard.appendChild(gridBox);

            boxGroup.push(gridBox);
        }
        boxes.push(boxGroup);
        boxGroup = [];
    }

    boxes[20][4].style.backgroundColor = "#4CAF50";
    boxes[20][30].style.backgroundColor = "#FFD700";
}

const startIcon = document.querySelector("#start-icon");
startIcon.addEventListener("dragstart", function (event) {
    event.dataTransfer.setData("text", event.target.id);
    event.dataTransfer.setData("value", "start");
});
const destinationIcon = document.querySelector("#destination-icon");
destinationIcon.addEventListener("dragstart", function (event) {
    event.dataTransfer.setData("text", event.target.id);
    event.dataTransfer.setData("value", "finish");
});

function dragListener(event) {
    let gridBox = event.target.parentElement;
    gridBox.setAttribute("value", "blank");
    gridBox.addEventListener("dragover", dragoverListener, true);
}

startIcon.addEventListener("drag", dragListener, true);
destinationIcon.addEventListener("drag", dragListener, true);
populateGrid();

//start #4CAF50;
//finish #FFD700
//path 008CBA
//place visited 3f3f3f
//wall f44336

//https://www.youtube.com/watch?v=wZZyhrJxZRU