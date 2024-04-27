const QUARTERS = [1, 2, 3, 4];

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
      range.push(set.at(0));
      range.push(set.at(-1));
    } else {
      range.push(set.at(0));
    }

    return range;
  });
};

const getRangeStatement = sets => {
  const clauses = [];
  const segments = [];

  sets.forEach(set => {
    const ranges = [];

    set.forEach(range => {
      ranges.push(`Q${range.quarter} ${range.year}`);
    });

    segments.push(ranges.join(' – '));
  });

  clauses.push(segments.join(', '));

  return clauses.join(' ');
};

module.exports = {
  getRangesByYear,
  getRangesByYearSet,
  getRangeStatement,
};
