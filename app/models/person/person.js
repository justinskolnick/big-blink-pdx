const IncidentedBase = require('../shared/base-incidented');
const Role = require('./role');

class Person extends IncidentedBase {
  static tableName = 'people';
  static labelPrefix = 'person';
  static linkKey = 'person';

  static perPage = 40;

  static fieldNames = {
    id:           { select: true, },
    identical_id: { select: true, adapt: false, }, // eslint-disable-line camelcase
    pernr:        { select: true, },
    type:         { select: true, },
    name:         { select: true, },
    family:       { select: false, },
  };

  adaptRoles(value) {
    if (value) {
      if (typeof value === 'string') {
        return {
          label: this.getLabel('associations_roles'),
          list: Role.getList(value),
        };
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        if ('list' in value) {
          return value.list;
        }
      }
    }

    return {
      list: [],
    };
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
