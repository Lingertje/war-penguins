const _ = require('lodash');
const Entity = require('./entity');

class Player extends Entity {

    /**
     * Represents a player
     * @constructor
     * @param {string} id The player's id (Most of the time this is the socket id)
     * @param {number} xPos Position of the player on the x axis
     * @param {number} yPos Position of the player on the y axis
     * @param {number} maxSpd The maximum of the player
     */
    constructor (id, xPos, yPos, maxSpd) {
        super(xPos, yPos, maxSpd);

        this.id = id;
        this.width = 50;
        this.height = 50;
        this.health = 100;
        this.pressed = {
            left 	: false,
            right 	: false,
            up 		: false,
            down 	: false,
            sprint  : false
        };
        this.bullets = [];
    }

    /**
     *
     * @description Checks if a certain key is pressed and updates the position accordingly
     */
    updatePosition () {
        let position = this.getPosition();
        let maxSpd = this.maxSpd;

        if(this.pressed.sprint){
            maxSpd *= 1.8; //Higher max speed when sprint is pressed
        }

        if (this.pressed.right && this.xPos + this.width < 500) {
            position.xPos += maxSpd;
            this.direction = 'right';
        }
        if (this.pressed.left && this.xPos > 0) {
            position.xPos -= maxSpd;
            this.direction = 'left';
        }
        if (this.pressed.up && this.yPos > 0) {
            position.yPos -= maxSpd;
            this.direction = 'up';
        }
        if (this.pressed.down && this.yPos + this.height < 500) {
            position.yPos += maxSpd;
            this.direction = 'down';
        }

        this.setPosition(position.xPos, position.yPos);
    }

    /**
     *
     * @description Updates the bullets that a player has fired
     */
    updatePlayerBullets () {
        for (var b in this.bullets) {
            var bullet = this.bullets[b];

            if (bullet.isOutWindow()) {
                this.deletePlayerBullet(bullet.id);
            }

            bullet.updatePosition();
        }
    }

    /**
     *
     * @param Id of the bullet that needs to be removed
     * @description Remove a bullet from a player
     */
    deletePlayerBullet (bulletId) {
        const bullet = _.findIndex(this.bullets, { 'id': bulletId });

        return Promise.resolve(this.bullets.splice(bullet, 1)); //Remove bullet from array
    }

    /**
     * @param dmg The ammount of damage the hit did
     * @description Lowers health of the player on hit
     * @returns The current health of the player
     */
    takeDamage (dmg) {
        return this.health -= dmg;
    }
}

module.exports = Player;