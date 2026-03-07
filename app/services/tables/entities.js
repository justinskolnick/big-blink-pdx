const Table = require('../../lib/db/mysql/table');

class Entities extends Table {
  static perPage = 40;

  static fieldNames = {
    id:     { select: true, },
    name:   { select: true, },
    domain: { select: true, },
  };
}

module.exports = Entities;
