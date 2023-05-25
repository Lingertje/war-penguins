export function collides (object1: any, object2: any): boolean {
	return object1.xPos < object2.xPos + object2.width &&
		object1.xPos + object1.width > object2.xPos &&
		object1.yPos < object2.yPos + object2.height &&
		object1.yPos + object1.height > object2.yPos;
}

// Generates a random ID
export function guid (): string {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}
