const Entity = require('./entity');

/**
 * Represents a player
 * @constructor
 * @param {string} id The player's id (Most of the time this is the socket id)
 * @param {number} xPos Position of the bullet on the x axis
 * @param {number} yPos Position of the bullet on the y axis
 * @param {number} maxSpd The maximum of the bullet
 */
class Bullet extends Entity {
    constructor (id, xPos, yPos, maxSpd) {
        super(xPos, yPos, maxSpd);

        this.id = id;
    }

    /**
     *
     * @description Checks if a certain key is pressed and updates the position accordingly
     */
    updatePosition(){
        let position = this.getPosition();

        if (!this.direction || this.direction === 'right') {
            position.xPos += this.maxSpd;
        }
        if (this.direction === 'left' && this.xPos) {
            position.xPos -= this.maxSpd;
        }
        if (this.direction === 'up' && this.yPos) {
            position.yPos -= this.maxSpd;
        }
        if (this.direction === 'down' && this.yPos) {
            position.yPos += this.maxSpd;
        }

        this.setPosition(position.xPos, position.yPos);
    }

    isOutWindow(){
        if (this.xPos > 490 || this.xPos < -30 || this.yPos < -30 || this.yPos > 490) {
            return true;
        }

        return false;
    }
}

module.exports = Bullet;