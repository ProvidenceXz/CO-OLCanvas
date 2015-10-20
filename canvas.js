/* Part I: Canvas */
/*----------------*/

/* Variable Initializations */
var context;
var paint = false;
var state = {};
var clickX = [];
var clickY = [];
var clickDrag = [];
var clickColor = [];
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
        function(event) {
            // Get mouse location
            var mouseX = event.pageX - this.offsetLeft;
            var mouseY = event.pageY - this.offsetTop;
            // Painter on
            paint = true;
            data = {
                x: mouseX,
                y: mouseY,
                dragging: false,
                color: userColor
            };
            socket.emit('draw:start', data);

        }
    );

    // Mouse Move
    $('#canvasID').mousemove(
        function(event) {
            // Get mouse location
            var mouseX = event.pageX - this.offsetLeft;
            var mouseY = event.pageY - this.offsetTop;

            if (paint) {
                data = {
                    x: mouseX,
                    y: mouseY,
                    dragging: true,
                    color: userColor
                };
                socket.emit('draw:move', data);
            }
        }
    );

    // Mouse Up
    $('#canvasID').mouseup(
        function(event) {
            paint = false;
        }
    );

    // Mouse Leave
    $('#canvasID').mouseleave(
        function(event) {
            paint = false;
        }
    );

    var socket = io.connect('http://localhost:3000');
    //socket.on('draw:ready', function(data) {
    //    clickX = data.xs;
    //    clickY = data.ys;
    //    clickDrag = data.drags;
    //    clickColor = data.colors;
    //});
    socket.on('draw:start', function(data) {
        draw(data.x, data.y, data.dragging, data.color);
    });
    socket.on('draw:move', function(data) {
        draw(data.x, data.y, data.dragging, data.color);
    });





}

function draw(x, y, dragging, color) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
    clickColor.push(color);
    // Send current state to server
    state = {
        xs: clickX,
        ys: clickY,
        drags: clickDrag,
        colors: clickColor
    };
    refresh(clickX, clickY, clickDrag);
    //socket.emit('draw:end', state);
}

function refresh(clickX, clickY, clickDrag) {
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












