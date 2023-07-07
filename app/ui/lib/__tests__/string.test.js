import { toSentence } from '../string';

describe('toSentence()', () => {
  const locale = 'en';

  test('should return the array as a comma-delimited list.', () => {
    expect(toSentence(['x'], locale)).toEqual('x');
    expect(toSentence(['x', 'y'], locale)).toEqual('x and y');
    expect(toSentence(['x', 'y', 'z'], locale)).toEqual('x, y, and z');
    expect(toSentence(['x', 'y', 'z'], locale, false)).toEqual('x, y, or z');
  });
});
