const AssociatedEntity = require('../associated/entity');
const Source = require('./source');

class SourceEntity extends AssociatedEntity {
  static associatingClass = Source;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getValueLabelKey(role, association) {
    return 'entities';
  }
}

module.exports = SourceEntity;
