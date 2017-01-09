class World {

    /**
     * Represents a world
     * @constructor
     * @param {string} id The world's id
     */
    constructor (id) {
        this.id = id;
        this.players = {};
        this.playerCount = 0;
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
            let player = this.players[p];
            let weapon = player.weapon;

            if (player.alive) {
                player.updatePosition();
            }

            weapon.updateBullets();

            this.package.push(player);
        }

        return this.package;
    }

}

module.exports = World;