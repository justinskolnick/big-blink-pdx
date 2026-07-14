const {
  getRegionFromAbbreviation,
} = require('../location');

describe('getRegionFromAbbreviation()', () => {
  test('returns the expected values', () => {
    expect(getRegionFromAbbreviation('AB')).toEqual('Alberta');
    expect(getRegionFromAbbreviation('AZ')).toEqual('Arizona');
    expect(getRegionFromAbbreviation('CA')).toEqual('California');
    expect(getRegionFromAbbreviation('DC')).toEqual('Washington, D.C.');
    expect(getRegionFromAbbreviation('IL')).toEqual('Illinois');
    expect(getRegionFromAbbreviation('MA')).toEqual('Massachusetts');
    expect(getRegionFromAbbreviation('MN')).toEqual('Minnesota');
    expect(getRegionFromAbbreviation('MO')).toEqual('Missouri');
    expect(getRegionFromAbbreviation('NJ')).toEqual('New Jersey');
    expect(getRegionFromAbbreviation('NY')).toEqual('New York');
    expect(getRegionFromAbbreviation('OH')).toEqual('Ohio');
    expect(getRegionFromAbbreviation('OR')).toEqual('Oregon');
    expect(getRegionFromAbbreviation('Oregon')).toEqual('Oregon');
    expect(getRegionFromAbbreviation('TX')).toEqual('Texas');
    expect(getRegionFromAbbreviation('WA')).toEqual('Washington');
  });
});
