const {
  ASSOCIATION_ENTITIES,
  ROLE_ENTITY,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
  ROLE_SOURCE,
} = require('../../config/constants');

const AssociatedItem = require('./item');
const AssociatedEntityLobbyist = require('./entity-lobbyist');

class AssociatedEntity extends AssociatedItem {
  associations = {
    [ROLE_LOBBYIST]: ASSOCIATION_ENTITIES,
    [ROLE_OFFICIAL]: ASSOCIATION_ENTITIES,
    [ROLE_SOURCE]: ASSOCIATION_ENTITIES,
  };

  roles = [
    ROLE_ENTITY,
  ];

  adaptRecord(record) {
    const entity = new this.associatedModel(record.entity);
    const values = {
      ...record,
      entity: entity.adapted,
    };

    let lobbyist;

    if ('lobbyist' in record) {
      lobbyist = new AssociatedEntityLobbyist(record.lobbyist);
      lobbyist.setEntity(entity);

      values.lobbyist = lobbyist.adapted;
    }

    return values;
  }

  getRoleValues(role, items, labelPrefix) {
    const key = this.associatedModel.plural();
    const values = [];

    values.push(this.toValuesObject(key, items, role, labelPrefix));

    return values;
  }
}

module.exports = AssociatedEntity;
