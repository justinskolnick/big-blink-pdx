const Base = require('./base');

class Entity extends Base {
  static tableName = 'entities';

  static perPage = 40;

  static fieldNames = {
    id:     { select: true, },
    name:   { select: true, },
    domain: { select: true, },
  };
}

module.exports = Entity;
