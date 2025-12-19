const {
  ASSOCIATION_ENTITIES,
  MODEL_ENTITIES,
} = require('../../config/constants');

const Base = require('../shared/base');
const Entity = require('../entity/entity');
const Person = require('./person');

const adaptItemEntity = item => {
  const entity = new Entity(item.entity);

  item.entity = entity.adapted;

  return item;
};

class PersonEntity extends Base {
  static getAssociation() {
    return ASSOCIATION_ENTITIES;
  }

  static toRoleObject(role, entities) {
    const obj = {
      label: Person.getLabel('associated_entities'),
      model: MODEL_ENTITIES,
      type: 'entity',
      values: [],
    };

    obj.values.push({
      association: this.getAssociation(),
      label: Person.getLabel(`as_${role}_entities`, Person.labelPrefix),
      records: entities.records.map(adaptItemEntity),
      role: entities.role,
      total: entities.total,
    });

    return obj;
  }
}

module.exports = PersonEntity;
