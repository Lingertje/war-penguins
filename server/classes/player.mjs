import Entity from './entity.mjs';

class Player extends Entity {

    /**
     * Represents a player
     * @constructor
     * @param {string} id The player's id (Most of the time this is the socket id)
     * @param {number} xPos Position of the player on the x axis
     * @param {number} yPos Position of the player on the y axis
     * @param {number} maxSpd The maximum of the player
     */
    constructor (id, xPos, yPos, maxSpd, weapon) {
        super(xPos, yPos, maxSpd);

        this.id = id;
        this.width = 50;
        this.height = 50;
        this.alive = true;
        this.health = 100;
        this.kills = 0;
        this.weapon = weapon;
        this.pressed = {
            left 	: false,
            right 	: false,
            up 		: false,
            down 	: false,
            sprint  : false,
            shooting: false
        };
    }

    /**
     *
     * @description Checks if a certain key is pressed and updates the position accordingly
     */
    updatePosition () {
        let position = this.position;
        let maxSpd = this.maxSpd;

        if(this.pressed.sprint){
            maxSpd *= 1.6; //Higher max speed when sprint is pressed
        }

        if (this.pressed.right && this.xPos + this.width < 800) {
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
        if (this.pressed.down && this.yPos + this.height < 600) {
            position.yPos += maxSpd;
            this.direction = 'down';
        }

        this.position = {xPos: position.xPos, yPos: position.yPos};
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

export default Player;