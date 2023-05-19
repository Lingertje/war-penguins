import World from '../classes/world.mjs';
import Player from '../classes/player.mjs';
import Weapon from '../classes/weapon.mjs';

let SOCKET_LIST = {};
let WORLD_LIST: Array<any> = [];

export default (io) => {

    io.on('connection', (socket) => {
        SOCKET_LIST[socket.id] = socket;

        // Instantiate new player object and add player to game world
        let weapon = new Weapon(guid(), 30, 500);
        let player = new Player(socket.id, 0, 0, 5, weapon);
        let xPos = Math.floor((Math.random() * (500 - player.width)) + 1);
        let yPos = Math.floor((Math.random() * (500 - player.height)) + 1);
        player.position = {xPos, yPos};
        let world = addPlayerToWorld(player);
        socket.join(world.id);

        socket.emit('world', world.id);

        setTimeout(() => {
            socket.emit('self', player);
        }, 50);


        //Emit to everyone except the current socket that a player has connected
        socket.to(world.id).emit('connected', 'A player has connected.');

        socket.on('keyPress', data => {
            if (Object.is(player.alive, true)) {
                handleKeyPress(player, data, io, world);
            }
        });

        socket.on('disconnect', () => {
           delete SOCKET_LIST[socket.id];
           world.deletePlayer(socket.id);

           socket.to(world.id).emit('disconnected', 'A player has disconnected.');
        });
    });
};

const handleKeyPress = (player, data, io, world) => {
    let weapon = player.weapon;

    //Check for arrow keys and wasd keys
    if (Object.is(data.inputId, 'd') || Object.is(data.inputId, 'ArrowRight')) {
        player.pressed.right = data.state;
    }
    if (Object.is(data.inputId, 'a') || Object.is(data.inputId, 'ArrowLeft')) {
        player.pressed.left = data.state;
    }
    if (Object.is(data.inputId, 'w') || Object.is(data.inputId, 'ArrowUp')) {
        player.pressed.up = data.state;
    }
    if (Object.is(data.inputId, 's') || Object.is(data.inputId, 'ArrowDown')) {
        player.pressed.down = data.state;
    }

    //Check for spacebar and fire bullet (player can't shoot while sprinting)
    if (Object.is(data.inputId, ' ') && Object.is(player.pressed.sprint, false)) {
        if (data.state && !player.pressed.shooting) {
            let position = player.position;

            if(weapon.bulletsInMag && !weapon.locked) {
                let bullet = weapon.shoot(guid(), player.id, position.xPos, position.yPos, 10);
                bullet.direction = player.direction;

                weapon.bullets.push(bullet);
                io.sockets.to(world.id).emit('gunshot', {fileName: 'gunshot.wav', xPos: player.xPos, yPos: player.yPos});
            } else {
                io.sockets.to(world.id).emit('emptyShot', {fileName: 'emptyShot.wav', xPos: player.xPos, yPos: player.yPos});
            }
        }

        player.pressed.shooting = data.state;
    }

    //Check for shift
    if (Object.is(data.inputId, 'Shift')) {
        player.pressed.sprint = data.state;
    }

    //Check for r (reload)
    if (Object.is(data.inputId, 'r')) {
        if(data.state && !weapon.pressed.reload && weapon.bulletsInMag !== 30 && !weapon.locked) {
            weapon.reload();
            io.sockets.to(world.id).emit('reload', {fileName: 'reload.wav', xPos: player.xPos, yPos: player.yPos});
        }

        weapon.pressed.reload = data.state;
    }
}

// Add player to a world
const addPlayerToWorld = (player) => {
    let world;

    if (WORLD_LIST.length === 0 || WORLD_LIST[WORLD_LIST.length - 1].playerCount >= WORLD_LIST[WORLD_LIST.length - 1].playerMax) { // If there is no world or latest world has more than 4 players create a new world
        world = new World(guid(), 4); // World instance
        WORLD_LIST.push(world);
    } else {
        world = WORLD_LIST[WORLD_LIST.length - 1]; // Add player to latest world
    }

    world.addPlayer(player); // Add player to game world
    return world;
}

// Generates a random ID
const guid = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

// Send every connected socket package data 30 times a second
setInterval(() => {
    for (let i in WORLD_LIST) {
        let world = WORLD_LIST[i];
        let load = world.update();

        for (let p in world.players) {
            let socket = SOCKET_LIST[p];
            socket.emit('updatePosition', load);
        }
    }

}, 1000 / 30); // each 30 times a second

// Remove empty worlds from WORLD_LIST array
setInterval(() => {
    for (let i in WORLD_LIST) {
        let world = WORLD_LIST[i];

        if (!world.playerCount) {
            delete WORLD_LIST[i];
            console.log('World (id: ' + world.id + ') deleted with ' + world.playerCount + ' players');
        }
    }

}, 1000 * 30); // each 30 seconds