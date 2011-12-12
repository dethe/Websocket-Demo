var mySquare;
var myName="";
var myColour;
var otherSquares = {};
var socket = io.connect('http://localhost');

function initWithColour(colour){
    console.log('setting colour %s', colour);
    myColour = colour;
    mySquare = $('<div class="local">' + myName + '</div>').css('background-color', colour);
    $(document.body).append(mySquare);
    var x = Math.random() * ($(window).width() - 60)  >>> 0;
    var y = Math.random() * ($(window).height() - 60) >>> 0;
    mySquare.offset({left: x, top: y});
    socket.emit('set position', {colour: colour, name: name, x: x, y: y});
}

function setName(name){
    myName = name;
    if (mySquare){
        mySquare.text(name);
    }
}

function setPositionOther(data){
    if (! otherSquares[data.colour]){
        otherSquares[data.colour] = $('<div class="remote">' + data.name + '</div>').css('background-color', data.colour);
        $(document.body).append(otherSquares[data.colour]);
    }
    otherSquares[data.colour].offset({left: data.x, top: data.y}).text(data.name);
}

socket.on('set colour', function (data) {
    console.log('set colour received');
    initWithColour(data.colour);
});
socket.on('set name', function(data){
    console.log('set name received');
    setName(data.name);
});
socket.on('set position', function(data){
    console.log('set position received');
    setPositionOther(data);
});
socket.on('player disconnected', function(data){
    console.log('player disconnected received');
    otherSquares[data.colour].remove();
    delete otherSquares[data.colour];
});
var MOVE = 5;
$(document).keydown(function(evt){
    if (evt.which < 37 || evt.which > 40) return;
    var pos = mySquare.offset();
    var x = pos.left;
    var y = pos.top;
    switch(evt.which){
        case 37: x -= MOVE; break;
        case 38: y -= MOVE; break;
        case 39: x += MOVE; break;
        case 40: y += MOVE; break;
    }
    mySquare.offset({left: x, top: y});
    socket.emit('set position', {colour: myColour, name: myName, x: x, y: y});
});
