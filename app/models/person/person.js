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
    } = values;

    const labelPrefix = this.constructor.labelPrefix;

    let labelKey;

    if (hasBeenEmployee || hasBeenLobbied) {
      if (hasLobbied) {
        labelKey = 'overview_description_has_been_both_name';
      } else {
        labelKey = 'overview_description_has_been_official_name';
      }
    } else if (hasLobbied) {
      labelKey = 'overview_description_has_been_lobbyist_name';
    }

    if (labelKey) {
      this.overviewDescription = this.getLabel(labelKey, labelPrefix, {
        name: this.getData('name'),
      });
    }
  }

  setOverviewDetails(values = {}) {
    const { terms } = values;

    const labelPrefix = this.constructor.labelPrefix;
    const hasTerms = terms?.length > 0;
    const details = [];

    let recentTermKey;
    let priorTermKey;
    let recentTerm;
    let priorTerm;

    if (hasTerms) {
      recentTerm = terms.at(0);
      priorTerm = terms.at(1);

      if (recentTerm.cityOffice.isElected()) {
        if (recentTerm.isCurrent()) {
          if (recentTerm.cityOffice.isCityCouncilor()) {
            recentTermKey = 'overview_details_elected_council_current';
          } else {
            recentTermKey = 'overview_details_elected_position_current';
          }
        } else if (recentTerm.cityOffice.isCityCommissioner()) {
          recentTermKey = 'overview_details_elected_commission';
        } else if (recentTerm.cityOffice.isCityCouncilor()) {
          recentTermKey = 'overview_details_elected_council_past';
        } else {
          recentTermKey = 'overview_details_elected_position_past';
        }
      }

      if (priorTerm) {
        if (priorTerm.cityOffice.isElected()) {
          priorTermKey = 'overview_details_elected_position_prior';
        }
      }
    }

    if (recentTermKey) {
      details.push(
        this.getLabel(recentTermKey, labelPrefix, {
          date_end: recentTerm.readableDateEnd, // eslint-disable-line camelcase
          date_start: recentTerm.readableDateStart, // eslint-disable-line camelcase
          duration: recentTerm.duration,
          name: this.getData('given'),
          district: recentTerm.cityOffice.getData('district'),
          office: recentTerm.cityOffice.office,
        })
      );
    }

    if (priorTermKey) {
      details.push(
        this.getLabel(priorTermKey, labelPrefix, {
          date_end: priorTerm.readableDateEnd, // eslint-disable-line camelcase
          date_start: priorTerm.readableDateStart, // eslint-disable-line camelcase
          pronoun: this.getData('pronoun_subject'),
          office: priorTerm.cityOffice.office,
        })
      );
    }

    if (details.length) {
      this.overviewDetails = details.join(' ');
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
