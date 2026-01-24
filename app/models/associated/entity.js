const {
  ASSOCIATION_ENTITIES,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
} = require('../../config/constants');

const Entity = require('../entity/entity');
const AssociatedItem = require('./item');

class AssociatedEntity extends AssociatedItem {
  static associatedClass = Entity;

  static associations = {
    [ROLE_LOBBYIST]: ASSOCIATION_ENTITIES,
    [ROLE_OFFICIAL]: ASSOCIATION_ENTITIES,
  };

  static adaptLobbyist(record) {
    const prefix = Entity.labelPrefix;
    const labels = this.labels;
    let statementKey;
    let titleKey;

    if (record.lobbyist.isRegistered) {
      statementKey = 'lobbyist_registration_statement';
      titleKey = 'lobbyist_registration_found';
    } else {
      statementKey = 'lobbyist_registration_not_found';
      titleKey = 'lobbyist_registration_not_found';
    }

    return {
      id: record.lobbyist.id,
      isRegistered: record.lobbyist.isRegistered,
      labels: {
        title: labels.getLabel(titleKey, prefix),
        statement: labels.getLabel(statementKey, prefix, {
          name: record.entity.name,
          range: record.lobbyist.range,
        }),
      },
    };
  }

  static adaptRecord(record) {
    const entity = new Entity(record.entity);
    let lobbyist;

    if ('lobbyist' in record) {
      lobbyist = this.adaptLobbyist(record);
    }

    return {
      ...record,
      entity: entity.adapted,
      lobbyist,
    };
  }

  static toRoleObject(role, entities) {
    const obj = this.toAssociationObject();
    const key = this.associatedClass.plural();

    obj.values.push(this.toValuesObject(key, entities, role));

    return obj;
  }
}

module.exports = AssociatedEntity;
