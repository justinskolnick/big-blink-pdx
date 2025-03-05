const Base = require('./base');

const { percentage } = require('../lib/number');

class IncidentedObject extends Base {

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

  hasIncidentsData() {
    return this.data && 'incidents' in this.data;
  }

  hasDataIncidentStats() {
    return this.hasIncidentsData() && 'stats' in this.data.incidents;
  }

  hasDataIncidentStatsAppearances() {
    return this.hasDataIncidentStats() && 'appearances' in this.data.incidents.stats;
  }

  hasDataIncidentStatsTotals() {
    return this.hasDataIncidentStats() && 'totals' in this.data.incidents.stats;
  }

  statsHasFirstIncident(stats) {
    return 'first' in stats;
  }

  statsHasLastIncident(stats) {
    return 'last' in stats;
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

  setStatsOnIncidents() {
    if (!this.hasIncidentsData()) {
      this.data.incidents = {};
    }

    if (!this.hasDataIncidentStats()) {
      this.data.incidents.stats = {
        label: this.constructor.getLabel('overview'),
      };
    }
  }

  setAppearancesOnIncidentStats() {
    this.data.incidents.stats.appearances = {
      label: this.constructor.getLabel('appearances'),
      values: [],
    };
  }

  setTotalsOnIncidentStats() {
    this.data.incidents.stats.totals = {
      label: this.constructor.getLabel('totals'),
      values: {},
    };
  }

  setAppearanceOnIncidentStatsAppearances(key, value) {
    if (!this.hasDataIncidentStatsAppearances()) {
      this.setAppearancesOnIncidentStats();
    }

    this.data.incidents.stats.appearances.values.push({
      key,
      label: this.constructor.getLabel(`incident_${key}`),
      value,
    });
  }

  setPercentageOnIncidentsStatsTotals() {
    if (this.dataHasTotal()) {
      let value;

      if (!this.hasDataIncidentStatsTotals()) {
        this.setTotalsOnIncidentStats();
      }

      if (this.hasGlobalIncidentCount()) {
        value = percentage(this.data.total, this.globalIncidentCount);
      } else if (this.hasGlobalIncidentPercentage()) {
        value = this.globalIncidentPercentage;
      }

      if (value) {
        this.data.incidents.stats.totals.values.percentage = {
          key: 'percentage',
          label: this.constructor.getLabel('incident_percentage'),
          value: `${value}%`,
        };
      }
    }
  }

  setTotalOnIncidentsStatsTotals() {
    if (this.dataHasTotal()) {
      if (!this.hasDataIncidentStatsTotals()) {
        this.setTotalsOnIncidentStats();
      }

      this.data.incidents.stats.totals.values.total = {
        key: 'total',
        label: this.constructor.getLabel('incident_total'),
        value: this.data.total,
      };
    }
  }

  setIncidentStats(stats = {}) {
    if (!this.hasDataIncidentStats()) {
      this.setStatsOnIncidents();
    }

    if (this.statsHasFirstIncident(stats)) {
      this.setAppearanceOnIncidentStatsAppearances('first', stats.first);
    }

    if (this.statsHasLastIncident(stats)) {
      this.setAppearanceOnIncidentStatsAppearances('last', stats.last);
    }

    if (this.statsHasTotal(stats)) {
      this.setData('total', stats.total);
    }

    if (this.statsHasPercentage(stats)) {
      this.setGlobalIncidentPercentage(stats.percentage);
    }

    if (this.dataHasTotal()) {
      this.setTotalOnIncidentsStatsTotals();
    }

    if (this.hasGlobalIncidentCount() || this.hasGlobalIncidentPercentage()) {
      this.setPercentageOnIncidentsStatsTotals();
    }
  }

  adaptOtherValues(result, adapted) {
    if (result.incidents) {
      adapted.incidents = result.incidents;
    }

    return adapted;
  }
}

module.exports = IncidentedObject;
