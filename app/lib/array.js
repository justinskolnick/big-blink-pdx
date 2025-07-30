const getFirst = (arr = []) => arr.at(0);
const getLast = (arr = []) => arr.at(-1);

const unique = (arr) => [...new Set(arr)];

// https://dpericich.medium.com/how-to-quickly-get-a-unique-array-of-objects-in-javascript-f8a80182ee27
const uniqueObjects = (arr) => [...new Set(arr.map(JSON.stringify))].map(JSON.parse);

module.exports = {
  getFirst,
  getLast,
  unique,
  uniqueObjects,
};
