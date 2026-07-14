const regions = require('../content/en/region-abbreviations.json');

const getRegionFromAbbreviation = (region) => {
  if (Object.hasOwn(regions, region)) {
    return regions[region];
  }

  return region;
};

module.exports = {
  getRegionFromAbbreviation,
};
