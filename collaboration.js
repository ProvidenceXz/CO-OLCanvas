/* Part II: Collaboration */
/*------------------------*/

// initialization
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// route handler
app.get('/', function (req, res) {
    res.sendfile( 'main.html');
});


io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

// make the http server listen on port 3000
http.listen(3000, function(){
    console.log('listening on *:3000');
});