const dayInMilliseconds = 1000 * 60 * 60 * 24;

// todo: replace with Temporal.PlainDate in Node 26
// const date1 = Temporal.PlainDate.from(dateString1);
// const date2 = Temporal.PlainDate.from(dateString2);
// const difference = date1.until(date2, { largestUnit: 'day' });
const getDaysApart = (dateString1, dateString2) => {
  const [date1, date2] = [dateString1, dateString2].map(d => new Date(d));
  const difference = Math.abs(date2 - date1);

  return Math.floor(difference / dayInMilliseconds);
};

const getMonthsToYears = (months, round = true) => {
  const value = months / 12;

  return round ? Math.round(value) : [Math.floor(value), months % 12];
};

const getYearsToMonths = (years) => years * 12;

module.exports = {
  getDaysApart,
  getMonthsToYears,
  getYearsToMonths,
};
