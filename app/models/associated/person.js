const {
  ASSOCIATION_LOBBYISTS,
  ASSOCIATION_OFFICIALS,
  MODEL_PEOPLE,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
} = require('../../config/constants');

const AssociatedItem = require('./item');
const Person = require('../person/person');

class AssociatedPerson extends AssociatedItem {
  static modelType = MODEL_PEOPLE;
  static associationType = 'names'; // todo

  static associations = {
    [ROLE_LOBBYIST]: ASSOCIATION_LOBBYISTS,
    [ROLE_OFFICIAL]: ASSOCIATION_OFFICIALS
  };

  static adaptRecord(record) {
    const person = new Person(record.person);

    return {
      ...record,
      person: person.adapted,
    };
  }

  static toRoleObject(role, attendees) {
    const obj = this.toAssociationObject();

    Object.entries(attendees).forEach(([key, values]) => {
      if (values?.records.length) {
        obj.values.push(this.toValuesObject(key, values, role));
      }
    });

    return obj;
  }
}

module.exports = AssociatedPerson;
