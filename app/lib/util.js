const isFalsyValue = (value) => ['0', 0, 'false', false].includes(value);
const isFalsy = (value) => {
  if (isFalsyValue(value)) return true;
  if (isTruthyValue(value)) return false;

  return !value;
};

const isTruthyValue = (value) => ['1', 1, 'true', true].includes(value);
const isTruthy = (value) => {
  if (isTruthyValue(value)) return true;
  if (isFalsyValue(value)) return false;

  return Boolean(value);
};

module.exports = {
  isFalsy,
  isTruthy,
};
