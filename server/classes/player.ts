import Entity from './entity.js';
import type Weapon from './weapon.js';

class Player extends Entity {
    id: string;
    alive: boolean;
    health: number;
    kills: number;
    weapon: Weapon;
    pressed: any;
	maxSpd: number;

    /**
     * Represents a player
     */
    constructor (id: string, xPos: number, yPos: number, maxSpd: number, weapon: Weapon) {
        super(xPos, yPos, 50, 50);

        this.id = id;
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
		this.maxSpd = maxSpd;
    }

    /**
     *
     * @description Checks if a certain key is pressed and updates the position accordingly
     */
    updatePosition (): void {
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
     * @description Lowers health of the player on hit
     */
    takeDamage (dmg: number): number {
        return this.health -= dmg;
    }

	heal(amount: number): void {
		if (this.health === 100) return;

		if (this.health + amount > 100) {
			this.health = 100;
		} else {
			this.health += amount;
		}
	}
}

export default Player;
