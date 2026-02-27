const {
  ASSOCIATION_ENTITIES,
  ROLE_ENTITY,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
  ROLE_SOURCE,
} = require('../../config/constants');

const Entity = require('../entity/entity');
const AssociatedItem = require('./item');
const AssociatedEntityLobbyist = require('./entity-lobbyist');

class AssociatedEntity extends AssociatedItem {
  static associations = {
    [ROLE_LOBBYIST]: ASSOCIATION_ENTITIES,
    [ROLE_OFFICIAL]: ASSOCIATION_ENTITIES,
    [ROLE_SOURCE]: ASSOCIATION_ENTITIES,
  };

  static roles = [
    ROLE_ENTITY,
  ];

  static adaptRecord(record) {
    const entity = new Entity(record.entity);
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

  static toRoleObject(role, entities, labelPrefix) {
    const obj = this.toAssociationObject(Entity.plural(), Entity.singular());
    const key = Entity.plural();

    obj.values.push(this.toValuesObject(key, entities, role, labelPrefix));

    return obj;
  }
}

module.exports = AssociatedEntity;
