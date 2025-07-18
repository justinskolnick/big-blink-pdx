const labelStrings = require('../../config/strings.json');

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

  getLabel(key, prefix = '') {
    const labelKey = this.prefixLabelKey(key, prefix);

    if (labelKey in this.labels) {
      return this.labels[labelKey];
    } else if (prefix.length) {
      console.warn(`label key not found for "${key}" using prefix "${prefix}"`); // eslint-disable-line no-console
    } else {
      console.warn(`label key not found for "${key}"`); // eslint-disable-line no-console
    }

    return key;
  }
}

module.exports = Labels;
