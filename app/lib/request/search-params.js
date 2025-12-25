const {
  PARAM_ASSOCIATION,
  PARAM_ROLE,
  PARAM_SORT,
  PARAM_SORT_BY,
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

const getDefinition = (param) => {
  if (param in PARAM_OPTIONS) {
    return PARAM_OPTIONS[param];
  }

  return null;
};

const validate = (value, paramOrDefinition) => {
  if (!hasParam(value)) return false;

  let definition;

  if (typeof paramOrDefinition === 'string') {
    definition = getDefinition(paramOrDefinition);
  } else if (typeof paramOrDefinition === 'boolean') {
    return paramOrDefinition;
  } else if (typeof paramOrDefinition === 'function') {
    return paramOrDefinition(value);
  } else {
    definition = paramOrDefinition;
  }

  if (definition.delimiter) {
    return value.split(definition.delimiter)
      .filter(Boolean)
      .every(entry => definition.pattern.test(entry));
  }

  if (definition.values) {
    return definition.values.includes(value);
  }

  return definition.pattern.test(value);
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
    const value = decodeParamValue(searchParams, param);

    if ('validate' in definition) {
      if (definition.validate in validators) {
        return validators[definition.validate](value);
      }
    } else {
      return validate(value, definition);
    }
  }

  return false;
};

const hasAssociation = (value) => validate(value, PARAM_ASSOCIATION);
const hasDate = (value) => validate(value, dateOptions);
const hasYear = (value) => validate(value, yearOptions);
const hasYearAndQuarter = (value) => validate(value, quarterOptions);
const hasInteger = (value) => validate(value, Number.isInteger(Number(value)));
const hasQuarterAndYearDeprecated = (value) => validate(value, QUARTER_PATTERN_DEPRECATED.test(value));
const hasQuarter = (value) => validate(value, (hasYearAndQuarter(value) || hasQuarterAndYearDeprecated(value)));
const hasRole = (value) => validate(value, PARAM_ROLE);
const hasSort = (value) => validate(value, PARAM_SORT);
const hasSortBy = (value) => validate(value, PARAM_SORT_BY);

const getInteger = (param) => Number.parseInt(param);

const getPeople = (value) => {
  if (value) {
    return value.split(peopleOptions.delimiter)
      .filter(Boolean).map(entry => {
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

const migrateQuarterSlug = (param) => {
  if (hasQuarter(param)) {
    return getQuarterSlug(param);
  }

  return null;
};

const getYear = (param) => {
  if (hasYear(param)) {
    return param;
  }

  return null;
};

const getSort = (param) => hasSort(param) ? SORT_OPTIONS[param] : null;
const getSortBy = (param) => hasSortBy(param) ? SORT_BY_OPTIONS[param] : null;

const adapters = {
  getInteger,
  getSort,
};

const validators = {
  hasDate,
  hasInteger,
  hasQuarter,
  hasSort,
  hasSortBy,
  hasYear,
};

const decodeParamValue = (searchParams, param) => decodeURIComponent(searchParams.get(param));

const getParamValue = (searchParams, param) => {
  const definition = getDefinition(param);
  let value = decodeParamValue(searchParams, param);

  if (definition.adapt in adapters) {
    value = adapters[definition.adapt](value);
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
  const keys = [];
  const sets = [];
  let values = {};

  Object.entries(PARAM_OPTIONS).forEach(([key, definition]) => {
    if (!keys.includes(key)) {
      keys.push(key);

      if ('requires' in definition) {
        keys.push(definition.requires);
        sets.push([key, definition.requires]);
      } else {
        sets.push(key);
      }
    }
  });

  sets.forEach(param => {
    if (Array.isArray(param)) {
      if (param.every(p => isValid(searchParams, p))) {
        values = {
          ...values,
          ...getParamGroup(searchParams, param),
        };
      }
    } else if (isValid(searchParams, param)) {
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
  getParamValue,
  getPeople,
  getQuarterAndYear,
  getQuarterSlug,
  getSort,
  getSortBy,
  getYear,
  hasAssociation,
  hasDate,
  hasInteger,
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
