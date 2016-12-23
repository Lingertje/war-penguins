class Entity {

    /**
     * Abstract class that represents an Entity
     * @constructor
     * @param {number} xPos Position of the player on the x axis
     * @param {number} yPos Position of the player on the y axis
     */
    constructor (xPos, yPos) {
        if(new.target.name === 'Entity'){
            throw new TypeError('Abstract class \'Entity\' cannot be instantiated directly.');
        }

        this.xPos = xPos;
        this.yPos = yPos;
    }

    /**
     *
     * @description Get the current position (x and y axis) of the entity
     */
    getPosition () {
        return {
            'xPos': this.xPos,
            'yPos': this.yPos
        };
    }

    /**
     *
     * @param {number} xPos Position of the player on the x axis
     * @param {number} yPos Position of the player on the y axis
     * @description Set the current position (x and y axis) of the entity
     */
    setPosition (xPos, yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
    }
}

module.exports = Entity;