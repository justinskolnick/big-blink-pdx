const {
  ASSOCIATION_ENTITIES,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
} = require('../../config/constants');

const Entity = require('../entity/entity');
const AssociatedItem = require('./item');
const AssociatedEntityLobbyist = require('./entity-lobbyist');

class AssociatedEntity extends AssociatedItem {
  static associatedClass = Entity;

  static associations = {
    [ROLE_LOBBYIST]: ASSOCIATION_ENTITIES,
    [ROLE_OFFICIAL]: ASSOCIATION_ENTITIES,
  };

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

  static toRoleObject(role, entities) {
    const obj = this.toAssociationObject();
    const key = this.associatedClass.plural();

    obj.values.push(this.toValuesObject(key, entities, role));

    return obj;
  }
}

module.exports = AssociatedEntity;
