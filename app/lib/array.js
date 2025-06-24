const getFirst = (arr = []) => arr.at(0);
const getLast = (arr = []) => arr.at(-1);

const unique = (arr) => [...new Set(arr)];

module.exports = {
  getFirst,
  getLast,
  unique,
};
