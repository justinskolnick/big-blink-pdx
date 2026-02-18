const {
  ROLE_ENTITY,
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
  ROLE_SOURCE,
} = require('../../config/constants');

const Base = require('../shared/base');

class AssociatedItem extends Base {
  static associatingClass = null;

  static associations = {
    [ROLE_ENTITY]: null,
    [ROLE_LOBBYIST]: null,
    [ROLE_OFFICIAL]: null,
    [ROLE_SOURCE]: null,
  };

  static getAssociation(role) {
    return this.associations[role];
  }

  static getAssociationLabelKey(association) {
    return `associated_${association}`;
  }

  static getValueLabelKey(role, association) {
    return `as_${role}_${association}`;
  }

  static getValueLabel(role, key, labelPrefix) {
    const labelKey = this.getValueLabelKey(role, key);

    return this.labels.getLabel(labelKey, labelPrefix);
  }

  static adaptRecord(record) {
    return record;
  }

  static toAssociationObject(association, type) {
    const labelKey = this.getAssociationLabelKey(association);

    return {
      label: this.labels.getLabel(labelKey),
      model: association,
      options: this.roles,
      type,
      values: [],
    };
  }

  static toValuesObject(key, values, role, labelPrefix) {
    return {
      association: this.getAssociation(values.role),
      label: this.getValueLabel(role, key, labelPrefix),
      records: values.records.map(record => this.adaptRecord(record)),
      role: values.role,
      total: values.total,
    };
  }
}

module.exports = AssociatedItem;
