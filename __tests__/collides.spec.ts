import { collides } from "../server/helpers";

describe('collides', () => {
	it("should return true if two objects collide", () => {
		expect(collides({xPos: 0, yPos: 0, width: 10, height: 10}, {xPos: 5, yPos: 5, width: 10, height: 10})).toBeTruthy();
	});
	it("should return false if two objects don't collide", () => {
		expect(collides({xPos: 0, yPos: 0, width: 10, height: 10}, {xPos: 15, yPos: 15, width: 10, height: 10})).toBeFalsy();
	});
});
