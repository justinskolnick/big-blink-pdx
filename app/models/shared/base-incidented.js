const Base = require('./base');
const Role = require('../role');

const { percentage } = require('../../lib/number');

class IncidentedBase extends Base {
  static labelPrefix = null;
  static linkKey = null;

  static roleOptions = [];
  static roleCollections = [];
  static includeRoleInFilters = false;

  static isValidRoleOption(value) {
    return this.roleOptions.includes(value);
  }

  static isValidRoleCollection(collection) {
    return this.roleCollections.includes(collection);
  }

  overviewProps = [
    'first',
    'last',
    'percentage',
    'total',
  ];

  overviewDescription = null;
  overviewDetails = null;

  role = null;

  globalIncidentCount = null;
  globalIncidentPercentage = null;

  setRole(role) {
    if (this.constructor.isValidRoleOption(role)) {
      this.role = new Role(role);
      this.role.setFilterRole(this.constructor.includeRoleInFilters);
      this.role.setLabelPrefix(this.constructor.singular());
      this.role.initCollections(this.constructor.roleCollections);
    }
  }

  hasRole() {
    return this.role?.hasRole() ?? false;
  }

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
      labels: {
        intro: this.overviewDescription,
        details: this.overviewDetails,
        title: this.constructor.getLabel('overview'),
      },
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
      label: this.constructor.getLabel(key, 'appearances'),
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
      label: this.constructor.getLabel('total', 'incidents'),
      value,
    };
  }

  setOverviewPercentageValue(value) {
    this.data.overview.totals.values.percentage = {
      key: 'percentage',
      label: this.constructor.getLabel('percentage', 'incidents'),
      value: `${value}%`,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setOverviewDescription(values = {}) {
    this.overviewDescription = null;
  }

  hasOverviewDescription() {
    return this.overviewDescription !== null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setOverviewDetails(values = {}) {
    this.overviewDetails = null;
  }

  setOverview(stats = {}) {
    this.setOverviewObject();

    if (this.dataHasTotal() || this.overviewProps.some(prop => prop in stats)) {
      if (this.statsHasTotal(stats)) {
        this.setData('total', stats.total);
      }

      if (this.statsHasPercentage(stats)) {
        this.setGlobalIncidentPercentage(stats.percentage);
        this.setData('percentage', stats.total);
      }

      if (this.dataHasTotal()) {
        this.setOverviewTotals();
      }

      if (this.statsHasFirstOrLastIncident(stats)) {
        this.setOverviewAppearances(stats);
      }
    }
  }

  adaptRoles(value) {
    const roleOptions = this.constructor.roleOptions;

    let list = [];
    let options = {};

    if (value) {
      list = Role.getRoleList(roleOptions, value);
      options = Role.getRoleOptions(roleOptions, value);
    }

    return {
      label: this.getLabel('associations_roles'),
      list,
      options,
    };
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

module.exports = IncidentedBase;
