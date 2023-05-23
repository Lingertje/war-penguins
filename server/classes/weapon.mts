import Bullet from './bullet.mjs';

export default class Weapon {
    id: string;
    type: 'semi' | 'auto';
    range: number;
    magSize: number;
    bulletsInMag: number;
    locked: boolean;
    bullets: Array<Bullet>;
    pressed: any;

    /**
    * Represents a weapon
     */
    constructor (id: string, magSize: number, range: number) {
        this.id = id;
        this.type = 'semi';
        this.range = range;
        this.magSize = magSize;
        this.bulletsInMag = magSize;
        this.locked = false;
        this.bullets = [];
        this.pressed = {
            reload: false
        };
    }

    /**
     *
     * @description Creates a new bullet object
     */
    shoot (id: string, playerId: string, xPos: number, yPos: number, maxSpd: number): Bullet {
        if (!this.bulletsInMag || Object.is(this.locked, true)) throw new Error('Weapon is out of ammo or locked');

        let bullet = new Bullet(id, playerId, xPos, yPos, maxSpd);
        this.bulletsInMag--;

        return bullet;
    }

    /**
     *
     * @description Reloads the weapon and locks it for X seconds
     */
    reload (): void {
        this.locked = true; // Lock the weapon so you can't shoot while reloading

        setTimeout(() => {
            this.bulletsInMag = this.magSize;
            this.locked = false;
        }, 1000);
    }

    /**
     *
     * @description Updates the bullets that a player has fired
     */
    updateBullets (): void | Promise<Bullet[]> {
        for (var b in this.bullets) {
            var bullet = this.bullets[b];

            if (bullet.isOutWindow() || this.range < bullet.distance) {
                return this.deleteBullet(bullet.id);
            }

            bullet.updatePosition();
        }
    }

    /**
     *
     * @description Remove a bullet from a player
     */
    deleteBullet (bulletId: string): Promise<Bullet[]> {
        const bullet = this.bullets.findIndex(bullet => bullet.id === bulletId);

        return Promise.resolve(this.bullets.splice(bullet, 1)); //Remove bullet from array
    }
}
