/**
 * Auxiliary functions
 * ===================
 */
export function distance(x1, y1, x2, y2) {
    let disX = x1 - x2;
    let disY = y1 - y2;

    return Math.sqrt(disX * disX + disY * disY);
}

export function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

export function randomRGB() {
    return "#" + random(0, 16777215).toString(16);
}

export function getAngle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
}
