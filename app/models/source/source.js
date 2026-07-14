const {
  COLLECTION_ATTENDEES,
  COLLECTION_ENTITIES,
  ROLE_SOURCE,
} = require('../../config/constants');

const IncidentedBase = require('../shared/base-incidented');

const DataSourcesTable = require('../../services/tables/data-sources');

class Source extends IncidentedBase {
  static table = DataSourcesTable;

  static labelPrefix = 'source';
  static linkKey = 'source';

  static perPage = 40;

  static types = {
    activity: 'activity',
    personnel: 'personnel',
    registration: 'registration',
  };

  static roleOptions = [
    ROLE_SOURCE,
  ];

  static roleCollections = [
    COLLECTION_ATTENDEES,
    COLLECTION_ENTITIES,
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setOverviewDescription(values = {}) {
    const labelPrefix = this.constructor.labelPrefix;

    let labelKey;

    if (this.hasPublicUrl()) {
      labelKey = 'overview_description_url';
    }

    if (this.isViaPRR()) {
      labelKey = 'overview_description_prr';
    }

    if (labelKey) {
      this.overviewDescription = this.getLabel(labelKey, labelPrefix, {
        date: this.constructor.readableDate(this.getData('retrieved_at')),
        format: this.readableFormat(this.getData('format')),
        title: this.getData('title'),
        url: this.getData('public_url'),
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setOverviewDetails(values = {}) {
    const labelPrefix = this.constructor.labelPrefix;

    let labelKey;

    if (this.getData('type') === this.getType('activity')) {
      labelKey = 'activity_disclaimer';
    } else if (this.getData('type') === this.getType('personnel')) {
      labelKey = 'personnel_disclaimer';
    } else if (this.getData('type') === this.getType('registration')) {
      labelKey = 'registration_disclaimer';
    }

    if (labelKey) {
      this.overviewDetails = this.getLabel(labelKey, labelPrefix);
    }
  }

  adapt(result) {
    let roles;

    if (result.type === 'activity') {
      roles = this.adaptRoles(ROLE_SOURCE);
    }

    return this.adaptResult(result, {
      roles,
    });
  }

  static adaptEntity(result) {
    const adapted = {
      entity: {
        id: result.id,
        name: result.name,
      },
    };

    if (result.total) {
      adapted.total = result.total;
    }

    return adapted;
  }

  getType(type) {
    if (type in this.constructor.types) {
      return this.constructor.types[type];
    }
  }

  hasPublicUrl() {
    return this.hasData('public_url') && Boolean(this.getData('public_url'));
  }

  isViaPRR() {
    return this.getData('is_via_public_records') === 1;
  }

  adaptDisclaimer(result, adapted) {
    const prefix = 'source';
    const labels = [];

    if (this.hasPublicUrl() || this.isViaPRR()) {
      // todo: return readable format in adapted data
      const values = {
        ...adapted,
        format: this.readableFormat(adapted.format),
      };
      let key;

      if (this.hasPublicUrl()) {
        key = 'info_linked';
      } else if (this.isViaPRR()) {
        key = 'info_public_records_request';
      }

      labels.push(this.getLabel(key, prefix, values));
    }

    if (result.type === this.getType('activity')) {
      labels.push(this.getLabel('activity_disclaimer', prefix));
    } else if (result.type === this.getType('personnel')) {
      labels.push(this.getLabel('personnel_disclaimer', prefix));
    } else if (result.type === this.getType('registration')) {
      labels.push(this.getLabel('registration_disclaimer', prefix));
    }

    if (labels.length > 0) {
      return labels.join(' ');
    }

    return null;
  }

  adaptQuarterLabel() {
    if (this.hasData('year') && this.hasData('quarter')) {
      return `${this.getData('year')} Q${this.getData('quarter')}`;
    }

    return undefined;
  }

  readableFormat(value) {
    if (value === 'csv') {
      return 'CSV';
    } else if (value === 'excel') {
      return 'Excel';
    }

    return value;
  }

  adaptLabels(result, adapted) {
    const labels = {
      disclaimer: this.adaptDisclaimer(result, adapted),
      overview: {
        chart: this.adaptQuarterLabel(),
        title: this.adaptQuarterLabel(),
      },
    };

    if (result.type === 'activity') {
      labels.incidents = {
        title: this.getData('title'),
      };
    }

    adapted.labels = labels;

    return adapted;
  }

  configureLabels() {
    /* eslint-disable camelcase */
    this.constructor.setLabelKeySubstitutions({
      appearances__first: ['first_incident', 'appearances'],
      appearances__last: ['last_incident', 'appearances'],
      associations_roles: ['associations'],
    });
    /* eslint-enable camelcase */
  }
}

module.exports = Source;
