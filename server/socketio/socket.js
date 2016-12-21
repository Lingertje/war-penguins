exports = module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('message', (msg) => { // TODO: Remove this route, just for testing
            socket.emit('message', msg);
        });

        socket.on('keyPress', (data) => {
            // TODO: do something with the position update
        });

        socket.on('disconnect', () => {
           console.log('A user has disconnected');
        });
    });
};