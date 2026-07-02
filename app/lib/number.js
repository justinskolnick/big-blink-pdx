const numerals = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  10: 'ten',
  11: 'eleven',
  12: 'twelve',
};

const percentage = (portion, total) => Number.parseFloat(portion / total * 100).toFixed(2);

const toNumeral = (num) => {
  if (num in numerals) {
    return numerals[num];
  }

  return num;
};

module.exports = {
  percentage,
  toNumeral,
};
