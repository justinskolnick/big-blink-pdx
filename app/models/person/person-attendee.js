const {
  ASSOCIATION_LOBBYISTS,
  ASSOCIATION_OFFICIALS,
  MODEL_PEOPLE,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
} = require('../../config/constants');

const Base = require('../shared/base');
const Person = require('./person');

const ROLE_ASSOCIATIONS = {
  [ROLE_LOBBYIST]: ASSOCIATION_LOBBYISTS,
  [ROLE_OFFICIAL]: ASSOCIATION_OFFICIALS,
};

const adaptItemPerson = item => {
  const person = new Person(item.person);

  item.person = person.adapted;

  return item;
};

class PersonAttendee extends Base {
  static getAssociationForRole(role) {
    return ROLE_ASSOCIATIONS[role];
  }

  // todo: set records role
  static toRoleObject(role, attendees) {
    const obj = {
      label: Person.getLabel('associated_names'),
      model: MODEL_PEOPLE,
      type: 'person',
      values: [],
    };

    Object.entries(attendees).forEach(([key, values]) => {
      if (values?.records.length) {
        obj.values.push({
          association: this.getAssociationForRole(values.role),
          label: Person.getLabel(`as_${role}_${key}`, Person.labelPrefix),
          records: values.records.map(adaptItemPerson),
          role: values.role,
          total: values.total,
        });
      }
    });

    return obj;
  }
}

module.exports = PersonAttendee;
