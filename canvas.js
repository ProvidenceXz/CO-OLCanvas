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
var userColor = colorRandom;

function init() {
    // Initialize Canvas
    context = document.getElementById('canvasID').getContext("2d");

    // data
    var data = {};

    // Mouse Down
    $('#canvasID').mousedown(
        function(e) {
            // Get mouse location
            var mouseX = e.pageX - this.offsetLeft;
            var mouseY = e.pageY - this.offsetTop;
            // Painter on
            paint = true;
            draw(mouseX, mouseY, false, userColor);
            data = {
                x: clickX,
                y: clickY,
                dragging: clickDrag,
                color: userColor
            };
            socket.emit('draw', data);

        }
    );

    // Mouse Move
    $('#canvasID').mousemove(
        function(e) {
            // Get mouse location
            var mouseX = e.pageX - this.offsetLeft;
            var mouseY = e.pageY - this.offsetTop;

            if (paint) {
                draw(mouseX, mouseY, true, userColor);
                data = {
                    x: clickX,
                    y: clickY,
                    dragging: clickDrag,
                    color: userColor
                };
                socket.emit('draw', data);
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

    var socket = io.connect('http://localhost:3000');
    socket.on('draw', function(data) {
        refresh(data.color, data.x, data.y, data.dragging);
    });




}

function draw(x, y, dragging, color) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
    refresh(color, clickX, clickY, clickDrag);
}

function refresh(color, clickX, clickY, clickDrag) {
    // Clear Canvas
    //context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    // Set up pen
    context.strokeStyle = color;
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












