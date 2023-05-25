import Entity from './entity.js';

export default class Bullet extends Entity {
    id: string;
    playerId: string;
    dmg: number;
    distance: number;
	maxSpd: number;

    /**
     *
     * @description Represents a bullet
     */
    constructor (id: string, playerId: string, xPos: number, yPos: number, maxSpd: number) {
        super(xPos, yPos, 10, 10);

        this.id = id;
        this.playerId = playerId;
        this.dmg = 10;
        this.distance = 0;
		this.maxSpd = maxSpd;
    }

    /**
     *
     * @description Checks if a certain key is pressed and updates the position accordingly
     */
    updatePosition(): void {
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
     */
    isOutWindow(): boolean {
        return (this.xPos + this.width > 800 || this.xPos < -30 || this.yPos < -30 || this.yPos + this.width > 600);
    }
}
