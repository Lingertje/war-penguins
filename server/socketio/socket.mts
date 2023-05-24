import { Server, Socket } from 'socket.io';

import World from '../classes/world.mjs';
import Player from '../classes/player.mjs';
import Weapon from '../classes/weapon.mjs';
import { collides, guid } from '../helpers/index.mjs';
import Medkit from '../classes/medkit.mjs';

let SOCKET_LIST: Map<string, Socket> = new Map();
let WORLD_LIST: Array<World> = [];
let IO: Server;

export default (io: Server) => {
	IO = io;
    io.on('connection', (socket) => {
        SOCKET_LIST.set(socket.id, socket);

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
			socket.emit('medkit', Array.from(world.consumables.values()));
        }, 50);


        //Emit to everyone except the current socket that a player has connected
        socket.to(world.id).emit('connected', 'A player has connected.');

        socket.on('keyPress', data => {
            if (Object.is(player.alive, true)) {
                handleKeyPress(player, data, io, world);
            }
        });

        socket.on('disconnect', () => {
        	SOCKET_LIST.delete(socket.id);
        	world.deletePlayer(socket.id);

        	socket.to(world.id).emit('disconnected', 'A player has disconnected.');
        });
    });
};

const handleKeyPress = (player: Player, data: { inputId: string, state: boolean }, io: Server, world: World) => {
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

            try {
                let bullet = weapon.shoot(guid(), player.id, position.xPos, position.yPos, 10);
                bullet.direction = player.direction;

                weapon.bullets.push(bullet);
                io.sockets.to(world.id).emit('gunshot', {fileName: 'gunshot.wav', xPos: position.xPos, yPos: position.yPos});
            } catch (e) {
                io.sockets.to(world.id).emit('emptyShot', {fileName: 'emptyShot.wav', xPos: position.xPos, yPos: position.yPos});
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
            let position = player.position;
            weapon.reload();
            io.sockets.to(world.id).emit('reload', {fileName: 'reload.wav', xPos: position.xPos, yPos: position.yPos});
        }

        weapon.pressed.reload = data.state;
    }

	// Check for e (use medkit)
	if (Object.is(data.inputId, 'e')) {
		if (data.state) {
			const consumables = world.consumables;

			for (let [key, consumable] of consumables) {
				if (collides(player, consumable)) {
					const socket = SOCKET_LIST.get(player.id) as Socket;
					const position = player.position;

					player.weapon.locked = true;
					consumable.use(player);
					world.deleteConsumable(key);

					setTimeout(() => {
						player.weapon.locked = false;
					}, 1500)

					IO.to(world.id).emit('medkit', Array.from(world.consumables.values()));
					socket.emit('medkitPickup', {fileName: 'medkit.wav', xPos: position.xPos, yPos: position.yPos});

				}
			}


		}
	}
}

// Add player to a world
const addPlayerToWorld = (player: Player): World => {
    let world: World;

    if (WORLD_LIST.length === 0 || WORLD_LIST[WORLD_LIST.length - 1].playerCount >= WORLD_LIST[WORLD_LIST.length - 1].playerMax) { // If there is no world or latest world has more than 4 players create a new world
        world = new World(guid(), 4); // World instance
        WORLD_LIST.push(world);
    } else {
        world = WORLD_LIST[WORLD_LIST.length - 1]; // Add player to latest world
    }

    world.addPlayer(player); // Add player to game world
    return world;
}

// Send every connected socket package data 30 times a second
setInterval(() => {
    for (let i in WORLD_LIST) {
        let world = WORLD_LIST[i];
        let load = world.update();

        for (let [ pid ] of world.players) {
            let socket = SOCKET_LIST.get(pid) as Socket;
            socket.emit('updatePosition', load);
        }
    }

}, 1000 / 30); // Runs 30 times a second

setInterval(() => {
	for (let i in WORLD_LIST) {
		const randomNum1 = Math.floor((Math.random() * 20 + 1));
		const randomNum2 = Math.floor((Math.random() * 20 + 1));
		if (randomNum1 !== randomNum2) continue;

		let world = WORLD_LIST[i];
		const consumable = new Medkit(guid(), Math.floor((Math.random() * (500 - 50)) + 1), Math.floor((Math.random() * (500 - 50)) + 1));

		world.addConsumable(consumable);
		IO.to(world.id).emit('medkit', Array.from(world.consumables.values()));
	}

}, 1000); // Runs each second

// Remove empty worlds from WORLD_LIST array
setInterval(() => {
    for (let i in WORLD_LIST) {
        let world = WORLD_LIST[i];

        if (!world.playerCount) {
            delete WORLD_LIST[i];
            console.log('World (id: ' + world.id + ') deleted with ' + world.playerCount + ' players');
        }
    }

}, 1000 * 30); // Runs each 30 seconds
