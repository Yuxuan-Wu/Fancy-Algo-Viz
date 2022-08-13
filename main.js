/**
 * Local imports
 * =============
 */
import { update as fireworkUpdate } from './firework.js';

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

/**
 * Canvas settings
 * =============
 */
const canvas = document.querySelector("#canvas");
export const context = canvas.getContext('2d');

export var windowWidth = window.innerWidth;
export var windowHeight = window.innerHeight;

canvas.width = windowWidth;
canvas.height = windowHeight;

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
    currApp = setInterval(function () {
        fireworkUpdate(frameDelay);
    }, frameDelay);
});

/**
 * Controller functions
 * ==================== 
 */
function ceaseCurrentProcess() {
    clearInterval(currApp);
}