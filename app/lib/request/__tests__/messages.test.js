const {
  getDeprecatedParamMessage,
  getInvalidValueMessage,
  getOutOfRangeValueMessage,
} = require('../messages');

describe('getDeprecatedParamMessage()', () => {
  test('with a param value', () => {
    expect(getDeprecatedParamMessage('name')).toEqual('The <code>name</code> parameter has been deprecated and will be removed soon. Please recreate your filter and update your bookmarks.');
  });
});

describe('getInvalidValueMessage()', () => {
  test('with a param value', () => {
    expect(getInvalidValueMessage('name', 123)).toEqual('<strong>123</strong> is not a valid value for <code>name</code>.');
  });
});

describe('getOutOfRangeValueMessage()', () => {
  test('with a param value', () => {
    expect(getOutOfRangeValueMessage('name', 123)).toEqual('<strong>123</strong> is out of range for <code>name</code>.');
  });
});
