const {
  ASSOCIATION_ENTITIES,
  MODEL_ENTITIES,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
} = require('../../config/constants');

const Entity = require('../entity/entity');
const AssociatedItem = require('./item');

class AssociatedEntity extends AssociatedItem {
  static modelType = MODEL_ENTITIES;
  static associationType = 'entities';
  static associatedWith = 'entity';

  static associations = {
    [ROLE_LOBBYIST]: ASSOCIATION_ENTITIES,
    [ROLE_OFFICIAL]: ASSOCIATION_ENTITIES,
  };

  static adaptRecord(record) {
    const entity = new Entity(record.entity);

    return {
      ...record,
      entity: entity.adapted,
    };
  }

  static toRoleObject(role, entities) {
    const obj = this.toAssociationObject();
    const key = this.associationType;

    obj.values.push(this.toValuesObject(key, entities, role));

    return obj;
  }
}

module.exports = AssociatedEntity;
