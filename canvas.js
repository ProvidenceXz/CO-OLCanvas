/*
 * Author: ProvidenceXz
 */

/*********************************
 *     Variable Declarations     *
 *********************************/

var background;
var context;
var paint = false;
var clickX = [];
var clickY = [];
var clickDrag = [];
var clickSize = [];
var clickColor = [];
var userSize = "normal";
var userColor = generateColor();



/********************************
 **                            **
 **       Main Functions       **
 **                            **
 ********************************/

/**
 * Readies canvas element
 * Monitors mouse activities
 *
 * @TODO - Create Background Canvas and buttons/pens
 */
function init() {
    // Initialize Background
    background = document.getElementById('bkgID').getContext("2d");
    // Background auto-resize
    $(window).resize(
        function() {
            background.canvas.width = window.innerWidth;
            background.canvas.height = window.innerHeight;
        }
    );

    // Initialize Canvas
    context = document.getElementById('canvasID').getContext("2d");

    // Mouse Down Event
    $('#canvasID').mousedown(
        function(event) {
            // Get mouse location
            var mouseX = event.pageX - this.offsetLeft;
            var mouseY = event.pageY - this.offsetTop;
            // Fix HTML5 scrolling bug
            mouseX -= window.pageXOffset;
            mouseY -= window.pageYOffset;

            // Start painting
            paint = true;
            draw(mouseX, mouseY, false, userColor, userSize);
            sendDrawData(mouseX, mouseY, false, userColor, userSize, "draw");
        }
    );

    // Mouse Move Event
    $('#canvasID').mousemove(
        function(event) {
            // Get mouse location
            var mouseX = event.pageX - this.offsetLeft;
            var mouseY = event.pageY - this.offsetTop;
            // Fix HTML5 scrolling bug
            mouseX -= window.pageXOffset;
            mouseY -= window.pageYOffset;

            if (paint) {
                draw(mouseX, mouseY, true, userColor, userSize);
                sendDrawData(mouseX, mouseY, true, userColor, userSize, "draw");
            }
        }
    );

    // Mouse Up Event
    $('#canvasID').mouseup(
        function(event) {
            paint = false;
            //sendEndState(clickX, clickY, clickDrag, clickColor, clickSize);
        }
    );

    // Mouse Leave Event
    $('#canvasID').mouseleave(
        function(event) {
            paint = false;
            //sendEndState(clickX, clickY, clickDrag, clickColor, clickSize);
        }
    );
}


/**
 * Keeps track of mouse movements
 *
 * @param x - horizontal location of mouse click
 * @param y - vertical location of mouse click
 * @param dragging - if mouse is dragging
 * @param color - current color used
 * @param size - current pen size chosen
 */
function draw(x, y, dragging, color, size) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
    clickColor.push(color);
    clickSize.push(size);
    refresh();
}

/**
 * Draws the canvas according to tracks
 *
 */
function refresh() {
    // clear up the canvas
    clearCanvas();
    context.lineJoin = "round";

    // Draw
    for (var i = 0; i < clickX.length; i++) {
        context.beginPath();
        if (clickDrag[i] && i) {
            context.moveTo(clickX[i - 1], clickY[i - 1]);
        } else {
            context.moveTo(clickX[i], clickY[i]);
        }
        context.lineTo(clickX[i], clickY[i]);
        context.closePath();
        context.strokeStyle = clickColor[i];
        context.lineWidth = getLineWidth(clickSize[i]);
        context.stroke();
    }
}



/*********************************
 **                             **
 **       Helper Functions      **
 **                             **
 *********************************/


/**
 * Finds the closest name for hex color.
 *
 * @param color - hex color string
 * @returns string - nearest color name
 */
function nameColor(color) {
    return ntc.name(color);
}


/**
 * Generates random hex color.
 *
 * @returns string - random hex color
 */
function generateColor() {
    return '#' + Math.random().toString(16).substr(-6);
}


/**
 * Maps line width to corresponding pen sizes
 *
 * @param size - {"small", "normal", "large", "huge"}
 * @returns int - corresponding size
 */
function getLineWidth(size) {
    var radius;
    if (size == "small") {
        radius = 2;
    } else if (size == "normal") {
        radius = 5;
    } else if (size == "large") {
        radius = 10;
    } else if (size == "huge") {
        radius = 15;
    } else {
        alert("Error: Invalid pen size. Reset to normal");
        radius = 5;
    }
    return radius;
}

/**
 * Clean up the canvas to prevent repetitive rendering
 *
 */
function clearCanvas() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

/**
 * Emits current drawing data to server
 *
 * @param x - horizontal location of mouse click
 * @param y - vertical location of mouse click
 * @param dragging - if mouse is dragging
 * @param color - current color used
 * @param size - current pen size chosen
 */
function sendDrawData(x, y, dragging, color, size) {
    // An object containing drawing data
    var data = {
        header: "draw",
        x: x,
        y: y,
        dragging: dragging,
        color: color,
        size: size
    };
    socket.emit('message', data);
}

/**************************************************
function sendEndState(x, y, drag, color, size) {
    var data = {
        header: "end",
        x: x,
        y: y,
        drag: drag,
        color: color,
        size: size
    };
    socket.emit('message', data);
}
 ****************************************************/