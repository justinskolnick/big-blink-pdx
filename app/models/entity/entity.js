const {
  COLLECTION_ATTENDEES,
  ROLE_ENTITY,
} = require('../../config/constants');

const { getURLforDomain } = require('../../helpers/links');

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
    const hasManyLocations = locations.length > 1;

    let descriptionLabelKey;
    let detailsLabelKey;
    let domainString;
    let locationsString;

    if (isIndividual) {
      descriptionLabelKey = hasLocations
        ? 'overview_description_individual_name'
        : 'overview_description_individual_name';
    } else {
      descriptionLabelKey = hasLocations
        ? 'overview_description_organization_name'
        : 'overview_description_organization_name';
    }

    if (hasLocations) {
      locationsString = toSentence(
        locations.map(location => `${this.getLabel('location', null, location)},`)
      );
    }

    if (this.hasDomain()) {
      const domainURL = getURLforDomain(this.getData('domain'));

      domainString = `<a href="${domainURL}" target="_blank">${this.getData('domain')}</a>`;
      detailsLabelKey = 'overview_details_locations_domain';
    }

    if (hasLocations) {
      locationsString = toSentence(
        locations.map((location, i) => {
          const continues = i + 1 < locations.length;

          return `${this.getLabel('location', null, location)}${continues ? ',' : ''}`;
        })
      );
    }

    if (domainString && locationsString) {
      if (hasManyLocations) {
        detailsLabelKey = 'overview_details_locations_domain';
      } else {
        detailsLabelKey = 'overview_details_location_domain';
      }
    } else if (locationsString) {
      if (hasManyLocations) {
        detailsLabelKey = 'overview_details_locations';
      } else {
        detailsLabelKey = 'overview_details_location';
      }
    } else if (domainString) {
      detailsLabelKey = 'overview_details_domain';
    }

    if (descriptionLabelKey) {
      this.overviewDescription = this.getLabel(descriptionLabelKey, labelPrefix, {
        name: this.getData('name'),
      });
    }

    if (detailsLabelKey) {
      this.overviewDetails = this.getLabel(detailsLabelKey, labelPrefix, {
        domain: domainString,
        locations: locationsString,
      });
    }
  }

  hasDomain() {
    return this.hasData('domain') && Boolean(this.getData('domain'));
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
