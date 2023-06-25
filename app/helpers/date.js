const locale = 'en-US';
const timeZone = 'America/Los_Angeles';

// todo: handle YYYY-MM-DD as local

const parseDateString = (dateString) => {
  if (/^[\d]{4}-[\d]{2}-[\d]{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-').map(Number);
    const parsed = new Date();

    parsed.setFullYear(year);
    parsed.setMonth(month - 1);
    parsed.setDate(day);
    parsed.setHours(0);
    parsed.setMinutes(0);
    parsed.setSeconds(0);
    parsed.setMilliseconds(0);

    return parsed;
  }

  return new Date(dateString);
};

const formatDateString = (dateString, setTimeZone = false) => {
  const date = parseDateString(dateString);
  const options = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };

  if (setTimeZone) {
    options.timeZone = timeZone;
  }

  return new Intl.DateTimeFormat(locale, options).format(date);
};

module.exports = {
  formatDateString,
};
