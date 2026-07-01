const {
  COLLECTION_ATTENDEES,
  COLLECTION_ENTITIES,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
} = require('../../config/constants');

const IncidentedBase = require('../shared/base-incidented');

const PeopleTable = require('../../services/tables/people');

class Person extends IncidentedBase {
  static table = PeopleTable;

  static labelPrefix = 'person';
  static linkKey = 'person';

  static perPage = 40;

  static roleOptions = [
    ROLE_OFFICIAL,
    ROLE_LOBBYIST,
  ];

  static roleCollections = [
    COLLECTION_ATTENDEES,
    COLLECTION_ENTITIES,
  ];

  static includeRoleInFilters = true;

  setOverviewDescription(values = {}) {
    const {
      hasLobbied,
      hasBeenEmployee,
      hasBeenLobbied,
      terms,
    } = values;

    const labelPrefix = this.constructor.labelPrefix;
    const hasTerms = terms?.length > 0;

    let descriptionKey;
    let detailsKey;
    let lastTerm;

    if (hasBeenEmployee || hasBeenLobbied) {
      if (hasLobbied) {
        descriptionKey = 'overview_description_has_been_both_name';
      } else {
        descriptionKey = 'overview_description_has_been_official_name';
      }
    } else if (hasLobbied) {
      descriptionKey = 'overview_description_has_been_lobbyist_name';
    }

    if (hasTerms) {
      lastTerm = terms.at(0);

      if (lastTerm.cityOffice.isElected) {
        if (lastTerm.isCurrent) {
          if (lastTerm.cityOffice.isCityCouncilor) {
            detailsKey = 'overview_details_elected_council_current';
          } else {
            detailsKey = 'overview_details_elected_position_current';
          }
        } else if (lastTerm.cityOffice.isCityCommissioner) {
          detailsKey = 'overview_details_elected_commission';
        } else if (lastTerm.cityOffice.isCityCouncilor) {
          detailsKey = 'overview_details_elected_council_past';
        } else {
          detailsKey = 'overview_details_elected_position_past';
        }
      }
    }

    if (descriptionKey) {
      this.overviewDescription = this.getLabel(descriptionKey, labelPrefix, {
        name: this.getData('name'),
      });
    }

    if (lastTerm && detailsKey) {
      this.overviewDetails = this.getLabel(detailsKey, labelPrefix, {
        date_end: lastTerm.readableDateEnd, // eslint-disable-line camelcase
        date_start: lastTerm.readableDateStart, // eslint-disable-line camelcase
        duration: lastTerm.duration,
        name: this.getData('given'),
        district: lastTerm.cityOffice.getData('district'),
        office: lastTerm.cityOffice.office,
      });
    }
  }

  adapt(result) {
    return this.adaptResult(result, {
      roles: this.adaptRoles(result.roles),
    });
  }

  get hasMoved() {
    return this.hasData('identical_id');
  }

  get identicalId() {
    return this.getData('identical_id');
  }

  get hasPernr() {
    return this.hasData('pernr');
  }

  get pernr() {
    return this.getData('pernr');
  }

  get id() {
    return this.getData('id');
  }
}

module.exports = Person;
