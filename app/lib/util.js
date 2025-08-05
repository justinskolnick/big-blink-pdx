const isEmpty = (item) => {
  if (!item) {
    return true;
  } else if (Array.isArray(item)) {
    return item.length === 0;
  } else if (typeof item === 'object') {
    return isEmpty(Object.values(item));
  } else if (typeof item === 'string') {
    return item.length === 0;
  }

  return null;
};

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
  isEmpty,
  isFalsy,
  isTruthy,
};
