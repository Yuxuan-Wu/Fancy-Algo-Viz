/**
 * Local imports
 * =============
 */
import { context } from "./main.js";
import { getAngle } from "./auxiliary.js";

/**
 * Variable declaration and initialization
 * =======================================
 */
export var animationRequest;
var nodes = [];

/**
 * Event listeners and their controllers
 * =====================================
 */
function mousedownListener(event) {
    var button = event.which;
    //1 for left click, 2 for right click
    if (button == 1) {
        nodes[0].moveTo(event.clientX, event.clientY);
        //nodes[1].moveTo(event.clientY, event.clientX);
    }
}

export function bindEventlisteners() {

    canvas.addEventListener("mousedown", mousedownListener, true);

}

export function removeEventlisteners() {

    canvas.removeEventListener("mousedown", mousedownListener, true);

}

//A node should be able to:
//construct pointer between nodes

//First data structure: linked list
//functions: prepend, append, delete(curr), get curr, pointer indication (highlight the node), change value for a curr, next 

class Node {

    constructor(value, color) {

        this.x = 0;
        this.y = 0;
        this.targetX = 400;
        this.targetY = 400;
        this.speed = 1;

        this.radius = 30;
        this.color = color;

        this.value = value;

        this.connectedNodes = [];

    }

    moveTo(xCord, yCord) {
        this.targetX = xCord;
        this.targetY = yCord;
    }

    addConnection(node) {
        this.connectedNodes.push(node);
    }

    update() {

        let directionAngle = getAngle(this.x, this.y, this.targetX, this.targetY);
        this.x += this.speed * Math.cos(directionAngle);
        this.y += this.speed * Math.sin(directionAngle);

        this.render();

    }

    render() {

        context.beginPath();
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillStyle = "#FFFFFF";
        context.fillText(this.value, this.x, this.y);

        context.strokeStyle = this.color;
        context.lineWidth = 3;
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        context.stroke();

        context.closePath();

        this.connectTo(nodes[1], 5);

    }

    connectTo(node, radius) {
        let angle = getAngle(this.x, this.y, node.x, node.y);
        let x;
        let y;

        context.beginPath();

        //draw arrow head
        context.arc(node.x - node.radius * Math.cos(angle), 
            node.y - node.radius * Math.sin(angle), radius, 0, 2 * Math.PI);
        context.fill();

        //draw line between two nodes
        context.moveTo(this.x + this.radius * Math.cos(angle), this.y + this.radius * Math.sin(angle));
        context.lineTo(node.x - node.radius * Math.cos(angle), node.y - node.radius * Math.sin(angle));
        context.stroke();

        context.closePath();
    }

}

export function createNode(xCord, yCord, value, color) {
    let node = new Node(value, color);
    node.x = xCord;
    node.y = yCord;

    nodes.push(node);
}

export function deleteNode(index) {
    nodes.splice(index, 1);
}

export function updateNode(index, value) {
    nodes[index].value = value;
}

export function animate() {

    //Clear screen every frame to update node positions
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < nodes.length; i++) {
        nodes[i].update();
    }

    animationRequest = window.requestAnimationFrame(animate);

}

