/**
 * Local imports
 * =============
 */
import * as Firework from './firework.js';

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
canvas.height = window.innerHeight;

const frameRate = 144.0;
const frameDelay = 1000.0 / frameRate;

/**
 * Bind event listeners
 * ====================
 */
homeBtn.addEventListener("click", function () {
    //backgroundMusic.play();

    ceaseCurrentProcess();
});

physicsSim.addEventListener("click", function() {
    ceaseCurrentProcess();

    Firework.bindEventlisteners();

    //

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

    //remove eventlisteners for all applications
    Firework.removeEventlisteners();

    clearInterval(currApp);
}