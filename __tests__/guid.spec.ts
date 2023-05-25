import { guid } from '../server/helpers';

describe('guid', () => {
	it('should generate a unique ID', () => {
	  const id1 = guid();
	  const id2 = guid();

	  expect(id1).not.toBe(id2);
	});

	it('should generate a valid ID format', () => {
	  const id = guid();
	  const idRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

	  expect(id).toMatch(idRegex);
	});
  });
