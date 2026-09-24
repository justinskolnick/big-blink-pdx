const Table = require('../../lib/db/mysql/table');

class Entities extends Table {
  static fieldNames = {
    id:     { type: 'integer', },
    name:   { type: 'string', },
    type:   { type: 'string', },
    domain: { type: 'string', },
  };

  static defaultFields = [
    'id',
    'name',
    'type',
    'domain',
  ];
}

module.exports = Entities;
