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
            down 	: false
        };
        this.bullets = [];
    }

    /**
     *
     * @description Checks if a certain key is pressed and updates the position accordingly
     */
    updatePosition () {
        let position = this.getPosition();

        if (this.pressed.right && this.xPos + this.width < 500) {
            position.xPos += this.maxSpd;
            this.direction = 'right';
        }
        if (this.pressed.left && this.xPos > 0) {
            position.xPos -= this.maxSpd;
            this.direction = 'left';
        }
        if (this.pressed.up && this.yPos > 0) {
            position.yPos -= this.maxSpd;
            this.direction = 'up';
        }
        if (this.pressed.down && this.yPos + this.height < 500) {
            position.yPos += this.maxSpd;
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
                this.bullets.splice(Number(b), 1);
            }

            bullet.updatePosition();
        }
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