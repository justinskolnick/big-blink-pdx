const IncidentedBase = require('./shared/base-incidented');

class Entity extends IncidentedBase {
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
