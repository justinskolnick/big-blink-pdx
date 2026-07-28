const Base = require('./base');
const Role = require('../role');

const { percentage } = require('../../lib/number');

const Overview = require('./overview');

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

  role = null;

  globalIncidentCount = null;
  globalIncidentPercentage = null;

  configureOtherValues() {
    super.overview = new Overview();
  }

  setRole(role) {
    if (this.constructor.isValidRoleOption(role)) {
      this.role = new Role(role);
      this.role.setFilterRole(this.constructor.includeRoleInFilters);
      this.role.setLabelPrefix(this.constructor.singular());
      this.role.initCollections(this.constructor.roleCollections);
    }
  }

  hasOverview() {
    return this.overview !== null && this.overview.hasValues();
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

  setOverviewAppearances(stats) {
    this.overview.setAppearances({
      label: this.constructor.getLabel('appearances'),
      values: {},
    });

    if (this.statsHasFirstIncident(stats)) {
      this.overview.setAppearancesValue('first', stats.first);
    }

    if (this.statsHasLastIncident(stats)) {
      this.overview.setAppearancesValue('last', stats.last);
    }
  }

  setOverviewTotals() {
    this.overview.setTotals({
      label: this.constructor.getLabel('totals'),
      values: {},
    });
    this.overview.setTotalsValue('total', this.data.total);

    if (this.hasGlobalIncidentCount() || this.hasGlobalIncidentPercentage()) {
      let value;

      if (this.hasGlobalIncidentCount()) {
        value = percentage(this.data.total, this.globalIncidentCount);
      } else if (this.hasGlobalIncidentPercentage()) {
        value = this.globalIncidentPercentage;
      }

      if (value) {
        this.overview.setTotalsValue('percentage', `${value}%`);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setOverviewDescription(values = {}) {
    this.overview.setDescription();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setOverviewDetails(values = {}) {
    this.overview.setDetails();
  }

  setOverview(stats = {}) {
    if (this.dataHasTotal() || Overview.props.some(prop => prop in stats)) {
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

    if (this.hasOverview()) {
      adapted.overview = this.overview.toObject();
    }

    return adapted;
  }
}

module.exports = IncidentedBase;
