const percentage = (portion, total) => Number.parseFloat(portion / total * 100).toFixed(2);

module.exports = {
  percentage,
};
