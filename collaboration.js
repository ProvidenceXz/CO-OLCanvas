/* Part II: Collaboration */
/*------------------------*/

// initialization
var express = require('express');
var app = express();
app.use('/', express.static(__dirname + '/'));
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

// route handler
app.get('/', function (req, res) {
    res.sendfile('index.html');
});


var active_connection = 0;
io.on('connection', function(socket){
    // user connection
    console.log('a user connected. Active users: ' + active_connection.toString());
    console.log('are you ok');
    active_connection++;

    // hello world
    io.emit('this', { will: 'be received by everyone' });

    // user disconnection
    socket.on('disconnect', function () {
        active_connection--;
        console.log('user disconnected. Active users: ' + active_connection.toString());
    });

    // Event: user starts drawing
    socket.on('draw:start', function (user, pathdata) {
        io.emit('draw:start', user, pathdata);
    });

    //Event: user stops drawing
    socket.on('draw:end', function (user, pathdata) {
        io.emit('draw:end', user, pathdata);
    });
});

// make the http server listen on port 3000
http.listen(3000, function () {
    console.log('listening on *:3000');
});

