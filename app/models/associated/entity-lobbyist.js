const { isEmpty } = require('../../lib/util');

const Entity = require('../entity/entity');
const AssociatedItem = require('./item');

class AssociatedEntityLobbyist extends AssociatedItem {
  static labelPrefix = Entity.labelPrefix;

  entity = null;

  setEntity(value) {
    this.entity = value;
  }

  getStatementLabelKey() {
    return (this.isRegistered)
      ? 'lobbyist_registration_statement'
      : 'lobbyist_registration_not_found';
  }

  getTitleLabelKey() {
    return (this.isRegistered)
      ? 'lobbyist_registration_found'
      : 'lobbyist_registration_not_found';
  }

  getStatementLabel() {
    const key = this.getStatementLabelKey();
    const prefix = this.constructor.labelPrefix;
    let entityName;

    if (this.hasEntity) {
      entityName = this.entity.getData('name');
    } else {
      entityName = this.getLabel('lobbyist_registration_this_entity', prefix);
    }

    return this.getLabel(key, prefix, {
      name: entityName,
      range: this.range,
    });
  }

  getTitleLabel() {
    const key = this.getTitleLabelKey();
    const prefix = this.constructor.labelPrefix;

    return this.getLabel(key, prefix);
  }

  adapt(result) {
    return {
      id: result.id,
      isRegistered: result.isRegistered,
      labels: {
        statement: this.getStatementLabel(),
        title: this.getTitleLabel(),
      },
    };
  }

  get hasEntity() {
    return !isEmpty(this.entity);
  }

  get isRegistered() {
    return this.getData('isRegistered');
  }

  get range() {
    return this.getData('range');
  }
}

module.exports = AssociatedEntityLobbyist;
