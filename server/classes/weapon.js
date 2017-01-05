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

    shoot () {
        if (bulletsInMag) {
            this.bulletsInMag -= 1;
        }

    }

    reload () {
        this.bulletsInMag = this.magSize;
    }
}

module.exports = Weapon;