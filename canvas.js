/* Part I: Canvas */
/*----------------*/

/* Variable Initializations */
var context;
var paint = false;
var clickX = [];
var clickY = [];
var clickDrag = [];
// Color
var colorBlue = '#0000FF';
var colorYellow = '#FFFF00';
var colorIndigo = '#4B0082';
var colorRed = '#EE0000';
var colorRandom = '#'+Math.random().toString(16).substr(-6);


function init() {
    // Initialize Canvas
    context = document.getElementById('canvasID').getContext("2d");

    // Mouse Down
    $('#canvasID').mousedown(
        function(e) {
            // Get mouse location
            var mouseX = e.pageX - this.offsetLeft;
            var mouseY = e.pageY - this.offsetTop;
            // Painter on
            paint = true;
            addClick(mouseX, mouseY);
            refresh();
        }
    );

    // Mouse Move
    $('#canvasID').mousemove(
        function(e) {
            // Get mouse location
            var mouseX = e.pageX - this.offsetLeft;
            var mouseY = e.pageY - this.offsetTop;

            if (paint) {
                addClick(mouseX, mouseY, true);
                refresh();
            }
        }
    );

    // Mouse Up
    $('#canvasID').mouseup(
        function(e) {
            paint = false;
        }
    );

    // Mouse Leave
    $('#canvasID').mouseleave(
        function(e) {
            paint = false;
        }
    );

}

function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
    update(x, y, colorRandom, dragging);
}

function refresh() {
    // Clear Canvas
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    // Set up pen
    context.strokeStyle = colorRandom;
    context.lineJoin = "round";
    context.lineWidth = 4;

    for (var i = 0; i < clickX.length; i++) {
        context.beginPath();
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


// This function sends the data for a circle to the server
// so that the server can broadcast it to every other user
function update(x, y, color, dragging) {

    // Each Socket.IO connection has a unique session id
    var sessionId = io.socket.sessionid;

    // An object to describe the circle's draw data
    var data = {
        x: x,
        y: y,
        color: color,
        dragging: dragging
    };

    // send an event with data and sessionId to the server
    io.emit( 'draw', data, sessionId );

    // Lets have a look at the data we're sending
    console.log(data);

}


















