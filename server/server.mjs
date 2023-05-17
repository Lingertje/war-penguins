import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import * as http from 'http';
const server = http.createServer(app);
import { Server } from 'socket.io';
const io = new Server(server);

// Import files
import socket from './socketio/socket.mjs';
const socketio = socket(io);

// Serve static content
app.use(express.static('app'));

// Set port for server to listen to
app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
    res.sendFile('./app/index.html', { root: __dirname + '/..' });
});

server.listen(app.get('port'), () => {
    console.log('server is listening on  *:' + app.get('port'));
});
