const Player = require('../classes/player');

let SOCKET_LIST = {};
let PLAYER_LIST = {};

exports = module.exports = (io) => {
    io.on('connection', (socket) => {
        SOCKET_LIST[socket.id] = socket;

        // Instantiate new player object and add player to PLAYER_LIST
        var player = new Player(socket.id, 40, 250);
        PLAYER_LIST[socket.id] = player;

        socket.on('message', (msg) => { // TODO: Remove this route, just for testing
            socket.emit('message', player);
        });

        socket.on('keyPress', (data) => {
            handleKeyPress(data);
            // TODO: do something with the position update
        });

        socket.on('disconnect', () => {
           console.log('A user has disconnected');
        });
    });
};

function handleKeyPress(data) {

}

function updatePosition(data) {

}