const Player = require('../classes/player');

let SOCKET_LIST = {};
let PLAYER_LIST = {};

exports = module.exports = (io) => {
    io.on('connection', (socket) => {
        SOCKET_LIST[socket.id] = socket;

        // Instantiate new player object and add player to PLAYER_LIST
        var player = new Player(socket.id, Math.floor((Math.random() * 500) + 1), Math.floor((Math.random() * 500) + 1));
        PLAYER_LIST[socket.id] = player;

        //Emit to everyone except the current socket that a user has connected
        socket.broadcast.emit('connected', 'A user has connected.');

        socket.on('keyPress', (data) => {
            handleKeyPress(player, data);
        });

        socket.on('disconnect', () => {
           delete SOCKET_LIST[socket.id];
           delete PLAYER_LIST[socket.id];

           socket.broadcast.emit('connected', 'A user has disconnected.');
        });
    });
};

function handleKeyPress(player, data) {
    //Check for arrow keys and wasd keys
    if (Object.is(data.inputId, 68) || Object.is(data.inputId, 39)) {
        player.pressed.right = data.state;
    }
    if (Object.is(data.inputId, 65) || Object.is(data.inputId, 37)) {
        player.pressed.left = data.state;
    }
    if (Object.is(data.inputId, 87) || Object.is(data.inputId, 38)) {
        player.pressed.up = data.state;
    }
    if (Object.is(data.inputId, 83) || Object.is(data.inputId, 40)) {
        player.pressed.down = data.state;
    }

    //Check for spacebar
    if (Object.is(data.inputId, 32) && Object.is(data.state, true)) {
        player.shoot();
    }
}

//Send every connected socket package data 30 times a second
setInterval(() => {
    var package = [];

    for (var p in PLAYER_LIST) {
        var player = PLAYER_LIST[p];
        player.updatePosition();
        var position = player.getPosition();
        package.push({
            id: player.id,
            xPos:position.xPos,
            yPos:position.yPos,
        });
    }

    for (var s in SOCKET_LIST) {
        var socket = SOCKET_LIST[s];
        socket.emit('newPosition', package);
    }

}, 1000 / 30);