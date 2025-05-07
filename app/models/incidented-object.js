const Base = require('./base');

const { percentage } = require('../lib/number');

class IncidentedObject extends Base {
  static linkKey = null;

  overviewProps = [
    'first',
    'last',
    'percentage',
    'total',
  ];

  globalIncidentCount = null;
  globalIncidentPercentage = null;

  setGlobalIncidentCount(value) {
    this.globalIncidentCount = value;
  }

  setGlobalIncidentPercentage(value) {
    this.globalIncidentPercentage = value;
  }

  hasGlobalIncidentCount() {
    return this.globalIncidentCount !== null && typeof this.globalIncidentCount === 'number';
  }

  hasGlobalIncidentPercentage() {
    return this.globalIncidentPercentage !== null && !isNaN(this.globalIncidentPercentage);
  }

  statsHasFirstIncident(stats) {
    return 'first' in stats;
  }

  statsHasLastIncident(stats) {
    return 'last' in stats;
  }

  statsHasFirstOrLastIncident(stats) {
    return 'first' in stats || 'last' in stats;
  }

  statsHasPercentage(stats) {
    return 'percentage' in stats && stats.percentage !== null;
  }

  statsHasTotal(stats) {
    return 'total' in stats;
  }

  dataHasTotal() {
    return 'total' in this.data && typeof this.data.total === 'number';
  }

  setOverviewObject() {
    this.setData('overview', {
      label: this.constructor.getLabel('overview'),
    });
  }

  setOverviewAppearances(stats) {
    this.data.overview.appearances = {
      label: this.constructor.getLabel('appearances'),
      values: {},
    };

    if (this.statsHasFirstIncident(stats)) {
      this.setOverviewAppearanceValue('first', stats.first);
    }

    if (this.statsHasLastIncident(stats)) {
      this.setOverviewAppearanceValue('last', stats.last);
    }
  }

  setOverviewAppearanceValue(key, value) {
    this.data.overview.appearances.values[key] = {
      key,
      label: this.constructor.getLabel(`incident_${key}`),
      value,
    };
  }

  setOverviewTotals() {
    this.data.overview.totals = {
      label: this.constructor.getLabel('totals'),
      values: {},
    };

    this.setOverviewTotalValue(this.data.total);

    if (this.hasGlobalIncidentCount() || this.hasGlobalIncidentPercentage()) {
      let value;

      if (this.hasGlobalIncidentCount()) {
        value = percentage(this.data.total, this.globalIncidentCount);
      } else if (this.hasGlobalIncidentPercentage()) {
        value = this.globalIncidentPercentage;
      }

      if (value) {
        this.setOverviewPercentageValue(value);
      }
    }
  }

  setOverviewTotalValue(value) {
    this.data.overview.totals.values.total = {
      key: 'total',
      label: this.constructor.getLabel('incident_total'),
      value,
    };
  }

  setOverviewPercentageValue(value) {
    this.data.overview.totals.values.percentage = {
      key: 'percentage',
      label: this.constructor.getLabel('incident_percentage'),
      value: `${value}%`,
    };
  }

  setOverview(stats = {}) {
    if (this.dataHasTotal() || this.overviewProps.some(prop => prop in stats)) {
      this.setOverviewObject();

      if (this.statsHasTotal(stats)) {
        this.setData('total', stats.total);
      }

      if (this.statsHasPercentage(stats)) {
        this.setGlobalIncidentPercentage(stats.percentage);
        this.setData('percentage', stats.total);
      }
    } else {
      return;
    }

    if (this.statsHasFirstOrLastIncident(stats)) {
      this.setOverviewAppearances(stats);
    }

    if (this.dataHasTotal()) {
      this.setOverviewTotals();
    }
  }

  adaptOtherValues(result, adapted) {
    if (result.incidents) {
      adapted.incidents = result.incidents;
    }

    if (result.overview) {
      adapted.overview = result.overview;
    }

    return adapted;
  }
}

module.exports = IncidentedObject;
