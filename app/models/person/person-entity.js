const AssociatedEntity = require('../associated/entity');
const Person = require('./person');

class PersonEntity extends AssociatedEntity {
  static childClass = Person;
}

module.exports = PersonEntity;
