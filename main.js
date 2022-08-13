/**
 * Canvas settings
 * =============
 */
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext('2d');

var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

canvas.width = windowWidth;
canvas.height = windowHeight;

const frameRate = 144.0;
const frameDelay = 1000.0 / frameRate;

/**
 * Variable declaration and initialization
 * =======================================
 */

var fireworksActive = [];
var sparkles = [];

//fullauto control
const fireThreshold = 300;
var timer = 0;

//Control panel
const fullautoButton = document.querySelector("#fullauto-button");
const colorPicker = document.querySelector("#color-picker");
const scaleSlide = document.querySelector("#scale-slide");
const gravitySlide = document.querySelector("#gravity-slide");
const enduranceSlide = document.querySelector("#endurance-slide");
const particleCountSlide = document.querySelector("#particle-count-slide");

/**
 * Bind event listeners
 * ====================
 */
canvas.addEventListener("mousedown", function (event) {
    var button = event.which;
    //1 for left click, 2 for right click
    if (button == 1) {
        createFirework(event.clientX, event.clientY, colorPicker.value);
    }
});

fullautoButton.addEventListener("click", function () {
    fullautoButton.value ^= true;
});

/**
 * Class definitions
 * =================
 */
class Sparkle {

    constructor(speed) {

        //cordinate of the sparkle obj itself
        this.x = 0;
        this.x = 0;

        this.vectorX = 0;
        this.vectorY = 0;

        this.scale = scaleSlide.value;

        this.color = "#FFFFFF";
        this.brightness = enduranceSlide.value;

        this.speed = speed;

    }

    update(ms) {

        let animationSpeed = ms / 1000;

        this.brightness -= 0.04;
        this.speed *= 0.9;
        this.x -= this.vectorX * this.speed * animationSpeed;
        this.y -= this.vectorY * this.speed * animationSpeed - gravitySlide.value;

    }

    render() {

        ctx.save();
        ctx.globalAlpha = this.brightness;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;

        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);
        ctx.beginPath();
        ctx.fillRect(0, 0, 1, 1);

        ctx.closePath();
        ctx.restore();

    }

}

class Firework {

    constructor(speed) {

        //cordinate of the firework obj itself
        this.x = 0;
        this.y = 0;

        this.startX = 0;
        this.startY = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.vectorX = 0;
        this.vectorY = 0;

        this.color = "#FFFFFF";

        this.speed = speed;

        this.alive = true;
        this.secLived = 0;

    }

    update(ms) {

        let animationSpeed = ms / 1000;

        if (this.secLived > 1500 / ms) {
            createSparkles(particleCountSlide.value, this.x, this.y, this.color);
            this.alive = false;
        }
        else {
            this.speed *= 0.98;
            this.x -= this.vectorX * this.speed * animationSpeed;
            this.y -= this.vectorY * this.speed * animationSpeed - gravitySlide.value / 3;
        }

        this.secLived++;

    }

    render() {

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, 1, 0, 2 * Math.PI);
        ctx.fill();

    }

}

/**
 * Main functions
 * ==============
 */

function createFirework(xCord, yCord, color) {
    let firework = new Firework(random(1750, 2500));

    firework.x = windowWidth / 2;
    firework.y = windowHeight;

    firework.startX = firework.x;
    firework.startY = firework.y;
    firework.targetX = xCord;
    firework.targetY = yCord;

    let angle = getAngle(firework.targetX, firework.targetY, firework.startX, firework.startY);
    firework.vectorX = Math.cos(angle * Math.PI / 180.0);
    firework.vectorY = Math.sin(angle * Math.PI / 180.0);

    firework.color = color;

    fireworksActive.push(firework);
}

function createSparkles(count, xCord, yCord, color) {
    let sparkle = undefined, angle = 0;
    for (var i = 0; i < count; i++) {
        sparkle = new Sparkle(random(1500, 3000));

        sparkle.x = xCord;
        sparkle.y = yCord;

        angle = random(0, 360);
        sparkle.vectorX = Math.cos(angle * Math.PI / 180.0);
        sparkle.vectorY = Math.sin(angle * Math.PI / 180.0);

        sparkle.color = color;

        sparkles.push(sparkle);
    }
}

function update(frame) {
    timer++;

    //Every frame fill the whole screen with more transparent background color to hide the firework trails
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(38, 39, 41, 0.15)';
    ctx.fillRect(0, 0, windowWidth, windowHeight);

    if (fullautoButton.value == true && timer % fireThreshold == 0) {
        createFirework(random(windowWidth / 3, (windowWidth * 2) / 3),
            windowHeight / 2, randomRGB());
    }

    for (var i = 0; i < fireworksActive.length; i++) {
        //detect if the firework is still alive
        if (!fireworksActive[i].alive) {
            fireworksActive.splice(i, 1);
        }
        else {
            fireworksActive[i].update(frame);
            fireworksActive[i].render();
        }
    }

    for (var i = 0; i < sparkles.length; i++) {
        //detect if the firework is still alive
        if (sparkles[i].brightness <= 0) {
            sparkles.splice(i, 1);
        }
        else {
            sparkles[i].update(frame);
            sparkles[i].render();
        }
    }

    //when there is no active firework / sparkles
    if (sparkles.length == 0 && fireworksActive.length == 0) {
        //Remove any remaining firework trails by filling the whole screen with opaque background color
        ctx.fillStyle = 'rgb(38, 39, 41)';
        ctx.fillRect(0, 0, windowWidth, windowHeight);
    }
}

//The main rendering process for firework sim
const firework_sim = setInterval(function () {
    update(frameDelay);
}, frameDelay);

//clearInterval(main);

/**
 * Auxiliary functions
 * ===================
 */

function distance(x1, y1, x2, y2) {
    let disX = x1 - x2;
    let disY = y1 - y2;

    return Math.sqrt(disX * disX + disY * disY);
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomRGB() {
    return "#" + random(0, 16777215).toString(16);
}

function getAngle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
}