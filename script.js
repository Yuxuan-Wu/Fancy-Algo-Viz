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

const frameRate = 144.0;
const frameDelay = 1000.0 / frameRate;

var fireworksActive = [];
var sparkles = [];

/**
 * Bind event listeners
 * ====================
 */
canvas.addEventListener("mousedown", function (event) {
    var button = event.which;
    //1 for left click, 2 for right click
    if (button == 1) {
        createFirework(event.clientX, event.clientY);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

/**
 * Class definitions
 * =================
 */
class Sparkle {

    constructor(speed, gravity) {

        //cordinate of the sparkle obj itself
        this.x = 0;
        this.x = 0;

        this.vectorX = 0;
        this.vectorY = 0;

        this.scale = 0.9;

        this.color = "#FFFFFF";
        this.brightness = 1.75;

        this.speed = speed;
        this.gravity = gravity;

    }

    update(ms) {

        let animationSpeed = ms / 1000;

        this.brightness -= 0.04;
        this.speed *= this.scale;
        this.x -= this.vectorX * this.speed * animationSpeed;
        this.y -= this.vectorY * this.speed * animationSpeed - this.gravity;

    }

    render() {
        ctx.save();
        ctx.globalAlpha = this.brightness;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;

        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
        ctx.fill();

        ctx.closePath();
        ctx.restore();
    }

}

class Firework {

    constructor(speed, gravity) {

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
        this.gravity = gravity;

        this.alive = true;
        this.secLived = 0;

    }

    update(ms) {

        let animationSpeed = ms / 1000;

        if (this.secLived > 1500 / ms) {
            createSparkles(30, this.x, this.y, this.color);
            this.alive = false;
        }
        else {
            this.speed *= 0.98;
            this.x -= this.vectorX * this.speed * animationSpeed;
            this.y -= this.vectorY * this.speed * animationSpeed - this.gravity;
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

function createFirework(xCord, yCord) {
    let firework = new Firework(random(1500, 2500), 0.5);

    firework.x = windowWidth / 2;
    firework.startX = windowWidth / 2;
    firework.y = windowHeight;
    firework.startY = windowHeight;

    firework.color = "#FFFFFF";

    firework.targetX = xCord;
    firework.targetY = yCord;

    let angle = getAngle(firework.startX, firework.startY, firework.targetX, firework.targetY);

    firework.vectorX = Math.cos(angle * Math.PI / 180.0);
    firework.vectorY = Math.sin(angle * Math.PI / 180.0);

    fireworksActive.push(firework);
}

function createSparkles(count, xCord, yCord, color) {
    let sparkle = undefined, angle = 0;
    for (var i = 0; i < count; i++) {
        sparkle = new Sparkle(random(2000, 3000), 0.9);

        sparkle.color = color;
        sparkle.x = xCord;
        sparkle.y = yCord;

        angle = random(0, 360);

        sparkle.vectorX = Math.cos(angle * Math.PI / 180.0);
        sparkle.vectorY = Math.sin(angle * Math.PI / 180.0);

        sparkles.push(sparkle);
    }
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

    for (var i = 0; i < sparkles.length; i++) {
        //detect if the firework is still alive
        if (sparkles[i].brightness <= 0) {
            sparkles.splice(i, 1);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        else {
            sparkles[i].update(frame);
            sparkles[i].render();
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