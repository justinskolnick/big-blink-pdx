const IncidentedBase = require('../shared/base-incidented');
const Role = require('../role');

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
    let list = [];
    let options = {};

    if (value) {
      list = Role.getList(value);
      options = Role.getOptions(value);
    }

    return {
      label: this.getLabel('associations_roles'),
      list,
      options,
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
