const AssociatedEntity = require('../associated/entity');
const Source = require('./source');

class SourceEntity extends AssociatedEntity {
  static associatingClass = Source;
}

module.exports = SourceEntity;
