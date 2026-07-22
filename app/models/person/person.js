const pluralize = require('pluralize');

const {
  COLLECTION_ATTENDEES,
  COLLECTION_ENTITIES,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
} = require('../../config/constants');

const {
  toNumeral,
  toOrdinal,
} = require('../../lib/number');
const { capitalize } = require('../../lib/string');

const IncidentedBase = require('../shared/base-incidented');
const CityOfficeTerm = require('../city-office-term');

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

    let details = [];

    if (hasTerms) {
      details = CityOfficeTerm.collect(terms).map((term, i) => {
        let termKey;

        if (term.cityOffice.isElected()) {
          if (term.cityOffice.isCityCouncilor()) {
            if (term.isCurrent()) {
              termKey = 'overview_details_elected_council_current';
            } else {
              termKey = 'overview_details_elected_council_past';
            }
          } else if (term.cityOffice.isCityCommissioner()) {
            if (i > 0) {
              termKey = 'overview_details_elected_commission_prior';
            } else {
              termKey = 'overview_details_elected_commission';
            }
          } else if (term.isCurrent()) {
            termKey = 'overview_details_elected_position_current';
          } else if (term.wasReelected()) {
            termKey = 'overview_details_elected_position_reelected_past';
          } else {
            termKey = 'overview_details_elected_position_prior';
          }
        }

        if (termKey) {
          return this.getLabel(termKey, labelPrefix, {
            date_end: term.readableDateEnd, // eslint-disable-line camelcase
            date_start: term.readableDateStart, // eslint-disable-line camelcase
            duration: term.readableTenure,
            name: (i > 0) ? capitalize(this.getData('pronoun_subject')) : this.getData('given'),
            pronoun: this.getData('pronoun_subject'),
            district: term.cityOffice.getData('district'),
            office: term.cityOffice.office,
            ordinal: toOrdinal(term.termCount),
            election_year: term.electionHistory.at(0).year, // eslint-disable-line camelcase
            terms: `${toNumeral(term.termCount)} ${pluralize(this.getLabel('term'), term.termCount)}`,
          });
        }

        return null;
      });
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

  adaptLabels(result, adapted) {
    adapted.labels = {
      incidents: {
        title: this.getData('name'),
      },
      overview: {
        chart: this.getData('name'),
        title: this.getData('name'),
      },
    };

    return adapted;
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
