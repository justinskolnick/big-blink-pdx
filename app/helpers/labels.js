const labelStrings = require('../config/strings.json');

const { snakeCase } = require('../lib/string');

class Labels {
  labels = {};

  constructor() {
    this.setLabels(labelStrings);
  }

  setLabels(labels = {}) {
    this.labels = {
      ...this.labels,
      ...labels,
    };
  }

  prefixLabelKey(key, prefix = '') {
    return prefix.length ? [prefix, key].join('__') : key;
  }

  hasKey(key, prefix = '') {
    const labelKey = this.prefixLabelKey(key, prefix);

    return labelKey in this.labels;
  }

  getInterpolatedLabel(str, values = {}) {
    return Object.entries(values).reduce((acc, [key, value]) => {
      const symbol = snakeCase(key);

      return acc.replaceAll(`:${symbol}`, value);
    }, str).replace(/[\s]+/, ' ');
  }

  getLabel(key, prefix = '', values = null) {
    const stablePrefix = prefix ? prefix : '';

    if (this.hasKey(key, stablePrefix)) {
      const labelKey = this.prefixLabelKey(key, stablePrefix);
      const label = this.labels[labelKey];

      if (values !== null) {
        return this.getInterpolatedLabel(label, values);
      }

      return label;
    } else if (stablePrefix.length) {
      console.warn(`label key not found for "${key}" using prefix "${stablePrefix}"`); // eslint-disable-line no-console
    } else {
      console.warn(`label key not found for "${key}"`); // eslint-disable-line no-console
    }

    return key;
  }
}

module.exports = {
  Labels,
};
