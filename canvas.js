/*********************************
 *     Variable Declarations     *
 *********************************/

var context;
var paint = false;
var clickX = [];
var clickY = [];
var clickDrag = [];
var clickColor = [];
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
 */
function init() {
    // Initialize Canvas
    context = document.getElementById('canvasID').getContext("2d");

    // Mouse Down Event
    $('#canvasID').mousedown(
        function(event) {
            // Get mouse location
            var mouseX = event.pageX - this.offsetLeft;
            var mouseY = event.pageY - this.offsetTop;
            // Start painting
            paint = true;
            draw(mouseX, mouseY, false, userColor);
            sendToServer(mouseX, mouseY, false, userColor);
        }
    );

    // Mouse Move Event
    $('#canvasID').mousemove(
        function(event) {
            // Get mouse location
            var mouseX = event.pageX - this.offsetLeft;
            var mouseY = event.pageY - this.offsetTop;

            if (paint) {
                draw(mouseX, mouseY, true, userColor);
                sendToServer(mouseX, mouseY, true, userColor);
            }
        }
    );

    // Mouse Up Event
    $('#canvasID').mouseup(
        function(event) {
            paint = false;
        }
    );

    // Mouse Leave Event
    $('#canvasID').mouseleave(
        function(event) {
            paint = false;
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
 */
function draw(x, y, dragging, color) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
    clickColor.push(color);
    refresh();
}

/**
 * Draws the canvas according to tracks
 *
 */
function refresh() {
    // Clear Canvas
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    // Set up pen
    context.lineJoin = "round";
    context.lineWidth = 4;

    for (var i = 0; i < clickX.length; i++) {
        context.beginPath();
        context.strokeStyle = clickColor[i];
        if (clickDrag[i] && i) {
            context.moveTo(clickX[i - 1], clickY[i - 1]);
        } else {
            context.moveTo(clickX[i], clickY[i]);
        }
        context.lineTo(clickX[i], clickY[i]);
        context.closePath();
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
 * @returns {string} - nearest color name
 */
function nameColor(color) {
    return ntc.name(color);
}


/**
 * Generates random hex color.
 *
 * @returns {string} - random hex color
 */
function generateColor() {
    return '#'+Math.random().toString(16).substr(-6);
}


/**
 * Emits current drawing data to server
 *
 * @param x - horizontal location of mouse click
 * @param y - vertical location of mouse click
 * @param dragging - if mouse is dragging
 * @param color - current color used
 */
function sendToServer(x, y, dragging, color) {
    // An object containing drawing data
    var data = {
        x: x,
        y: y,
        dragging: dragging,
        color: color
    };
    socket.emit('message', data);
}