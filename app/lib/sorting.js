const sortTotalDescending = (a, b) => (b.total > a.total) ? 1 : (b.total < a.total) ? -1 : 0;

module.exports = {
  sortTotalDescending,
};
