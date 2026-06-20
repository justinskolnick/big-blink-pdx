const {
  COLLECTION_ATTENDEES,
  ROLE_ENTITY,
} = require('../../config/constants');

const { toSentence } = require('../../lib/string');

const IncidentedBase = require('../shared/base-incidented');

const EntitiesTable = require('../../services/tables/entities');

class Entity extends IncidentedBase {
  static table = EntitiesTable;

  static labelPrefix = 'entity';
  static linkKey = 'entity';

  static perPage = 40;

  static roleOptions = [
    ROLE_ENTITY,
  ];

  static roleCollections = [
    COLLECTION_ATTENDEES,
  ];

  static adaptEntityLobbyist(result) {
    return {
      id: result.id,
    };
  }

  setOverviewDescription(values = {}) {
    const {
      locations,
    } = values;

    const labelPrefix = this.constructor.labelPrefix;
    const isIndividual = this.getData('type') === 'individual';
    const hasLocations = locations.length > 0;

    let labelKey;
    let locationsString;

    if (isIndividual) {
      labelKey = hasLocations
        ? 'overview_description_individual_name_locations'
        : 'overview_description_individual_name';
    } else {
      labelKey = hasLocations
        ? 'overview_description_organization_name_locations'
        : 'overview_description_organization_name';
    }

    if (hasLocations) {
      locationsString = toSentence(
        locations.map(location => `${this.getLabel('location', null, location)},`)
      );
    }

    if (labelKey) {
      this.overviewDescription = this.getLabel(labelKey, labelPrefix, {
        name: this.getData('name'),
        locations: locationsString,
      });
    }
  }

  adaptRegistrations(result) {
    const prefix = this.constructor.labelPrefix;
    const labels = this.constructor.labels;
    let key;

    if (result.isRegistered) {
      key = 'registration_found';
    } else {
      key = 'registration_not_found';
    }

    return {
      isRegistered: result.isRegistered,
      labels: {
        title: labels.getLabel(key, prefix),
      },
    };
  }

  adapt(result) {
    const otherValues = {
      roles: this.adaptRoles(ROLE_ENTITY),
      type: this.constructor.singular(),
    };

    if ('isRegistered' in result) {
      otherValues.registrations = this.adaptRegistrations(result);
    }

    return this.adaptResult(result, otherValues);
  }

  configureLabels() {
    /* eslint-disable camelcase */
    this.constructor.setLabelKeySubstitutions({
      associations_roles: ['associations'],
    });
    /* eslint-enable camelcase */
  }
}

module.exports = Entity;
