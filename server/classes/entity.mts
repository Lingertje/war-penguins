export default class Entity {
    protected xPos: number;
    protected yPos: number;
 	width: number;
	height: number;
    direction?: string;

    /**
     * Abstract class that represents an entity
     */
    constructor (xPos: number, yPos: number, width: number, height: number) {
        if(new.target.name === 'Entity'){
            throw new TypeError('Abstract class \'Entity\' cannot be instantiated directly.');
        }

        this.xPos = xPos;
        this.yPos = yPos;
		this.width = width;
		this.height = height;
        this.direction;
    }

    /**
     *
     * @description Get the current position (x and y axis) of the entity
     */
    get position (): { xPos: number, yPos: number } {
        return {
            'xPos': this.xPos,
            'yPos': this.yPos
        };
    }

    /**
     * @description Set the current position (x and y axis) of the entity
     */
    set position ({ xPos, yPos }: { xPos: number, yPos: number }) {
        this.xPos = xPos;
        this.yPos = yPos;
    }
}
