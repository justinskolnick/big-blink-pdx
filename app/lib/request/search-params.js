const {
  PARAM_DATE_ON,
  PARAM_DATE_RANGE_FROM,
  PARAM_DATE_RANGE_TO,
  PARAM_ROLE,
  PARAM_SORT,
  PARAM_WITH_ENTITY_ID,
  PARAM_WITH_PERSON_ID,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
  SORT_BY_OPTIONS,
  SORT_OPTIONS,
} = require('../../config/constants');
const {
  PARAM_OPTIONS,
  QUARTER_PATTERN_DEPRECATED,
  dateOptions,
  peopleOptions,
  quarterOptions,
  yearOptions,
} = require('../../config/params');

const hasParam = (param) => param?.length > 0;

const validate = (param, definition) => {
  if (!hasParam(param)) return false;

  if (typeof definition === 'boolean') {
    return definition;
  } else if (typeof definition === 'function') {
    return definition(param);
  }

  if (definition.delimiter) {
    return param.split(definition.delimiter)
      .filter(Boolean)
      .every(entry => definition.pattern.test(entry));
  }

  return definition.pattern.test(param);
};

const hasDate = (param) => validate(param, dateOptions);
const hasYear = (param) => validate(param, yearOptions);
const hasYearAndQuarter = (param) => validate(param, quarterOptions);
const hasInteger = (param) => validate(param, Number.isInteger(Number(param)));
const hasPeople = (param) => validate(param, peopleOptions);
const hasQuarterAndYearDeprecated = (param) => validate(param, QUARTER_PATTERN_DEPRECATED.test(param));
const hasQuarter = (param) => validate(param, (hasYearAndQuarter(param) || hasQuarterAndYearDeprecated(param)));
const hasRole = (param) => validate(param, [ROLE_LOBBYIST, ROLE_OFFICIAL].includes(param));

const getInteger = (param) => Number.parseInt(param);

const getPeople = (param) => {
  if (hasPeople(param)) {
    return param.split(peopleOptions.delimiter).filter(Boolean).map(entry => {
      const [id, role] = entry.match(peopleOptions.pattern).slice(1,3);
      const values = {
        id: Number(id),
      };

      if (hasRole(role)) {
        values.role = role;
      }

      return values;
    });
  }

  return null;
};

const getQuarterAndYear = (param) => {
  let quarter;
  let year;

  if (hasQuarterAndYearDeprecated(param)) {
    [quarter, year] = param.match(QUARTER_PATTERN_DEPRECATED).slice(1,3).map(Number);
  } else if (hasYearAndQuarter(param)) {
    [year, quarter] = param.match(quarterOptions.pattern).slice(1,3).map(Number);
  }

  if (quarter && year) {
    return { quarter, year };
  }

  return null;
};

const getQuarterSlug = (param) =>
  param.toLowerCase().split('-').sort().join('-');

const migrateQuarterSlug = param => {
  if (hasQuarter(param)) {
    return getQuarterSlug(param);
  }

  return null;
};

const hasSort = (param) => param in SORT_OPTIONS;
const hasSortBy = (param) => param in SORT_BY_OPTIONS;

const getSort = (param) => hasSort(param) ? SORT_OPTIONS[param] : null;
const getSortBy = (param) => hasSortBy(param) ? SORT_BY_OPTIONS[param] : null;

const adapters = {
  getInteger,
  getSort,
};

const validators = {
  hasDate,
  hasInteger,
  hasPeople,
  hasQuarter,
  hasRole,
  hasSort,
  hasSortBy,
  hasYear,
};

const getDefinition = (param) => {
  if (param in PARAM_OPTIONS) {
    return PARAM_OPTIONS[param];
  }

  return null;
};

const isDeprecated = (searchParams, param) => {
  if (searchParams.has(param)) {
    const definition = getDefinition(param);

    return 'deprecated' in definition && definition.deprecated;
  }

  return false;
};

const isValid = (searchParams, param) => {
  if (searchParams.has(param)) {
    const definition = getDefinition(param);

    if ('validate' in definition) {
      const value = searchParams.get(param);

      if (definition.validate in validators) {
        return validators[definition.validate](value);
      }
    }
  }

  return false;
};

const getParamValue = (searchParams, param) => {
  let value;

  if (isValid(searchParams, param)) {
    const definition = getDefinition(param);

    value = searchParams.get(param);

    if (definition.adapt in adapters) {
      value = adapters[definition.adapt](value);
    }
  }

  return value;
};

const getParamGroup = (searchParams, params) => {
  let group;

  const values = params.reduce((all, param) => {
    all[param] = getParamValue(searchParams, param);

    return all;
  }, {});

  if (Object.values(values).every(Boolean)) {
    group = values;
  }

  return group;
};

const getParams = searchParams => {
  let values = {};

  [
    PARAM_SORT,
    PARAM_DATE_ON,
    [PARAM_DATE_RANGE_FROM, PARAM_DATE_RANGE_TO],
    PARAM_ROLE,
    PARAM_WITH_ENTITY_ID,
    PARAM_WITH_PERSON_ID,
  ].forEach(param => {
    if (Array.isArray(param)) {
      values = {
        ...values,
        ...getParamGroup(searchParams, param),
      };
    } else {
      values[param] = getParamValue(searchParams, param);
    }
  });

  return values;
};

const getParamsFromFilters = (searchParams, filters) => {
  const hasValues = (domain) => {
    if (Array.isArray(domain)) {
      return domain.every(hasValues);
    }

    return 'values' in domain;
  };

  const getValues = (domain) => {
    if (Array.isArray(domain)) {
      return domain.map(entry => entry.values).reduce((all, entry) => {
        const keys = Object.keys(entry);

        keys.forEach(key => {
          const values = entry[key];

          if (!(key in all)) {
            all[key] = [];
          }

          if (!all[key].includes(entry[key])) {
            if (Array.isArray(values)) {
              values.forEach(value => {
                all[key].push(value);
              });
            } else {
              all[key].push(values);
            }
          }
        });

        return all;
      }, {});
    }

    return domain.values;
  };

  const params = Object.entries(filters)
    .filter(([, domain]) => domain && hasValues(domain))
    .map(([, domain]) => getValues(domain))
    .reduce((all, values) => Object.assign(all, values), {});

  if (searchParams.has(PARAM_SORT)) {
    params[PARAM_SORT] = getSort(searchParams.get(PARAM_SORT));
  }

  return params;
};

module.exports = {
  getParams,
  getParamsFromFilters,
  getPeople,
  getQuarterAndYear,
  getQuarterSlug,
  getSort,
  getSortBy,
  hasDate,
  hasInteger,
  hasPeople,
  hasQuarter,
  hasQuarterAndYearDeprecated,
  hasRole,
  hasSort,
  hasSortBy,
  hasYear,
  hasYearAndQuarter,
  isDeprecated,
  isValid,
  migrateQuarterSlug,
};
