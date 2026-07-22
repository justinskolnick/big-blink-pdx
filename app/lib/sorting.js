const sortDateStartDescending = (a, b) => (b.dateStart > a.dateStart) ? 1 : (b.dateStart < a.dateStart) ? -1 : 0;

const sortTotalDescending = (a, b) => (b.total > a.total) ? 1 : (b.total < a.total) ? -1 : 0;

module.exports = {
  sortDateStartDescending,
  sortTotalDescending,
};
