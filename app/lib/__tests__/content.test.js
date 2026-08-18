jest.mock('marked', () => ({
  marked: Object.assign(
    jest.fn().mockReturnValue('<p></p>'),
    {
      parse: jest.fn().mockReturnValue('<p></p>'),
    }
  ),
}));

const { marked } = require('marked');

const {
  getContent,
  getMarkdownContent,
} = require('../content');

describe('getContent()', () => {
  describe('with an existing file', () => {
    test('returns the expected value', async () => {
      const result = await getContent('sources-introduction.md');

      expect(result).toEqual('The sources of the data used on this site are grouped by type below.');
    });
  });

  describe('with a non-existing file', () => {
    test('returns the expected value', async () => {
      const result = await getContent('sources-introduction.txt');

      expect(result.message).toEqual("ENOENT: no such file or directory, access '/usr/src/app/content/en/sources-introduction.txt'");
    });
  });
});

describe('getMarkdownContent()', () => {
  let result;

  beforeEach(async () => {
    result = await getMarkdownContent('sources-introduction');
  });

  test('calls marked with the expected value', async () => {
    expect(marked.parse).toHaveBeenCalledWith('The sources of the data used on this site are grouped by type below.');
  });

  test('returns the expected value', async () => {
    expect(result).toEqual('<p></p>');
  });
});
