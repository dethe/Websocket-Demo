var express = require('express'),
    io = require('socket.io');
    
    
var app = express.createServer()
  , io = io.listen(app);
  
app.use(express.static(__dirname + '/public'));

app.listen(9999);

var colours = ['#ba55e5', '#ba1b0a', '#5e11e5', '#1ab1ab', '#be110c', '#00d1e5', '#1005ed',
    '#de501e', '#5a15a5', '#5c01d5', '#feeb1e', '#d0ab1e', '#1e5b05', '#b055e5', '#c00c00', '#b100d5'];
var names = ['Aavik', 'Bach', 'Czerny', 'Debussy', 'Elfman', 'Fenton', 'Grimani', 'Hwang', 'Irizar', 
    'Jacobi', 'Kuzmenko', 'Lutyens', 'Morton', 'Neruda', 'Ozi'];
var lastcolour = 0;
var lastname = 0;
var currentPlayers = {};

function getColour(){
    lastcolour = (lastcolour + 1) % colours.length;
    return colours[lastcolour];
}

function getName(){
    lastname = (lastname + 1) % names.length;
    return names[lastname];
}

io.sockets.on('connection', function (socket) {
  var name = getName(), colour = getColour();
  socket.set('colour', colour, function(){ socket.emit('set colour', {colour: colour})});
  socket.set('name', name, function(){ socket.emit('set name', {name: name})});
  for (var colour in currentPlayers){
    var player = currentPlayers[colour];
    socket.emit('set position', player);
  }
  socket.on('set position', function(data){
    currentPlayers[data.colour] = data;
    socket.broadcast.emit('set position', data);
  });
  socket.on('disconnect', function(){
    console.log('disconnect');
    try{
        socket.get('colour', function(err, colour){
            delete currentPlayers[colour];
            socket.broadcast.emit('player disconnected', {colour: colour});
        });
    }catch(e){
        console.log('No colour found');
        // now what?
    }
  });
});
