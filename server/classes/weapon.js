const Bullet = require('./bullet');

class Weapon {

    /**
    * Represents a weapon
    * @constructor
    * @param {string} id The weapon's id (Most of the time this is the socket id)
    * @param {number} magSize The ammount of bullets that can fit in the weapons magazine
     */
    constructor (id, magSize) {
        this.id = id;
        this.type = 'semi';
        this.magSize = magSize;
        this.bulletsInMag = magSize;
    }

    shoot (id, playerId, xPos, yPos, maxSpd) {
        if (this.bulletsInMag) {
            let bullet = new Bullet(id, playerId, xPos, yPos, maxSpd);
            this.bulletsInMag--;

            return bullet;
        }

        return false;
    }

    reload () {
        this.bulletsInMag = this.magSize;
    }

    getBulletsInMag () {
        return this.bulletsInMag;
    }
}

module.exports = Weapon;