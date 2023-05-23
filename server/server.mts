import dotenv from 'dotenv';
dotenv.config();
import express, { Express, Request, Response } from 'express';
const app: Express = express();
import * as http from 'http';
const server = http.createServer(app);
import { Server } from 'socket.io';
const io = new Server(server);

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Import files
import socket from './socketio/socket.mjs';
socket(io);

// Set port for server to listen to
app.set('port', process.env.PORT || 8080);

app.get('/', (req: Request, res: Response) => {
    res.sendFile(`app/public/index.html`, { root: __dirname + '/..' });
});

// Serve static content
app.use(express.static('app/public'));

server.listen(app.get('port'), () => {
    console.log('server is listening on  *:' + app.get('port'));
});
