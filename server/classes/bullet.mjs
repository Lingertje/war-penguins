import Entity from './entity.mjs';

class Bullet extends Entity {

    /**
     * Represents a bullet
     * @constructor
     * @param {string} id The bullet's id
     * @param {string} playerId The player's id (Most of the time this is the socket id)
     * @param {number} xPos Position of the bullet on the x axis
     * @param {number} yPos Position of the bullet on the y axis
     * @param {number} maxSpd The maximum of the bullet
     */
    constructor (id, playerId, xPos, yPos, maxSpd) {
        super(xPos, yPos, maxSpd);

        this.id = id;
        this.playerId = playerId;
        this.dmg = 10;
        this.width = 10;
        this.height = 10;
        this.distance = 0;
    }

    /**
     *
     * @description Checks if a certain key is pressed and updates the position accordingly
     */
    updatePosition(){
        let position = this.position;

        this.distance += this.maxSpd;

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

        this.position = {xPos: position.xPos, yPos: position.yPos};
    }

    /**
     *
     * @description Checks if a bullet is out of the canvas
     * @returns Boolean that corresponds whether a bullet is in or out of the window
     */
    isOutWindow(){
        return (this.xPos + this.width > 800 || this.xPos < -30 || this.yPos < -30 || this.yPos + this.width > 600);
    }
}

export default Bullet;