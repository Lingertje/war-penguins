function collides (object1, object2) {
	return object1.xPos < object2.xPos + object2.width &&
		object1.xPos + object1.width > object2.xPos &&
		object1.yPos < object2.yPos + object2.height &&
		object1.yPos + object1.height > object2.yPos;
}

export { collides }; 