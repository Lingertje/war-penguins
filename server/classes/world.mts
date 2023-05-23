import { collides } from '../helpers/index.mjs';
import Bullet from './bullet.mjs';
import Player from './player.mjs';

class World {
    id: string;
    players: any; // TODO: can we change this to an array?
    playerCount: number;
    playerMax: number;

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
     */
    addPlayer (player: Player): void {
        this.players[player.id] = player;
        this.playerCount += 1;
    }

    /**
     *
     * @description Return requested player
     */
    getPlayer (playerId: string): Player {
        return this.players[playerId];
    }

    /**
     *
     * @description Delete player to the world
     */
    deletePlayer (playerId: string): void {
        delete this.players[playerId];
        this.playerCount -= 1;
    }

    /**
     *
     * @description Updates all the players in the world
     */
    update (): Array<Player> {
        const playerArray: Array<Player> = [];

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

            playerArray.push(player);
        }

        return playerArray;
    }

    async handleCollision (bullet: Bullet, players: any): Promise<void> {
        for(let pid in players) { 
            const player: Player = players[pid];
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