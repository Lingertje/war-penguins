import _ from 'lodash';
import Bullet from './bullet.mjs';

class Weapon {

    /**
    * Represents a weapon
    * @constructor
    * @param {string} id The weapon's id (Most of the time this is the socket id)
    * @param {number} magSize The ammount of bullets that can fit in the weapons magazine
     */
    constructor (id, magSize, range) {
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
     * @returns {Bullet} returns the newly created bullet or false if the weapon is out of ammo
     */
    shoot (id, playerId, xPos, yPos, maxSpd) {
        if (this.bulletsInMag && Object.is(this.locked, false)) {
            let bullet = new Bullet(id, playerId, xPos, yPos, maxSpd);
            this.bulletsInMag--;

            return bullet;
        }

        return false;
    }

    /**
     *
     * @description Reloads the weapon and locks it for X seconds
     */
    reload () {
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
    updateBullets () {
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
     * @param Id of the bullet that needs to be removed
     * @description Remove a bullet from a player
     */
    deleteBullet (bulletId) {
        const bullet = _.findIndex(this.bullets, { 'id': bulletId });

        return Promise.resolve(this.bullets.splice(bullet, 1)); //Remove bullet from array
    }
}

export default Weapon;