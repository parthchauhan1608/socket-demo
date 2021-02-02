var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
   res.sendfile('index.html');
});

users = [];
io.on('connection', function(socket) {
   console.log('A user connected');
   socket.on('setUsername', function(data) {
      console.log(data);
      
      if(users.indexOf(data) > -1) {
         socket.emit('userExists', data + ' username is taken! Try some other username.');
      } else {
         users.push(data);
         socket.emit('userSet', {username: data});
      }
   });
   
   socket.on('msg', function(data) {
      //Send message to everyone
      io.sockets.emit('newmsg', data);
   })

   socket.on('onDisconnect',(d)=>{
      console.log("here",d);
   })

   socket.on('disconnect',()=>{
      console.log("check")
      socket.emit('onDisconnect1',"it's disconnected");
   })
});

http.listen(3000, function() {
   console.log('listening on localhost:3000');
});