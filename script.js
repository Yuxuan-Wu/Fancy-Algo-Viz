/**
 * Page settings
 * =============
 */


/**
 * Variable declaration and initialization
 * =======================================
 */
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext('2d');

var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

canvas.width = windowWidth;
canvas.height = windowHeight;

const frameRate = 60.0;
const frameDelay = 1000.0 / frameRate;

var fireworksActive = [];

/**
 * Bind event listeners
 * ====================
 */
canvas.addEventListener("mousedown", function (event) {
    var button = event.which;
    //1 for left click, 2 for right click
    if (button == 1) {
        createFirework();
    } else {

    }
});

/**
 * Class definitions
 * =================
 */
class Firework {

    constructor(speed, gravity) {

        //cordinate of the firework obj itself
        this.x = 0;
        this.y = 0;

        this.startX = 0;
        this.startY = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.offsetX = 0;
        this.offsetY = 0;

        this.color = "#FFFFFF";

        this.speed = speed;
        this.gravity = gravity;

        this.alive = true;
        this.secLived = 0;

    }

    update(ms) {

        let animationSpeed = ms / 1000;

        if (this.secLived > 2000 / ms) {
            //createParticles
            this.alive = false;
        }
        else {
            this.speed *= 0.98;
            this.x -= this.offsetX * this.speed * animationSpeed;
            this.y -= this.offsetY * this.speed * animationSpeed - this.gravity;
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

function createFirework() {
    let firework = new Firework(random(700, 1100), 1.5);

    firework.x = windowWidth;
    firework.startX = windowWidth;
    firework.y = windowHeight;
    firework.startY = windowHeight;

    firework.color = "#FFFFFF";

    firework.targetX = random(400, windowWidth - 400);
    firework.targetY = random(0, windowHeight / 2);

    let angle = getAngle(firework.startX, firework.startY, firework.targetX, firework.targetY);

    firework.offsetX = Math.cos(angle * Math.PI / 180.0);
    firework.offsetY = Math.sin(angle * Math.PI / 180.0);

    fireworksActive.push(firework);
}

function update(frame) {
    //Every frame fill the whole screen with black color to hide the firework trails
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, windowWidth, windowHeight);

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
}

//The main rendering process
const main = setInterval(function () {
    update(frameDelay);
}, frameDelay);

/**
 * Auxiliary functions
 * ===================
 */

function distance(x1, y1, x2, y2) {
    disX = x1 - x2;
    disY = y1 - y2;

    return Math.sqrt(disX * disX + disY * disY);
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getAngle(posx1, posy1, posx2, posy2) {
    if (posx1 == posx2) { if (posy1 > posy2) { return 90; } else { return 270; } }
    if (posy1 == posy2) { if (posy1 > posy2) { return 0; } else { return 180; } }

    var xDist = posx1 - posx2;
    var yDist = posy1 - posy2;

    if (xDist == yDist) { if (posx1 < posx2) { return 225; } else { return 45; } }
    if (-xDist == yDist) { if (posx1 < posx2) { return 135; } else { return 315; } }

    if (posx1 < posx2) {
        return Math.atan2(posy2 - posy1, posx2 - posx1) * (180 / Math.PI) + 180;
    } else {
        return Math.atan2(posy2 - posy1, posx2 - posx1) * (180 / Math.PI) + 180;
    }
}