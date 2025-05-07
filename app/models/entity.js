const IncidentedObject = require('./incidented-object');

class Entity extends IncidentedObject {
  static tableName = 'entities';
  static linkKey = 'entity';

  static perPage = 40;

  static fieldNames = {
    id:     { select: true, },
    name:   { select: true, },
    domain: { select: true, },
  };
}

module.exports = Entity;
