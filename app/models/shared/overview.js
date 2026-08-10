const { Labels } = require('../../helpers/labels');

class Overview {
  static {
    this.labels = new Labels();
  }

  static props = [
    'first',
    'last',
    'percentage',
    'total',
  ];

  description = null;
  details = null;

  appearances = null;
  stats = null;
  totals = null;

  getLabel(key, prefix) {
    return this.constructor.labels.getLabel(key, prefix);
  }

  setDescription(description) {
    this.description = description;
  }

  hasDescription() {
    return this.description !== null;
  }

  setDetails(details) {
    this.details = details;
  }

  hasDetails() {
    return this.details !== null;
  }

  setAppearances(appearances) {
    this.appearances = appearances;
  }

  hasAppearances() {
    return this.appearances !== null;
  }

  setAppearancesValue(key, value) {
    this.appearances.values[key] = {
      key,
      label: this.getLabel(key, 'appearances'),
      value,
    };
  }

  setStats(stats) {
    this.stats = stats;
  }

  hasStats() {
    return this.stats !== null;
  }

  setTotals(totals) {
    this.totals = totals;
  }

  hasTotals() {
    return this.totals !== null;
  }

  setTotalsValue(key, value) {
    this.totals.values[key] = {
      key,
      label: this.getLabel(key, 'incidents'),
      value,
    };
  }

  hasValues() {
    return this.hasDescription()
        || this.hasDetails()
        || this.hasAppearances()
        || this.hasStats()
        || this.hasTotals();
  }

  toObject() {
    const obj = {
      label: this.getLabel('overview'),
      labels: {
        intro: this.description,
        details: this.details,
        title: this.getLabel('overview'),
      },
    };

    if (this.hasAppearances()) {
      obj.appearances = this.appearances;
    }

    if (this.hasStats()) {
      obj.stats = this.stats;
    }

    if (this.hasTotals()) {
      obj.totals = this.totals;
    }

    return obj;
  }
}

module.exports = Overview;
