const Table = require('../../lib/db/mysql/table');

class Entities extends Table {
  static fieldNames = {
    id:     { type: 'integer',  select: true, },
    name:   { type: 'string',   select: true, },
    type:   { type: 'string',   select: true, },
    domain: { type: 'string',   select: true, },
  };
}

module.exports = Entities;
