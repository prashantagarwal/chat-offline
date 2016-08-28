// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 5000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

var numUsers = 0;

var usersOnline = [];

var syncMessages = {};

io.on('connection', function (socket) {


  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    console.log('disconnect',socket.username);
    --numUsers;
    var index = usersOnline.indexOf(socket.username);
    if (index > -1) {
        usersOnline.splice(index, 1);
    }

    socket.broadcast.emit('user online', {
      users: usersOnline
    });

  });

  socket.on('user online', function (username) {
    ++numUsers;
    socket.username = username;
    usersOnline.push(username);
    
    io.emit('user online', {
      users: usersOnline
    });
    console.log('usersOnline', usersOnline);
    if(syncMessages[username] && syncMessages[username].length > 0){
        socket.emit('sync message', {
          messages: syncMessages[username]
        });

        syncMessages[username] = [];
    }

  });

  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    if(usersOnline.indexOf(data.to) === -1){
      if(!syncMessages[data.to])
        syncMessages[data.to] = [];
      
      syncMessages[data.to].push(data);
    } else {
      socket.broadcast.emit('new message', data);
    }

  });

});
