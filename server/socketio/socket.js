const World = require('../classes/world');
const Player = require('../classes/player');
const Weapon = require('../classes/weapon');
const Bullet = require('../classes/bullet');

let SOCKET_LIST = {};
let WORLD_LIST = [];

exports = module.exports = (io) => {

    io.on('connection', (socket) => {
        SOCKET_LIST[socket.id] = socket;

        // Instantiate new player object and add player to game world
        let weapon = new Weapon(guid(), 30);
        let player = new Player(socket.id, 0, 0, 5, weapon);
        let xPos = Math.floor((Math.random() * (500 - player.width)) + 1);
        let yPos = Math.floor((Math.random() * (500 - player.height)) + 1);
        player.setPosition(xPos, yPos);
        let world = addPlayerToWorld(player);

        socket.emit('self', player);

        //Emit to everyone except the current socket that a user has connected
        socket.broadcast.emit('connected', 'A user has connected.');

        socket.on('keyPress', data => {
            if (Object.is(player.alive, true)) {
                handleKeyPress(player, data, io);
            }
        });

        socket.on('playerHit', data => {
            let player = world.getPlayer(data.player.id);
            let shooter = world.getPlayer(data.bullet.playerId);
            let bullet = data.bullet;

            shooter.weapon.deleteBullet(data.bullet.id)
                .then(result => {
                    if (result.length) {
                        player.takeDamage(bullet.dmg)

                        if(player && player.health <= 0){
                            shooter.kills += 1;
                            player.alive = false;
                        }
                    }
                }); //Remove bullet from the player that fired it
        });

        socket.on('disconnect', () => {
           delete SOCKET_LIST[socket.id];
           world.deletePlayer(socket.id);

           socket.broadcast.emit('disconnected', 'A user has disconnected.');
        });
    });
};

function handleKeyPress(player, data, io) {
    let weapon = player.weapon;

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

    //Check for spacebar and fire bullet (player can't shoot while sprinting)
    if (Object.is(data.inputId, 32) && Object.is(player.pressed.sprint, false)) {
        if (data.state && !player.pressed.shooting) {
            let position = player.getPosition();

            if(weapon.getBulletsInMag() && !weapon.locked) {
                let bullet = weapon.shoot(guid(), player.id, position.xPos, position.yPos, 10);
                bullet.direction = player.direction;

                weapon.bullets.push(bullet);
                io.sockets.emit('gunshot', {fileName: 'gunshot.wav', xPos: player.xPos, yPos: player.yPos});
            } else {
                io.sockets.emit('emptyShot', {fileName: 'emptyShot.wav', xPos: player.xPos, yPos: player.yPos});
            }
        }

        player.pressed.shooting = data.state;
    }

    //Check for shift
    if (Object.is(data.inputId, 16)) {
        player.pressed.sprint = data.state;
    }

    //Check for r (reload)
    if (Object.is(data.inputId, 82)) {
        if(data.state && !weapon.pressed.reload && weapon.bulletsInMag !== 30 && !weapon.locked) {
            weapon.reload();
            io.sockets.emit('reload', {fileName: 'reload.wav', xPos: player.xPos, yPos: player.yPos});
        }

        weapon.pressed.reload = data.state;
    }
}

// Add player to a world
function addPlayerToWorld (player) {
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
function guid() {
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
        let package = world.update();

        for (let p in world.players) {
            let socket = SOCKET_LIST[p];
            socket.emit('updatePosition', package);
        }
    }

}, 1000 / 30); // each 30 times a second

// Remove empty worlds from array
setInterval(() => {
    for (let i in WORLD_LIST) {
        let world = WORLD_LIST[i];

        if (!world.playerCount) {
            delete WORLD_LIST[i];
            console.log('World (id: ' + world.id + ') deleted with ' + world.playerCount + ' players');
        }
    }

}, 1000 * 30); // each 30 seconds