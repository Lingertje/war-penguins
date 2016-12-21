const Player = require('../classes/player');

let SOCKET_LIST = {};
let PLAYER_LIST = {};

exports = module.exports = (io) => {
    io.on('connection', (socket) => {
        SOCKET_LIST[socket.id] = socket;

        // Instantiate new player object and add player to PLAYER_LIST
        var player = new Player(socket.id, 40, 250);
        PLAYER_LIST[socket.id] = player;

        //Emit to everyone except the current socket that a user has connected
        socket.broadcast.emit('connected', 'A user has connected.');

        socket.on('message', (msg) => { // TODO: Remove this route, just for testing
            socket.emit('message', player);
        });

        socket.on('keyPress', (data) => {
            handleKeyPress(player, data);
        });

        socket.on('disconnect', () => {
           delete SOCKET_LIST[socket.id];
           delete PLAYER_LIST[socket.id];
        });
    });
};

function handleKeyPress(player, data) {
    let position = player.getPosition();

    if ((data.inputId === 68 || data.inputId === 39) && data.state) {
        position.xPos += player.maxSpd;
    } else if ((data.inputId === 65 || data.inputId === 37) && data.state) {
        position.xPos -= player.maxSpd;
    } else if ((data.inputId === 87 || data.inputId === 38) && data.state) {
        position.yPos -= player.maxSpd;
    } else if ((data.inputId === 83 || data.inputId === 40) && data.state) {
        position.yPos += player.maxSpd;
    }

    player.updatePosition(position.xPos, position.yPos);
}

//Send every connected socket package data 30 times a second
setInterval(function (){
    var package = [];

    for(var p in PLAYER_LIST){
        var player = PLAYER_LIST[p];
        var position = player.getPosition();
        package.push({
            id: player.id,
            xPos:position.xPos,
            yPos:position.yPos,
        });
    }

    for(var s in SOCKET_LIST){
        var socket = SOCKET_LIST[s];
        socket.emit('newPosition', package);
    }

}, 1000 / 30);