const {
  ROLE_LOBBYIST,
  ROLE_OFFICIAL,
} = require('../../config/constants');

const Base = require('../shared/base');

class AssociatedItem extends Base {
  static associatedClass = null;
  static associatingClass = null;

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

  static getValueLabel(role, key) {
    const labelKey = this.getValueLabelKey(role, key);
    const labelPrefix = this.associatingClass.singular();

    return this.labels.getLabel(labelKey, labelPrefix);
  }

  static adaptRecord(record) {
    return record;
  }

  static toAssociationObject() {
    const labelKey = this.getAssociationLabelKey(this.associatedClass.plural());

    return {
      label: this.labels.getLabel(labelKey),
      model: this.associatedClass.plural(),
      type: this.associatedClass.singular(),
      values: [],
    };
  }

  static toValuesObject(key, values, role) {
    return {
      association: this.getAssociation(values.role),
      label: this.getValueLabel(role, key),
      records: values.records.map(record => this.adaptRecord(record)),
      role: values.role,
      total: values.total,
    };
  }
}

module.exports = AssociatedItem;
