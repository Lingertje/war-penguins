const Player = require('../classes/player');
const Weapon = require('../classes/weapon');
const Bullet = require('../classes/bullet');

let SOCKET_LIST = {};
let PLAYER_LIST = {};

exports = module.exports = (io) => {
    io.on('connection', (socket) => {
        SOCKET_LIST[socket.id] = socket;

        // Instantiate new player object and add player to PLAYER_LIST
        let weapon = new Weapon(guid(), 30);
        let player = new Player(socket.id, 0, 0, 5, weapon);
        let xPos = Math.floor((Math.random() * (500 - player.width)) + 1);
        let yPos = Math.floor((Math.random() * (500 - player.height)) + 1);
        player.setPosition(xPos, yPos);

        PLAYER_LIST[socket.id] = player;

        socket.emit('self', player);

        //Emit to everyone except the current socket that a user has connected
        socket.broadcast.emit('connected', 'A user has connected.');

        socket.on('keyPress', data => {
            handleKeyPress(player, data, io);
        });

        socket.on('playerHit', data => {
            let player = PLAYER_LIST[data.player.id];
            let shooter = PLAYER_LIST[data.bullet.playerId];
            let bullet = data.bullet;

            shooter.weapon.deleteBullet(data.bullet.id)
                .then(result => {
                    if (result.length) {
                        player.takeDamage(bullet.dmg)

                        if(player && player.health <= 0){
                            delete PLAYER_LIST[player.id];
                        }
                    }
                }); //Remove bullet from the player that fired it
        });

        socket.on('disconnect', () => {
           delete SOCKET_LIST[socket.id];
           delete PLAYER_LIST[socket.id];

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

                player.weapon.bullets.push(bullet);
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

//Generates a random ID
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

//Send every connected socket package data 30 times a second
setInterval(() => {
    let package = [];

    for (let p in PLAYER_LIST) {
        let player = PLAYER_LIST[p];
        player.updatePosition();
        player.weapon.updateBullets();
        package.push(player);
    }

    for (let s in SOCKET_LIST) {
        let socket = SOCKET_LIST[s];
        socket.emit('updatePosition', package);
    }

}, 1000 / 30);