const {
  ASSOCIATION_LOBBYISTS,
  ASSOCIATION_OFFICIALS,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
} = require('../../config/constants');

const AssociatedItem = require('./item');
const Person = require('../person/person');

class AssociatedPerson extends AssociatedItem {
  static associations = {
    [ROLE_LOBBYIST]: ASSOCIATION_LOBBYISTS,
    [ROLE_OFFICIAL]: ASSOCIATION_OFFICIALS
  };

  static roles = [
    ROLE_LOBBYIST,
    ROLE_OFFICIAL,
  ];

  static adaptRecord(record) {
    const person = new Person(record.person);

    return {
      ...record,
      person: person.adapted,
    };
  }

  static toRoleObject(role, attendees, labelPrefix) {
    const obj = this.toAssociationObject(Person.plural(), Person.singular());

    Object.entries(attendees).forEach(([key, values]) => {
      if (values?.records.length) {
        obj.values.push(this.toValuesObject(key, values, role, labelPrefix));
      }
    });

    return obj;
  }
}

module.exports = AssociatedPerson;
