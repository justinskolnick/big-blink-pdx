const { MODEL_ENTITIES } = require('../../config/constants');

const Base = require('../shared/base');
const Entity = require('../entity');
const Person = require('./person');

const adaptItemEntity = item => {
  const entity = new Entity(item.entity);

  item.entity = entity.adapted;

  return item;
};

class PersonEntity extends Base {
  // todo: factor out record by removing name from label
  static toRoleObject(role, entities, record) {
    const obj = {
      label: Person.getLabel('associated_entities'),
      model: MODEL_ENTITIES,
      type: 'entity',
      values: [],
    };

    obj.values.push({
      label: Person.getLabel(`as_${role}_entities`, Person.labelPrefix, { name: record.name }),
      records: entities.records.map(adaptItemEntity),
      role: entities.role,
      total: entities.total,
    });

    return obj;
  }
}

module.exports = PersonEntity;
