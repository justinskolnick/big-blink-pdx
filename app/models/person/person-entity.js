const AssociatedEntity = require('../associated/entity');
const Person = require('./person');

class PersonEntity extends AssociatedEntity {
  static associatingClass = Person;
}

module.exports = PersonEntity;
