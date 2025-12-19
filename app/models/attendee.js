const {
  ASSOCIATION_LOBBYISTS,
  ASSOCIATION_OFFICIALS,
  MODEL_PEOPLE,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
} = require('../config/constants');

const { Labels } = require('../helpers/labels');

const Base = require('./shared/base');
const Person = require('./person/person');

const ROLE_ASSOCIATIONS = {
  [ROLE_LOBBYIST]: ASSOCIATION_LOBBYISTS,
  [ROLE_OFFICIAL]: ASSOCIATION_OFFICIALS,
};

const labels = new Labels();

class Attendee extends Base {
  static labelPrefix = null;

  static getAssociationForRole(role) {
    return ROLE_ASSOCIATIONS[role];
  }

  static adaptRecord(record) {
    const person = new Person(record.person);

    return {
      ...record,
      person: person.adapted,
    };
  }

  static getValueLabelKey(role, association) {
    return `as_${role}_${association}`;
  }

  static toRoleObject(role, attendees) {
    const obj = {
      label: labels.getLabel('associated_names'),
      model: MODEL_PEOPLE,
      type: this.roleType,
      values: [],
    };

    Object.entries(attendees).forEach(([key, values]) => {
      if (values?.records.length) {
        obj.values.push({
          association: this.getAssociationForRole(values.role),
          label: labels.getLabel(this.getValueLabelKey(role, key), this.labelPrefix),
          records: values.records.map(this.adaptRecord),
          role: values.role,
          total: values.total,
        });
      }
    });

    return obj;
  }
}

module.exports = Attendee;
