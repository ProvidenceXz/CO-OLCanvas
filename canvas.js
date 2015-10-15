/* Variable Initializations */
var context;
var paint = false;
var clickX = [];
var clickY = [];
var clickDrag = [];
// Color
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
            update();
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
                update();
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
}

function update() {
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