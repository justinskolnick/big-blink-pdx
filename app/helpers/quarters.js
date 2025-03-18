const { LOCALE, QUARTERS } = require('../config/constants');

const { getFirst, getLast } = require('../lib/array');

const getRangesByYear = data => {
  const byYear = data.reduce((all, entry) => {
    const { year, quarter } = entry;

    if (year in all) {
      all[year].push(quarter);
    } else {
      all[year] = [quarter];
    }

    return all;
  }, {});

  return Object.entries(byYear).reduce((all, [year, quarters]) => {
    QUARTERS.forEach(q => {
      if (quarters.includes(q)) {
        all.push({
          year: Number(year), quarter: q,
        });
      } else if (all.at(-1) !== null) {
        all.push(null);
      }
    });

    return all;
  }, []);
};

const getRangesByYearSet = data => {
  const ranges = getRangesByYear(data);

  return ranges.reduce((all, quarter, i, source) => {
    const isLast = i === source.length - 1;

    if (quarter !== null) {
      if (all.length) {
        all.at(-1).push(quarter);
      } else {
        all.push([quarter]);
      }
    } else if (!isLast) {
      all.push([]);
    }

    return all;
  }, []).map(set => {
    const range = [];

    if (set.length > 1) {
      range.push(getFirst(set));
      range.push(getLast(set));
    } else {
      range.push(getFirst(set));
    }

    return range;
  });
};

const getRangeStatement = sets => {
  const clauses = [];
  const segments = [];
  const formatter = new Intl.ListFormat(LOCALE, {
    style: 'long',
    type: 'conjunction',
  });

  sets.forEach(set => {
    const ranges = set.map(range => (
      `Q${range.quarter}\xa0${range.year}`
    ));

    segments.push(ranges.join('\xa0–\xa0'));
  });

  clauses.push(formatter.format(segments));

  return clauses.join(' ');
};

module.exports = {
  getRangesByYear,
  getRangesByYearSet,
  getRangeStatement,
};
