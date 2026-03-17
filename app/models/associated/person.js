const {
  ASSOCIATION_LOBBYISTS,
  ASSOCIATION_OFFICIALS,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
} = require('../../config/constants');

const AssociatedItem = require('./item');

class AssociatedPerson extends AssociatedItem {
  associations = {
    [ROLE_LOBBYIST]: ASSOCIATION_LOBBYISTS,
    [ROLE_OFFICIAL]: ASSOCIATION_OFFICIALS
  };

  roles = [
    ROLE_LOBBYIST,
    ROLE_OFFICIAL,
  ];

  adaptRecord(record) {
    const person = new this.associatedModel(record.person);

    return {
      ...record,
      person: person.adapted,
    };
  }

  getRoleValues(role, items, labelPrefix) {
    const values = [];

    Object.entries(items).forEach(([itemKey, itemValues]) => {
      if (itemValues?.records.length) {
        values.push(this.toValuesObject(itemKey, itemValues, role, labelPrefix));
      }
    });

    return values;
  }
}

module.exports = AssociatedPerson;
