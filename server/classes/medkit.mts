import Entity from './entity.mjs';
import type Player from './player.mjs';

export interface Consumable extends Entity {
	use: (player: Player) => void;
}

export default class Medkit extends Entity implements Consumable {
	id: string;
	healAmount: number;

	constructor (id: string, xPos: number, yPos: number) {
		super(xPos, yPos, 55, 55);

		this.id = id;
		this.healAmount = 50;
	}

	use (player: Player): void {
		player.heal(this.healAmount);
	}
}
