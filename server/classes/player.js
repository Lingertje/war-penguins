class Player {

    /**
     * Represents a player
     * @constructor
     * @param {string} id The player's id (Most of the time this is the socket id)
     * @param {number} xPos Position of the player on the x axis
     * @param {number} yPos Position of the player on the y axis
     */
    constructor(id, xPos, yPos){
        this.id = id;
        this.xPos = xPos;
        this.yPos = yPos;
        this.maxSpd = 10;
    }

    getPosition() {
        return {
            'xPos': this.xPos,
            'yPos': this.yPos
        };
    }

    /**
     *
     * @param {number} xPos Position of the player on the x axis
     * @param {number} yPos Position of the player on the y axis
     */
    setPosition(xPos, yPos){
        this.xPos = xPos;
        this.yPos = yPos;
    }
}

module.exports = Player;