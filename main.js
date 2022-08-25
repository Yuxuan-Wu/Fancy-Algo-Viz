/**
 * Local imports
 * =============
 */
import * as GraphAlgoViz from "./graphAlgoViz.js";
import * as Firework from "./firework.js";

/**
 * Variable declaration and initialization
 * =======================================
 */
var currApp;

/**
 * HTML element
 * ============
 */

const backgroundMusic = document.querySelector("#background-music");
const graphAlgoViz = document.querySelector("#graphAlgoViz");
const physicsSim = document.querySelector("#physicsSim");
export const navBar = document.querySelector("#navbar");
export const graphAlgoControlPanel = document.querySelector("#graph-algo-control-panel");
export const startIcon = document.querySelector("#start-icon");
export const destinationIcon = document.querySelector("#destination-icon");

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
graphAlgoViz.addEventListener("click", function () {
    ceaseCurrentProcess();

    navBar.style.display = "none";
    graphAlgoControlPanel.style.display = "block";
    startIcon.style.display = "initial";
    destinationIcon.style.display = "initial";
    GraphAlgoViz.createGrid();
    GraphAlgoViz.initializeGridBoard();
    GraphAlgoViz.populateGrid();
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
}