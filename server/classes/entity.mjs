class Entity {

    /**
     * Abstract class that represents an entity
     * @constructor
     * @param {number} xPos Position of the entity on the x axis
     * @param {number} yPos Position of the entity on the y axis
     * @param {number} maxSpd The maximum of the entity
     */
    constructor (xPos, yPos, maxSpd) {
        if(new.target.name === 'Entity'){
            throw new TypeError('Abstract class \'Entity\' cannot be instantiated directly.');
        }

        this.xPos = xPos;
        this.yPos = yPos;
        this.maxSpd = maxSpd;
        this.direction;
    }

    /**
     *
     * @description Get the current position (x and y axis) of the entity
     */
    get position () {
        return {
            'xPos': this.xPos,
            'yPos': this.yPos
        };
    }

    /**
     *
     * @param {number} xPos Position of the entity on the x axis
     * @param {number} yPos Position of the entity on the y axis
     * @description Set the current position (x and y axis) of the entity
     */
    set position ({ xPos, yPos }) {
        this.xPos = xPos;
        this.yPos = yPos;
    }
}

export default Entity;