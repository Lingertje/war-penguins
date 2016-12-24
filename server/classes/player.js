const Entity = require('./entity');

class Player extends Entity {

    /**
     * Represents a player
     * @constructor
     * @param {string} id The player's id (Most of the time this is the socket id)
     * @param {number} xPos Position of the player on the x axis
     * @param {number} yPos Position of the player on the y axis
     */
    constructor (id, xPos, yPos) {
        super(xPos, yPos);

        this.id = id;
        this.maxSpd = 5;
        this.direction = 'left';
        this.pressed = {
            left 	: false,
            right 	: false,
            up 		: false,
            down 	: false
        };


    }

    /**
     *
     * @description Checks if a certain key is pressed and updates the position accordingly
     */
    updatePosition(){
        let position = this.getPosition();

        if (this.pressed.right && this.xPos < 450) {
            position.xPos += this.maxSpd;
            this.direction = 'right';
        }
        if (this.pressed.left && this.xPos > 0) {
            position.xPos -= this.maxSpd;
            this.direction = 'left';
        }
        if (this.pressed.up && this.yPos > 0) {
            position.yPos -= this.maxSpd;
        }
        if (this.pressed.down && this.yPos < 450) {
            position.yPos += this.maxSpd;
        }

        this.setPosition(position.xPos, position.yPos);
    }

    /**
     *
     * @description Fires with the equipped weapon
     */
    shoot () {

    }
}

module.exports = Player;