const Base = require('./base');

class IncidentedObject extends Base {

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

  appendStatsToIncidentsData() {
    if (!this.hasIncidentsData()) {
      this.data.incidents = {};
    }

    if (!this.hasDataIncidentStats()) {
      this.data.incidents.stats = {
        label: this.constructor.getLabel('overview'),
      };
    }
  }

  appendAppearancesToIncidentStatsData() {
    this.data.incidents.stats.appearances = {
      label: this.constructor.getLabel('appearances'),
      values: [],
    };
  }

  appendTotalsToIncidentStatsData() {
    this.data.incidents.stats.totals = {
      label: this.constructor.getLabel('totals'),
      values: {},
    };
  }

  appendAppearanceToIncidentStatsAppearancesData(key, value) {
    if (!this.hasDataIncidentStatsAppearances()) {
      this.appendAppearancesToIncidentStatsData();
    }

    this.data.incidents.stats.appearances.values.push({
      key,
      label: this.constructor.getLabel(`incident_${key}`),
      value,
    });
  }

  appendPercentageToIncidentsStatsTotalsData(stats) {
    if (!this.hasDataIncidentStatsTotals()) {
      this.appendTotalsToIncidentStatsData();
    }

    this.data.incidents.stats.totals.values.percentage = {
      key: 'percentage',
      label: this.constructor.getLabel('incident_percentage'),
      value: `${stats.percentage}%`,
    };
  }

  appendTotalToIncidentsStatsTotalsData(stats) {
    if (!this.hasDataIncidentStatsTotals()) {
      this.appendTotalsToIncidentStatsData();
    }

    this.data.incidents.stats.totals.values.total = {
      key: 'total',
      label: this.constructor.getLabel('incident_total'),
      value: stats.total,
    };
  }

  setIncidentStats(stats) {
    if (!this.hasDataIncidentStats()) {
      this.appendStatsToIncidentsData();
    }

    if (this.statsHasFirstIncident(stats)) {
      this.appendAppearanceToIncidentStatsAppearancesData('first', stats.first);
    }

    if (this.statsHasLastIncident(stats)) {
      this.appendAppearanceToIncidentStatsAppearancesData('last', stats.last);
    }

    if (this.statsHasPercentage(stats)) {
      this.appendPercentageToIncidentsStatsTotalsData(stats);
    }

    if (this.statsHasTotal(stats)) {
      this.appendTotalToIncidentsStatsTotalsData(stats);
    }
  }

  static adaptOtherValues(result, adapted) {
    if (result.incidents) {
      adapted.incidents = result.incidents;
    }

    return adapted;
  }
}

module.exports = IncidentedObject;
