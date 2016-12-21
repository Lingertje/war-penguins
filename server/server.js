const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Import files
const socketio = require('./socketio/socket')(io);

// Set port for server to listen to
app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
    res.sendFile('./app/index.html', { root: __dirname + '/..' });
});

http.listen(app.get('port'), () => {
    console.log('server is listening on  *:' + app.get('port'));
});
