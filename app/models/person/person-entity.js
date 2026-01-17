const AssociatedEntity = require('../associated/entity');
const Person = require('./person');

class PersonEntity extends AssociatedEntity {
  static labelPrefix = Person.labelPrefix;
}

module.exports = PersonEntity;
