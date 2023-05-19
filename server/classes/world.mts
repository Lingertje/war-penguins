import { collides } from '../helpers/index.mjs';

class World {
    id;
    players;
    playerCount;
    playerMax;
    package;

    /**
     * Represents a world
     * @constructor
     * @param {string} id The world's id
     */
    constructor (id, playerMax = 4) {
        this.id = id;
        this.players = {};
        this.playerCount = 0;
        this.playerMax = playerMax;
    }

    /**
     *
     * @description Add player to the world
     * @param {Object} player Object representing the player
     */
    addPlayer (player) {
        this.players[player.id] = player;
        this.playerCount += 1;
    }

    /**
     *
     * @description Return requested player
     * @param {string} playerid Id of the player id
     */
    getPlayer (playerId) {
        return this.players[playerId];
    }

    /**
     *
     * @description Delete player to the world
     * @param {string} playerid Id of the player id
     */
    deletePlayer (playerId) {
        delete this.players[playerId];
        this.playerCount -= 1;
    }

    /**
     *
     * @description Updates all the players in the world
     * @returns {Array} package Package containing all the updated users
     */
    update () {
        this.package = [];

        for (let p in this.players) {
            const player = this.players[p];
            const weapon = player.weapon;
            const bullets = weapon.bullets;

            if (player.alive) {
                player.updatePosition();
            }

            bullets.forEach(bullet => {
                this.handleCollision(bullet, this.players);
            });

            weapon.updateBullets();

            this.package.push(player);
        }

        return this.package;
    }

    async handleCollision (bullet, players) {
        for(let pid in players) { 
            const player = players[pid];
            const shooter = this.getPlayer(bullet.playerId);

            if (player.id !== bullet.playerId && player.alive) {
                if (collides(bullet, player)) {
                    const result = await shooter.weapon.deleteBullet(bullet.id)

                    if (result.length) {
                        if(player && player.takeDamage(bullet.dmg) <= 0){
                            shooter.kills += 1;
                            player.alive = false;
                        }
                    }
                }
            }
        };
    }
}

export default World;