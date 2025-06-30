const DATE_PATTERN = /^20[1|2][\d]-[\d]{2}-[\d]{2}$/;
const QUARTER_PATTERN = /^Q([1-4])-(20[1-2][0-9])$/i;
const QUARTER_PATTERN_ALT = /^(20[1-2][0-9])-q([1-4])$/i;
const YEAR_PATTERN = /^20[1-2][0-9]$/;

module.exports = {
  DATE_PATTERN,
  QUARTER_PATTERN,
  QUARTER_PATTERN_ALT,
  YEAR_PATTERN,
};
