const camelCase = require('lodash.camelcase');

const dateHelper = require('../helpers/date');

const { percentage } = require('../lib/number');

class Base {
  static primaryKeyField = 'id';

  static baseLabels = {
    /* eslint-disable camelcase */
    incident_percentage: 'Share of total',
    incident_total: 'Incident count',
    totals: 'Totals',
    /* eslint-enable camelcase */
  };

  static labels = {};

  static getLabel(key) {
    const labels = {
      ...this.baseLabels,
      ...this.labels,
    };

    return labels[key];
  }

  static field(fieldName, prefix = true) {
    return prefix ? [this.tableName, fieldName].join('.') : fieldName;
  }

  static primaryKey(prefix = true) {
    return this.field(this.primaryKeyField, prefix);
  }

  static fields(prefix = true) {
    const fields = Object.entries(this.fieldNames)
      .filter(([, value]) => value.select)
      .map(([key,]) => this.field(key, prefix));

    return fields;
  }

  static hasFieldAlias(fieldName) {
    if ('adapt' in this.fieldNames[fieldName]) {
      if ('as' in this.fieldNames[fieldName].adapt) {
        return true;
      }
    }

    return false;
  }

  static fieldAlias(fieldName) {
    return this.fieldNames[fieldName].adapt.as;
  }

  static hasAdaptMethod(fieldName) {
    if ('adapt' in this.fieldNames[fieldName]) {
      if ('method' in this.fieldNames[fieldName].adapt) {
        return true;
      }
    }

    return false;
  }

  static fieldMethod(fieldName) {
    return this.fieldNames[fieldName].adapt.method;
  }

  static fieldKey(fieldName) {
    if (this.hasFieldAlias(fieldName)) {
      const alias = this.fieldAlias(fieldName);

      return camelCase(alias);
    }

    return camelCase(fieldName);
  }

  static fieldValue(fieldName, result) {
    let value = result[fieldName];

    if (this.hasAdaptMethod(fieldName)) {
      value = this.fieldMethod(fieldName)(value);
    }

    return value;
  }

  static readableDate(str) {
    return dateHelper.formatDateString(str);
  }

  static adaptResult(result, otherValues) {
    const hasTotal = Boolean(result.total);
    const fields = this.fields(false);
    const adapted = fields.reduce((obj, field) => {
      const key = this.fieldKey(field);
      const value = this.fieldValue(field, result);

      obj[key] = value;

      return obj;
    }, {});

    let adaptedWithOtherValues = {
      ...adapted,
      ...otherValues,
    };

    if (hasTotal) {
      adaptedWithOtherValues = this.handleTotal(adaptedWithOtherValues, result.total);
    }

    return adaptedWithOtherValues;
  }

  static hasIncidents(result) {
    return result && 'incidents' in result;
  }

  static hasIncidentStats(result) {
    return result && 'incidents' in result && 'stats' in result.incidents;
  }

  static getIncidentStatsObject() {
    return {
      totals: this.getIncidentStatsTotalsObject(),
    };
  }

  static getIncidentStatsTotalsObject() {
    return {
      label: this.getLabel('totals'),
      values: {},
    };
  }

  static getIncidentStatsPercentageObject(value) {
    return {
      key: 'percentage',
      label: this.getLabel('incident_percentage'),
      value: `${value}%`,
    };
  }

  static getIncidentStatsTotalObject(value) {
    return {
      key: 'total',
      label: this.getLabel('incident_total'),
      value,
    };
  }

  static appendStatsToIncidents(result) {
    if (!this.hasIncidents(result)) {
      result.incidents = {};
    }

    result.incidents.stats = this.getIncidentStatsObject();

    return result;
  }

  static appendIncidentsPercentage(result, value) {
    const percentageValue = percentage(result.incidents.stats.totals.values.total.value, value);

    result.incidents.stats.totals.values.percentage = this.getIncidentStatsPercentageObject(percentageValue);

    return result;
  }

  static appendIncidentsTotal(result, value) {
    result.incidents.stats.totals.values.total = this.getIncidentStatsTotalObject(value);

    return result;
  }

  static appendIncidentsPercentageIfTotal(result, value) {
    if (this.hasIncidentStats(result)) {
      return this.appendIncidentsPercentage(result, value);
    }

    return result;
  }

  static handleTotal(result, value) {
    let adapted = result;

    if (!this.hasIncidentStats(result)) {
      adapted = this.appendStatsToIncidents(result);
    }

    return this.appendIncidentsTotal(adapted, value);
  }

  static adapt(result) {
    return this.adaptResult(result);
  }
}

module.exports = Base;
