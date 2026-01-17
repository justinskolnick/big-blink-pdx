const {
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
} = require('../../config/constants');

const Base = require('../shared/base');

class AssociatedItem extends Base {
  static modelType = null;
  static associationType = null;
  static associatedWith = null;
  static labelPrefix = null;

  static associations = {
    [ROLE_LOBBYIST]: null,
    [ROLE_OFFICIAL]: null,
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

  static adaptRecord(record) {
    return record;
  }

  static toAssociationObject() {
    const labelKey = this.getAssociationLabelKey(this.associationType);

    return {
      label: this.labels.getLabel(labelKey),
      model: this.modelType,
      type: this.associatedWith,
      values: [],
    };
  }

  static toValuesObject(key, values, role) {
    const labelKey = this.getValueLabelKey(role, key);

    return {
      association: this.getAssociation(values.role),
      label: this.labels.getLabel(labelKey, this.labelPrefix),
      records: values.records.map(this.adaptRecord),
      role: values.role,
      total: values.total,
    };
  }
}

module.exports = AssociatedItem;
